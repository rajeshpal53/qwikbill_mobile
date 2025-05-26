import {
  View,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ScrollViewComponent,
  ScrollViewBase,
  SafeAreaView,
  StatusBar,
  Keyboard,
} from "react-native";
import {
  Provider as PaperProvider,
  Text,
  TextInput,
  Button,
  Card,
} from "react-native-paper";
// import Tooltip from "react-native-walkthrough-tooltip";
import { Formik } from "formik";
import * as Yup from "yup";
import TextBox from "react-native-password-eye";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useContext, useState, useEffect } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AuthContext } from "../Store/AuthContext";
import * as LocalAuthentication from "expo-local-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Linking } from "react-native";
import { usePasskey } from "../Store/PasskeyContext";
import { LoginTimeContext } from "../Store/LoginTimeContext";
import { useWindowDimensions } from "react-native";
export default function PasscodeScreen({ navigation }) {
  // const navigation = useNavigation();
  const { lastLoginTime, storeCurrentTime,
    setCurrentAsLastTime, } =
    useContext(LoginTimeContext);
  let { width, height } = useWindowDimensions();
  // height = 0.99*height
  const { loginDetail, getData } = useContext(AuthContext);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [buttonsModes, setButtonsModes] = useState({
    passcodeButtonMode: true,
    domainButtonMode: false,
  });
  const { passkey } = usePasskey();
  const [enteredPasscode, setenteredPasscode] = useState("");
  const [loginDetail1, setLoginDetail1] = useState(loginDetail);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [eyeOn, setEyeOn] = useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);




  console.log("passkey in passCode screen",passkey)
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    handleLocalAuthentication();
  }, []);

  useEffect(() => {
    console.log("login details are ",loginDetail)
    async function loginDetailHandler() {
      try {
        const newValue = (await getData("loginDetail")) || "";

        setLoginDetail1(newValue);
        console.log("login detail 1 isss",loginDetail1)

      } catch {
        console.log("failed get data ");
      } finally {
        // setNewLoading(false);
      }
    }

    loginDetailHandler();
  }, [loginDetail]);

  // const storeTimes = async() => {
  //   const previousLoginTime = await AsyncStorage.getItem("currentLoginTime");

  //   if(previousLoginTime){
  //     await AsyncStorage.setItem("lastLoginTime", previousLoginTime);
  //     console.log("previousTime , " , await AsyncStorage.getItem("lastLoginTime"));
  //   }
  //  const currentLoginTime = moment().format('D MMM YYYY, h:mm A');
  //  await AsyncStorage.setItem("currentLoginTime", currentLoginTime);

  //  console.log("currentTime , " , await AsyncStorage.getItem("currentLoginTime"));

  //  return {
  //   previousLoginTime: (previousLoginTime || currentLoginTime)
  // }

  // }

  const handleNavigation = async () => {
    // const {previousLoginTime} = await storeTime();
    // storeTime();

    if (enteredPasscode.length !== 4){
      return Alert.alert("Invalid Passcode", "Passcode must be 4 digits.");

    }
    await storeCurrentTime();

    if (enteredPasscode === passkey) {
      if (loginDetail1.isshop === false) {
        // navigation.navigate("CreateShopScreen", {
        //   isHome: true,
        // });
        navigation.navigate("wertone", {
          screen: "Home",
          // params : {previousLoginTime}
        });
      } else {
        navigation.navigate("wertone", {
          screen: "Home",
          // params : {previousLoginTime}
        });
      }
    } else {
      return Alert.alert("failed to login use phone lock or retry");
    }
  };

  const handleLocalAuthentication = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate",
      fallbackLabel: "Enter Passcode",
    });

    if (result.success) {
      // const {previousLoginTime} = await storeTimes();
      await storeCurrentTime();
      if (loginDetail1.isshop === false) {
        navigation.navigate("CreateShopScreen");
      } else {
        navigation.navigate("wertone", {
          screen: "Home",
          // params : {previousLoginTime}
        });
      }
    } else {
      Alert.alert("Authentication Failed", "Please try again");
    }
  };

  const handleEyePress = () => {
    setSecureTextEntry(!secureTextEntry);
    setEyeOn(!eyeOn);
  };

  const handleButtonPress = (button) => {
    setButtonsModes((prevstate) => {
      if (button === "passcode" && !prevstate.passcodeButtonMode) {
        return {
          passcodeButtonMode: true,
          domainButtonMode: false,
        };
      } else if (button === "domain" && !prevstate.domainButtonMode) {
        return {
          passcodeButtonMode: false,
          domainButtonMode: true,
        };
      } else {
        return prevstate;
      }
    });

    if (button === "domain") {
      // Open the URL in the default browser
      Linking.openURL("https://www.google.com").catch((err) =>
        console.error("Failed to open URL:", err)
      );
    }
  };

  const handleOnLoginPress = () => {
    handleNavigation();
    // const {previousLoginTime, currentLoginTime} = storeTime();
    // navigation.navigate("wertone", {
    //   screen: "Home",
    //   params : {previousLoginTime},
    //  });
  };

  return (
    <>
      <StatusBar style="light" backgroundColor={"#0c3b73"} />
      <SafeAreaView style={styles.SafeAreaView}>
        <KeyboardAvoidingView style={{ flex: 1 }}>
          <View style={[styles1.overlay, { height: 0.3 * height }]}></View>

          <ScrollView>
            <View style={[styles.scrollViewChild, { height: height }]}>
              <View
                style={{
                  // flex:1,
                  // backgroundColor: "orange",
                  // height: "25%",
                  flex: 1,
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <View style={{ flex: 2 }}>
                  <Image
                    source={require("../../assets/aaaa_transparent.png")}
                    style={styles.img}
                  />
                </View>

                {/* <View
                  style={{
                    // backgroundColor:"pink",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <Text
                    variant="titleMedium"
                    style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
                  >
                    WERTONE
                  </Text>
                  <Text style={{ color: "white", letterSpacing: 3 }}>
                    Billing Software
                  </Text>
                </View> */}
                
              </View>

              <Card style={styles.card}>
                <Card.Content style={styles1.cardContent}>
                  {!isKeyboardVisible && (
                    <View style={styles.myShopImageContainer}>
                      <Image
                        source={require("../../assets/shopImg1.jpeg")}
                        style={styles.myShopeImage}
                      ></Image>
                    </View>
                  )}

                  <View style={{ alignItems: "center", gap: 6 , }}>
                    <Text variant="titleMedium">Welcome</Text>
                    <Text
                      variant="titleMedium"
                      style={{ color: "#392de0" }}
                    >{`${loginDetail1?.user?.name}${loginDetail1?.user?.surname || ""}`}</Text>
                  </View>

                  <View style={{ gap: 5 }}>
                    {/* <View style={styles.buttonContainer}>
                      <Button
                        style={{
                          width: "50%",
                          backgroundColor: buttonsModes.passcodeButtonMode
                            ? "#26a0df"
                            : "transparent",
                        }}
                        mode={
                          buttonsModes.passcodeButtonMode
                            ? "contained"
                            : "contained-disabled"
                        }
                        onPress={() => handleButtonPress("passcode")}
                      >
                        PASSCODE
                      </Button>
                      <Button
                        style={{
                          width: "50%",
                          fontSize: 12,
                          backgroundColor: buttonsModes.domainButtonMode
                            ? "#6dbbc7"
                            : "transparent",
                        }}
                        mode={
                          buttonsModes.domainButtonMode
                            ? "contained"
                            : "contained-disabled"
                        }
                        onPress={() => handleButtonPress("domain")}
                      >
                        DOMAIN
                      </Button>
                    </View> */}

                    <View>
                      <Formik

                      // initialValues={{ email: '', password: '' }}
                      // validationSchema={validationSchema}
                      // onSubmit={handleLogin}
                      >
                        <View
                          style={{
                            display: "flex",
                            gap: 20,
                          }}
                        >
                          <View
                            style={{
                              width: "100%",
                              display: "flex",
                              flexDirection: "row",
                              gap: 10,
                            }}
                          >
                            {/* first */}
                            <View style={{ width: "72%" }}>
                              <TextInput
                                style={{ backgroundColor: "#f4f4f9" }}
                                placeholder="Enter app passcode"
                                keyboardType="numeric"
                                secureTextEntry={secureTextEntry}
                                onChangeText={(value) => {
                                  setenteredPasscode(value);
                                }}
                                maxLength={4}
                              />
                            </View>

                            {/* second */}
                            <View style={{ justifyContent: "center" }}>
                              {/* <Tooltip
                                isVisible={tooltipVisible}
                                content={
                                  <View style={styles.tooltipContent}>
                                    <Text
                                      style={styles.tooltipText}
                                      textColor="6dbbc7"
                                    >
                                      pascode is used for prevent unautherized
                                      access.
                                    </Text>
                                  </View>
                                }
                                placement="bottom"
                                onClose={() => setTooltipVisible(false)}
                                arrowSize={{ width: 16, height: 8 }}
                                backgroundColor="transparent"
                              >
                                <AntDesign
                                  name="infocirlceo"
                                  size={20}
                                  color="#6dbbc7"
                                  onPress={() => {
                                    setTooltipVisible(true);
                                  }}
                                />
                              </Tooltip> */}
                            </View>

                            {/* third */}

                            <View
                              style={{
                                // backgroundColor:"white",
                                justifyContent: "center",
                              }}
                            >
                              <TouchableOpacity onPress={handleEyePress}>
                                {eyeOn ? (
                                  <Feather
                                    name="eye"
                                    size={20}
                                    color="#6dbbc7"
                                  />
                                ) : (
                                  <Feather
                                    name="eye-off"
                                    size={20}
                                    color="#6dbbc7"
                                  />
                                )}
                              </TouchableOpacity>
                            </View>

                            <View />
                          </View>

                          <View style={{ width: "100%",marginTop:5 }}>
                            <Button
                              textColor="white"
                             // buttonColor="grey"
                            // buttonColor={enteredPasscode.length === 4 ? "grey" : "#26a0df"}
                             style={[{ backgroundColor:enteredPasscode.length === 4 ? "#26a0df" : "rgba(0,0,0,0.3)",}]}
                              onPress={handleOnLoginPress}
                              disabled={enteredPasscode.length !== 4}
                            >
                              Login
                            </Button>
                          </View>
                        </View>
                      </Formik>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("forgetPasscode")}
                  >
                    <Text variant="titleSmall" style={{ color: "#6dbbc7" ,marginTop:8}}>
                      Forgot app passcode?
                    </Text>
                  </TouchableOpacity>
                </Card.Content>
              </Card>
              <View style={styles.loginWithFingerContainer}>
                <View style={styles.loginWithFinger}>
                  <Text variant="titleSmall" style={{ color: "#6dbbc7" }}>
                    Login with fingerprint
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      handleLocalAuthentication();
                    }}
                    style={{ justifyContent: "center", marginTop: "20" }}
                  >
                    <Ionicons
                      name="finger-print"
                      size={50}
                      color="#26a0df"
                      style={{ justifySelf: "center", marginTop: 20 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    // height: "70%",
    flex: 3,
    // justifyContent: "center",
    // alignItems: "center",
    // zIndex: 1,
    // marginHorizontal: 9,
    // backgroundColor: "yellow",
    borderRadius: 8,
  },
  img: {
    height: 175,
    width: 200,
   // elevation: 2,
    alignSelf: "center",
   
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
    // backgroundColor: "pink",
    paddingTop: 0,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
  },
  myShopeImage: {
    width: "100%",
    height: "100%",
    objectFit: "fill",
  },
  myShopImageContainer: {
    width: "35%",
    height: "25%",
    // marginTop: 10,
  },
  scrollViewChild: {
    // backgroundColor: "grey",
    // height: "100%",
    // height:"200px",
    // height: 705,
    // display: "flex",
    // flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
  scrollViewStyle: {
    // backgroundColor:"blue",
    display: "flex",

    width: "100%",
    height: "100%",
    // flex:1
  },
  tooltipContent: {
    backgroundColor: "white",

    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  tooltipText: {
    color: "grey",
  },
  loginWithFingerContainer: {
    flex: 1,
    // marginTop:40
    // paddingVertical: 0,
    width: "100%",
  },
  loginWithFinger: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    // marginTop:40
    paddingVertical: 0,
    width: "100%",
  },
});

const styles1 = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // card: {
  //   width: 300,
  //   height: 200,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   zIndex: 1,
  // },
  overlay: {
    position: "absolute",
    top: 0, // Adjust the top value as needed
    // left: 0,
    // right:0,
    // transform: [{ translateX: -75 }, { translateY: -75 }], // Center the overlay
    width: "100%",
    // height: 250,
    // height: "35%",
    backgroundColor: "#0c3b73",
    zIndex: 0,
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
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    overflow: "scroll",
    flex: 1,
  },
});
