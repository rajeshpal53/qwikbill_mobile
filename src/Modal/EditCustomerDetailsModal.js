import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Modal } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import { Button, TextInput } from "react-native-paper";

const EditCustomerDetailsModal = ({
  visible,
  seteditmodal,
  SelectedEditItem,
  onUpdate
}) => {
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
      on
      contentContainerStyle={styles.containerStyle}
    >
      <View style={styles.container}>
        <View>
          <Text> Edit user Details</Text>
        </View>
        <Formik
          initialValues={{
            name: SelectedEditItem?.name || "",
            email: SelectedEditItem?.email || "",
            number: SelectedEditItem?.mobile || "",
            address: SelectedEditItem?.address || "",
          }}
          validationSchema={validationSchema}
          // onSubmit={(values) => {
          //   console.log("Data", values);
          //   const customerId = SelectedEditItem?.id;
          //   if (customerId) {
          //     onUpdate(customerId, values);
          //     hideModal();
          //   } else {
          //     console.log("No customer ID found");
          //   }
          // }}


          onSubmit={async (values) => {
            console.log("Data", values);
            const customerId = SelectedEditItem?.id;
            if (customerId) {
              await onUpdate(customerId, values); // Wait for API call to complete
            } else {
              console.log("No customer ID found");
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
              <TextInput
                placeholder="Name"
                mode="outlined"
                style={styles.input}
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                value={values.name}
              />
              {touched.name && errors.name && <Text>{errors.name}</Text>}

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
                placeholder="Phone Number"
                mode="outlined"
                style={styles.input}
                onChangeText={handleChange("number")}
                onBlur={handleBlur("number")}
                value={values.number}
                keyboardType="phone-pad" // Show the phone number keyboard
                maxLength={10} // Limit the phone number to 10 digits
              />
              {touched.number && errors.number && <Text>{errors.number}</Text>}

              <TextInput
                placeholder="Address"
                mode="outlined"
                style={styles.input}
                onChangeText={handleChange("address")}
                onBlur={handleBlur("address")}
                value={values.address}
              />
              {touched.address && errors.address && (
                <Text>{errors.address}</Text>
              )}

              <View style={styles.ButtonView}>
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={styles.saveButton}
                >
                  <Text style={styles.saveButtonText}>Update Address</Text>
                </TouchableOpacity>
                {/* <Button onPress={handleSubmit} title="Submit" /> */}
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
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    marginHorizontal: 10,
    marginVertical: 10,
    paddingVertical: 10,
  },
  ButtonView: {
    marginTop: 20,
    backgroundColor: "green",
    borderRadius: 10,
  },
  saveButton: {
    padding: 10,
    backgroundColor: "#0a6846",
    borderRadius: 8,
    // paddingHorizontal: 30,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    marginVertical: 10,
  },
  textView: {
    // paddingHorizontal: 10,
    // marginHorizontal: 10,
    // marginVertical: 10,
    paddingVertical: 10,
  },
});

export default EditCustomerDetailsModal;
