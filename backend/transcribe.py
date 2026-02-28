import sys
import os
import wave
import contextlib
import speech_recognition as sr  # type: ignore

def get_wav_duration(path):
    try:
        with contextlib.closing(wave.open(path, 'r')) as f:
            frames = f.getnframes()
            rate = f.getframerate()
            duration = frames / float(rate)
            return round(duration, 2)
    except:
        return 0

def transcribe_audio(audio_file):
    recognizer = sr.Recognizer()

    duration = get_wav_duration(audio_file)
    print(f"🔍 Audio Duration:- {duration} Seconds")

    if duration < 1.0:
        print("⚠️ Audio too Short for Transcription.")
        return

    try:
        with sr.AudioFile(audio_file) as source:
            audio_data = recognizer.record(source)
            text = recognizer.recognize_google(audio_data)
            print(f"📝 Transcription:- {text}")
    except sr.UnknownValueError:
        print("❌ Could not Understand Audio")
    except sr.RequestError as e:
        print(f"🌐 Google Speech Recognition API error:- {e}")
    except Exception as e:
        print(f"🔥 Error Processing Audio:- {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("📥 Usage: python transcribe.py <audio_wav_file>")
        sys.exit(1)

    audio_path = sys.argv[1]

    if not os.path.exists(audio_path):
        print("❌ ERROR:- Audio File does not Exist")
        sys.exit(1)

    if not audio_path.lower().endswith(".wav"):
        print("❌ ERROR:- Only WAV Files are Supported")
        sys.exit(1)

    transcribe_audio(audio_path)
