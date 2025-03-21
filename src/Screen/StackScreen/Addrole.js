
import { useState, useEffect, useRef } from "react";
import { Formik } from "formik";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { TextInput } from "react-native-paper";
import * as Yup from "yup";

import { ButtonColor, createApi, fontSize, readApi } from "../../Util/UtilApi";
import { useContext } from "react";
import UserDataContext from "../../Store/UserDataContext";
import { ShopContext } from "../../Store/ShopContext";
import DropDownList from "../../UI/DropDownList";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { useSnackbar } from "../../Store/SnackbarContext";

const AddRole = () => {
  const { userData } = useContext(UserDataContext);
  const { allShops, selectedShop } = useContext(ShopContext);
  const [User, setUser] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const submit = useRef(false);
  const pickerRef = useRef();
  const [AddRode, SetAddRole] = useState("");
  const { showSnackbar } = useSnackbar();

  const timeoutId = useRef(null);

  // Default roles
  const roleOptions = [
    { label: "Owner", value: "owner" },
    { label: "Manager", value: "manager" },
    { label: "Employee", value: "employee" },
    { label: "Viewer", value: "viewer" },
  ];

  // Validation schema
  const validationSchema = Yup.object({
    userRole: Yup.string().required("User Role is required"),
    userMobile: Yup.string()
      .required("Phone is required")
      .matches(/^\d{10}$/, "Phone must be 10 digits"),
    userName: Yup.string().required("User Name is required"),
  });

  useEffect(() => {
    console.log("User data is getting12358 ", selectedShop);
  }, [selectedShop]);

  const fetchUserData = async (phoneNumber, setFieldValue) => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = setTimeout(async () => {
      try {
        if (/^\d{10}$/.test(phoneNumber)) {
          setLoading(true);
          try {
            const api = `users/getUserByMobile/${phoneNumber}`;
            const headers = {
              Authorization: `Bearer ${userData?.token}`,
            };
            const response = await readApi(api, headers);
            if (response) {
              setUser(response);
              setFieldValue("userName", response?.name);
              setFieldValue("userMobile", phoneNumber);
            } else {
              setFieldValue("userName", response?.name);
              setFieldValue("userMobile", phoneNumber);
            }
          } catch (error) {
            setFieldValue("userName", "");
            setFieldValue("userMobile", phoneNumber);
            console.error("Error fetching User data:", error);
          } finally {
            setLoading(false);
          }
        } else {
          // If phone number is not valid (less than 10 digits or non-numeric)
          setFieldValue("userName", ""); // Clear userName when the phone number is invalid
          setFieldValue("userMobile", phoneNumber);
        }
      } catch (error) {
        console.error("Error fetching HSN code data:", error);
      }
    }, 300);
  };

  useEffect(() => {
    const handleBackPress = navigation.addListener("beforeRemove", (e) => {
      const hasFilledForm = User?.name || User?.address || User?.phone;

      if (hasFilledForm && !submit.current) {
        e.preventDefault();

        Alert.alert(
          "Warning!",
          "If you go back, all of your filled form data will be lost. Are you sure you want to go back?",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Yes",
              style: "destructive",
              onPress: () => {
                navigation.dispatch(e.data.action);
                return true;
              },
            },
          ]
        );
      }
    });

    return handleBackPress;
  }, [navigation, User]);

  const getStatusFk = () => {
    if (AddRode == "owner") {
      return 1;
    } else if (AddRode == "manager") {
      return 2;
    } else if (AddRode == "employee") {
      return 3;
    } else if (AddRode == "viewer") {
      return 4;
    } else {
      return 5;
    }
  };

  const HandleBothData = async (dataToSend) => {
    console.log("USER DATA IS12 ", dataToSend);
    let data = {};
    if (User) {
      data = {
        vendorfk: selectedShop?.id,
        usersfk: selectedShop?.user?.id,
        rolesfk: getStatusFk(),
      };
      console.log("DATA OF USER IS156", data);
    } else {
      data = {
        mobile: dataToSend?.userMobile,
        name: dataToSend?.userName,
        vendorfk: selectedShop?.id,
        rolesfk: getStatusFk(),
      };
    }

    try {
      setLoading(true);
      const headers = {
        Authorization: `Bearer ${userData?.token}`,
      };
      console.log("Passing data is ", data)
      const response = await createApi(`userRoles`, data, headers);
      console.log("DATA OF RESPONSE IS123", response);
      showSnackbar(" update profile successfully", "success");
    } catch (error) {
      console.log("Unable to create a data is ", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Formik
        initialValues={{
          userMobile: "",
          userName: "",
          userRole: "",
          selectShop: selectedShop?.shopname || "default",
        }}
        validationSchema={validationSchema}

        onSubmit={async (values, { resetForm }) => {
          const { userMobile, userName, userRole, selectShop } = values;
          const dataToSend = {
            userMobile,
            userName,
            userRole,
            selectShop,
          };
          await HandleBothData(dataToSend);
          resetForm();
          submit.current = true;
          navigation.goBack();
        }}
      >
        {({
          handleChange,
          handleBlur,
          values,
          errors,
          handleSubmit,
          touched,

          setFieldValue,
        }) => {
          console.log("Selected field is ", values);
          console.log("Selected error is ", errors);
          return (
            <View style={styles.form}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.headerText}>Owner Name</Text>
                <Text style={styles.subHeaderText}>{userData?.user?.name}</Text>
              </View>

              {/* Shop Dropdown */}
              <View>
                <Text
                  style={{
                    fontSize: fontSize.labelLarge,
                    fontFamily: "Poppins-Regular",
                    fontWeight: "bold",
                  }}
                >
                  Select Shop
                </Text>

                <View style={{ borderBottomWidth: 2, marginBottom: 10 }}>
                  <DropDownList
                    options={allShops}
                    onValueChange={(selectedShop) =>
                      setFieldValue("selectShop", selectedShop)
                    }
                  />
                  {touched.selectShop && errors.selectShop && (
                    <Text style={styles.errorText}>{errors.selectShop}</Text>
                  )}
                </View>
              </View>

              {/* Shop Description */}
              {selectedShop?.details && selectedShop?.details !== "" && (
                <>
                  <Text style={styles.label}>Shop Description</Text>
                  <View style={styles.TextShopDes}>
                    <Text style={styles.TextShop}>{selectedShop?.details}</Text>
                  </View>
                </>
              )}

              {/* User Mobile Number */}
              <TextInput
                mode="flat"
                label="Enter User Mobile Number"
                style={styles.input}
                onChangeText={async (phoneNumber) => {
                  setFieldValue("userMobile", phoneNumber);
                  await fetchUserData(phoneNumber, setFieldValue);
                }}
                // onBlur={handleBlur("userMobile")}
                value={values.userMobile}
                keyboardType="phone-pad"
                right={
                  values.userMobile ? (
                    <TextInput.Icon
                      icon="close"
                      size={20}
                      style={{ marginBottom: -22 }}
                      onPress={() => setFieldValue("userMobile", "")}
                    />
                  ) : null
                }
              />

              {touched.userMobile && errors.userMobile && (
                <Text style={styles.errorText}>{errors.userMobile}</Text>
              )}
              {loading && (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color="#0000ff" />
                </View>
              )}

              {/* User Name */}
              <TextInput
                mode="flat"
                label="Enter User Name"
                style={styles.input}
                onChangeText={handleChange("userName")}
                onBlur={handleBlur("userName")}
                value={values.userName}
                right={
                  values.userName ? (
                    <TextInput.Icon
                      icon="close"
                      size={20}
                      style={{ marginBottom: -22 }}
                      onPress={() => setFieldValue("userName", "")}
                    />
                  ) : null
                }
              />
              {touched.userName && errors.userName && (
                <Text style={styles.errorText}>{errors.userName}</Text>
              )}

              {/* User Role Dropdown */}
              <Text style={styles.label}>User Role</Text>
              <View style={{ borderBottomWidth: 2, marginBottom: 10 }}>
                <Picker
                  selectedValue={values.userRole}
                  onValueChange={(itemValue) => {
                    setFieldValue("userRole", itemValue);
                    SetAddRole(itemValue);
                  }}
                  ref={pickerRef}
                  style={{ width: "100%", height: 60 }}
                >
                  <Picker.Item label="Select Role" enabled={false} />
                  {roleOptions && roleOptions.length > 0
                    ? roleOptions.map((role, index) => (
                        <Picker.Item
                          key={index}
                          label={role?.label || "Unknown Role"} // Default label if missing
                          value={role?.value || ""} // Default value if missing
                        />
                      ))
                    : null}
                </Picker>
                {touched.userRole && errors.userRole && (
                  <Text style={styles.errorText}>{errors.userRole}</Text>
                )}
              </View>

              {/* Submit Button */}
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          );
        }}

      
      </Formik>
    </ScrollView>
  );
};

const pickerStyles = StyleSheet.create({
  inputAndroid: {
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "white",
    fontSize: 16,
    marginBottom: 15,
    color: "#333",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  header: {
    marginBottom: 10,
  },
  headerText: {
    fontSize: fontSize.headingSmall,
    fontFamily: "Poppins-Regular",
    fontWeight: "bold",
  },
  subHeaderText: {
    fontSize: fontSize.headingSmall,
    fontFamily: "Poppins-Regular",
    marginVertical: 5,
  },
  form: {
    marginTop: 10,

   
  },
  label: {
    fontSize: fontSize.labelLarge,
    fontFamily: "Poppins-Regular",
    fontWeight: "bold",
    // marginBottom: 8,
  },
  input: {

    marginBottom: 15,
    backgroundColor: "white",
    height: 45,
    borderRadius: 4,

  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  button: {
    backgroundColor: ButtonColor.SubmitBtn,

    paddingVertical: 15,
    borderRadius: 5,

    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  descriptionContainer: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: "#444",
  },
});

export default AddRole;