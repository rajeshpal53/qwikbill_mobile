import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Button, Card, Divider, Text } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";
import CustomTextInput from "../../Components/Custom/CustomTextInput";
import { createApi, updateApi } from "../../Util/UtilApi";
import { useSnackbar } from "../../Store/SnackbarContext";
import { useRoute } from "@react-navigation/native";
// Validation Schema using Yup
const validationSchema = Yup.object().shape({
  shopName: Yup.string()
    .required("Shop name is required")
    .min(2, "Shop name must be at least 2 characters long"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  country: Yup.string().required("Country is required"),
  state: Yup.string()
    .required("State is required")
    .min(2, "State must be at least 2 characters long"),
  city: Yup.string()
    .required("City is required"),
  pincode: Yup.string()
    .required("Pincode is required")
    .min(6, "Pincode must be 6 digits long")
    .max(6, "Pincode must not be more than 6 digits long"),
  phone: Yup.string()
    .required("Phone number is required")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits"),
  gstNumber: Yup.string()
    .required("GST number is required")
    .matches(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[0-9A-Z]{1}$/,
      "Invalid GST number"
    ),
  accountNumber: Yup.string()
    // .required("Account number is required")
    .matches(/^[0-9]+$/, "Account number must contain only digits")
    .min(9, "Account number must be at least 9 digits long")
    .max(18, "Account number must be at most 18 digits long"),
  ifscCode: Yup.string()
    // .required("IFSC code is required")
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code"),
});

export default function CreateShopScreen({ route }) {
  const navigation = useNavigation();
  const { showSnackbar } = useSnackbar();

  const {isHome} = route.params||false;

  // const {isHome} = route.params.isHome;
  const data = route?.params?.shop;
  console.log("Route data is , ", isHome);

  // console.log("routedata , ", data);
  return (
    <View contentContainerStyle={styles.container}>
      <Formik
        initialValues={{
          shopName: data?.shopname || "",
          email: data?.email || "",
          phone: String(data?.phone) || "",
          phone: data?.phone !== undefined ? String(data.phone) : "",
          gstNumber: data?.gstnumber || "",
          country: data?.address[0]?.country || "",
          state: data?.address[0]?.state || "",
          city: data?.address[0]?.city || "",
          pincode:
            data?.address?.[0]?.pincode !== undefined
              ? String(data.address[0].pincode)
              : "",
          accountNumber: data?.bankDetail[0]?.account || "",
          ifscCode: data?.bankDetail[0]?.ifsccode || "",
          bankName: data?.bankDetail[0]?.bankname || "",
          branch: data?.bankDetail[0]?.branch || "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          console.log("shop created and values are , ", values);

          const formattedData = {
            shopname: values.shopName,
            address: [
              {
                country: values.country,
                state: values.state,
                city: values.city,
                pincode: values.pincode,
              },
            ],
            bankDetail: [
              {
                account: values.accountNumber,
                bankname: values.bankName,
                branch: values.branch,
                ifsccode: values.ifscCode,
              },
            ],
            phone: values.phone,
            gstnumber: values.gstNumber,
            email: values.email,
          };

          if (data) {
            console.log("data is , ", data);
            try {
              headers = {
                "Content-Type": "application/json",
              };
              const response = await updateApi(
                `api/shop/update/${data._id}`,
                formattedData,
                headers
              );

              console.log("response is , ", response);
              showSnackbar("shop updated successfully", "success");
              if(isHome){
                navigation.navigate("Home")
              }else{
                navigation.navigate("ViewShops");
              }
              
            } catch (error) {
              console.log("error is ", error);
              showSnackbar("error to create new product", "error");
            }
          } else {
            try {
              headers = {
                "Content-Type": "application/json",
              };
              const response = await createApi(
                "api/shop/create",
                formattedData,
                headers
              );

              console.log("response is , ", response);
              showSnackbar("shop created successfully", "success");
              // resetForm();
              navigation.navigate("ViewShops");
            } catch (error) {
              console.log("error is ", error);
              showSnackbar("error to create new product", "error");
            }
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
          <ScrollView>
            <View style={styles.form}>
              <View style={styles.shopDetails}>
                <Text
                  style={{ color: "#555555" }}
                  variant="bodyMedium"
                >
                  Shop Details
                </Text>
                <Divider style={[styles.dividerStyle, { width: "70%" }]} />
                <CustomTextInput
                  placeholder="Shop Name"
                  value={values.shopName}
                  onChangeText={handleChange("shopName")}
                  onBlur={handleBlur("shopName")}
                  error={errors.shopName}
                  touched={touched.shopName}
                />
                <CustomTextInput
                  placeholder="Email ID"
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  error={errors.email}
                  touched={touched.email}
                  keyboardType="email-address"
                />
                <CustomTextInput
                  placeholder="Mobile Details"
                  value={values.phone}
                  onChangeText={handleChange("phone")}
                  onBlur={handleBlur("phone")}
                  error={errors.phone}
                  touched={touched.phone}
                  keyboardType="numeric"
                />
                <CustomTextInput
                  placeholder="GST Number"
                  value={values.gstNumber}
                  onChangeText={handleChange("gstNumber")}
                  onBlur={handleBlur("gstNumber")}
                  error={errors.gstNumber}
                  touched={touched.gstNumber}
                  // keyboardType=""
                />
                </View>
                <View style={styles.shopDetails}>
                <Text
                  style={{ color: "#555555" }}
                  variant="bodyMedium"
                >
                  Address
                </Text>
                <Divider style={[styles.dividerStyle, { width: "80%" }]} />
                <CustomTextInput
                  placeholder="Country"
                  value={values.country}
                  onChangeText={handleChange("country")}
                  onBlur={handleBlur("country")}
                  error={errors.country}
                  touched={touched.country}
                />
                <CustomTextInput
                  placeholder="State"
                  value={values.state}
                  onChangeText={handleChange("state")}
                  onBlur={handleBlur("state")}
                  error={errors.state}
                  touched={touched.state}
                />
                <CustomTextInput
                  placeholder="City"
                  value={values.city}
                  onChangeText={handleChange("city")}
                  onBlur={handleBlur("city")}
                  error={errors.city}
                  touched={touched.city}
                />
                <CustomTextInput
                  placeholder="Pincode"
                  value={values.pincode}
                  onChangeText={handleChange("pincode")}
                  onBlur={handleBlur("pincode")}
                  error={errors.pincode}
                  touched={touched.pincode}
                  keyboardType="numeric"
                />
                </View>
                <View style={styles.shopDetails}>
                <Text
                  style={{ color: "#555555" }}
                  variant="bodyMedium"
                >
                  Bank Details
                </Text>
                <Divider style={[styles.dividerStyle, { width: "70%" }]} />
                <CustomTextInput
                  placeholder="Account No."
                  value={values.accountNumber}
                  onChangeText={handleChange("accountNumber")}
                  onBlur={handleBlur("accountNumber")}
                  error={errors.accountNumber}
                  touched={touched.accountNumber}
                  keyboardType="numeric"
                />
                <CustomTextInput
                  placeholder="IFSC Code"
                  value={values.ifscCode}
                  onChangeText={handleChange("ifscCode")}
                  onBlur={handleBlur("ifscCode")}
                  error={errors.ifscCode}
                  touched={touched.ifscCode}
                  // keyboardType="numeric"
                />
                <CustomTextInput
                  placeholder="Bank Name"
                  value={values.bankName}
                  onChangeText={handleChange("bankName")}
                  onBlur={handleBlur("bankName")}
                  error={errors.bankName}
                  touched={touched.bankName}
                />
                <CustomTextInput
                  placeholder="Branch"
                  value={values.branch}
                  onChangeText={handleChange("branch")}
                  onBlur={handleBlur("branch")}
                  error={errors.branch}
                  touched={touched.branch}
                />
              </View>

              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.button}
              >
                {data ? "Update Shop" : "Create Shop"}
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
  form: {
    // padding: 20,
    borderRadius: 10,
    gap:10,
    // elevation: 5, // For shadow on Android
    
    margin: 10,
  },
  button: {
    marginTop: 10,
  },
  shopDetails: {
    // flexDirection: "row",
    // flexWrap: "wrap",
    padding:10,
    backgroundColor:"#fff",
    justifyContent: "space-between",
    elevation:2,
    shadowColor: "#000", // For shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  dividerStyle: {
    marginTop: 10,
    position: "relative",
    top: -17,
    alignSelf: "flex-end",
  },
});
