import { Directions } from "react-native-gesture-handler";
import React, { useState, useId, useContext } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import {
  TextInput,
  Button,
  HelperText,
  Divider,
  Text,
  List,
} from "react-native-paper";
// import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Formik, FieldArray } from "formik";
import * as Yup from "yup";
import { readApi } from "../Util/UtilApi";
import { useNavigation } from "@react-navigation/native";

// Validation Schema using Yup
const validationSchema = Yup.object().shape({
  shopName: Yup.string()
    .required("shop name is required")
    .min(2, "shop must be at least 2 characters long"),
  country: Yup.string().required("country is required"),
  state: Yup.string()
    .required("state is required")
    .min(2, "state must be at least 2 characters long"),
  pincode: Yup.string()
    .required("pincode is required")
    .min(6, "pincode must be 6 digits long")
    .max(6, "pincode must note be more than 6 digits long"),
  phone: Yup.string()
    .required("Phone number is required")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits"),
});

export default function CreateShopScreen() {
  const [options, setOptions] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [showItemOptions, setShowItemOptions] = useState(false);
  const [fetchData, setFetchData] = useState([]);
  const navigation = useNavigation();

  return (
    <View contentContainerStyle={styles.container}>
        <View>
            <Text variant="headlineSmall" style={{textAlign:"center"}}>
                Create New Shop
            </Text>
        </View>
      <Formik
        initialValues={{
          shopName: "",
          country: "",
          state: "",
          city: "",
          pincode: "",
          phone: "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
            console.log("shop created")
        //   resetForm();
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
            <ScrollView>
          <View style={styles.form}>
            <View style={styles.shopDetails}>
              <View style={{ width: "100%", marginBottom: 10 }}>
                <TextInput
                  label="Shop Name"
                  mode="outlined"
                  onChangeText={async (text) => {
                    handleChange("shopName")(text);
                  }}
                  onBlur={handleBlur("shopName")}
                  value={values.shopName}
                  error={touched.shopName && errors.shopName ? true : false}
                  style={{ width: "100%", marginBottom: 10 }}
                />
                {touched.shopName && errors.shopName && (
                  <HelperText
                    type="error"
                    visible={touched.shopName && errors.shopName}
                  >
                    {errors.shopName}
                  </HelperText>
                )}
              </View>
              <View style={{ width: "100%", marginBottom: 10 }}>
                <TextInput
                  label="Country"
                  mode="outlined"
                  onChangeText={handleChange("country")}
                  onBlur={handleBlur("country")}
                  value={values.country}
                  error={touched.country && errors.country ? true : false}
                  style={{ width: "100%", marginBottom: 10 }}
                />
                {touched.country && errors.country && (
                  <HelperText
                    type="error"
                    visible={touched.country && errors.country}
                  >
                    {errors.country}
                  </HelperText>
                )}
              </View>
              <View style={{ width: "100%", marginBottom: 10 }}>
                <TextInput
                  label="State"
                  mode="outlined"
                  onChangeText={handleChange("state")}
                  onBlur={handleBlur("state")}
                  value={values.state}
                  error={touched.state && errors.state ? true : false}
                  style={{ width: "100%", marginBottom: 10 }}
                />
                {touched.state && errors.state && (
                  <HelperText
                    type="error"
                    visible={touched.state && errors.state}
                  >
                    {errors.state}
                  </HelperText>
                )}
              </View>
              <View style={{ width: "100%", marginBottom: 10 }}>
                <TextInput
                  label="City"
                  mode="outlined"
                  onChangeText={handleChange("city")}
                  onBlur={handleBlur("city")}
                  value={values.city}
                  error={touched.city && errors.city ? true : false}
                  style={{ width: "100%", marginBottom: 10 }}
                />
                {touched.city && errors.city && (
                  <HelperText
                    type="error"
                    visible={touched.city && errors.city}
                  >
                    {errors.city}
                  </HelperText>
                )}
              </View>
              <View style={{ width: "100%", marginBottom: 10 }}>
                <TextInput
                  label="Pincode"
                  mode="outlined"
                  onChangeText={handleChange("pincode")}
                  onBlur={handleBlur("pincode")}
                  value={values.pincode}
                  error={touched.pincode && errors.pincode ? true : false}
                  style={{ width: "100%", marginBottom: 10 }}
                />
                {touched.pincode && errors.pincode && (
                  <HelperText
                    type="error"
                    visible={touched.pincode && errors.pincode}
                  >
                    {errors.pincode}
                  </HelperText>
                )}
              </View>
              <View style={{ width: "100%", marginBottom: 10 }}>
                <TextInput
                  label="Phone"
                  mode="outlined"
                  onChangeText={handleChange("phone")}
                  onBlur={handleBlur("phone")}
                  value={values.phone}
                  error={touched.phone && errors.phone ? true : false}
                  style={{ width: "100%", marginBottom: 10 }}
                />
                {touched.phone && errors.phone && (
                  <HelperText
                    type="error"
                    visible={touched.phone && errors.phone}
                  >
                    {errors.phone}
                  </HelperText>
                )}
              </View>
              
            </View>

            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.button}
            >
              Create Shop
            </Button>
          </View>
          </ScrollView>
        )}
        
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
    marginVertical: 20,
    position: "relative",
  },
  suggestionsContainer: {
    position: "absolute",
    top: 55, // Adjust based on your input height and margin
    width: "100%",
    maxHeight: 200, // Adjust height as needed
    zIndex: 1,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
  },
  suggestionsList: {
    width: "100%",
  },
  form: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5, // For shadow on Android
    shadowColor: "#000", // For shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    margin:10
    
  },
  input: {
    marginBottom: 10,
    overflow: "hidden",
  },
  button: {
    marginTop: 10,
  },
  itemContainer: {
    marginBottom: 10,
  },
  shopDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
