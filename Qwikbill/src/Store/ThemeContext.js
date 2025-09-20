import React, { createContext, useState, useContext } from "react";
import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // ✅ MD3 themes have a "colors" property
  const theme = isDark ? MD3DarkTheme : MD3LightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};


export const useThemeContext = () => useContext(ThemeContext);



// import React, { createContext, useContext, useState } from "react";
// import { useColorScheme } from "react-native";
// import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
// import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

// const ThemeContext = createContext();

// export const ThemeProvider = ({ children }) => {
//   const systemColorScheme = useColorScheme();
//   const { theme } = useMaterial3Theme();

//   const [isDark, setIsDark] = useState(systemColorScheme === "dark");

//   const toggleTheme = () => setIsDark((prev) => !prev);

//   const paperTheme = isDark
//     ? { ...MD3DarkTheme, colors: theme.dark }
//     : { ...MD3LightTheme, colors: theme.light };

//   return (
//     <ThemeContext.Provider value={{ paperTheme, isDark, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// export const useThemeContext = () => useContext(ThemeContext);
