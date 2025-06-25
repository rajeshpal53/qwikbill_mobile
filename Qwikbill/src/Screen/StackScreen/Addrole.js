import { Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";
import * as Yup from "yup";

import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { ShopContext } from "../../Store/ShopContext";
import { useSnackbar } from "../../Store/SnackbarContext";
import UserDataContext from "../../Store/UserDataContext";
import DropDownList from "../../UI/DropDownList";
import { ButtonColor, createApi, fontSize, readApi } from "../../Util/UtilApi";
//import AddroleDropdown from "../../Component/AddRoleDropdown";
// import RNPickerSelect from "react-native-picker-select";
import { Picker } from "@react-native-picker/picker";

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
  const [currentUserRole, setcurrentUserRole] = useState("");

  // useEffect(() => {
  //   console.log("SELECTED SHOP IS ", editData);
  // }, [editData]);

  console.log("DATA OF USER IS123 589", selectedShop);

  const roleOptions = [
    { label: "Owner", value: "Owner" },
    { label: "Manager", value: "Manager" },
    { label: "Employee", value: "Employee" },
    { label: "Viewer", value: "Viewer" },
  ];

  const getRoleNameFromFk = (fk) => {
    switch (fk) {
      case 1:
        return "Owner";
      case 2:
        return "Manager";
      case 3:
        return "Employee";
      case 4:
        return "Viewer";
      default:
        return "Owner";
    }
  };
  useEffect(() => {
    const fetchUserRole = async () => {
      console.log("User data is ", userData?.user?.id)
      console.log("vendor data is ", selectedShop?.vendor?.id)
      try {
        const response = await readApi(
          `userRoles/getUserRoleByUserIdAndVendorfk?usersfk=${userData?.user?.id}&vendorfk=${selectedShop?.vendor?.id}`,
          {
            Authorization: `Bearer ${userData?.token}`,
          }
        );
        console.log("Response is data is ", response);
        const roleFk = response?.data?.rolesfk;
        console.log("Data of role is ", roleFk);

        if (roleFk){
          const roleName = getRoleNameFromFk(roleFk);
          console.log("DATA OF ROLE ID ", roleName);
          setcurrentUserRole(roleName);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    if (userData?.user?.id && selectedShop?.vendor?.id) {
      fetchUserRole();
    }
  }, [userData?.user?.id, selectedShop?.vendor?.id]);




  const getAssignableRoles = (userRole) => {
    switch (userRole) {
      case "Owner":
        return roleOptions.filter((role) => role.value !== "Owner");
      case "Manager":
        return roleOptions.filter(
          (role) =>
            role.value === "Manager" ||
            role.value === "Employee" ||
            role.value === "Viewer"
        );
      case "Employee":
        console.log("This is working")
        return roleOptions.filter(
          (role) => role.value === "Employee" || role.value === "Viewer"
        );
      case "Viewer":
        return roleOptions.filter((role) => role.value === "Viewer");
      default:
        return roleOptions;
    }
  };

  // const roleOptions = ["Owner", "Manager", "Employee", "Viewer"];

  const getValidationSchema = (currentUserMobile) =>
    Yup.object({
      userRole: Yup.string().required("User Role is required"),
      userMobile: Yup.string()
        .required("Phone is required")
        .matches(/^\d{10}$/, "Phone must be 10 digits")
        .notOneOf([currentUserMobile], "You cannot use your own mobile number"),
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
              console.log("Data of response ", response);
              setUser(response);
              setFieldValue("userName", response?.name);
              setFieldValue("email", response?.email);
              setFieldValue("userMobile", phoneNumber);
            }
          } catch (error) {
            setFieldValue("userName", "");
            setFieldValue("email", "");
            setFieldValue("userMobile", phoneNumber);
            setUser("");
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
        vendorfk: selectedShop?.vendor?.id,
        usersfk: User?.id,
        rolesfk: getStatusFk(),
        email: User?.email,
      };
    } else {
      data = {
        mobile: dataToSend?.userMobile,
        name: dataToSend?.userName,
        email: dataToSend?.email,
        vendorfk: selectedShop?.vendor?.id,
        rolesfk: getStatusFk(),
      };
    }
    try {
      setLoading(true);
      const headers = {
        Authorization: `Bearer ${userData?.token}`,
      };
      const response = await createApi(`userRoles`, data, headers);
      console.log("DATA OF SUBMIT ", response);
      showSnackbar("Role Create successfully", "success");
    } catch (error) {
      // console.log("Unable to create data", error);
      showSnackbar(`Unable to create data ${error?.data?.error}`, "error");
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
          email: "",
          selectShop: selectedShop?.shopname || "default",
        }}
        validationSchema={getValidationSchema(userData?.user?.mobile)}
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
                maxLength={10}
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
                style={
                  !User
                    ? styles.input
                    : { ...styles.input, backgroundColor: "#f3f3f3" }
                }
                onChangeText={handleChange("userName")}
                onBlur={handleBlur("userName")}
                value={values.userName}
                editable={!User}
                right={
                  values.userName && !User ? (
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
                style={
                  !User
                    ? styles.input
                    : { ...styles.input, backgroundColor: "#f3f3f3" }
                }
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
                  <Picker.Item label="Select Role" enabled={false} value="" />
                  {getAssignableRoles(currentUserRole).map((role, index) => (
                    <Picker.Item
                      key={index}
                      label={role?.label || "Unknown Role"}
                      value={role?.value || ""}
                    />
                  ))}
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
