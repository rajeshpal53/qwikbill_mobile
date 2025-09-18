import { Pressable, StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { Checkbox, Divider, TextInput } from "react-native-paper";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";
import ServiceImagePicker from "../../../../Components/ServiceImagePicker";
import { useSnackbar } from "../../../../Store/SnackbarContext";

const ProviderBankDetailForm = ({
  handleBlur,
  handleChange,
  setFieldValue,
  values,
  touched,
  errors,
  isAdmin,
  textInputMode,
  shopImageField,
}) => {
  const { t } = useTranslation();
  // const { getAddressAllDetails } = useLocation();
  const { showSnackbar } = useSnackbar();

 
  return (
    <View style={{ gap: 12}}>
      <View style={{ marginVertical: 15 }}>
        <ServiceImagePicker
          image={values?.signature}
          label={"Autherized Signature"}
          setFieldValue={setFieldValue}
          uploadFieldName={shopImageField}
        />
      </View>
     <View>
 
    <TextInput
  label={t("A/C Number")}
  mode={textInputMode}
  style={{ backgroundColor: "transparent",marginBottom:10 }}
  keyboardType="numeric"
  onChangeText={(text) => {
    // Allow only numbers
    const formatted = text.replace(/[^0-9]/g, "");
    handleChange("accountNumber")(formatted);
  }}
  onBlur={handleBlur("accountNumber")}
  value={values.accountNumber}
  error={touched.accountNumber && errors.accountNumber}
/>
{touched.accountNumber && errors.accountNumber && (
  <Text style={{ color: "red" }}>{errors.accountNumber}</Text>
)}

<TextInput
  label={t("IFSC Code")}
  mode={textInputMode}
  style={{ backgroundColor: "transparent",marginVertical:10 }}
  autoCapitalize="characters"
  onChangeText={(text) => {
    // Uppercase, remove spaces, keep alphanumeric only
    const formatted = text.toUpperCase().replace(/[^A-Z0-9]/g, "");
    handleChange("ifscCode")(formatted);
  }}
  onBlur={handleBlur("ifscCode")}
  value={values.ifscCode}
  error={touched.ifscCode && errors.ifscCode}
/>
{touched.ifscCode && errors.ifscCode && (
  <Text style={{ color: "red" }}>{errors.ifscCode}</Text>
)}

<TextInput
  label={t("Branch Name")}
  mode={textInputMode}
  style={{ backgroundColor: "transparent",marginVertical:10}}
  onChangeText={(text) => {
    // Trim extra spaces
    const formatted = text.replace(/\s+/g, " ");
    handleChange("branchName")(formatted);
  }}
  onBlur={handleBlur("branchName")}
  value={values.branchName}
  error={touched.branchName && errors.branchName}
/>
{touched.branchName && errors.branchName && (
  <Text style={{ color: "red" }}>{errors.branchName}</Text>
)}

<TextInput
  label={t("A/C Holder Name")}
  mode={textInputMode}
  style={{ backgroundColor: "transparent",marginVertical:10 }}
  onChangeText={(text) => {
    // Remove numbers/special chars, allow alphabets, space, and dot
    const formatted = text.replace(/[^a-zA-Z\s.]/g, "");
    handleChange("accountHolderName")(formatted);
  }}
  onBlur={handleBlur("accountHolderName")}
  value={values.accountHolderName}
  error={touched.accountHolderName && errors.accountHolderName}
/>
{touched.accountHolderName && errors.accountHolderName && (
  <Text style={{ color: "red" }}>{errors.accountHolderName}</Text>
)}
</View>

 
    </View>
  );
};

export default ProviderBankDetailForm;

const styles = StyleSheet.create({
  switchComponentStyle: {
    flexDirection: "row-reverse",
    // backgroundColor:"pink",
    alignItems: "center",
  },
});
