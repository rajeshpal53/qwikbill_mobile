import { React, useRef, useContext, useState, useEffect } from "react";
import {
  View,
  Typography,
  Text,
  useWindowDimensions,
  StyleSheet,
  Image,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { AuthContext } from "../Store/AuthContext";
import { Entypo } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import * as Yup from "yup";
import { ToggleButton, TextInput, Card } from "react-native-paper";
import AddInvoice from "./AddInvoice";
import AddInvoiceScreen from "../Screen/AddInvoiceScreen";
import DropDownList from "../UI/DropDownList";
import ThreeToggleBtns from "./ThreeToggleBtns";


export default function CreateInvoice({ navigation }) {
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;
  const { selectedShop, setSelectedShop } = useContext(AuthContext);
  const [invoiceType, setInvoiceType] = useState("provInvoice")
  const pickerRef = useRef();

  const initialValues = {
    client: "",
    phone : "",

  }

  // const [buttonsModes, setButtonsModes] = useState({
  //   recentButtonMode: false,
  //   provInvoiceButtonMode: true,
  //   gstInvoiceButtonMode: false,
  // });

  
  const [buttonsModes, setButtonsModes] = useState({
    firstButtonMode: false,
    secondButtonMode: true,
    thirdButtonMode: false,
    
  });

  const toggleButtonsTexts = {
    first: "Recent",
    second: "Prov Invoice",
    third: "GST Invoice"
  }

  
  useEffect(() => {

    function setInvoiceHandler(){

      if(buttonsModes.firstButtonMode){
        setInvoiceType("recent");
      }else if(buttonsModes.secondButtonMode){
        setInvoiceType("provInvoice");
      }else{
        setInvoiceType("gstInvoice");
      }
    }

      setInvoiceHandler()
  }, [buttonsModes]);

  const handleButtonPress = (button) => {
    setButtonsModes((prevstate) => {
      if (button === "first" && !prevstate.firstButtonMode) {
        return {
          firstButtonMode: true,
          secondButtonMode: false,
          thirdButtonMode: false,
        };
      } else if (
        button === "second" &&
        !prevstate.secondButtonMode
      ) {
        return {
          firstButtonMode: false,
          secondButtonMode: true,
          thirdButtonMode: false,
        };
      } else if (button === "third" && !prevstate.thirdButtonMode) {
        return {
          firstButtonMode: false,
          secondButtonMode: false,
          thirdButtonMode: true,
        };
      } else {
        return prevstate;
      }
    });

    if(button === "first"){
      data = {
        filteredBy: "recent",
      }
      navigation.navigate("StackNavigator", {
        screen: "ViewInvoices",
        params: {
          data: data,
        },
      });
    }
  };

  function open() {
    pickerRef.current.focus();
  }

  function close() {
    pickerRef.current.blur();
  }

  const validationSchema = Yup.object().shape({
    customerName: Yup.string().required("name is required"),
    mobile: Yup.string().required("mobile is required"),
    address: Yup.string().required("address is required"),
    productName: Yup.string().required("Product name is required"),
    quantity: Yup.string().required("quantity is required"),
    // password: Yup.string()
    //   .min(6, 'Password must be at least 6 characters')
    //   .required('Password is required')
  });

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.ScrollView}
        contentContainerStyle={styles.contentContainer}
      >
        {/* 1 */}
        <View>
          <Text style={styles.shopText}>Shop</Text>
        </View>

        {/* 2 */}
        <View>
          <View style={styles.logoPickerContainer}>
            <Entypo name="shop" size={30} color="#0c3b73" />
            <View style={styles.pickerContainer}>
             <DropDownList/>
            </View>
          </View>
        </View>

        {/* 3 */}
        <ThreeToggleBtns 
        buttonsModes={buttonsModes}
        setButtonsModes={setButtonsModes}
        navigation={navigation}
        toggleButtonsTexts={toggleButtonsTexts}
        handleButtonPress={handleButtonPress}/>
        {/* 4 */}
        {/* 5 */}
        <View style={styles.formContainer}>
          <View style={styles.formHeading}>
            <Text style={{ fontSize: 20 }}>Provisional Invoice No :- </Text>
            <Text style={{ fontSize: 20 }}>1234</Text>
          </View>

          {/* <AddInvoice initialValues={initialValues}/> */}
          <AddInvoiceScreen navigation={navigation} />
        </View>
        {/* 6 */}
        <View></View>
        {/* 7 */}
        <View></View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  ScrollView: {
    flex: 1,
    paddingHorizontal: 10,
  },
  contentContainer: {
    gap: 18,
  },
  shopText: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
  },
  pickerContainer: {
    borderRadius: 10,
    width: "90%",
  },
  logoPickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    elevation: 5,
  },
  favPersonContainer: {
    
    justifyContent: "center",
   
  },
  formHeading: {
    flexDirection: "row",
    justifyContent: "center",
  },
  formContainer: {
    gap: 15,
    paddingHorizontal: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 8,
  },
  inputContainer: {
    width: "90%",
    justifyContent: "center",
  },
  inputAndLabelContainer: {
  },
  formikChild: {
    gap: 20,
  },
  error: {
    color: "red",
  },
  reviewAndPayBtn: {
    backgroundColor: "#6dbbc7",
  },
});

