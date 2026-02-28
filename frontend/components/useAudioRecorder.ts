import { useState } from 'react';
import { Audio } from 'expo-av';

type AudioRecorderHook = {
  recording: Audio.Recording | null;
  recordedUri: string | null;
  setRecordedUri: (uri: string | null) => void;
  startRecording: (onStatusUpdate?: (msg: string) => void) => Promise<void>;
  stopRecording: (onStatusUpdate?: (msg: string) => void) => Promise<string | null>;
  playRecording: (onStatusUpdate?: (msg: string) => void) => Promise<void>;
};

export default function useAudioRecorder(): AudioRecorderHook {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);

  const startRecording = async (onStatusUpdate?: (msg: string) => void) => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        onStatusUpdate?.('❌ Permission Denied');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      onStatusUpdate?.('🟢 Start Recording...');
    } catch (err) {
      console.error('❌ Error While Start Recording:-', err);
      onStatusUpdate?.('❌ Recording Failed');
    }
  };

  const stopRecording = async (onStatusUpdate?: (msg: string) => void): Promise<string | null> => {
    try {
      if (!recording) return null;
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setRecordedUri(uri);
      onStatusUpdate?.('🔴 Stop Recording');
      return uri;
    } catch (err) {
      console.error('Error While Stop Recording:-', err);
      onStatusUpdate?.('❌ Failed to Stop Recording');
      return null;
    }
  };

  const playRecording = async (onStatusUpdate?: (msg: string) => void) => {
    try {
      if (!recordedUri) return;
      const { sound } = await Audio.Sound.createAsync({ uri: recordedUri });
      onStatusUpdate?.('▶️ Play Audio...');
      await sound.playAsync();
    } catch (err) {
      console.error('❌ Error Play Recording:-', err);
      onStatusUpdate?.('❌ Failed to Play');
    }
  };

  return {
    recording,
    recordedUri,
    setRecordedUri,
    startRecording,
    stopRecording,
    playRecording,
  };
}
