import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar, Card } from "react-native-paper";
import { ShopContext } from "../../Store/ShopContext";
import { fontSize } from "../../Util/UtilApi";


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
                size={50}
                label={item?.name?.charAt(0)?.toUpperCase()}
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
    marginVertical: 10,
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
    flexDirection: "column",
    paddingVertical: 12,
    marginVertical: 5,
  },
  ImageView: {
    paddingHorizontal: 8,
    // marginLeft: 3,
  },
  TextView: {
    flex: 2,
    marginTop:-33,
  },
  ButtonTextView: {
    justifyContent: "space-between",
    // flex: 1,
    // marginRight: 5,
    position: "absolute",
    top: 9,
    right: 0
  },
  ButtonView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 7,
    marginRight:12,
  },
  itemname: {
    fontWeight: "bold",
    marginTop: -7,
    fontFamily: "Poppins-Medium",
    fontSize: fontSize.labelLarge + 4,
    paddingBottom: 15,
    marginLeft: 70,
  },
  avatar: {
    // backgroundColor: "black",
  },
  avatarPlaceholder: {
    marginTop: -8,
    marginLeft:5,

    // backgroundColor: "#ccc",
  },
  iconButton: {
    marginRight: 12, // Adds spacing between buttons
  },
  priceText: {
    // fontSize: 14,
    color: "#555",
    fontFamily: "Poppins-Medium",
    fontSize: fontSize.label+2,
    alignSelf: "auto",
    marginLeft: 30,

  },
  sellPrice: {
    color: "#555",
    fontFamily: "Poppins-Medium",
    fontSize: fontSize.label + 2,
    marginLeft: 15,
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
    marginTop: 10,
    marginRight: 10,

  },
  column: {
    flex: 1,
    //backgroundColor:"orange",
    // marginHorizontal:5
  },
});

export default ProductDetailsCard;

// (₹{item.numberOfProducts})
