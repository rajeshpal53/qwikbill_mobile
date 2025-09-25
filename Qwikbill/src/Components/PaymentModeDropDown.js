// import React, { useState } from "react";
// import { View, ScrollView, Text, StyleSheet } from "react-native";
// import { List } from "react-native-paper";

// const PaymentModeDropdown = ({
//   paymentModes,
//   selectedPaymentMode,
//   setSelectedPaymentMode,
//   touched,
//   errors,
// }) => {
//   const [dropdownVisible, setDropdownVisible] = useState(false);

//   const handlePress = () => {
//     setDropdownVisible(!dropdownVisible);
//   };

//   return (
//     <View style={styles.container}>
//       <List.Accordion
//         accessibilityLabel="Payment Mode"
//         style={styles.accordion}
//         title={selectedPaymentMode || "Select Payment Mode"}
//         expanded={dropdownVisible}
//         onPress={handlePress}
//       >
//         <View style={styles.dropdownContainer}>
//           <ScrollView contentContainerStyle={styles.scrollContainer}>
//             {paymentModes.map((mode, index) => (
//               <List.Item
//                 key={index}
//                 title={mode}
//                 onPress={() => {
//                   setSelectedPaymentMode(mode);
//                   setDropdownVisible(false);
//                 }}
//                 style={styles.listItem}
//               />
//             ))}
//           </ScrollView>
//         </View>
//       </List.Accordion>

//       {touched?.paymentMode && errors?.paymentMode ? (
//         <Text style={styles.errorText}>{errors.paymentMode}</Text>
//       ) : null}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginVertical: 10,
//   },
//   accordion: {
//     backgroundColor: "#fff",
//     borderBottomWidth: 1,
//     borderBottomColor: "rgba(0,0,0,0.3)",
//   },
//   dropdownContainer: {
//     backgroundColor: "#fff",
//   },
//   scrollContainer: {
//     width: "100%",
//     backgroundColor: "#fff",
//   },
//   listItem: {
//     backgroundColor: "#fff",
//   },
//   errorText: {
//     fontSize: 13,
//     color: "red",
//     marginTop: 5,
//   },
// });

// export default PaymentModeDropdown;

import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, } from "react-native";
import { Menu, Text,Icon} from "react-native-paper";

const PaymentModeDropdown = ({
  label = "Select an option",
  options = [],
  value,
  onChange,
  t = (text) => text, // fallback translation
    width = "100%", 
}) => {
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  // Get display text
  const getDisplayValue = () => {
    value
    console.log(value,"getDisplayValue")
  };
    console.log(value,"getDisplayValue")

  return (
    <View style={styles.container}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        contentStyle={{backgroundColor:"#fff"}}
        anchor={
          <TouchableOpacity style={[styles.button,{width:width,}]} onPress={openMenu}>
            <Text style={styles.text}>{value}</Text>
              <Icon source="chevron-down" size={24} color="#000" style={styles?.icon} />
          </TouchableOpacity>
        }
      >
        {options.map((option, idx) => (
          <Menu.Item
            key={idx}
            onPress={() => {
              onChange(option); // return full object/string
              closeMenu();
            }}
            title={t(option.label || option)}
          />
        ))}
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: "100%",
  },
  button: {
    width: "100%",
    borderRadius: 8,
    paddingVertical:3 ,
    paddingRight:10,
    flexDirection:"row",
    justifyContent: "flex-end",
    alignItems:"flex-end",
    
    marginTop:-4
  },
  icon:{marginLeft:10, marginTop:5, position:"relative",top:120},
  text: {
    marginRight:3,
    fontSize: 16,
    color: "#000",
    textAlign:"left"
  },
});

export default PaymentModeDropdown;
