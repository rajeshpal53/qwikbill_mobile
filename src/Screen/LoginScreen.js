import { React, useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
  PixelRatio,
} from "react-native";
import { Text, TextInput, Button, Card, Divider } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi } from "../Util/UtilApi";
import { usePasskey } from "../Store/PasskeyContext";

import axios from "axios";
import { useWindowDimensions } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { ActivityIndicator } from "react-native-paper";
import { useSnackbar } from "../Store/SnackbarContext";
import SetpasswordModal from "../Modal/SetpasswordModal";

import { AuthContext } from "../Store/AuthContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import UserDataContext from "../Store/UserDataContext";

const { height } = Dimensions.get("window");
console.log("height-------", height);
const fontScale = PixelRatio.getFontScale();

const getFontSize = (size) => size / fontScale;

const LoginScreen = ({ navigation }) => {
  const { login, isAuthenticated, storeData, setLoginDetail, handleLogin } =
    useContext(AuthContext);
  const { userData, saveUserData } = useContext(UserDataContext);
  const [isLoading, setIsLoading] = useState(false);
  const { isPasskey } = usePasskey();
  const { width, height } = useWindowDimensions();
  const [visible, setVisible] = useState(false);
  const [PassisSecure, setPassIsSecure] = useState(true);

  // useEffect(() => {
  //   const unsubscribe = NetInfo.addEventListener(state => {
  //     setIsConnected(state.isConnected);
  //   });

  //   return () => unsubscribe();
  // }, []);

  const { showSnackbar } = useSnackbar();

  const validationSchema = Yup.object().shape({
    // email: Yup.string()
    //   .email("Invalid email address")
    //   .required("Email is required"),
    mobile: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]+$/, "Phone number must be numeric")
    .min(10, "Phone number must be at least 10 digits")
    .max(12, "Phone number can be at most 15 digits"),
    
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // const handleLogin = async (values, { resetForm }) => {
  //   try {
  //     console.log("login screen");
  //     setIsLoading(true);

  //     const payload = {
  //       mobile: values?.mobile,
  //       password: values?.password,
  //     };
  //     const response = await createApi("users/loginUser", payload);
  //     await storeData("loginDetail", response);
  //     setLoginDetail(response);
  //     console.log("response of Login is , ", response);
  //     await saveUserData(response);
  //     // console.log(response.data, "newResponse");
  //     // const data = await response.data;
  //     // await storeData("loginDetail", data.result);
  //     // setLoginDetail(data.result);
  //     // const token = "dummyToken";
  //     // login(token);
  //     // if (isLoading) {
  //     //   {
  //     //     <View
  //     //       style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
  //     //     >
  //     //       <ActivityIndicator size="large" />
  //     //     </View>;
  //     //   }
  //     // }
  //     if (isPasskey) {
  //       navigation.navigate("Passcode");
  //     } else {
  //       navigation.navigate("CreateNewPasscode");
  //     }
  //     resetForm();
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     resetForm();
  //     setIsLoading(false);
  //   }
  // };

  // if (isLoading) {
  //   {
  //     <View
  //       style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
  //     >
  //       <ActivityIndicator size="large" />
  //     </View>;
  //   }
  // }
  //invoicepeople
  //   const handleLogin = async (values,{resetForm} ) => {
  //    const response= await axios.post("http://192.168.1.7:8888/api/login",JSON.stringify(values),{headers:{
  //       'Content-Type': 'application/json',
  //     }})
  //     console.log(response.data,"newResponse")
  //       const data = await response.data
  //        await storeData("loginDetail",data.result);
  //       setLoginDetail(data.result) ;
  //      const token='dummyToken'
  //       login(token)
  //       if (isLoading) {
  //         {
  //           <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //             <ActivityIndicator size="large" />
  //           </View>
  //         }
  //        }
  //       if(isAuthenticated){
  //         // navigation.navigate("wertone",{screen:'invoice'})
  //         if(isPasskey){
  //           navigation.navigate('Passcode');
  //         }else{
  //           navigation.navigate('CreateNewPasscode');

  //         }
  //         resetForm();
  //       }
  // }
  console.log("Testing case")

  const togglePasswordVisibility = () => {
    setPassIsSecure((prevState) => !prevState);
  };
  return (
    <View
      style={{ justifyContent: "center", backgroundColor: "#fff", flex: 1 }}
    >
      {/* Loading Modal */}
      <Modal
        transparent={true}
        animationType="none"
        visible={isLoading}
        onRequestClose={() => {}}
      >
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator size="large" color="#fff" />
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
                fontFamily: "Poppins-Regular",
              }}
            >
              Loading...
            </Text>
          </View>
        </View>
      </Modal>
      <Formik
        initialValues={{ mobile: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={async(value, {resetForm})=>{
          try{
            await handleLogin(value,navigation)
            // if (isPasskey) {
            //   navigation.navigate("Passcode"); 
            // } else {
            //   navigation.navigate("CreateNewPasscode"); 
            // }
      
          }catch(error){
            console.log("Unable to login ", error)
          }finally{
            resetForm()
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
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            style={{ padding: 5 }}
          >
            <View style={styles.container}>
              <View
                style={{
                  flex: 1,
                }}
              >
                <View
                  style={{
                    paddingHorizontal: 10,
                  }}
                >
                  <View
                    style={{
                      justifyContent: "center",
                      height: height * 0.4,
                      // flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 8,
                      // marginBottom: 50,
                    }}
                  >
                    <Image
                      source={require("../../assets/qwikBill.jpeg")}
                      style={styles.img}
                    />
                  </View>

                  <View style={{ gap: 10 }}>
                    <View style={{ gap: 10 }}>
                      <Text
                        style={{
                          textAlign: "center",
                          // fontWeight: "bold",
                          color: "rgba(0, 0, 0, 0.7)",
                          fontSize: getFontSize(18),
                          fontFamily: "Poppins-Bold",
                        }}
                      >
                        Welcome to QwikBill
                      </Text>
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: getFontSize(13),
                          color: "gray",
                          fontFamily: "Poppins-Regular",
                        }}
                      >
                        Manage your bills and payments effortlessly with
                        Qwickbill. Our app ensures a seamless experience for
                        tracking and paying your bills on time.
                      </Text>
                    </View>

                    <View
                      style={{
                        // flex: 1,
                        // backgroundColor:"lightblue",
                        gap: 10,
                        // justifyContent: "space-around",
                        // padding:10
                      }}
                    >
                      <TextInput
                        label="Mobile Number"
                        style={styles.input}
                        mode="flat"
                        onChangeText={handleChange("mobile")}
                        onBlur={handleBlur("mobile")}
                        value={values.mobile}
                        keyboardType="phone-pad"
                        maxLength={10}
                        right={
                          <TextInput.Icon
                            icon={() => (
                              <MaterialCommunityIcons
                                name="phone-outline"
                                size={24}
                                color="gray"
                              />
                            )}
                          />
                        }
                        // autoCapitalize="none"
                      />
                      {touched.mobile && errors.mobile && (
                        <Text style={styles.error}>{errors.mobile}</Text>
                      )}

                      <TextInput
                        mode="flat"
                        label="Password"
                        style={styles.input}
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
                        value={values.password}
                        secureTextEntry={PassisSecure}
                        autoCapitalize="none"
                        right={
                          <TextInput.Icon
                            icon={PassisSecure ? "eye-off" : "eye"}
                            color={"gray"}
                            onPress={togglePasswordVisibility}
                          />
                        }
                      />
                      {touched.password && errors.password && (
                        <Text style={styles.error}>{errors.password}</Text>
                      )}
                    </View>
                    {/* <View style={{flex:1, backgroundColor:"green"}} ></View> */}


                    <View style={{ alignItems: "flex-end" }}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate("EnterNumberScreen",{ isForgetPassword: true })
                      }
                      >
                        <Text
                          style={{
                            color: "#1E90FF",
                            fontFamily: "Poppins-Regular",
                            fontSize: getFontSize(14),
                          }}
                        >
                          Forget Password ?
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View
                      style={{
                        gap: 20,
                        flex: 1,
                        // justifyContent: "center",
                        // backgroundColor:"lightgreen"
                      }}
                    >
                      <Button
                        onPress={handleSubmit}
                        textColor="white"
                        style={[
                          styles.button,
                          { borderRadius: 10 },
                          !isValid ||
                          !dirty ||
                          !values.mobile ||
                          !values.password
                            ? { backgroundColor: "#d3d3d3" }
                            : { backgroundColor: "#1E90FF" },
                        ]}
                        disabled={
                          !isValid ||
                          !dirty ||
                          !values.mobile ||
                          !values.password
                        }
                      >
                        <Text
                          style={{
                            fontFamily: "Poppins-Medium",
                            color: "white",
                          }}
                        >
                          Login
                        </Text>
                      </Button>
                     
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        marginBottom: 10,
                      }}
                    >
                      <Text style={styles.signup}>Don't have an account? </Text>
                      <TouchableOpacity
                        onPress={() => navigation.navigate("EnterNumberScreen")}
                      >
                        <Text style={styles.signupText}>Sign Up</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
    // marginTop: "15%",
    // elevation: 12,
  },
  modalBackground: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  activityIndicatorWrapper: {
    backgroundColor: "rgba(0, 0, 0, 0)",
    height: 100,
    width: 100,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  signup: {
    // alignSelf: "center",
    // marginVertical: 40,
    fontFamily: "Poppins-Regular",
    color: "grey",
    fontSize: getFontSize(14),
  },
  input: {
    // marginBottom: 5,
    paddingHorizontal: 8,
    // width: "90%",
    // alignSelf: "center",
    // backgroundColor: "rgba(0, 0, 0, 0.1)",
    backgroundColor: "#ffffff",
  },
  signupText: {
    color: "#1E90FF",
    fontFamily: "Poppins-Bold",
    fontSize: getFontSize(14),
  },
  img: {
    height: 140,
    width: 240,
    elevation: 2,
    marginVertical: 10,
  },
  wertoneTag: {
    color: "#0c3b73",
    marginVertical: 5,
    fontWeight: "bold",
  },
  link: {
    alignSelf: "flex-end",
    color: "gray",
    marginVertical: 10,
  },
  error: {
    color: "red",
    // marginBottom: 16,
    fontSize: getFontSize(13),
    fontFamily: "Poppins-Regular",
    marginLeft: 16,
  },
  button: {
    backgroundColor: "#0c3b73",
    // width: "80%",
    // alignSelf: "center",
  },
});

export default LoginScreen;
