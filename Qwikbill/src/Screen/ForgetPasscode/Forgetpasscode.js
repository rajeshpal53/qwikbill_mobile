import { functions } from "lodash";
import {
  View,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  StatusBar,
  Keyboard,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import {
  Provider as PaperProvider,
  Text,
  Button,
  Card,
} from "react-native-paper";
import { TextInput, } from "react-native";

import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../Store/AuthContext";
import { createApi } from "../../Util/UtilApi";
import OTPInputView from "react-native-otp-entry";
import { fontSize, fontFamily } from "../../Util/UtilApi";
import { useSnackbar } from "../../Store/SnackbarContext";
//import { usePhoneOtp } from "../../Components/phoneOtp";
import { OtpInput } from "react-native-otp-entry"; // Updated dependency
import { useNavigation } from "@react-navigation/native";
//import { auth } from '../../firebase';
//import { firebaseAuth } from "../../firebase";
import { getApp } from '@react-native-firebase/app';

import {
  getAuth,
  signInWithPhoneNumber,
  signOut,
  onAuthStateChanged
} from '@react-native-firebase/auth';

function CustomerVerification({ loginDetail1 }) {
  const [text, setText] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState(""); // OTP input state
  const navigation = useNavigation();
  //const { sendOtp, confirmOtp, isLoading } = usePhoneOtp();
  const [isLoading, setIsLoading] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [phone, setPhone] = useState("");
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    console.log("OTP sent?", isOtpSent);
  }, [isOtpSent]);


  const handleGenerateOtp = async () => {
    if (phone.length !== 10) {
      Alert.alert('Invalid Input', 'Enter a valid 10-digit mobile number.');
      return;
    }

    const fullPhoneNumber = `+91${phone.trim()}`;
    console.log("Full Phone Number:", fullPhoneNumber);
    try {
      setIsLoading(true);

      const auth = getAuth(getApp());
      const confirmation = await signInWithPhoneNumber(auth, fullPhoneNumber);

      setConfirm(confirmation);
      setIsOtpSent(true);
      showSnackbar('OTP sent! Check your messages.', 'success');
    } catch (err) {
      console.log('OTP Error:', err);
      showSnackbar(err.message ?? 'Failed to send OTP', 'error');
    } finally {
      setIsLoading(false);
    }
  };


  const handleValidateOtp = async () => {
    if (!otp || otp.length !== 6) {
      showSnackbar("Enter the 6-digit OTP.", "error");
      return;
    }

    try {
      setIsLoading(true);
      await confirm.confirm(otp);
      Alert.alert("Success", "Logged in!", [
        { text: "OK", onPress: () => navigation.navigate("CreateNewPasscode") },
      ]);
    } catch (err) {
      showSnackbar("Invalid OTP. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };


  const handleMobileInputChange = (newText) => {
    // Allow only numbers, remove any non-digit characters
    const filteredText = newText.replace(/[^0-9]/g, "");
    setText(filteredText);
  };

  return (

    <View style={{}}>
      <View style={stylesVerify.cardContainer}>
        <Card style={stylesVerify.card}>
          <Card.Content style={stylesVerify.cardContent}>
            <View style={stylesVerify.forgetPassImageContainer}>
              <Image
                source={require("../../../assets/newVerify.png")}
                style={stylesVerify.myShopeImage}
              />
            </View>
            <View style={{ alignItems: "center", gap: 30 }}>
              <Text variant="headlineMedium" style={{ color: "rgba(0,0,0,0.8)", fontFamily: fontFamily.regular }}>
                Customer Verification
              </Text>
              <Text variant="labelSmall" style={{ color: "grey", textAlign: "center", fontFamily: fontFamily.medium }}>
                We will send you a one-time password on this registered mobile {loginDetail1 && loginDetail1.email} number.
              </Text>

              {!isOtpSent ? (

                <TextInput
                  style={stylesVerify.input}
                  placeholder="Enter Mobile Number"
                  placeholderTextColor="#777"
                  maxLength={10}
                  value={phone}
                  keyboardType="number-pad"
                  onChangeText={(txt) => setPhone(txt.replace(/[^0-9]/g, ""))}
                  underlineColorAndroid="transparent"
                />

              ) : (
                <OtpInput
                  numberOfDigits={6} // Changed to 6 digits
                  onTextChange={(otpValue) => setOtp(otpValue)}
                  theme={{
                    containerStyle: { marginBottom: 20, },
                    pinCount: 6,
                    // focusColor: "#0c3b73", // Ensuring focus color is applied
                    // focusedBorderColor: "#0c3b73",
                    selectedTextColor: "darkblue",
                    placeholderTextColor: "#0c3b73",
                    focusedPinCodeContainerStyle: {
                      borderColor: "#0c3b73"
                    },
                    pinCodeTextStyle: {
                      color: "rgba(0,0,0,0.6)",
                      fontFamily: "Poppins-Medium",
                      marginBottom: -8
                    },
                    focusStickStyle: {
                      backgroundColor: "#0c3b73"
                    },

                    textInputStyle: {
                      width: 45,
                      height: 45,
                      fontSize: 18,
                      borderRadius: 12,
                      textAlign: "center",
                      borderWidth: 1,
                      borderColor: "#0c3b73",
                      backgroundColor: "#0c3b73",
                      elevation: 2,
                      color: "#0c3b73", // Ensure text color matches border

                    },
                    focusedTextInputStyle: {
                      borderColor: "#0c3b73", // Override the focus color
                      borderWidth: 2, // Ensure the outline is properly visible
                      shadowColor: "#0c3b73", // Optional: Shadow to match focus
                      shadowOffset: { width: 1, height: 1 },
                      shadowOpacity: 0.5,
                      shadowRadius: 2,

                    },
                  }}
                />

              )}


              <Button
                mode="contained"
                style={{
                  width: "50%",
                  borderRadius: 12,
                  paddingVertical: 3,
                  backgroundColor: "#14447d",
                  fontFamily: fontFamily.thin,
                  marginVertical: 5
                }}
                onPress={isOtpSent ? handleValidateOtp : handleGenerateOtp}

              >
                <Text style={{ color: "#fff", fontSize: fontSize.labelMedium, fontFamily: fontFamily.medium }}>{isOtpSent ? "Validate OTP" : "Generate OTP"}</Text>
              </Button>
            </View>
          </Card.Content>
        </Card>
      </View>
    </View>

  );
}




function ValidateOTP({ navigation, otpValue }) {
  const [otp, setOtp] = useState("");
  const [counter, setCounter] = useState(30);

  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [counter]);

  const handleVerifyOtp = () => {
    if (otpValue === otp) {

      navigation.navigate("CreateNewPasscode");
      console.log("OTP entered:", otp);
    } else {
      Alert.alert("not a valid otp");
    }
  };

  const handleResendOtp = () => {
    // Resend OTP logic here
    setCounter(30); // Reset counter
  };
  return (
    <View style={stylesResend.cardContainer}>
      <Card style={stylesResend.card}>
        <Card.Content style={stylesResend.cardContent}>
          <View style={stylesResend.myShopImageContainer}>
            <Image
              source={require("../../../assets/emailOTP.jpg")}
              style={stylesResend.myShopeImage}
            ></Image>
          </View>
          <View style={{ gap: 5 }}>
            <Text variant="headlineMedium"
              style={{ textAlign: "center" }}>
              OTP Verification
            </Text>
            <Text style={stylesResend.instruction}>
              Please check your mobile inbox for OTP
            </Text>
            <TextInput
              style={{}}
              placeholder="Enter OTP"
              keyboardType="numeric"
              value={otp}
              onChangeText={setOtp}
              maxLength={6}
            />
            <Text style={stylesResend.counter}>
              Your OTP will expire in {counter} sec(s)
            </Text>
            <Button
              onPress={handleResendOtp}
              disabled={counter > 0}
              labelStyle={stylesResend.resendButton}
            >
              Didn't Receive The OTP? Resend OTP
            </Button>
            <Button mode="contained" onPress={handleVerifyOtp}>
              Verify OTP
            </Button>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}

function Forgetpasscode({ navigation }) {
  const [isOtp, setIsOtp] = useState(false);
  const [loginDetail1, setLoginDetail1] = useState(loginDetail);
  const { loginDetail, getData } = useContext(AuthContext);
  const [finalScreen, setFinalScreen] = useState(false);
  const [otpValue, setOtpValue] = useState();
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;

  console.log("whindow height , ", windowHeight);
  console.log("whindow height 45% , ", windowHeight * 0.4);
  const overlayHeight = windowHeight * 0.35;
  useEffect(() => {
    async function loginDetailHandler() {
      try {
        const newValue = (await getData("loginDetail")) || "";

        setLoginDetail1(newValue);
      } catch {
        console.log("failed get data ");
      } finally {
        // setNewLoading(false);
      }
    }

    loginDetailHandler();
  }, [loginDetail]);
  console.log("log isss", loginDetail1);
  return (
    <>
      <StatusBar style="light" backgroundColor={"#0c3b73"} />
      <SafeAreaView style={styles.SafeAreaView}>
        {/* <KeyboardAvoidingView behavior="padding"> */}
        <View style={[styles.overlay, { height: overlayHeight }]}></View>
        <View style={styles.scrollViewChild}>
          <View
            style={{
              // flex:1,
              // backgroundColor:"orange",
              height: "25%",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",

            }}
          >
            <View style={{}}>
              <Image
                source={require("../../../assets/aaaa_transparent.png")}
                style={styles.img}
              />
            </View>

          </View>
          {isOtp ? (
            <ValidateOTP navigation={navigation} otpValue={otpValue} />
          ) : (
            <CustomerVerification
              loginDetail1={loginDetail1}
              setIsOtp={setIsOtp}
              setOtpValue={setOtpValue}
            />
          )}
        </View>
        {/* </KeyboardAvoidingView> */}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    top: 0, // Adjust the top value as needed
    width: "100%",
    // height: 250,
    backgroundColor: "#0c3b73",
    // zIndex: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  overlayText: {
    color: "white",
    fontSize: fontSize.labelLarge,
  },
  cardContent: {
    // backgroundColor: "red",
    paddingTop: 0,
    display: "flex",
    alignItems: "center",

    // height: "100%",
    flex: 1,
  },
  card: {
    height: "75%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,

    // backgroundColor: "yellow",
    borderRadius: 0,
  },
  instruction: {
    fontSize: 16,
    marginVertical: 16,
    textAlign: "center",
  },
  counter: {
    fontSize: 16,
    color: "darkblue",
    textAlign: "center",
    marginBottom: 16,
  },
  resendButton: {
    color: "grey",
    textAlign: "center",
    marginBottom: 16,
  },
  img: {
    height: 220,
    width: 220,
    elevation: 2,
    alignSelf: "center",
    marginVertical: 12,
  },
  tooltip: {
    backgroundColor: "white",
    borderColor: "lightblue",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  SafeAreaView: {
    flex: 1,
    // position:"absolute",
    // backgroundColor: "pink",
    // minHeight:"100vh",
    // width:"50%",
    // height:,
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingTop: 0,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
  },
  myShopeImage: {
    width: "100%",
    height: "100%",
  },
  myShopImageContainer: {
    width: "30%",
    height: "20%",
    marginVertical: 5,
  },
  scrollViewChild: {
    // backgroundColor: "orange",
    // height: 705,
    // height: 600,
    // height: "100%",
    // display: "flex",
    // flex: 1,
    alignItems: "center",
    // paddingHorizontal: 12,
    // width:"100%",
  },
  scrollViewStyle: {
    // backgroundColor:"blue",
    display: "flex",
    width: "100%",
    height: "100%",
  },
  tooltipContent: {
    backgroundColor: "white",
    borderColor: "lightblue",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  tooltipText: {
    color: "#6dbbc7",
  },
  // flex:1
});

//-----------------------------------------------------

const stylesVerify = StyleSheet.create({
  cardContent: {
    paddingTop: 0,
    alignItems: "center",
    gap: 10,
    flex: 1,
    backgroundColor: "#fff",

  },
  card: {
    alignItems: "center",
    borderRadius: 0,
  },
  img: {
    height: 120,
    width: 120,
    elevation: 2,
    alignSelf: "center",
    marginVertical: 10,
  },
  myShopeImage: {
    width: 175,
    height: 175,
  },
  forgetPassImageContainer: {
    backgroundColor: "#fff"
    //  marginVertical: 3
  },
  cardContainer: {
    height: 500,
    borderRadius: 35, // Adjust for more or less curve
    overflow: "hidden", // Ensures content inside respects borderRadius
    backgroundColor: "#fff", // Ensure background color is set
    elevation: 5, // For Android shadow effect
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginHorizontal: 11,


  },
  input: {
    width: 260,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc", // Subtle gray border for a classic look
    borderRadius: 10, // Soft rounded edges for a modern touch
    paddingHorizontal: 15,
    fontSize: fontSize.labelLarge,
    fontFamily: "Arial", // Change to your preferred font
    backgroundColor: "#fff",
    color: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3, // Minimal shadow effect for Android
  },
  inputStyle: {
    width: 45,
    height: 45,
    fontSize: 18,
    borderRadius: 12,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#0c3b73",
    backgroundColor: "#0c3b73",
    elevation: 2,
    color: "#0c3b73", // Ensure text color matches border

  },
  focusedInputStyle: {

    borderColor: "#0c3b73", // Override the focus color
    borderWidth: 2, // Ensure the outline is properly visible
    shadowColor: "#0c3b73", // Optional: Shadow to match focus
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,

  },

});

//-----------------------------------------------------

const stylesResend = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    top: 0, // Adjust the top value as needed
    width: "100%",
    // height: 250,
    backgroundColor: "#0c3b73",
    // zIndex: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  overlayText: {
    color: "white",
    fontSize: 16,
  },
  cardContent: {
    paddingTop: 0,
    alignItems: "center",
    gap: 20,
    // flex: 1,
  },
  card: {
    alignItems: "center",
    borderRadius: 0,
    // flex:1,
  },
  instruction: {
    fontSize: 16,
    marginVertical: 16,
    textAlign: "center",
  },
  counter: {
    fontSize: 16,
    color: "darkblue",
    textAlign: "center",
    marginBottom: 16,
  },
  resendButton: {
    color: "grey",
    textAlign: "center",
    marginBottom: 16,
  },
  img: {
    height: 100,
    width: 100,
    elevation: 2,
    alignSelf: "center",
    marginVertical: 10,
  },
  tooltip: {
    backgroundColor: "white",
    borderColor: "lightblue",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  SafeAreaView: {
    flex: 1,
    // position:"absolute",
    // backgroundColor: "pink",
    // minHeight:"100vh",
    // width:"50%",
    // height:,
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingTop: 0,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
  },
  myShopeImage: {
    width: "100%",
    height: "100%",
  },
  myShopImageContainer: {
    width: "30%",
    height: "20%",
    marginVertical: 5,
  },
  cardContainer: {
    backgroundColor: "white",
    height: 420,
    // padding:0,
    // padding:0,
  },
  scrollViewStyle: {
    display: "flex",
    width: "100%",
    height: "100%",
  },
  tooltipContent: {
    backgroundColor: "white",
    borderColor: "lightblue",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  tooltipText: {
    color: "#6dbbc7",
  },
  // flex:1
});

export default Forgetpasscode;
