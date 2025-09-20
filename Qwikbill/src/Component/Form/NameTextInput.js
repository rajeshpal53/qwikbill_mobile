import React, { useState, useCallback } from "react";
import { View, FlatList, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { TextInput } from "react-native-paper";
import { debounce, set } from "lodash"; // or write your own debounce
import { readApi } from "../../Util/UtilApi";

const NameTextInput = ({ values, handleChange, handleBlur, touched, errors, setFieldValue, setFormFilled,setUser }) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // API call with debounce
  const fetchSuggestions = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }
      try {

        setLoading(true);
        // Replace with your API endpoint
        const data = await readApi(`users/searchUser?searchTerm=${query}`)
       console.log("Fetched suggestions:", data);
        setSuggestions(data?.users || []);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      } finally {
        setLoading(false);
      }
    }, 500), // 500ms debounce
    []
  );

  const handleTextChange = (text) => {
    // Allow only alphabets & spaces
    let filteredText = text.replace(/[^A-Za-z\s]/g, "");

    // Capitalize first letter
    if (filteredText.length > 0) {
      filteredText = filteredText.charAt(0).toUpperCase() + filteredText.slice(1);
    }

    if (filteredText.trim()) setFormFilled(true);

    handleChange("name")(filteredText); // Formik

    fetchSuggestions(filteredText); // API call with debounce
  };

  const handleSuggestionPress = (item) => {
    setUser(item)
    setFieldValue("name", item?.name || ""); // assuming item has a 'name' property
    setFieldValue("mobile",item?.mobile || ""); // assuming item has a 'mobile' property
    setFieldValue("address",item?.address || ""); // assuming item has a 'address' property
    setSuggestions([]); // clear dropdown after selection
  };

  return (
    <View>
      <TextInput
        label="Name"
        mode="flat"
        style={ {
    flex: 1,
    backgroundColor: "#f9f9f9",
    height: 45,
    marginTop: 10,
    fontFamily: "Poppins-Medium",}}
        maxLength={50}
        onChangeText={handleTextChange}
        onBlur={handleBlur("name")}
        value={values.name}
        editable={!loading}
        right={
          loading ? (
            <ActivityIndicator
              size="small"
              color="#0000ff"
              style={{ marginBottom: -22, alignSelf: "center" }}
            />
          ) : values.name ? (
            <TextInput.Icon
              icon="close"
              size={20}
              style={{ marginBottom: -22 }}
              onPress={() => {
                setFieldValue("name", "");
                 setFieldValue("mobile", "");
                 setFieldValue("address","")
                setSuggestions([]);
                setUser(null)
              }}
            />
          ) : null
        }
      />

      {/* Show errors */}
      {touched.name && errors.name && (
        <Text style={{ color: "red", marginBottom: 5 }}>{errors.name}</Text>
      )}

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSuggestionPress(item)}
              style={{
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: "#ddd",
                backgroundColor: "#fff",
              }}
            >
              <Text style={{fontSize:14, fontStyle:"bold"}}>{item?.name}</Text>
            </TouchableOpacity>
          )}
          style={{
            maxHeight: 200,
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 4,
            backgroundColor: "#fff",
            marginTop: -5,
          }}
        />
      )}
    </View>
  );
};

export default NameTextInput;
