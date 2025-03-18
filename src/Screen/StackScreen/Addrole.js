import { Formik } from "formik";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { TextInput } from "react-native-paper";
import * as Yup from "yup";
import RNPickerSelect from "react-native-picker-select";
import { ButtonColor, fontSize, readApi } from "../../Util/UtilApi";
import { useContext, useState } from "react";
import UserDataContext from "../../Store/UserDataContext";
import { ShopContext } from "../../Store/ShopContext";
import DropDownList from "../../UI/DropDownList";

const AddRole = () => {
  const { userData } = useContext(UserDataContext);
  const { allShops, selectedShop } = useContext(ShopContext);
  const [User, setUser] = useState(null);
  const [fetchdata, setfetchdata] = useState({ name: "" });
  const [loading, setLoading] = useState(false);

  console.log("DATA OF USER IS123578 58", fetchdata);

  const validationSchema = Yup.object({
    shopname: Yup.string().required("Shop Name is required"),
    userRole: Yup.string().required("User Role is required"),

    userMobile: Yup.string()
      .required("Phone is required")
      .matches(/^\d{10}$/, "Phone must be 10 digits"),
    userName: Yup.string().required("User Name is required"),
    ProductCategory: Yup.string().required("Product category is required"),
  });

  const roleOptions = [
    { label: "Owner", value: "owner" },
    { label: "Manager", value: "manager" },
    { label: "Employee", value: "employee" },
    { label: "Viewer", value: "viewer" },
  ];

  const fetchUserData = async (phoneNumber, setFieldValue) => {
    if (/^\d{10}$/.test(phoneNumber)) {
      setLoading(true);
      try {
        const api = `users/getUserByMobile/${phoneNumber}`;
        const headers = {
          Authorization: `Bearer ${userData?.token}`, // Add token to headers
        };
        const response = await readApi(api, headers);

        if (response) {
          setUser(response);
          setfetchdata({ name: response?.name });
          setFieldValue("userMobile", phoneNumber)
        } else {
          setfetchdata({ name: "" });
        }
      } catch (error) {
        setfetchdata({ name: "" });
        setFieldValue("userMobile", phoneNumber)
        console.error("Error fetching User data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Formik
        enableReinitialize={true}
        initialValues={{
          shopname: "",
          userMobile: "",
          userName: fetchdata?.name || "",
          userRole: "",
          selectShop: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log("Data of values:", values);
          alert("Form Submitted! Check console for values.");
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
        }) => (
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
                  onValueChange={(selectedShop) => setFieldValue("selectShop", selectedShop)}
                />
                {touched.selectShop && errors.selectShop && (
                  <Text style={styles.errorText}>{errors.selectShop}</Text>
                )}
              </View>
            </View>
            {/* Shop Description */}
            {selectedShop?.details != null && (
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
            <RNPickerSelect
              onValueChange={handleChange("userRole")}
              onBlur={handleBlur("userRole")}
              value={values.userRole}
              items={roleOptions}
              style={pickerStyles}
            />
            {touched.userRole && errors.userRole && (
              <Text style={styles.errorText}>{errors.userRole}</Text>
            )}
            {/* Submit Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                handleSubmit();
              }}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

// Picker styles for dropdown
const pickerStyles = StyleSheet.create({
  inputAndroid: {
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    backgroundColor: "white",
    fontSize: 16,
    marginBottom: 15,
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
    // marginBottom: 10,
  },
  form: {
    marginTop: 10,
  },
  label: {
    fontSize: fontSize.labelLarge,
    fontFamily: "Poppins-Regular",
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    marginBottom: 15,
    backgroundColor: "white",
    height: 45, // Adjusted height for normal input
    borderRadius: 4,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
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
    fontSize: 16,
    fontWeight: "bold",
  },
  TextShopDes: {
    borderWidth: 1,
    backgroundColor: "#fff",
    paddingVertical: 10,
    marginHorizontal: 2,
    paddingHorizontal: 5,
    borderRadius: 4,
    marginBottom: 10,
  },
});

export default AddRole;
