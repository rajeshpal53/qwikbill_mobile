import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Modal } from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// import {
//   ExpoSpeechRecognitionModule,
//   useSpeechRecognitionEvent,
// } from "expo-speech-recognition";
const OpenmiqModal = ({ modalVisible, setModalVisible, transcript }) => {
  const handleClose = () => {
    ExpoSpeechRecognitionModule.stop(); // Stop speech recognition
    setModalVisible(false); // Close the modal
  };

  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={modalVisible}
      onDismiss={handleClose}
      contentContainerStyle={styles.containerStyle}
    >
      <TouchableOpacity
        style={styles.modalBackground} // Make the background clickable
        activeOpacity={1} // Prevent clicks on the background from closing the modal
        onPress={handleClose} // Close the modal when clicking outside
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Speak Now</Text>
          <MaterialIcons
            name="mic"
            size={40}
            color="black"
            style={styles.icon}
          />
          <Text style={styles.transcriptText}>{transcript}</Text>
          {/* <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity> */}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    // flex: 1,
    justifyContent: "flex-start", // Align the modal at the top of the screen
    alignItems: "center", // Center horizontally
    // backgroundColor: "rgba(0, 0, 0, 0.5)", // Background opacity to show overlay
  },
  modalContent: {
    backgroundColor: "white",
    width: "90%", // Reduced to 90% of the screen width for some padding
    padding: 20,
    borderRadius: 10, // Optional rounded corners
    borderWidth: 2,
    marginTop: 20, // Add some space from the top
    alignItems: "center", // Centers content horizontally
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  icon: {
    marginBottom: 8, // Adds space between the icon and the text
  },
  transcriptText: {
    fontSize: 22,
    color: "black",
    textAlign: "center",
  },
  closeButton: {
    borderWidth: 2,
    paddingVertical: 8,
    marginVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#fcb534",
  },
  closeButtonText: {
    fontSize: 15,
    color: "black",
    textAlign: "center",
  },
});

export default OpenmiqModal;
