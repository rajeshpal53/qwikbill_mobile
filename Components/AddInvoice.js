import { Directions } from "react-native-gesture-handler";
import React, { useState, useId, useContext } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import {
  TextInput,
  Button,
  HelperText,
  Divider,
  Text,
  List,
} from "react-native-paper";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Formik, FieldArray } from "formik";
import * as Yup from "yup";
import { readApi } from "../Util/UtilApi";
import { useNavigation } from "@react-navigation/native";

const fetchOptions = async (input, shopDetails) => {
  const headers = {
    "Content-Type": "application/json",
  };
  const response = await readApi(
    `api/people/search?shop=${shopDetails}&fields=name&q=${input}&page=1&items=10`,
    headers
  );
  const data = await response;
  return data.result; // Adjust according to your API response
};
const fetchItemOptions = async (input, shopDetails) => {
  const headers = {
    "Content-Type": "application/json",
  };
  const response = await readApi(
    `api/product/search?shop=${shopDetails}&fields=name&q=${input}&page=1&items=10`,
    headers
  );
  const data = await response;

  return data.result; // Adjust according to your API response
};
// Validation Schema using Yup
const validationSchema = Yup.object().shape({
  client: Yup.string()
    .required("client is required")
    .min(2, "client must be at least 2 characters long"),
  address: Yup.string().required("Address is required"),
  date: Yup.string()
    .required("date is required")
    .min(2, "date must be at least 2 characters long"),
  phone: Yup.string()
    .required("Phone number is required")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits"),
  items: Yup.array()
    .of(
      Yup.object().shape({
        itemName: Yup.string()
          .required("Item name is required")
          .min(2, "Item name must be at least 2 characters long"),
        price: Yup.number()
          .required("Price is required")
          .positive("Price must be a positive number")
          .typeError("Price must be a number"),
        quantity: Yup.number()
          .required("Price is required")
          .positive("Price must be a positive number")
          .typeError("Price must be a number"),
      })
    )
    .required("Must have items")
    .min(1, "Minimum of 1 item"),
});
const AddInvoice = ({
  initialValues,
  submitHandler,
  shopDetails,
  invoiceType,
}) => {
  const [options, setOptions] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [showItemOptions, setShowItemOptions] = useState(false);
  const [fetchData, setFetchData] = useState([]);
  const navigation = useNavigation();

  const showDatePicker = (setFieldValue) => {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange: (event, selectedDate) => {
        const currentDate = selectedDate || new Date();
        const day = currentDate.getDate().toString().padStart(2, "0");
        const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
        const year = currentDate.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;
        setFieldValue("date", formattedDate);
      },
      mode: "date",
      is24Hour: true,
    });
  };

  return (
    <View contentContainerStyle={styles.container}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          // navigation.navigate("StackNavigator", {
          //   screen: "ReviewAndPay",
          //   params: { formData: values }
          // });

          if (fetchData._id) {
            const fetchDataId = fetchData._id;

            navigation.navigate("StackNavigator", {
              screen: "ReviewAndPay",
              params: {
                formData: values,
                submitHandler: submitHandler,
                fetchDataId: fetchDataId,
              },
            });

            // submitHandler(values,fetchDataId);
          } else {
            navigation.navigate("StackNavigator", {
              screen: "ReviewAndPay",
              params: {
                formData: values,
                submitHandler: submitHandler,
              },
            });
            // submitHandler(values);
          }

          resetForm();
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
          <View style={styles.form}>
            <View style={styles.customerDetail}>
              <View style={{ width: "100%", marginBottom: 10 }}>
                <TextInput
                  label="client Name"
                  mode="flat"
                  onChangeText={async (text) => {
                    handleChange("client")(text);
                    if (text.length > 1) {
                      const fetchedOptions = await fetchOptions(
                        text,
                        shopDetails._id
                      );
                      setOptions(fetchedOptions);
                      setShowOptions(true);
                    } else {
                      setShowOptions(false);
                    }
                  }}
                  onBlur={handleBlur("client")}
                  value={values.client}
                  error={touched.client && errors.client ? true : false}
                  style={{
                    width: "100%",
                    marginBottom: 10,
                    backgroundColor: "#fff",
                  }}
                />
                {touched.client && errors.client && (
                  <HelperText
                    type="error"
                    visible={touched.client && errors.client}
                  >
                    {errors.client}
                  </HelperText>
                )}
                {showOptions && (
                  <View style={styles.suggestionsContainer}>
                    <ScrollView
                      nestedScrollEnabled={true}
                      style={styles.suggestionsList}
                    >
                      {options.map((option, index) => (
                        <List.Item
                          key={index}
                          title={option.name}
                          onPress={async () => {
                            setFieldValue("client", option.name);
                            setFieldValue("gstnumber", option.gstnumber || "");
                            setFieldValue("address", option.address || "");
                            setFieldValue("phone", option.phone);
                            setFetchData(option);
                            setShowOptions(false);
                          }}
                        />
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
              <View style={{ width: "100%", marginBottom: 10 }}>
                <TextInput
                  label="Address"
                  mode="flat"
                  onChangeText={handleChange("address")}
                  onBlur={handleBlur("address")}
                  value={values.address}
                  error={touched.address && errors.address ? true : false}
                  style={{
                    width: "100%",
                    marginBottom: 10,
                    backgroundColor: "#fff",
                  }}
                />
                {touched.address && errors.address && (
                  <HelperText
                    type="error"
                    visible={touched.address && errors.address}
                  >
                    {errors.address}
                  </HelperText>
                )}
                {invoiceType === "gstInvoice" && (
                  <TextInput
                    label="GST Number"
                    mode="outlined"
                    onChangeText={handleChange("gstnumber")}
                    onBlur={handleBlur("gstnumber")}
                    value={values.gstnumber}
                    error={touched.gstnumber && errors.gstnumber ? true : false}
                    style={{ width: "100%", marginBottom: 10 }}
                  />
                )}

                {touched.gstnumber && errors.gstnumber && (
                  <HelperText
                    type="error"
                    visible={touched.gstnumber && errors.gstnumber}
                  >
                    {errors.gstnumber}
                  </HelperText>
                )}
              </View>
              <View
                style={{
                  width: "45%",
                  marginVertical: 10,
                  marginHorizontal: 2,
                  marginBottom: 10,
                  position: "relative",
                }}
              >
                <TextInput
                  label="Phone"
                  onChangeText={handleChange("phone")}
                  mode="flat"
                  keyboardType="phone-pad"
                  onBlur={handleBlur("phone")}
                  value={values.phone}
                  error={touched.phone && errors.phone ? true : false}
                  style={{ backgroundColor: "#fff" }}
                  // style={{ width: "50%", marginVertical: 10, marginBottom: 10 }}
                />

                {touched.phone && errors.phone && (
                  <HelperText
                    type="error"
                    visible={touched.phone && errors.phone}
                  >
                    {errors.phone}
                  </HelperText>
                )}
              </View>
              <View
                style={{
                  width: "45%",
                  marginVertical: 10,
                  marginHorizontal: 2,
                  marginBottom: 10,
                }}
              >
                <TouchableOpacity onPress={() => showDatePicker(setFieldValue)}>
                  <TextInput
                    label="Date"
                    style={{ backgroundColor: "#fff" }}
                    mode="flat"
                    value={values.date}
                    error={touched.date && errors.date ? true : false}
                    editable={false} // Make the TextInput non-editable
                  />
                </TouchableOpacity>
                {touched.date && errors.date && (
                  <HelperText
                    type="error"
                    visible={touched.date && errors.date}
                  >
                    {errors.date}
                  </HelperText>
                )}
              </View>
            </View>

            <FieldArray name="items">
              {({ insert, remove, push }) => (
                <View>
                  <Divider style={{ marginVertical: 10 }} />
                  <Text variant="titleMedium">add new Items</Text>
                  {values.items.map((item, index) => {
                    return (
                      <>
                        <View key={index} style={styles.itemContainer}>
                          <View style={{ position: "relative" }}>
                            <TextInput
                              label={`Item ${index + 1} Name`}
                              mode="flat"
                              onChangeText={async (text) => {
                                handleChange(`items[${index}].itemName`)(text);
                                if (text.length > 1) {
                                  const fetchedOptions = await fetchItemOptions(
                                    text,
                                    shopDetails._id
                                  );
                                  setOptions(fetchedOptions);
                                  setShowItemOptions(true);
                                } else {
                                  setShowItemOptions(false);
                                }
                              }}
                              onBlur={handleBlur(`items[${index}].itemName`)}
                              value={item.itemName}
                              error={
                                touched.items &&
                                touched.items[index] &&
                                errors.items &&
                                errors.items[index] &&
                                errors.items[index].itemName
                                  ? true
                                  : false
                              }
                              style={styles.input}
                            />
                            {touched.items &&
                              touched.items[index] &&
                              errors.items &&
                              errors.items[index] &&
                              errors.items[index].itemName && (
                                <HelperText
                                  type="error"
                                  visible={
                                    touched.items &&
                                    touched.items[index] &&
                                    errors.items &&
                                    errors.items[index] &&
                                    errors.items[index].itemName
                                  }
                                >
                                  {errors.items[index].itemName}
                                </HelperText>
                              )}

                            {showItemOptions && (
                              <View style={styles.suggestionsContainer}>
                                <ScrollView
                                  nestedScrollEnabled={true}
                                  style={styles.suggestionsList}
                                >
                                  {options.map((option, index) => (
                                    <List.Item
                                      key={index}
                                      title={option.name}
                                      onPress={async () => {
                                        setFieldValue(
                                          `items[${index}].itemName`,
                                          option.name
                                        );
                                        setFieldValue(
                                          `items[${index}].price`,
                                          option.price.toString()
                                        );
                                        setShowItemOptions(false);
                                      }}
                                    >
                                      {" "}
                                      {option.name}
                                    </List.Item>
                                  ))}
                                </ScrollView>
                              </View>
                            )}
                          </View>

                          <TextInput
                            label={`Item ${index + 1} Price`}
                            mode="flat"
                            keyboardType="numeric"
                            onChangeText={handleChange(`items[${index}].price`)}
                            onBlur={handleBlur(`items[${index}].price`)}
                            value={item.price}
                            error={
                              touched.items &&
                              touched.items[index] &&
                              errors.items &&
                              errors.items[index] &&
                              errors.items[index].price
                                ? true
                                : false
                            }
                            style={styles.input}
                          />
                          {touched.items &&
                            touched.items[index] &&
                            errors.items &&
                            errors.items[index] &&
                            errors.items[index].price && (
                              <HelperText
                                type="error"
                                visible={
                                  touched.items &&
                                  touched.items[index] &&
                                  errors.items &&
                                  errors.items[index] &&
                                  errors.items[index].price
                                }
                              >
                                {errors.items[index].price}
                              </HelperText>
                            )}
                          <TextInput
                            label={`Item ${index + 1} quantity`}
                            mode="flat"
                            keyboardType="numeric"
                            onChangeText={async (text) => {
                              handleChange(`items[${index}].quantity`)(text);
                              setFieldValue(
                                `items[${index}].total`,
                                (
                                  values.items[index].price *
                                  (text ? parseFloat(text) : 0)
                                ).toString()
                              );
                            }}
                            onBlur={handleBlur(`items[${index}].quantity`)}
                            value={item.quantity}
                            error={
                              touched.items &&
                              touched.items[index] &&
                              errors.items &&
                              errors.items[index] &&
                              errors.items[index].quantity
                                ? true
                                : false
                            }
                            style={styles.input}
                          />
                          {touched.items &&
                            touched.items[index] &&
                            errors.items &&
                            errors.items[index] &&
                            errors.items[index].quantity && (
                              <HelperText
                                type="error"
                                visible={
                                  touched.items &&
                                  touched.items[index] &&
                                  errors.items &&
                                  errors.items[index] &&
                                  errors.items[index].quantity
                                }
                              >
                                {errors.items[index].quantity}
                              </HelperText>
                            )}
                          <TextInput
                            mode="flat"
                            label="Total"
                            value={item.total}
                            editable={false}
                            style={styles.input}
                          />

                          <Button
                            mode="outlined"
                            onPress={() => remove(index)}
                            disabled={values.items.length === 1}
                            style={styles.button}
                          >
                            Remove
                          </Button>
                        </View>
                      </>
                    );
                  })}
                  <Button
                    mode=""
                    onPress={() =>
                      push({ itemName: "", price: "", quantity: "", total: "" })
                    }
                    style={{ alignSelf: "flex-start", marginTop: 10 }}
                  >
                    Add Item
                  </Button>
                  <Divider style={{ marginVertical: 10 }} />
                </View>
              )}
            </FieldArray>

            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.button}
            >
              Review and Pay
            </Button>
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
    marginVertical: 20,
    position: "relative",
  },
  suggestionsContainer: {
    position: "absolute",
    top: 55, // Adjust based on your input height and margin
    width: "100%",
    maxHeight: 200, // Adjust height as needed
    zIndex: 1,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
  },
  suggestionsList: {
    width: "100%",
  },
  form: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5, // For shadow on Android
    shadowColor: "#000", // For shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginVertical: 10,
  },
  input: {
    marginBottom: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 10,
  },
  itemContainer: {
    marginBottom: 10,
    gap:15,
    // backgroundColor:"orange"
  },
  customerDetail: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});

export default AddInvoice;
