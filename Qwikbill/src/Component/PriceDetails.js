import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TextInput, View, } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useDispatch, useSelector } from "react-redux";
import { applyDiscount, applyPartiallyAmount } from "../Redux/slices/CartSlice";
import { fontFamily, fontSize } from "../Util/UtilApi";
import CustomDropdown from "./CustomeDropdown";


const PriceDetails = ({ setPaymentStatus, selectedButton, discountValue, setDiscountValue }) => {
  const dispatch = useDispatch();
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const afterdiscount = useSelector((state) => state.cart.afterdiscount);
  const error = useSelector((state) => state.cart.error);


  const [PartiallyAmount, setPartiallyAmount] = useState("");
  const carts = useSelector((state) => state.cart.Carts);
  const [selectedStatus, setSelectedStatus] = useState("Paid");
  const paymentStatuses = ["Unpaid", "Paid", "Partially Paid"];
  const { t } = useTranslation();


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

      {/*<View>
        <Text style={styles.headerText}>{t("Price Details")}</Text>
      </View> */}

      {/* Price  */}
      <View style={styles.priceView}>
        <Text style={styles.label}>{t("Price")} ({carts.length})</Text>
        <Text style={styles.value}>
          {`₹ ${totalPrice?.toFixed(2) || "total"}`}
        </Text>
      </View>

      {/* Discount  */}
      {selectedButton !== "Quatation" && (
        <View style={styles.priceView}>
          <View style={{ marginTop: 7 }}>
            <Text style={styles.label}>{t("Discount")}</Text>
          </View>
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
      )}

      {error && (
        <View style={styles.priceView}>
          <View style={styles.discountInputWrapper}>
            <Text style={styles.errorText}>{t("Discount amount must be between 0 and total price.")}</Text>
          </View>
        </View>
      )}

      {/* Payment Status with Border Style */}
      {selectedButton !== "Quatation" && (

        <View style={[styles.priceView]}>
          <View style={{ alignItems: "center", marginTop: 10 }}>
            <Text style={styles.label}>{t("Status")}</Text>
          </View>

          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedStatus}
              onValueChange={(itemValue) => setSelectedStatus(itemValue)}
              style={styles.picker}
              mode="dropdown"
            >
              {paymentStatuses.map((status, index) => (
                <Picker.Item key={index} label={t(status)} value={status} />
              ))}
            </Picker>
          </View>

        </View>
      )}
      {selectedStatus === "Partially Paid" && (
        <>
          <View style={styles.priceView}>
            <Text style={[styles.label, { marginTop: 5 }]}>{t("Partially Paid")}</Text>
            <View style={styles.discountInputWrapper}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Enter Amount"
                value={PartiallyAmount}
                onChangeText={handlePartiallyAmount}
              />
            </View>
          </View>

          {/* Remaining Amount after partial payment */}
          {PartiallyAmount !== "" && !isNaN(PartiallyAmount) && (
            <View style={styles.priceView}>
              <Text style={styles.label}>{t("Remaining Amount")}</Text>
              <Text style={[styles.value, { fontSize: fontSize.labelLarge, fontFamily: fontFamily.medium }]}>
                ₹ {(afterdiscount).toFixed(2)}
              </Text>
            </View>
          )}
        </>
      )}

      {/* Total Amount  */}
      <View style={styles.priceView}>
        <Text style={styles.Totallabel}>{t("Total Amount")}</Text>
        { }
        <Text
          style={[styles.value, { fontSize: fontSize.labelLarge }]}>

          ₹ {
            selectedStatus === "Partially Paid"
              ? totalPrice.toFixed(2) // Show full price
              : afterdiscount.toFixed(2) // Show discounted price
          }
        </Text>
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
    marginVertical: 3,
    marginLeft: 6,
  },
  discountInputWrapper: {
    flex: 1,
    // justifyContent: "flex-end",
    alignItems: "flex-end",
    marginTop: -4,
    marginBottom: -10,
  },
  pickerWrapper: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginVertical: -7,
    paddingHorizontal: 8,
  },
  picker: {
    height: 55,
    width: "60%",
    alignItems: "flex-start",
    marginRight: -25,
  },

  input: {
    fontFamily: "Poppins-Medium",
    fontSize: fontSize.labelMedium,
  },
  errorText: {
    color: "red"
  }
});

export default PriceDetails;

