const express = require('express');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const { exec } = require('child_process');
const fs = require('fs');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const translate = require('@vitalets/google-translate-api');
const supportedLanguages = require('@vitalets/google-translate-api/languages');

const app = express();
const PORT = 7101;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

const DEFAULT_AGENT = 'AGENT_X';
const DEFAULT_COLUMN = 'COLUMN_Y';

// ✅ FFmpeg Path Setup
ffmpeg.setFfmpegPath(ffmpegPath);

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// ✅ MySQL Connection
const db = mysql.createConnection({
  host: '88.150.227.117',
  user: 'nrktrn_web_admin',
  password: 'GOeg&*$*657',
  port: 3306,
  database: 'nrkindex_trn',
});

db.connect(err => {
  if (err) {
    console.error('❌ MySQL Connection Error:-', err);
    process.exit(1);
  }
  console.log('✅ Connected to MySQL Server Database');
});

// ✅ Ensure Folders Exist
const uploadDir = path.join(__dirname, 'uploads');
const outputDir = path.join(__dirname, 'output');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

// ✅ Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `audio-${timestamp}${ext}`);
  },
});
const upload = multer({ storage });

// ✅ Utility: Convert to WAV
function convertToWav(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .toFormat('wav')
      .on('error', reject)
      .on('end', () => resolve(outputPath))
      .save(outputPath);
  });
}

// ✅ Utility: Insert Transcription to MySQL
function insertTranscriptionToDB(text, translatedText, agent, column, audioFilename, res) {
  const query = `
    INSERT INTO AIA_VOICETOTEXTDATA 
    (USERID, FIRMID, TEXT_DATA, TRANSLATED_TEXT, TARGET_AGENT, TARGET_COLUMN, AUDIO_FILENAME)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [1254, 5, text, translatedText, agent, column, audioFilename];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('❌ DB Insert Error:-', err);
      return res.status(500).json({ error: '❌ Database Insert Failed' });
    }

    console.log('✅ Insert into Database ID:-', result.insertId);
    res.json({
      insertId: result.insertId,
      transcription: text,
      translatedText,
      wav_file_saved: audioFilename,
    });
  });
}

// ✅ POST /upload – Audio Upload, Transcription, Translation
app.post('/upload', upload.single('audio'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: '❌ No Audio File Upload' });

  const originalPath = req.file.path;
  const wavPath = originalPath.replace(path.extname(originalPath), '.wav');
  const wavFileName = path.basename(wavPath);
  const lang = req.body.language || 'en';

  try {
    // Step 1: Convert
    await convertToWav(originalPath, wavPath);
    console.log('✅ Converted to WAV:-', wavFileName);

    // Step 2: Transcribe
    exec(`python transcribe.py "${wavPath}"`, async (err, stdout, stderr) => {
      fs.unlinkSync(originalPath); // remove .m4a

      if (err) {
        console.error('❌ Transcription Error:-', err.message);
        return res.status(500).json({ error: '❌ Transcription Failed' });
      }

      const transcription = stdout.trim();
      if (!transcription || transcription.includes('ERROR')) {
        return res.status(400).json({ error: '❌ No Transcription Found' });
      }

      console.log('📝 Transcription:', transcription);

      // Step 3: Translate (if needed)
      let translatedText = transcription;
      if (lang !== 'en') {
        try {
          const result = await translate(transcription, { to: lang });
          translatedText = result.text;
          console.log('🌐 Translate:-', translatedText);
        } catch (translateError) {
          console.error('❌ Translation Error:-', translateError);
          return res.status(500).json({ error: '❌ Translation Failed' });
        }
      }

      // Step 4: Save to DB
      insertTranscriptionToDB(transcription, translatedText, DEFAULT_AGENT, DEFAULT_COLUMN, wavFileName, res);
    });
  } catch (err) {
    fs.unlinkSync(originalPath);
    console.error('❌ Conversion Error:-', err);
    res.status(500).json({ error: '❌ Audio Conversion Failed' });
  }
});

// ✅ POST /insert – Manually Insert Text
app.post('/insert', (req, res) => {
  const { text_data, target_agent, target_column } = req.body;

  if (!text_data || !target_agent) {
    return res.status(400).json({ error: '❌ Missing text_data Or target_agent' });
  }

  insertTranscriptionToDB(text_data, '', target_agent, target_column || DEFAULT_COLUMN, '', res);
});

// ✅ POST /api/speak – Text to Speech using agent.py
app.post('/api/speak', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).send('❌ Missing text');

  const filename = `voice_${Date.now()}.mp3`;
  const outputPath = path.join(outputDir, filename);

  exec(`python agent.py "${text}" "${outputPath}"`, (err) => {
    if (err) {
      console.error('❌ TTS Error:-', err.message);
      return res.status(500).send('❌ Error Generating Audio');
    }

    res.sendFile(outputPath, () => {
      fs.unlink(outputPath, () => {}); // delete after sending
    });
  });
});

// ✅ POST /translate – Manual Translation
app.post('/translate', async (req, res) => {
  const { text, targetLang } = req.body;

  if (!text || !targetLang) {
    return res.status(400).json({ error: '❌ Missing Text or TargetLang in request body' });
  }

  const langCode = targetLang.toLowerCase();

  // ✅ Check if language code is supported
  if (!supportedLanguages[langCode]) {
    return res.status(400).json({
      error: `Language '${langCode}' is not Supported`,
    });
  }

  try {
    const result = await translate(text, { to: langCode });
    return res.status(200).json({ translatedText: result.text });
  } catch (error) {
    console.error('❌ Translate Error:-', error);
    return res.status(500).json({ error: '❌ Translation Failed. Please try Again' });
  }
});

// ✅ POST /api/speak – News to Speech using news.py
app.post('/api/speak', (req, res) => {
  const { text, language = 'en', format = 'mp3' } = req.body;
  if (!text) return res.status(400).send('❌ Missing text');

  const filename = `voice_${Date.now()}.${format}`;
  const outputPath = path.join(outputDir, filename);

  exec(`python news.py --text "${text}" --language "${language}" --output_path "${outputPath}"`, (err) => {
    if (err) {
      console.error('❌ TTS Error:-', err.message);
      return res.status(500).send('❌ Error Generating Audio');
    }

    res.sendFile(outputPath, () => {
      fs.unlink(outputPath, () => {}); // delete after sending
    });
  });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
