import React, { useState, useCallback } from "react";
import { View, FlatList, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { TextInput } from "react-native-paper";
import { debounce } from "lodash";
import { readApi } from "../../Util/UtilApi";

const DEFAULT_INPUT_STYLE = {
  flex: 1,
  backgroundColor: "#f9f9f9",
  height: 45,
  marginTop: 10,
  fontFamily: "Poppins-Medium",
};

const DEFAULT_SUGGESTION_ITEM_STYLE = {
  padding: 10,
  borderBottomWidth: 1,
  borderBottomColor: "#ddd",
  backgroundColor: "#fff",
};

const DEFAULT_SUGGESTION_LIST_STYLE = {
  maxHeight: 200,
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 4,
  backgroundColor: "#fff",
  marginTop: -5,
};

const NameTextInput = ({
  values,
  handleChange,
  handleBlur,
  touched,
  errors,
  setFieldValue,
  setFormFilled,
  setUser,
  inputStyle = {},
  suggestionItemStyle = {},
  suggestionListStyle = {},
  placeholder = "Name",
  maxLength = 50,

}) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // Debounced API call
  const fetchSuggestions = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }
      try {
        setLoading(true);
        const data = await readApi(`users/searchUser?searchTerm=${query}`);
        setSuggestions(data?.users || []);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  const handleTextChange = (text) => {
   let filteredText = text.replace(/[^A-Za-z\s.,]/g, "");

    if (filteredText.length > 0) {
      filteredText = filteredText.charAt(0).toUpperCase() + filteredText.slice(1);
    }
    if (filteredText.trim()) setFormFilled(true);

    handleChange("name")(filteredText);
    fetchSuggestions(filteredText);
  };

  const handleSuggestionPress = (item) => {
    setUser(item);
    setFieldValue("name", item?.name || "");
    setFieldValue("mobile", item?.mobile || "");
    setFieldValue("address", item?.address || "");
    setFieldValue("email",item?.email)
    setFieldValue("userMobile",item?.mobile)
    setFieldValue("userName",item?.name)
    setSuggestions([]);
  };

  return (
    <View>
      <TextInput
        label={placeholder+" *"}
        mode="flat"
        style={{ ...DEFAULT_INPUT_STYLE, ...inputStyle }}
        maxLength={maxLength}
        onChangeText={handleTextChange}
        onBlur={handleBlur("name")}
        value={values.name}
        // editable={!loading}
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
                setFieldValue("address", "");
                setFieldValue("email","")
                setFieldValue("userMobile","")
                setFieldValue("userName","")
                setSuggestions([]);
                setUser(null);
              }}
            />
          ) : null
        }
      />

      {touched.name && errors.name && (
        <Text style={{ color: "red", marginBottom: 5 }}>{errors.name}</Text>
      )}

      {suggestions.length > 0 && (
        <FlatList
        keyboardShouldPersistTaps="handled"
          data={suggestions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSuggestionPress(item)}
              style={{ ...DEFAULT_SUGGESTION_ITEM_STYLE, ...suggestionItemStyle }}
            >
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>{item?.name}</Text>
            </TouchableOpacity>
          )}
          style={{ ...DEFAULT_SUGGESTION_LIST_STYLE, ...suggestionListStyle }}
        />
      )}
    </View>
  );
};

export default NameTextInput;
