import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { TextInput } from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Formik } from "formik";
import * as Yup from "yup";
import ItemDataTable from "../Cards/ItemDataTable";
import { useDispatch, useSelector } from "react-redux";
import { readApi } from "../../Util/UtilApi";
import { clearCart } from "../../Redux/CartProductRedux/CartSlice";


// Validation Schema using Yup
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  address: Yup.string().required("Address is required"),
  gstNumber: Yup.string().required("GST Number is required"),
  phone: Yup.string()
    .required("Phone is required")
    .matches(/^\d{10}$/, "Phone must be 10 digits"),
});

const CreateInvoiceForm = () => {
    const dispatch = useDispatch()
  const navigation = useNavigation();
  const carts = useSelector((state) => state.cart.Carts);
  const [shopData, setShopData] = useState(null); // To store the shop data response


  const handlePhoneBlur = async (phoneNumber) => {
    if (/^\d{10}$/.test(phoneNumber)) {
      try {
        const api = `/getUserByMobile/:${phoneNumber}`
        const response = await readApi(api)
        setShopData(response); // Assuming the response contains shop data
        console.log("Shop Data:", data);
      } catch (error) {
        console.error("Error fetching shop data:", error);
      }
    }
    console.log("Hit function")
  };

  return (
    <ScrollView>
      <Formik
        initialValues={{
          name: "",
          address: "",
          gstNumber: "",
          phone: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, {resetForm}) => {
          const formData = {
            ...values,
            Product: carts.map((item) => ({
              productId: item?.id,
              productName: item?.Name,
              price: item?.Price,
              totalprice: item?.totalPrice,
              quantity: item?.quantity,
            })),
          };
          console.log("Form Submitted Data:", formData);
          resetForm()
          dispatch(clearCart());


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
              onBlur={() => handlePhoneBlur(values.phone)} // Trigger API call on blur
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

            {/* Add Items Button */}
            <View style={styles.buttonView}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate("AllItemProduct")}
              >
                <MaterialIcons name="add" size={24} color="black" />
                <Text style={styles.addButtonText}>Add Items</Text>
              </TouchableOpacity>
            </View>
            {carts.length > 0 && <ItemDataTable carts={carts} />}
            {/* Item Data Table */}

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
  buttonView: {
    alignItems: "flex-end",
    marginTop: 10,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  addButtonText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  input: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    height: 45,
    marginTop: 10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default CreateInvoiceForm;