// import { React, useRef, useContext, useState } from "react";
// import {
//   View,
//   Typography,
//   Text,
//   useWindowDimensions,
//   StyleSheet,
//   Image,
// } from "react-native";
// import { ScrollView } from "react-native-gesture-handler";
// import { AuthContext } from "../Store/AuthContext";
// import { Entypo } from "@expo/vector-icons";
// import { Picker } from "@react-native-picker/picker";
// import { Button } from "react-native-paper";
// import { Ionicons } from "@expo/vector-icons";
// import { Formik } from "formik";
// import * as Yup from "yup";
// import { ToggleButton, TextInput } from "react-native-paper";
// import AddInvoice from "./AddInvoice";


// export default function CreateInvoice({ navigation }) {
//   const windowWidth = useWindowDimensions().width;
//   const windowHeight = useWindowDimensions().height;
//   const { selectedShop, setSelectedShop } = useContext(AuthContext);
//   const pickerRef = useRef();

//   const initialValues = {
//     client: "",
//     phone : "",

//   }

//   const [buttonsModes, setButtonsModes] = useState({
//     recentButtonMode: false,
//     provInvoiceButtonMode: true,
//     gstInvoiceButtonMode: false,
//   });

//   const handleButtonPress = (button) => {
//     setButtonsModes((prevstate) => {
//       if (button === "recent" && !prevstate.recentButtonMode) {
//         return {
//           recentButtonMode: true,
//           provInvoiceButtonMode: false,
//           gstInvoiceButtonMode: false,
//         };
//       } else if (
//         button === "prov invoice" &&
//         !prevstate.provInvoiceButtonMode
//       ) {
//         return {
//           gstInvoiceButtonMode: false,
//           recentButtonMode: false,
//           provInvoiceButtonMode: true,
//         };
//       } else if (button === "gst invoice" && !prevstate.gstInvoiceButtonMode) {
//         return {
//           gstInvoiceButtonMode: true,
//           recentButtonMode: false,
//           provInvoiceButtonMode: false,
//         };
//       } else {
//         return prevstate;
//       }
//     });
//   };

//   function open() {
//     pickerRef.current.focus();
//   }

//   function close() {
//     pickerRef.current.blur();
//   }

//   const validationSchema = Yup.object().shape({
//     customerName: Yup.string().required("name is required"),
//     mobile: Yup.string().required("mobile is required"),
//     address: Yup.string().required("address is required"),
//     productName: Yup.string().required("Product name is required"),
//     quantity: Yup.string().required("quantity is required"),
//     // password: Yup.string()
//     //   .min(6, 'Password must be at least 6 characters')
//     //   .required('Password is required')
//   });

//   return (
//     <View style={styles.container}>
//       <ScrollView
//         style={styles.ScrollView}
//         contentContainerStyle={styles.contentContainer}
//       >
//         {/* 1 */}
//         <View>
//           <Text style={styles.shopText}>Shop</Text>
//         </View>

//         {/* 2 */}
//         <View>
//           <View style={styles.logoPickerContainer}>
//             <Entypo name="shop" size={30} color="#0c3b73" />
//             <View style={styles.pickerContainer}>
//               <Picker
//                 ref={pickerRef}
//                 selectedValue={selectedShop}
//                 onValueChange={(itemValue, itemIndex) =>
//                   setSelectedShop(itemValue)
//                 }
//               >
//                 <Picker.Item
//                   label="Kunal Electrical Shop"
//                   value="Kunal Electrical Shop"
//                 />
//                 <Picker.Item label="Kunal Dairy" value="Kunal Dairy" />
//                 <Picker.Item
//                   label="Kunal Kirana Shop"
//                   value="Kunal Kirana Shop"
//                 />
//               </Picker>
//             </View>
//           </View>
//         </View>

