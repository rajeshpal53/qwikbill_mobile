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
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSnackbar } from "../../Store/SnackbarContext";
import CustomDropdown from "../../Component/CustomeDropdown";
import AddroleDropdown from "../../Component/AddRoleDropdown";
// import RNPickerSelect from "react-native-picker-select";
import { Picker } from "@react-native-picker/picker";

const AddRole = () => {
  const route = useRoute();
  const { editData } = route.params;
  const {isUpdateEditdata} = route.params;
  const { userData } = useContext(UserDataContext);
  const { allShops, selectedShop } = useContext(ShopContext);
  const [User, setUser] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const submit = useRef(false);
  const pickerRef = useRef();
  const [AddRode, SetAddRole] = useState("");
  const { showSnackbar } = useSnackbar();
  const [selectedStatus, setSelectedStatus] = useState("Select Role");
  const timeoutId = useRef(null);

  console.log("EDIT DATA IS ", isUpdateEditdata);

  useEffect(() => {
    console.log("SELECTED SHOP IS ", editData);
  }, [editData]);

  const roleOptions = [
    { label: "Owner", value: "Owner" },
    { label: "Manager", value: "Manager" },
    { label: "Employee", value: "Employee" },
    { label: "Viewer", value: "Viewer" },
  ];

  // const roleOptions = ["Owner", "Manager", "Employee", "Viewer"];

  const validationSchema = Yup.object({
    userRole: Yup.string().required("User Role is required"),
    userMobile: Yup.string()
      .required("Phone is required")
      .matches(/^\d{10}$/, "Phone must be 10 digits"),
    userName: Yup.string().required("User Name is required"),
  });

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
            }
          } catch (error) {
            setFieldValue("userName", "");
            setFieldValue("userMobile", phoneNumber);
            console.error("Error fetching User data:", error);
          } finally {
            setLoading(false);
          }
        } else {
          setFieldValue("userName", "");
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
    if (AddRode == "Owner") {
      return 1;
    } else if (AddRode == "Manager") {
      return 2;
    } else if (AddRode == "Employee") {
      return 3;
    } else if (AddRode == "Viewer") {
      return 4;
    } else {
      return 5;
    }
  };

  const HandleBothData = async (dataToSend) => {
    let data = {};
    if (User) {
      data = {
        vendorfk: selectedShop?.id,
        usersfk: selectedShop?.user?.id,
        rolesfk: getStatusFk(),
        email: dataToSend?.email,
      };
    } else {
      data = {
        mobile: dataToSend?.userMobile,
        name: dataToSend?.userName,
        email: dataToSend?.email,
        vendorfk: selectedShop?.id,
        rolesfk: getStatusFk(),
      };
    }

    if (isUpdateEditdata) {
      console.log("VALUE OF DATA IS ", data);
      console.log("Value of edit user is ", editData);
      const updatedValue = {
        ...editData,
        role: {
          ...editData.role,
          id: data.rolesfk,
        },
        vendor: {
          ...editData.vendor,
          id: data.vendorfk,
        },
        user: {
          ...editData.user,
          name: dataToSend?.userName || editData.user.name,
          email: dataToSend?.email || editData.user.email,
        },
      };

      console.log("This is the updated details", updatedValue);
    } else {
      try {
        setLoading(true);
        const headers = {
          Authorization: `Bearer ${userData?.token}`,
        };
        const response = await createApi(`userRoles`, data, headers);
        showSnackbar("Profile updated successfully", "success");
      } catch (error) {
        console.log("Unable to create data", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Formik
        initialValues={{
          userMobile: "",
          userName: editData?.user?.name || "",
          userRole: editData?.role?.id || "",
          email: editData?.user?.email || "",
          selectShop:
            editData?.vendor?.id || selectedShop?.shopname || "default",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          const { userMobile, userName, userRole, email, selectShop } = values;
          const dataToSend = {
            userMobile,
            userName,
            userRole,
            email,
            selectShop,
          };
          await HandleBothData(dataToSend);
          // resetForm();
          submit.current = true;
          // navigation.goBack();
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
          console.log("FILLED DATA OF VALUE ", values);
          return (
            <View style={styles.form}>
              <View style={styles.header}>
                <Text style={styles.headerText}>Owner Name</Text>
                <Text style={styles.subHeaderText}>{userData?.user?.name}</Text>
              </View>

              {/* User Mobile Number */}
              <TextInput
                mode="flat"
                label="Enter User Mobile Number"
                style={styles.input}
                onChangeText={async (phoneNumber) => {
                  setFieldValue("userMobile", phoneNumber);
                  await fetchUserData(phoneNumber, setFieldValue);
                }}
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
                  <ActivityIndicator size="small" color="#0000ff" />
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
                  loading ? (
                    <ActivityIndicator
                      size={10}
                      color="#000"
                      style={{ marginBottom: -22 }}
                    />
                  ) : values.userName ? (
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

              {/* Email */}
              <TextInput
                mode="flat"
                label="Enter User Email"
                style={[styles.input, { color: "#fff" }]}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                keyboardType="email-address"
              />
              {touched.email && errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}

              {/* Shop Description */}
              <View style={{ marginBottom: 10 }}>
                <Text style={styles.label}>Shop Description</Text>
                <View style={styles.TextShopDes}>
                  <Text style={styles.TextShop}>
                    {selectedShop?.details ||
                      "This is dummy data, This is a shop details. "}
                  </Text>
                </View>
              </View>

              {/* Shop Dropdown */}
              <View style={{ marginBottom: 10 }}>
                <Text style={styles.label}>Select Shop</Text>
                <View>
                  <DropDownList
                    options={allShops}
                    onValueChange={(selectedShop) =>
                      setFieldValue("selectShop", selectedShop)
                    }
                  />
                </View>
              </View>

              {/* User Role Dropdown */}
              <View style={{ marginBottom: 10 }}>
                <Text
                  style={{
                    fontSize: fontSize.labelLarge,
                    fontFamily: "Poppins-Regular",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  User Role
                </Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  header: {
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  headerText: {
    // fontSize: 20,
    fontSize: fontSize.heading,
    fontFamily: "Poppins-Regular",
    fontWeight: "bold",
    color: "#333",
  },
  subHeaderText: {
    fontSize: fontSize.headingSmall,
    fontFamily: "Poppins-Regular",
    marginVertical: 5,
    color: "#666",
  },
  form: {
    marginTop: 10,
  },
  label: {
    fontSize: fontSize.labelLarge,
    fontFamily: "Poppins-Regular",
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#fff",
    height: 45,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: fontSize.labelLarge,
    fontFamily: "Poppins-Regular",
  },
  errorText: {
    color: "red",
    fontSize: fontSize.label,
    marginBottom: 10,
    fontFamily: "Poppins-Regular",
  },
  button: {
    backgroundColor: ButtonColor.SubmitBtn,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    // marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: fontSize.labelLarge,
    fontFamily: "Poppins-Regular",
    // fontWeight: "600",
  },
  loaderContainer: {
    // alignItems: "center",
    // marginVertical: 20,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  TextShopDes: {
    // borderWidth:2,
    // paddingVertical:10,
    marginBottom: 3,
  },
  TextShop: {
    paddingVertical: 5,
    fontSize: fontSize.labelMedium,
    fontFamily: "Poppins-Regular",
  },
});

export default AddRole;

{
  /* <AddroleDropdown
  paymentStatuses={roleOptions}
  setSelectedStatus={setSelectedStatus}
  selectedStatus={selectedStatus}
  userRole={(assignRole) => {
    setFieldValue("userRole", assignRole);
  }}
/>; */
}

// {selectedShop?.details && selectedShop?.details !== "" && (
//   <>
//     <Text style={styles.label}>Shop Description</Text>
//     <View style={styles.TextShopDes}>
//       <Text style={styles.TextShop}>{selectedShop?.details}</Text>
//     </View>
//   </>
// )}
