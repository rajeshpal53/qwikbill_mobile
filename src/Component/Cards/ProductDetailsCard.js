import React, { useEffect, useState } from "react";
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


const ProductDetailsCard = ({ item, setRefresh, setProductId, setVisible }) => {
  const [Opendetails, setOpendetails] = useState(false);
  const navigation = useNavigation();

  const HandleProductDelete = () =>{
    console.log("ITEM ID IS ",item?.id)
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
            <Text style={styles.sellPrice}>
              Selling Price: ₹{item.sellPrice}
            </Text>
            <Text style={styles.priceText}>Cost Price: ₹{item.costPrice}</Text>
            <Text style={styles.priceText}>HSN Code: {item.hsncode}</Text>
            <Text style={styles.priceText}>Tax Rate: {item.taxRate}</Text>
          </View>

          <View style={styles.ButtonTextView}>
            <View style={styles.ButtonView}>
              <View>
                <TouchableOpacity
                  onPress={() => navigation.navigate("AddProduct", { EditData: item, isUpdated: true, setRefresh:setRefresh })
                }
                  style={styles.iconButton}
                >
                  <MaterialIcons name="edit" size={24} color="#1E88E5" />
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => HandleProductDelete(item)}
                  style={styles.iconButton}
                >
                  <MaterialIcons name="delete" size={24} color="#E53935" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.Availabletext}>
              <Text style={item.isStock ? styles.inStock : styles.outOfStock}>
                {item.isStock ? `In Stock` : "Out of Stock"}
              </Text>
            </View>
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
    paddingVertical: 10,
    marginVertical: 5,
  },
  ImageView: {
    paddingHorizontal: 7,
    marginLeft: 5,
  },
  TextView: {
    flex: 2,
  },
  ButtonTextView: {
    justifyContent: "space-between",
    flex: 1,
    marginRight: 5,
    // borderWidth: 2,
  },
  ButtonView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  itemname: {
    fontWeight: "bold",
    marginVertical: 2,
    fontFamily: "Poppins-Medium",
    fontSize: fontSize.labelLarge,
    paddingVertical: 2,
  },
  avatar: {
    // backgroundColor: "black",
  },
  avatarPlaceholder: {
    // backgroundColor: "#ccc",
  },
  iconButton: {
    marginRight: 10, // Adds spacing between buttons
  },
  priceText: {
    // fontSize: 14,
    color: "#555",
    fontFamily: "Poppins-Medium",
    fontSize: fontSize.label,
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
  //   Availabletext:{
  //     marginRight:2
  //   }
});

export default ProductDetailsCard;

// (₹{item.numberOfProducts})
