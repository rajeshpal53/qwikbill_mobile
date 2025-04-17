import React, { useContext, useState, useEffect, useRef } from "react";
import { ShopDetailContext } from "../Store/ShopDetailContext";
import { Picker } from "@react-native-picker/picker";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { readApi } from "../Util/UtilApi";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
  responsiveScreenFontSize,
} from "react-native-responsive-dimensions";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator, List } from "react-native-paper";
import { ShopContext } from "../Store/ShopContext";

function DropDownList({ options, setSelectedshop, disabled }) {
  // const { addShopDetails, shopDetails } = useContext(ShopDetailContext);
  const { selectedShop, updateSelectedShop } = useContext(ShopContext);
  const [isLoading, setIsLoading] = useState(false);
  // const [options, setOptions] = useState([]);

  console.log("selectedShop--------------", options);

  // const [selectedShop, setSelectedShop] = useState("");
  // console.log(shopDetails, "newShopDetails");

  const pickerRef = useRef();

  // useEffect(() => {
  //   if (options && options.length > 0 && !selectedShop) {
  //     updateSelectedShop(options[0]?.shopname); // Set first shop as default
  //   }
  // }, [options]);

  //   useEffect(() => {
  //     // console.log("selectedShop is changed 1 - ", selectedShop)
  //     options?.map((item) => {
  //       if(item?.id == selectedShop?.id){
  // console.log("same shop is , ", item)
  //       }
  //     })
  //   }, [selectedShop])

  return (
    <View style={styles.container}>
      {isLoading && <ActivityIndicator size="small" />}
      <View style={styles.pickerWrapper}>
        <Picker
          enabled={options?.length > 0}
          mode="dropdown"
          style={styles.pickerStyle}
          ref={pickerRef}
          selectedValue={selectedShop?.vendor?.id} // use a unique primitive value like vendor id
          onValueChange={(vendorId) => {
            const selected = options.find(
              (item) => item.vendor.id === vendorId
            );
            updateSelectedShop(selected);
          }}
        >
          {!selectedShop && (
            <Picker.Item
              label="Please select your Shop"
              value=""
              color="#888888"
              enabled={false}
            />
          )}

          {options?.map((item, index) => (
            <Picker.Item
              key={index}
              value={item.vendor.id} // pass primitive value
              label={`${item?.vendor?.shopname ?? "Unnamed Shop"} (by ${item?.user?.name ?? "Unknown"})`}
              color="#555555"
            />
          ))}
        </Picker>
      </View>
      {/* <TouchableOpacity style={{ justifyContent: "center" }}>
        <MaterialCommunityIcons name="reload" size={20} />
      </TouchableOpacity> */}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures full-screen height
    justifyContent: "center", // Centers the content vertically
    alignItems: "center", // Centers the content horizontally
  },
  pickerWrapper: {
    width: "100%", // Adjust width as needed
    alignItems: "center", // Center content horizontally
    justifyContent: "center", // Center the Picker vertically
    // borderWidth: 1,
    // borderColor: "#0c3b73",
    borderRadius: 10,
    // padding: 10,
    // backgroundColor: "#fff",
    height: 40,
  },
  pickerStyle: {
    width: "100%",
    height: 60, // Adjust height for visibility
  },
  selectedShopText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default DropDownList;

//----------------------------------------------------------------------------

// import React, { useContext, useState, useEffect, useRef } from "react";
// import { ShopDetailContext } from "../Store/ShopDetailContext";
// import { Picker } from "@react-native-picker/picker";
// import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
// import { readApi } from "../Util/UtilApi";
// import {
//   responsiveHeight,
//   responsiveWidth,
//   responsiveFontSize,
//   responsiveScreenFontSize,
// } from "react-native-responsive-dimensions";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { ActivityIndicator, List } from "react-native-paper";

// function DropDownList() {
//   const { addShopDetails, shopDetails } = useContext(ShopDetailContext);
//   const [isLoading, setIsLoading] = useState(false);
//   const [options, setOptions] = useState([]);
//   const [selectedShop, setSelectedShop] = useState("");
//   const [expanded, setExpanded] = useState(false);
//   console.log(shopDetails, "newShopDetails");
//   const pickerRef = useRef();
//   async function fetchOptions() {
//     try {
//       setIsLoading(true);
//       const response = await readApi(`api/shop/list`);
//       setOptions(response.result);
//       const newResponse = await readApi(
//         `api/invoice/list?shop=${response?.result[0]?._id}`
//       );
//       const count = newResponse.result.length;
//       addShopDetails({ ...response.result[0], count: count });

//     } catch (error) {
//       console.log("error getting shops , ", error)
//     }finally{
//       setIsLoading(false);
//     }

//     // Adjust according to your API respons
//     // setSelectedOption(data.result[0].shopname)
//   }

//   useEffect(() => {
//     fetchOptions();
//   }, []);

//   const getSelectedOption = async () => {
//     const selectedId = options.find(
//       (option) => option.shopname === selectedShop
//     );
//     const newResponse = await readApi(
//       `api/invoice/list?shop=${selectedId._id}`
//     );
//     count = newResponse.result.length;
//     addShopDetails({ ...selectedId, count: count });
//   };

//   useEffect(() => {
//     if (selectedShop) {
//       getSelectedOption();
//     }
//   }, [selectedShop]);

//   const toggleAccordion = () => setExpanded(!expanded);
//   return (
//     <View style={styles.accordionContainer}>
//         <List.Accordion
//           title={selectedShop || "Choose a Service"}
//           expanded={expanded}
//           // onPress={toggleAccordion}
//           style={{width: "95%"}}
//           // style={styles.accordion}
//         >
//           <ScrollView
//             contentContainerStyle={{}}
//             style={{

//                 position:"absolute",
//                 top:64,
//                 zIndex:1,
//               height: 400,
//               borderWidth: 1,
//               borderColor: "rgba(0, 0, 0, 0.3)",
//               width:"100%"
//             }}
//             // nestedScrollEnabled={true}
//           >
//             <View style={{ backgroundColor: "#fff" }}>
//               {options?.map((option, index) => (
//                 <List.Item
//                   key={index}
//                   title={option?.shopname}
//                   // style={{
//                   //   backgroundColor: selectedService?.id === service?.id ? "rgba(0, 0, 0, 0.2)" : "#fff",
//                   // }}
//                   // onPress={() => handleServiceSelection(service)}
//                 />
//               ))}
//             </View>
//           </ScrollView>
//         </List.Accordion>
//       </View>

//   );
// }
// const styles = StyleSheet.create({
//   pickerContainer: {
//     // borderWidth: 1,
//     borderColor: "#0c3b73",
//     borderRadius: responsiveWidth(3),
//     width: "100%",
//     flexDirection: "row",
//   },
// });

// export default DropDownList;
