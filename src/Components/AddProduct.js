import React, { useContext, useEffect, useRef, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity,Alert } from "react-native";
import { RadioButton, Text, TextInput } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import { createApi, readApi, updateApi } from "../Util/UtilApi";
import CategoryDropDown from "../UI/DropDown/CategoryDropdown";
import { ShopContext } from "../Store/ShopContext";
import { useSnackbar } from "../Store/SnackbarContext";
import { useRoute } from "@react-navigation/native";
import RazorpayCheckout from 'react-native-razorpay';
import UserDataContext from "../Store/UserDataContext";
const AddProduct = ({ navigation }) => {
  // const [options, setOptions] = useState([]);
  // const [showOptions, setShowOptions] = useState(false);
  // const [showHsnOptions, setShowHsnOptions] = useState(false);
  const route = useRoute();
  const { EditData, isUpdated, setRefresh } = route.params;
  const {userData}=useContext(UserDataContext)
  const [HSNCode, SetHSNCode] = useState();
  const { selectedShop } = useContext(ShopContext);
  const { showSnackbar } = useSnackbar();

  const timeoutId = useRef(null); // useRef to persist timeoutId

  console.log("DATA OF HSNCODE IS ", HSNCode);

  useEffect(() => {
    console.log("Edit data is ", EditData);
    console.log("Isupdated Data is ", isUpdated);
  }, [EditData, isUpdated]);

  const validationSchema = Yup.object().shape({
    /* ProductCategory: Yup.string().required("Product category is required"), */
    ProductName: Yup.string().required("Product name is required"),
    SellingPrice: Yup.number()
      .required("Selling price is required")
      .typeError("Selling price must be a number"),
    TaxRate: Yup.number().typeError("Tax value must be a number"),
    HSNCode:Yup.string().matches(/^\d{4}(\d{2})?(\d{2})?$/, 'Enter a valid 4, 6, or 8-digit HSN code'),
    PurchasePrice: Yup.number()
    .required("Purchase price is required")
    .typeError("Purchase price must be a number")
    .when("SellingPrice", (sellingPrice, schema) =>
      schema.max(sellingPrice - 0.01, "Purchase price must be less than selling price")
    ),
    IsStockData: Yup.boolean().nullable().required("Stock status is required"),
  });

   const handlePayment = async (amount) => {
      // const response= await createApi("wallet/createOrderRazorpay",{ amount,currency: "INR",})
      // console.log("respnse of orderapi",response)
      // const order= await response;
    const options = {
      description: 'Test payment for order #1234',
      image: 'https://dailysabji.com/assets/dailysabji.png', // Optional: Your brand/logo URL
      currency: 'INR',
      key: 'rzp_test_3YVR197XSieDE6', // Replace with your Razorpay test or live key
      amount:amount,
        // order_id: order.id, 
      name: 'Daily Sabji',
      prefill: {
        email: userData?.user?.email,
        contact:userData?.user?.mobile,
        name: userData?.user?.name,
      },
      theme: { color: '#3399cc' },
    };
    // Open Razorpay Checkout
    console.log("Razorpay options: ", options);
    RazorpayCheckout.open(options)
      .then(async(data) => {
        // Success  
       console.log("payment data:",data)
      //  setIsLoading(true)
  // const response= await createApi("wallet/verifyPayment",{razorpay_order_id:data?.razorpay_order_id,
  //   razorpay_payment_id:data?.razorpay_payment_id, 
  //   razorpay_signature:data?.razorpay_signature, 
  //   userfk:userData?.user?.id, 
  //   amount:amount})
      console.log( "response of verify  result",response)
      Alert.alert('Payment Success', `Payment ID: ${data.razorpay_payment_id}`);
      // setIsLoading(false)
      })
      .catch((error) => {
        // Error
        console.error("payment error",error)
        Alert.alert(
          'Payment Failed',
          `Error: ${error.code} | ${error.description}`
        );
        //  setIsLoading(false)
      });
  };

  const HandleHsnCode = async (hsncode, setFieldValue) => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = setTimeout(async () => {
      try {
        const api = `hsn-codes`;
        const response = await readApi(api);
        if (response) {
          const matchedHsnCode = response.find(
            (item) => item?.code === hsncode
          );
          console.log("Matched HSN code is", matchedHsnCode);
          if (matchedHsnCode) {
            setFieldValue("HSNCode", matchedHsnCode?.code);
            setFieldValue("TaxRate", matchedHsnCode?.taxrate);
            SetHSNCode(matchedHsnCode);
          } else {
            console.log("No matching HSN code found");
            setFieldValue("TaxRate", "");
            setFieldValue("HSNCode", hsncode);
          }
        }
      } catch (error) {
        console.error("Error fetching HSN code data:", error);
      }
    }, 300);
  };

  return (
    <ScrollView contentContainerStyle={{}}>
      <Formik
        enableReinitialize={true}
        initialValues={{
         /* ProductCategory: EditData?.productcategoryfk || "", */
          ProductName: EditData?.name || "",
          PurchasePrice: EditData?.costPrice || "",
          SellingPrice: EditData?.sellPrice || "",
          TaxRate: EditData?.taxRate || "",
          HSNCode: EditData?.hsncode || "",
          IsStockData: EditData?.isStock || null,
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
         await  handlePayment(20)
          const ProductData = {
            /* productcategoryfk: values?.ProductCategory, */
            name: values?.ProductName,
            costPrice: values?.PurchasePrice,
            sellPrice: values?.SellingPrice,
            taxRate: values?.TaxRate,
            // hsncodefk: HSNCode?.id,
            isStock: values?.IsStockData,
            vendorfk: selectedShop.vendor.id,
            hsncode: parseInt(values.HSNCode),
          };
          console.log("Data is 15863", ProductData);
          if (isUpdated) {
            console.log("Edit field is ", ProductData);
            try {
              // Pass ProductData to the update API request
              const response = await updateApi(
                `products/${EditData?.id}`,
                ProductData
              );
              console.log("Updated data is ", response)
              if (response) {
                showSnackbar("Product Updated Successfully", "success");
                setRefresh((prev) => !prev);
                navigation.goBack();
              } else {
                showSnackbar("Failed to update the product", "error");
              }
            } catch (error) {
              console.log("Unable to edit data ", error);
              showSnackbar("Error updating product", "error");
            }
          } else {
            try {
              // Create a new product
              const response = await createApi(`products/`, ProductData);

              console.log("Full response from createApi:", response);

              if (response) {
                showSnackbar("Product Added Successfully", "success");
                resetForm();
                navigation.goBack();
              } else {
                showSnackbar("Failed to add product", "error");
              }
            } catch (error) {
              showSnackbar("Error creating product", "error");
              console.log("Unable to Upload data ", error);
            }
// =======
//           try {
//              const response =await createApi(`products/`, ProductData);
//              console.log("Response is Add Product", response);
//               if (response){
//                 resetForm();
//                 navigation.goBack();
//                 showSnackbar("Product Add Successfully", "success");
//               }
//           } catch (error) {
//             showSnackbar(error, "error");
//             console.log("Unable to Upload data ", error);
// >>>>>>> faizan
          }
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <View style={styles.container}>
            {/* Product Category */}
          {/*}  <View style={{ marginBottom: 10 }}>
              <CategoryDropDown
                selectedCat={values.ProductCategory}
                setSelectedCat={(categoryId) =>
                  setFieldValue("ProductCategory", categoryId)
                }
              />
              {touched.ProductCategory && errors.ProductCategory && (
                <Text style={styles.errorText}>{errors.ProductCategory}</Text>
              )}
            </View>

            {/* Product Name */}
            <TextInput
              label="Product Name"
              mode="flat"
              style={styles.input}
              onChangeText={handleChange("ProductName")}
              onBlur={handleBlur("ProductName")}
              value={values.ProductName}
              error={touched.ProductName && !!errors.ProductName}
            />
            {touched.ProductName && errors.ProductName && (
              <Text style={styles.errorText}>{errors.ProductName}</Text>
            )}

            {/* Purchase Price */}
            <TextInput
              label="Purchase Price"
              keyboardType="numeric"
              mode="flat"
              style={styles.input}
              onChangeText={handleChange("PurchasePrice")}
              onBlur={handleBlur("PurchasePrice")}
              value={values.PurchasePrice}
              error={touched.PurchasePrice && !!errors.PurchasePrice}
            />
            {touched.PurchasePrice && errors.PurchasePrice && (
              <Text style={styles.errorText}>{errors.PurchasePrice}</Text>
            )}

            {/* Selling Price */}
            <TextInput
              label="Selling Price"
              keyboardType="numeric"
              mode="flat"
              style={styles.input}
              onChangeText={handleChange("SellingPrice")}
              onBlur={handleBlur("SellingPrice")}
              value={values.SellingPrice}
              error={touched.SellingPrice && !!errors.SellingPrice}
            />
            {touched.SellingPrice && errors.SellingPrice && (
              <Text style={styles.errorText}>{errors.SellingPrice}</Text>
            )}

            {/* HSN Code */}
            <TextInput
              label="HSN Code"
              mode="flat"
              style={styles.input}
              // onChangeText={handleChange("HSNCode")}
              onChangeText={async (HSNCode) => {
                setFieldValue("HSNCode", HSNCode);
                await HandleHsnCode(HSNCode, setFieldValue);
              }}
              // onBlur={() => HandleHsnCode(values?.HSNCode, setFieldValue)}
              value={values.HSNCode}
              error={touched.HSNCode && !!errors.HSNCode}
            />
            {touched.HSNCode && errors.HSNCode && (
              <Text style={styles.errorText}>{errors.HSNCode}</Text>
            )}

            {/* Tax Value */}
            <TextInput
              label="Tax Value"
              keyboardType="numeric"
              mode="flat"
              style={styles.input}
              onChangeText={handleChange("TaxRate")}
              value={values.TaxRate || ""}
              error={touched.taxValue && !!errors.taxValue}
            />

            {/* Stock Status (Radio Button) */}
          {/*<View style={styles.radioGroup}>
              <Text>Is in Stock?</Text>
              <RadioButton.Group
                onValueChange={(value) => handleChange("IsStockData")(value)}
                value={values.IsStockData}
              >
                <View style={styles.radioButton}>
                  <RadioButton value={"true"} />
                  <Text>Yes</Text>
                </View>
                <View style={styles.radioButton}>
                  <RadioButton value={"false"} />
                  <Text>No</Text>
                </View>
              </RadioButton.Group>
              {touched.IsStockData &&
                errors.IsStockData && ( // Ensure to use IsStockData here
                  <Text style={styles.errorText}>{errors.IsStockData}</Text>
                )}
            </View> */}

           
            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 15,
    elevation: 5,
    flex: 1,
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  errorText: {
    fontSize: 12,
    color: "red",
    marginBottom: 10,
  },
  suggestionsContainer: {
    position: "absolute",
    top: 170, // Adjust based on input field height
    width: "100%",
    maxHeight: 200,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
  },
  suggestionsList: {
    width: "100%",
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#f1f1f1",
  },
  submitButton: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  radioGroup: {
    marginBottom: 15,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default AddProduct;

// {showHsnOptions && (
//   <View style={styles.suggestionsContainer}>
//     <ScrollView style={styles.suggestionsList}>
//       {options.map((option, index) => (
//         <React.Fragment key={index}>
//           <List.Item
//             // key={index}
//             title={option.taxName}
//             onPress={async () => {
//               setFieldValue("HSNCode", option.taxName);
//               setFieldValue(
//                 "taxValue",
//                 option.taxValue.toString()
//               );
//               setShowHsnOptions(false);
//             }}
//           ></List.Item>
//           <Divider />
//         </React.Fragment>
//       ))}
//     </ScrollView>
//   </View>
// )}

// const fetchCategoryOptions = async (input) => {
//   const response = await readApi(
//     `api/productcategory/search?fields=name&q=${input}&page=1&items=10`
//   );
//   const data = await response;
//   return data.result; // Adjust according to your API response
// };

// // Fetch HSN Codes
// const fetchHsnOptions = async (input) => {
//   const response = await readApi(
//     `api/taxes/list?fields=taxName&q=${input}&page=1&items=10`
//   );
//   const data = await response;
//   return data.result; // Adjust according to your API response
// };

// Validation Schema for Formik

// const fetchOptions = async (input) => {
//   const response = await readApi(
//     `api/productcategory/search?fields=name&q=${input}&page=1&items=10`
//   );
//   const data = await response;
//   return data.result; // Adjust according to your API response
// };
// const fetchHsnOptions = async (input) => {
//   const response = await readApi(
//     `api/taxes/list?fields=taxName&q=${input}&page=1&items=10`
//   );
//   const data = await response;
//   return data.result; // Adjust according to your API response
// };

// // Fetch Category Options
// const fetchCategoryOptions = async (input) => {
//   const response = await readApi(
//     `api/productcategory/search?fields=name&q=${input}&page=1&items=10`
//   );
//   const data = await response;
//   return data.result;
// };

// // Fetch HSN Code Options
// const fetchHsnOptions = async (input) => {
//   const response = await readApi(
//     `api/taxes/list?fields=taxName&q=${input}&page=1&items=10`
//   );
//   const data = await response;
//   return data.result;
// };
