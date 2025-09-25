import React, { useState } from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import { List } from "react-native-paper";

const GenderDropdown = ({
  genderList,
  selectedGender,
  setSelectedGender,
  setFieldValue,
  touched,
  errors,
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handlePress = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const capitalizeFirstLetter = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  return (
    <View style={styles.ageGenderContainer}>
      <List.Accordion
        accessibilityLabel="Gender"
        style={styles.accordion}
        title={selectedGender || "Select Gender"}
        expanded={dropdownVisible}
        onPress={handlePress}
      >
        <View style={styles.dropdownContainer}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {genderList.map((item, index) => {
              const genderText = capitalizeFirstLetter(item.gender);
              return (
                <List.Item
                  key={index}
                  title={genderText}
                  onPress={() => {
                    setSelectedGender(genderText);
                    setFieldValue("gender", genderText);
                    setDropdownVisible(false);
                  }}
                  style={styles.listItem}
                />
              );
            })}
          </ScrollView>
        </View>
      </List.Accordion>

      {touched.gender && errors.gender ? (
        <Text style={styles.errorText}>{errors.gender}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  ageGenderContainer: {
    marginVertical: 10,
  },
  accordion: {
    backgroundColor: "#fff", // White background
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.3)",
  },
  dropdownContainer: {
    backgroundColor: "#fff",
  },
  scrollContainer: {
    width: "100%",
    backgroundColor: "#fff",
  },
  listItem: {
    backgroundColor: "#fff",
  },
  errorText: {
    fontSize: 13,
    color: "red",
    marginTop: 5,
  },
});

export default GenderDropdown;
