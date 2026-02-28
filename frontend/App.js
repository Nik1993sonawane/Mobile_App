import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Tabs from './app/(tabs)/index.tsx' // Adjusted to match your folder: frontend/app/tabs/index.tsx

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeTabs" component={Tabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
