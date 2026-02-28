import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text } from 'react-native';

// Screens
import VoiceRecognition from '../../components/VoiceRecognition';
import TextRecognition from '../../components/TextRecognition';
import TextNewsRecognition from '../../components/TextNewsRecognition'; // Make sure this path is valid

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#cccccc',
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '600',
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={['#228B22', '#006400', '#32CD32', '#6B8E23', '#228B22']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        ),
        tabBarIcon: ({ color, size, focused }) => {
          const iconSize = focused ? size + 4 : size;
          if (route.name === 'VoiceToText') {
            return <MaterialIcons name="keyboard-voice" size={iconSize} color={color} />;
          } else if (route.name === 'TextToVoice') {
            return <FontAwesome5 name="comment-alt" size={iconSize} color={color} />;
          } else if (route.name === 'NewsToVoice') {
            return <Ionicons name="newspaper-outline" size={iconSize} color={color} />;
          }
          return null;
        },
        tabBarLabel: ({ focused, color }) => {
          let label = '';
          if (route.name === 'VoiceToText') label = 'Voice To Text';
          else if (route.name === 'TextToVoice') label = 'Text To Voice';
          else if (route.name === 'NewsToVoice') label = 'News To Voice';

          return (
            <Text style={{ color, fontWeight: focused ? 'bold' : '600' }}>
              {label}
            </Text>
          );
        },
      })}
    >
      <Tab.Screen name="VoiceToText" component={VoiceRecognition} />
      <Tab.Screen name="TextToVoice" component={TextRecognition} />
      <Tab.Screen name="NewsToVoice" component={TextNewsRecognition} />
    </Tab.Navigator>
  );
}
