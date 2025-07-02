import React, { useEffect, useState, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Text,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// import { Modal } from "react-native-paper";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import { Platform, PermissionsAndroid } from "react-native";
import OpenmiqModal from "../Components/Modal/Openmicmodal";
import { Searchbar } from "react-native-paper";
import { fontSize } from "../Util/UtilApi";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "../Store/SnackbarContext";
const Searchbarwithmic = ({
  searchQuery,
  setSearchQuery,
  setsearchmodal,
  setTranscript,
  placeholderText,
  refuser,
  fetchData,
  searchData,
  showSearchedData = null,
}) => {
  const [recognizing, setRecognizing] = useState(false);
  const [language, setLanguage] = useState("en-US"); // Default language is English
  const [searchPlaceHolders, setSearchPlaceHolders] = useState("");
  const { t } = useTranslation();
  const [SelectedPlaceholderText, setSelectedPlaceholderText] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [cancelVisible, setCancelVisible] = useState(false);
  const { showSnackbar } = useSnackbar();
  const [stopPlaceHolder, setStopPlaceHolder] = useState(false);
  // Request microphone permission
  const requestMicrophonePermission = async () => {
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
      } else {
        console.log("Microphone permission denied");
      }
    }
  };

  // Request microphone permission when the component mounts
  // useEffect(() => {
  //   requestMicrophonePermission();
  // }, []);

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
        setsearchmodal(true);
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

        console.log("Speech recognition started");
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
      // fetchData()
      searchData(fullTranscript);
    }
  });

  useSpeechRecognitionEvent("error", (event) => {
    // console.log("error code:", event.error, "error message:", event.message);
    showSnackbar(event.message, "error"); // Show error message in the search input
    console.log("error message:", event.message);
  });

  // // // Close the modal
  // const handleCloseModal = () => {
  //   setModalVisible(false);
  //   ExpoSpeechRecognitionModule.stop(); // Stop speech recognition when modal is closed
  // };

  // Toggle language between English and Hindi
  // const toggleLanguage = () => {
  //   setLanguage(language === "en-US" ? "hi-IN" : "en-US"); // Toggle between English and Hindi
  // };

  // useEffect(() => {
  //   const getPlaceHolders = () => {
  //     const placeHoldersArray = data?.map((item) => item?.subServiceName);

  //     setSearchPlaceHolders(placeHoldersArray);
  //   };

  //   getPlaceHolders();
  // }, [data]);

  // useEffect(() => {
  //   const currentPlaceholder = placeholders[placeholderIndex];

  //   if (charIndex < currentPlaceholder?.length) {
  //     // Add the next character after a small delay to simulate typing
  //     const timeout = setTimeout(() => {
  //       setSelectedPlaceholderText(
  //         (prev) => prev + currentPlaceholder[charIndex]
  //       );
  //       setCharIndex((prev) => prev + 1);
  //     }, 50); // Adjust the delay for typing speed (100ms here)

  //     return () => clearTimeout(timeout);
  //   } else {
  //     // After typing out the whole placeholder, wait before moving to the next one
  //     const waitBeforeNext = setTimeout(() => {
  //       setSelectedPlaceholderText("");
  //       setCharIndex(0);
  //       setPlaceholderIndex(
  //         (prevIndex) => (prevIndex + 1) % placeholders?.length
  //       );
  //     }, 2000); // Wait for 2 seconds before resetting to the next placeholder

  //     return () => clearTimeout(waitBeforeNext);
  //   }
  // }, [charIndex, placeholderIndex, placeholders]);
  const isArray = Array.isArray(placeholderText);

  // If placeholderText is an array, set up the typing effect
  useEffect(() => {
    if (searchQuery !== "" || stopPlaceHolder == true) return; // Stop placeholder animation when user types

    if (isArray) {
      const currentPlaceholder = placeholderText[placeholderIndex];

      if (charIndex < currentPlaceholder?.length) {
        const timeout = setTimeout(() => {
          setSelectedPlaceholderText(
            (prev) => prev + currentPlaceholder[charIndex]
          );
          setCharIndex((prev) => prev + 1);
        }, 50); // Adjust typing speed

        return () => clearTimeout(timeout);
      } else {
        const waitBeforeNext = setTimeout(() => {
          setSelectedPlaceholderText("");
          setCharIndex(0);
          setPlaceholderIndex(
            (prevIndex) => (prevIndex + 1) % placeholderText.length
          );
        }, 2000); // Wait before switching placeholders

        return () => clearTimeout(waitBeforeNext);
      }
    } else {
      setSelectedPlaceholderText(placeholderText);
    }
  }, [charIndex, placeholderIndex, placeholderText, isArray, searchQuery]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Searchbar
          ref={refuser || null}
          style={styles.searchbar}
          numberOfLines={1}
          placeholder={SelectedPlaceholderText || "Search for ....."}
          onFocus={() => {
            setStopPlaceHolder(true);
          }}
          returnKeyType="search"
          onSubmitEditing={() => {
            if (showSearchedData) {
              showSearchedData.current = true;
            }
            searchData(searchQuery);
          }}
          onIconPress={() => {
            if (searchQuery.length > 0) {
              searchData(searchQuery);
            } else {
              refuser.current?.focus(); // Focus input if search is empty
            }
          }}
          inputStyle={styles.inputStyle}
          onChangeText={(query) => {
            setSearchQuery(query);
            setCancelVisible(true);
            if (query === "") {
              setSelectedPlaceholderText(""); // Reset placeholder if search is cleared
              setCharIndex(0);
              fetchData?.();
            }
          }}
          value={searchQuery}
          right={() => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>

              {searchQuery.length > 0 && (
                <TouchableOpacity
                  style={{ marginRight: 10 }}
                  onPress={() => {
                    if (searchQuery.trim() !== "") {
                      searchData(searchQuery);
                    } else {
                      refuser.current?.focus();
                    }
                  }}
                >
                  <MaterialIcons name="search" size={24} color="#007bff" />
                </TouchableOpacity>
              )}


              {searchQuery === "" ? (
                <TouchableOpacity
                  style={{ marginRight: 10 }}
                  onPress={handleMicPress}
                >
                  <MaterialIcons name="mic" size={24} color="black" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{ marginRight: 10 }}
                  onPress={() => {
                    setSearchQuery("");
                    fetchData?.();
                  }}
                >
                  <MaterialIcons name="close" size={24} color="black" />
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
    paddingHorizontal: 10,
  },
  container: {
    alignItems: "center",
    // padding: 2,
    width: "100%",
    // borderWidth:2
  },

  searchbar: {
    height: 45, // Increase height to make sure the placeholder can be vertically centered
    borderRadius: 10,
    backgroundColor: "#EDEDED",
    // justifyContent: "center", // Vertically center the content
    // paddingVertical: 0, // Remove extra padding for centering
    marginVertical: 2,

    marginBottom: 10,
  },
  inputStyle: {
    // textAlignVertical: "center", // Center input text vertically
    // paddingVertical: 10, // Remove additional vertical padding
    paddingBottom: 20,
    // borderWidth:2,
    fontWeight: "medium",
    fontFamily: "Poppins-Medium",
    fontSize: fontSize.labelMedium,
  },
});

