

const handleDocumentPick = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    if (
      result.type === "success" &&
      result.mimeType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      console.log("File picked:", result);
      handleUpload(result.uri, result.name);
    } else {
      showSnackbar(
        "Error selecting file. Please choose a valid Excel file.",
        "error"
      );
    }
  } catch (error) {
    console.error("Error picking document:", error);
    showSnackbar("Error picking document. Please try again.", "error");
  }
};

const handleUpload = async (uri, name) => {
  const formData = new FormData();
  formData.append("file", {
    uri,
    name,
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  try {
    const response = await axios.post(
      "http://192.168.1.5:8888/api/product/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    if (response.status === 200) {
      const data = response.data;
      console.log("Upload successful:", data);
      showSnackbar("Successfully uploaded customer file", "success");
      navigation.navigate("Customer");
    } else {
      console.error("Upload failed with status:", response.status);
      showSnackbar("Failed to upload product. Please try again.", "error");
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    showSnackbar(
      "Failed to upload product. Please check your network and try again.",
      "error"
    );
  }
};
