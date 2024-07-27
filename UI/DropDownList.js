import React,{useContext,useState,useEffect,useRef} from "react"
import { ShopDetailContext } from "../Store/ShopDetailContext"
import { Picker } from "@react-native-picker/picker";
import { View,Text ,StyleSheet} from "react-native"
import { readApi } from "../Util/UtilApi";
function DropDownList() {
 const {addShopDetails,shopDetails}=useContext(ShopDetailContext)
 const [options, setOptions] = useState([]);
 const [selectedShop, setSelectedShop ] = useState("");
 console.log(shopDetails,"newShopDetails")
 const pickerRef = useRef();
 useEffect(() => {
    async function fetchOptions() {
      const response = await readApi(`api/shop/list`);
      setOptions(response.result); // Adjust according to your API respons
      // setSelectedOption(data.result[0].shopname)
    }
    fetchOptions();
  }, []);
  const getSelectedOption = () => {
    const selectedId = options.find(option => option.shopname === selectedShop);
    addShopDetails(selectedId)
  }
  useEffect(() => {
    if (selectedShop) {
      getSelectedOption();
    }
  }, [selectedShop]);

  return (
    <View style={styles.pickerContainer}>
    <Picker
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
        >
          {option.shopname}
        </Picker.Item>
      ))}
    </Picker>
  </View>
  )
}
const styles= StyleSheet.create({
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#0c3b73",
        borderRadius: 10,
        // backgroundColor: "#0c3b73",
        // backgroundColor:"orange",
        width: "100%",
        // height:"50%",
        paddingHorizontal: 10,
      },
})

export default DropDownList
