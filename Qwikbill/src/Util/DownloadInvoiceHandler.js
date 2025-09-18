import React, { useContext, useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Notifications from "expo-notifications";
import * as Sharing from "expo-sharing";
import * as IntentLauncher from "expo-intent-launcher";
import { useStorageLocationContext } from "../Store/StorageLocationContext";
import * as Linking from "expo-linking";
import Share from "react-native-share";
import UserDataContext from "../Store/UserDataContext";

// Notification Handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// ... All your imports remain unchanged

export const useDownloadInvoice = () => {
  const { saveFolderUri, setSaveFolderUri, setSaveFileUri } = useStorageLocationContext();
  const [isLoading, setIsLoading] = useState(false);
  const { userData } = useContext(UserDataContext);

  useEffect(() => {
    Notifications.setNotificationCategoryAsync("DOWNLOAD_CATEGORY", [
      {
        identifier: "OPEN_FILE",
        buttonTitle: "Open File",
        options: { opensAppToForeground: true },
      },
    ]);

    const subscription = Notifications.addNotificationResponseReceivedListener(async (response) => {
      if (response.actionIdentifier === "OPEN_FILE" && response.notification.request.content.data?.fileUri) {
        const { fileUri, fileType } = response.notification.request.content.data;
        await openFile(fileUri, fileType);
      }
    });

    return () => subscription.remove();
  }, []);

  const openFile = async (fileUri, fileType) => {
    try {
      console.log("Opening file: debug 5", fileUri);
      const mimeType = fileType === "xlsx"
        ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        : fileType === "pdf"
        ? "application/pdf"
        : "*/*";

      if (Platform.OS === "android") {
        await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
          data: fileUri,
          flags: 1,
          type: mimeType,
        });
      } else {
        await Linking.openURL(fileUri);
      }
    } catch (error) {
      console.error("Error opening file:", error);
      Alert.alert("Failed to Open", "Unable to open the file.");
    }
  };
  async function checkNotificationPermission() {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      return newStatus === "granted";
    }
    return true;
  }

  const downloadInvoicePressHandler = async (api, name) => {
    await checkNotificationPermission();
    console.log("Downloading invoice:", api, name);
    let result;
    const extension = ".pdf";
    const fileType = "pdf";
    try {
      setIsLoading(true);
      result = await FileSystem.downloadAsync(
        api,
        FileSystem.documentDirectory + `${name}${extension}`,
        {
          headers: {
            Authorization: `Bearer ${userData?.token}`,
          },
        }
      );

      console.log("Downloaded PDF: debug 1:", result?.uri);
      await saveFile(result?.uri, `${name}${extension}`, "application/pdf", fileType);
    } catch (error) {
      console.error("PDF Download/Save error:", error);
      Alert.alert("Download Failed", "Unable to download the invoice.");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadExcelHandler = async (api, name = "SampleFile") => {
    await checkNotificationPermission();
    console.log("Downloading Excel:", api, name);
    let result;
    const extension = ".xlsx";
    const fileType = "xlsx";
    const mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    try {
      setIsLoading(true);
      result = await FileSystem.downloadAsync(
        api,
        FileSystem.documentDirectory + `${name}${extension}`,
        {
          headers: {
            Authorization: `Bearer ${userData?.token}`,
          },
        }
      );

      console.log("Downloaded XLSX: debug 1:", result?.uri);
      await saveFile(result?.uri, `${name}${extension}`, mimeType, fileType);
    } catch (error) {
      console.error("Excel Download/Save error:", error);
      Alert.alert("Download Failed", "Unable to download the Excel file.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveFile = async (uri, filename, mimetype, fileType) => {
    try {
      let directoryUri = saveFolderUri;
      if (!directoryUri) {
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (!permissions.granted) {
          return Alert.alert("Permission Required", "Storage access is needed to save the file.");
        }
        directoryUri = permissions.directoryUri;
        await setSaveFolderUri(directoryUri);
      }

      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(directoryUri, filename, mimetype);
      await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
      console.log("File saved at: debug 3", fileUri);
      await setSaveFileUri(fileUri);

      const fileMessage = fileType === "xlsx"
        ? "Your Excel file has been downloaded successfully."
        : "Your invoice PDF has been downloaded successfully.";

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Download Complete",
          body: fileMessage,
          categoryIdentifier: "DOWNLOAD_CATEGORY",
          data: { fileUri, fileType },
        },
        trigger: null,
      });

      await openFile(fileUri, fileType);
    } catch (error) {
      console.error("Error saving file:", error);
      Alert.alert("Save Failed", "There was an error saving the file.");
    }
  };

  const shareInvoicePressHandler = async (api, orderId = 1, token) => {
  try {
    const fileUri = FileSystem.documentDirectory + `invoice_${orderId}.pdf`;

    // Remove old file if exists
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(fileUri, { idempotent: true });
    }

    // Download with headers (same as your working downloader)
    const result = await FileSystem.downloadAsync(api, fileUri, {
      headers: {
        Authorization: `Bearer ${token}`,  // 🔑 required
        Accept: "application/pdf",
      },
    });

    // Check file size
    const downloadedFileInfo = await FileSystem.getInfoAsync(result.uri);
    console.log("Downloaded for sharing:", downloadedFileInfo);
    if (!downloadedFileInfo.exists || downloadedFileInfo.size < 100) {
      // <100 bytes → definitely not a valid PDF
      throw new Error("Downloaded file is invalid (probably an error response).");
    }

    // Share
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(result.uri, {
        mimeType: "application/pdf",
        dialogTitle: "Share Invoice",
      });
    } else {
      Alert.alert("Sharing Not Available", "Unable to share the file.");
    }
  } catch (error) {
    console.error("Sharing error:", error);
    Alert.alert("Download Failed", error.message || "Unable to download the invoice.");
  }
};

  const shareInvoiceOnWhatsApp = async (api, orderId = 1,token) => {
    try {

      const result = await FileSystem.downloadAsync(api, FileSystem.documentDirectory + `invoice_${orderId}.pdf`, {
      headers: {
        Authorization: `Bearer ${token}`,  // 🔑 required
        Accept: "application/pdf",
      },
    });
      
      const shareOptions = {
        url: result.uri,
        type: "application/pdf",
        social: Share.Social.WHATSAPP,
        message: "Here is your invoice.",
      };
      await Share.shareSingle(shareOptions);
    } catch (error) {
      console.error("WhatsApp share error:", error);
      Alert.alert("Download Failed", "Unable to download the invoice.");
    }
  };

  return {
    downloadInvoicePressHandler,
    downloadExcelHandler,
    shareInvoicePressHandler,
    shareInvoiceOnWhatsApp,
    isLoading,
  };
};
