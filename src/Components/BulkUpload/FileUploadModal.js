import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import CategoryDropDown from "../../UI/DropDown/CategoryDropdown";
import { createApi, fontSize } from "../../Util/UtilApi";
import Icon from "react-native-vector-icons/Ionicons";

const FileUploadModal = ({ visible, setBulkUploadModalVisible }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [SelectedCat, setSelectedCat] = useState("");
  console.log("Selected Cat is ", SelectedCat);

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });


      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];

        // Validate XLSX file extension (further check for files that might bypass the type)
        if (file.name.endsWith(".xlsx")) {
          setSelectedFile(file);
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

  const uploadFile = async () => {
    if (!selectedFile || !SelectedCat) {
      alert("Please select a category and a file before uploading.");
      return;
    }

    const categoryId = parseInt(SelectedCat, 10);


    const formData = new FormData();
    formData.append("excelFile", {
      uri: selectedFile.uri,
      name: selectedFile.name,
      type:
        selectedFile.mimeType ||
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

    });
    formData.append("productcategoryfk", 6);

    console.log("DATA OF EXCEL SHEET ", formData);

    try {
      const url = `qapi/products/bulkCreateProducts`;
      const response = await createApi(url, formData);
      console.log("Responce data is ", response);
      if (response.error) {
        alert(response.error);
      } else {
        alert("File uploaded successfully!");
      }
    } catch (error) {
      console.log("Unable to fetch Data", error);
      alert("Error uploading the file. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setBulkUploadModalVisible(false);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Category</Text>
          <View style={styles.InnermodalContent}>
            <View style={styles.dropdownContainer}>
              <CategoryDropDown setSelectedCat={setSelectedCat} />
            </View>

            <TouchableOpacity style={styles.button} onPress={pickFile}>
              <View style={styles.iconTextContainer}>
                <Icon name="folder-outline" size={20} color="#fff" />
                <Text style={styles.buttonText}>Pick a File</Text>
              </View>
            </TouchableOpacity>

            <Text style={styles.fileName}>
              {selectedFile?.name || "No file selected"}
            </Text>

            <TouchableOpacity
              style={[
                styles.uploadButton,
                (!selectedFile || !SelectedCat) && styles.disabledButton,
              ]}
              onPress={uploadFile}
              disabled={!selectedFile || !SelectedCat}
            >
              <Text style={styles.buttonText}>Upload File</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
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
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 15,
    // alignItems: "center",
    elevation: 5,
  },
  InnermodalContent: {
    // width: "90%",
    paddingVertical: 2,
    paddingHorizontal: 10,
    // alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    alignSelf: "flex-start",
    fontFamily: "Poppins-Regular",
    fontSize: fontSize.labelMedium,
  },
  dropdownContainer: {
    width: "100%",
    // marginBottom: 10,
  },
  iconTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#3B82F6",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: "center",
    // justifyContent: "center",
    // width: "80%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "Poppins-Regular",
    fontSize: fontSize.labelLarge,
    marginLeft: 8,
  },
  fileName: {
    fontSize: 14,
    color: "#333",
    marginBottom: 15,
    fontStyle: "italic",
    fontFamily: "Poppins-Regular",
    fontSize: fontSize.labelMedium,
  },
  uploadButton: {
    backgroundColor: "#10B981",
    paddingVertical: 10,
    // paddingHorizontal: 25,
    borderRadius: 8,
    // marginVertical: 10,
    alignItems: "center",
    // justifyContent: "center",
    // width: "80%",
  },
  disabledButton: {
    backgroundColor: "#ddd",
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    backgroundColor: "#EF4444",
    borderRadius: 8,
    // width: "80%",
    alignItems: "center",
    // justifyContent: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "Poppins-Regular",
    fontSize: fontSize.labelLarge,
  },
});

export default FileUploadModal;
