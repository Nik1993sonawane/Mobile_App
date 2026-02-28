import React from 'react';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { COUNTRIES } from './CountryData'; 
import styles from './VoiceRecognitionStyles';

type Props = {
  selectedCountry: string;
  onCountryChange: (code: string) => void;
};

export const CountrySelector: React.FC<Props> = ({ selectedCountry, onCountryChange }) => {
  return (
    <View style={styles.countryContainer}>
     <Text style={styles.countryTitle}>🌍 Select Country:-</Text>
       <View style={styles.dropdownWrapper}>
        <Picker
          selectedValue={selectedCountry}
          onValueChange={(value) => onCountryChange(value)}
          style={styles.picker}
          dropdownIconColor="#333"
          mode="dropdown"
        >
        <Picker.Item label="----- Choose Country -----" value="" />
        {COUNTRIES.map((country) => (
          <Picker.Item
            key={country.code}
            label={`${country.flag} ${country.name}`}
            value={country.code}
          />
        ))}
        </Picker>
      </View>
    </View>
  );
};
