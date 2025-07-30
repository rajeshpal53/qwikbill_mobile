import React, { useState, useEffect,useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import { ScrollView } from "react-native";
import { Card, TextInput,DataTable } from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import IncAndDicButton from "../../Redux/IncAndDicButton";
import { useDispatch, useSelector } from "react-redux";
import { applyDiscount, removeFromCart } from "../../Redux/slices/CartSlice";
import PriceDetails from "../PriceDetails";
import { fontSize } from "../../Util/UtilApi";




const ItemDataTable = ({ discountValue,discountRate,setDiscountRate,finalTotal,setFinalTotal }) => {
  const screenWidth = Dimensions.get("window").width;
  const carts = useSelector((state) => state.cart.Carts);
  const dispatch = useDispatch();
  console.log("carts is ", carts);
  const value = (carts?.sellPrice * carts?.quantity * carts?.taxRate) / 100;
  console.log("value is ", value);
  const COLUMN_WIDTHS = {
    small: 80,
    medium: 120,
  };
  const totalPrice = useSelector((state) => state.cart.totalPrice);

 const scrollRef = useRef(null);
  const [showScrollHint, setShowScrollHint] = useState(true);
  useEffect(() => {
  const discount = parseFloat(discountValue) || 0;
  const total = parseFloat(totalPrice) || 0;

  if (total > 0) {
    const percentage = (discount / total) * 100;
    setDiscountRate(parseFloat(percentage.toFixed(3))); // Set as percentage (e.g. 25.00)
  } else {
    setDiscountRate(0); // Avoid division by zero
  }
}, [discountValue, totalPrice]);

useEffect(() => {
  let total = 0;

  carts.forEach((item) => {
   const amount = +(item.sellPrice * item.quantity || 0).toFixed(2);
   
const discountAmt = +((amount * discountRate) / 100).toFixed(2);
const amtAfterDiscount = +(amount - discountAmt).toFixed(2);
const gstAmt = +((amtAfterDiscount * item.taxRate) / 100).toFixed(2);
total += +(amtAfterDiscount + gstAmt).toFixed(2);
  });
  setFinalTotal(parseFloat(total.toFixed(2)));
}, [carts, discountRate,]);
  console.log("discountRate is ", discountRate, totalPrice);
    console.log("finalTotal calculated is", finalTotal);


   const handleScroll = (event) => {
    const contentWidth = event.nativeEvent.contentSize.width;
    const scrollX = event.nativeEvent.contentOffset.x;

    if (scrollX + screenWidth >= contentWidth - 10) {
      setShowScrollHint(false); // hide when scrolled to end
    } else {
      setShowScrollHint(true);
    }
  };


  return (
    <View  style={styles.container}>

    
    <ScrollView horizontal
    ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.scrollContainer} 
>
      <Card style={styles.card}>
        <DataTable>
          {/* Header */}
          <DataTable.Header style={styles.row}>
            <DataTable.Title style={{ width: COLUMN_WIDTHS.small }}>No.</DataTable.Title>
            <DataTable.Title style={{ width: COLUMN_WIDTHS.medium }}>Items</DataTable.Title>
            <DataTable.Title style={{ width: COLUMN_WIDTHS.small }}>Rate</DataTable.Title>
            <DataTable.Title style={{ width: COLUMN_WIDTHS.small }}>Qty</DataTable.Title>
            <DataTable.Title style={{ width: COLUMN_WIDTHS.small }}>Amount</DataTable.Title>
            <DataTable.Title style={{ width: COLUMN_WIDTHS.small }}>Discount %</DataTable.Title>
            <DataTable.Title style={{ width: COLUMN_WIDTHS.small }}>Discount Amt</DataTable.Title>
            <DataTable.Title style={{ width: COLUMN_WIDTHS.small }}>Amt after Disc</DataTable.Title>
            <DataTable.Title style={{ width: COLUMN_WIDTHS.small }}>    GST %</DataTable.Title>
            <DataTable.Title style={{ width: COLUMN_WIDTHS.small }}>GST Amt</DataTable.Title>
            <DataTable.Title style={{ width: COLUMN_WIDTHS.small }}>Total</DataTable.Title>
            <DataTable.Title style={{ width: COLUMN_WIDTHS.small }}>Action</DataTable.Title>
          </DataTable.Header>

          {/* Rows */}
          {carts.map((item, index) => {
            const amount = item.sellPrice * item.quantity || 0;
            const discountAmt = (amount * discountRate) / 100;
            const amtAfterDiscount = amount - discountAmt;
            const gstAmt = (amtAfterDiscount * item.taxRate) / 100;
            const total = amtAfterDiscount + gstAmt;
            // let finalTotal =finalTotal+ total || 0;
            // setFinalTotal((prevTotal) => prevTotal + total);
            // console.log("finalTotal is ", finalTotal);

            return (
              <DataTable.Row key={item.id} style={styles.row}>
                <DataTable.Cell style={{ width: COLUMN_WIDTHS.small }}>{index + 1}</DataTable.Cell>
                <DataTable.Cell style={{ width: COLUMN_WIDTHS.medium }}>{item.name}</DataTable.Cell>
                <DataTable.Cell style={{ width: COLUMN_WIDTHS.small }}>₹{item.sellPrice}</DataTable.Cell>
                <DataTable.Cell style={{ width: COLUMN_WIDTHS.small }}>{item.quantity}</DataTable.Cell>
                <DataTable.Cell style={{ width: COLUMN_WIDTHS.small }}>₹{amount.toFixed(2)}</DataTable.Cell>
                <DataTable.Cell style={{ width: COLUMN_WIDTHS.small }}>{discountRate || 0}%</DataTable.Cell>
                <DataTable.Cell style={{ width: COLUMN_WIDTHS.small }}>₹{discountAmt.toFixed(2)}</DataTable.Cell>
                <DataTable.Cell style={{ width: COLUMN_WIDTHS.small }}>₹{amtAfterDiscount.toFixed(2)}</DataTable.Cell>
                <DataTable.Cell style={{ width: COLUMN_WIDTHS.small }}>{item.taxRate}%</DataTable.Cell>
                <DataTable.Cell style={{ width: COLUMN_WIDTHS.small }}>₹{gstAmt.toFixed(2)}</DataTable.Cell>
                <DataTable.Cell style={{ width: COLUMN_WIDTHS.small }}>₹{total.toFixed(2)}</DataTable.Cell>
                <DataTable.Cell style={{ width: COLUMN_WIDTHS.small }}>

                  <TouchableOpacity onPress={() => dispatch(removeFromCart(item.id))}>
                    <MaterialIcons name="delete" size={20} color="red" />
                  </TouchableOpacity>
                </DataTable.Cell>
              </DataTable.Row>
            );
          })}
        </DataTable>
      </Card>
    </ScrollView>
    {/* {showScrollHint && (
        <View style={styles.scrollIndicator}>
          <MaterialIcons name="arrow_forward_ios" size={16} color="#999" />
        </View>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
   container: {
    position: "relative",
    flex: 1,
    marginVertical: 10,
  },
  card: {
    margin: 2,
    elevation: 3,
    borderRadius: 8,
    backgroundColor: "#fff",
    // paddingVertical: 20,
    marginTop: 15,
    minWidth: 200,
    flexWrap: "wrap",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",

    //paddingHorizontal: 5,
  },
  cell: {
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Poppins-Regular",
    fontSize: fontSize.labelMedium,
  },
  smallCell: {
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  flexCell: {
    // flex: 1,
  },
  totalContainer: {
    marginTop: 10,
    paddingHorizontal: 5,
  },
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
    marginTop: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    height: 35,
    marginTop: 10,
  },
  buttonContainer: {
    marginTop: 10,
    alignItems: "flex-end",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
  },
  addButtonText: {
    marginLeft: 5,
    color: "white",
    fontWeight: "bold",
  },
   scrollIndicator: {
    position: "absolute",
    right: 4,
    top: "50%",
    transform: [{ translateY: -10 }],
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 4,
    elevation: 3,
    zIndex: 10,
  },
});

export default ItemDataTable;

{
  /* Total Price Section
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total:</Text>
        <TextInput
          mode="outlined"
          style={styles.input}
          editable={false}
          value={`$ ${totalPrice.toFixed(2)}`}
        />
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Discount :</Text>
      </View> */
}