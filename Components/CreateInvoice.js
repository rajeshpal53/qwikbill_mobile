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
      console.log(invoiceType,  "invoice Type")
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
        <View style={styles.formContainer}>
          <View style={styles.formHeading}>
            <Text style={{ fontSize: 20 }}>Provisional Invoice No :- </Text>
            <Text style={{ fontSize: 20 }}>1234</Text>
          </View>

          {/* <AddInvoice initialValues={initialValues}/> */}
          <AddInvoiceScreen navigation={navigation} invoiceType={invoiceType} />
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