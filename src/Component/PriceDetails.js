import { View, Text, StyleSheet, TextInput } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { applyDiscount, applyPartiallyAmount } from "../Redux/slices/CartSlice";
import { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import CustomDropdown from "./CustomeDropdown";
import { fontSize } from "../Util/UtilApi";

const PriceDetails = ({ setPaymentStatus }) => {
  const dispatch = useDispatch();
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const afterdiscount = useSelector((state) => state.cart.afterdiscount);
  const error = useSelector((state) => state.cart.error);

  const [discountValue, setDiscountValue] = useState("");
  const [PartiallyAmount, setPartiallyAmount] = useState("");
  const carts = useSelector((state) => state.cart.Carts);
  const [selectedStatus, setSelectedStatus] = useState("Paid");
  const paymentStatuses = ["Unpaid", "Paid", "Partially Paid"];

  console.log("Error is ", error)
  console.log("totalPrice of redux - ", totalPrice);
  useEffect(() => {
    setPaymentStatus(selectedStatus);
  }, [selectedStatus]);

  useEffect(() => {
    if (selectedStatus !== "Partially Paid") {
      dispatch(applyPartiallyAmount(0));
      setPartiallyAmount(0);
    }
  }, [selectedStatus]);

  const handleDiscountChange = (value) => {
    const parsedDiscount =
      value.trim() === "" || isNaN(parseFloat(value))
        ? null
        : parseFloat(value);
    dispatch(applyDiscount(parsedDiscount));
    setDiscountValue(value);
  };

  const handlePartiallyAmount = (value) => {
    const PartiallyAmount =
      value.trim() === "" || isNaN(parseFloat(value))
        ? null
        : parseFloat(value);
    dispatch(applyPartiallyAmount(PartiallyAmount));
    setPartiallyAmount(value);
  };

  return (
    <View style={styles.Main}>
      <View>
        <Text style={styles.headerText}>Price Details</Text>
      </View>

      {/* Price  */}
      <View style={styles.priceView}>
        <Text style={styles.label}>Price ({carts.length})</Text>
        <Text style={styles.value}>{`₹ ${
          totalPrice?.toFixed(2) || "total"
        }`}</Text>
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
        {/* Display error message */}
      </View>

      {error && (
        <View style={styles.priceView}>
          <View style={styles.discountInputWrapper}>
            <Text style={styles.errorText}>Discount amount must be between 0 and total price.</Text>
          </View>
        </View>
      )}

      {/* Payment Status with Border Style */}
      <View style={[styles.priceView]}>
        <Text style={styles.label}>Status</Text>
        <CustomDropdown
          paymentStatuses={paymentStatuses}
          setSelectedStatus={setSelectedStatus}
          selectedStatus={selectedStatus}
        />
      </View>

      {/* Partially Paid  */}
      {selectedStatus == "Partially Paid" && (
        <View style={styles.priceView}>
          <Text style={styles.label}>Partially Paid</Text>
          <View style={styles.discountInputWrapper}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Enter Amount"
              value={PartiallyAmount}
              onChangeText={handlePartiallyAmount} // Update discount state
            />
          </View>
        </View>
      )}

      {/* Total Amount  */}
      <View style={styles.priceView}>
        <Text style={styles.Totallabel}>Total Amount</Text>
        {}
        <Text
          style={[styles.value, { fontSize: fontSize.labelLarge }]}
        >{`₹ ${afterdiscount.toFixed(2)}`}</Text>
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
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "Poppins-Medium",
    fontSize: fontSize.labelLarge,
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
    color: "#333",
    fontFamily: "Poppins-Medium",
    fontSize: fontSize.labelMedium,
  },
  value: {
    // fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "Poppins-Medium",
    fontSize: fontSize.labelMedium,
  },
  Totallabel: {
    // fontSize: 18,
    color: "#333",
    fontWeight: "bold",
    fontFamily: "Poppins-Medium",
    fontSize: fontSize.labelLarge,
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

  input: {
    fontFamily: "Poppins-Medium",
    fontSize: fontSize.labelMedium,
  },
  errorText:{
    color:"red"
  }
});

export default PriceDetails;

{
  /* <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={status}
            onValueChange={handleDropdown}
            style={[styles.picker,]}
          >
            <Picker.Item label="Unpaid" value="unpaid" />
            <Picker.Item label="Paid" value="paid" />
            <Picker.Item label="Partially Paid" value="partially_paid" />
          </Picker>
        </View> */
}
