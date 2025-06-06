import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Switch } from 'react-native-paper';

const GenericSwitch = ({
  label,
  value,
  onValueChange,
  disabled = false,
  color = '#6200ee',
  labelStyle,
  containerStyle,
  switchStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        color={color}
        style={switchStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//   },
  label: {
    paddingTop:2.5,
  },
});

export default GenericSwitch;
