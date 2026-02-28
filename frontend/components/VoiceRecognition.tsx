/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, StatusBar } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import * as Clipboard from 'expo-clipboard';
import styles from './VoiceRecognitionStyles';
import useAudioRecorder from './useAudioRecorder';
import { uploadAudio } from './uploadAudio';
import TextToVoice from '../components/TextToVoice';
import LanguageSelector, { LANGUAGES } from '../components/LanguageSelector';

export default function VoiceRecognition() {
  const [message, setMessage] = useState('');
  const [transcription, setTranscription] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [language, setLanguage] = useState('');
  const [translatedOnce, setTranslatedOnce] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const scrollRef = useRef<ScrollView>(null);

  const {
    recording,
    recordedUri,
    setRecordedUri,
    startRecording,
    stopRecording,
    playRecording,
  } = useAudioRecorder();

  const handleStart = () => startRecording(setMessage);

  const updateTranscription = (newText: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newText);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setTranscription(newText);
  };

  const handleStop = async () => {
    const uri = await stopRecording(setMessage);
    if (uri) {
      setLoading(true);
      setMessage('📤 Uploading Audio...');
      try {
        const result = await uploadAudio(uri, language);
        const text = result.translatedText || result.transcription || result.transcript;
        const filename = result.wav_file_saved || 'Unknown.wav';
        const combinedText = transcription ? `${transcription} ${text}` : text;
        updateTranscription(combinedText);
        setMessage(text ? `✅ Transcription Complete! Saved as ${filename}` : '❌ No Transcription Found');
        setTranslatedOnce(!!result.translatedText);
      } catch (err) {
        console.error(err);
        setMessage('❌ Upload Error');
      }
      setLoading(false);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setTranscription(history[newIndex]);
      setHistoryIndex(newIndex);
    } else {
      setMessage('⚠️ Nothing to Undo');
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setTranscription(history[newIndex]);
      setHistoryIndex(newIndex);
    } else {
      setMessage('⚠️ Nothing to Redo');
    }
  };

  const handleClear = () => {
    updateTranscription('');
    setMessage('');
    setLanguage('');
    setSelectedAgent('');
    setTranslatedOnce(false);
    setHistory([]);
    setHistoryIndex(-1);
    setLoading(false);
    setRecordedUri(null);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleSend = async () => {
    if (!transcription.trim()) return setMessage('⚠️ Please Transcribe Something First');
    if (!selectedAgent) return setMessage('⚠️ Please Select a Target Agent');

    try {
      setMessage('📤 Sending to Client Agent...');
      const response = await fetch('http://myblocks.in:7101/insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userid: 1254,
          firmid: 5,
          text_data: transcription,
          target_agent: selectedAgent,
          target_column: 'COLUMN_Y',
        }),
      });
      const result = await response.json();
      setMessage(response.ok ? `✅ Data Insert (ID:- ${result.insertId})` : `❌ Insert Failed:- ${result.error || 'Unknown Error'}`);
    } catch (error) {
      console.error('❌ Send Error:-', error);
      setMessage('❌ Network Error');
    }
  };

  const getLanguageLabel = (code: string): string =>
    LANGUAGES.find(([label, langCode]) => langCode === code)?.[0] || code;

  useEffect(() => {
  const autoTranslate = async () => {
    if (!transcription || !language) return;
    // Reset once for new target language
    if (translatedOnce) return;
      const langLabel = getLanguageLabel(language);
      setMessage(`🌐 Translating to ${langLabel} Language...`);
    try {
      const response = await fetch('http://myblocks.in:7101/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: transcription, targetLang: language }),
      });
      const data = await response.json();

      if (data.translatedText) {
        updateTranscription(data.translatedText);
        setTranslatedOnce(true);
        setMessage('✅ Translation Complete');
      } else if (data.error) {
        setMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      console.error('❌ Translation Error:-', err);
      setMessage('❌ Translation Failed');
    }
  };

  autoTranslate();
}, [language]);


  return (
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#006400" />
          <LinearGradient
            colors={['#228B22', '#006400', '#32CD32', '#6B8E23', '#228B22']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
          <View style={styles.iconWrapper}>
            <Text style={styles.icon}>🎙️</Text>
              <MaskedView
                maskElement={
                  <Text style={[styles.title, { backgroundColor: 'transparent' }]}>
                    Voice To Text Conversion
                  </Text>
                }
              >
              <LinearGradient
                colors={['#ffffff', '#e0ffe0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
              <Text style={[styles.title, { opacity: 0 }]}>
                Voice To Text Conversion
              </Text>
            </LinearGradient>
          </MaskedView>
        </View>
      </LinearGradient>

      <View style={styles.voicedropdownWrapper }>
        <Text style={styles.agentTitle}>🔊 Record Your Voice:-</Text>
        <Text style={styles.status}>{message}</Text>
        {loading && <ActivityIndicator size="large" color="#007AFF" />}

      <TouchableOpacity onPress={recording ? handleStop : handleStart}>
        <LinearGradient
          colors={recording ? ['#B22222', '#FF0000', '#FF4500', '#FF0000', '#DC143C'] : ['#228B22', '#32CD32', '#006400', '#6B8E23', '#228B22']}
          start={{ x: 0, y: 0 }} 
          end={{ x: 1, y: 1 }}
          style={[styles.button, { width: 300, height: 50, marginTop: 10 }]}
        >
          <Text style={styles.buttonText}>{recording ? '🔴 Stop Recording' : '🟢 Start Recording'}</Text>
        </LinearGradient>
      </TouchableOpacity>

      {recordedUri && (
        <LinearGradient
          colors={['#0000FF', '#1E90FF', '#0000Cd', '#4682B4', '#0000FF']}
          start={{ x: 0, y: 0 }} 
          end={{ x: 1, y: 1 }}
          style={[styles.button, { width: 300, height: 50, marginTop: 10, marginBottom: 20 }]}
        >
          <TouchableOpacity onPress={() => playRecording(setMessage)}>
            <Text style={styles.buttonText}>▶️ Play Recording</Text>
          </TouchableOpacity>
        </LinearGradient>
        )}
      </View>

      <Text style={styles.transcriptionTitle}>📝 Transcribed Text:-</Text>

      <View style={styles.wrapper}>
        <View style={styles.actionBar}>
          <View style={styles.iconGroup}>
            <LinearGradient colors={['#FF0000', '#FF6347', '#FF4500']} style={styles.roundIcon}>
              <TouchableOpacity onPress={handleUndo}>
                <Text style={styles.iconText}>↶</Text>
              </TouchableOpacity>
            </LinearGradient>
            <LinearGradient colors={['#0000FF', '#1E90FF', '#4169E1']} style={styles.roundIcon}>
              <TouchableOpacity onPress={handleRedo}>
                <Text style={styles.iconText}>↷</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
          <View style={styles.pillGroup}>
            <TouchableOpacity onPress={() => {
              if (transcription.trim()) TextToVoice({ text: transcription, language, translatedOnce, setMessage });
              else setMessage('⚠️ Nothing to Speak');
            }}>
              <TextToVoice text={transcription} language={language} translatedOnce={translatedOnce} setMessage={setMessage} />
            </TouchableOpacity>
            <LinearGradient
            colors={['#FF4500', '#FF8C00', '#FF7F50', '#FF8C00', '#FF4500']} 
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.pillButton}>
              <TouchableOpacity onPress={() => {
                if (transcription.trim()) Clipboard.setStringAsync(transcription).then(() => setMessage('✅ Copied to Clipboard'));
                else setMessage('⚠️ Nothing to Copy');
              }}>
                <Text style={styles.pillText}>📋 Copy</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </View>

      <View style={styles.textAreaWrapper}>
        <TextInput
          style={styles.textInput}
          multiline
          placeholder="Transcribed or Translated Text will Appear Here..."
          value={transcription}
          onChangeText={updateTranscription}
          textAlignVertical="top"
          maxLength={5000}
        />
      </View>

      <View style={[styles.footer, { width: 330, alignSelf: 'center' }]}>
        <Text style={styles.charCount}>{transcription.length}/5000 Characters used</Text>
        <View style={styles.actions}>
          <LinearGradient 
            colors={['#B22222', '#DC143C', '#FF4C4C', '#E34234', '#C71585']} 
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.clearButton}>
            <TouchableOpacity onPress={handleClear}>
              <Text style={styles.clearText}>🗑️ Clear</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>

      <View style={styles.voicedropdownWrapper}>
        <LanguageSelector selectedLanguage={language} onLanguageChange={(lang) => {
          setLanguage(lang);
          setTranslatedOnce(false);
        }}
      />
      </View>

      <View style={styles.voicedropdownWrapper}>
        <Text style={styles.agentTitle}>🎯 Select Target Agent:-</Text>
        <View style={styles.dropdownWrapper}>
          <Picker
            selectedValue={selectedAgent}
            onValueChange={(itemValue: string) => setSelectedAgent(itemValue)}
            style={styles.picker}
            dropdownIconColor="#333"
            mode="dropdown"
          >
            <Picker.Item label="------- Select Agent -------" value="" />
            <Picker.Item label="Agent A" value="Agent A" />
            <Picker.Item label="Agent B" value="Agent B" />
            <Picker.Item label="Agent C" value="Agent C" />
          </Picker>
        </View>

        <LinearGradient
          colors={['#FF00FF', '#DA70D6', '#C71585', '#FF69B4', '#FF00FF']}
          start={{ x: 0, y: 0 }} 
          end={{ x: 1, y: 1 }}
          style={styles.voiceSend}>
          <TouchableOpacity onPress={handleSend} style={styles.textSend}>
            <Text style={styles.buttonText}>➡️ Send Voice To Text</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </ScrollView>
  );
}