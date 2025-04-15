import React, { useContext, useState, useEffect } from "react";
import { Platform, Alert, StatusBar, } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Notifications from "expo-notifications";
import * as Sharing from "expo-sharing";
import * as IntentLauncher from "expo-intent-launcher";
import { StorageAccessFramework } from "expo-file-system";
import { useStorageLocationContext } from "../Store/StorageLocationContext";
import * as Linking from "expo-linking";
import Share from "react-native-share";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true, // set this true to play the sound and also show the popup when app is open
    shouldSetBadge: false,
  }),
});

export const useDownloadInvoice = () => {
  const { saveFolderUri, setSaveFolderUri, saveFileUri, setSaveFileUri } =
    useStorageLocationContext();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Define notification category with "Open Folder" action
    Notifications.setNotificationCategoryAsync("DOWNLOAD_CATEGORY", [
      // {
      //   identifier: "OPEN_FOLDER",
      //   buttonTitle: "Open Folder",
      //   options: { opensAppToForeground: true },
      // },
      {
        identifier: "OPEN_FILE",
        buttonTitle: "Open File",
        options: { opensAppToForeground: true },
      },
    ]);

    // Event listener for notification action
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        openFile();
        console.log("response of notification", response);
        if (response.actionIdentifier === "OPEN_FOLDER") {
          openFolder();

          console.log("open folder");
        } else if (response.actionIdentifier === "OPEN_FILE") {
          openFile();
          console.log("open file");
        }
        // else {
        //   openFile();
        // }
      }
    );
    // Clean up the listener when the component unmounts
    return () => subscription.remove();
  }, [saveFileUri]);

  // useEffect(() => {

  //   console.log("file Uri set Changed , ", saveFileUri)
  // }, [saveFileUri])

  const openFolder = () => {
    console.log("Open Folder button clicked , ", saveFolderUri); // Log when button is clicked

    try {
      if (Platform.OS === "android" && saveFolderUri) {
        // Open the folder using the saved URI
        IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
          data: saveFolderUri,
          flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
        });
      }
    } catch (error) {
      console.error("Error opening the folder is , ", error);
    }
  };

  // const openFile = () => {
  //   // console.log("Open File button clicked , ", saveFileUri);
  //   try {
  //     console.log("Open File button clicked , ", saveFileUri);
  //     // Open the file using the content URI
  //     IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
  //       data: saveFileUri, // Use the content URI from the folder
  //       flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
  //       type: "application/pdf" || "application/xlsx", // MIME type (optional but helpful)
  //     });
  //   } catch (error) {
  //     console.error("Error , ", error);
  //   }
  // };


  const openFile = async (fileUri, fileType) => {
    try {
      console.log("Attempting to open file:", fileUri, "type:", fileType);
      if (Platform.OS === "android") {
        const mimeType =
          fileType === "xlsx" ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" :
          fileType === "pdf" ? "application/pdf" :
          "*/*";
  
        await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
          data: fileUri,
          flags: 1,
          type: mimeType,
        });
      } else {
        await Linking.openURL(fileUri); // For iOS
      }
    } catch (error) {
      console.error("Error opening file: ", error);
      Alert.alert("Open Failed", "Could not open the file.");
    }
  };

  
  async function checkNotificationPermission() {
    // Check current notification permissions
    console.log("checking notification permission");
    const { status } = await Notifications.getPermissionsAsync();

    console.log("notification permission status , ", status);
    if (status !== "granted") {
      // Permission is not granted, request it
      console.log("asking notification permission");
      try {
        const { status: newStatus } =
          await Notifications.requestPermissionsAsync();

        console.log("asked notification permission status is , ", newStatus);

        if (newStatus === "granted") {
          console.log("Notification permission granted.");
          return true;
        } else {
          console.log("Notification permission denied.");
          return false;
        }
      } catch (error) {
        console.log("error getting notification permission is , ", error);
      }
    } else {
      console.log("Notification permission already granted.");
      return true;
    }
  }

  const downloadInvoicePressHandler = async (api, name) => {
    await checkNotificationPermission();

    console.log("downloadInvoicePress");
    console.log("api for invoice", api);
    console.log("file name of invoice ", name);

    let result;
    try {
      setIsLoading(true);
      // const result = await FileSystem.downloadAsync(
      //   api,
      //   FileSystem.documentDirectory + `downloaded${orderId}.pdf`
      // );

      const downloadUrl = api;
      if (name === "SampleFile") {
        result = await FileSystem.downloadAsync(
          downloadUrl,
          FileSystem.documentDirectory + `${name}.xlsx`
        );
      } else {
        result = await FileSystem.downloadAsync(
          downloadUrl,
          FileSystem.documentDirectory + `${name}.pdf`
        );
      }

      console.log(result, "- result");

      if (name === "SampleFile") {
        await saveFile(
          result?.uri,
          `${name}.xlsx`,
          result.headers["Content-Type"]
        );
      } else {
        await saveFile(
          result?.uri,
          `${name}.pdf`,
          result.headers["Content-Type"]
        );
      }
    } catch (error) {
      console.error("Error downloading or saving invoice:", error);
      Alert.alert("Download Failed", "Unable to download the invoice.");
    } finally {
      setIsLoading(false);
    }
  };

  async function saveFile(uri, filename, mimetype) {
    if (Platform.OS === "android") {
      try {
        let directoryUri;

        // Check if we already have permission and saved directory URI
        if (!saveFolderUri) {
          // Request permission if not stored or if Storage Access Framework is unavailable
          const permissions =
            await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

          if (permissions.granted) {
            directoryUri = permissions.directoryUri;
            // await AsyncStorage.setItem('saveFolderUri', directoryUri); // Save it for later use
            console.log("directory , ", directoryUri);
            await setSaveFolderUri(directoryUri);
          } else {
            // If permission is not granted, return or show an alert
            Alert.alert(
              "Permission Required",
              "Cannot save file without storage permission."
            );
            return;
          }
        }

        // Read file as base64
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        if (saveFolderUri) {
          console.log("save folder type , ", typeof saveFolderUri);
          directoryUri = saveFolderUri;
        }

        // Create and write the file in the selected directory
        const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
          directoryUri,
          filename,
          mimetype
        );
        await FileSystem.writeAsStringAsync(fileUri, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Save file URI to store if needed
        // content://com.android.externalstorage.documents/tree/primary%3AAlarms%2Ffront%20page/document/primary%3AAlarms%2Ffront%20page%2FSampleFile%20(6).xlsx
        await setSaveFileUri(fileUri);
        console.log(fileUri, "12341234");

        const fileName = decodeURIComponent(fileUri.split("/").pop());
        if (fileName.endsWith(".xlsx")) {
          console.log("This is an Excel file.");
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "Download Complete",
              body: "Your sample Excel file has been downloaded successfully.",
              categoryIdentifier: "DOWNLOAD_CATEGORY", // Use the category with the action button
            },
            trigger: null, // Show immediately
          });

        await openFile(fileUri, "xlsx");
        } else {
          console.log("This is a PDF file.");
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "Download Complete",
              body: "Your invoice has been downloaded successfully.",
              categoryIdentifier: "DOWNLOAD_CATEGORY", // Use the category with the action button
            },
            trigger: null, // Show immediately
          });
          await openFile(fileUri, 'pdf');

        }
        console.log("notifications complete");
        console.log(saveFileUri, "file urrirririrriririrrir");
      } catch (error) {
        console.error("Error saving file:", error);
        Alert.alert("Save Failed", "There was an error saving the file.");
      }
    }
  }

  const shareInvoicePressHandler = async (api, orderId) => {
    console.log("shareInvoicePressHandler");
    try {
      const result = await FileSystem.downloadAsync(
        api,
        FileSystem.documentDirectory + `downloaded${2}.pdf`
      );
      console.log(result, "- result");

      if (result?.uri && (await Sharing.isAvailableAsync())) {
        try {
          await Sharing.shareAsync(result?.uri);
        } catch (error) {
          console.error("Error sharing PDF:", error);
        }
      } else {
        console.error("Sharing is not available or PDF not downloaded.");
      }
    } catch (error) {
      console.error("Error downloading or saving invoice:", error);
      Alert.alert("Download Failed", "Unable to download the invoice.");
    }
  };
  const shareInvoiceOnWhatsApp = async (api, orderId = 1) => {
    try {
      const result = await FileSystem.downloadAsync(
        api,
        FileSystem.documentDirectory + `invoice_${orderId}.pdf`
      );
      console.log(result, "- result");
      const shareOptions = {
        url: result.uri, // Correct file URI format
        type: "application/pdf",
        social: Share.Social.WHATSAPP, // Direct WhatsApp sharing
        message: "Here is your invoice.",
      };
      await Share.shareSingle(shareOptions);
    } catch (error) {
      console.error("Error downloading or sharing invoice:", error);
      Alert.alert("Download Failed", "Unable to download the invoice.");
    }
  };

  // Determine which function to call based on callFor argument
  //   useEffect(() => {
  //     if (callFor === "downloadFile") {
  //       downloadInvoicePressHandler();
  //     } else if (callFor === "shareFile") {
  //       shareInvoicePressHandler();
  //     }
  //   }, [callFor]);

  return {
    downloadInvoicePressHandler,
    shareInvoicePressHandler,
    shareInvoiceOnWhatsApp,
    isLoading,
  };
};
