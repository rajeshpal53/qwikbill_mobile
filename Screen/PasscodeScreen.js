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
  Keyboard

} from "react-native";
import {
  Provider as PaperProvider,
  Text,
  TextInput,
  Button,
  Card,
} from "react-native-paper";
import Tooltip from "react-native-walkthrough-tooltip";
import { Formik } from "formik";
import * as Yup from "yup";
import TextBox from "react-native-password-eye";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Feather } from "@expo/vector-icons";
import { useContext, useState, useEffect } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AuthContext } from "../Store/AuthContext";
import * as LocalAuthentication from "expo-local-authentication";


export default function PasscodeScreen({ navigation }) {
  // const navigation = useNavigation();
  const { loginDetail, getData } = useContext(AuthContext);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [buttonsModes, setButtonsModes] = useState({
    passcodeButtonMode: false,
    domainButtonMode: true,
  });

  const [loginDetail1, setLoginDetail1] = useState(loginDetail);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [eyeOn, setEyeOn] = useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
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
    const handleLocalAuthentication = async () => {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate",
        fallbackLabel: "Enter Passcode",
      });

      if (result.success) {
        Alert.alert("Authenticated", "You have successfully authenticated");
        navigation.navigate("wertone");
      } else {
        Alert.alert("Authentication Failed", "Please try again");
      }
    };
    handleLocalAuthentication();
  }, []);

  const handleEyePress = () => {
    setSecureTextEntry(!secureTextEntry);
    setEyeOn(!eyeOn);
  };

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
  };

  const handleOnLoginPress = () => {
    navigation.navigate("wertone", { screen: "Home" });
  };

  return (
    <>
      <StatusBar style="light" backgroundColor={"#0c3b73"} />
      <SafeAreaView style={styles.SafeAreaView}>
      <KeyboardAvoidingView behavior="padding">
        <View style={styles1.overlay}></View>

        
            <View style={styles.scrollViewChild}>
              <View
                style={{
                  // flex:1,
                  // backgroundColor:"white",
                  height: "25%",
                  width: "50%",
                  alignItems: "center",
                }}
              >
                <View >
                <Image
                  source={require("../assets/logo-wertone.png")}
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

              <Card style={styles.card}>
                <Card.Content style={styles1.cardContent}>
                {!isKeyboardVisible&&
                  <View style={styles.myShopImageContainer}>
                    <Image
                      source={require("../assets/myShop.jpg")}
                      style={styles.myShopeImage}
                    ></Image>
                  </View>
                }

                  <View style={{ alignItems: "center", gap: 5 }}>
                    <Text variant="titleSmall">Welcome</Text>
                    <Text
                      variant="titleMedium"
                      style={{ color: "#392de0" }}
                    >{`${loginDetail1.name} ${loginDetail1.surname}`}</Text>
                  </View>

                  <View style={styles.buttonContainer}>
                    <Button
                      style={{
                        width: "50%",
                        backgroundColor: buttonsModes.passcodeButtonMode
                          ? "#6dbbc7"
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
                  </View>

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
                              placeholder="Enter App Passcode"
                              keyboardType="numeric"
                              secureTextEntry={secureTextEntry}
                            />
                          </View>

                          {/* second */}
                          <View style={{ justifyContent: "center" }}>
                            
                            <Tooltip    isVisible={tooltipVisible}
        content={
          <View style={styles.tooltipContent}>
            <Text style={styles.tooltipText} textColor="6dbbc7">
              pascode is used for prevent unautherized access.
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
                              size={25}
                              color="#6dbbc7"
                              onPress={()=>{ setTooltipVisible(true)}}
                            />
                          </Tooltip>
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
                                <Feather name="eye" size={25} color="#6dbbc7" />
                              ) : (
                                <Feather
                                  name="eye-off"
                                  size={25}
                                  color="#6dbbc7"
                                />
                              )}
                            </TouchableOpacity>
                          </View>
                                
                          <View />
                        </View>

                        <View style={{ width: "100%" }}>
                          <Button
                            textColor="white"
                            buttonColor="grey"
                            style={{ borderRadius: 0 }}
                            onPress={handleOnLoginPress}
                          >
                            Login
                          </Button>
                            
                        </View>
                      </View>
                    </Formik>
                  </View>
                  <TouchableOpacity onPress={()=>navigation.navigate("forgetPasscode")}>

                  <Text variant="titleSmall" style={{ color: "#6dbbc7" }}>
                    Forgot App Passcode?
                  </Text>
                    
                  </TouchableOpacity>
                  
                </Card.Content>
              </Card>

              <View style={{ height: "20%", width: 25 }}></View>
            </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    height: "55%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    marginHorizontal: 20,
    // backgroundColor: "yellow",
    borderRadius: 0,
  },
  img: {
    height: 100,
    width: 100,
    elevation: 2,
    alignSelf: "center",
    marginVertical: 10,
  },
  tooltip: {
    backgroundColor: 'white',
    borderColor: 'lightblue',
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
  myShopImageContainer: 
  { width: "30%", height: "20%", marginVertical:5},
  scrollViewChild: {
    // backgroundColor: "grey",
    // height: "100%",
    // height:"200px",
    height: 705,
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
    backgroundColor: 'white',

    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  tooltipText: {
    color: 'grey',
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
    height: "45%",
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
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 5,
    // height: "100%",
    flex: 1,
  },
});
