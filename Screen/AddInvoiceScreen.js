import React, { useState, useContext } from "react";
import { ScrollView } from "react-native";
import { Snackbar, Text } from "react-native-paper";
import AddInvoice from "../Components/AddInvoice";
import { useSnackbar } from "../Store/SnackbarContext";
import { createApi, updateApi } from "../Util/UtilApi";
import { ShopDetailContext } from "../Store/ShopDetailContext";


const formatDate = (isoDateString) => {
  const [year, month, day] = isoDateString.split("-");
  return `${year}-${month}-${day}`;
};

const formatItems = (items) => {
  const i = items.map((item) => ({
    itemName: item.itemName,
    quantity: item.quantity.toString(),
    price: item.price.toString(),
    total: item.total.toString(),
  }));
  // console.log("prathem")
  // console.log(i);
  return i;
};

const AddInvoiceScreen = ({ navigation, invoiceType, route }) => {
  
  const { showSnackbar } = useSnackbar();
  const item = route?.params?.item;
  //  console.log("item is 11 ", item)
  const { shopDetails } = useContext(ShopDetailContext);
  const [initialValues, setInitialValues] = useState({
    client: item?.people?.name || "",
    phone: item?.people?.phone || "",
    people: item?.people || "",
    address: item?.people?.address || "",
    gstnumber: item?.people?.gstnumber || "",
    date:
      item?.date?.split("T")[0] ||
      formatDate(new Date().toISOString().split("T")[0]),
    items: (item?.items && formatItems(item.items)) || [
      { itemName: "", price: "", quantity: "", total: "" },
    ],
  });
 
  return (
    <ScrollView nestedScrollEnabled={true}>
      <AddInvoice
        item={item}
        initialValues={initialValues}
        invoiceType={invoiceType}
        navigation={navigation}
        shopDetails={shopDetails}
      />
    </ScrollView>
  );
};
export default AddInvoiceScreen;
