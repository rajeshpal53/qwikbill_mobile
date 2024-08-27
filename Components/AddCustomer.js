import React, { useContext, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Button, TextInput, Text, HelperText, List, ActivityIndicator, Divider } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import { createApi, readApi } from "../Util/UtilApi";
const fetchOptions = async (input) => {
  const response = await readApi(
    `api/people/search?fields=phone&q=${input}&page=1&items=10`
  );
  const data = await response;
  return data.result; // Adjust according to your API response
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required("name is required").min(3, 'name must be at least 3 characters')
  .max(35, 'name must not exceed 35 characters'),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .required("Phone number is required")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits"),
  type: Yup.string().required("Type is required"),
});

const AddCustomer = ({ navigation, initialValues, handleSubmit }) => {
  const [options, setOptions] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [typeOptions, setTypeOptions] = useState(["people", "company"]);
  const [typeShowOptions, setTypeShowOptions] = useState(false);

  return (
    <Formik
      style={styles.container}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        //console.log("valusea are , ", values);
        handleSubmit(values);
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        values,
        errors,
        touched,
      }) => (
        <View style={styles.form}>
          <View
            style={{
              // marginVertical: 10,
              marginHorizontal: 2,
              // marginBottom: 10,
              position: "relative",
            }}
          >
            <TextInput
              placeholder="Name"
              mode="flat"
              underlineColor="#555555"
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              value={values.name}
              error={touched.name && errors.name ? true : false}
              style={styles.input}
            />
            {touched.name && errors.name && (
              <HelperText type="error" visible={touched.name && errors.name}>
                {errors.name}
              </HelperText>
            )}
          </View>

          <View style={{ 
            width: "100%", 
            // marginBottom: 10 
            }}>
            <TextInput
              placeholder="Phone"
              mode="flat"
              underlineColor="#555555"
              keyboardType="phone-pad"
              onChangeText={async (text) => {
                handleChange("phone")(text);
                if (text.length > 2) {
                  const fetchedOptions = await fetchOptions(text);
                  setOptions(fetchedOptions);
                  setShowOptions(true);
                } else {
                  setShowOptions(false);
                }
              }}
              onBlur={handleBlur("phone")}
              value={values.phone}
              error={touched.phone && errors.phone ? true : false}
              style={styles.input}
            />
            {touched.phone && errors.phone && (
              <HelperText type="error" visible={touched.phone && errors.phone}>
                {errors.phone}
              </HelperText>
            )}
            {showOptions && (
              <View style={styles.suggestionsContainer}>
                <ScrollView style={styles.suggestionsList}>
                  {options.map((option) => (
                    <List.Item
                      key={option._id}
                      title={option.phone}
                      onPress={async () => {
                        setFieldValue("phone", option.phone);
                        setFieldValue("name", option.name);
                        setFieldValue("email", option.email);
                        setFieldValue("type", option.type);
                        setShowOptions(false);
                      }}
                    />
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
          <View style={{ width: "100%" }}>
            <TextInput
            underlineColor="#555555"
              placeholder="GST No."
              mode="flat"
              onChangeText={handleChange("gstnumber")}
              onBlur={handleBlur("gstnumber")}
              value={values.gstnumber}
              error={touched.gstnumber && errors.gstnumber ? true : false}
              style={styles.input}
            />
            {touched.gstnumber && errors.gstnumber && (
              <HelperText
                type="error"
                visible={touched.gstnumber && errors.gstnumber}
              >
                {errors.gstnumber}
              </HelperText>
            )}
          </View>
          <View style={{ width: "100%", }}>
            <TextInput
            underlineColor="#555555"
              placeholder="Address"
              mode="flat"
              onChangeText={async (text) => {
                handleChange("address")(text);
                if (text.length > 2) {
                  const fetchedOptions = await fetchOptions(text);
                  setOptions(fetchedOptions);
                  setShowOptions(true);
                } else {
                  setShowOptions(false);
                }
              }}
              onBlur={handleBlur("address")}
              value={values.address}
              error={touched.address && errors.address ? true : false}
              style={styles.input}
            />
            {touched.address && errors.address && (
              <HelperText
                type="error"
                visible={touched.address && errors.address}
              >
                {errors.address}
              </HelperText>
            )}
            {showOptions && (
              <View style={styles.suggestionsContainer}>
                <ScrollView style={styles.suggestionsList}>
                  {options.map((option) => (
                    <List.Item
                      key={option._id}
                      title={option.phone}
                      onPress={async () => {
                        setFieldValue("phone", option.phone);
                        setFieldValue("firstname", option.firstname);
                        setFieldValue("lastname", option.lastname);
                        setFieldValue("email", option.email);
                        setFieldValue("type", option.type);
                        setShowOptions(false);
                      }}
                    />
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
          <View style={{ width: "100%" }}>
            <TextInput
            underlineColor="#555555"
              placeholder="Email"
              mode="flat"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              error={touched.email && errors.email ? true : false}
              style={styles.input}
            />
            {touched.email && errors.email && (
              <HelperText type="error" visible={touched.email && errors.email}>
                {errors.email}
              </HelperText>
            )}
          </View>
          <View style={{ width: "100%", }}>
            <TextInput
              underlineColor="#555555"
              placeholder="Type"
              mode="flat"
              onChangeText={async (text) => {
                handleChange("type")(text);
                if (text.length > 1) {
                  setTypeShowOptions(true);
                } else {
                  setTypeShowOptions(false);
                }
              }}
              onBlur={handleBlur("type")}
              value={values.type}
              error={touched.type && errors.type ? true : false}
              style={styles.input}
            />
            {touched.type && errors.type && (
              <HelperText type="error" visible={touched.type && errors.type}>
                {errors.type}
              </HelperText>
            )}
            {typeShowOptions && (
              <View style={styles.suggestionsContainer}>
                <ScrollView style={styles.suggestionsList}>
                  {typeOptions.map((option, index) => (
                    <React.Fragment key={index}>            
                    <List.Item
                    style={{borderWidth:0}}
                      // key={index}
                      title={option}
                      onPress={async () => {
                        setFieldValue("type", option);
                        setTypeShowOptions(false);
                      }}
                    >
                      {" "}
                      
                      {option}
                     
                    </List.Item>
                    <Divider />
                    </React.Fragment>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
          <Button mode="contained" onPress={handleSubmit} style={styles.button}>
            Submit
          </Button>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "#fff",
    backgroundColor: "green",
    // margin: 10,
    // padding: 25,
    borderRadius: 10,
    elevation: 5, // For shadow on Android
    shadowColor: "#000", // For shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginVertical: 10,
    flex: 1,
    height:"100%"
  },
  form: {
    // backgroundColor: "#fff",
    // backgroundColor: "lightgreen",
    // height:"100%",
    margin: 10,
    padding: 25,
    borderRadius: 10,
    elevation: 5, // For shadow on Android
    shadowColor: "#000", // For shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginVertical: 10,
    gap:15,
    flex:1,
    justifyContent:"center",
  },
  // input: {
  //   marginBottom: 16,
  //   backgroundColor: "white",
  //   shadowColor: "#000",
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.8,
  //   shadowRadius: 2,
  //   elevation: 4,
  //   overflow: "hidden",
  // },
  input: {
     width: "100%", 
     overflow: "hidden",  
     backgroundColor:"rgba(0,0,0,0)" 
  },
  button: {
    marginTop: 16,
    // marginBottom:70
  },
  suggestionsContainer: {
    position: "absolute",
    top: 55, // Adjust based on your input height and margin
    width: "100%",
    maxHeight: 200, // Adjust height as needed
    zIndex: 1,
    backgroundColor: "white",
    // borderWidth: 1,

  },
  suggestionsList: {
    width: "100%",
    // backgroundColor:"blue"
  },
});

export default AddCustomer;
