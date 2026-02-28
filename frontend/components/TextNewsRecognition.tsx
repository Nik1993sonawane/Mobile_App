/* eslint-disable no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/display-name */
import React, { useState, useEffect, memo } from 'react';
import {
  View,
  Text,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  FlatList,
  Image,
  Modal,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { CountrySelector } from '../components/CountrySelector';
import { COUNTRIES } from '../components/CountryData';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import NewsToSpeech from '../components/NewsToSpeech';
import styles from './VoiceRecognitionStyles';

const API_KEY = 'pub_3dbc54cfc96e4798a6b8f99e7f252ef0';

const CATEGORIES = [
  'All',
  'Business',
  'Entertainment',
  'Environment',
  'Food',
  'Health',
  'Politics',
  'Science',
  'Sports',
  'Technology',
  'Top',
  'Tourism',
  'World',
];

const NewsItem = memo(({ item, onPress }: { item: any; onPress: () => void }) => (
  <TouchableOpacity style={styles.newsCard} onPress={onPress}>
    <Image
      source={{
        uri: item.image_url || 'https://via.placeholder.com/300x150.png?text=No+Image',
      }}
      style={styles.newsImage}
    />
    <View style={styles.newsContent}>
      <Text style={styles.newsTitle}>{item.title || 'No Title'}</Text>
      <Text style={styles.newsDescription} numberOfLines={3}>
        {item.description || 'No Description'}
      </Text>
      <Text style={styles.newsMeta}>
        📢 {item.source_id?.toUpperCase() || 'Unknown'} | 🕒{' '}
        {new Date(item.pubDate).toLocaleString()}
      </Text>
    </View>
  </TouchableOpacity>
));

export default function TextNewsRecognition() {
  const [country, setCountry] = useState('');
  const [category, setCategory] = useState('');
  const [newsArticles, setNewsArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  const [selectedAudioFormat, setSelectedAudioFormat] = useState('');
  const [showNewsToVoice, setShowNewsToVoice] = useState(false);
  const [showPlaybackControls, setShowPlaybackControls] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [audioUri, setAudioUri] = useState('');

  const countryObj = COUNTRIES.find((c) => c.code === country);
  const flag = countryObj?.flag || '';
  const countryName = countryObj?.name || '';

  const fetchNews = async () => {
    if (!country || !category) return;
    setLoading(true);
    setMessage('🔍 Fetching Latest News...');
    try {
      const { data } = await axios.get('https://newsdata.io/api/1/latest', {
        params: {
          apikey: API_KEY,
          country: country.toLowerCase(),
          language: 'en',
          ...(category !== 'All' ? { category: category.toLowerCase() } : {}),
        },
      });
      const articles = data?.results || [];
      setNewsArticles(articles);
      setMessage(
        articles.length > 0
          ? `✅ News for ${countryName}${category !== 'All' ? ` - ${category}` : ''}`
          : '❌ No News Found for Selected Filters'
      );
    } catch (err: any) {
      console.error('Fetch Error:-', err.message);
      setNewsArticles([]);
      setMessage(
        err.response?.status === 429
          ? '❌ Too many requests – please try again later'
          : '❌ Failed to Fetch News'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (country && category) fetchNews();
    }, 1000);
    return () => clearTimeout(timeout);
  }, [country, category]);

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

  const togglePlayPause = async () => {
    if (!sound) return;
    isPlaying ? await sound.pauseAsync() : await sound.playAsync();
  };

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
    if (!audioUri || !selectedAudioFormat) return setMessage('⚠️ Audio or Format Missing');

    const fileName = `speech.${selectedAudioFormat}`;
    const filePath = FileSystem.cacheDirectory + fileName;

    try {
      if (audioUri.startsWith('data:')) {
        await FileSystem.writeAsStringAsync(filePath, audioUri.split(',')[1], {
          encoding: FileSystem.EncodingType.Base64,
        });
      } else {
        await FileSystem.downloadAsync(audioUri, filePath);
      }

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath, {
          mimeType: `audio/${selectedAudioFormat}`,
          dialogTitle: 'Save or Share Audio',
          UTI: 'public.audio',
        });
        setMessage('✅ File Ready for Save or Share');
      } else setMessage('❌ Share not Available on this Device');
    } catch (err) {
      console.error('Download Error:-', err);
      setMessage('❌ Failed to Share Audio');
    }
  };

  const shareAudio = async () => {
    if (!audioUri || !selectedAudioFormat) return;
    const path = FileSystem.cacheDirectory + `Shared.${selectedAudioFormat}`;

    try {
      if (audioUri.startsWith('data:')) {
        await FileSystem.writeAsStringAsync(path, audioUri.split(',')[1], {
          encoding: FileSystem.EncodingType.Base64,
        });
      } else {
        await FileSystem.downloadAsync(audioUri, path);
      }

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(path);
      } else Alert.alert('❌ Share not Available');
    } catch {
      Alert.alert('❌ Error Sharing File');
    }
  };

  const handleClear = () => {
    setCountry('');
    setCategory('');
    setNewsArticles([]);
    setLoading(false);
    setMessage('');
    setModalVisible(false);
    setSelectedArticle(null);
    setSelectedAudioFormat('');
    setShowNewsToVoice(false);
    setShowPlaybackControls(false);
    setVolume(1);
    setShowVolumeSlider(false);
    setSound(null);
    setIsPlaying(false);
    setDuration(0);
    setPosition(0);
    setAudioUri('');
  };

  const renderHeader = () => (
    <View>
      <StatusBar barStyle="light-content" backgroundColor="#006400" />
      <LinearGradient
        colors={['#228B22', '#006400', '#32CD32', '#6B8E23', '#228B22']}
        style={styles.header}
      >
        <View style={styles.iconWrapper}>
          <Text style={styles.icon}>🗞️</Text>
          <MaskedView
            maskElement={<Text style={[styles.title, { backgroundColor: 'transparent' }]}>News To Voice Conversion</Text>}
          >
            <LinearGradient colors={['#fff', '#e0ffe0']}>
              <Text style={[styles.title, { opacity: 0 }]}>News To Voice Conversion</Text>
            </LinearGradient>
          </MaskedView>
        </View>
      </LinearGradient>

      <Text style={styles.Newsstatus}>{country ? `🌍 Country: ${flag} ${countryName}` : '🌍 Please Select a Country'}</Text>
      <Text style={styles.status}>{category ? `📚 Category: ${category}` : '📚 Please Select a News Category'}</Text>

      <View style={styles.Newsactions}>
        <LinearGradient
          colors={['#B22222', '#DC143C', '#FF4C4C', '#E34234', '#C71585']}
          style={styles.clearButton}
        >
          <TouchableOpacity onPress={handleClear}>
            <Text style={styles.clearText}>🗑️ Clear</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <View style={styles.dropdownContainer}>
        <CountrySelector
          selectedCountry={country}
          onCountryChange={(val: string) => {
            setCountry(val);
            setCategory('');
            setNewsArticles([]);
            setMessage('');
          }}
        />
      </View>

      {country && (
        <View style={styles.dropdownContainer}>
          <Text style={styles.categoryTitle}>📚 Select News Category:-</Text>
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={category} onValueChange={setCategory}>
              <Picker.Item label="----- Choose Category -----" value="" />
              {CATEGORIES.map((c) => (
                <Picker.Item key={c} label={c} value={c} />
              ))}
            </Picker>
          </View>
        </View>
      )}

      {message ? <Text style={styles.status}>{message}</Text> : null}
      <Text style={styles.sectionTitle}>📰 Latest News</Text>
      {loading && <ActivityIndicator size="large" color="#006400" />}
    </View>
  );

  return (
    <>
      <FlatList
        data={newsArticles}
        keyExtractor={(_, idx) => idx.toString()}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <NewsItem item={item} onPress={() => { setModalVisible(true); setSelectedArticle(item); }} />
        )}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListEmptyComponent={!loading && message ? <Text style={styles.emptyText}>{message}</Text> : null}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <LinearGradient colors={['#228B22', '#006400']} style={styles.modalHeader}>
            <Text style={styles.modalHeaderText}>Read News Article</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseIconWrapper}>
              <Text style={styles.modalCloseIcon}>❌</Text>
            </TouchableOpacity>
          </LinearGradient>
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.modalContentWrapper}>
              <Text style={styles.modalTitle}>{selectedArticle?.title || 'No Title'}</Text>
              <Image
                source={{ uri: selectedArticle?.image_url || 'https://via.placeholder.com/300' }}
                style={styles.modalImage}
              />
              <Text style={styles.modalMeta}>
                📢 {selectedArticle?.source_id?.toUpperCase() || 'Unknown'} | 🕒{' '}
                {new Date(selectedArticle?.pubDate).toLocaleString()}
              </Text>
              <Text style={styles.modalContent}>{selectedArticle?.description || 'No Description'}</Text>
              {selectedArticle?.link && (
                <TouchableOpacity style={styles.readMoreButton} onPress={() => Linking.openURL(selectedArticle.link)}>
                  <Text style={styles.readMoreText}>🔗 Read Full Article</Text>
                </TouchableOpacity>
              )}

              <View style={styles.audioPicker}>
                <Text style={styles.agentTitle}>🎧 Select Audio Format</Text>
                  <View style={styles.textdropdownWrapper}>
                    <Picker selectedValue={selectedAudioFormat}
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
                
                <LinearGradient colors={['#0000FF', '#1E90FF', '#0000CD']} style={styles.convertButton}>
                  <TouchableOpacity
                    onPress={() => {
                      if (!selectedArticle?.description?.trim()) {
                        setMessage('⚠️ Nothing to Convert');
                        return;
                      }
                      if (!selectedAudioFormat) {
                        setMessage('⚠️ Please Select Audio Format');
                        return;
                      }
                      setShowNewsToVoice(true);
                    }}
                  >
                    <Text style={styles.buttonText}>📤 Convert News To Voice</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>

              {showNewsToVoice && selectedArticle && (
                <NewsToSpeech
                  text={selectedArticle.description}
                  audioFormat={selectedAudioFormat}
                  language="en"
                  setMessage={(msg) => {
                    setMessage(msg);
                    if (msg.includes('✅ Audio Generated')) setShowPlaybackControls(true);
                  }}
                  setAudioUri={setAudioUri}
                />
              )}

              {showPlaybackControls && (
                <View style={styles.playbackContainer}>
                  <Text style={styles.agentTitle}>🎵 Play Convert Audio Format:-</Text>
                  <View style={[styles.sliderContainer, { flexDirection: 'row', alignItems: 'center' }]}>
                    {/* Play/Pause Button with Gradient */}
                    <LinearGradient
                      colors={['#800000', '#8B0000', '#A52A2A', '#B22222', '#CD5C5C']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.playpauseButton}>
                    
                      <TouchableOpacity onPress={togglePlayPause}>
                        <MaterialIcons name={isPlaying ? 'pause' : 'play-arrow'} size={28} color="#fff" />
                    
                        {loading && <ActivityIndicator size="large" color="#007AFF" />}                         
                      </TouchableOpacity>
                    </LinearGradient>
                    <Text style={styles.timeText}>{formatTime(position)}</Text>
                    <Slider
                      style={styles.slider}
                      value={position}
                      minimumValue={0}
                      maximumValue={duration}
                      onSlidingComplete={handleSliderChange}
                      minimumTrackTintColor="#800000"
                      maximumTrackTintColor="#000"
                      thumbTintColor="#800000"
                    />
                  </View>

                  {showVolumeSlider && (
                    <View style={styles.volumeContainer}>
                      <Text style={styles.timeText}>🔊 Volume: {Math.round(volume * 100)}%</Text>
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

                  <View style={styles.controlsRow}>
                    <TouchableOpacity onPress={() => setShowVolumeSlider(!showVolumeSlider)} style={styles.controlButton}>
                      <MaterialIcons name="volume-up" size={30} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={replayAudio} style={styles.controlButton}>
                      <MaterialIcons name="replay" size={30} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={downloadAudio} style={styles.controlButton}>
                      <Feather name="download" size={30} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={shareAudio} style={styles.controlButton}>
                      <FontAwesome5 name="cloud-upload-alt" size={25} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
