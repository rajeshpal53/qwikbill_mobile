import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import CategoryDropDown from "../../UI/DropDown/CategoryDropdown";
import { readApi } from "../../Util/UtilApi";

const FileUploadModal = ({ visible, onUpload, setBulkUploadModalVisible }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [SelectedCat, setSelectedCat] = useState("");
  // Function to pick a file
  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Only XLSX
      });

      console.log("Result:", result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];

        // Validate XLSX file extension
        if (file.name.endsWith(".xlsx")) {
          setSelectedFile(file);

          console.log("File selected:", file);
        } else {
          console.log("Invalid file type. Please select an XLSX file.");
          alert("Invalid file type. Please select an XLSX file.");
        }
      } else {
        console.log("File selection was canceled");
      }
    } catch (error) {
      console.log("Error picking file:", error);
    }
  };

  // Function to handle the upload
  const uploadFile = () => {
    if (!selectedFile || !SelectedCat) {
      alert("Please select a category and a file before uploading.");
      return;
    }
    const formData = new FormData();
    formData.append("excelFile", {
      uri: selectedFile.uri,
      name: selectedFile.name,
      type:
        selectedFile.mimeType ||
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    formData.append("category", SelectedCat);

    console.log("DATA OF EXCEL SHEET ", formData)
    try {
      const url = `qapi/products/bulkCreateProducts`;
      const response = readApi(url, fileData);
      console.log("Responce data is ", response);
    } catch (error) {
      console.log("Unable to fetch Data", error);
    }
  };

  // // Function to handle the upload
  // const uploadFile = () => {
  //   if (selectedFile && SelectedCat) {
  //     const fileData = {
  //       file: selectedFile,
  //       category: SelectedCat,
  //     };
  //     onUpload(fileData);
  //     setBulkUploadModalVisible(false);
  //   } else {
  //     alert("Please select a category and a file before uploading.");
  //   }
  // };

  const handleCloseModal = () => {
    onClose();
    setBulkUploadModalVisible(false);
  };
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Dropdown for category selection */}
          <View style={styles.dropdownContainer}>
            <CategoryDropDown setSelectedCat={setSelectedCat} />
          </View>

          {/* Button to pick a file */}
          <TouchableOpacity style={styles.button} onPress={pickFile}>
            <Text style={styles.buttonText}>Pick a File</Text>
          </TouchableOpacity>

          {/* Display selected file name */}
          {selectedFile && (
            <Text style={styles.fileName}>{selectedFile.name}</Text>
          )}

          {/* Upload button (disabled if no file is selected) */}
          <TouchableOpacity
            style={[styles.button, !selectedFile && styles.disabledButton]}
            onPress={uploadFile}
            disabled={!selectedFile}
          >
            <Text style={styles.buttonText}>Upload File</Text>
          </TouchableOpacity>

          {/* Close button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCloseModal}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    gap: 10,
  },
  dropdownContainer: {
    width: "100%",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  disabledButton: {
    backgroundColor: "gray",
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  fileName: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default FileUploadModal;
