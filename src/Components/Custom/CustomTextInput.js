// CustomTextInput.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';

const CustomTextInput = ({
  placeholder,
  value,
  onChangeText,
  onBlur,
  error,
  touched,
  keyboardType = 'default',
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        underlineColor='gray'
        mode="flat"
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        error={touched && error ? true : false}
        style={styles.textInput}
        keyboardType={keyboardType}
      />
      {touched && error && (
        <HelperText type="error" visible={touched && error}>
          {error}
        </HelperText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 10,
  },
  textInput: {
    width: '100%',
    // marginBottom: 3,
    backgroundColor:"rgba(0,0,0,0)",
    // backgroundColor:"lightgreen",
    // height:40,
  },
});

export default CustomTextInput;
