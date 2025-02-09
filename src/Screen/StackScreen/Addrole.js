import { Formik } from "formik";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { TextInput } from "react-native-paper";
import * as Yup from "yup";
import RNPickerSelect from "react-native-picker-select"; // Added picker for dropdown
import { ButtonColor } from "../../Util/UtilApi";

const AddRole = () => {
  const validationSchema = Yup.object({
    shopname: Yup.string().required("Shop Name is required"),
    selectUser: Yup.string().required("Select User is required"),
    userRole: Yup.string().required("User Role is required"),
  });

  const userOptions = [
    { label: "User 1", value: "user1" },
    { label: "User 2", value: "user2" },
    { label: "User 3", value: "user3" },
  ];

  const roleOptions = [
    { label: "Admin", value: "admin" },
    { label: "Manager", value: "manager" },
    { label: "Staff", value: "staff" },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Owner Name</Text>
        <Text style={styles.subHeaderText}>Akash Thapa</Text>
      </View>

      <Formik
        initialValues={{
          shopname: "",
          selectUser: "",
          userRole: "",
          shopDescription: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          // Debugging the form submission
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
        }) => (
          <View style={styles.form}>
            {/* Shop Name Label and Input */}
            <Text style={styles.label}>Shop Name</Text>
            <TextInput
              mode="outlined"
              style={styles.input}
              onChangeText={handleChange("shopname")}
              onBlur={handleBlur("shopname")}
              value={values.shopname}
            />
            {touched.shopname && errors.shopname && (
              <Text style={styles.errorText}>{errors.shopname}</Text>
            )}

            {/* Shop Description as an input field */}
            <Text style={styles.label}>Shop Description</Text>
            <View style={styles.TextShopDes}>
              <Text style={styles.TextShop}>
                This shop specializes in high-quality organic products, offering
                a wide range of items from fresh produce to eco-friendly
                household goods.
              </Text>
            </View>

            {/* Select User Dropdown */}
            <Text style={styles.label}>Select User</Text>
            <RNPickerSelect
              onValueChange={handleChange("selectUser")}
              onBlur={handleBlur("selectUser")}
              value={values.selectUser}
              items={userOptions}
              style={pickerStyles}
            />
            {touched.selectUser && errors.selectUser && (
              <Text style={styles.errorText}>{errors.selectUser}</Text>
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
    // paddingVertical: 10,
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
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  header: {},
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  subHeaderText: {
    fontSize: 16,
    color: "#777",
  },
  form: {
    marginTop: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    marginBottom: 15,
    backgroundColor: "white",
    height: 45, // Adjusted height for normal input
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: ButtonColor.SubmitBtn,
    padding: 15,
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
