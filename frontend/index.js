import { AppRegistry } from 'react-native';
import App from './App'; // Ensure App.js is in root
import { name as appName } from './app.json';

// Register the root component
AppRegistry.registerComponent(appName, () => App);
