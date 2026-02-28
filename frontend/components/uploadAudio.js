import axios from 'axios';

export const uploadAudio = async (uri, language) => {
  try {
    const formData = new FormData();
    formData.append('audio', {
      uri,
      name: 'audio.m4a',
      type: 'audio/m4a',
    });
    formData.append('language', language);

    console.log('📦 FormData Prepared, Starting Upload...');

    const response = await axios.post(
      'https://myblocks.in:7101/react-native/voice/upload',
      formData,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        timeout: 15000,
      }
    );

    console.log('✅ Upload Successfully');
    console.log('📨 Response:-', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Upload Error:-', error);
    throw error;
  }
};
