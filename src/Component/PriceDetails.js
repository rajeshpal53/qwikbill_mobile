import { View, Text, StyleSheet, TextInput } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { applyDiscount } from "../Redux/CartProductRedux/CartSlice";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import CustomDropdown from "./CustomeDropdown";



const PriceDetails = () => {
  const dispatch = useDispatch();
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const afterdiscount = useSelector((state) => state.cart.afterdiscount);
  const [discountValue, setDiscountValue] = useState("");
  const carts = useSelector((state) => state.cart.Carts);
  const [status, setStatus] = useState("Unpaid");

  const handleDiscountChange = (value) => {
    const parsedDiscount =
      value.trim() === "" || isNaN(parseFloat(value))
        ? null
        : parseFloat(value);
    dispatch(applyDiscount(parsedDiscount));
    setDiscountValue(value);
  };

  const handleDropdown = (value) => {
    setStatus(value); // Update the selected value
  };

  return (
    <View style={styles.Main}>
      <View>
        <Text style={styles.headerText}>Price Details</Text>
      </View>

      {/* Price  */}
      <View style={styles.priceView}>
        <Text style={styles.label}>Price ({carts.length})</Text>
        <Text style={styles.value}>{`$ ${totalPrice.toFixed(2)}`}</Text>
      </View>

      {/* Discount  */}
      <View style={styles.priceView}>
        <Text style={styles.label}>Discount</Text>
        <View style={styles.discountInputWrapper}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter Discount"
            value={discountValue}
            onChangeText={handleDiscountChange} // Update discount state
          />
        </View>
      </View>

      {/* Total Amount  */}
      <View style={styles.priceView}>
        <Text style={styles.label}>Total Amount</Text>
        <Text style={styles.value}>{`$ ${afterdiscount.toFixed(2)}`}</Text>
      </View>

      {/* Payment Status with Border Style */}
      <View style={[styles.priceView]}>
        <Text style={styles.label}>Status</Text>
        <CustomDropdown />

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Main: {
    margin: 2,
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingVertical: 10,
    marginTop: 15,
    elevation: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  priceView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginHorizontal: 10,
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  discountInputWrapper: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  pickerWrapper: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",

  },
  picker: {
    height: 50, // Ensure the dropdown has height
    width: "90%", // Make sure it fills the available width

  },
  paymentStatusContainer: {
    borderBottomWidth: 1, // Border for the payment status row
    borderBottomColor: "#ddd",
  },

  input: {},
});

export default PriceDetails;





 {/* <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={status}
            onValueChange={handleDropdown}
            style={[styles.picker,]}
          >
            <Picker.Item label="Unpaid" value="unpaid" />
            <Picker.Item label="Paid" value="paid" />
            <Picker.Item label="Partially Paid" value="partially_paid" />
          </Picker>
        </View> */}