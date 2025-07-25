import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
// import ImageResizer from "react-native-image-resizer";
//import ImageResizer from "react-native-image-resizer";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"; // For icons
import Entypo from "@expo/vector-icons/Entypo";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useTranslation } from "react-i18next";
//import FastImage from "react-native-fast-image";
import Modal from "react-native-modal";
import { Divider, Text } from "react-native-paper";
import { fontSize } from "../Util/UtilApi";
import Ionicons from "@expo/vector-icons/Ionicons";

// import * as ImageManipulator from 'expo-image-manipulator';
export default function ServiceImagePicker({
  image,
  label,
  isAdmin = false,
  setFieldValue,
  uploadFieldName,
  type,
  format = "JPEG",
  camera = true,
  gallary = true,
  fieldsDisabled = false, // ✅ Add this line

}) {
  console.log("profile image is the , ", image);
  console.log("format is , ", format);
  const MAX_FILE_SIZE_MB = 3; // Target file size in MB (e.g., 1MB)
  const { t } = useTranslation();
  const [uploadStatus, setUploadStatus] = useState("");
  const [modalVisibel, setModalVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  // const imageUrl = image?.uri
  //   ? image?.uri
  //   : "";

  useEffect(() => {
    const setImageUrlfunc = () => {
      console.log("pratham y image , ", image);
      setImageUrl(image?.uri);
      console.log("image url in image picker", imageUrl)
    };
    setImageUrlfunc();
  }, [image]);



  const closeModal = () => {
    setModalVisible(false);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  useEffect(() => {
    if (image) {
      setUploadStatus("uploaded");
    }
  }, []);

  // Function to compress the image without changing the dimensions
  // const compressImageToTargetSize = async (
  //   uri,
  //   targetSizeMB,
  //   initialQuality = 100
  // ) => {
  //   try {
  //     let quality = initialQuality; // Start with high quality
  //     let compressedUri = uri;
  //     let fileSize = await getImageFileSizeInMB(compressedUri);

  //     console.log("file size one time is ", fileSize);

  //     // Keep reducing the quality until we reach the target size or quality becomes too low
  //     while (fileSize > targetSizeMB && quality > 10) {
  //       const resizedImage = await ImageResizer.createResizedImage(
  //         compressedUri,
  //         // Keep original dimensions (no resizing)
  //         800, // a large number for width, to maintain the original dimensions
  //         800, // a large number for height, to maintain the original dimensions
  //         format, // Use JPEG format for compression
  //         quality - 10, // Adjust compression quality
  //         0, // No rotation
  //         null // No specific path, use default location
  //       );

  //       compressedUri = resizedImage.uri;
  //       fileSize = await getImageFileSizeInMB(compressedUri);
  //       console.log("fileSize is, ", fileSize);
  //       //
  //       quality -= 10; // Reduce quality by 10 each time
  //     }

  //     return compressedUri; // Return the compressed image URI
  //   } catch (error) {
  //     console.error("Error compressing image:", error);
  //     return uri; // Return the original URI if compression fails
  //   }
  // };

  // Helper function to calculate file size in MB
  const getImageFileSizeInMB = async (uri) => {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    console.log("file infor , ", fileInfo);
    return fileInfo.size / (1024 * 1024); // Convert bytes to MB
  };
  const pickGallaryImage = async () => {
    // Ask for permission to access the camera roll

    const permission = await ImagePicker.getMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      // If not granted, ask for permission
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        alert("Permission to access the gallery is required!");
        return;
      }
    }

    // Open the image picker
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      aspect: label === "Shop Image" ? [16, 9] : null,
    });

    if (!pickerResult.canceled) {
      console.log(
        pickerResult.assets[0],
        "image struncture is",
        "uploadFieldName , ",
        uploadFieldName
      );

      // const resizedUri = await resizeImageToTargetSize(
      //   pickerResult.assets[0].uri
      // );

      // if (format === "PNG" && pickerResult.assets[0].mimeType !== "image/png") {
      //   alert("Please select an image in PNG format.");
      //   return;
      // }
      // Compress to target size (e.g., 1 MB)
      const compressedUri = await compressImageToTargetSize(
        pickerResult.assets[0].uri,
        1
      ); // Target 1 MB

      console.log("compressedUri , ", compressedUri);

      setFieldValue(uploadFieldName, {
        // uri: pickerResult.assets[0].uri,
        uri: compressedUri,
        name: pickerResult.assets[0].fileName,
        type: pickerResult.assets[0].mimeType,
      });

      // setImage({
      //   uri: pickerResult.assets[0].uri,
      //   name: pickerResult.assets[0].fileName,
      //   type: pickerResult.assets[0].mimeType,
      // });

      setUploadStatus("uploaded");
    }
  };

  const pickCameraImage = async () => {
    const permission = await ImagePicker.getCameraPermissionsAsync();

    if (!permission.granted) {
      // If not granted, ask for permission
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        alert("Permission to access the camera is required!");
        return;
      }
    }

    // Open the camera
    let cameraResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
      aspect: label === "Shop Image" ? [16, 9] : null,
    });

    if (!cameraResult.canceled) {
      console.log(cameraResult.assets[0], "image structure is");

      // Compress the image to a target size (e.g., 1 MB)

      // if (format === "PNG" && cameraResult.assets[0].mimeType !== "image/png") {
      //   alert("Please select an image in PNG format.");
      //   return;
      // }
      const compressedUri = await compressImageToTargetSize(
        cameraResult.assets[0].uri,
        1 // Target size in MB
      );

      setFieldValue(uploadFieldName, {
        uri: compressedUri,
        name: cameraResult.assets[0].fileName || "cameraPhoto.jpg", // Camera might not return a file name
        type: cameraResult.assets[0].mimeType || "image/jpeg", // Default to JPEG if type is not returned
      });
    }
  };

  const imageSize =
    label === "Shop Image"
      ? { width: "100%", height: 140 }
      : { width: "100%", height: 140 };

  return (
    <>
      {type === "rounded" ? (
        <View style={styles.avatarMainContainer}>
          <View style={styles.avatarContainer}>
            {/* Avatar Image */}
            {console.log(imageUrl, " dsddfd")}
            <Image
              source={{
                uri:
                  imageUrl ||
                  "https://servicediary.online/assets/mobile/male.png", // Replace with your image URL
                headers: { Accept: "*/*" },
                // priority: FastImage.priority.high,
                // cache: FastImage.cacheControl.web,
              }}
              style={styles.avatar}
              onLoadStart={() => console.log("🟡 Image loading started...")}
              onLoad={() => console.log("✅ Image loaded successfully")}
              onError={(error) => console.log("❌ Image Load Error:", error)}
            />

            {/* Edit Icon */}
            {!fieldsDisabled && (
              <TouchableOpacity
                style={styles.editIcon}
                onPress={() => {
                  if (!fieldsDisabled) {
                    openModal();
                  }
                }}
              >
                {label === "Profile Image" && !isAdmin ? (
                  <Entypo name="camera" size={20} color="#fff" />
                ) : (
                  <MaterialIcons name="edit" size={20} color="#fff" />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        <View>
          <Text style={{ fontSize: 16, color: "rgba(0, 0, 0, 0.5)" }}>
            {label} {label === "Shop Image" ? "" : "*"}
          </Text>
          <View
            style={
              imageUrl
                ? styles.containerWithImage
                : styles.containerWithoutImage
            }
          >
            {imageUrl && (
              <View style={styles.previewContainer}>
                {console.log("image url of , ", imageUrl)}
                <Image
                  source={{
                    uri: imageUrl || "https://via.placeholder.com/150" || "",
                    headers: { Accept: "*/*" },
                    //  priority: FastImage.priority.high,
                    // cache: FastImage.cacheControl.web,
                  }}
                  style={[styles.imagePreview, imageSize]}
                />
              </View>
            )}

            <Pressable
              onPress={() => {
                if (!fieldsDisabled) {
                  openModal();
                }
              }}
              style={{
                minHeight: 48,
                minWidth: 48,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {!imageUrl && (
                <MaterialCommunityIcons
                  name="file-image-plus-outline"
                  size={24}
                  color="gray"
                />
              )}

              {imageUrl ? (
                <Text
                  style={{
                    fontFamily: "Poppins-Regular",
                    fontSize: fontSize.label,
                    // color : "rgba(0, 0, 0, 0.7)"
                    color: "#1E90FF",
                    textAlign: "center",
                  }}
                >
                  {fieldsDisabled
                    ? ""
                    : `Click to update ${label?.toLowerCase()}`}
                </Text>
              ) : (
                <Text
                  style={{
                    fontFamily: "Poppins-Regular",
                    fontSize: fontSize.label,
                    color: "rgba(0, 0, 0, 0.7)",
                    textAlign: "center",
                  }}
                >
                  Click here to attach {label?.toLowerCase()}
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      )}

      <Modal
        visible={modalVisibel}
        onBackdropPress={closeModal}
        animationType="fade"
        transparent
      >
        <View style={styles.backdrop}>
          <View style={styles.modalContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>Select Option</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Ionicons name="close" size={22} color="#555" />
              </TouchableOpacity>
            </View>

            <View style={styles.optionList}>
              {camera && (
                <>
                  <TouchableOpacity style={styles.optionButton} onPress={() => {
                    closeModal();
                    pickCameraImage();
                  }}>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Ionicons style={{ marginRight: 5, marginTop: 7 }} name="camera" size={22} color="#333" />
                      <Text style={styles.optionText}> Take Photo</Text>
                    </View>
                  </TouchableOpacity>
                  <View style={styles.divider} />
                </>
              )}

              {gallary && (
                <>
                  <TouchableOpacity style={styles.optionButton} onPress={() => {
                    closeModal();
                    pickGallaryImage();
                  }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Ionicons style={{ marginRight: 5, marginTop: 7 }} name="image" size={22} color="#333" />
                      <Text style={styles.optionText}>  Upload from Gallery</Text>
                    </View>
                  </TouchableOpacity>
                  <View style={styles.divider} />
                </>
              )}

              {imageUrl && (
                <TouchableOpacity style={styles.optionButton} onPress={() => {
                  closeModal();
                  removeImage();
                }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Ionicons style={{ marginRight: 5, marginTop: 7 }} name="trash" size={22} color="#333" />
                      <Text style={styles.optionText}>  Remove Image</Text>
                    </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  containerWithImage: {
    // alignItems: "center",
    // borderColor: "gray",
    // borderWidth: 1,
    // borderStyle: "dashed",
    // borderRadius: 5,
    // backgroundColor: "rgba(0, 0, 0, 0.1)",
    // paddingVertical: 10,
    // paddingHorizontal: 5,

    alignItems: "center",
    borderColor: "gray",
    gap: 5,
    borderRadius: 10,
    paddingHorizontal: 5,
  },
  containerWithoutImage: {
    alignItems: "center",
    borderColor: "gray",
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.06)",
    paddingVertical: 50,
    paddingHorizontal: 5,
  },
  previewContainer: {
    marginTop: 20,
    alignItems: "center",
    width: "90%",
  },
  imagePreview: {
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  aadharImageDimensions: {
    width: 100,
    height: 100,
  },
  shopImageDimensions: {},
  uploadStatus: {
    marginTop: 10,
    fontSize: 16,
    color: "gray",
  },
  avatarContainer: {
    width: 100, // Adjust based on avatar size
    height: 100,
    position: "relative",
    // backgroundColor:"orange"
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 50, // Makes it circular
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  editIcon: {
    position: "absolute",
    bottom: 5,
    right: 0, // Adjust for exact placement
    backgroundColor: "#007BFF", // Background color for the icon
    borderRadius: 15,
    padding: 5,
  },
  avatarMainContainer: {
    // backgroundColor:"orange",
    alignItems: "center",
  },
  modal: {
    // height:20
  },
  modalContent: {
    // flex:1,
    backgroundColor: "#fff",
    elevation: 5,
    marginHorizontal: 10,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    width: "80%",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
  },
  optionList: {
    marginTop: 7,
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    marginTop: 5
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 6,
  },
});
