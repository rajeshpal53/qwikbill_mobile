import React, { createContext, useContext } from "react";
import { ActivityIndicator } from "react-native-paper";
import { useFonts } from "expo-font";

// Create a context
const FontContext = createContext();

// Custom hook to use the font context
export const useFontsLoaded = () => {
  return useContext(FontContext);
};

// Provider to manage and share font-loaded state
export const FontProvider = ({ children }) => {
  const [loaded] = useFonts({
    "Poppins-Thin": require("../../assets/Fonts/Poppins/Poppins-Thin.ttf"),
    "Poppins-Light": require("../../assets/Fonts/Poppins/Poppins-Light.ttf"),
    "Poppins-ExtraLight": require("../../assets/Fonts/Poppins/Poppins-ExtraLight.ttf"),
    "Poppins-Regular": require("../../assets/Fonts/Poppins/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../../assets/Fonts/Poppins/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../../assets/Fonts/Poppins/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("../../assets/Fonts/Poppins/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../../assets/Fonts/Poppins/Poppins-ExtraBold.ttf"),
  });

//   [
//     "./assets/Fonts/Poppins/Poppins-Medium.ttf",
//     "./assets/Fonts/Poppins/Poppins-Black.ttf", 
//     "./assets/Fonts/Poppins/Poppins-SemiBold.ttf",
//     "./assets/Fonts/Poppins/Poppins-Bold.ttf",
//     "./assets/Fonts/Poppins/Poppins-BlackItalic.ttf",
//     "./assets/Fonts/Poppins/Poppins-Light.ttf",
//     "./assets/Fonts/Poppins/Poppins-BoldItalic.ttf",
//     "./assets/Fonts/Poppins/Poppins-ExtraBold.ttf",
//     "./assets/Fonts/Poppins/Poppins-ExtraBoldItalic.ttf",
//     "./assets/Fonts/Poppins/Poppins-ExtraLight.ttf",
//     "./assets/Fonts/Poppins/Poppins-ExtraLightItalic.ttf",
//     "./assets/Fonts/Poppins/Poppins-Italic.ttf",
//     "./assets/Fonts/Poppins/Poppins-LightItalic.ttf",
//     "./assets/Fonts/Poppins/Poppins-MediumItalic.ttf",
//     "./assets/Fonts/Poppins/Poppins-SemiBoldItalic.ttf",
//     "./assets/Fonts/Poppins/Poppins-ThinItalic.ttf"
//   ]

const PoppinsFonts = {
    Thin: "Poppins-Thin",
    Light: "Poppins-Light",
    ExtraLight: "Poppins-ExtraLight",
    Regular: "Poppins-Regular",
    Medium : "Poppins-Medium",
    SemiBold: "Poppins-SemiBold",
    Bold: "Poppins-Bold",
    ExtraBold: "Poppins-ExtraBold",
}

  if (!loaded) {
    return <ActivityIndicator size={"large"} />;
  }

  return (
    <FontContext.Provider value={{ poppins : PoppinsFonts }}>
      {children}
    </FontContext.Provider>
  );
};
