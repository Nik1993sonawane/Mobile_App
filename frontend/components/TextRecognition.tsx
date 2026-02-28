/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Alert, StatusBar } from 'react-native';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import { MaterialIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import * as Clipboard from 'expo-clipboard';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import styles from './VoiceRecognitionStyles';
import TextToVoice from '../components/TextToVoice';
import LanguageSelector, { LANGUAGES } from '../components/LanguageSelector';
import TextToSpeech from '../components/TextToSpeech';

export default function TextRecognition() {
  const [message, setMessage] = useState('');
  const [transcription, setTranscription] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [language, setLanguage] = useState('');
  const [translatedOnce, setTranslatedOnce] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [selectedAudioFormat, setSelectedAudioFormat] = useState('');
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [audioUri, setAudioUri] = useState('');
  const [showTextToVoice, setShowTextToVoice] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showPlaybackControls, setShowPlaybackControls] = useState(false);

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis);
      setIsPlaying(status.isPlaying);
    }
  };

  useEffect(() => {
    let mounted = true;
    if (audioUri) {
      (async () => {
        await Audio.setAudioModeAsync({ staysActiveInBackground: true });
        const { sound } = await Audio.Sound.createAsync(
          { uri: audioUri },
          { shouldPlay: false, volume },
          onPlaybackStatusUpdate
        );
        if (mounted) setSound(sound);
      })();
    }
    return () => {
      mounted = false;
      sound?.unloadAsync();
    };
  }, [audioUri]);

  useEffect(() => {
    if (sound) sound.setVolumeAsync(volume);
  }, [volume]);

  const togglePlay = async () => {
    if (!sound) return;
    isPlaying ? await sound.pauseAsync() : await sound.playAsync();
  };

  const togglePlayPause = togglePlay;

  const replayAudio = async () => {
    if (!sound) return;
    await sound.setPositionAsync(0);
    await sound.playAsync();
  };

  const handleSliderChange = async (value: number) => {
    if (sound) await sound.setPositionAsync(value);
  };

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  };

  const downloadAudio = async () => {
    if (!audioUri || !selectedAudioFormat) {
      setMessage('⚠️ Audio or Format Missing');
      return;
    }

    const fileName = `speech.${selectedAudioFormat}`;
    const filePath = FileSystem.cacheDirectory + fileName;

    try {
      // Save file to cache directory
      if (audioUri.startsWith('data:')) {
        const b64 = audioUri.split(',')[1];
        await FileSystem.writeAsStringAsync(filePath, b64, { encoding: FileSystem.EncodingType.Base64 });
      } else {
        await FileSystem.downloadAsync(audioUri, filePath);
      }

      // Let user pick where to save using share dialog
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath, {
          mimeType: `audio/${selectedAudioFormat}`,
          dialogTitle: 'Save or Share Audio',
          UTI: `public.audio`,
        });
        setMessage('✅ File Ready for Save or Share');
      } else {
        setMessage('❌ Share not Available on this Device');
      }
    } catch (error) {
      console.error('❌ Download Error:-', error);
      setMessage('❌ Failed to Share Audio');
    }
  };

  const shareAudio = async () => {
    if (!audioUri) return;
    const path = FileSystem.cacheDirectory + `Shared.${selectedAudioFormat}`;
    try {
      if (audioUri.startsWith('data:')) {
        const b64 = audioUri.split(',')[1];
        await FileSystem.writeAsStringAsync(path, b64, { encoding: FileSystem.EncodingType.Base64 });
      } else {
        await FileSystem.downloadAsync(audioUri, path);
      }
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(path);
      } else {
        Alert.alert('❌ Share not Available');
      }
    } catch {
      Alert.alert('❌ Error Share File');
    }
  };

  const updateTranscription = (newText: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newText);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setTranscription(newText);
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
    setSelectedAudioFormat('');
    setAudioUri('');
    setSelectedAgent('');
    setShowTextToVoice(false);
    setShowPlaybackControls(false);
    setIsPlaying(false);
    setSound(null);
    setVolume(1.0);
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
          <Text style={styles.icon}>📄</Text>
            <MaskedView
              maskElement={
                <Text style={[styles.title, { backgroundColor: 'transparent' }]}>
                  Text To Voice Conversion
                </Text>
              }
            >
            <LinearGradient
              colors={['#ffffff', '#e0ffe0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
            <Text style={[styles.title, { opacity: 0 }]}>
              Text To Voice Conversion
            </Text>
          </LinearGradient>
        </MaskedView>
       </View>
      </LinearGradient>

      <Text style={styles.status}>{message}</Text>
      {loading && <ActivityIndicator size="large" color="#007AFF" />}

      <Text style={styles.texttranscriptionTitle}>📝 Transcribed Text:-</Text>

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
        <Text style={styles.agentTitle}>🎧 Select Audio Format:-</Text>
      <View style={styles.textdropdownWrapper}>
      <Picker
          selectedValue={selectedAudioFormat}
          onValueChange={(itemValue: string) => setSelectedAudioFormat(itemValue)}
          style={styles.textPicker}
          dropdownIconColor="#333"
          mode="dropdown"
        >
          <Picker.Item label="------- Select Format -------" value="" />
            <Picker.Item label="MP3 (.mp3)" value="mp3" />
            <Picker.Item label="WAV (.wav)" value="wav" />
            <Picker.Item label="AAC (.aac)" value="aac" />
            <Picker.Item label="M4A (.m4a)" value="m4a" />
            <Picker.Item label="OGG (.ogg)" value="ogg" />
            <Picker.Item label="FLAC (.flac)" value="flac" />
        </Picker>
      </View>

        <LinearGradient
          colors={['#0000FF', '#1E90FF', '#0000CD', '#6495ED', '#0000FF']}
          start={{ x: 0, y: 0 }} 
          end={{ x: 1, y: 1 }}
          style={styles.formatWrapper}>
        <TouchableOpacity
          onPress={() => {
            if (!transcription.trim()) return setMessage('⚠️ Nothing to Convert');
            if (!selectedAudioFormat) return setMessage('⚠️ Please Select Audio Format');
            setShowTextToVoice(true);
            setShowPlaybackControls(true);
          }}
          style={styles.textformatWrapper}>
            <Text style={styles.buttonText}>📤 Convert Text To Voice</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {showPlaybackControls && (
      <View style={styles.textaudiodropdownWrapper}>
        <Text style={styles.agentTitle}>🎵 Play Convert Audio Format:-</Text>
      {/* Audio Playback Row */}
      <View style={styles.audioFormat}>
        <View style={[styles.sliderContainer, { flexDirection: 'row', alignItems: 'center', marginLeft: 15 }]}>
      {/* Play/Pause Button with Gradient */}
      <LinearGradient
        colors={['#800000', '#8B0000', '#A52A2A', '#B22222', '#CD5C5C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.playpauseButton}>

        <TouchableOpacity onPress={togglePlayPause}>
        <MaterialIcons name={isPlaying ? 'pause' : 'play-arrow'} size={28} color="#fff" />

        {loading && <ActivityIndicator size="large" color="#007AFF" />}

        {showTextToVoice && (
          <TextToSpeech text={transcription} language={language} audioFormat={selectedAudioFormat} setMessage={setMessage} setAudioUri={setAudioUri} />
        )}
        </TouchableOpacity>
      </LinearGradient>

      <Text style={styles.timeText}>{formatTime(position)}</Text>

      <Slider
        style={styles.volumeSliderchange}
        value={position}
        minimumValue={0}
        maximumValue={duration}
        onSlidingComplete={handleSliderChange}
        minimumTrackTintColor="#800000"
        maximumTrackTintColor="#000"
        thumbTintColor="#800000"
      />
      </View>
    </View>

    {showVolumeSlider && (
      <View style={styles.textvolumeSlider}>
        <Text style={[styles.timeText, { marginBottom: 5 }]}>
           🔊 Volume:- {Math.round(volume * 100)}%
        </Text>
        <Slider
          style={styles.volumeSlider}
          value={volume * 100}
          minimumValue={0}
          maximumValue={100}
          onValueChange={(v) => setVolume(v / 100)}
          minimumTrackTintColor="#800000"
          maximumTrackTintColor="#000"
          thumbTintColor="#800000"
        />
      </View>
      )}

      {/* Icon Row Below */}
      <View style={styles.textIcon}>
      {[
      { onPress: () => setShowVolumeSlider(!showVolumeSlider), icon: 'volume-up', lib: MaterialIcons, size: 30 },
      { onPress: replayAudio, icon: 'replay', lib: MaterialIcons, size: 30 },
      { onPress: downloadAudio, icon: 'download', lib: Feather, size: 30 },
      { onPress: shareAudio, icon: 'cloud-upload-alt', lib: FontAwesome5, size: 25 },
      ].map(({ onPress, icon, lib: Icon, size }, index) => (
      <LinearGradient
        key={index}
        colors={['#800000', '#8B0000', '#A52A2A', '#B22222', '#CD5C5C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.texiconLinear}>
        <TouchableOpacity onPress={onPress} style={{ alignItems: 'center' }}>
          <Icon name={icon} size={size} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>
      ))}
      </View>
    </View>
    )}

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
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.textagentLinear}>
          <TouchableOpacity onPress={handleSend} style={styles.textSend}>
            <Text style={styles.buttonText}>➡️ Send Text To Voice</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </ScrollView>
  );
}
