// FileUploader.js

import React, { useContext, useState } from 'react';
import { View, Button, Text, StyleSheet, Modal } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

const FileUploadModal = ({ visible, onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  // Function to pick a file
  const pickFile = async () => {
    console.log("file selectiong")
    try {
      const result = await DocumentPicker.getDocumentAsync({});
      console.log("result is , ", result)
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0]; // Access the first (and possibly only) file
        setSelectedFile(file);
        console.log('File selected:', file);
      } else {
        console.log('File selection was canceled');
      }
    } catch (error) {
      console.log('Error picking file:', error);
    }
  };

  // Function to handle the upload
  const uploadFile = async() => {

      onUpload(selectedFile);
      
      onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Button title="Pick a file" onPress={pickFile} />
          {selectedFile && <Text style={styles.fileName}>{selectedFile.name}</Text>}
          <Button title="Upload File" onPress={uploadFile} disabled={!selectedFile} />
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    // backgroundColor:"orange",
    gap:10
  },
  fileName: {
    marginTop: 10,
    marginBottom: 10,
  },
});

export default FileUploadModal;
