import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Modal } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import { Button, TextInput } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { ButtonColor, fontSize, updateApi } from "../Util/UtilApi";
import UserDataContext from "../Store/UserDataContext";
import { useContext, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

const EditCustomerDetailsModal = ({
  visible,
  seteditmodal,
  SelectedEditItem,
  onUpdate,
  setCustomerData,

}) => {
  const { userData } = useContext(UserDataContext);
  const navigation = useNavigation()

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Name must be at least 2 characters long") // Optional: Minimum length for name
      .required("Enter the name"),

    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),

    number: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits") // Optional: Validates that the phone number is exactly 10 digits
      .required("Enter the Phone number"),

    address: Yup.string()
      .min(5, "Address must be at least 5 characters long") // Optional: Minimum length for address
      .required("Enter the Address"),
  });

  console.log("SELECTED ITEM ISSSSS157", setCustomerData);


  // const updateCustomerDetails = (id, updatedValues) => {
  //   console.log("Fucntion value", updatedValues);
  //   const updatedCustomerDetails = updatedValues.map((customer) =>
  //     customer.id === id ? { ...customer, ...updatedValues } : customer
  //   );

  //   // After updating, you can either update the state or return the updated array
  //   console.log(updatedCustomerDetails); // Logging for testing
  //   return updatedCustomerDetails; // Return the updated array (useful for React state)
  // };


     
  // const updateCustomerDetails = (id, updatedValues) => {
  //   console.log("Function value", updatedValues);
  
  //   // Assuming you are updating a single object, return the updated object
  //   const updatedCustomer = { id, ...updatedValues };
  
  //   console.log("Updated Customer Details:", updatedCustomer);
  //   return updatedCustomer;
  // };


  const hideModal = () => {
    seteditmodal((prev) => !prev);
  };
  return (
    <Modal
      visible={visible}
      onDismiss={hideModal}
      onRequestClose={hideModal}
      contentContainerStyle={styles.containerStyle}
    >
      <View style={styles.container}>
        <Formik
          initialValues={{
            name: SelectedEditItem?.user?.name || "",
            email: SelectedEditItem?.user?.email || "",
            number: SelectedEditItem?.user?.mobile || "",
            address: SelectedEditItem?.user?.address || "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            console.log("Data", values);
            const customerId = SelectedEditItem?.id;
            console.log("IFOF CUSTOMER ISSS", customerId);
            try {
              const editdata = {
                user: values?.name,
                address: values?.address,
                email: values?.email,
                number: values?.number,
              };
              if (customerId) {
                const response = await updateApi(
                  `customers/updateCustomer/${customerId}`,
                  editdata,
                  {
                    Authorization: `Bearer ${userData.token}`,
                  }
                );
                console.log("DATA OF RESPONSE IS1578 ", response?.customer);
                if (response) {
                  setCustomerData((prev) =>
                    prev.map((user) =>
                      customerId === user?.id
                        ? {
                            ...user,
                            ...response,
                          }
                        : user
                    )
                  );
                }
              }
              hideModal();
              resetForm();
              navigation.goBack()
            } catch (error) {
              console.log("Unable to update User ", error);
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
            <View style={styles.textView}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <View style={{}}>
                  <MaterialIcons
                    name="local-offer"
                    size={25}
                    color="black"
                    style={{ marginTop: 2 }}
                  />
                </View>
                <View style={{ flex: 1, alignItems: "center" }}>
                  <Text style={styles.title}>Edit User Details</Text>
                </View>
              </View>

              <TextInput
                label="Enter Name"
                value={values.name}
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                mode="outlined"
                style={styles.input}
                error={touched.name && Boolean(errors.name)}
              />
              {touched.name && errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}

              {/* <TextInput
                placeholder="Name"
                mode="outlined"
                style={styles.input}
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                value={values.name}
              />
              {touched.name && errors.name && <Text>{errors.name}</Text>} */}
              <TextInput
                label="Enter Email"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                mode="outlined"
                style={styles.input}
                error={touched.email && Boolean(errors.email)}
              />
              {touched.email && errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}

              <TextInput
                label="Enter Phone Number"
                value={values.number}
                onChangeText={handleChange("number")}
                onBlur={handleBlur("number")}
                mode="outlined"
                style={styles.input}
                error={touched.number && Boolean(errors.number)}
              />
              {touched.number && errors.number && (
                <Text style={styles.errorText}>{errors.number}</Text>
              )}
              <TextInput
                label="Enter Address"
                value={values.address}
                onChangeText={handleChange("address")}
                onBlur={handleBlur("address")}
                mode="outlined"
                style={styles.input}
                error={touched.address && Boolean(errors.address)}
              />
              {touched.address && errors.address && (
                <Text style={styles.errorText}>{errors.address}</Text>
              )}

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={[styles.saveButton]}
                >
                  <Text style={styles.saveButtonText}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={hideModal}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    // paddingHorizontal: 10,
    // marginHorizontal: 10,
    // marginVertical: 10,
    // paddingVertical: 10,
    flex: 1,
  },
  container: {
    // flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    marginHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
  },
  ButtonView: {
    marginTop: 20,
    backgroundColor: "green",
    borderRadius: 10,
  },
  saveButton: {
    padding: 10,
    backgroundColor: ButtonColor.SubmitBtn,
    borderRadius: 8,
    // paddingHorizontal: 30,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 30,
  },
  input: {
    marginVertical: 10,
    backgroundColor: "#fff",
  },
  textView: {
    // paddingHorizontal: 10,
    // marginHorizontal: 10,
    // marginVertical: 10,
    paddingVertical: 10,
  },
  title: {
    fontSize: fontSize.labelLarge,
    fontWeight: "bold",
    // marginBottom: 16,
    fontFamily: "Poppins-Regular",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20,
    marginTop: 20,
  },
  cancelButton: {
    padding: 10,
    // backgroundColor: "#d9534f",
    backgroundColor: "#fcb534",
    // backgroundColor: "#fcb534",
    borderRadius: 8,
    paddingHorizontal: 30,
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 12,
    color: "red",
  },
});

export default EditCustomerDetailsModal;
