import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider,  } from "react-native-paper";
import { DefaultTheme,  } from "react-native-paper";
import { AuthProvider, AuthContext } from "./src/Store/AuthContext.js";
import { SnackbarProvider } from "./src/Store/SnackbarContext.js";
import { SafeAreaProvider } from "react-native-safe-area-context";
// import { Ionicons } from "@expo/vector-icons";
import { ShopDetailProvider } from "./src/Store/ShopDetailContext.js";
import { ShopDetailContext } from "./src/Store/ShopDetailContext.js";
import { LoginTimeProvider } from "./src/Store/LoginTimeContext.js";
import { PasskeyProvider } from "./src/Store/PasskeyContext.js";
import StackNavigator from "./src/NavigatorContainer/stackNavigator.js";
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
  return (
    <SafeAreaProvider>
      <ShopDetailProvider>
        <PasskeyProvider>
          <SnackbarProvider>
            <Provider theme={customTheme}>
              <NavigationContainer>
                <AuthProvider>
                  <LoginTimeProvider>
                  <StackNavigator/>
                  </LoginTimeProvider>
                </AuthProvider>
              </NavigationContainer>
            </Provider>
          </SnackbarProvider>
        </PasskeyProvider>
      </ShopDetailProvider>
    </SafeAreaProvider>
  );
}
