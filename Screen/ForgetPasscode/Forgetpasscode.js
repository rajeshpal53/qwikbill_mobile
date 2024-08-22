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
  TextInput,
  Button,
  Card,
} from "react-native-paper";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../Store/AuthContext";
import { createApi } from "../../Util/UtilApi";

function CustomerVerification({ loginDetail1, setIsOtp, setOtpValue }) {
  const [text, setText] = useState("");
  const genrateOTP = async () => {
    const obj = { email: text };
    console.log(obj);
    if (text === loginDetail1.email) {
      const response = await createApi("api/sendotp", obj, {
        "Content-Type": "application/json",
      });
      setOtpValue(response.result);
      console.log(response.result);
      setIsOtp(true);
    }
  };
  return (
    <ScrollView contentContainerStyle={{ backgroundColor:"gray", elevation:2}}>
    <View style={stylesVerify.cardContainer}>
      <Card style={stylesVerify.card}>
        <Card.Content style={stylesVerify.cardContent}>
          <View style={stylesVerify.forgetPassImageContainer}>
            <Image
              source={require("../../assets/forgetpassword.jpeg")}
              style={stylesVerify.myShopeImage}
            ></Image>
          </View>
          <View
            style={{
              // backgroundColor:"orange",
              alignItems: "center",
              gap: 30,
            }}
          >
            <Text variant="headlineMedium" style={{ color: "black" }}>
              Customer Verification
            </Text>
            <Text
              variant="labelSmall"
              style={{ color: "grey", textAlign: "center" }}
            >
              we will send you one time pass word on this email
              {loginDetail1 && loginDetail1.email} address
            </Text>
            <TextInput
              placeholder="Email Adress"
              value={text}
              style={{ alignSelf: "stretch" }}
              onChangeText={(newText) => setText(newText)}
            />
            <Button
              mode="contained"
              style={{ width: "50%" }}
              onPress={genrateOTP}
            >
              {" "}
              Genrate OTP
            </Button>
          </View>
        </Card.Content>
      </Card>
    </View>
    </ScrollView>
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
              source={require("../../assets/emailOTP.jpg")}
              style={stylesResend.myShopeImage}
            ></Image>
          </View>
          <View style={{ gap:5}}>
            <Text variant="headlineMedium" 
            style={{ textAlign:"center" }}>
              OTP Verification
            </Text>
            <Text style={stylesResend.instruction}>
              Please check your mobile inbox for OTP
            </Text>
            <TextInput
              style={{ }}
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
  console.log(loginDetail1);
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
                alignItems: "center",
                // marginBottom: 12,
              }}
            >
              <View style={{}}>
                <Image
                  source={require("../../assets/logo-wertone.png")}
                  style={styles.img}
                />
              </View>
              <View
                style={{
                  // backgroundColor:"pink",
                  alignItems: "center",
                }}
              >
                <Text variant="titleLarge" style={{ color: "white" }}>
                  WERTONE
                </Text>
                <Text style={{ color: "white", letterSpacing: 3 }}>
                  Biling Software
                </Text>
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
    fontSize: 16,
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
    height: 70,
    width: 70,
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
    // backgroundColor: "red",
    paddingTop: 0,
    alignItems: "center",
    gap: 20,
    flex: 1,
  },
  card: {
    alignItems: "center",
    borderRadius: 0,
  },
  img: {
    height: 100,
    width: 100,
    elevation: 2,
    alignSelf: "center",
    marginVertical: 10,
  },
  myShopeImage: {
    width: "100%",
    height: "100%",
  },
  forgetPassImageContainer: {
    width: "30%",
    height: "20%",
    marginVertical: 5,
  },
  cardContainer: {
    backgroundColor: "grey",
    height: 390,
    // marginTop:5,
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
    backgroundColor: "grey",
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
