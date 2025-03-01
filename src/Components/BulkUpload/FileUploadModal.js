import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import CategoryDropDown from "../../UI/DropDown/CategoryDropdown";
import { API_BASE_URL, createApi, fontSize } from "../../Util/UtilApi";
import Icon from "react-native-vector-icons/Ionicons";
import { ShopContext } from "../../Store/ShopContext";
import axios from "axios";
import { useSnackbar } from "../../Store/SnackbarContext";
const FileUploadModal = ({ visible, setBulkUploadModalVisible }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [SelectedCat, setSelectedCat] = useState("");
  const { selectedShop } = useContext(ShopContext);
  const {showSnackbar}=useSnackbar();
  console.log("SELECTED FILE IS_____________", selectedFile);
  console.log("SelectedCat1578", SelectedCat);
  console.log("DATA OF SHOP IS----------", selectedShop?.id);
  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];

          console.log(file,"file of Response")
        if (file.name.endsWith(".xlsx")) {
          setSelectedFile(file);
        } else {
          alert("Invalid file type. Please select an XLSX file.");
        }
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

    const formData = new FormData();
    console.log("DATA OF FORMATE DATA  ", formData);

    formData.append("excelFile",{
      uri: selectedFile.uri,
      name: selectedFile.name,
      type:
        selectedFile.mimeType ||
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    formData.append("productcategoryfk", SelectedCat);
    formData.append("vendorfk", selectedShop?.id);

    console.log("FormData ", formData)

    formData.forEach((value, key) => {
      // If the value is an object (like a file), log its details
      if (value && value.uri) {
        console.log(`Key: ${key}, File URI: ${value.uri}, Name: ${value.name}, Type: ${value.type}`);
      } else {
        console.log(`Key: ${key}, Value: ${value}`);
      }
    });

    // for (let pair of formData.entries()) {
    //   console.log(`Datatatata of pair ${pair[0]}, ${pair[1]}`);
    // }
    try {
      const url = `products/bulkCreateProducts`;
      // const response = await createApi(url, formData);
      const response= await axios.post(`${API_BASE_URL}${url}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("RESPONSE OF UPLOAD FILE IS_________", response);
      if(response){
        showSnackbar("File uploaded successfully","success")
        setBulkUploadModalVisible(false);
      }
    } catch (error) {
      alert("Error uploading the file. Please try again.");
      console.log(error,"erorr of upload file")
    }
  };

  const handleCloseModal = () => {
    setBulkUploadModalVisible(false);
  };

  const DownloadHandler = () => {
    setBulkUploadModalVisible(false);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Category</Text>
          <View style={styles.modalBody}>
            <View style={styles.dropdownContainer}>
              <CategoryDropDown setSelectedCat={setSelectedCat} />
            </View>
            {!SelectedCat && (
              <View style={{}}>
                <Text style={styles.warningtext}>
                  Please select a category before submitting.
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.filePickerButton}
              onPress={pickFile}
            >
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

            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCloseModal}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={DownloadHandler}
              >
                <Text style={styles.downloadButtonText}>Download Sample</Text>
              </TouchableOpacity>
            </View>
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
    paddingVertical: 10,
    paddingHorizontal: 10,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
  },
  modalBody: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  title: {
    fontSize: fontSize.headingSmall,
    fontWeight: "bold",
    marginBottom: 8,
    fontFamily: "Poppins-Regular",
    color: "#333",
  },
  dropdownContainer: {
    // marginBottom: 5,
    // borderWidth:2,
    // height:"15%"
  },
  filePickerButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  iconTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "Poppins-Regular",
    fontSize: fontSize.labelLarge,
    marginLeft: 8,
  },
  fileName: {
    fontSize: fontSize.labelMedium,
    color: "#555",
    marginBottom: 15,
    fontStyle: "italic",
    textAlign: "center",
  },
  uploadButton: {
    backgroundColor: "#10B981",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: "#ddd",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  closeButton: {
    backgroundColor: "#EF4444",
    paddingVertical: 13,
    borderRadius: 10,
    flex: 0.45,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: fontSize.labelMedium,
  },
  warningtext: {
    color: "red",
    fontSize: fontSize.labelXSmall,
  },
  downloadButton: {
    backgroundColor: "#F59E0B",
    paddingVertical: 13,
    borderRadius: 10,
    flex: 0.5,
    alignItems: "center",
  },
  downloadButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: fontSize.labelMedium,
  },
});

export default FileUploadModal;
