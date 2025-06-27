import { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Card } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import IncAndDicButton from "../../Redux/IncAndDicButton";
// import {
//   addToCart,
//   removeFromCart,
// } from "../../Redux/CartProductRedux/CartSlice";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { addToCart, removeFromCart } from "../../Redux/slices/CartSlice";
import { ButtonColor, fontSize } from "../../Util/UtilApi";


const ProductCardDetails = ({ item }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.Carts);
  const isInCart = cartItems.some((cartItem) => cartItem.id === item.id);
  //const inCart = cartItems.find((cartItem) => cartItem.id === item.id) || null;
const cartEntry = cartItems.find(ci => ci.id === item.id); // full object


  useEffect(() => {
    console.log("InCart is , ", isInCart);
  }, [isInCart]);
  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
  };

  // const handleDeletetocart = (item) => {
  //   dispatch(removeFromCart(item?.id));
  // };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
     <Card style={styles.card}>
  <View style={styles.cardContent}>
    <View style={styles.detailsWrapper}>
      <Text style={styles.productName}>{item?.name}</Text>
      <Text style={styles.productInfo}>Cost Price: ₹{item?.costPrice}</Text>
      <Text style={styles.productInfo}>Sell Price: ₹{item?.sellPrice}</Text>
    </View>

    <View style={styles.actionWrapper}>
      {isInCart ? (
        <View style={styles.inCartActions}>
          <TouchableOpacity
            style={styles.iconButton}
  onPress={() => dispatch(removeFromCart(cartEntry))}
          >
            <MaterialIcons name="delete" size={24} color="#ff4d4f" />
          </TouchableOpacity>
          <IncAndDicButton item={cartEntry} />
        </View>
      ) : (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAddToCart(item)}
        >
          <Text style={styles.addButtonText}>Add to Cart</Text>
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
  borderRadius: 16,
  margin: 10,
  backgroundColor: '#fff',
  elevation: 5,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 8,
},
cardContent: {
  flexDirection: 'column',
  padding: 16,
},
detailsWrapper: {
  marginBottom: 12,
},
productName: {
  fontSize: 18,
  fontFamily: 'Poppins-Bold',
  color: '#333',
  marginBottom: 4,
},
productInfo: {
  fontSize: 14,
  fontFamily: 'Poppins-Medium',
  color: '#666',
  marginVertical: 2,
},
actionWrapper: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
inCartActions: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
},
iconButton: {
  backgroundColor: '#fce4e4',
  padding: 8,
  borderRadius: 8,
},
addButton: {
  backgroundColor: ButtonColor.SubmitBtn,
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 8,
  width:"50%",
  alignItems: 'center',
  justifyContent: 'center',
},
addButtonText: {
  color: '#fff',
  fontFamily: 'Poppins-Medium',
  fontSize: 14,
},

});

export default ProductCardDetails;