export default Searchbarwithmic;

{
  /* <Searchbar
  ref={refuser || null}
  style={styles.searchbar}
  numberOfLines={1}
  placeholder={SelectedPlaceholderText || "Search for ....."}
  onFocus={() => {
    setStopPlaceHolder(true);
  }}
  returnKeyType="search"
  onSubmitEditing={() => {
    if (showSearchedData) {
      showSearchedData.current = true;
    }
    searchData(searchQuery);
  }}
  onIconPress={() => {
    if (searchQuery.length > 0) {
      searchData(searchQuery);
    } else {
      refuser.current?.focus(); // Focus input if search is empty
    }
  }}
  inputStyle={styles.inputStyle}
  onChangeText={(query) => {
    setSearchQuery(query);
    setCancelVisible(true);
    if (query === "") {
      setSelectedPlaceholderText(""); // Reset placeholder if search is cleared
      setCharIndex(0);
      fetchData?.();
    }
  }}
  value={searchQuery}
  right={() => (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <TouchableOpacity
        style={{ marginRight: 10 }}
        onPress={() => {
          if (searchQuery.trim() !== "") {
            searchData(searchQuery);
          } else {
            refuser.current?.focus();
          }
        }}
      >
        <MaterialIcons name="search" size={24} color="black" />
      </TouchableOpacity>
      {searchQuery === "" ? (
        <TouchableOpacity style={{ marginRight: 10 }} onPress={handleMicPress}>
          <MaterialIcons name="mic" size={24} color="black" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={{ marginRight: 10 }}
          onPress={() => {
            setSearchQuery("");
            fetchData?.();
          }}
        >
          <MaterialIcons name="close" size={24} color="black" />
        </TouchableOpacity>
      )}
    </View>
  )}
/> */
}
