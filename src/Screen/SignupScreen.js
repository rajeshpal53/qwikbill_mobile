import React, { useState, useContext } from "react";
import { View, StyleSheet, TouchableOpacity, Image, Modal } from "react-native";
import {
  TextInput,
  Button,
  Text,
  Card,
  Divider,
  Menu,
  useTheme,
  HelperText,
  List,
} from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import { createApi } from "../Util/UtilApi";
import { useSnackbar } from "../Store/SnackbarContext";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import { ScrollView } from "react-native-gesture-handler";
import { useWindowDimensions, SafeAreaView } from "react-native";
import { AuthContext } from "../Store/AuthContext";
import { ActivityIndicator } from "react-native-paper";
const SignupSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  surname: Yup.string().required("Surname is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const Signup = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { showSnackbar } = useSnackbar();
  const [expanded, setExpanded] = React.useState(false);
  const handlePress = () => setExpanded(!expanded);
  const [selected, setSelected] = React.useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [eyeOn, setEyeOn] = useState(false);
  const { width, height } = useWindowDimensions();

  const handleSignup = async (values) => {
    console.log(values, " --values");

    try {
      setIsLoading(true);
      const postData = { ...values, enabled: true, role: "admin" };
      const response = await axios.post(
        // "https://wertone-billing.onrender.com/api/signup",
        "http://192.168.1.6:8888/api/signup",
        JSON.stringify(postData),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.data;
      console.log(data);
      showSnackbar("successfully create new user", "success");
      navigation.navigate("login");
    } catch (error) {
      console.error("failed to signup", error);
      showSnackbar("failed to singup", "error");
    } finally {
      setIsLoading(false);
    }

    // Handle signup logic here
  };

  const handleEyePress = () => {
    setSecureTextEntry(!secureTextEntry);
    setEyeOn(!eyeOn);
  };
  const theme = useTheme();
  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={[styles.container, { height: height }]}
      >
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
          initialValues={{
            name: "",
            surname: "",
            email: "",
            password: "",
          }}
          validationSchema={SignupSchema}
          onSubmit={handleSignup}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
          }) => (
            <Card
              style={{
                backgroundColor: "#ffffff",
                flex: 1,
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  justifyContent: "spaceEvenly",
                  alignItems: "center",
                  alignSelf: "flexStart",

                  paddingHorizontal: 8,
                  marginBottom: 20,
                }}
              >
                <Image
                  source={require("../../assets/qwikBill.jpeg")}
                  style={styles.img}
                />
                <Text variant="titleMedium" style={styles.wertoneTag}>
                  Welcome to{" "}
                  <Text
                    variant="titleMedium"
                    style={[styles.wertoneTag, { color: "#0c3b73" }]}
                  >
                    {" "}
                    QwikBill{" "}
                  </Text>
                </Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                mode="flat"
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                value={values.name}
                error={touched.name && errors.name}
              />
              {touched.name && errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}

              <TextInput
                mode="flat"
                style={styles.input}
                placeholder="Last Name"
                onChangeText={handleChange("surname")}
                onBlur={handleBlur("surname")}
                value={values.surname}
                error={touched.surname && errors.surname}
              />
              {touched.surname && errors.surname && (
                <Text style={styles.errorText}>{errors.surname}</Text>
              )}

              <TextInput
                mode="flat"
                style={styles.input}
                placeholder="Email"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                error={touched.email && errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {touched.email && errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingRight: 5,
                }}
              >
                <TextInput
                  mode="flat"
                  style={styles.input}
                  placeholder="Password"
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  error={touched.password && errors.password}
                  secureTextEntry={secureTextEntry}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={handleEyePress}>
                  {eyeOn ? (
                    <Feather name="eye" size={25} color="#0c3b73" />
                  ) : (
                    <Feather name="eye-off" size={20} color="#0c3b73" />
                  )}
                </TouchableOpacity>
              </View>
              {touched.password && errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}

              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.button}
              >
                Sign Up
              </Button>
              <TouchableOpacity onPress={() => navigation.navigate("login")}>
                <Text style={styles.signup}>
                  Already have an account?
                  <Text style={styles.signupText}>login</Text>
                </Text>
              </TouchableOpacity>
            </Card>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    padding: 16,
    elevation: 12,
  },
  signup: {
    alignSelf: "center",
    marginVertical: 50,
    color: "grey",
    fontSize: 15,
  },
  signupText: {
    color: "#1e90ff",
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 12,
    color: "red",
    marginBottom: 10,
    marginHorizontal: 14,
  },
  input: {
    marginBottom: 16,
    paddingHorizontal: 8,

    border: "none",
    width: "90%",
    alignSelf: "flexStart",
    marginHorizontal: 6,
    backgroundColor: "#ffffff",
  },
  button: {
    backgroundColor: "#0c3b73",
    width: "80%",
    alignSelf: "center",
    // marginBottom: 20,
    // marginTop: 40,
  },
  img: {
    height: 140,
    width: 240,
    elevation: 2,
    marginVertical: 10,
  },
  wertoneTag: {
    color: "#777777",
    marginVertical: 5,
    fontWeight: "bold",
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
});

export default Signup;
