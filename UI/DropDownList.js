import React,{useContext,useState,useEffect,useRef} from "react"
import { ShopDetailContext } from "../Store/ShopDetailContext"
import { Picker } from "@react-native-picker/picker";
import { View,Text ,StyleSheet, TouchableOpacity} from "react-native"
import { readApi } from "../Util/UtilApi";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
  responsiveScreenFontSize
} from "react-native-responsive-dimensions";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native-paper";

function DropDownList() {
 const {addShopDetails,shopDetails}=useContext(ShopDetailContext)
 const [isLoading, setIsLoading] = useState(false);
 const [options, setOptions] = useState([]);
 const [selectedShop, setSelectedShop ] = useState("");
 console.log(shopDetails,"newShopDetails")
 const pickerRef = useRef();
 async function fetchOptions() {
  setIsLoading(true);
  const response = await readApi(`api/shop/list`);
  setOptions(response.result);
  const newResponse= await readApi(`api/invoice/list?shop=${response.result[0]._id}`)
  const count=newResponse.result.length
  addShopDetails({...response.result[0],count:count})

  setIsLoading(false);
  // Adjust according to your API respons
  // setSelectedOption(data.result[0].shopname)
}

 useEffect(() => {

    fetchOptions();
  }, []);



  const getSelectedOption =async () => {
    const selectedId = options.find(option => option.shopname === selectedShop);
    const newResponse= await readApi(`api/invoice/list?shop=${selectedId._id}`)
    count= newResponse.result.length
    addShopDetails({...selectedId,count:count})
  }

  useEffect(() => {
    if (selectedShop) {
      getSelectedOption();
    }
  }, [selectedShop]);

  return (
    <View style={styles.pickerContainer}>
      {isLoading && (
        <ActivityIndicator size="small"/>
      )}
    <Picker
      style={{width:"95%"}}
      ref={pickerRef}
      selectedValue={selectedShop}
      onValueChange={(itemValue, itemIndex) =>
        setSelectedShop(itemValue)
      }
    >
      {options.map((option, index) => (
        <Picker.Item
          key={index}
          value={option.shopname}
          label={option.shopname}
          color="#555555"
        >
          {option.shopname}
        </Picker.Item>
      ))}
    </Picker>

    <TouchableOpacity style={{justifyContent:"center"}} onPress={fetchOptions}>
      <MaterialCommunityIcons name="reload" size={20}/>
    </TouchableOpacity>
  </View>
  )
}
const styles= StyleSheet.create({
    pickerContainer: {
        // borderWidth: 1,
        borderColor: "#0c3b73",
        borderRadius: responsiveWidth(3),
        width: "100%",
        flexDirection:"row"
      },
})

export default DropDownList
