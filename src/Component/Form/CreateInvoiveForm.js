import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { TextInput } from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Formik } from "formik";
import * as Yup from "yup";
import ItemDataTable from "../Cards/ItemDataTable";
import { useDispatch, useSelector } from "react-redux";
import { ButtonColor, fontSize, readApi } from "../../Util/UtilApi";
import { clearCart } from "../../Redux/slices/CartSlice";
import PriceDetails from "../PriceDetails";
import UserDataContext from "../../Store/UserDataContext";
import { ShopContext } from "../../Store/ShopContext";

const CreateInvoiceForm = ({ selectedButton }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const carts = useSelector((state) => state.cart.Carts);
  const [User, setUser] = useState(null);
  const cartsValue = useSelector((state) => state.cart);
  const [PaymentStatus, setPaymentStatus] = useState("");
  const submit = useRef(false);
  const { userData } = useContext(UserDataContext);
  const { selectedShop } = useContext(ShopContext);
  const [fetchdata, setfetchdata] = useState({ name: "", address: "" });
  const [loading, setLoading] = useState(false);

  console.log("selected shop isuser , ", User);


  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    address: Yup.string().required("Address is required"),
    gstNumber: Yup.string().matches(
      /^[A-Z]{2}[0-9]{1}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z0-9]{1}[Z]{1}[0-9]{1}$/,
      'Invalid GSTIN format'
    ),
    // gstNumber: Yup.string().when([], {
    //   is: () => selectedButton === "gst",
    //   then: (schema) => schema.required("GST Number is required"),
    //   otherwise: (schema) => schema.notRequired(),
    // }),
    phone: Yup.string()
      .required("Phone is required")
      .matches(/^\d{10}$/, "Phone must be 10 digits"),
  });

  console.log("LOADING DATA IS ", selectedButton);

  const fetchUserData = async (phoneNumber) => {
    if (/^\d{10}$/.test(phoneNumber)) {
      setLoading(true);
      try {
        const api = `users/getUserByMobile/${phoneNumber}`;
        const headers = {
          Authorization: `Bearer ${userData?.token}`, // Add token to headers
        };
        const response = await readApi(api, headers);

        if (response) {
          setUser(response);
          setfetchdata({ name: response?.name, address: response?.address });
        } else {
          setfetchdata({ name: "", address: "" });
        }
      } catch (error) {
        setfetchdata({ name: "", address: "" });
        console.error("Error fetching User data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    console.log("changed cart is , ", carts);
    console.log("changed cart is , ", selectedButton);
  }, [carts, selectedButton]);

  useEffect(() => {
    const handleBackPress = navigation.addListener("beforeRemove", (e) => {
      const hasFilledForm =
        carts.length > 0 ||
        User?.name ||
        User?.address ||
        User?.gstNumber ||
        User?.phone;

      if (hasFilledForm && !submit.current) {
        e.preventDefault();

        Alert.alert(
          "Warning!",
          "If you go back, all of your filled form data will be lost. Are you sure you want to go back?",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Yes",
              style: "destructive",
              onPress: () => {
                navigation.dispatch(e.data.action);
                dispatch(clearCart());
                return true;
              },
            },
          ]
        );
      }
    });

    return handleBackPress;
  }, [navigation, carts, User]);

  const getStatusFk = () => {
    if (PaymentStatus == "Unpaid") {
      return 1;
    } else if (PaymentStatus == "Paid") {
      return 2;
    } else {
      return 3;
    }
  };

  return (
    <ScrollView>
      <Formik
        enableReinitialize={true}
        initialValues={{
          name: fetchdata?.name || "",
          address: fetchdata?.address || "",
          gstNumber: "",
          phone: User?.mobile || "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          console.log("values are , ", values);

          const DataCustomer = {
            name: fetchdata?.name || values?.name,
            address: fetchdata?.address || values?.address,
            getNumber: User?.getNumber || values?.gstNumber,
            phone: User?.getNumber || values?.phone,
            userId: User?.id || undefined,
          };

          const extraData = {
            usersfk: User?.id,
            vendorfk: selectedShop?.id,
            statusfk: getStatusFk(),
            subtotal: cartsValue?.totalPrice,
            address: "123 Main Street, City, Country",
            discount: cartsValue?.discount,
            finaltotal: cartsValue?.afterdiscount,
            // vendorprofit: 100,
            paymentMode: "COD",
            ...(PaymentStatus == "Unpaid" || PaymentStatus == "Partially Paid"
              ? { remainingamount: cartsValue?.afterdiscount }
              : {}),

            // ...(selectedButton == "provisional" ? {provisionNumber: "12"} : {}),
          };

          carts?.map((item) => {
            console.log("single item is , ", item);
          });

          const payload = {
            ...extraData,
            customerData: DataCustomer,
            serviceProviderData: selectedShop,
            products: carts,
            // Pricedetails: [
            //   {
            //     TotalPrice: cartsValue.totalPrice,
            //     Discount: cartsValue.discount,
            //     PayAmount: cartsValue.afterdiscount,
            //     PartiallyAmount: cartsValue.PartiallyAmount,
            //     PaymentMethod: PaymentStatus,
            //   },
            // ],
          };
          console.log("Form Submitted Data:", payload?.products);
          console.log("Form Submitted Data:123", payload);
          submit.current = true;
          navigation.navigate("PDFScreen", {
            formData: payload,
            selectedButton: selectedButton,
            resetForm: resetForm,
          });
          resetForm();
          // resetForm();
          // dispatch(clearCart());
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
        }) => (
          <View>
            {/* Phone Field */}
            <TextInput
              label="Phone"
              mode="flat"
              style={styles.input}
              // onChangeText={handleChange("phone")}
              onChangeText={async (phoneNumber) => {
                setFieldValue("phone", phoneNumber);
                await fetchUserData(phoneNumber);
              }}
              // onBlur={() => handlePhoneBlur(values.phone)}
              value={values.phone}
              right={
                values.phone ? (
                  <TextInput.Icon
                    icon="close"
                    size={20}
                    style={{ marginBottom: -22 }}
                    onPress={() => setFieldValue("phone", "")}
                  />
                ) : null
              }
            />
            {touched.phone && errors.phone && (
              <Text style={styles.errorText}>{errors.phone}</Text>
            )}
            {/* Name Field */}
            {loading && (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            )}
            <TextInput
              label="Name"
              mode="flat"
              style={styles.input}
              onChangeText={handleChange("name")}
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
            )}

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
              onChangeText={handleChange("address")}
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
                  label="GST Number"
                  mode="flat"
                  style={styles.input}
                  onChangeText={handleChange("gstNumber")}
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
                <TouchableOpacity
                  style={{ alignSelf: "flex-end", marginRight: 10 }}
                  onPress={() => dispatch(clearCart())}
                >
                  <Text style={{ color: "#007BFF" }}>Clear Cart</Text>
                </TouchableOpacity>
                <ItemDataTable carts={carts} />
                <PriceDetails setPaymentStatus={setPaymentStatus} />
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              disabled={carts?.length <= 0}
              style={[
                styles.submitButton,
                { opacity: carts?.length <= 0 ? 0.5 : 1 },
              ]}
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
    backgroundColor: ButtonColor.SubmitBtn,
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
