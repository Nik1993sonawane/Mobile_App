import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './VoiceRecognitionStyles';
import { LANGUAGES } from '../components/LanguageSelector';

type TextToVoiceProps = {
  text: string;
  language?: string;
  translatedOnce?: boolean;
  setMessage: (msg: string) => void;
};

const TextToVoice: React.FC<TextToVoiceProps> = ({
  text,
  language = 'en',
  translatedOnce = false,
  setMessage,
}) => {
  const handleSpeak = () => {
    if (text.trim()) {
      Speech.speak(text, { language });

      const selectedLanguageLabel =
        LANGUAGES.find(([label, code]) => code === language)?.[0] || language;

      if (translatedOnce) {
        setMessage(`✅ Spoken in ${selectedLanguageLabel} Language`);
      } else {
        setMessage(`✅ Spoken Text`);
      }
    } else {
      setMessage('⚠️ Nothing to Speak');
    }
  };

  return (
    <LinearGradient
      colors={['#8A2BE2', '#BA55D3', '#9932CC', '#9370DB', '#4B0082']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.pillButton}
    >
      <TouchableOpacity
        onPress={handleSpeak}
      >
        <Text style={styles.pillText}>🔈 Speak</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default TextToVoice;
