import React, { useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const RolePicker = ({
  values,
  errors,
  touched,
  setFieldValue,
  SetAddRole,
  currentUserRole,
  getAssignableRoles,
}) => {
  const pickerRef = useRef();

  const roles = getAssignableRoles(currentUserRole);

  return (
    <View style={{ marginBottom: 15, marginTop: 10 }}>
      {/* Title above */}
      <Text style={styles.label}>User Role</Text>

      <View style={styles.pickerWrapper}>
        <Picker
          ref={pickerRef}

          selectedValue={values.userRole}
          onValueChange={(itemValue) => {
            setFieldValue("userRole", itemValue);
            SetAddRole(itemValue);
          }}
             style={styles.picker}
           dropdownIconColor="transparent" // hide arrow
  dropdownIconRippleColor="transparent" // remove ripple effect
        >
          <Picker.Item label="Select Role" enabled={false} value="" />
          {roles.map((role, index) => (
            <Picker.Item
              key={index}
              label={`${index + 1}. ${role?.label || "Unknown Role"}`}
              value={role?.value || ""}
              color="#333"
            />
          ))}
        </Picker>

        {/* Custom dropdown icon */}
        {/* <MaterialCommunityIcons
          name="chevron-down"
          size={22}
          color="#333"
          style={styles.dropdownIcon}
        /> */}
      </View>

      {touched.userRole && errors.userRole && (
        <Text style={styles.errorText}>{errors.userRole}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    overflow: "hidden",
    position: "relative",
  },
  picker: {
    width: "100%",
    height: 50,
    color: "#333",
  },
  dropdownIcon: {
    position: "absolute",
    right: 10,
    top: "35%",
  },
  errorText: {
    fontSize: 13,
    color: "red",
    marginTop: 5,
  },
});

export default RolePicker;
