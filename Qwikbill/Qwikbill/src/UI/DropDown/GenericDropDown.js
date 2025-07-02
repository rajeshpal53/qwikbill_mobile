

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const GenericDropdown = ({ label, dropDownlabelStyle, options, selectedValue, onValueChange, containerStyle, pickerContainerStyle, pickerStyle, fontStyles }) => {
  return (
    <View style={containerStyle}>
{label && (
  <Text style={[styles.label, dropDownlabelStyle]}>
    {typeof label === 'string' && label.includes('*') ? (
      <>
        {label.replace('*', '')}
        <Text style={{ }}>*</Text>
      </>
    ) : (
      label
    )}
  </Text>
)}
      <View style={
        [
          // styles.container, 
          // containerStyle
          pickerContainerStyle
          ]
          }>
        <Picker
          mode="dropdown"
          selectedValue={selectedValue}
          onValueChange={(itemValue) => {
            console.log("setItem , ", itemValue );
            onValueChange(itemValue)
          }}
          style={pickerStyle}
          dropdownIconColor={pickerStyle?.color || "black"}

        >
          {options.map((option, index) => (
            <Picker.Item style={fontStyles} key={index} label={option.label} value={option.value} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    justifyContent: 'center',
    borderRadius: 5,
  },
  picker: {
    height: '100%',
    width: '100%',
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    top: -12,
    left: 10,
    zIndex: 1,
    paddingHorizontal: 4,
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.6)',
  },
});

export default GenericDropdown;



// import React, { useState } from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { Picker } from '@react-native-picker/picker';

// const UnitDropdown = ({selectedUnit, setSelectedUnit}) => {

//   return (
//     <View style={{marginTop:10}}>
//       <Text style={styles.label}>unit</Text>
//       <View style={styles.container}>
//       <Picker
//         mode='dropdown'
//         selectedValue={selectedUnit}
//         // style={styles.picker}
//         onValueChange={(itemValue) => setSelectedUnit(itemValue)}
//       >
//         <Picker.Item label="kg" value="kg" />
//         <Picker.Item label="gms" value="gms" />
//         <Picker.Item label="dozen" value="dozen" />
//         <Picker.Item label="piece" value="piece" />
//       </Picker>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     height:40,
//     width:"100%",
//     backgroundColor:"#fff",
//     borderWidth:1,
//     // backgroundColor:"rgba(231, 223, 236, 1)",
//     justifyContent: 'center',
//     borderRadius:5,
//     // paddingHorizontal: 10,
//   },
//   picker: {
//     height: "100%",
//     width: '100%',
//     // backgroundColor:"orange"
//   },
//   label: {
//     position: 'absolute',
//     backgroundColor: 'white',
//     top: -12,
//     left: 10,
//     zIndex: 1,
//     paddingHorizontal: 4,
//     fontSize: 14,
//     color: 'rgba(0, 0, 0, 0.6)',
//   },
// });

// export default UnitDropdown;