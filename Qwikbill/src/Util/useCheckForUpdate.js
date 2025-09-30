import { useEffect, useState } from "react";
import { Alert, Linking } from "react-native";
import Constants from "expo-constants";
import { readApi } from "./UtilApi";

export default function useCheckForUpdate() {
  const [checked, setChecked] = useState(false); // track if response is received

  useEffect(() => {
    async function checkUpdate() {
      const currentVersion = Constants.expoConfig.version; // e.g. "1.0.0"
      console.log("Current Version:", currentVersion);
      try {
        // Fetch latest version from API

        const response = await readApi("config/?key=latestVersion");
        const latestVersion = response?.data?.configValue;
        setChecked(true); // mark that response is received
        console.log(latestVersion,"latestversion")
        // Compare versions (force update)
        if (currentVersion !== latestVersion) {
          Alert.alert(
            "Update Required",
            "Please update to the latest version to continue using this app.",
            [
              {
                text: "Update Now",
                onPress: () =>
                  Linking.openURL(
                    "market://details?id=" + Constants.expoConfig.android.package
                  ),
              },
            ],
            { cancelable: false } // user cannot dismiss alert
          );
        }
      } catch (error) {
        console.log("Version check failed:", error);
        setChecked(true); // even on error, mark as checked to prevent infinite block
      }
    }

    checkUpdate();
  }, []);
}
