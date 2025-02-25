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

function DropDownList({ options }) {
  // const { addShopDetails, shopDetails } = useContext(ShopDetailContext);
  const {selectedShop, updateSelectedShop} = useContext(ShopContext);
  const [isLoading, setIsLoading] = useState(false);
  // const [options, setOptions] = useState([]);

  // const [selectedShop, setSelectedShop] = useState("");
  // console.log(shopDetails, "newShopDetails");

  const pickerRef = useRef();

  // useEffect(() => {
  //   if (options && options.length > 0 && !selectedShop) {
  //     updateSelectedShop(options[0]?.shopname); // Set first shop as default
  //   }
  // }, [options]);


  useEffect(() => {
    console.log("selectedShop is changed 1 - ", selectedShop)
  }, [selectedShop])



  return (
    <View style={styles.pickerContainer}>
      {isLoading && <ActivityIndicator size="small" />}
      <Picker
        enabled={options?.length > 0} // Disable the picker if options.length is 0
        mode="dropdown"
        style={{ width: "95%" }}
        ref={pickerRef}
        selectedValue={selectedShop}
        onValueChange={(itemValue) =>{
          console.log("itemVaue is , ", itemValue)
          updateSelectedShop(itemValue)
        } }
      >
        {/* Default placeholder */}
        {/* <Picker.Item
        label="Please select your Shop"
        value=""
        color="#888888"
        enabled={false}
      />
      {options.map((option, index) => (
        <Picker.Item
          key={index}
          value={option?.shopname}
          label={option?.shopname}
          color="#555555"
        />
      ))} */}
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
            // value={item?.shopname}
             value={item}
            label={item?.shopname}
            color="#555555"
          />
        ))}
      </Picker>
      <TouchableOpacity style={{ justifyContent: "center" }}>
        <MaterialCommunityIcons name="reload" size={20} />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  pickerContainer: {
    // borderWidth: 1,
    borderColor: "#0c3b73",
    borderRadius: responsiveWidth(3),
    width: "100%",
    flexDirection: "row",
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