//         {/* 3 */}
//         <View style={styles.buttonContainer}>
//           <Button
//             style={{
//               //   width: "50%",
//               backgroundColor: buttonsModes.recentButtonMode
//                 ? "#6dbbc7"
//                 : "transparent",
//             }}
//             mode={
//               buttonsModes.recentButtonMode ? "contained" : "contained-disabled"
//             }
//             onPress={() => handleButtonPress("recent")}
//           >
//             Recent
//           </Button>

//           <Button
//             style={{
//               //   width: "50%",
//               backgroundColor: buttonsModes.provInvoiceButtonMode
//                 ? "#6dbbc7"
//                 : "transparent",
//             }}
//             mode={
//               buttonsModes.provInvoiceButtonMode
//                 ? "contained"
//                 : "contained-disabled"
//             }
//             onPress={() => handleButtonPress("prov invoice")}
//           >
//             Prov Invoice
//           </Button>

//           <Button
//             style={{
//               //   width: "50%",
//               backgroundColor: buttonsModes.gstInvoiceButtonMode
//                 ? "#6dbbc7"
//                 : "transparent",
//             }}
//             mode={
//               buttonsModes.gstInvoiceButtonMode
//                 ? "contained"
//                 : "contained-disabled"
//             }
//             onPress={() => handleButtonPress("gst invoice")}
//           >
//             GST Invoice
//           </Button>
//         </View>
//         {/* 4 */}
//         <View style={styles.favPersonContainer}>
//           <Ionicons name="person" size={30} color="#0c3b73" />
//         </View>
//         {/* 5 */}
//         <View style={styles.formContainer}>
//           <View style={styles.formHeading}>
//             <Text style={{ fontSize: 20 }}>Provisional Invoice No :- </Text>
//             <Text style={{ fontSize: 20 }}>1234</Text>
//           </View>

//           {/* <AddInvoice initialValues={initialValues}/> */}

//           <Formik
//             initialValues={{
//               customerName: "",
//               mobile: "",
//               address: "",
//               productName: "",
//               quantity: "",
//               date:"",
//             }}
//             validationSchema={validationSchema}
//             // onSubmit={handleLogin}
//           >
//             {({
//               handleChange,
//               handleBlur,
//               handleSubmit,
//               values,
//               errors,
//               touched,
//             }) => (
//               <View style={styles.formikChild}>
//                 <View style={styles.inputAndLabelContainer}>
                  
//                     <TextInput
//                       label="customer name"
//                       style={styles.input}
//                       autoCorrect={false}
//                       mode="outlined"
//                       onChangeText={handleChange("customerName")}
//                       onBlur={handleBlur("customerName")}
//                       value={values.email}
//                       //   keyboardType="email-address"
//                       autoCapitalize="none"
//                     />
//                     {touched.customerName && (
//                       <Text style={styles.error}>{errors.email}</Text>
//                     )}
                
//                 </View>

//                 <View style={styles.inputAndLabelContainer}>
                 
//                     <TextInput
//                       label="mobile"
//                       style={styles.input}
//                       autoCorrect={false}
//                       mode="outlined"
//                       onChangeText={handleChange("mobile")}
//                       onBlur={handleBlur("mobile")}
//                       value={values.mobile}
//                       //   keyboardType="email-address"
//                       autoCapitalize="none"
//                     />
//                     {touched.mobile && (
//                       <Text style={styles.error}>{errors.mobile}</Text>
//                     )}
//                 </View>
//                 <View style={styles.inputAndLabelContainer}>
//                   {/* <Text>Address :-</Text> */}
                  
