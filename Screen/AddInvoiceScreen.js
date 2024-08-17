import React, { useState, useContext } from "react";
import { ScrollView } from "react-native";
import { Snackbar, Text } from "react-native-paper";
import AddInvoice from "../Components/AddInvoice";
import { useSnackbar } from "../Store/SnackbarContext";
import { createApi, updateApi } from "../Util/UtilApi";
import { ShopDetailContext } from "../Store/ShopDetailContext";
const getYear = (date) => {
  if (!date) return "";
  const dateObj = new Date(date);
  return dateObj.getFullYear();
};
const getNextMonthDate = (date) => {
  if (!date) return "";
  const dateObj = new Date(date);
  const nextMonth = new Date(dateObj.setMonth(dateObj.getMonth() + 1));
  return nextMonth.toISOString().substring(0, 10);
};

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
  const submitHandler = async (values, fetchDataId, paymentStatus) => {
    const postData = {
      ...values,
      shop: shopDetails._id,
      client: fetchDataId,
      number: parseInt(values.phone),
      taxRate: 0,
      currency: "USD",
      status: "draft",
      year: getYear(values.date),
      expiredDate: getNextMonthDate(values.date),
      people: item?.people || fetchDataId,
    };
    delete postData.phone;
    // delete postData.address
    console.log(postData, "------postdata , ", item);
    if(item !== undefined) {
       console.log("items is p, ", item)
      try {
        const headers = {
          "Content-Type": "application/json",
        };
        const response = await updateApi(
          `api/invoice/update/${item._id}`,
          postData,
          headers
        );
        showSnackbar("invoice updated Successfull", "success");
        if (response) {
          console.log(response.result);
          return response.result;
        }
      } catch (error) {
        console.error("Failed to update invoice", response);
        showSnackbar("Failed to update invoice", "error");
      }
    } else {
      try {
        const headers = {
          "Content-Type": "application/json",
        };
        const response = await createApi(
          "api/invoice/create",
          postData,
          headers
        );
        showSnackbar("invoice Added Successfull", "success");
        if (response) {
          console.log(response.result);
          return response.result;
        }
      } catch (error) {
        console.error("Failed to add invoice", response);
        showSnackbar("Failed to add invoice", "error");
      }
    }
  };
  return (
    <ScrollView nestedScrollEnabled={true}>
      <AddInvoice
        initialValues={initialValues}
        invoiceType={invoiceType}
        navigation={navigation}
        shopDetails={shopDetails}
        submitHandler={submitHandler}
      />
    </ScrollView>
  );
};
export default AddInvoiceScreen;
