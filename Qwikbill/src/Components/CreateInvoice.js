import { Entypo } from "@expo/vector-icons";
import { useContext, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import CustomToggleButton from "../Component/CustomToggleButton";
import CreateInvoiveForm from "../Component/Form/CreateInvoiveForm";
import { ShopContext } from "../Store/ShopContext";
import DropDownList from "../UI/DropDownList";
import { fontSize, readApi } from "../Util/UtilApi";
// import {
//   TourGuideProvider,
//   TourGuideZone,
//   TourGuideZoneByPosition,
//   useTourGuideController,
// } from "rn-tourguide";
import { useTranslation } from "react-i18next";
import UserDataContext from "../Store/UserDataContext";
import { useTheme } from "../../constants/Theme";

export default function CreateInvoice({ navigation, route }) {
  const startTour = route.params;
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;
  const{colors}=useTheme()
  // const { selectedShop, setSelectedShop } = useContext(AuthContext);
  const [invoiceType, setInvoiceType] = useState("provInvoice");
  const pickerRef = useRef();
  const { allShops,selectedShop} = useContext(ShopContext);
  const [isTourGuideActive, setIsTourGuideActive] = useState(false);
  // const { canStart, start, stop, eventEmitter } = useTourGuideController();
  const [invoiceNumber,setInvoiceNumber]=useState("");
  const { t } = useTranslation();

  const [selectedValue, setSelectedValue] = useState("provisional");
  const{userData}=useContext(UserDataContext)
  const [storeCount,setStoreCount]=useState(0)
  const toggleOptions = [
    { value: "provisional", label: "Prov Invoice" },
    { value: "gst", label: "GST Invoice" },
    { value: "Quatation", label: "Quatation" },
  ];

  //----------------------------------------------------

  const [buttonsModes, setButtonsModes] = useState({
    firstButtonMode: false,
    secondButtonMode: true,
    thirdButtonMode: false,
  });

  const toggleButtonsTexts = {
     first: "Quatation",
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
        setInvoiceType("quatation");
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
    <ScrollView style={[styles.scrollView,{backgroundColor:colors?.background}]} nestedScrollEnabled={true} >
       {/* <TouchableWithoutFeedback> */}
        <View style={styles.container}>
          <View >
            {/* <Entypo name="shop" size={30} color="#0c3b73" marginLeft="20" marginVertical="10" paddingLeft="0" marginHorizontal="0" /> */}
            <View style={styles.pickerContainer}>
              <Entypo name="shop" size={30} color="#0c3b73" marginLeft="0" marginVertical="0" paddingLeft="0" marginHorizontal="0" />
              {/* {isTourGuideActive && (
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
                  }
                }
                />
              )} */}

              <DropDownList options={allShops}  />
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
              <CreateInvoiveForm selectedButton={selectedValue} />
            </View>
          </View>
        </View>
     {/* </TouchableWithoutFeedback> */}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    
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
    width: "100%",
    marginTop:1,
    marginBottom:10,
    backgroundColor:"white",
    marginRight:45,
    marginLeft:10,
    justifyContent:"space-around",
    paddingRight:10,
  },
  logoPickerContainer: {
    flexDirection: "row",
    // alignItems: "center",
    justifyContent: "space-around",
    paddingVertical:0,
    paddingRight:0,
    backgroundColor:"white",
    marginLeft:7,
    marginRight:0,
    
    marginTop:-10,
   borderRadius:10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  icon: {
    padding: 0,
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