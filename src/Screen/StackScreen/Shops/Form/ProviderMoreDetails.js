import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import ServiceImagePicker from "../../../../Components/ServiceImagePicker";

import { Card, Divider, HelperText, TextInput } from "react-native-paper";
import { useTranslation } from "react-i18next";

const ProviderMoreDetails = ({
  title,
  isAdmin,
  handleBlur,
  handleChange,
  values,
  setFieldValue,
  touched,
  errors,
  textInputMode,
  aadharFrontImageField,
  aadharBackImageField,
}) => {
  const { t } = useTranslation();
  return (
    <View
      style={{
        gap: 10,
        // backgroundColor:"lightblue",
        padding: 1,
      }}
    >
      {/* <View style={{alignItems:"center"}}>
        <Text style={{fontWeight:"bold", fontSize:18}}>{title}</Text>
      </View> */}

      <View>
        <TextInput
          label={t("Aadhaar Card Number")}
          mode={textInputMode}
          style={{ backgroundColor: "transparent" }}
          keyboardType="numeric"
          maxLength={12}
          onChangeText={handleChange("aadhaarNumber")}
          onBlur={handleBlur("aadhaarNumber")}
          value={values.aadhaarNumber}
          error={touched.aadhaarNumber && errors.aadhaarNumber}
        />
        {touched.aadhaarNumber && errors.aadhaarNumber && (
          <Text style={{ color: "red" }}>{errors.aadhaarNumber}</Text>
        )}
      </View>

      <View style={{gap:20}}>

      <ServiceImagePicker
          image={values?.aadharFrontImage}
          label="Upload Aadhar Card Front Image"
          setFieldValue={setFieldValue}
          uploadFieldName={aadharFrontImageField}
        />
         <HelperText
          type="error"
          visible={touched.aadharFrontImage && !!errors.aadharFrontImage}
        >
          {errors.aadharFrontImage}
        </HelperText>
 
    
        <ServiceImagePicker
          image={values?.aadharBackImage}
          label="Upload Aadhar Card Back Image"
          setFieldValue={setFieldValue}
          uploadFieldName={aadharBackImageField}
        />
         <HelperText
          type="error"
          visible={touched.aadharBackImage && !!errors.aadharBackImage}
        >
          {errors.aadharBackImage}
        </HelperText>
        

        </View>


     
    </View>
  );
};

export default ProviderMoreDetails;

const styles = StyleSheet.create({
  cardStyle: {
    backgroundColor: "#fff",
    elevation: 5,
    padding: 10,
    borderRadius: 10,
  },
});
