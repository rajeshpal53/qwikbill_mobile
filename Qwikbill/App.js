import { NavigationContainer } from "@react-navigation/native";
import { useEffect, useState } from "react";
import "react-native-gesture-handler";

import { I18nextProvider } from "react-i18next";
import { ActivityIndicator, DefaultTheme, PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./src/Store/AuthContext.js";
import { SnackbarProvider } from "./src/Store/SnackbarContext.js";
// import { Ionicons } from "@expo/vector-icons";
import { LoginTimeProvider } from "./src/Store/LoginTimeContext.js";
import { PasskeyProvider } from "./src/Store/PasskeyContext.js";
// import i18n from "./src/Locale";
import * as Font from "expo-font";
import { Provider } from "react-redux";
import i18n from "./src/Locale/index.js";
import StackNavigator from "./src/NavigatorContainer/stackNavigator.js";
import { Store } from "./src/Redux/Store.js";
import { FontProvider } from "./src/Store/FontProvider.js";
import { UserDataProvider } from "./src/Store/UserDataContext.js";
// import { CopilotProvider } from "react-native-copilot";
import { TourGuideProvider } from "rn-tourguide";
import { ShopProvider } from "./src/Store/ShopContext.js";
import { StorageLocationProvider } from "./src/Store/StorageLocationContext.js";
import { navigationRef } from "./src/Util/NavigationService.js";
//import { requestUserPermission, setupTokenRefreshListener } from "./src/Util/NotificationHandler.js";
const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#0c3b73",
    accent: "#fff",
    secondry: "#96214e",
    // Set your custom primary color here
  },
};
export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(true);
  const[fcmToken, setFcmToken] = useState(null);
//   useEffect(() => {
//     // Request permission and retrieve token on startup
//     requestUserPermission();
//     // Set up the token refresh listener
//     const unsubscribeTokenRefresh = setupTokenRefreshListener(setFcmToken);
//     // Clean up the token refresh listener
//     return () => unsubscribeTokenRefresh();
//   }, []);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "Poppins-Regular": require("./assets/Fonts/Poppins/Poppins-Regular.ttf"),
        "Poppins-Medium": require("./assets/Fonts/Poppins/Poppins-Medium.ttf"),
        "Poppins-Light": require("./assets/Fonts/Poppins/Poppins-Light.ttf"),
        "Poppins-Thin": require("./assets/Fonts/Poppins/Poppins-Thin.ttf"),
        "Poppins-Bold": require("./assets/Fonts/Poppins/Poppins-Bold.ttf"),
      });
      console.log("Fonts have been loaded successfully");
      setFontsLoaded(true);
    };
    loadFonts();
  });

  return (
    <SafeAreaProvider>
      <StorageLocationProvider>
      <UserDataProvider>
        <ShopProvider>
        {/* <ShopDetailProvider> */}
          <PasskeyProvider>
            <SnackbarProvider>
              <Provider store={Store}>
                <I18nextProvider i18n={i18n}>
                  <PaperProvider theme={customTheme}>
                    <TourGuideProvider {...{ borderRadius: 16,backdropColor: 'hsla(64, 5.80%, 47.50%, 0.39)' }}>
                      <NavigationContainer ref={navigationRef}>
                        <AuthProvider>
                          <LoginTimeProvider>
                            <FontProvider>
                              {fontsLoaded ? (
                                <StackNavigator  />
                              ) : (
                                <ActivityIndicator size={"large"} />
                              )}
                            </FontProvider>
                          </LoginTimeProvider>
                        </AuthProvider>
                      </NavigationContainer>
                    </TourGuideProvider>
                  </PaperProvider>
                </I18nextProvider>
              </Provider>
            </SnackbarProvider>
          </PasskeyProvider>
        {/* </ShopDetailProvider> */}
        </ShopProvider>
      </UserDataProvider>
      </StorageLocationProvider>
    </SafeAreaProvider>
  );
}