//                     <TextInput
//                       label="address"
//                       style={styles.input}
//                       autoCorrect={false}
//                       mode="outlined"
//                       onChangeText={handleChange("address")}
//                       onBlur={handleBlur("address")}
//                       value={values.address}
//                       //   keyboardType="email-address"
//                       autoCapitalize="none"
//                     />
//                     {touched.address && (
//                       <Text style={styles.error}>{errors.address}</Text>
//                     )}
//                 </View>
//                 <View style={styles.inputAndLabelContainer}>
//                 <TextInput
//                 style={styles.input}
//                   label="date"
//                   mode="outlined"
//                   keyboardType="date"
//                   onChangeText={handleChange("date")}
//                   onBlur={handleBlur("date")}
//                   value={values.date}
//                   error={touched.date && errors.date ? true : false}
//                 />
//                 </View>
//                 <View style={styles.inputAndLabelContainer}>
//                   {/* <Text>Product Name :-</Text> */}
//                   <View style={styles.inputContainer}>
//                     <TextInput
//                       label="productName"
//                       style={styles.input}
//                       autoCorrect={false}
//                       mode="outlined"
//                       onChangeText={handleChange("productName")}
//                       onBlur={handleBlur("productName")}
//                       value={values.productName}
//                       //   keyboardType="email-address"
//                       autoCapitalize="none"
//                     />
//                     {touched.productName && (
//                       <Text style={styles.error}>{errors.productName}</Text>
//                     )}
//                   </View>
//                 </View>
//                 <View style={styles.inputAndLabelContainer}>
//                   {/* <Text>Quantity :-</Text> */}
//                   <View style={styles.inputContainer}>
//                     <TextInput
//                       label="quantity"
//                       style={styles.input}
//                       autoCorrect={false}
//                       mode="outlined"
//                       onChangeText={handleChange("quantity")}
//                       onBlur={handleBlur("quantity")}
//                       value={values.quantity}
//                       keyboardType="numeric"
//                       autoCapitalize="none"
//                     />
//                     {touched.quantity && (
//                       <Text style={styles.error}>{errors.quantity}</Text>
//                     )}
//                   </View>
//                 </View>

//                 {/* <Link href='' style={styles.link}> forget password?..</Link> */}
//                 <Button
//                   onPress={handleSubmit}
//                   textColor="white"
//                   style={styles.reviewAndPayBtn}
//                 >
//                   Review and Pay
//                 </Button>
               
//               </View>
//             )}
//           </Formik>
//         </View>
//         {/* 6 */}
//         <View></View>
//         {/* 7 */}
//         <View></View>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   ScrollView: {
//     flex: 1,
//     paddingHorizontal: 10,
//     // backgroundColor: "orange",
//   },
//   contentContainer: {
//     // backgroundColor:"orange",
//     gap: 18,
//   },
//   shopText: {
//     color: "black",
//     fontSize: 20,
//     fontWeight: "bold",
//     //  backgroundColor:"lightgreen"
//   },
//   container: {
//     flex: 1,
//     // width:"100%",
//     // height:"100%",
//     // backgroundColor:"yellow"
//   },
//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: "#0c3b73",
//     borderRadius: 10,
//     // backgroundColor: "#0c3b73",
//     // backgroundColor:"orange",
//     width: "90%",
//     // height:"50%",
//     paddingHorizontal: 10,
//   },
//   logoPickerContainer: {
//     flexDirection: "row",
//     // backgroundColor:"orange",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     width: "100%",
//     elevation: 5,
//   },
//   favPersonContainer: {
//     // backgroundColor:"brown",
//     height: 50,
//     justifyContent: "center",
//     paddingHorizontal: 10,
//     // borderWidth: 1,
//     // borderColor: "#0c3b73",
//     // margin: 8,
//     // shadowColor: '#000',
//     // shadowOffset: { width: 0, height: 3 },
//     // shadowOpacity: 0.6,
//     // shadowRadius: 2,
//     // elevation: 2,
//   },
//   formHeading: {
//     flexDirection: "row",
//     // backgroundColor: "orange",
//     justifyContent: "center",
//   },
//   formContainer: {
//     // backgroundColor: "lightgreen",
//     gap: 15,
//     // borderWidth: 1,
//     paddingHorizontal: 5,
//   },
//   input: {
//     // marginBottom: 16,
//     height: 40,
//     borderWidth: 1,
//     paddingHorizontal: 8,
//     // borderRadius:50,
//     // width:'50%',
//     // alignSelf:"center"
//   },
//   inputContainer: {
//     width: "90%",
//     // backgroundColor: "lighegreen",
//     justifyContent: "center",
//   },
//   inputAndLabelContainer: {
//     // flexDirection: "row",
//     // justifyContent: "space-between",
//     backgroundColor:"brown",
//     // alignItems:"center",
//     // borderWidth:1
//   },
//   formikChild: {
//     // backgroundColor:"yellow",
//     gap: 20,
//   },
//   error: {
//     color: "red",
//     // marginBottom: 16,
//   },
//   reviewAndPayBtn: {
//     backgroundColor: "#6dbbc7",
//   },
// });
