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

export const useDownloadInvoice = () => {
  const { saveFolderUri, setSaveFolderUri, setSaveFileUri } = useStorageLocationContext();
  const [isLoading, setIsLoading] = useState(false);
  const{userData}=useContext(UserDataContext)
  // Setup Notification Category and Response Listener
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

  // Function to open a file
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

  // Check Notification Permissions
  async function checkNotificationPermission() {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      return newStatus === "granted";
    }
    return true;
  }

  // Download and Save Invoice
  const downloadInvoicePressHandler = async (api, name) => {
    await checkNotificationPermission();
    console.log("Downloading invoice:", api, name);
    let result;
    const extension = name === "SampleFile" ? ".xlsx" : ".pdf";
    const fileType = name === "SampleFile" ? "xlsx" : "pdf";
    console.log("Using token:", token);
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

      console.log("Downloaded debug 1:", result?.uri);
      await saveFile(result?.uri, `${name}${extension}`, result.headers["Content-Type"], fileType);
    } catch (error) {
      console.error("Download/Save error:", error);
      Alert.alert("Download Failed", "Unable to download the invoice.");
    } finally {
      setIsLoading(false);
    }
  };

  // Save File to External Directory
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

      console.log("File saved: debug 4", fileUri);
      await openFile(fileUri, fileType);
    } catch (error) {
      console.error("Error saving file:", error);
      Alert.alert("Save Failed", "There was an error saving the file.");
    }
  };

  // Share Invoice (General)
  const shareInvoicePressHandler = async (api, orderId = 1) => {
    try {
      const result = await FileSystem.downloadAsync(
        api,
        FileSystem.documentDirectory + `invoice_${orderId}.pdf`
      );
      if (result?.uri && (await Sharing.isAvailableAsync())) {
        await Sharing.shareAsync(result.uri);
      } else {
        Alert.alert("Sharing Not Available", "Unable to share the file.");
      }
    } catch (error) {
      console.error("Sharing error:", error);
      Alert.alert("Download Failed", "Unable to download the invoice.");
    }
  };

  // Share Invoice on WhatsApp
  const shareInvoiceOnWhatsApp = async (api, orderId = 1) => {
    try {
      const result = await FileSystem.downloadAsync(
        api,
        FileSystem.documentDirectory + `invoice_${orderId}.pdf`
      );
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
    shareInvoicePressHandler,
    shareInvoiceOnWhatsApp,
    isLoading,
  };
};
