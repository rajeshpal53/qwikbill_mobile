import {
  Image,
  Text,
  View,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { Button, TextInput } from "react-native-paper";
import { useState } from "react";
import axios from "axios";

const UserloginScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const [PassisSecure, setPassIsSecure] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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
      console.log("User login screen")
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
      resetForm();
      navigation.navigate("Home");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPassIsSecure((prevState) => !prevState);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Logo Image */}
        <View style = {{ height:"35%"}}>
          <Image
            source={require("../../assets/qwikBill.jpeg")}
            style={styles.img}
            resizeMode="contain"
          />
        </View>

        {/* Welcome Text */}
        <Text style={styles.TextHead}>QwikBill Login</Text>
        <Text style={styles.InnerText}>
          Welcome to QwikBill, your trusted billing and shopping companion.
          Please log in to continue.
        </Text>

        {/* Login Form */}
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
            <View style={styles.formContainer}>
              <TextInput
                label="Email"
                mode="outlined"
                style={styles.input}
                autoCorrect={false}
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

              {/* Login Button */}
              <Button
                onPress={handleSubmit}
                mode="contained"
                style={styles.button}
              >
                {isLoading ? <ActivityIndicator color="#fff" /> : "Login"}
              </Button>

              {/* Signup Navigation */}
              <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text style={styles.signup}>
                  Don't have an account?{" "}
                  <Text style={styles.signupText}>Sign Up</Text>
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#f9f9f9",
  },
  container: {
    width: "90%",
    //   alignItems: "center",
  },
  img: {
    width: "100%",
    height: 200,
    marginBottom: 20,
  },
  TextHead: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    //   textAlign: "center",
    color: "#333",
  },
  InnerText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
    color: "#555",
  },
  formContainer: {
    width: "100%",
  },
  input: {
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
    backgroundColor: "#17C6ED",
  },
  signup: {
    marginTop: 15,
    textAlign: "center",
    color: "#555",
  },
  signupText: {
    color: "#17C6ED",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 5,
    marginLeft: 5,
  },
});

export default UserloginScreen;
