// LanguageSelector.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from './VoiceRecognitionStyles';

interface Props {
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
}

// ✅ Exported LANGUAGES array
export const LANGUAGES: [string, string][] = [
  ['Afrikaans', 'af'], ['Amharic', 'am'], ['Arabic', 'ar'], ['Assamese', 'as'],
  ['Aymara', 'ay'], ['Azerbaijani', 'az'], ['Bambara', 'bm'], ['Bangla', 'bn'],
  ['Basque', 'eu'], ['Belarusian', 'be'], ['Bhojpuri', 'bho'], ['Bosnian', 'bs'],
  ['Bulgarian', 'bg'], ['Catalan', 'ca'], ['Chinese (Simplified)', 'zh'],
  ['Chinese (Traditional)', 'zh-TW'], ['Croatian', 'hr'], ['Czech', 'cs'],
  ['Danish', 'da'], ['Dutch', 'nl'], ['English', 'en'], ['Esperanto', 'eo'],
  ['Estonian', 'et'], ['Ewe', 'ee'], ['Filipino', 'fil'], ['Finnish', 'fi'],
  ['French', 'fr'], ['Galician', 'gl'], ['Georgian', 'ka'], ['German', 'de'],
  ['Greek', 'el'], ['Gujarati', 'gu'], ['Haitian Creole', 'ht'], ['Hausa', 'ha'],
  ['Hawaiian', 'haw'], ['Hebrew', 'he'], ['Hindi', 'hi'], ['Hungarian', 'hu'],
  ['Icelandic', 'is'], ['Igbo', 'ig'], ['Iloko', 'ilo'], ['Indonesian', 'id'],
  ['Irish', 'ga'], ['Italian', 'it'], ['Japanese', 'ja'], ['Javanese', 'jv'],
  ['Kannada', 'kn'], ['Kazakh', 'kk'], ['Khmer', 'km'], ['Kinyarwanda', 'rw'],
  ['Korean', 'ko'], ['Kurdish', 'ku'], ['Kyrgyz', 'ky'], ['Lao', 'lo'],
  ['Latvian', 'lv'], ['Lingala', 'ln'], ['Lithuanian', 'lt'], ['Luxembourgish', 'lb'],
  ['Macedonian', 'mk'], ['Maithili', 'mai'], ['Malagasy', 'mg'], ['Malay', 'ms'],
  ['Malayalam', 'ml'], ['Maltese', 'mt'], ['Marathi', 'mr'], ['Mongolian', 'mn'],
  ['Nepali', 'ne'], ['Norwegian', 'no'], ['Nyanja', 'ny'], ['Odia', 'or'],
  ['Pashto', 'ps'], ['Persian', 'fa'], ['Polish', 'pl'], ['Portuguese', 'pt'],
  ['Punjabi', 'pa'], ['Quechua', 'qu'], ['Romanian', 'ro'], ['Russian', 'ru'],
  ['Samoan', 'sm'], ['Sanskrit', 'sa'], ['Scottish Gaelic', 'gd'], ['Serbian', 'sr'],
  ['Sindhi', 'sd'], ['Sinhala', 'si'], ['Slovak', 'sk'], ['Slovenian', 'sl'],
  ['Somali', 'so'], ['Spanish', 'es'], ['Sundanese', 'su'], ['Swahili', 'sw'],
  ['Swedish', 'sv'], ['Tajik', 'tg'], ['Tamil', 'ta'], ['Tatar', 'tt'],
  ['Telugu', 'te'], ['Thai', 'th'], ['Turkish', 'tr'], ['Turkmen', 'tk'],
  ['Ukrainian', 'uk'], ['Urdu', 'ur'], ['Uyghur', 'ug'], ['Uzbek', 'uz'],
  ['Vietnamese', 'vi'], ['Welsh', 'cy'], ['Xhosa', 'xh'], ['Yiddish', 'yi'],
  ['Yoruba', 'yo'], ['Zulu', 'zu']
];

const LanguageSelector: React.FC<Props> = ({ selectedLanguage, onLanguageChange }) => (
  <View style={styles.languageContainer}>
   <Text style={styles.languageTitle}>🌐 Select Language:-</Text>
    <View style={styles.dropdownWrapper}>
      <Picker
        selectedValue={selectedLanguage}
        onValueChange={onLanguageChange}
        style={styles.picker}
        dropdownIconColor="#333"
        mode="dropdown"
      >
      <Picker.Item label="----- Choose Language -----" value="" />
        {LANGUAGES.map(([label, value]) => (
          <Picker.Item key={value} label={label} value={value} />
        ))}
      </Picker>
    </View>
  </View>
);

export default LanguageSelector;