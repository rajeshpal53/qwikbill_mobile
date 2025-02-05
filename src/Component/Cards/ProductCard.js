import { useEffect, useState } from "react";
import {
  Image,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Card } from "react-native-paper";
import IncAndDicButton from "../../Redux/IncAndDicButton";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  removeFromCart,
} from "../../Redux/CartProductRedux/CartSlice";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ButtonColor, fontSize } from "../../Util/UtilApi";

const ProductCardDetails = ({ item }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.Carts);
  const isInCart = cartItems.some((cartItem) => cartItem.id === item.id);
  const inCart = cartItems.find((cartItem) => cartItem.id === item.id) || null;

  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
  };

  const handleDeletetocart = (item) => {
    dispatch(removeFromCart(item?.id));
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Card style={styles.card}>
        <View style={styles.mainContainer}>
          <View style={styles.container}>
            {/* Product Details */}
            <View style={styles.detailsContainer}>
              <Text style={styles.productName}>{item.Name}</Text>
              <Text style={styles.productInfo}>{item.info}</Text>
              <Text style={styles.productPrice}>$ {item.Price}</Text>
            </View>
          </View>

          {/* Add Button Positioned at the Bottom */}
          <View style={styles.ButtonAndDeleteView}>
            {isInCart ? (
              <>
                <View
                  style={{
                    justifyContent: "space-between",
                    flex: 1,
                    alignItems: "center",
                    marginVertical: 5,
                  }}
                >
                  {/* Remove from Cart Button */}
                  <View>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleDeletetocart(item)}
                    >
                      <MaterialIcons name="delete" size={25} color="red" />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                    }}
                  >
                    {/* Increment/Decrement Controls */}
                    <IncAndDicButton item={inCart} />
                  </View>
                </View>
              </>
            ) : (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddToCart(item)}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 10,
    flexGrow: 1,
  },
  card: {
    elevation: 4,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginHorizontal: 10,
    // marginVertical: 2,
    // borderWidth:1
  },
  mainContainer: {
    flexDirection: "row",
    // paddingHorizontal: 5,
    // paddingVertical: 10,
    marginVertical: 15,
  },
  container: {
    // flexDirection: "row",
    flex: 1,
  },
  detailsContainer: {
    marginLeft: 15,
    // justifyContent: "center",
    flex: 1,
  },
  productName: {
    fontWeight: "bold",
    // color: "#333",
    marginVertical: 5,
    fontFamily: "Poppins-Bold",
    fontSize: fontSize.headingSmall,
  },
  productInfo: {
    color: "#666",
    marginTop: 4,
    marginVertical: 2,
    fontFamily: "Poppins-Medium",
    fontSize: fontSize.labelMedium,
  },
  productPrice: {
    fontSize: 16,
    // fontWeight: "bold",
    color: "#000",
    marginVertical: 5,
    fontFamily: "Poppins-Medium",
    fontSize: fontSize.labelLarge,
  },
  textButtonView: {
    marginTop: 10,
    // flexDirection: "row",
    // alignItems: "center",
    justifyContent: "space-between",
  },
  addButton: {
    backgroundColor: ButtonColor.SubmitBtn,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  addButtonText: {
    color: "#fff",
    // fontWeight: "bold",
    // fontSize: 14,
    fontSize: fontSize.labelMedium,
    fontFamily: "Poppins-Medium",
  },
  quantityControlContainer: {
    // flexDirection: "row",
    // alignItems: "center",
  },
  quantityButton: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  ButtonAndDeleteView: {
    justifyContent: "flex-end",
    marginRight: 8,
  },
});

export default ProductCardDetails;
