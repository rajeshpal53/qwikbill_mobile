import React, { useState, useEffect, useContext, useRef } from "react";
import auth from "@react-native-firebase/auth";
// import { useSnackbar } from "../../Store/SnackbarContext";
import {
  NORM_URL,
  fontFamily,
  log,
  fontSize,
  createApi,
  readApi,
  updateApi
} from "../../Util/UtilApi";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OtpInput } from "react-native-otp-entry";

import {
  StyleSheet, View, Image, TouchableOpacity, KeyboardAvoidingView,
  Platform, ScrollView, Pressable, TouchableWithoutFeedback, Keyboard,
  Alert, useWindowDimensions,
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
  Card
} from "react-native-paper";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Formik, replace } from "formik";
import * as Yup from "yup";
// import * as Notifications from "expo-notifications"
import CountryCodeModal from "../../Component/CountryCodeModal";
import AutoSlidingCarousel from "../../Component/AutoSlidingCarousel";
import SetpasswordModal from "../../Components/Modal/SetpasswordModal";
import UserDataContext from "../../Store/UserDataContext";
import { AuthContext } from "../../Store/AuthContext";
// import { useTranslation } from "react-i18next";

const EnterNumberScreen = ({ navigation, route, setIsForgetPasswordState }) => {

  const isForgetPassword = route?.params?.isForgetPassword || false;

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
  const { login, isAuthenticated, storeData, setLoginDetail, handleLogin } =
    useContext(AuthContext);
    const [idToken,setIdToken]=useState(null);
  // const [phoneNumber, setPhoneNumber] = useState('');

  const Validation = Yup.object().shape({
    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^[0-9]+$/, "Phone number must be numeric")
      .min(10, "Phone number must be at least 10 digits")
      .max(10, "Phone number can be at most 10 digits")
      // .test(
      //   "check-number-availability",
      //   "Number is already registered. Try a different number.",
      //   async (value) => {
      //     if (value && value.length === 10) {
      //       // Check if the number is already registered
      //       const isAvailable = await checkPhoneNumberAvailability(value);
      //       console.log("VALUE IN PRESENT IS SSS123", isAvailable);
      //       return isAvailable;
      //     }
      //     return true;
      //   }
      // ),
  });

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const tokenCall = await AsyncStorage.getItem("FCMToken");
        setFCMToken(tokenCall);
        console.log("FCMToken", JSON.parse(tokenCall));
      } catch (err) {
        console.error("failed to get token");
      }
    };
    fetchToken();
  }, []);
  const checkPhoneNumberAvailability = async (phoneNumber) => {
    console.log("Enter number is ", phoneNumber);
    try {
      const response = await readApi(`users/getUserByMobile/${phoneNumber}`);
      if(response?.mobile===phoneNumber){
        return false
      }else{
        return true
      }

    } catch (error) {

      console.log("Unable to fetch data is ", error)
      return true
    }
    // return true;
  };

  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer > 1) {
            return prevTimer - 1;
          } else {
            clearInterval(interval);
            // Clear the interval when timer reaches 0
            setIsTimerRunning(false); // Stop the timer

            // if (threeTimer) {
            //   resetCount();
            // }
            return 0; // Ensure timer is set to 0
          }
        });
      }, 1000);
    }

    return () => {
      clearInterval(interval); // Clear interval on unmount or when dependencies change
    };
  }, [isTimerRunning, timer]);

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
        setIsLoading(true)
        // showSnackbar("User signed out successfully (19.0.0)", "success");
        await auth().signOut();
        //log.info('User signed out successfully');
      } catch (error) {
        console.error("Error signing out:", error);
        // showSnackbar("User signed out failed (19.0.0)", "error");
      }finally{
        setIsLoading(false)
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
        // const idToken = await user.getIdToken();
        setIdToken(await user.getIdToken());
        console.log("debugg55555", user);
        // const fToken=await AsyncStorage.getItem("FCMToken");
        // Alert.alert("Success", "Auto-verified successfully!");
        let pNumber = user.phoneNumber.replace("+91", "");
        // const response= await postData(pNumber,fToken,idToken);
        showSnackbar("Login successfully!", "success");
        setPasswordModalVisible(true);

      }
    });

    return subscriber;
    // Unsubscribe on cleanup
  }, []);

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


  const postData = async (password, isForgetPassword,navigation) => {
    setIsLoading(true);
    console.log("FCMToken:", FCMToken);
    const payload = {
      mobile: phoneNumber,
      password,
      idToken:idToken,
      fcmtokens:[FCMToken]
    };

    console.log("Payload:", payload);

    try {
      if (payload?.mobile) {
        let apiEndpoint =`users/signUp`;

        const response = await createApi(apiEndpoint, payload);
        console.log(`${isForgetPassword ? "Forgot Password" : "Sign-Up"} Response:`, response);

        await saveUserData(response);
        await handleLogin({mobile:response?.user?.mobile,password:payload?.password},navigation);
        await AsyncStorage.setItem("updatedPassword", password);
        if (isForgetPassword) {
          setIsForgetPasswordState(true);
        }

        return true;
      }
    } catch (error) {
      console.error("Error:", error);
      return false;
    } finally {
      setIsLoading(false);
      alert("Password reset successfully!");
    }
  };



  const handleResendOTP = () => {
    setTimer(30); // Reset the timer
    // Logic for resending OTP
    sendOtp("+91" + phoneNumber);
  };
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`; // Adds leading zero to seconds if < 10
  };
  const startTimer = (timer) => {
    setTimer(timer); // Set timer to 2:30 (150 seconds)
    setIsTimerRunning(true); // Start the timer
  };

  // Step 1: Send OTP
  const sendOtp = async (phoneNumber) => {
    try {
      setIsLoading(true);
      console.log("debugg22222");
      // log.info("debugg22222");

      startTimer(30); // Start the timer
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
        setIdToken(idToken);
        console.log("debugg77777 pra", user, idToken);
        setPasswordModalVisible(true);


        // const isIdTokenValidate = await idTokenValidate(idToken);

        // if (isIdTokenValidate) {

        // }
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

                  </View>
                </ScrollView>
              </View>
            ) : (
              <>
                {/* {!isForgetPassword && (
                  <View style={styles.topSection}>
                    <AutoSlidingCarousel
                      height={400}
                      carouselItems={carouselItems}
                      fromScreen={"EnterNumber"}
                    />
                  </View>
                )} */}



                  <View style={styles.container}>

                    <View style={[styles.topHeader,{height:isForgetPassword ? "35%" : "40%"}]}>
                      <Image source={require("../../../assets/aaaa_transparent.png")} style={styles.logo} />
                      {/* <Text style={styles.appName}>WERTONE</Text>
                      <Text style={styles.tagline}>Billing Software</Text> */}
                    </View>

                  </View>

                {/* <View style={styles.loginSection}> */}
               <View style={[styles.loginSection, { height: isForgetPassword ? "70%" : "65%" }]}>

                  <ScrollView
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="always"
                  >
                    <View style={{ flex: 1, justifyContent: "space-around" }}>
                      <View style={{ gap: 20 }}>
                        <Text style={styles.heading}>
                          {isForgetPassword ? "Forgot Password" : "Welcome to QwikBill"}
                        </Text>
                        <Text style={{
                           fontFamily: fontFamily.medium,
                            fontSize: fontSize.label,
                             marginHorizontal: 5,
                             color:"#777",
                             marginTop:-8
                             }}>
                          {isForgetPassword ? "Enter your registered mobile number to recieve a password reset OTP." : null}
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
                                    fontFamily: fontFamily.medium,
                                    fontSize: fontSize.labelMedium,
                                   marginHorizontal: 5
                                  }
                                }
                              >
                                {t("Mobile Number")}
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
                                    style={{ marginLeft: 8 }}
                                  />
                                </TouchableOpacity>
                                <Divider
                                  style={{
                                    height: "60%", // Adjust height as needed
                                    width: 1,

                                    backgroundColor: "#ddd",
                                    marginHorizontal: 6,
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

                                <Button
                                  // style={styles.button}
                                  onPress={handleSubmit}
                                  disabled={isTimerRunning && timer > 0 || !isValid || !dirty || !values.phone}

                                  style={[
                                    styles.button,
                                    { borderRadius: 10 },
                                    !isValid || !dirty || !values.phone
                                      ? { backgroundColor: "#d3d3d3" }
                                      : { backgroundColor: "#1E90FF" },
                                  ]}
                                  mode="contained"

                                >
                                  <Text style={{
                                    fontFamily: fontFamily.bold,
                                    fontSize: fontSize.labelMedium,
                                    color: "#fff"
                                  }}>

                                    {isForgetPassword ? "Send OTP" : "Login with OTP"}
                                  </Text>
                                </Button>
                                {/* </TouchableOpacity> */}
                                {isForgetPassword ?
                                  <Text
                                    style={{
                                      color: "#1E90FF",
                                      alignSelf: "center",
                                      fontFamily: fontFamily.medium,
                                      fontSize: fontSize.labelMedium,
                                      marginTop: 8
                                    }}
                                    onPress={() => navigation.navigate("login")}
                                  > Back to Login</Text> : null}
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

                      <View style={{ alignSelf: "center", marginHorizontal: 25, marginBottom: 40, alignItems: "center" }}>
                        <Text style={{ color: "#777", fontFamily: fontFamily.medium, textAlign: "center" }}>
                          {!isForgetPassword ?
                            <Text
                              style={{
                                color: "#777",
                                fontFamily: fontFamily.medium,
                                fontSize: fontSize.label,
                                textAlign: "center"
                              }}>
                              By signing in , you are agree to
                            </Text>
                            :
                            <Text style={{
                              color: "#777",
                              fontFamily: fontFamily.medium,
                              fontSize: fontSize.label,
                              textAlign: "center"
                            }}>
                              By resetting your password , you agree to our
                            </Text>}

                          <Text
                            style={{
                              color: "#1e90ff",
                            }}
                            onPress={() =>
                              navigation.navigate("Policies", {
                                // webUri: "https://rajeshpal.online/privacy-policy",
                                webUri: `${NORM_URL}/privacy-policy?view=mobile`,
                                headerTitle: "Privacy and Policies",
                              })
                            }
                          >
                            Terms and Policy.
                          </Text>
                        </Text>

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
        isForgetPassword={isForgetPassword}
        setIsForgetPasswordState={setIsForgetPasswordState}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    gap: 20,
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
    width: 340,
    backgroundColor: "#F4F4F4", // Light gray background for the input container
    borderRadius: 8, // Rounded corners for the entire container
    // paddingVertical: 10, // Vertical padding
    paddingHorizontal: 15, // Horizontal padding
    marginBottom: 15, // Margin around the input container
    marginTop: 5
  },
  countryCodeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 0,
    // paddingHorizontal: 8, // Padding inside the button
  },
  flagContainer: {
    width: 22, // Set a fixed width
    height: 18, // Set a fixed height
    //borderRadius: 16, // Half of width/height to make it a circle
   marginRight: 8, // Space between flag and code
  },
  flagText: {
    fontSize: 23,
    marginTop:-5,

  },
  countryCodeText: {
    fontSize: 16,
    // fontFamily: "Poppins-Regular",
    // Bold text for the country code
    color: "#000",
  },
  input: {
    flex: 1, // Take up the remaining space
    fontSize: fontSize.labelLarge,
    fontFamily: fontFamily.bold,
    color: "#000",
    backgroundColor: "transparent",

  },
  heading: {
    fontSize: 14,
    fontSize: fontSize.headingLarge,
    fontFamily: fontFamily.bold,
    //alignSelf: "center",
    color: "rgba(0,0,0,0.7)",
    marginTop:12,
    marginHorizontal:5
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

    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0, // Adjust the top value as needed
    width: "100%",
    //height: "70%",
    zIndex: 0,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    elevation: 5, // For Android shadow effect
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: 4 }, // Shadow direction
    shadowOpacity: 0.2, // Shadow transparency
    shadowRadius: 6, // Spread of the shadow
  },
  button: {
    borderRadius: 14,
    height: 48,
    width: "auto",
    justifyContent: "center",
    marginHorizontal: 10,
    marginVertical: 22
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

  topHeader: {
    position: "absolute",
    top: 0,
    width: "100%",
    //height: "35%",  // Adjust height as needed
    backgroundColor: "#0c3b73",
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  logo: {
    height: 250,
    width: 250,
    marginBottom: 40,
  },
  appName: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  tagline: {
    color: "white",
    letterSpacing: 2,
    fontSize: 14,
  },

  /* 🏠 White Card Container */
  cardContainer: {
    marginTop: "30%",  // Moves below the header
    alignSelf: "center",
    width: "90%",
    elevation: 5,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  card: {
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#fff",
    padding: 15,
  },
  cardContent: {
    alignItems: "center",
    gap: 10,
  },

  /* 🖼️ Image */
  forgetPassImageContainer: {
    marginVertical: 15,
  },
  verificationImage: {
    width: 120,
    height: 120,
  },

});

export default EnterNumberScreen;
