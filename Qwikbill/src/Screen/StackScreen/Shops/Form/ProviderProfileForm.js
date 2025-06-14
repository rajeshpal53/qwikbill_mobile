import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { useState } from "react";
import { Card, Checkbox, Divider, List, TextInput } from "react-native-paper";
import { useTranslation } from "react-i18next";
import GenericDropdown from "../../../../UI/DropDown/GenericDropDown";
import ServiceImagePicker from "../../../../Components/ServiceImagePicker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const ProviderProfileForm = ({
  title,
  handleBlur,
  handleChange,
  setFieldValue,
  values,
  touched,
  errors,
  selectedGender,
  routeProfileImageUrl,
  genderList,
  setSelectedGender,
  textInputMode,
  setProfileImage,
  profileImage,
  isAdmin,
  isRouteDataPresent,
  profileImageField,
}) => {
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [whatsappNumberSameChecked, setWhatsappNumberSameChecked] =
    useState(false);
  const { t } = useTranslation();

  const handleSelectGender = (genderValue) => {
    console.log("selecting gender is , ", genderValue);
    setSelectedGender(genderValue);
    setFieldValue("gender", genderValue);
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0"); // Ensures 2 digits
    const month = date.toLocaleString("default", { month: "long" }); // Full month name
    const year = date.getFullYear();
    return `${day} ${month} ${year}`; // Concatenate in "DD Month YYYY" format
  };

  return (
    <View style={{ gap: 10 }}>
      {/* <View style={{ alignItems: "center" }}>
        <Text style={{ fontWeight: "bold", fontSize: 18 }}>{title}</Text>
      </View> */}

      <View>
        {/* <Card style={{ backgroundColor:"#fff", padding:10}}> */}
        {console.log("proiileImage is , ", values?.profileImage)}
        <View style={{ marginBottom: 12, marginTop: 5 }}>
          <ServiceImagePicker
            image={values?.profileImage}
            label="Profile Image"
            isAdmin={isAdmin}
            setFieldValue={setFieldValue}
            uploadFieldName={profileImageField}
            type={"rounded"}
            camera={true}
            // gallary={isAdmin ? true : false}
            gallary={true}
          />
          {touched.profileImage && errors.profileImage && (
            <Text style={{ color: "red", textAlign: "center" }}>
              {errors.profileImage}
            </Text>
          )}

        </View>
        {/* </Card> */}

        <TextInput
          label={t("Name") + " *"}
          // underlineColor="transparent"
          // activeUnderlineColor="transparent"
          underlineStyle={styles.inputUnderline}
          mode={textInputMode}
          style={styles.input}
          onChangeText={handleChange("name")}
          onBlur={handleBlur("name")}
          value={values.name}
          error={touched.name && errors.name}
        />
        {touched.name && errors.name && (
          <Text style={{ color: "red" }}>{errors.name}</Text>
        )}
      </View>

      <View>
        <TextInput
          label={t("Mobile Number") + " *"}
          mode={textInputMode}
          style={styles.input}
          onChangeText={handleChange("mobile")}
          maxLength={10}
          onBlur={handleBlur("mobile")}
          value={values.mobile}
          error={touched.mobile && errors.mobile}
          disabled={isRouteDataPresent || !isAdmin ? true : false}
        />
        {touched.mobile && errors.mobile && (
          <Text style={{ color: "red" }}>{errors.mobile}</Text>
        )}
      </View>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Checkbox
          status={whatsappNumberSameChecked ? "checked" : "unchecked"}
          onPress={() => {
            if (!whatsappNumberSameChecked) {
              setFieldValue("whatsappNumber", values?.mobile);
            }

            setWhatsappNumberSameChecked((prev) => !prev);
          }}
        />

        <Text style={{ color: "gray", flexShrink: 1 }}>
          WhatsApp Number Same As Phone Number
        </Text>
      </View>

      <View>
        <TextInput
          style={styles.input}
          label={t("WhatsApp Number")}
          mode={textInputMode}
          keyboardType="numeric"
          onChangeText={handleChange("whatsappNumber")}
          onBlur={handleBlur("whatsappNumber")}
          value={values.whatsappNumber}
          maxLength={10}
          error={touched.whatsappNumber && !!errors.whatsappNumber}
        />
        {touched.whatsappNumber && errors.whatsappNumber && (
          <Text style={{ color: "red" }}>{errors.whatsappNumber}</Text>
        )}
      </View>

      <View>
        <TextInput
          label={t("Email")}
          mode={textInputMode}
          style={styles.input}
          onChangeText={handleChange("email")}
          onBlur={handleBlur("email")}
          value={values.email}
          error={touched.email && errors.email}
        />
        {touched.email && errors.email && (
          <Text style={{ color: "red" }}>{errors.email}</Text>
        )}
      </View>

      <View style={{}}>
        <View>
          <GenericDropdown
            dropDownlabelStyle={styles.dropDownlabelStyle}
            pickerContainerStyle={styles.pickerContainerStyle}
            pickerStyle={styles.pickerStyle}
            containerStyle={styles.containerStyle}
            label="Gender"
            options={genderList}
            selectedValue={selectedGender}
            onValueChange={handleSelectGender}
          />
        </View>
        {touched.gender && errors.gender ? (
          <Text style={{ color: "red", marginLeft: 2 }}>{errors.gender}</Text>
        ) : null}
      </View>

      <View>
        <View style={styles.dateTitle}>
          <Text style={styles.dateTitleText}>DOB</Text>

          <Pressable
            onPress={() => setShowDateTimePicker(true)}
            style={styles.dateText}
          >
            <Icon name="calendar" size={20} color="#0a6846" />
            <Text style={styles.buttonText}>
              {values.dob ? formatDate(values.dob) : "No date selected"}
            </Text>
          </Pressable>
        </View>

        {showDateTimePicker && (
          <DateTimePicker
            value={values.dob || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDateTimePicker(false);
              if (selectedDate) {
                // const dateWithEndOfDay = new Date(selectedDate); // Wrap timestamp in Date
                // dateWithEndOfDay.setHours(23, 59, 59, 999); // Set time to 11:59 PM
                // setFieldValue("dob", dateWithEndOfDay); // Set the form value

                if (event.type === "set" && selectedDate) {
                  setFieldValue("dob", selectedDate);
                }
              }
            }}
          />
        )}
        {touched.dob && errors.dob ? (
          <Text style={{ color: "red", marginLeft: 2 }}>{errors.dob}</Text>
        ) : null}
      </View>

      {console.log("date sssss", values.dob)}


      <View>
        <TextInput
          label={t("Address")}
          mode={textInputMode}
          style={styles.input}
          onChangeText={handleChange("userAddress")}
          onBlur={handleBlur("userAddress")}
          value={values.userAddress}
          error={touched.userAddress && errors.userAddress}
          multiline={true}
          numberOfLines={4}
        />
        {touched.userAddress && errors.userAddress && (
          <Text style={{ color: "red" }}>{errors.userAddress}</Text>
        )}
      </View>

      <View>
        <TextInput
          label={t("Pincode")}
          mode={textInputMode}
          style={styles.input}
          keyboardType="numeric"
          onChangeText={handleChange("pincode")}
          maxLength={6}
          minLength={6}
          onBlur={handleBlur("pincode")}
          value={values.pincode}
          error={touched.pincode && errors.pincode}
        />
        {touched.pincode && errors.pincode && (
          <Text style={{ color: "red" }}>{errors.pincode}</Text>
        )}
      </View>

      {/* <View style={{}}>
        <TextInput
          style={styles.input}
          label={t("Age")}
          mode={textInputMode}
          // placeholder="Age"
          onChangeText={handleChange("age")}
          onBlur={handleBlur("age")}
          keyboardType="numeric"
          value={values.age}
          maxLength={2}
          minLength={1}
        />
        {touched.age && errors.age && (
          <Text style={{ color: "red" }}>{errors.age}</Text>
        )}
      </View> */}
    </View>
  );
};

