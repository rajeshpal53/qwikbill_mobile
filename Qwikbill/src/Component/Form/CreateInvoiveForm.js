import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import { useContext, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { clearCart } from "../../Redux/slices/CartSlice";
import { ShopContext } from "../../Store/ShopContext";
import { useSnackbar } from "../../Store/SnackbarContext";
import UserDataContext from "../../Store/UserDataContext";
import { ButtonColor, createApi, fontSize, readApi } from "../../Util/UtilApi";
import ItemDataTable from "../Cards/ItemDataTable";
import PriceDetails from "../PriceDetails";
import ConfirmModal from "../../Components/Modal/ConfirmModal";
import NameTextInput from "./NameTextInput";
import { useTheme } from "../../../constants/Theme";

const CreateInvoiceForm = ({ selectedButton }) => {
  const [isHorizontalScrolling, setIsHorizontalScrolling] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const carts = useSelector((state) => state.cart.Carts);
  const [User, setUser] = useState(null);
  const cartsValue = useSelector((state) => state.cart);
  const [PaymentStatus, setPaymentStatus] = useState("");
  const submit = useRef(false);
  const { userData } = useContext(UserDataContext);
  const { selectedShop } = useContext(ShopContext);
  const [loading, setLoading] = useState(false);
  const timeoutId = useRef(null); // useRef to persist timeoutId
  const { showSnackbar } = useSnackbar();
  const error = useSelector((state) => state.cart.error);
  const pendingActionRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const totalPrice = useSelector((state) => state.cart.totalPrice);

  const [discountValue, setDiscountValue] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [formFilled, setFormFilled] = useState(false);
  const [finalAmountValue, setFinalAmountValue] = useState(0);
  const [finalAmountError, setFinalAmountAError] = useState("");
  const[selectedPaymentMode,setSelectedPaymentMode]=useState("")
  const {colors}=useTheme()
{/* <NameInput
  values={values}
  handleChange={handleChange}
  handleBlur={handleBlur}
  touched={touched}
  errors={errors}
  setFieldValue={setFieldValue}
  setFormFilled={setFormFilled}   // ✅ now it’s a function
/> */}

const roundToTwo = (num) => {
  return Number(Math.round(num + 'e2') + 'e-2');
};
  console.log("DATA OF ERROR ", error, discountValue);
  // useEffect(() => {
  //   console.log("selected shop isuser , ", selectedShop);
  // }, [userData]);

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    address: Yup.string().required("Address is required"),
    gstNumber: Yup.string().matches(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/,
      "Invalid GSTIN format. Example: 23AAMCA6167B1ZW"
    ),
    mobile: Yup.string()
      .required("Phone is required")
      .matches(/^\d{10}$/, "Phone must be 10 digits"),
  });

  console.log("user isss ", User);

  const fetchUserData = async (phoneNumber, setFieldValue) => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = setTimeout(async () => {
      try {
        if (/^\d{10}$/.test(phoneNumber)) {
          setLoading(true);
          try {
            const api = `users/getUserByMobile/${phoneNumber}`;
            const headers = {
              Authorization: `Bearer ${userData?.token}`,
            };
            const response = await readApi(api, headers);
            if (response) {
                            console.log("response of search ", response);

              setUser(response);
              setFieldValue("name", response?.name);
              setFieldValue("address", response?.address);
              setFieldValue("mobile", phoneNumber);
            } else {
              setFieldValue("name", response?.name);
              setFieldValue("address", response?.address);
              setFieldValue("mobile", phoneNumber);
            }
          } catch (error) {
            setFieldValue("name", "");
            setFieldValue("address", "");

            setFieldValue("mobile", phoneNumber);
            console.error("Error fetching User data:", error);
          } finally {
            setLoading(false);
          }
        } else {
          setFieldValue("name", "");
          setFieldValue("address", "");
          setFieldValue("mobile", phoneNumber);
        }
      } catch (error) {
        console.error("Error fetching HSN code data:", error);
      }
    }, 300);
  };

  function handleConfirm() {
    setShowModal(false); // close the modal
    if (pendingActionRef.current) {
      navigation.dispatch(pendingActionRef.current); // finally go back
    }
    dispatch(clearCart());
  }

  function handleCancel() {
    setShowModal(false); // just hide the modal
  }

  useEffect(() => {
    //console.log("changed cart is , ", carts);
    console.log("changed cart is , ", selectedButton);
  }, [carts, selectedButton]);

  useEffect(() => {
    const beforeRemoveListener = navigation.addListener("beforeRemove", (e) => {
      const hasFilledForm =
        carts.length > 0 ||
        User?.name ||
        User?.address ||
        User?.gstNumber ||
        User?.mobile ||
        formFilled;
      // formik.values.name ||
      // formik.values.address ||
      // formik.values.phone;

      if (hasFilledForm && !submit.current) {
        e.preventDefault();
        pendingActionRef.current = e.data.action;
        setShowModal(true);
      } else {
        dispatch(clearCart());
      }
    });

    return () => beforeRemoveListener();
  }, [navigation, carts.length, formFilled]);

  const getStatusFk = () => {
    if (PaymentStatus == "Unpaid") {
      return 1;
    } else if (PaymentStatus == "Paid") {
      return 2;
    } else {
      return 3;
    }
  };

  // ---- utils/transformCart.js (or inside the component) ----
  const mapCartToInvoiceProducts = (carts) =>
    carts.map(({ id, quantity, sellPrice, name, taxRate }) => ({
      id: id, // rename id -> productId (adjust to API)
      quantity,
      price: Number(sellPrice), // be sure it's a real number
      productname: String(name), // keep if the API wants it
      taxRate: Number(taxRate),
    }));

  // --- fixed handleGenerate (single version) ---
  const handleGenerate = async (button = "download", formData, resetForm) => {
    try {
      const api = "invoice/invoices";
      const invoiceType =
        selectedButton === "gst"
          ? "gst"
          : selectedButton === "Quatation"
          ? "quotation"
          : "provisional";
      // add/override only what you really need
      const payload = { ...formData, type: invoiceType };
      console.log("payload in handleGenrate ", payload);
      // payload.vendorfk = undefined; 
      const cleanedPayload = Object.fromEntries(
        Object.entries(payload).filter(
          ([_, v]) => v !== null && v !== undefined
        )
      );
      console.log("Final Payload:", JSON.stringify(cleanedPayload, null, 2));
      const response = await createApi(api, cleanedPayload, {
        Authorization: `Bearer ${userData?.token}`,
        "Content-Type": "application/json", // optional but safe
      });
      if(response){
        showSnackbar("Invoice created successfully", "success");
      dispatch(clearCart());
      resetForm();
      setDiscountValue(0);
      setDiscountRate(0);
      setFinalTotal(0);
      setFinalAmountValue(0);
      } 
      if (button === "download") return response;
      navigation.pop(2);
    } catch (err) {
      console.log(
        "create invoice error →",
        err?.response?.data || err.message || err
      );
      // showSnackbar(
      //   "Server rejected the invoice – check required fields",
      //   "error"
      // );
         showSnackbar(
       err?.data?.message || "Failed to create invoice",
        "error"
      );
       return false;
    }
  };

  return (
    <ScrollView
      scrollEnabled={!isHorizontalScrolling}
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled={true}
      contentContainerStyle={{ paddingBottom: 20,backgroundColor:colors?.background }}
    >
      <Formik
        enableReinitialize={true}
        initialValues={{
          name: "",
          address: "",
          gstNumber: "",
          mobile: "",
        }}
        validateOnChange={true}
        // validateOnChange={false}   // ✅ disables noise on typing
        validateOnBlur={true} //
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          console.log("values are , ", values);
          console.log("selected cartvalue is , ", cartsValue);
          if (!finalAmountValue && selectedButton !== "Quatation") {
            // showSnackbar("Final Amount cannot be 0", "error");
            setFinalAmountValue(finalTotal)
          }

          const DataCustomer = {
            name: values?.name,
            address: values?.address,
            gstNumber: User?.gstNumber || values?.gstNumber || null,
            mobile: User?.getNumber || values?.mobile,
            userId: User?.id || undefined,
          };
          // const finalTotal = (parseInt(cartsValue?.totalPrice) || 0) - (parseInt(cartsValue?.discount) || 0);

          const extraData = {
            usersfk: User?.id,
            vendorfk: selectedShop?.vendor?.id,
            statusfk: selectedButton === "Quatation" ?4:
             getStatusFk(),
            subtotal: cartsValue?.totalPrice,
            // address: "123 Main Street, City, Country",
            discount: selectedButton === "Quatation" ? 0 : discountValue,
            finaltotal:selectedButton === "Quatation" ? cartsValue?.totalPrice: parseFloat(finalTotal),
            paymentMode: selectedPaymentMode||"Cash",
            ...(PaymentStatus == "Unpaid" || PaymentStatus == "Partially Paid"
              ? { remainingamount: cartsValue?.afterdiscount }
              : { remainingamount: 0 }),
            // ...(selectedButton == "provisional" ? {provisionNumber: "12"} : {}),
          };

          // carts?.map((item) => {
          //   console.log("single item is , ", item);
          // });
          const payload = {
            ...extraData,
            ...DataCustomer,
            // serviceProviderData: selectedShop,
            discountRates: discountRate,
            // products: carts,
            products: mapCartToInvoiceProducts(carts),
          };
          console.log("Form Submitted Data:", payload?.DataCustomer);
          console.log("Form Submitted Data:123", payload);
          submit.current = true;
          const customerResponse = await handleGenerate(
            "download",
            payload,
            resetForm
          );
          console.log("customerResponse is , ", customerResponse);
          if (customerResponse) {
            navigation.navigate("PDFScreen", {
              viewInvoiceData: customerResponse,
              selectedButton: selectedButton,
              resetForm: resetForm,
              // viewInvoiceData:payload
            });
            resetForm();
            setFinalAmountValue(0);
            setFinalTotal(0);
            setDiscountRate(0);
            setDiscountValue(0);
            submit.current = false;
          }
        
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
          isValid,
          dirty,
        }) => {
          console.log("DATA VALID", isValid);
          console.log("DATA Dirty", dirty);
          // console.log("cart is , ", carts.length);
          console.log("error is , ", error);
          return (
            <View>
              {/* Phone Field */}
              <NameTextInput
              values={values}handleChange={handleChange} handleBlur={handleBlur} touched={touched} errors={errors} setFieldValue={setFieldValue} setFormFilled={setFormFilled}   setUser={setUser}
              />


              {/* <TextInput
                label="Name"
                mode="flat"
                style={styles.input}
                maxLength={50}
               onChangeText={(text) => {
  // Allow only alphabets (A–Z, a–z) and spaces
  let filteredText = text.replace(/[^A-Za-z\s]/g, "");

  // Capitalize the first letter, keep the rest as is
  if (filteredText.length > 0) {
    filteredText = filteredText.charAt(0).toUpperCase() + filteredText.slice(1);
  }

  if (filteredText.trim()) setFormFilled(true);

  handleChange("name")(filteredText); // pass to Formik
}}
                onBlur={handleBlur("name")}
                value={values.name}
                editable={!loading}
                right={
                  loading ? (
                    <ActivityIndicator
                      size="small"
                      color="#0000ff"
                      style={{ marginBottom: -22, alignSelf: "center" }}
                    />
                  ) : values.name ? (
                    <TextInput.Icon
                      icon="close"
                      size={20}
                      style={{ marginBottom: -22 }}
                      onPress={() => setFieldValue("name", "")} // Clears the input when close icon is pressed
                    />
                  ) : null
                }
              />
              {touched.name && errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )} */}

              {loading && (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color="#0000ff" />
                </View>
              )}

              <TextInput
  label="Phone"
  mode="flat"
  keyboardType="phone-pad"
  maxLength={10}
  style={styles.input}
  onChangeText={async (phoneNumber) => {
    const numericText = phoneNumber.replace(/[^0-9]/g, "");
    setFieldValue("mobile", numericText);
    await fetchUserData(numericText, setFieldValue);
  }}
  onBlur={handleBlur("mobile")}   // ✅ Fixed
  value={values.mobile}
  right={
    values.mobile ? (
      <TextInput.Icon
        icon="close"
        size={20}
        style={{ marginBottom: -22 }}
        onPress={() => setFieldValue("mobile", "")}
      />
    ) : null
  }
/>
{touched.mobile && errors.mobile && (
  <Text style={styles.errorText}>{errors.mobile}</Text>
)}
              {/* Name Field */}
              {loading && (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color="#0000ff" />
                </View>
              )}
              
              {/* Address Field */}
              <TextInput
                label="Address"
                mode="flat"
                style={styles.input}
                maxLength={150}
                onChangeText={(text) => {
                   const filteredText = text.replace(/[^A-Za-z0-9,\s]/g, "");
                  if (filteredText.trim()) setFormFilled(true);
                  handleChange("address")(filteredText);
                }}
                onBlur={handleBlur("address")}
                value={values.address}
                editable={!loading}
                right={
                  loading ? (
                    <ActivityIndicator
                      size="small"
                      color="#0000ff"
                      style={{ marginBottom: -22 }}
                    />
                  ) : values.address ? (
                    <TextInput.Icon
                      icon="close"
                      size={20}
                      style={{ marginBottom: -22 }}
                      onPress={() => setFieldValue("address", "")} // Clears the input when close icon is pressed
                    />
                  ) : null
                }
              />
              {touched.address && errors.address && (
                <Text style={styles.errorText}>{errors.address}</Text>
              )}

              {/* GST Number Field */}
              {selectedButton == "gst" && (
                <>
                  <TextInput
                    maxLength={15}
  label="GST Number"
  mode="flat"
  style={styles.input}
  onChangeText={(text) => {
    // Remove all spaces
    const filteredText = text.replace(/[^A-Za-z0-9,\s]/g, "");

    handleChange("gstNumber")(filteredText);
  }}
  onBlur={handleBlur("gstNumber")}
  value={values.gstNumber}
  right={
    values.gstNumber ? (
      <TextInput.Icon
        icon="close"
        size={20}
        style={{ marginBottom: -22 }}
        onPress={() => setFieldValue("gstNumber", "")} // Clears the input when close icon is pressed
      />
    ) : null
  }
/>

                  {touched.gstNumber && errors.gstNumber && (
                    <Text style={styles.errorText}>{errors.gstNumber}</Text>
                  )}
                </>
              )}

              {/* Add Items Button */}
              <View style={styles.buttonView}>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => navigation.navigate("AllItemProduct")}
                >
                  <MaterialIcons name="add" size={20} color="white" />
                  <Text style={styles.addButtonText}>Add Items</Text>
                </TouchableOpacity>
              </View>

              {/* Item Data Table */}
              {carts.length > 0 && (
                <View style={{ marginTop: 10 }}>
                  <ItemDataTable
                    selectedButton={selectedButton}
                    finalAmountValue={finalAmountValue}
                    setFinalAmountValue={setFinalAmountValue}
                    carts={carts}
                    discountValue={discountValue}
                    setDiscountRate={setDiscountRate}
                    setDiscountValue={setDiscountValue}
                    discountRate={discountRate}
                    finalTotal={finalTotal}
                    setFinalTotal={setFinalTotal}
                    onHorizontalScrollStart={() =>
                      setIsHorizontalScrolling(true)
                    }
                    onHorizontalScrollEnd={() =>
                      setIsHorizontalScrolling(false)
                    }
                  />

                  <PriceDetails
                    setPaymentStatus={setPaymentStatus}
                    finalTotal={finalTotal}
                    selectedButton={selectedButton}
                    discountValue={discountValue}
                    setDiscountValue={setDiscountValue}
                    finalAmountValue={finalAmountValue}
                    finalAmountError={finalAmountError}
                    setFinalAmountAError={setFinalAmountAError}
                    setFinalAmountValue={setFinalAmountValue}
                    setSelectedPaymentMode={setSelectedPaymentMode}
                    selectedPaymentMode={setSelectedPaymentMode}
                  />
                </View>
              )}

              {/* Submit Button */}
              <TouchableOpacity
 disabled={!!finalAmountError || (carts?.length === 0)}      
           style={[
                  styles.submitButton,
                  {
                    opacity: carts?.length > 0 ? 1 : 0.5,
                    backgroundColor:
                      carts?.length <= 0 ? "rgba(0, 0, 6, 0.5)" : "#007bff",
                  },
                ]}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      </Formik>

      {showModal && (
        <ConfirmModal
          visible={showModal}
          setVisible={handleCancel}
          handlePress={handleConfirm}
          message="If you go back, all of your Filled Form Data will be lost. Are you sure you want to go back?"
          heading="Warning"
          buttonTitle="Go Back"
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  buttonView: {
    alignItems: "flex-end",
    marginTop: 10,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    backgroundColor: ButtonColor.SubmitBtn,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  addButtonText: {
    marginLeft: 2,
    // fontSize: 16,
    fontWeight: "bold",
    // color: "black",
    fontFamily: "Poppins-Medium",
    fontSize: fontSize.labelLarge,
    color: "#fff",
  },
  input: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    height: 45,
    marginTop: 10,
    fontFamily: "Poppins-Medium",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    marginTop: 20,
    // backgroundColor: ButtonColor.SubmitBtn,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    // fontWeight: "bold",
    // fontSize: 16,
    fontFamily: "Poppins-Regular",
    fontSize: fontSize.labelLarge,
  },
});

export default CreateInvoiceForm;
