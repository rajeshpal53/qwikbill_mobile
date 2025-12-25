import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { List } from "react-native-paper";

const GenericDropdown = ({
  label,
  required = false,
  options = [],
  selectedValue,
  onValueChange,
  containerStyle,
  accordionStyle,
  labelStyle,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <List.Accordion
        title={selectedValue || `Select ${label}`}
        expanded={expanded}
        onPress={() => setExpanded(!expanded)}
        style={[styles.accordion, accordionStyle]}
        titleStyle={styles.title}
        right={props => <List.Icon {...props} icon="chevron-down" />}
      >
        <View style={styles.dropdownContainer}>
          <ScrollView>
            {options.map((item, index) => (
              <List.Item
                key={index}
                title={item.label}
                titleStyle={styles.itemTitle}
                onPress={() => {
                  onValueChange(item.value);
                  setExpanded(false);
                }}
                style={styles.listItem}
              />
            ))}
          </ScrollView>
        </View>
      </List.Accordion>
    </View>
  );
};


const styles = StyleSheet.create({
  wrapper: {
    marginTop: 12,
  },
  label: {
    position: "absolute",
    top: -8,
    left: 12,
    backgroundColor: "#fff",
    zIndex: 10,
    paddingHorizontal: 4,
    fontSize: 13,
    color: "rgba(0,0,0,0.6)",
  },
  required: {
    color: "red",
  },
  accordion: {
    backgroundColor: "#fff", // flat filled
    borderRadius: 6,
    paddingVertical: 0,
  },
  title: {
    fontSize: 14,
    paddingVertical: 6, // 👈 reduced height
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    maxHeight: 180,
  },
  listItem: {
    paddingVertical: 2, // 👈 compact items
  },
  itemTitle: {
    fontSize: 14,
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