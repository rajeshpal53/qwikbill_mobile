import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Image,
  ScrollView
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { HelperText, Button, Card, Text, TextInput } from "react-native-paper";
import { useSnackbar } from "../../Store/SnackbarContext";
import { usePasskey } from "../../Store/PasskeyContext";
import { useWindowDimensions } from "react-native";

const PasscodeSchema = Yup.object().shape({
  passcode: Yup.string()
    .min(4, "Passcode is too short!")
    .max(6, "Passcode is too long!")
    .required("Required"),
  confirmPasscode: Yup.string()
    .oneOf([Yup.ref("passcode"), null], "Passcodes must match")
    .required("Required"),
});

const CreateNewPasscode = ({ navigation }) => {
  const { showSnackbar } = useSnackbar();
  const { passkey, savePasskey, removePasskey } = usePasskey();
  const [newPasskey, setNewPasskey] = useState("");
  const { height } = useWindowDimensions();

  useEffect(() => {
    savePasskey(newPasskey);
  }, [passkey]);
  return (
    <>
      <StatusBar style="light" backgroundColor={"#0c3b73"} />
      <SafeAreaView style={styles.SafeAreaView}>
        {/* <KeyboardAvoidingView behavior="padding"> */}
        <View style={[styles.overlay, { height: 0.4 * height }]}></View>
        <ScrollView>
          
          <View style={[styles.scrollViewChild, { height: height }]}>
            <View
              style={{
                flex: 1,
                // backgroundColor:"pink",
                // height: "25%",
                width: "100%",
                alignItems: "center",
                // marginBottom: 12,
              }}
            >
              <View>
                <Image
                  source={require("../../assets/aaaa_transparent.png")}
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
            <View style={styles.cardContainer}>
              <Card style={styles.card}>
                <Card.Content style={styles.cardContent}>
                  <View style={{ flex: 1, paddingBottom:10 }}>
                    <View style={styles.myShopImageContainer}>
                      <Image
                        source={require("../../assets/forgetpassword.jpeg")}
                        style={styles.myShopeImage}
                      ></Image>
                    </View>
                    <Formik
                      initialValues={{ passcode: "", confirmPasscode: "" }}
                      validationSchema={PasscodeSchema}
                      onSubmit={(values) => {
                        console.log(values);
                        setNewPasskey(values.passcode);
                        savePasskey(values.passcode);
                        showSnackbar(
                          "succesfully update new passcode",
                          "success"
                        );
                        navigation.navigate("Passcode");
                      }}
                    >
                      {({
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        values,
                        errors,
                        touched,
                      }) => (
                        <View
                          style={{
                            height: "80%",
                            gap:5
                          }}
                        >
                          <View style={{flex:1}}>
                            <Text
                              variant="headlineMedium"
                              style={{
                                color: "black",
                                marginVertical: 10,
                                textAlign: "center",
                              }}
                            >
                              Create Passcode
                            </Text>
                            <Text
                              variant="labelSmall"
                              style={{
                                color: "grey",
                                textAlign: "center",
                              }}
                            >
                              Let's set a unique App Passcode.
                            </Text>
                          </View>

                          <View style={{
                            flex:2,
                            }}>
                            <TextInput
                            style={{
                              marginBottom: (errors.passcode &&
                                touched.passcode) ? 0 : 30
                            }}
                              placeholder="Enter App Passcode"
                              secureTextEntry
                              onChangeText={handleChange("passcode")}
                              onBlur={handleBlur("passcode")}
                              value={values.passcode}
                              keyboardType="numeric"
                            />
                            {errors.passcode && touched.passcode ? (
                              <HelperText style={styles.error}>
                                {errors.passcode}</HelperText>
                            ) : null}

                            <TextInput
                            style={{
                             
                            }}
                              placeholder="Re-enter App Passcode"
                              secureTextEntry
                              onChangeText={handleChange("confirmPasscode")}
                              onBlur={handleBlur("confirmPasscode")}
                              value={values.confirmPasscode}
                              keyboardType="numeric"
                            />
                            {errors.confirmPasscode &&
                            touched.confirmPasscode ? (
                              <HelperText style={styles.error}>
                                {errors.confirmPasscode}
                              </HelperText>
                            ) : null}
                          </View>
                          <View>
                            <Button
                              style={styles.verifyButton}
                              onPress={handleSubmit}
                              mode="contained"
                            >
                              Submit
                            </Button>
                          </View>
                        </View>
                      )}
                    </Formik>
                  </View>
                </Card.Content>
              </Card>
            </View>
          </View>
          </ScrollView>
        {/* </KeyboardAvoidingView> */}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   justifyContent: "center",
  //   backgroundColor:"orange",
  //   alignItems: "center",
  // },
  overlay: {
    position: "absolute",
    top: 0,
    width: "100%",
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
  error: {
    color: "red",
    // marginBottom: 10,
  },

  submitButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  cardContainer: {
    flex: 3,
    marginHorizontal: 20,
  },
  card: {
    height: "80%",
    borderRadius: 0,
  },
  cardContent: {
    paddingTop: 0,
    height: "100%",
  },
  instruction: {
    fontSize: 16,
    marginVertical: 16,
    textAlign: "center",
  },
  img: {
    height: 100,
    width: 100,
    elevation: 2,
    alignSelf: "center",
    marginVertical: 10,
  },
  myShopeImage: {
    width: 80,
    height: "100%",
  },
  myShopImageContainer: {
    width: "100%",
    height: "20%",
    marginVertical: 5,
    alignItems: "center",
  },
  scrollViewChild: {
    height: "100%",
    // backgroundColor: "grey",
    justifyContent: "center",
    // alignItems: "center",
    width: "100%",
  },
  scrollViewStyle: {
    // backgroundColor:"blue",
    display: "flex",
    width: "100%",
    height: "100%",
    // flex:1
  },
  verifyButton: {
    marginTop: 10,
  },
});

export default CreateNewPasscode;
