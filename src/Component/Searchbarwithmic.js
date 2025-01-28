import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Text,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Modal } from "react-native-paper";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import { Platform, PermissionsAndroid } from "react-native";
import OpenmiqModal from "../Modal/Openmicmodal";
import { Searchbar } from "react-native-paper";
// import { fontSize } from "../Util/UtilApi";
// import { useTranslation } from "react-i18next";
// import { useSnackbar } from "../Store/SnackbarContext";
const Searchbarwithmic = ({
  searchQuery,
  setSearchQuery,
  setsearchmodal,
  setTranscript,
  placeholderText,
  refuser,
  fetchData,
}) => {
  const [recognizing, setRecognizing] = useState(false);
  const [language, setLanguage] = useState("en-US"); // Default language is English
  const [searchPlaceHolders, setSearchPlaceHolders] = useState("");
  // const { t } = useTranslation();
  const [SelectedPlaceholderText, setSelectedPlaceholderText] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [cancelVisible, setCancelVisible] = useState(false);
  // const { showSnackbar } = useSnackbar();

  // Request microphone permission
  const requestMicrophonePermission = async () => {
    const permissionGranted = await AsyncStorage.getItem(
      "microphonePermissionGranted"
    );


    // If permission has already been granted, don't request again
    if (permissionGranted === "true") {
      console.log("Microphone permission already granted.");
      return;
    }

    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: "Microphone Permission",
          message:
            "This app needs access to your microphone for speech recognition.",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Microphone permission granted");
        await AsyncStorage.setItem('microphonePermissionGranted', 'true');
      } else {
        console.log("Microphone permission denied");
        await AsyncStorage.setItem('microphonePermissionGranted', 'false');
      }
    }
  };

  // Request microphone permission when the component mounts
  useEffect(() => {
    requestMicrophonePermission();
  }, []);

  // Request permission to use speech recognition
  const handleStart = async () => {
    try {
      // Request permissions if available
      const result =
        await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      console.log("Permission granted:", result.granted);
      if (!result.granted) {
        console.warn("Permissions not granted", result);
        return;
      }

      if (!recognizing) {
        setsearchmodal(true)
        // Start speech recognition
        ExpoSpeechRecognitionModule.start({
          lang: language,
          interimResults: true,
          maxAlternatives: 1,
          continuous: false,
          requiresOnDeviceRecognition: false,
          addsPunctuation: true,
          contextualStrings: ["Carlsen", "Nepomniachtchi", "Praggnanandhaa"],
        });
      }
    } catch (error) {
      console.error("Error during speech recognition setup:", error);
    }
  };

  // Handle the microphone button press
  const handleMicPress = () => {
    setsearchmodal(true); // Open the modal when the mic button is pressed
    handleStart(); // Start speech recognition when the modal opens
  };

  // Listen to speech recognition events
  useSpeechRecognitionEvent("start", () => {
    setTranscript("");
    setRecognizing(true);
    console.log("Recognition started");
  });

  useSpeechRecognitionEvent("end", () => {
    setRecognizing(false);
    ExpoSpeechRecognitionModule.stop();
    setsearchmodal(false);
    console.log("Recognition ended");
  });

  useSpeechRecognitionEvent("result", (event) => {
    if (event.results.length > 0) {
      const fullTranscript = event.results[0]?.transcript;
      setTranscript(fullTranscript);
      setSearchQuery(fullTranscript);
    }
  });

  useSpeechRecognitionEvent("error", (event) => {
    // console.log("error code:", event.error, "error message:", event.message);
    showSnackbar(event.message,"error"); // Show error message in the search input
    console.log( "error message:", event.message);
  });

  const isArray = Array.isArray(placeholderText);

  // If placeholderText is an array, set up the typing effect
  useEffect(() => {
    if (isArray) {
      const currentPlaceholder = placeholderText[placeholderIndex];

      if (charIndex < currentPlaceholder?.length) {
        // Add the next character after a small delay to simulate typing
        const timeout = setTimeout(() => {
          setSelectedPlaceholderText(
            (prev) => prev + currentPlaceholder[charIndex]
          );
          setCharIndex((prev) => prev + 1);
        }, 50); // Adjust the delay for typing speed (100ms here)

        return () => clearTimeout(timeout);
      } else {
        // After typing out the whole placeholder, wait before moving to the next one
        const waitBeforeNext = setTimeout(() => {
          setSelectedPlaceholderText("");
          setCharIndex(0);
          setPlaceholderIndex(
            (prevIndex) => (prevIndex + 1) % placeholderText?.length
          );
        }, 2000); // Wait for 2 seconds before resetting to the next placeholder

        return () => clearTimeout(waitBeforeNext);
      }
    } else {
      setSelectedPlaceholderText(placeholderText); // Directly use the string if it's not an array
    }
  }, [charIndex, placeholderIndex, placeholderText, isArray]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Searchbar
          ref={refuser || null}
          style={styles.searchbar}
          placeholder={
            SelectedPlaceholderText || "Search for ....."
            // Array.isArray(SelectedPlaceholderText)?
            // `Search for .....${SelectedPlaceholderText}`: SelectedPlaceholderText
          }
          inputStyle={styles.inputStyle}
          onChangeText={(query) => {
            setSearchQuery(query);
            setCancelVisible(true);
            if (query === "") {
              setSelectedPlaceholderText(""); // Reset placeholder if search is cleared
              setCharIndex(0);
              if (fetchData) {
                fetchData();
              }
            }
          }}
          value={searchQuery}
          right={() => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {searchQuery !== "" && (
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    style={{ marginRight: 10 }}
                    onPress={() => {
                      setSearchQuery("");
                      if (fetchData) {
                        fetchData();
                      }
                    }} // Clear the search query
                  >
                    <MaterialIcons name="close" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              )}
              {searchQuery === "" && (
                <TouchableOpacity
                  style={{ marginRight: 10 }}
                  // onPress={handleMicPress}
                  onPress={handleMicPress}
                >
                  <MaterialIcons name="mic" size={24} color="black" />
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      </View>
    </View>
  );
};

// Styles for the search bar and mic button
const styles = StyleSheet.create({
  wrapper: {
    // flex: 1, // Ensure the wrapper takes the full screen height
    // backgroundColor: "#fff",
    // justifyContent: "center",
    // alignItems: "center",
    paddingHorizontal: 10,
  },
  container: {
    alignItems: "center",
    // padding: 2,
    width: "100%",
    // borderWidth:2
  },
  // searchBarContainer: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   backgroundColor: "#f0f0f0",
  //   borderRadius: 10,
  //   width: "95%",
  //   height: 48,
  //   borderWidth: 1,
  // },
  // searchInput: {
  //   flex: 1,
  //   height: "100%",
  //   paddingVertical: 0,
  //   fontSize: 14,
  //   borderWidth:2
  // },
  // iconContainer: {
  //   paddingRight: 10,
  //   marginLeft: 8,
  // },
  // languageButton: {
  //   marginTop: 10,
  //   justifyContent: "flex-end",
  //   alignItems: "center",
  // },
  // languageButtonText: {
  //   fontSize: 16,
  // },
  searchbar: {
    height: 45, // Increase height to make sure the placeholder can be vertically centered
    borderRadius: 10,
    backgroundColor: "#EDEDED",
    justifyContent: "center", // Vertically center the content
    paddingVertical: 0, // Remove extra padding for centering
    marginVertical: 2,
    // textAlignVertical: "center", // For Android: Vertically centers text
    // paddingVertical:10
    marginBottom: 10,
  },
  inputStyle: {
    textAlignVertical: "top", // Center input text vertically
    paddingVertical: 7, // Remove additional vertical padding
    // borderWidth:2,
    // height:20
    fontWeight: "medium",
    fontFamily: "Poppins-Medium",
    // fontSize: fontSize.labelLarge,
  },
});

export default Searchbarwithmic;

{
  /* <View style={styles.searchBarContainer}>
<TouchableOpacity style={styles.iconContainer}>
  <MaterialIcons name="search" size={24} color="black" />
</TouchableOpacity>
<TextInput
  style={styles.searchInput}
  placeholder="Search"
  value={searchQuery}
  onChangeText={setSearchQuery}
/>

{searchQuery.length > 0 ? (
  <TouchableOpacity
    style={{ marginRight: 10 }}
    onPress={() => setSearchQuery("")}
  >
    <MaterialIcons name="close" size={24} color="black" />
  </TouchableOpacity>
) : (
  <TouchableOpacity
    onPress={handleMicPress}
    style={styles.iconContainer}
  >
    <MaterialIcons name="mic" size={24} color="black" />
  </TouchableOpacity>
)}
</View> */
}

{
  /* <TouchableOpacity onPress={toggleLanguage} style={styles.languageButton}>
          <Text style={styles.languageButtonText}>
            {language === "en-US" ? "Switch to Hindi" : "Switch to English"}
          </Text>
        </TouchableOpacity> */
}
