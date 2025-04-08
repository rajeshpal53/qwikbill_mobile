import { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { IconButton, Modal, ProgressBar, TextInput } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SetpasswordModal = ({ visible, closeModal, navigation, postData, isForgetPassword,setIsForgetPasswordState  }) => {
  //   const [password, setPassword] = useState("");
  //   const [Confirmpassword, setConfirmPassword] = useState("");
  const [PassisSecure, setPassIsSecure] = useState(true);
  const [ConfirmPassisSecure, setConfirmPassIsSecure] = useState(true);
  const [strength, setStrength] = useState(0);
  const ValidationSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Must include an uppercase letter")
      .matches(/[0-9]/, "Must include a number")
      .matches(/[^A-Za-z0-9]/, "Must include a special character")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const evaluatePasswordStrength = (pass) => {
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) && pass.length >= 4) score++;
    if (/[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass) && pass.length >= 4) score++;
    setStrength(score);
  };

  const getStrengthLabel = (level) => {
    switch (level) {
      case 1:
        return "Weak";
      case 2:
        return "Medium";
      case 3:
        return "Strong";
      case 4:
        return "Very Strong";
      default:
        return "";
    }
  };

  const togglePasswordVisibility = () => {
    setPassIsSecure((prevState) => !prevState);
  };
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPassIsSecure((prevState) => !prevState);
  };

  const getPasswordStrength = () => {
    if (strength < 1) {
      return 0;
    }
    if (strength == 1) {
      return 25;
    } else if (strength == 2) {
      return 50;
    } else if (strength == 3) {
      return 75;
    } else if (strength == 4) {
      return 100;
    }
  };

  const getProgressValue = () => {
    if (strength == 1) {
      return 0.25;
    } else if (strength == 2) {
      return 0.5;
    } else if (strength == 3) {
      return 0.75;
    } else if (strength == 4) {
      return 1;
    }
  };
  return (
    <Modal
      visible={visible}
      onDismiss={closeModal}
      onRequestClose={closeModal}
      animationType="slide"
      contentContainerStyle={styles.containerStyle}
    >
      <Formik
        initialValues={{ password: "", confirmPassword: "" }}
        validationSchema={ValidationSchema}
        onSubmit={async (values, { resetForm }) => {
          try {
            console.log(values);
            // await AsyncStorage.setItem("UserPassword", JSON.stringify(values));

            const signupSuccessfully = await postData(values?.password, isForgetPassword ,navigation,setIsForgetPasswordState);

            if (signupSuccessfully) {
              closeModal();
              resetForm(); // Reset the form after successful submission

              //navigation.navigate("login")
              //  navigation.goBack();


            }

          } catch (error) {
            console.log("Unable to save data", error);
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
        }) => (
          <View style={styles.main}>
            <View style={styles.TextView}>
              <Text style={styles.TextHead}>Set Your Password</Text>
              <Text style={{ color: "rgba(0, 0, 0, 0.5)", fontSize: 12 }}>Create a strong password to secure your account.</Text>
            </View>
            <View style={styles.InputTextView}>
              <TextInput
                label="Enter password"
                mode="flat"
                value={values.password}
                onChangeText={(text) => {
                  handleChange("password")(text);
                  evaluatePasswordStrength(text);
                }}
                onBlur={handleBlur("password")}
                secureTextEntry={PassisSecure}
                style={styles.input}
                right={
                  <TextInput.Icon
                    icon={PassisSecure ? "eye-off" : "eye"}
                    onPress={togglePasswordVisibility}
                  />
                }
              />
              {touched.password && errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}

              <View
                style={{
                  marginVertical: 10,
                  paddingVertical: 10,
                  marginHorizontal: 5,
                }}
              >
                <ProgressBar progress={getProgressValue()} color="rgb(35, 167, 35)" style={{ height: 5, borderRadius: 10 }} />
                <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: 5, marginTop: 5, }}>
                  <Text
                    style={{
                      //  textAlign: "center",
                      // marginTop: 5,
                      //  fontWeight: "bold",
                      color: "rgba(0, 0, 0, 0.5)",
                    }}
                  >
                    Strong
                  </Text>
                  <Text>{getPasswordStrength()} %</Text>
                </View>
              </View>
              {/* <View style={styles.strengthMeter}>
                {[1, 2, 3, 4].map((level) => (
                  <View key={level} style={styles.levelContainer}>
                    <View
                      style={[
                        styles.strengthIndicator,
                        {
                          backgroundColor:
                            strength >= level ? "#00CFFF" : "#E0E0E0",
                        },
                      ]}
                    />
                    <Text style={styles.label}>{getStrengthLabel(level)}</Text>
                  </View>
                ))}
              </View> */}
              <TextInput
                label="Confirm Password"
                mode="flat"
                value={values.confirmPassword}
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                secureTextEntry={ConfirmPassisSecure}
                style={styles.input}
                right={
                  <TextInput.Icon
                    icon={ConfirmPassisSecure ? "eye-off" : "eye"}
                    onPress={toggleConfirmPasswordVisibility}
                  />
                }
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
              <View style={styles.ButtonView}>
                <TouchableOpacity onPress={handleSubmit}>
                  <Text style={styles.textbutton}>Set Password</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.textinfoView}>
                <Text style={{ color: "rgba(255, 0, 0, 0.6)", fontSize: 12 }}>
                  * Your password must be at least 8 characters, include an
                  uppercase letter, a number, and a special character.
                </Text>
              </View>
            </View>
          </View>
        )}
      </Formik>
    </Modal>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    // borderWidth:2,
    // flex:1
    // paddingVertical: 20,
  },
  main: {
    backgroundColor: "#fff",
    marginHorizontal: 10,
    paddingBottom: 20,
    borderRadius: 10,
    paddingHorizontal: 5,
    elevation: 5,
  },
  TextView: {
    paddingVertical: 10,
    marginHorizontal: 5,
    gap: 15,
  },
  TextHead: {
    fontSize: 20,
    paddingVertical: 10,
    fontWeight: "bold"
  },
  InputTextView: {
    paddingVertical: 10,
    marginHorizontal: 5,
  },
  input: {
    backgroundColor: "#fff",
    marginHorizontal: 5,
  },
  ButtonView: {
    paddingVertical: 10,
    marginHorizontal: 5,
    marginTop: 20,
    borderRadius: 10,
    // backgroundColor: "#17C6ED",
    backgroundColor: "#0c3b73",
  },
  textbutton: {
    textAlign: "center",
    color: "#fff",
  },
  textinfoView: {
    marginTop: 20,
  },
  label: {
    textAlign: "center",
    marginTop: 5,
    fontWeight: "bold",
  },
  strengthMeter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    paddingVertical: 10,
    marginHorizontal: 5,
  },
  levelContainer: {
    alignItems: "center",
  },
  strengthIndicator: {
    width: 60,
    height: 8,
    borderRadius: 5,
  },
  errorText: {
    color: "red",
    marginLeft: 5,
  },
});

export default SetpasswordModal;