export default ProviderProfileForm;

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#FFF",
    // borderRadius:10,
    // borderTopColor:"orange",
    // borderTopWidth:1,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    // backgroundColor: "#fff",
  },
  inputUnderline: {
    // width:"90%",
  },
  genderDropdownContainer: {
    // backgroundColor: "#f1f1f1",
    // position:"relative",
    // height: 170,
  },
  containerStyle: {
    // marginTop: 10,
    // height: 42,
    // marginBottom: 3,
  },
  pickerContainerStyle: {
    // height: 50,
    // height:"100%",
    width: "100%",
    // backgroundColor: "#EDEDED",
    backgroundColor: "#fff",
    // borderWidth: 1,
    borderBottomWidth: 1,
    justifyContent: "center",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  pickerStyle: {
    // height: "100%",
    // width: "100%",
  },
  dropDownlabelStyle: {
    fontSize: 12,
    // backgroundColor:"#EDEDED",
    top: 0,
  },
  dateTitle: {
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.3)",
    marginVertical: 5,
  },
  dateTitleText: {
    position: "absolute",
    fontSize: 12,
    // fontWeight: "bold",
    backgroundColor: "#fff",
    paddingHorizontal: 5,
    color: "#333",
    top: -10,
    left: 20,
  },
  buttonText: {
    color: "#3e3e3e",
    fontWeight: "600",
    // marginRight: 2,
    marginLeft: 10,
  },
  dateText: {
    flexDirection: "row",
    minHeight: 48,
    alignItems: "center",
  },
});
