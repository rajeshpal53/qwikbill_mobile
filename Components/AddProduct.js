import React, { useState,useContext, useId} from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import {
  TextInput,
  Button,
  Card,
  Title,
  HelperText,
  List,
  Text,
} from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import { readApi } from "../Util/UtilApi";
const fetchOptions = async (input) => {
  const response = await readApi(`api/productcategory/search?fields=name&q=${input}&page=1&items=10`);
  const data = await response;
  return data.result; // Adjust according to your API response
};
const fetchHsnOptions = async (input) => {
  const response = await readApi(
    `api/taxes/list?fields=taxName&q=${input}&page=1&items=10`);
  const data = await response;
  return data.result; // Adjust according to your API response
};
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  sellingPrice: Yup.number()
    .required("Selling price is required")
    .typeError("Selling price must be a number"),
  taxValue: Yup.number()
    .required("Tax value is required")
    .typeError("Tax value must be a number"),
  purchasePrice: Yup.number()
    .required("Purchase price is required")
    .typeError("Purchase price must be a number"),
  hsncode: Yup.string().required("HSN code is required"),
});

const AddProduct = ({ navigation,initialValues,handleSubmit }) => {
  console.log("in addproduct ", initialValues);
  const [options, setOptions] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [showHsnOptions, setShowHsnOptions] = useState(false);
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        handleSubmit(values)
      }}
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
        <View style={styles.container}>
          <TextInput
            label=" Product Name"
            mode="outlined"
            onChangeText={handleChange("name")}
            onBlur={handleBlur("name")}
            value={values.name}
            style={styles.input}
            error={touched.name && !!errors.name}
          />
          <HelperText type="error" visible={touched.name && !!errors.name}>
            {errors.name}
          </HelperText>
         
          <TextInput
            label="Purchase Price"
            keyboardType="phone-pad"
            mode="outlined"
            onChangeText={handleChange("purchasePrice")}
            onBlur={handleBlur("purchasePrice")}
            value={values.purchasePrice}
            style={styles.input}
            error={touched.purchasePrice && !!errors.purchasePrice}
          />
          <HelperText
            type="error"
            visible={touched.purchasePrice && !!errors.purchasePrice}
          >
            {errors.purchasePrice}
          </HelperText>

          <TextInput
            label="Selling Price"
            keyboardType="phone-pad"
            mode="outlined"
            onChangeText={handleChange("sellingPrice")}
            onBlur={handleBlur("sellingPrice")}
            value={values.sellingPrice}
            style={styles.input}
            error={touched.sellingPrice && !!errors.sellingPrice}
          />
          <HelperText
            type="error"
            visible={touched.sellingPrice && !!errors.sellingPrice}
          >
            {errors.sellingPrice}
          </HelperText>
          <View>
          <TextInput
            label="HSN Code"
            mode="outlined"
            onChangeText={async (text) => {
              handleChange("hsncode")(text);
              if (text.length > 1) {
                const fetchedOptions = await fetchHsnOptions(text);
                setOptions(fetchedOptions);
                setShowHsnOptions(true);
              } else {
                setShowHsnOptions(false);
              }
            }}
            onBlur={handleBlur("hsncode")}
            value={values.hsncode}
            style={styles.input}
            error={touched.hsncode && !!errors.hsncode}
          />
          <HelperText
            type="error"
            visible={touched.hsncode && !!errors.hsncode}
          >
            {errors.hsncode}
          </HelperText>
          {showHsnOptions &&
            <View style={styles.suggestionsContainer}>
                <ScrollView style={styles.suggestionsList}>{
            options.map((option, index) => (
             
                <List.Item
                  key={index}
                  title={option.taxName}
                  onPress={async () => {
                    setFieldValue("hsncode", option.taxName);
                    setFieldValue("taxValue", option.taxValue.toString());
                    setShowHsnOptions(false);
                  }}
                > </List.Item>
            ))}</ScrollView></View> }
          </View>
          <TextInput
            label="Tax Value"
            keyboardType="phone-pad"
            mode="outlined"
            onChangeText={handleChange("taxValue")}
            onBlur={handleBlur("taxValue")}
            value={values.taxValue}
            style={styles.input}
            error={touched.taxValue && !!errors.taxValue}
          />
          <HelperText
            type="error"
            visible={touched.taxValue && !!errors.taxValue}
          >
            {errors.taxValue}
          </HelperText>

          <Button mode="contained" onPress={handleSubmit} style={styles.button}>
            Submit
          </Button>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  suggestionsContainer: {
    position: "absolute",
    top: 55, // Adjust based on your input height and margin
    width: "100%",
    maxHeight: 200, // Adjust height as needed
    minHeight:70,
    zIndex: 1,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "gray",
    borderTopColor:'white',
    borderRadius: 4,
  },
  suggestionsList: {
    width: "100%",
  },
  container: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 25,
    borderRadius: 10,
    elevation: 5, // For shadow on Android
    shadowColor: "#000", // For shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginVertical: 10,
  },
  card: {
    elevation: 4,
    borderRadius: 8,
    padding: 10,
  },
  title: {
    textAlign: "left",
    marginBottom: 20,
  },
  input: {
    marginBottom: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
    overflow: "hidden",
  },
  error: {
    fontSize: 12,
    color: "red",
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
});

export default AddProduct;
