/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

interface Props {
  uri: string;
}

export default function AudioPlayer({ uri }: Props) {
  const [playing, setPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const loadSound = async () => {
    const { sound } = await Audio.Sound.createAsync({ uri });
    setSound(sound);
  };

  useEffect(() => {
    loadSound();
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, [uri]);

  const togglePlayback = async () => {
    if (!sound) return;
    if (playing) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
    setPlaying(!playing);
  };

  return (
    <View style={styles.controls}>
      <TouchableOpacity onPress={togglePlayback} style={styles.button}>
        <Text style={styles.buttonText}>{playing ? '⏸ Pause' : '▶️ Play'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  controls: {
    marginTop: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 18,
    color: '#333',
  },
});
