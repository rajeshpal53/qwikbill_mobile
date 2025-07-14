import React, { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Card, Avatar } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { fontSize } from "../../Util/UtilApi";
import { ShopContext } from "../../Store/ShopContext";


const ProductDetailsCard = ({ item, setRefresh, setProductId, setVisible }) => {
  const [Opendetails, setOpendetails] = useState(false);
  const navigation = useNavigation();
  const { selectedShop } = useContext(ShopContext)
  const HandleProductDelete = () => {
    console.log("ITEM ID IS ", item?.id)
    setProductId(item?.id)
    setVisible(true);
  }


  return (
    <ScrollView>
      <Card style={styles.card}>
        <View style={styles.container}>
          <View style={styles.ImageView}>
            {
              <Avatar.Text
                size={55}
                label={item?.name.charAt(0)}
                style={styles.avatarPlaceholder}
              />
            }
          </View>

          <View style={styles.TextView}>
            <Text style={styles.itemname}>{item.name}</Text>

            <View style={styles.rowContainer}>

              <View style={styles.column}>
                <Text style={styles.sellPrice}>Selling Price: ₹{item.sellPrice}</Text>
                <Text style={styles.sellPrice}>Cost Price: ₹{item.costPrice}</Text>


              </View>

              <View style={styles.column}>
                <Text style={styles.priceText}>Tax Rate: {item.taxRate}</Text>

                <Text style={styles.priceText}>HSN Code: {item.hsncode}</Text>


              </View>
            </View>
          </View>

          <View style={styles.ButtonTextView}>
            {
              (selectedShop?.role?.name === "owner" || selectedShop?.role?.name === "manager") && (
                <View style={styles.ButtonView}>
                  <View>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("AddProduct", { EditData: item, isUpdated: true, setRefresh: setRefresh })
                      }
                      style={styles.iconButton}
                    >
                      <MaterialIcons name="edit" size={20} color="#1E88E5" />
                    </TouchableOpacity>
                  </View>
                  <View>
                    <TouchableOpacity
                      onPress={() => HandleProductDelete(item)}
                      style={styles.iconButton}
                    >
                      <MaterialIcons name="delete" size={20} color="#E53935" />
                    </TouchableOpacity>
                  </View>
                </View>
              )
            }

          
          </View>
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 5,
    marginHorizontal: 10,
    // paddingVertical: 15,
    borderRadius: 8,
    elevation: 3,
    flex: 1,
    backgroundColor: "#fff",

    // alignContent:"center"
  },
  container: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 8,
    marginVertical: 5,
  },
  ImageView: {
    paddingHorizontal: 8,
   // marginLeft: 3,
  },
  TextView: {
    flex: 2,
  },
  ButtonTextView: {
    justifyContent: "space-between",
   // flex: 1,
   // marginRight: 5,
     position:"absolute",
     top:9,
     right:0
  },
  ButtonView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  itemname: {
    fontWeight: "bold",
    marginVertical: 3,
    fontFamily: "Poppins-Medium",
    fontSize: fontSize.labelLarge,
    paddingVertical: 2,
    marginLeft:3
  },
  avatar: {
    // backgroundColor: "black",
  },
  avatarPlaceholder: {
    // backgroundColor: "#ccc",
  },
  iconButton: {
    marginRight: 12, // Adds spacing between buttons
  },
  priceText: {
    // fontSize: 14,
    color: "#555",
    fontFamily: "Poppins-Medium",
    fontSize: fontSize.label,
    alignSelf:"flex-end",
    marginRight:6,
  
  },
  sellPrice: {
    color: "#555",
    fontFamily: "Poppins-Medium",
    fontSize: fontSize.label,
  },
  inStock: {
    color: "green",
    // fontSize: 12,
    textAlign: "right",
    marginRight: 8,
    fontFamily: "Poppins-Medium",
    fontSize: fontSize.label,
  },
  outOfStock: {
    color: "red",
    // fontSize: 12,
    fontFamily: "Poppins-Medium",
    fontSize: fontSize.label,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    //backgroundColor:"yellow",
    marginTop:3
  },
   column: {
    flex: 1,
    //backgroundColor:"orange",
   // marginHorizontal:5
  },
});

export default ProductDetailsCard;

// (₹{item.numberOfProducts})
