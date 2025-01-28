import en from "./en.json"
import hi from "./hi.json"
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
const getStoredLanguage = async () => {
  try {
    const storedLang = await AsyncStorage.getItem("appLanguage");
    return storedLang || 'en'; // Default to 'en' if no language is stored
  } catch (error) {
    console.error('Failed to fetch language from AsyncStorage', error);
    return 'en'; // Default to 'en' if there's an error
  }
};

getStoredLanguage().then((language) => {
  i18n
    .use(initReactI18next) // Passes i18n instance to react-i18next
    .init({
      // debug:true,
      lng:language,
      compatibilityJSON:"v3", 
      resources: {
        en: { translation: en },
        hi: { translation: hi },
      },
      fallbackLng: 'en', // Fallback language
      interpolation: {
        escapeValue: false, // React already escapes values
      },
    });
});

export default i18n;