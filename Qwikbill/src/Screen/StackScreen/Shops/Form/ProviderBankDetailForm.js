import { Pressable, StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import React from "react";
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
  const { showSnackbar } = useSnackbar();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80} // adjust if header overlaps
    >
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={{ gap: 12 }}>
          <View style={{ marginVertical: 15 }}>
            <ServiceImagePicker
              image={values?.signature}
              label={"Authorized Signature"}
              setFieldValue={setFieldValue}
              uploadFieldName={shopImageField}
            />
          </View>

          <TextInput
            label={t("A/C Number")}
            mode={textInputMode}
            style={{ backgroundColor: "transparent", marginBottom: 10 }}
            keyboardType="numeric"
            onChangeText={(text) => {
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
            style={{ backgroundColor: "transparent", marginVertical: 10 }}
            autoCapitalize="characters"
            onChangeText={(text) => {
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
            style={{ backgroundColor: "transparent", marginVertical: 10 }}
            onChangeText={(text) => {
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
            style={{ backgroundColor: "transparent", marginVertical: 10 }}
            onChangeText={(text) => {
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

          <TextInput
            label={t("UPI ID")}
            mode={textInputMode}
            style={{ backgroundColor: "transparent", marginVertical: 10 }}
            onChangeText={(text) => {
              const trimmed = text.trim();
              handleChange("upiId")(trimmed);
            }}
            onBlur={handleBlur("upiId")}
            value={values.upiId}
            error={touched.upiId && errors.upiId}
          />
          {touched.upiId && errors.upiId && (
            <Text style={{ color: "red" }}>{errors.upiId}</Text>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ProviderBankDetailForm;

const styles = StyleSheet.create({
  switchComponentStyle: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
});
