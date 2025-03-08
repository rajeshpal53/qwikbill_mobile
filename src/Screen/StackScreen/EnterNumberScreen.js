import React, { useState, useEffect, useContext, useRef } from "react";
import auth from "@react-native-firebase/auth";
// import { useSnackbar } from "../../Store/SnackbarContext";
import {
  API_BASE_URL,
  fontFamily,
  log,
  fontSize,
  createApi,
  readApi,
} from "../../Util/UtilApi";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OtpInput } from "react-native-otp-entry";

import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  useWindowDimensions,
} from "react-native";
import {
  Button,
  Divider,
  Text,
  TextInput,
  FAB,
  ActivityIndicator,
  Modal,
  Portal,
  HelperText,
} from "react-native-paper";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Formik, replace } from "formik";
import * as Yup from "yup";
// import * as Notifications from "expo-notifications"
import CountryCodeModal from "../../Component/CountryCodeModal";
import AutoSlidingCarousel from "../../Component/AutoSlidingCarousel";
import SetpasswordModal from "../../Modal/SetpasswordModal";
import UserDataContext from "../../Store/UserDataContext";
// import { useTranslation } from "react-i18next";


const EnterNumberScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [confirm, setConfirm] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [autoVerification, setAutoVerification] = useState(false);
  //   const { showSnackbar } = useSnackbar();
  const [FCMToken, setFCMToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { userData, saveUserData } = useContext(UserDataContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [timer, setTimer] = useState(0); // Timer starts at 0
  const [isTimerRunning, setIsTimerRunning] = useState(false); // Controls the timer
  //   const { t } = useTranslation();
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const { width, height } = useWindowDimensions();
  const [otpError, setOtpError] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  // const [phoneNumber, setPhoneNumber] = useState('');


  const Validation = Yup.object().shape({
    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^[0-9]+$/, "Phone number must be numeric")
      .min(10, "Phone number must be at least 10 digits")
      .max(12, "Phone number can be at most 15 digits")
      .test(
        "check-number-availability",
        "Number is already registered. Try a different number.",
        async (value) => {
          if (value && value.length === 10) {
            // Check if the number is already registered
            const isAvailable = await checkPhoneNumberAvailability(value);
            console.log("VALUE IN PRESENT IS SSS123", isAvailable)
            return isAvailable;
          }
          return true;
        }
      ),
  });

  const checkPhoneNumberAvailability = async (phoneNumber) => {
    console.log("Enter number is ", phoneNumber)
    try {
      const response = await readApi(
        `users/getUserByMobile/${phoneNumber}`
      );
      console.log("USER DATA ______", response)

      if (response.status === 200) {
        console.log("If condition working ")
        return false;
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log("If condition working ")
        return true;
      }
    }
    return true;
  };

  const carouselItems = [
    {
      id: "1",
      image: require("../../../assets/images/carousel-slides/square1.jpg"),
    },
    {
      id: "2",
      image: require("../../../assets/images/carousel-slides/square2.jpg"),
    },
    {
      id: "3",
      image: require("../../../assets/images/carousel-slides/square3.jpg"),
    },
    {
      id: "4",
      image: require("../../../assets/images/carousel-slides/square4.jpg"),
    },
  ];

  useEffect(() => {
    async function checkNotificationPermission() {
      // Check current notification permissions
      console.log("checking notification permission");
      const { status } = await Notifications.getPermissionsAsync();

      console.log("notification permission status , ", status);
      if (status !== "granted") {
        // Permission is not granted, request it
        console.log("asking notification permission");
        try {
          const { status: newStatus } =
            await Notifications.requestPermissionsAsync();

          console.log("asked notification permission status is , ", newStatus);

          if (newStatus === "granted") {
            console.log("Notification permission granted.");
            return true;
          } else {
            console.log("Notification permission denied.");
            return false;
          }
        } catch (error) {
          console.log("error getting notification permission is , ", error);
        }
      } else {
        console.log("Notification permission already granted.");
        return true;
      }
    }

    checkNotificationPermission();
  }, []);

  useEffect(() => {
    async function signOutUser() {
      try {
        // showSnackbar("User signed out successfully (19.0.0)", "success");
        await auth().signOut();
        //log.info('User signed out successfully');
      } catch (error) {
        console.error("Error signing out:", error);
        // showSnackbar("User signed out failed (19.0.0)", "error");
      }
    }
    signOutUser();
  }, []);

  useEffect(() => {
    // Firebase Auth State Listener

    console.log("debugg111");
    // log.info("debugg111");
    const subscriber = auth().onAuthStateChanged(async (user) => {
      console.log("debugg44444", JSON.stringify(user));
      // log.info("debugg44444");
      if (user) {
        setIsVerified(true);
        const idToken = await user.getIdToken();
        console.log("debugg55555", user);
        // const fToken=await AsyncStorage.getItem("FCMToken");
        // Alert.alert("Success", "Auto-verified successfully!");
        let pNumber = user.phoneNumber.replace("+91", "");
        // const response= await postData(pNumber,fToken,idToken);
        showSnackbar("Login successfully!", "success");
        //   if(response){
        //     setIsVerified(true);
        //   navigation.reset({
        //     index: 0,
        //     routes: [
        //       {
        //         name: "Bottom",
        //         params: {
        //           screen: "Home",
        //         },
        //       },
        //     ],
        //   });
        // }
        setPasswordModalVisible(true);
      }
    });

    return subscriber;
    // Unsubscribe on cleanup
  }, []);
  //   useEffect(() => {
  //     const fetchToken = async () => {
  //       try {
  //         const tokenCall = await AsyncStorage.getItem("FCMToken");
  //         setFCMToken(tokenCall);
  //         console.log("FCMToken", JSON.parse(tokenCall));
  //       } catch (err) {
  //         console.error("failed to get token");
  //       }
  //     };
  //     fetchToken();
  //   }, []);

  const idTokenValidate = async (idToken) => {
    const payload = {
      mobile: phoneNumber,
      idToken: idToken,
    };

    console.log("payload for idToken Api is , ", payload);

    try {
      const response = await createApi("users/idTokenValidate", payload);

      console.log("response status 1 , ", response?.message);
      console.log("response 1 , ", response);
      if (
        response?.message ==
        "ID token and mobile number validated successfully."
      ) {
        return true;
      }
    } catch (error) {
      return false;
    } finally {
    }
  };

  const postData = async (password) => {
    setIsLoading(true);
    console.log(FCMToken, "FCMToken");
    const payload = {
      mobile: phoneNumber,
      // fcmtokens: [FCMToken||fToken],
      password,
      // idToken: idToken,
    };
    console.log("payload", payload);
    try {
      if (payload?.mobile) {
        const response = await createApi(`users/signUp`, payload); // Convert JavaScript object to JSON;
        console.log("data found 'users/signUp', ", response);
        saveUserData(response);
        return true;
      }
    } catch (error) {
      console.error("Error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  // const postData = async (pNumber, fToken, idToken) => {
  //   setIsLoading(true);
  //   console.log(FCMToken, "FCMToken");
  //   const payload = {
  //     mobile: pNumber || phoneNumber,
  //     fcmtokens: [FCMToken||fToken],
  //     idToken: idToken,
  //   };
  //   console.log("payload", payload);
  //   console.log("pNumber", pNumber);
  //   console.log("phoneNumber", phoneNumber);
  //   try {
  //     if (payload.mobile) {
  //       const response = await createApi(`users/upsert`, payload); // Convert JavaScript object to JSON;
  //       console.log("data found , ", response);
  //       saveUserData(response);
  //       return true;
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //     return false;
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleResendOTP = () => {
    setTimer(90); // Reset the timer
    // Logic for resending OTP
    sendOtp("+91" + phoneNumber);
  };
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`; // Adds leading zero to seconds if < 10
  };
  //   // Function to start the timer
  //   const startTimer = (timer) => {
  //     setTimer(timer); // Set timer to 2:30 (150 seconds)
  //     setIsTimerRunning(true); // Start the timer
  //   };

  // Step 1: Send OTP
  const sendOtp = async (phoneNumber) => {
    try {
      setIsLoading(true);
      console.log("debugg22222");
      // log.info("debugg22222");

      // startTimer(90); // Start the timer
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      console.log("confirmation", JSON.stringify(confirmation));
      setConfirm(confirmation);
      //   setConfirm(true);
      setAutoVerification(true); // Set auto-verification flag
      console.log("debugg33333");
      setAutoVerification(false); // Reset auto-verification flag
      // Alert.alert(
      //   "OTP Sent!",
      //   "Check your messages for the verification code."
      // );
      showSnackbar(
        "OTP Sent! Check your messages for the verification code.",
        "success"
      );
    } catch (error) {
      // Alert.alert("Error", error.message);
      showSnackbar(`OTP Sent failed ${error}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Confirm OTP (Fallback for Manual Entry)
  const confirmOtp = async () => {
    if (otp.length === 0) {
      setOtpError(true);
      return;
    }
    console.log(otp, "otp");
    // log.info("Confirrm Otp Start ");
    if (otp.length !== 6 || otp === "") {
      setOtpError(true);
      console.log(`ddsdddsdsd`);
      return;
    }
    setIsDisabled(true);
    setTimeout(() => {
      setIsDisabled(false);
    }, 10000); // 10 seconds
    try {
      if (confirm) {
        console.log("debugg66666");
        const userCredential = await confirm.confirm(otp);
        console.log(userCredential, "djdjdjdj"); // Verifies the OTP
        const user = userCredential.user; // Authenticated user object
        // Fetch the ID token for backend verification
        const idToken = await user.getIdToken();
        console.log("debugg77777 pra", user, idToken);

        const isIdTokenValidate = await idTokenValidate(idToken);

        if (isIdTokenValidate) {
          setPasswordModalVisible(true);
          // const response = await postData();

          // if (response) {

          //   // Alert.alert("Success", "Phone number verified successfully!");
          //   showSnackbar("Phone number verified successfully!", "success");
          //   navigation.reset({
          //     index: 0,
          //     routes: [
          //       {
          //         name: "Bottom",
          //         params: {
          //           screen: "Home",
          //         },
          //       },
          //     ],
          //   });
          //   setIsVerified(true);
          // }
        }
      }
    } catch (error) {
      // Alert.alert("Invalid Code", "The code you entered is incorrect.");
      // showSnackbar("Invalid Otp ", "error");
      showSnackbar(` Failed to Login ${error}`, "error");
    }
  };

  const closeModal = () => {
    setPasswordModalVisible(false);
  };
  //    useEffect(() => {
  //       let interval;
  //       if (isTimerRunning && timer > 0) {
  //         interval = setInterval(() => {
  //           setTimer((prevTimer) => {
  //             if (prevTimer > 1) {
  //               return prevTimer - 1;
  //             } else {
  //               clearInterval(interval);
  //               // Clear the interval when timer reaches 0
  //               setIsTimerRunning(false); // Stop the timer

  //               // if (threeTimer) {
  //               //   resetCount();
  //               // }
  //               return 0; // Ensure timer is set to 0
  //             }
  //           });
  //         }, 1000);
  //       }

  //       return () => {
  //         clearInterval(interval); // Clear interval on unmount or when dependencies change
  //       };
  //     }, [isTimerRunning, timer]);

  const Loader = () => {
    return (
      <Portal>
        <Modal
          visible={isLoading}
          contentContainerStyle={styles.modalBackground}
          accessible={true}
          accessibilityLabel="Loading content. Please wait."
          accessibilityRole="alert" // Announces this as an important message
        >
          <View style={styles.loaderContainer}>
            <ActivityIndicator
              animating={true}
              size="large"
              accessibilityLabel="Loading indicator"
              accessibilityLiveRegion="assertive"
            />
          </View>
        </Modal>
      </Portal>
    );
  };
  const t = (str) => {
    return str;
  };
  return (
    <View style={styles.container}>
      {!isVerified && (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior="height"
            enabled={false}
          >
            {autoVerification ? (
              <Text style={styles.autoVerifyText}>
                Auto-verification in progress...
              </Text>
            ) : confirm ? (
              <View style={styles.container1}>
                {console.log("hello 2")}
                <ScrollView
                  contentContainerStyle={{ flexGrow: 1 }}
                  scrollEnabled={true}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="always"
                >
                  {/* <ScrollView contentContainerStyle={{flexGrow:1, backgroundColor:"orange"}}> */}
                  <View style={styles.container}>
                    {/* <View style={{ flex:1, backgroundColor:"orange"}}> */}
                    {/* <Text variant="headlineLarge" style={styles.title}>
            Make your plan
          </Text> */}
                    <TouchableOpacity
                      style={{
                        alignItems: "flex-start",
                        height: 48,
                        width: 80,
                      }}
                      onPress={() => {
                        setConfirm(null);
                      }}
                    >
                      <Button
                        textColor="#fff"
                        icon={() => (
                          <MaterialCommunityIcons
                            style={{}}
                            name="less-than"
                            size={18}
                            color="#fff"
                          />
                        )}
                        contentStyle={{
                          flexDirection: "row",
                          backgroundColor: "#fcb534",
                        }}
                        labelStyle={
                          {
                            // marginRight: 5, // Ensure no extra margin between the text and the icon
                          }
                        }
                        style={{ borderRadius: 10 }}
                      >
                        {t("Back")}
                      </Button>
                    </TouchableOpacity>

                    <View>
                      <Image
                        style={{ height: height * 0.4, width: "100%" }}
                        source={require("../../../assets/getotp.png")}
                      />
                      {isLoading && <Loader />}
                    </View>

                    <Text variant="bodyLarge" style={styles.instructions}>
                      {t("Enter the OTP sent to your mobile number")} +91
                      {phoneNumber}
                    </Text>
                    {/* <TextInput
        mode="outlined"
        label="Enter OTP"
        value={otp}
        onChangeText={handleOTPChange}
        keyboardType="numeric"
        maxLength={6}
        style={styles.otpInput}
        error={otpError}
      /> */}
                    <OtpInput numberOfDigits={6} onTextChange={setOtp} />

                    {otpError && (
                      <HelperText type="error">
                        {t("Please enter a valid 6-digit OTP.")}
                      </HelperText>
                    )}

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: 20,
                      }}
                    >
                      {/* <Text style={styles.timer}>{t("Resend Otp in : ")} {timer}</Text> */}
                      <TouchableOpacity
                        onPress={handleResendOTP}
                        disabled={timer !== 0}
                      >
                        <Text
                          style={[
                            styles.resendOTP,
                            timer !== 0 && { color: "#AAA" },
                          ]}
                        >
                          {/* {t(" Resend OTP")} */}
                          {t("Resend OTP in")} {formatTime(timer)}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <Button
                      mode="contained"
                      onPress={confirmOtp}
                      // onPress={() => setPasswordModalVisible(true)}
                      style={styles.loginButton}
                    >
                      {t("Login")}
                    </Button>
                    {/* </View> */}

                    {/* <View style={{
            flexDirection: "row",
            alignSelf:"center",
            marginTop:30
            }}>
            <Text>Powered by </Text>
            <Image
              source={require("../../../assets/logo-wertone.png")}
              style={styles.logo}
            />
            <Text style={{}}>Wertone</Text>
          </View> */}
                  </View>
                </ScrollView>
              </View>
            ) : (
              <>
                <View style={styles.topSection}>
                  <AutoSlidingCarousel
                    height={400}
                    carouselItems={carouselItems}
                    fromScreen={"EnterNumber"}
                  />
                  {/* <Pressable
                    style={styles.fab}
                    label="Skip"
                    onPress={() => {
                      navigation.navigate("Bottom", { screen: "Home" });
                    }}
                  >
                    <View style={[styles.skipView, { borderColor: "#fcb534" }]}>
                      <Text style={{ color: "#0a6846", fontSize: 18 }}>
                        Skip
                      </Text>
                    </View>
                  </Pressable> */}

                  {/*

            <Image
              source={require("../../../assets/otp_authentication.png")}
              style={styles.image}
            /> */}
                </View>
                <View style={styles.loginSection}>
                  <ScrollView
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="always"
                  >
                    <View style={{ flex: 1, justifyContent: "space-around" }}>
                      <View style={{ gap: 25 }}>
                        <Text style={styles.heading}>
                          {t("WELCOME TO QWIKBILL")}
                        </Text>
                        <Formik
                          initialValues={{ phone: "" }}
                          validationSchema={Validation}
                          onSubmit={async (values, { resetForm }) => {
                            setIsLoading(true);
                            try {
                              console.log("Form submitted with:", values.phone);
                              // const confirm = await signInWithPhoneNumber(values.phone);
                              // navigation.navigate("EnterOtp", { values, confirm });
                              console.log("phoneNumber", "+91" + values.phone);
                              setPhoneNumber(values.phone);
                              sendOtp("+91" + values.phone);
                              // setIsVerified((prev) => !prev);
                              setConfirm(true);
                            } catch (error) {
                              console.error(
                                "Error submitting phone number:",
                                error
                              );
                            } finally {
                              setIsLoading(false);
                            }
                          }}
                        >
                          {({
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            values,
                            errors,
                            touched,
                            isValid,
                            dirty,
                          }) => (
                            <View
                              style={{
                                justifyContent: "center",
                                width: "100%",
                              }}
                            >
                              <Text
                                style={
                                  {
                                    //  fontFamily: fontFamily.regular
                                  }
                                }
                              >
                                {t("Phone Number")}
                              </Text>
                              <View style={styles.inputContainer}>
                                <TouchableOpacity
                                  style={styles.countryCodeButton}
                                  onPress={() => setModalVisible(true)}
                                >
                                  <View style={styles.flagContainer}>
                                    {/* Replace with your flag icon if available */}
                                    <Text style={styles.flagText}>🇮🇳</Text>
                                  </View>
                                  <Text style={styles.countryCodeText}>
                                    +91
                                  </Text>
                                  <MaterialCommunityIcons
                                    name="chevron-down"
                                    size={20}
                                    color={"#777"}
                                    style={{ marginLeft: 10 }}
                                  />
                                </TouchableOpacity>
                                <Divider
                                  style={{
                                    height: "70%", // Adjust height as needed
                                    width: 1,
                                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                                    marginHorizontal: 8,
                                  }}
                                />
                                <TextInput
                                  placeholder={t("Enter Phone Number")}
                                  keyboardType="phone-pad"
                                  style={styles.input}
                                  underlineColor="transparent"
                                  activeUnderlineColor="transparent" // Remove active underline color
                                  // onChangeText={handlePhoneChange}
                                  onChangeText={handleChange("phone")}
                                  onBlur={handleBlur("phone")}
                                  value={values.phone}
                                  error={touched.phone && errors.phone}
                                  maxLength={10} // Limit input to 10 characters
                                  // autoFocus={true}
                                  mode={"flat"}
                                  cursorColor={"#1e90ff"}
                                />
                              </View>
                              <View style={{ alignSelf: "center" }}>
                                {touched && errors.phone && (
                                  <Text style={styles.errorText}>
                                    {errors.phone}
                                  </Text>
                                )}
                              </View>

                              <View>
                                {isTimerRunning && (
                                  <Text>
                                    {" "}
                                    Resend OTP in {formatTime(timer)}
                                  </Text>
                                )}
                                <TouchableOpacity
                                  onPress={handleSubmit}
                                  disabled={isTimerRunning && timer > 0}
                                  style={{
                                    padding: 12, // Adjusts to meet the 48x48 touch target without changing button size
                                    // backgroundColor:"lightblue",
                                    width: "100%",
                                  }}
                                  hitSlop={{
                                    top: 12,
                                    bottom: 12,
                                    left: 12,
                                    right: 12,
                                  }}
                                >
                                  <Button
                                    // style={styles.button}
                                    style={[
                                      styles.button,
                                      { borderRadius: 10 },
                                      !isValid || !dirty || !values.phone
                                        ? { backgroundColor: "#d3d3d3" }
                                        : { backgroundColor: "#1E90FF" },
                                    ]}
                                    mode="contained"
                                    // disabled={isTimerRunning && timer > 0}
                                    disabled={
                                      !isValid || !dirty || !values.phone
                                    }
                                  >
                                    {t("Login With OTP")}
                                  </Button>
                                </TouchableOpacity>
                              </View>
                            </View>
                          )}
                        </Formik>
                      </View>
                      <CountryCodeModal
                        modalVisible={modalVisible}
                        setModalVisible={setModalVisible}
                      />
                      {isLoading && <Loader />}

                      <View style={styles.bottomText}>
                        <Text style={{ color: "#777" }}>
                          By signing in, you are agree to
                          <Text
                            style={{
                              textDecorationLine: "underline",
                              color: "#1e90ff",
                            }}
                            onPress={() =>
                              navigation.navigate("Policies", {
                                // webUri: "https://rajeshpal.online/privacy-policy",
                                webUri: `https://dailysabji.com/privacy-policy?view=mobile`,
                                headerTitle: "Privacy and Policies",
                              })
                            }
                          >
                            Terms and Policy.
                          </Text>
                        </Text>
                        {/* <View style={{ flexDirection: "row" }}>
                    <Text style={{ color: "#777", fontSize: 12 }}>
                      Powered by
                    </Text>
                    <Image
                      source={require("../../../assets/logo-wertone.png")}
                      style={styles.logo}
                    />
                    <Text style={{ color: "#777", fontSize: 12 }}>Wertone</Text>
                  </View> */}
                      </View>
                    </View>
                  </ScrollView>
                </View>
              </>
            )}
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      )}

      <SetpasswordModal
        visible={passwordModalVisible}
        closeModal={closeModal}
        navigation={navigation}
        postData={postData}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // backgroundColor: "orange",

    gap: 20,
    color: "",
  },
  fab: {
    width: 70,
    height: 50,
    position: "absolute",
    top: 50, // Adjust this value to control vertical positioning
    right: 25, // Adjust this value to control horizontal positioning
    backgroundColor: "transparent",
    // backgroundColor: "#d84e55",
    // borderWidth: 1,
    // borderColor:"#fff",
    color: "#0a6846", // Customize the FAB color
    borderRadius: 15,
    // marginHorizontal: 10,
    // paddingHorizontal: 15,
    paddingVertical: 5,
    elevation: 0,
    color: "white",
  },
  logoContiner: {
    backgroundColor: "pink",
    // alignItems:"center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    width: 350,

    backgroundColor: "#F4F4F4", // Light gray background for the input container
    borderRadius: 8, // Rounded corners for the entire container
    // paddingVertical: 10, // Vertical padding
    paddingHorizontal: 15, // Horizontal padding
    marginVertical: 10, // Margin around the input container
  },
  countryCodeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 0,
    // paddingHorizontal: 8, // Padding inside the button
  },
  flagContainer: {
    flexDirection: "row",
    marginRight: 4, // Space between the flag and country code
  },
  flagText: {
    fontSize: 18, // Size of the flag emoji
  },
  countryCodeText: {
    fontSize: 18,
    // fontFamily: "Poppins-Regular",
    // Bold text for the country code
    color: "#000",
  },
  input: {
    flex: 1, // Take up the remaining space
    fontSize: 18,
    color: "#000",
    backgroundColor: "transparent",
  },
  heading: {
    fontSize: 14,
    // fontSize: fontSize.heading,
    // fontFamily: fontFamily.bold,
    alignSelf: "center",
  },
  container1: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
  },
  topSection: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0, // Adjust the top value as needed
    width: "100%",
    height: "60%",
    backgroundColor: "#fff",
    zIndex: 0,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  skipView: {
    borderWidth: 1,
    width: 75,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 5,
    height: 33,
    justifyContent: "center",
  },
  logo: {
    width: 20, // Adjust width as needed
    height: 20, // Adjust height as needed
    marginRight: 5, // Space between the logo and the text
  },
  loginSection: {
    backgroundColor: "#fff",
    // padding: 20,
    // flex:1,
    // paddingHorizontal:20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0, // Adjust the top value as needed
    width: "100%",
    height: "50%",
    zIndex: 0,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  button: {
    borderRadius: 14,
    height: 48,
    width: "auto",
    justifyContent: "center",
  },
  errorText: {
    color: "#CD232E",
    marginLeft: 50,
  },
  image: {
    width: 600,
    height: 250,
    resizeMode: "contain",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)", // Semi-transparent backdrop
  },
  loaderContainer: {
    padding: 20, // Darker background for loader
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  autoVerifyText: {
    fontSize: 20,
    // fontFamily: fontFamily.bold,
    textAlign: "center",
    marginTop: 20,
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
  },
  instructions: {
    marginBottom: 20,
    fontSize: 14,
    // fontSize: fontSize.headingSmall,
    // fontFamily: fontFamily.bold,
    color: "#193238",
  },
  otpInput: {
    marginBottom: 10,
  },

  loginButton: {
    marginTop: 30,
    borderRadius: 10,
    backgroundColor: "#0c3b73",
    height: 48,
    justifyContent: "center",
  },
  img: {
    width: "100%",
    height: 300,
  },
  logo: {
    width: 20, // Adjust width as needed
    height: 20, // Adjust height as needed
    marginRight: 5, // Space between the logo and the text
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)", // Semi-transparent backdrop
  },
  loaderContainer: {
    padding: 20, // Darker background for loader
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  timer: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
  resendOTP: {
    fontSize: 14,
    color: "#007BFF",
    textDecorationLine: "underline",
    textAlign: "center",
    marginBottom: 20,
  },
});

export default EnterNumberScreen;
