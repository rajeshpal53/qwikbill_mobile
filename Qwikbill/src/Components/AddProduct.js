import { useRoute } from "@react-navigation/native";
import { Formik } from "formik";
import { useContext, useEffect, useRef, useState } from "react";
import { Alert, Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, TextInput } from "react-native-paper";
import RazorpayCheckout from 'react-native-razorpay';
import Svg, { Path } from "react-native-svg";
import * as Yup from "yup";
import { ShopContext } from "../Store/ShopContext";
import { useSnackbar } from "../Store/SnackbarContext";
import UserDataContext from "../Store/UserDataContext";
import { createApi, readApi, updateApi } from "../Util/UtilApi";






const BlobTopRight = ({ top, right, bottom, left }) => (
  <Svg
    width={200}
    height={200}
    viewBox="0 0 200 200"
    style={{ position: 'absolute', top: top, right: right, bottom: bottom, left: left, zIndex: -1 }}
  >
    <Path
      fill="#D1E8FF"
      d="M40,-65.6C53.5,-56.5,66.5,-44.6,71.2,-30.9C75.9,-17.2,72.3,-1.7,66.9,11.9C61.5,25.4,54.3,37.1,44.1,49.3C33.9,61.5,20.6,74.1,4.1,77.3C-12.4,80.4,-24.8,74.2,-37.8,65.4C-50.7,56.6,-64.1,45.2,-71.7,30.7C-79.3,16.2,-81.1,-1.4,-73.9,-14.9C-66.6,-28.4,-50.4,-37.8,-36.5,-47.5C-22.6,-57.2,-11.3,-67.3,2.8,-71.4C17,-75.4,34,-73.6,40,-65.6Z"
      transform="translate(100 100)"
    />
  </Svg>
);

const BlobBottomLeft = () => (
  <Svg
    width={200}
    height={200}
    viewBox="0 0 200 200"
    style={{ position: 'absolute', bottom: -50, left: -50, zIndex: -1 }}
  >
    <Path
      fill="#D1E8FF"
      d="M49.6,-68.2C61.9,-60.1,67.5,-41.6,69.7,-24.9C71.8,-8.2,70.5,6.7,64.8,20.4C59.2,34.1,49.1,46.6,36.9,53.2C24.7,59.8,10.4,60.4,-2.4,63.4C-15.2,66.4,-30.5,71.9,-42.4,66C-54.2,60.1,-62.5,42.7,-66.7,26.1C-70.8,9.5,-70.8,-6.4,-64.7,-19.2C-58.6,-32,-46.4,-41.7,-33.9,-50.5C-21.3,-59.3,-10.6,-67.2,4.2,-73.1C19,-78.9,38.1,-82.2,49.6,-68.2Z"
      transform="translate(100 100)"
    />
  </Svg>
);


