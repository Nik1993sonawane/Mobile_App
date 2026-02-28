/* eslint-disable react-hooks/exhaustive-deps */
// components/NewsToSpeech.tsx
import React, { useEffect } from 'react';

interface NewsToSpeechProps {
  text: string;
  language: string;
  audioFormat: string;
  setMessage: (msg: string) => void;
  setAudioUri: (uri: string) => void;
}

const NewsToSpeech: React.FC<NewsToSpeechProps> = ({
  text,
  language,
  audioFormat,
  setMessage,
  setAudioUri,
}) => {
  useEffect(() => {
    const convert = async () => {
      try {
        setMessage('🔄 Converting to Audio...');
        const response = await fetch('http://myblocks.in:7101/api/speak', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, language, format: audioFormat }),
        });

        if (!response.ok) {
          throw new Error('❌ Conversion Failed');
        }

        // Convert binary response to blob and then to local URI
        const blob = await response.blob();
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64data = reader.result as string;
          const audioUri = `data:audio/${audioFormat};base64,${base64data.split(',')[1]}`;
          setAudioUri(audioUri);
          setMessage('✅ Audio Generated');
        };

        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('❌ TTS Error:-', error);
        setMessage('❌ Failed to Convert Text to Speech');
      }
    };

    if (text && language && audioFormat) {
      convert();
    }
  }, [text, language, audioFormat]);

  return null;
};

export default NewsToSpeech;
