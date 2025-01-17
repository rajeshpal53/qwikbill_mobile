import { React, useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
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

const LoginScreen = ({ navigation }) => {
  const { login, isAuthenticated, storeData, setLoginDetail } =
    useContext(AuthContext);
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
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleLogin = async (values, { resetForm }) => {
    try {
      console.log("login screen")
      setIsLoading(true);
      const response = await axios.post(
        "http://192.168.1.6:8888/api/login",
        JSON.stringify(values),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data, "newResponse");
      const data = await response.data;
      await storeData("loginDetail", data.result);
      setLoginDetail(data.result);
      const token = "dummyToken";
      login(token);
      // if (isLoading) {
      //   {
      //     <View
      //       style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      //     >
      //       <ActivityIndicator size="large" />
      //     </View>;
      //   }
      // }
      if (isPasskey) {
        navigation.navigate("Passcode");
      } else {
        navigation.navigate("CreateNewPasscode");
      }
      resetForm();
    } catch (err) {
      console.error(err);
    } finally {
      resetForm();
      setIsLoading(false);
    }
  };

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
  const togglePasswordVisibility = () => {
    setPassIsSecure((prevState) => !prevState);
  };
  return (
    <View style={{ justifyContent: "center" }}>
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
            <Text style={{ color: "#fff", fontSize: 20 }}>Loading...</Text>
          </View>
        </View>
      </Modal>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <ScrollView contentContainerStyle={{ justifyContent: "center" }}>
            <View style={[styles.container, { height: 0.9 * height }]}>
              <Card
                style={{
                  backgroundColor: "#ffffff",
                  height: "100%",
                }}
              >
                <View style={{ height: "100%" }}>
                  {/* <View style={{flex:1, backgroundColor:"gray"}} ></View> */}
                  <View
                    style={{
                      justifyContent: "center",
                      flex: 1,
                      flexDirection: "row",
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
                  <View
                    style={{
                      flex: 1,
                      // backgroundColor:"lightblue",
                      justifyContent: "space-around",
                    }}
                  >
                    <TextInput
                      label="Email"
                      style={styles.input}
                      autoCorrect={false}
                      mode="outlined"
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      value={values.email}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                    {touched.email && errors.email && (
                      <Text style={styles.error}>{errors.email}</Text>
                    )}
                    <TextInput
                      mode="outlined"
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
                          onPress={togglePasswordVisibility}
                        />
                      }
                    />
                    {touched.password && errors.password && (
                      <Text style={styles.error}>{errors.password}</Text>
                    )}
                  </View>
                  {/* <View style={{flex:1, backgroundColor:"green"}} ></View> */}

                  <View
                    style={{
                      gap: 20,
                      flex: 1,
                      justifyContent: "center",
                      // backgroundColor:"lightgreen"
                    }}
                  >
                    <Button
                      onPress={handleSubmit}
                      textColor="white"
                      style={[styles.button]}
                    >
                      Login
                    </Button>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        gap: 5,
                      }}
                    >
                      <Button
                        icon={"google"}
                        // onPress={handleGoogleSignIn}
                        textColor="white"
                        style={[
                          styles.button,
                          { backgroundColor: "#DB4437", width: "40%" },
                        ]}
                      >
                        Google
                      </Button>
                      <Button
                        icon={"facebook"}
                        // onPress={handleFacebookLogin}
                        textColor="white"
                        style={[
                          styles.button,
                          { backgroundColor: "#3b5998", width: "40%" },
                        ]}
                      >
                        Facebook
                      </Button>
                    </View>

                    <Button
                      // icon={"facebook"}
                      onPress={() => navigation.navigate("SetPasswordScreen")}
                      textColor="white"
                      style={[
                        styles.button,
                        { backgroundColor: "#3b5998", width: "40%" },
                      ]}
                    >
                      SetPassword
                    </Button>
                  </View>
                  <Divider style={{ width: "80%", alignSelf: "center" }} />
                  <View style={{ flex: 1 }}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("Signup")}
                    >
                      <Text style={styles.signup}>
                        Don't have an account?{" "}
                        <Text style={styles.signupText}>Sign Up</Text>
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {/* <Link href='' style={styles.link}> forget password?..</Link> */}
              </Card>
            </View>
          </ScrollView>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 16,
    marginTop: "15%",
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
    alignSelf: "center",
    marginVertical: 40,
    color: "grey",
    fontSize: 15,
  },
  input: {
    marginBottom: 5,
    paddingHorizontal: 8,
    width: "90%",
    alignSelf: "center",
    backgroundColor: "#ffffff",
  },
  signupText: {
    color: "#1e90ff",
    fontWeight: "bold",
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
    marginLeft: 16,
  },
  button: {
    backgroundColor: "#0c3b73",
    width: "80%",
    alignSelf: "center",
  },
});

export default LoginScreen;
