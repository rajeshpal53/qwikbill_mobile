// theme.ts
import { useColorScheme } from 'react-native';


// Light theme
const LightColors = {
 
  muted:"#666",
 background: "#FFFFFF",
  surface: "#F8F9FA",          // soft gray
  card: "#FFFFFF",
  text: "#212529",
  textSecondary: "#6C757D",
  border: "#DEE2E6",

  // accents
  primary: "#0C3B73",          // deep blue
  secondary: "#26A0DF",        // light blue
  accent: "#007BFF",           // action button color

  // states
  overlay: "rgba(0,0,0,0.05)",
  selected: "#E8F5E9",

  // custom additions from your UI
  itemBackground: "#F0F0F0",
  helpBackground: "#F0F0F0",
  avatarBackground: "#B3ECFF",
  modalBackground: "rgba(0,0,0,0.8)",

  success: "#2E7D32",
  danger: "#D32F2F",
  warning: "#ED6C02",
  info: "#0288D1",

};

const DarkColors = {
  
  muted:"#bbb",
  background: "#121212",
  surface: "#1E1E1E",
  card: "#1E1E1E",
  text: "#FFFFFF",
  textSecondary: "#A1A1A1",
  border: "#2C2C2C",

  // accents
  primary: "#26A0DF",          // lighter blue pops on dark
  secondary: "#0C3B73",        // deep accent blue
  accent: "#339CFF",           // brighter button color

  // states
  overlay: "rgba(255,255,255,0.08)",
  selected: "rgba(38,160,223,0.15)",

  // custom additions from your UI
  itemBackground: "#2A2A2A",
  helpBackground: "#2A2A2A",
  avatarBackground: "#274472",
  modalBackground: "rgba(0,0,0,0.9)",

  success: "#81C784",
  danger: "#EF9A9A",
  warning: "#FFB74D",
  info: "#4FC3F7",
};


export function useTheme() {
  const scheme = useColorScheme(); // 'light' or 'dark'
  console.log(scheme,"scheme")
  const colors = scheme === 'dark' ? DarkColors : LightColors;
  const isDark = scheme === 'dark';
  return { colors, isDark };
}
