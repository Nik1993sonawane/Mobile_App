import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    paddingBottom: 20,
    backgroundColor: '#f4f5f7',
  },

  header: {
    height: 50,
    paddingHorizontal: 35,
    elevation: 5,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 10,
    color: '#222',
  },

  status: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 10,
  },

  Newsstatus: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 20,
  },

  iconWrapper: {
    flexDirection: 'row',
    gap: 20,
  },
  
  icon: {
    fontSize: 26,
    marginRight: -10,
    marginTop: 7,
  },

  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginTop: 10,
    elevation: 3,
    marginLeft: 15,
  },

  buttonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },

  transcriptionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: -25,
    marginTop: 20,
  },

  agentTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 5,
    marginTop: 20,
    textAlign: 'center',
  },

  dropdownWrapper: {
    borderWidth: 1,
    borderColor: '#696969',
    borderRadius: 4,
    backgroundColor: '#fff',
    width: 300,
    height: 50,
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
  },

  voicedropdownWrapper: {
    width: 330, 
    borderColor: '#696969', 
    borderWidth: 1, 
    borderRadius: 10, 
    alignSelf: 'center', 
    marginTop: 20,
  },

  textaudiodropdownWrapper: {
    width: 330, 
    borderColor: '#696969', 
    borderWidth: 1, 
    borderRadius: 10, 
    alignSelf: 'center', 
    marginTop: 20, 
    padding: 10,
  },

  audioFormat: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
  },

  textvolumeSlider: {
    marginTop: 20, 
    width: '100%', 
    alignItems: 'center',
  },

  textIcon: {
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginTop: 15,
  },

  textSend: {
    width: '100%', 
    height: '100%', 
    justifyContent: 'center', 
    alignItems: 'center',
  },

  textagentLinear: {
    width: 300,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 15,
    marginTop: 10,
  },

  texiconLinear: {
    borderRadius: 10,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 45,
    height: 45,
  },

  picker: {
    height: 60,
    width: '100%',
    color: '#333',
  },

  speakButton: {
    marginVertical: 10,
    marginBottom: -5,
    borderRadius: 5,
    overflow: 'hidden',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  languageContainer: {
    marginTop: 20,
    marginBottom: 10,
  },

  countryContainer: {
    marginTop: 20,
    marginBottom: 10,
  },

  categoryContainer: {
    marginBottom: 10,
  },

  languageTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 5,
    textAlign: 'center',
    color: '#333',
  },

  countryTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 5,
    textAlign: 'center',
    color: '#333',
  },

  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 5,
    marginTop: 20,
    textAlign: 'center',
    color: '#333',
  },

  wrapper: {
    paddingHorizontal: 12,
  },

  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#696969',
    borderRadius: 4,
    backgroundColor: '#fff',
    width: 300,
    height: 50,
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
  },

  emptyText: {
    textAlign: 'center', 
    padding: 20, 
    fontSize: 16,
  },

  modalHeaderText: {
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#fff',
  },

  audioPicker: {
    width: 300, 
    borderColor: '#696969', 
    borderWidth: 1, 
    borderRadius: 10, 
    alignSelf: 'center', 
    marginTop: 20,
  },

  convertButton: {
    width: 265, 
    height: 50, 
    borderRadius: 8, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginLeft: 15, 
    marginBottom: 15,
  },

  playbackContainer: {
    width: 330, 
    borderColor: '#696969', 
    borderWidth: 1, 
    borderRadius: 10, 
    alignSelf: 'center', 
    marginTop: 20, 
    padding: 10,
  },

  sliderContainer: {
    width: 280, 
    borderColor: '#696969', 
    borderWidth: 1, 
    borderRadius: 10, 
    alignSelf: 'center', 
    marginTop: 20, 
    padding: 10,
  },

  volumeContainer: {
    marginTop: 20, 
    width: '100%', 
    alignItems: 'center', 
  },

  volumeSlider: {
    width: 300,
  },

  volumeSliderchange: {
    flex: 1, 
    marginHorizontal: 10,
  },

  playpauseButton: {
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  formatWrapper: {
    width: 300,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
    marginBottom: 15,
  },

  textformatWrapper: {
    width: '100%', 
    height: '100%', 
    justifyContent: 'center', 
    alignItems: 'center',
  },

  voiceSend: {
    width: 300,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 15,
    marginTop: 10,
  },

  controlsRow: {
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginTop: 15,
  },

  controlButton: {
    padding: 9,
    borderRadius: 8,
    backgroundColor: '#800000',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },

  controlButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f8fa',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 25,
    paddingVertical: 10,
    marginTop: 50,
    borderWidth: 1,
    borderColor: '#696969',
  },

  iconGroup: {
    flexDirection: 'row',
    gap: 10,
    marginRight: 10,
    margin: -10,
  },

  roundIcon: {
    width: 35,
    height: 35,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#696969',
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconText: {
    fontSize: 17,
    marginBottom: 10,
    fontWeight: '600',
    color: '#fff',
  },

  pillGroup: {
    flexDirection: 'row',
    gap: 10,
  },

  pillButton: {
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#ccc',
  },

  pillText: {
    fontSize: 14,
    color: '#fff',
  },

  inputContainer: {
    paddingHorizontal: 12,
    paddingBottom: 20,
    flexGrow: 1,
  },

  textAreaWrapper: {
    width: 329,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#696969',
    overflow: 'hidden',
  },

  textInput: {
    fontSize: 15,
    minHeight: 200,
    textAlignVertical: 'top',
    padding: 12,
    backgroundColor: '#fff',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f4f5f7',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderWidth: 1,
    borderColor: '#696969',
  },

  charCount: {
    color: '#444',
    fontSize: 13,
    marginTop: 5,
  },

  actions: {
    flexDirection: 'row',
    gap: 10,
  },

  Newsactions: {
    flexDirection: 'row',
    marginLeft: 190,
    marginTop: 10,
  },

  linkText: {
    color: '#007bff',
    fontSize: 13,
  },

  clearButton: {
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 18,
    marginLeft: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },

  clearText: {
    color: '#fff',
    fontSize: 14,
  },

  textdropdownWrapper: {
    borderWidth: 1,
    borderColor: '#696969',
    borderRadius: 4,
    backgroundColor: '#fff',
    width: 280,
    height: 50,
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
  },

  textPicker: {
    height: 60,
    width: '100%',
    color: '#333',
  },

  texttranscriptionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: -25,
    marginTop: 20,   
  },
  
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E90FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
  },

  timeText: {
    fontSize: 14,
    color: '#000',
    marginHorizontal: 4,
    fontWeight: '500',
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginTop: 20,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },

  safeArea: {
    flex: 1,
    backgroundColor: '#f5fff5',
  },

  headlineTitle: {
    marginTop: 30,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  newsItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 2,
  },

  newsSource: {
    marginTop: 10,
    fontSize: 12,
    fontStyle: 'italic',
    color: '#007BFF',
  },
  listContent: {
    paddingBottom: 60,
  },

  dropdownContainer: {
    width: 330,
    borderColor: '#696969',
    borderWidth: 1,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
  },

  newsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 10,
    marginHorizontal: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  newsImage: {
    width: '100%',
    height: 180,
  },

  newsContent: {
    padding: 10,
  },

  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  newsDescription: {
    fontSize: 14,
    color: '#555',
    marginVertical: 6,
  },

  newsMeta: {
    fontSize: 12,
    color: '#999',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingTop: 50,
    paddingBottom: 50,
    paddingLeft: 20,
    paddingRight: 20,
  },

  modalContainer: {
    backgroundColor: '#fff',
    padding: 16,
    maxHeight: '100%',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  modalImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },

  modalMeta: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
  },

  modalContent: {
    fontSize: 14,
    color: '#444',
  },

  modalHeader: {
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
  },

  modalCloseIconWrapper: {
    width: 20,
    height: 20,
    borderRadius: 16,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    bottom: 20,
    marginLeft: '50%',
  },

  modalCloseIcon: {
    fontSize: 10,
    color: '#006400',
  },

  modalContentWrapper: {
    paddingBottom: 20,
  },

  modalCloseText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  modalScrollView: {
    maxHeight: '100%',
    marginBottom: 10,
  },

  readMoreButton: {
    backgroundColor: '#228B22',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 15,
    alignSelf: 'center',
  },

  readMoreText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
