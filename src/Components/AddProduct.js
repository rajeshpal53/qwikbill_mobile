import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { RadioButton, Text, TextInput } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import { createApi, readApi } from "../Util/UtilApi";
import CategoryDropDown from "../UI/DropDown/CategoryDropdown";
import { ShopContext } from "../Store/ShopContext";

const AddProduct = ({ navigation }) => {
  // const [options, setOptions] = useState([]);
  // const [showOptions, setShowOptions] = useState(false);
  // const [showHsnOptions, setShowHsnOptions] = useState(false);
  const [HSNCode, SetHSNCode] = useState();
  const {selectedShop} = useContext(ShopContext);

  console.log("DATA OF HSNCODE IS ", HSNCode);

  const validationSchema = Yup.object().shape({
    ProductCategory: Yup.string().required("Product category is required"),
    ProductName: Yup.string().required("Product name is required"),
    SellingPrice: Yup.number()
      .required("Selling price is required")
      .typeError("Selling price must be a number"),
    TaxRate: Yup.number().typeError("Tax value must be a number"),
    PurchasePrice: Yup.number()
      .required("Purchase price is required")
      .typeError("Purchase price must be a number"),
    IsStockData: Yup.boolean().nullable().required("Stock status is required"),
  });

  const HandleHsnCode = async (hsncode, setFieldValue) => {
    console.log("Value of HSN code is -----------",hsncode)
    try {
      const api = `qapi/hsn-codes`;
      const response = await readApi(api);
      if (response) {
        const matchedHsnCode = response.find((item) => item?.code === hsncode);
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
  };

  return (
    <ScrollView contentContainerStyle={{}}>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ProductCategory: "",
          ProductName: "",
          PurchasePrice: "",
          SellingPrice: "",
          TaxRate: "",
          HSNCode: "",
          IsStockData: null,
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          const ProductData = {
            productcategoryfk: values?.ProductCategory,
            name: values?.ProductName,
            costPrice: values?.PurchasePrice,
            sellPrice: values?.SellingPrice,
            taxRate: values?.TaxRate,
            // hsncodefk: HSNCode?.id,
            isStock: values?.IsStockData,
            vendorfk: selectedShop.id,
            hsncode: parseInt(values.HSNCode),

          };
          console.log("Data is 15863", ProductData);
          try {
            await createApi(`qapi/products/`, ProductData);
            resetForm();
            navigation.goBack();
          } catch (error) {
            console.log("Unable to Upload data ", error);
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
            <CategoryDropDown
              selectedCat={values.ProductCategory}
              setSelectedCat={(categoryId) =>
                setFieldValue("ProductCategory", categoryId)
              }
            />
            {touched.ProductCategory && errors.ProductCategory && (
              <Text style={styles.errorText}>{errors.ProductCategory}</Text>
            )}

            {/* Product Name */}
            <TextInput
              label="Product Name"
              mode="outlined"
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
              mode="outlined"
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
              mode="outlined"
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
              mode="outlined"
              style={styles.input}
              onChangeText={handleChange("HSNCode")}
              onBlur={() => HandleHsnCode(values?.HSNCode, setFieldValue)}
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
              mode="outlined"
              style={styles.input}
              onChangeText={handleChange("TaxRate")}
              value={values.TaxRate || ""}
              error={touched.taxValue && !!errors.taxValue}
            />

            {/* Stock Status (Radio Button) */}
            <View style={styles.radioGroup}>
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
            </View>

            {/* Suggestions for HSN Code
            {showHsnOptions && (
              <View style={styles.suggestionsContainer}>
                <ScrollView style={styles.suggestionsList}>
                  {options.map((option, index) => (
                    <React.Fragment key={index}>
                      <TouchableOpacity
                        style={styles.suggestionItem}
                        onPress={() => {
                          handleChange("HSNCode")(option.taxName);
                          handleChange("taxValue")(option.taxValue.toString());
                          setShowHsnOptions(false);
                        }}
                      >
                        <Text>{option.taxName}</Text>
                      </TouchableOpacity>
                    </React.Fragment>
                  ))}
                </ScrollView>
              </View>
            )} */}

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
