import React, { useState, useContext, useId } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import {
  TextInput,
  Button,
  Card,
  Title,
  HelperText,
  List,
  Text,
  Divider,
} from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import { readApi } from "../Util/UtilApi";
const fetchOptions = async (input) => {
  const response = await readApi(
    `api/productcategory/search?fields=name&q=${input}&page=1&items=10`
  );
  const data = await response;
  return data.result; // Adjust according to your API response
};
const fetchHsnOptions = async (input) => {
  const response = await readApi(
    `api/taxes/list?fields=taxName&q=${input}&page=1&items=10`
  );
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

const AddProduct = ({ navigation, initialValues, handleSubmit }) => {
  console.log("in addproduct ", initialValues);
  const [options, setOptions] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [showHsnOptions, setShowHsnOptions] = useState(false);
  return (
    <Formik
      initialValues={initialValues}
      style={styles.container}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        handleSubmit(values);
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
        <View style={styles.form}>
          <View
            style={{
              marginHorizontal: 2,
              position: "relative",
            }}
          >
            <TextInput
              label="Product Name"
              underlineColor="gray"
              mode="flat"
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              value={values.name}
              style={styles.input}
              error={touched.name && !!errors.name}
            />
            <HelperText type="error" visible={touched.name && !!errors.name}>
              {errors.name}
            </HelperText>
          </View>

          <View
            style={{
              marginHorizontal: 2,
              position: "relative",
            }}
          >
            <TextInput
              label="Pruchase Price"
              underlineColor="gray"
              keyboardType="phone-pad"
              mode="flat"
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
          </View>

          <View
            style={{
              // marginVertical: 10,
              marginHorizontal: 2,
              // marginBottom: 10,
              position: "relative",
            }}
          >
            <TextInput
              underlineColor="gray"
              label="Selling Price"
              keyboardType="phone-pad"
              mode="flat"
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
          </View>
          <View
            style={{
              // marginVertical: 10,
              marginHorizontal: 2,
              // marginBottom: 10,
              position: "relative",
            }}
          >
            <TextInput
              underlineColor="gray"
              label="HSN Code"
              mode="flat"
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
            {showHsnOptions && (
              <View style={styles.suggestionsContainer}>
                <ScrollView style={styles.suggestionsList}>
                  {options.map((option, index) => (
                    <>
                      <List.Item
                        key={index}
                        title={option.taxName}
                        onPress={async () => {
                          setFieldValue("hsncode", option.taxName);
                          setFieldValue("taxValue", option.taxValue.toString());
                          setShowHsnOptions(false);
                        }}
                      ></List.Item>
                      <Divider />
                    </>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <View
            style={{
              // marginVertical: 10,
              marginHorizontal: 2,
              // marginBottom: 10,
              position: "relative",
            }}
          >
            <TextInput
              underlineColor="gray"
              label="Tax Value"
              keyboardType="phone-pad"
              mode="flat"
              disabled = "true"
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
  suggestionsContainer: {
    position: "absolute",
    top: 55, // Adjust based on your input height and margin
    width: "100%",
    maxHeight: 200, // Adjust height as needed
    elevation: 2,
    zIndex: 1,
    backgroundColor: "white",
  },
  suggestionsList: {
    width: "100%",
    borderWidth: 0,
  },
  form: {
    // backgroundColor: "#fff",
    // backgroundColor: "lightgreen",
    // height:"100%",
    // margin: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    paddingVertical: 50,
    borderRadius: 10,
    elevation: 5, // For shadow on Android
    shadowColor: "#000", // For shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: "center",
  },
  container: {
    // backgroundColor: "#fff",
    // backgroundColor: "green",
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
    height: "100%",
  },
  input: {
    // marginBottom: 5,
    backgroundColor: "rgba(0,0,0,0)",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.8,
    // shadowRadius: 2,
    // elevation: 4,
    overflow: "hidden",
  },
  error: {
    fontSize: 12,
    color: "red",
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    width: "90%",
    alignSelf: "center",
    marginBottom: 10,
  },
});

export default AddProduct;
