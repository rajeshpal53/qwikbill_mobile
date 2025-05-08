import { React, useRef, useContext, useState, useEffect } from "react";
import {
  View,
  Typography,
  Text,
  useWindowDimensions,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
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

import DropDownList from "../UI/DropDownList";
import { ShopDetailContext } from "../Store/ShopDetailContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import ItemDataTable from "../Component/Cards/ItemDataTable";
import CreateInvoiveForm from "../Component/Form/CreateInvoiveForm";
import { fontFamily, fontSize, readApi } from "../Util/UtilApi";
import { ShopContext } from "../Store/ShopContext";
import CustomToggleButton from "../Component/CustomToggleButton";
import {
  TourGuideProvider,
  TourGuideZone,
  TourGuideZoneByPosition,
  useTourGuideController,
} from "rn-tourguide";
import UserDataContext from "../Store/UserDataContext";
import { useTranslation } from "react-i18next";


export default function CreateInvoice({ navigation, route }) {
  const startTour = route.params;
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;
  // const { selectedShop, setSelectedShop } = useContext(AuthContext);
  const [invoiceType, setInvoiceType] = useState("provInvoice");
  const pickerRef = useRef();
  const { allShops,selectedShop} = useContext(ShopContext);
  const [isTourGuideActive, setIsTourGuideActive] = useState(false);
  const { canStart, start, stop, eventEmitter } = useTourGuideController();
  const [invoiceNumber,setInvoiceNumber]=useState("");
  const { t } = useTranslation();

  // const { shopDetails } = useContext(ShopDetailContext);
  // const invoiceNumber = 1000 + shopDetails.count + 1;
  // const [buttonsModes, setButtonsModes] = useState({
  //   recentButtonMode: false,
  //   provInvoiceButtonMode: true,
  //   gstInvoiceButtonMode: false,
  // });
  //--------------------------------------------------

  const [selectedValue, setSelectedValue] = useState("provisional");
  const{userData}=useContext(UserDataContext)
  const [storeCount,setStoreCount]=useState(0)
  // const toggleOptions = [
  //   { label: 'Left', value: 'left' },
  //   { label: 'Center', value: 'center' },
  //   { label: 'Right', value: 'right' },
  // ];
  const toggleOptions = [
    // { value: "recent", label: "Recent" },
    { value: "provisional", label: "Prov Invoice" },
    { value: "gst", label: "GST Invoice" },
  ];

  //----------------------------------------------------

  const [buttonsModes, setButtonsModes] = useState({
    firstButtonMode: false,
    secondButtonMode: true,
    thirdButtonMode: false,
  });

  const toggleButtonsTexts = {
    // first: "Recent",
    second: "Prov Invoice",
    third: "GST Invoice",
  };

  useEffect(() => {
    if (startTour) {
      setIsTourGuideActive(true);
    }
    return () => {
      setIsTourGuideActive(false);
    };
  }, []);

  useEffect(() => {
    const checkIfTourSeen = async () => {
      try {
        if (isTourGuideActive && canStart) {
          start();
        }
      } catch (error) {
        console.log("Error checking tour guide status", error);
      }
    };

    checkIfTourSeen();
  }, [canStart]);

  useEffect(()=>{
    fetchCount();
  },[buttonsModes,invoiceType,selectedValue])
  const fetchCount=async()=>{
    const response= await readApi(`vendors/${selectedShop?. vendor?.id}`)
    console.log(response,"fetchCount")
    const date = new Date();
    const formattedDate = `${String(date.getDate()).padStart(2, '0')}${String(date.getMonth() + 1).padStart(2, '0')}${date.getFullYear()}`;
    setStoreCount(++response.invoiceCount)
    if(selectedValue==="provisional"){
      // newCount = ${vendor.shopname}${formattedDate}G${vendor.invoiceCount++}
        setInvoiceNumber(`${selectedShop.vendor?.shopname}${formattedDate}P${++response.invoiceCount}`)
    } else{
      setInvoiceNumber(`${selectedShop.vendor?.shopname}${formattedDate}G${++response.invoiceCount}`)
    }
  }

  useEffect(() => {
    function setInvoiceHandler() {
      if (buttonsModes.firstButtonMode) {
        setInvoiceType("recent");
      } else if (buttonsModes.secondButtonMode) {
        setInvoiceType("provInvoice");
      } else {
        setInvoiceType("gstInvoice");
      }
    }

    setInvoiceHandler();
  }, [buttonsModes]);

  useEffect(() => {
    console.log("selected Value is , ", selectedValue);
  }, [selectedValue]);

  const handleButtonPress = (button) => {
    setButtonsModes((prevstate) => {
      if (button === "first" && !prevstate.firstButtonMode) {
        return {
          firstButtonMode: true,
          secondButtonMode: false,
          thirdButtonMode: false,
        };
      } else if (button === "second" && !prevstate.secondButtonMode) {
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

    if (button === "first") {
      data = {
        filteredBy: "recent",
      };
      navigation.navigate("StackNavigator", {
        screen: "ViewInvoices1",
        params: {
          data: data,
        },
      });
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <TouchableWithoutFeedback>
        <View style={styles.container}>
          <View style={styles.logoPickerContainer}>
            <Entypo name="shop" size={30} color="#0c3b73" />
            <View style={styles.pickerContainer}>
              {isTourGuideActive && (
                <TourGuideZone
                  zone={1}
                  text={"See all the Vender"}
                  shape="rectangle"
                  keepTooltipPosition={true} // Keeps the tooltip in place
                  pointerEvents="box-none"
                  style={{
                    position: "absolute",
                    width: "100%",
                    top: 36,
                    height: 32,
                  }}
                />
              )}

              <DropDownList options={allShops} />
            </View>
          </View>
          <CustomToggleButton
            options={toggleOptions}
            value={selectedValue}
            onChange={setSelectedValue}
            t={t}
          />

          <View style={styles.MainContainer}>
            <View style={styles.TextView}>

                <Text style={styles.headerText}>
                  {t("Invoice No:")} - {invoiceNumber}
                </Text>

              <CreateInvoiveForm selectedButton={selectedValue} />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pickerContainer: {
    borderColor: "#0c3b73",
    borderRadius: 10,
    width: "90%",
  },
  logoPickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  icon: {
    padding: 8,
  },
  shopInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 16,
  },
  card: {
    marginVertical: 16,
  },
  cardText: {
    fontSize: 18,
    textAlign: "center",
  },
  paidUnpaidBtnContainer: {
    // backgroundColor:"orange",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 16,
  },
  row: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginVertical: 8,
    // backgroundColor:"purple"
  },
  label: {
    marginRight: 8,
  },
  radioBtnContainer: {
    alignItems: "flex-start",
    paddingLeft: 10,
  },
  datePickerButton: {
    marginTop: 16,
    padding: 10,
    // backgroundColor: "#f0f0f0",

    backgroundColor: "#777",
    borderRadius: 5,
  },
  dateText: {
    textAlign: "center",
    fontSize: 16,
    color: "#fff",
  },
  buttonView: {
    alignItems: "flex-end", // Moves the button to the right side
    marginTop: 10,
  },

  addButton: {
    flexDirection: "row", // Align icon and text horizontally
    alignItems: "center", // Center vertically
    justifyContent: "center", // Center horizontally
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  addButtonText: {
    marginLeft: 5, // Space between icon and text
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  MainContainer: {
    marginHorizontal: 10,
  },
  TextView: {
    marginVertical: 8,
    paddingVertical: 8,
  },
  headerText: {
    fontWeight: "bold",
    // color: "black",
    fontWeight: "medium",
    fontFamily: "Poppins-Medium",
    fontSize: fontSize.headingSmall,
  },
  input: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    height: 40,
    marginTop: 10,
  },
});

// <View style={styles.container}>
//   <ScrollView
//     style={styles.ScrollView}
//     contentContainerStyle={styles.contentContainer}
//   >
//     {/* 1 */}
//     {/* <View>
//       <Text style={styles.shopText}>Shop</Text>
//     </View> */}

//     {/* 2 */}
//     <View>
//       <View style={styles.logoPickerContainer}>
//         {/* <Entypo name="shop" size={30} color="#0c3b73" /> */}
//         <View style={styles.pickerContainer}>
//          <DropDownList/>
//         </View>
//       </View>
//     </View>

//     {/* 3 */}
//     <ThreeToggleBtns
//     buttonsModes={buttonsModes}
//     setButtonsModes={setButtonsModes}
//     navigation={navigation}
//     toggleButtonsTexts={toggleButtonsTexts}
//     handleButtonPress={handleButtonPress}/>

//     <View style={styles.formContainer}>
//       <View style={styles.formHeading}>
//         <Text style={{ fontSize: 13 }}>Provisional Invoice No :- </Text>
//         <Text style={{ fontSize: 13 }}>{invoiceNumber}</Text>
//       </View>

//       {/* <AddInvoice initialValues={initialValues}/> */}
//       <AddInvoiceScreen navigation={navigation} invoiceType={invoiceType} invoiceNumber={invoiceNumber} />
//     </View>
//     {/* 6 */}
//     <View></View>
//     {/* 7 */}
//     <View></View>
//   </ScrollView>
// </View>