const AddProduct = ({ navigation }) => {
  // const [options, setOptions] = useState([]);
  // const [showOptions, setShowOptions] = useState(false);
  // const [showHsnOptions, setShowHsnOptions] = useState(false);
  const route = useRoute();
  const { EditData, isUpdated, setRefresh } = route.params;
  const { userData } = useContext(UserDataContext)
  const [HSNCode, SetHSNCode] = useState();
  const { selectedShop } = useContext(ShopContext);
  const { showSnackbar } = useSnackbar();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const timeoutId = useRef(null); // useRef to persist timeoutId

  console.log("DATA OF HSNCODE IS ", HSNCode);

  // const TaxRateWatcher = ({ showSnackbar }) => {
  //   const { errors, touched } = useFormikContext();

  //   useEffect(() => {
  //     if (errors.TaxRate && touched.TaxRate) {
  //       showSnackbar(errors.TaxRate, 'error');
  //     }
  //   }, [errors.TaxRate, touched.TaxRate]);

  //   return null;
  // };

  useEffect(() => {
    console.log("Edit data is ", EditData);
    console.log("Isupdated Data is ", isUpdated);
  }, [EditData, isUpdated]);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const validationSchema = Yup.object().shape({
    /* ProductCategory: Yup.string().required("Product category is required"), */
    ProductName: Yup.string().required("Product name is required"),
    SellingPrice: Yup.number()
      .required("Selling price is required")
      .typeError("Selling price must be a number"),
    TaxRate: Yup.number()
      .typeError("Tax value must be a number")
      .max(100, "Tax rate cannot greater than 100%")
    //   .when("HSNCode", {
    //     is: (val) => val && val.trim() !== "",
    //     then: (schema) => schema.required("Tax rate is required if HSN code is entered"),
    //     otherwise: (schema) => schema.notRequired(),
    //   })
    ,
     HSNCode: Yup.string().matches(/^\d{4}(\d{2})?(\d{2})?$/, 'Enter a valid 4, 6, or 8-digit HSN code'),
    PurchasePrice: Yup.number()
      .required("Purchase price is required")
      .typeError("Purchase price must be a number")
      .when("SellingPrice", (sellingPrice, schema) =>
        schema.max(sellingPrice - 0.01, "Purchase price must be less than selling price")
      ),
    // IsStockData: Yup.boolean().nullable().required("Stock status is required"),
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
      amount: amount,
      // order_id: order.id, 
      name: 'Daily Sabji',
      prefill: {
        email: userData?.user?.email,
        contact: userData?.user?.mobile,
        name: userData?.user?.name,
      },
      theme: { color: '#3399cc' },
    };
    // Open Razorpay Checkout
    console.log("Razorpay options: ", options);
    RazorpayCheckout.open(options)
      .then(async (data) => {
        // Success  
        console.log("payment data:", data)
        //  setIsLoading(true)
        // const response= await createApi("wallet/verifyPayment",{razorpay_order_id:data?.razorpay_order_id,
        //   razorpay_payment_id:data?.razorpay_payment_id, 
        //   razorpay_signature:data?.razorpay_signature, 
        //   userfk:userData?.user?.id, 
        //   amount:amount})
        console.log("response of verify  result", response)
        Alert.alert('Payment Success', `Payment ID: ${data.razorpay_payment_id}`);
        // setIsLoading(false)
      })
      .catch((error) => {
        // Error
        console.error("payment error", error)
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} // Adjust if needed
    >
      <View style={{ flex: 1 }}>
        <BlobTopRight top={-50} right={-50} />
        <BlobBottomLeft />
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', }}
          keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} >
          <Formik
            enableReinitialize={true}

            initialValues={{
              /* ProductCategory: EditData?.productcategoryfk || "", */
              ProductName: EditData?.name || "",
              PurchasePrice: EditData?.costPrice || "",
              SellingPrice: EditData?.sellPrice || "",
              TaxRate: EditData?.taxRate || "",
              // HSNCode: String(EditData?.hsncode) || "",
              HSNCode: EditData?.hsncode !== undefined ? String(EditData.hsncode) : "",
            }}
            validationSchema={validationSchema}

            onSubmit={async (values, { resetForm }) => {
              console.log("Before handlePayment");

              if (values.HSNCode && (!values.TaxRate || values.TaxRate === "")) {
                showSnackbar("Please enter Tax Rate when HSN Code is entered", "error");
                return;
              }


              // await handlePayment(20);
              console.log("Values areeee ", values);
              const ProductData = {
                /* productcategoryfk: values?.ProductCategory, */
                name: values?.ProductName,
                costPrice: values?.PurchasePrice,
                sellPrice: values?.SellingPrice,
                taxRate: values?.TaxRate,
                // hsncodefk: HSNCode?.id,
                // isStock: values?.IsStockData,
                vendorfk: selectedShop.vendor.id,
                hsncode: parseInt(values.HSNCode),
              };
              console.log("Data is 15863", ProductData);

              if (isUpdated === true) {
                console.log(" issss update ", isUpdated)

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
                console.log(" issss update ", isUpdated)
                try {
                  // Create a new product
                  const response = await createApi(`products/`, ProductData, {
                    headers: {
                      Authorization: `Bearer ${userData?.token}`
                    }
                  });

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

              <>

                {/* <TaxRateWatcher showSnackbar={showSnackbar} /> */}

                <View style={styles.container}>
                  <TextInput
                    label="Product Name*"
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
                    label="Purchase Price*"
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
                    label="Selling Price*"
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
                    label="Tax Rate(%)"
                    keyboardType="numeric"
                    mode="flat"
                    style={styles.input}
                    onChangeText={handleChange("TaxRate")}
                    value={values.TaxRate || ""}
                    error={touched.TaxRate && !!errors.TaxRate}
                  />
                  {touched.TaxRate && errors.TaxRate && (
                    <Text style={styles.errorText}>{errors.TaxRate}</Text>
                  )}


                  {/* Submit Button */}
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.submitButtonText}>Submit</Text>
                  </TouchableOpacity>

                  {/* <Button type="submit" > Submit </Button> */}
                </View>
              </>
            )}
          </Formik>
        </ScrollView>
        {!isKeyboardVisible && (
          <Image
            source={require('../../assets/addproduct.png')}
            style={styles.fixedImage}
            resizeMode="contain"
          />
        )}
      </View>

    </KeyboardAvoidingView>

  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 200, // Enough space above the fixed image
  },
  fixedImage: {
    width: 235,
    height: 205,
    position: 'absolute',
    bottom: 20,
    right: 60,
    zIndex: 1,
  },
  container: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    paddingVertical: 30,
    borderRadius: 15,
    paddingTop: 30,
    justifyContent: 'flex-start',
    flex: 1,
    // elevation: 5,
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