import { Directions } from "react-native-gesture-handler";
import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import {
  TextInput,
  Button,
  HelperText,
  Divider,
  Text,
  List,
} from "react-native-paper";
import { Formik, FieldArray } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { v4 as uuidv4 } from 'uuid';
const fetchOptions = async (input) => {
  const response = await fetch(
    `http://192.168.1.2:8888/api/people/search?fields=phone&q=${input}&page=1&items=10`,
    {
      credentials: "include",
    }
  );
  const data = await response.json();
  return data.result; // Adjust according to your API response
};
const fetchItemOptions = async (input) => {
  const response = await fetch(
    `http://192.168.1.2:8888/api/product/search?fields=name&q=${input}&page=1&items=10`,
    {
      credentials: "include",
    }
  );
  const data = await response.json();

  return data.result; // Adjust according to your API response
};
// Validation Schema using Yup
const validationSchema = Yup.object().shape({
  client: Yup.string()
    .required("client is required")
    .min(2, "client must be at least 2 characters long"),
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
const AddInvoice = ({ initialValues, navigation }) => {
  const [options, setOptions] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [showItemOptions, setShowItemOptions] = useState(false);
  const [fetchData,setFetchData]= useState([])
  return (
    <View contentContainerStyle={styles.container}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          console.log(fetchData,"\tfetchdata")
          const postData = {
            ...values,
            _id: uuidv4(),
            client: "666130c9a9c613f884628d76",
            people:fetchData._id,
            number: parseInt(values.phone),
            taxRate: 0,
            currency: "USD",
            status: "draft",
            year: getYear(values.date),
            expiredDate: getNextMonthDate(values.date),
          };
          delete postData.phone;
          console.log(postData, "------postdata");
          try{
          const response = await fetch(
            "http://192.168.1.2:8888/api/invoice/create",
            {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(postData),
            }
          );
            console.log(response, "ddddddddddddddddddddddd");
           
            resetForm();
        }
            catch(error){
            console.error("Failed to add invoice", response);
            }
            finally{
              navigation.navigate("Invoice");
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
          <View style={styles.form}>
            <View style={styles.customerDetail}>
              <View style={{ width: "100%", marginBottom: 10 }}>
                <TextInput
                  label="client Name"
                  mode="outlined"
                  onChangeText={handleChange("client")}
                  onBlur={handleBlur("client")}
                  value={values.client}
                  error={touched.client && errors.client ? true : false}
                  style={{ width: "100%", marginBottom: 10 }}
                />
                {touched.client && errors.client && (
                  <HelperText
                    type="error"
                    visible={touched.client && errors.client}
                  >
                    {errors.client}
                  </HelperText>
                )}
              </View>
              <View
                style={{
                  width: "45%",
                  marginVertical: 10,
                  marginHorizontal: 2,
                  marginBottom: 10,
                  position:'relative'

                }}
              >
                <TextInput
                  label="Phone"
                  mode="outlined"
                  keyboardType="phone-pad"
                  onChangeText={async (text) => {
                    handleChange("phone")(text);
                    if (text.length > 1) {
                      const fetchedOptions = await fetchOptions(text);
                      setOptions(fetchedOptions);
                      setShowOptions(true);
                    } else {
                      setShowOptions(false);
                    }
                  }}
                  onBlur={handleBlur("phone")}
                  value={values.phone}
                  error={touched.phone && errors.phone ? true : false}
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
                {showOptions && (
                  <View style={styles.suggestionsContainer}>
                  <ScrollView nestedScrollEnabled={true}  style={styles.suggestionsList} >
                    {options.map((option) => (
                        <List.Item
                          key={option._id}
                          title={option.phone}
                          onPress={async () => {
                            setFieldValue(
                              "client",
                              option.firstname + option.lastname
                            );
                            setFieldValue("phone", option.phone);
                            setFetchData(option)
                            setShowOptions(false);
                          }}/>
                          
                    ))}
                  </ScrollView>
                  </View>
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
                <TextInput
                  label="date"
                  // style={{
                  //   width: "45%",
                  //   marginVertical: 10,
                  //   marginHorizontal: 2,
                  //   marginBottom: 10,
                  // }}
                  mode="outlined"
                  onChangeText={handleChange("date")}
                  onBlur={handleBlur("date")}
                  value={values.date}
                  error={touched.date && errors.date ? true : false}
                />
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
            <Divider style={{ marginVertical: 10 }} />

            <FieldArray name="items">
              {({ insert, remove, push }) => (
                <View >
                  <Text variant="titleMedium">add new Items</Text>
                  {values.items.map((item, index) => {
                    return (
                      <View key={index} style={styles.itemContainer}>
                        <View style={{position:'relative'}}>
                        <TextInput
                          label={`Item ${index + 1} Name`}
                          mode="outlined"
                          onChangeText={async (text) => {
                            handleChange(`items[${index}].itemName`)(text);
                            if (text.length > 1) {
                              const fetchedOptions = await fetchItemOptions(
                                text
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
                          <View  style={styles.suggestionsContainer} >
                          <ScrollView nestedScrollEnabled={true}  style={styles.suggestionsList}>
                            {options.map((option) => (
                              <List.Item
                                key={option._id}
                                title={option.name}
                                onPress={async () => {
                                  setFieldValue(
                                    `items[${index}].itemName`,
                                    option.name
                                  );
                                  setFieldValue(
                                    `items[${index}].price`,
                                    option.price
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
                          mode="outlined"
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
                          mode="outlined"
                          keyboardType="numeric"
                          onChangeText={async (text) => {
                            handleChange(`items[${index}].quantity`)(text);
                            text > 0
                              ? setFieldValue(
                                  `items[${index}].total`,
                                  parseFloat(
                                    values.items[index].price *
                                      values.items[index].quantity
                                  )
                                )
                              : 0;
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
                          mode="outlined"
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
                </View>
              )}
            </FieldArray>

            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.button}
            >
              Submit
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
    position:'relative'
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 55, // Adjust based on your input height and margin
    width: '100%',
    maxHeight: 200, // Adjust height as needed
    zIndex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
  },
  suggestionsList: {
    width: '100%',
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
    overflow:"hidden"
  },
  button: {
    marginTop: 10,
  },
  itemContainer: {
    marginBottom: 10,
  },
  customerDetail: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});

export default AddInvoice;
