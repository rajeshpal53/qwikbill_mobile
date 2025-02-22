import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
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
  const {selectedShop} = useContext(ShopContext);
  console.log("selected shop is , ", selectedShop)
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    address: Yup.string().required("Address is required"),
    // gstNumber: Yup.string().required("GST Number is required"),
    gstNumber: Yup.string().when([], {
      is: () => selectedButton === "gst",
      then: (schema) => schema.required("GST Number is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    phone: Yup.string()
      .required("Phone is required")
      .matches(/^\d{10}$/, "Phone must be 10 digits"),
  });

  const handlePhoneBlur = async (phoneNumber) => {
    console.log("Phone number ", phoneNumber);

    if (/^\d{10}$/.test(phoneNumber)) {
      try {
        const api = `qapi/users/getUserByMobile/${phoneNumber}`;
        const headers = {
          Authorization: `Bearer ${userData?.token}`, // Add token to headers
        };
        const response = await readApi(api, headers);
        // console.log("response of getting userbyMobile is , ", response)
        if (response) {
          setUser(response);
        }

        setUser(response);
      } catch (error) {
        console.error("Error fetching User data:", error);
      }
    }
  };

  useEffect(() => {
    console.log("changed cart is , ", carts)
  }, [carts])
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
    if(PaymentStatus == "Unpaid"){
      return 1;
    }else if(PaymentStatus == "Paid"){
      return 2;
    }else {
      return 3;
    }
  }
  return (
    <ScrollView>
      <Formik
        enableReinitialize={true}
        initialValues={{
          name: User?.name || "",
          address: User?.address || "",
          gstNumber: "",
          phone: User?.mobile || "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          console.log("values are , ", values);
          
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
            ...((PaymentStatus == "Unpaid" || PaymentStatus == "Partially Paid") ? {remainingamount: cartsValue?.afterdiscount} : {}),

            // ...(selectedButton == "provisional" ? {provisionNumber: "12"} : {}),
          };


          carts?.map((item) => {
            console.log("single item is , ", item);
          });
     
          const payload = {
            ...extraData,
            customerData: User,
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
          console.log("Form Submitted Data:", payload);
          submit.current = true;
          navigation.navigate("PDFScreen", { formData: payload });
          // resetForm();
          // dispatch(clearCart());
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
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
              onChangeText={handleChange("phone")}
              onBlur={() => handlePhoneBlur(values.phone)}
              value={values.phone}
            />
            {touched.phone && errors.phone && (
              <Text style={styles.errorText}>{errors.phone}</Text>
            )}
            {/* Name Field */}
            <TextInput
              label="Name"
              mode="flat"
              style={styles.input}
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              value={values.name}
            />
            {touched.name && errors.name && (
              <Text style={styles.errorText}>{errors.name}</Text>
            )}

            {/* Address Field */}
            <TextInput
              label="Address"
              mode="flat"
              style={styles.input}
              onChangeText={handleChange("address")}
              onBlur={handleBlur("address")}
              value={values.address}
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
              <>
                <ItemDataTable carts={carts} />
                <PriceDetails setPaymentStatus={setPaymentStatus} />
              </>
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
