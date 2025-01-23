import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";

import { PaperProvider, ActivityIndicator } from "react-native-paper";

import { DefaultTheme } from "react-native-paper";
import { AuthProvider, AuthContext } from "./src/Store/AuthContext.js";
import { SnackbarProvider } from "./src/Store/SnackbarContext.js";
import { SafeAreaProvider } from "react-native-safe-area-context";
// import { Ionicons } from "@expo/vector-icons";
import { ShopDetailProvider } from "./src/Store/ShopDetailContext.js";
import { ShopDetailContext } from "./src/Store/ShopDetailContext.js";
import { LoginTimeProvider } from "./src/Store/LoginTimeContext.js";
import { PasskeyProvider } from "./src/Store/PasskeyContext.js";

  import { Provider } from "react-redux";
import { Store } from "./src/Redux/Store.js";
import { UserDataProvider } from "./src/Store/UserDataContext.js";
import * as Font from "expo-font";
import StackNavigator from "./src/NavigatorContainer/StackNavigator.js";
import { FontProvider } from "./src/Store/FontProvider.js";

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
// <<<<<<< Akash
//       <ShopDetailProvider>
//         <PasskeyProvider>
//           <SnackbarProvider>
//             <PaperProvider theme={customTheme}>
//               <Provider store={Store}>
//                 <NavigationContainer>
//                   <AuthProvider>
//                     <LoginTimeProvider>
//                       <StackNavigator />
// =======
      <UserDataProvider>
        <ShopDetailProvider>
          <PasskeyProvider>
            <SnackbarProvider>
              <Provider theme={customTheme}>
                <NavigationContainer>
                  <AuthProvider>
                    <LoginTimeProvider>
                      <FontProvider>
                        {fontsLoaded ? (
                          <StackNavigator />
                        ) : (
                          <ActivityIndicator size={"large"} />
                        )}
                      </FontProvider>
// >>>>>>> prathamesh
                    </LoginTimeProvider>
                  </AuthProvider>
                </NavigationContainer>
              </Provider>
// <<<<<<< Akash
//             </PaperProvider>
//           </SnackbarProvider>
//         </PasskeyProvider>
//       </ShopDetailProvider>
// =======
            </SnackbarProvider>
          </PasskeyProvider>
        </ShopDetailProvider>
      </UserDataProvider>
// >>>>>>> prathamesh
    </SafeAreaProvider>
  );
}
