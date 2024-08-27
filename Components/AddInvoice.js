import { Directions } from "react-native-gesture-handler";
import React, { useState, useId, useContext, useEffect } from "react";
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
import BorderedBoxWithLabel from "./BorderedBoxWithLabel";

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
          .required("quantity is required")
          .positive("Price must be a positive number")
          .typeError("Price must be a number"),
      })
    )
    .required("Must have items")
    .min(1, "Minimum of 1 item")
    .test("unique", "Items must be unique", function (items) {
      const itemNames = items.map((item) => item.itemName);
      const duplicateIndices = itemNames.reduce((acc, itemName, index, array) => {
        if (array.indexOf(itemName) !== index) {
          acc.push(index);
        }
        return acc;
      }, []);
      
      if (duplicateIndices.length > 0) {
        // If duplicates are found, create an error for each duplicate
        return this.createError({
          path: `items[${duplicateIndices[0]}].itemName`, // Only show the error on the first duplicate found
          message: "Duplicate items found. Please ensure all items are unique.",
        });
      }
      return true;
    }),
});
const AddInvoice = ({
  item,
  initialValues,
  shopDetails,
  invoiceType,
}) => {
  const [options, setOptions] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  // const [showItemOptions, setShowItemOptions] = useState(false);
  const [showItemOptionsArray, setShowItemOptionsArray] = useState(
    Array(initialValues?.items?.length || 1).fill(false) // Initialize based on initialValues
  );
  const [fetchData, setFetchData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    console.log(showItemOptionsArray, "----showarray")
  }, [showItemOptionsArray])


  const showDatePicker = (setFieldValue) => {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange: (event, selectedDate) => {
        const currentDate = selectedDate || new Date();
        const day = currentDate.getDate().toString().padStart(2, "0");
        const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
        const year = currentDate.getFullYear();
        const formattedDate = `${year}-${month}-${day}`;
        setFieldValue("date", formattedDate);
      },
      mode: "date",
      is24Hour: true,
    });
  };

  function setItemOptionsArraytrue(index) {

    if(showOptions){
      setShowOptions(false);
    }
    
    setShowItemOptionsArray(prevArray => {
      // Create a new array with the same length as prevArray
      const newArray = new Array(prevArray.length).fill(false);
      // Set the value at the specified index to true
      newArray[index] = true;
      return newArray;
    });
}

// Function to set all elements to false
const setAllToFalse = () => {
  setShowItemOptionsArray(showItemOptionsArray.map(() => false));
};

  function setItemOptionsArrayfalse(index) {
    setShowItemOptionsArray(prevArray => {
      // Create a new array with the updated value at index 0
      const newArray = [...prevArray];
      newArray[index] = false;
      return newArray;
    });
}
  function removeOptionsArrayIndex(index) {
    setShowItemOptionsArray(prevArray => {
      // Create a new array excluding the item at the specified index
      return prevArray.filter((_, index1) => index1 !== index);
    });
}

  return (
    <Formik
      initialValues={initialValues}
      style={styles.container}
      validationSchema={validationSchema}
      validateOnChange={true}
      validateOnBlur={true}
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
              item,
              fetchDataId: fetchDataId,
            },
          });

        } else {
          navigation.navigate("StackNavigator", {
            screen: "ReviewAndPay",
            params: {
              formData: values,
              item
            },
          });
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
            <Text
              style={{ paddingTop: 10, color: "#555555" }}
              variant="bodyMedium"
            >
              Customer Details
            </Text>
            <Divider style={[styles.dividerStyle, { width: "62%" }]} />
            <View style={{ width: "100%" }}>
              <TextInput
                // outlineColor="gray"//  placeholder="client Name"
                underlineColor="gray"
                placeholder="Name"
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
                    setAllToFalse();
                  } else {
                    setShowOptions(false);
                  }
                }}
                onBlur={handleBlur("client")}
                value={values.client}
                error={touched.client && errors.client ? true : false}
                style={{
                  width: "100%",
                  // marginBottom: ,
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
                      <React.Fragment key={index}>
                      <List.Item
                        // key={index}
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
                      <Divider />
                      </React.Fragment>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
            <View style={{ width: "100%" }}>
              <TextInput
                placeholder="Address"
                underlineColor="gray"
                mode="flat"
                onChangeText={handleChange("address")}
                onBlur={handleBlur("address")}
                value={values.address}
                error={touched.address && errors.address ? true : false}
                style={{
                  width: "100%",
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
                  outlineColor="gray"
                  placeholder="GST Number"
                  mode="flat"
                  onChangeText={handleChange("gstnumber")}
                  onBlur={handleBlur("gstnumber")}
                  value={values.gstnumber}
                  error={touched.gstnumber && errors.gstnumber ? true : false}
                  style={styles.input}
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
                flexDirection: "row",
                // paddingHorizontal:10,
                width: "100%",
                gap: 20,
              }}
            >
              <View
                style={{
                  width: "50%",
                  // marginVertical: 10,
                  // marginHorizontal: 2,
                  // marginBottom: 10,
                  position: "relative",
                }}
              >
                <TextInput
                  outlineColor="gray"
                  placeholder="Phone"
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
                  width: "43.5%",
                }}
              >
                <TouchableOpacity onPress={() => showDatePicker(setFieldValue)}>
                  <TextInput
                    underlineColor="gray"
                    placeholder="Date"
                    style={{ backgroundColor: "#fff" }}
                    mode="flat"
                    value={values.date}
                    error={touched.date && errors.date ? true : false}
                    editable={false} // Make the TextInput
                    non-editable
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
          </View>

          <FieldArray name="items">
            {({ insert, remove, push }) => (
              <View style={styles.customerDetail}>
                <Text
                  style={{ paddingTop: 10, color: "#555555" }}
                  variant="bodyMedium"
                >
                  Add Items
                </Text>
                <Divider style={[styles.dividerStyle, { width: "75%" }]} />
                {values.items.map((item, index1) => {
                  return (
                    <React.Fragment key={index1}>
                      <View style={styles.itemContainer}>
                        <View style={{ position: "relative" }}>
                          <TextInput
                            
                            underlineColor="gray"
                            placeholder={`Item ${index1 + 1} Name`}
                            mode="flat"
                            onChangeText={async (text) => {
                              handleChange(`items[${index1}].itemName`)(text);
                              if (text.length > 1) {
                                const fetchedOptions = await fetchItemOptions(
                                  text,
                                  shopDetails._id
                                );
                                setOptions(fetchedOptions);
                                // setShowItemOptions(true);
                                setItemOptionsArraytrue(index1);
                              } else {
                                setItemOptionsArrayfalse(index1);
                              }
                            }}
                            onBlur={handleBlur(`items[${index1}].itemName`)}
                            value={item.itemName}
                            error={
                              touched.items &&
                              touched.items[index1] &&
                              errors.items &&
                              errors.items[index1] &&
                              errors.items[index1].itemName
                                ? true
                                : false
                            }
                            style={styles.input}
                          />
                          {touched.items &&
                            touched.items[index1] &&
                            errors.items &&
                            errors.items[index1] &&
                            errors.items[index1].itemName && (
                              <HelperText
                                type="error"
                                visible={
                                  touched.items &&
                                  touched.items[index1] &&
                                  errors.items &&
                                  errors.items[index1] &&
                                  errors.items[index1].itemName
                                }
                              >
                                {errors.items[index1].itemName}
                              </HelperText>
                            )}

                          {showItemOptionsArray[index1] && (
                            <View style={styles.suggestionsContainer}>
                              <ScrollView
                                key={index1}
                                nestedScrollEnabled={true}
                                style={styles.suggestionsList}
                              >
                                {options.map((option, index2) => (
                                  <List.Item
                                    key={index2}
                                    title={option.name}
                                    onPress={async () => {
                                      setFieldValue(
                                        `items[${index1}].itemName`,
                                        option.name
                                      );
                                      setFieldValue(
                                        `items[${index1}].price`,
                                        option.price.toString()
                                      );
                                      // setShowItemOptions(false);
                                      setItemOptionsArrayfalse(index1)
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
                          underlineColor="gray"
                          placeholder={`Item ${index1 + 1} Price`}
                          mode="flat"
                          keyboardType="numeric"
                          onChangeText={handleChange(`items[${index1}].price`)}
                          onBlur={handleBlur(`items[${index1}].price`)}
                          value={item.price}
                          error={
                            touched.items &&
                            touched.items[index1] &&
                            errors.items &&
                            errors.items[index1] &&
                            errors.items[index1].price
                              ? true
                              : false
                          }
                          style={styles.input}
                        />
                        {touched.items &&
                          touched.items[index1] &&
                          errors.items &&
                          errors.items[index1] &&
                          errors.items[index1].price && (
                            <HelperText
                              type="error"
                              visible={
                                touched.items &&
                                touched.items[index1] &&
                                errors.items &&
                                errors.items[index1] &&
                                errors.items[index1].price
                              }
                            >
                              {errors.items[index1].price}
                            </HelperText>
                          )}
                        <TextInput
                          underlineColor="gray"
                          placeholder={`Item ${index1 + 1} quantity`}
                          mode="flat"
                          keyboardType="numeric"
                          onChangeText={async (text) => {
                            handleChange(`items[${index1}].quantity`)(text);
                            setFieldValue(
                              `items[${index1}].total`,
                              (
                                values.items[index1].price *
                                (text ? parseFloat(text) : 0)
                              ).toString()
                            );
                          }}
                          onBlur={handleBlur(`items[${index1}].quantity`)}
                          value={item.quantity}
                          error={
                            touched.items &&
                            touched.items[index1] &&
                            errors.items &&
                            errors.items[index1] &&
                            errors.items[index1].quantity
                              ? true
                              : false
                          }
                          style={styles.input}
                        />
                        {touched.items &&
                          touched.items[index1] &&
                          errors.items &&
                          errors.items[index1] &&
                          errors.items[index1].quantity && (
                            <HelperText
                              type="error"
                              visible={
                                touched.items &&
                                touched.items[index1] &&
                                errors.items &&
                                errors.items[index1] &&
                                errors.items[index1].quantity
                              }
                            >
                              {errors.items[index1].quantity}
                            </HelperText>
                          )}
                        <TextInput
                          underlineColor="gray"
                          mode="flat"
                          placeholder="Total"
                          value={item.total}
                          editable={false}
                          style={styles.input}
                        />

                        <Button
                          mode="outlined"
                          onPress={() => {
                            removeOptionsArrayIndex(index1)
                            remove(index1)
                          }}
                          disabled={values.items.length === 1}
                          style={styles.button}
                        >
                          Remove
                        </Button>
                      </View>
                    </React.Fragment>
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

          <Button mode="contained" onPress={handleSubmit} style={[styles.button, {alignSelf:"center"}]}>
            Review and Pay
          </Button>
        </View>
      )}
    </Formik>
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
    borderWidth: 0.2,
    borderColor: "gray",
    // borderRadius: 4,
    elevation:2,
  },
  suggestionsList: {
    width: "100%",
    border:"none",
    // backgroundColor:"blue"
    // borderWidth:0,
  },
  form: {
    backgroundColor: "rgba(0,0,0,0)",
    // padding: 20,
    // paddingHorizontal:10,
    gap: 10,
    borderRadius: 10,
    // elevation: 5, // For shadow on Android

    // marginVertical: 10,
  },
  input: {
    // marginBottom: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 10,
    width:"50%",
    alignSelf:"flex-end"
  },
  itemContainer: {
    // marginBottom: 10,
    // gap: 10,
    // backgroundColor:"orange"
  },
  customerDetail: {
    backgroundColor: "#fff",
    // gap:10,
    paddingHorizontal: 10,
    // paddingVertical:10,
    paddingBottom: 10,
    elevation: 2,
  },

  dividerStyle: {
    marginTop: 10,
    position: "relative",
    top: -17,
    alignSelf: "flex-end",
  },

  //------------------------

  container1: {
    margin: 16,
    position: "relative",
  },
  boxLabel: {
    position: "absolute",
    top: -10,
    left: 20,
    backgroundColor: "white",
    paddingHorizontal: 5,
    fontSize: 14,
    color: "gray",
  },
  borderedBox1: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 16,
    paddingTop: 20,
  },
});

export default AddInvoice;


// {values.items.map((item, index1) => {
//   const [showItemOptionsArray, setShowItemOptionsArray] = useState(
//     Array(values.items.length).fill(false)
//   );

//   const handleShowItemOptions = (show, idx) => {
//     const updatedArray = [...showItemOptionsArray];
//     updatedArray[idx] = show;
//     setShowItemOptionsArray(updatedArray);
//   };

//   return (
//     <React.Fragment key={index}>
//       <View key={index} style={styles.itemContainer}>
//         <View style={{ position: "relative" }}>
//           <TextInput
//             underlineColor="gray"
//             placeholder={`Item ${index + 1} Name`}
//             mode="flat"
//             onChangeText={async (text) => {
//               handleChange(`items[${index}].itemName`)(text);
//               if (text.length > 1) {
//                 const fetchedOptions = await fetchItemOptions(
//                   text,
//                   shopDetails._id
//                 );
//                 setOptions(fetchedOptions);
//                 handleShowItemOptions(true, index);
//               } else {
//                 handleShowItemOptions(false, index);
//               }
//             }}
//             onBlur={handleBlur(`items[${index}].itemName`)}
//             value={item.itemName}
//             error={
//               touched.items &&
//               touched.items[index] &&
//               errors.items &&
//               errors.items[index] &&
//               errors.items[index].itemName
//                 ? true
//                 : false
//             }
//             style={styles.input}
//           />
//           {touched.items &&
//             touched.items[index] &&
//             errors.items &&
//             errors.items[index] &&
//             errors.items[index].itemName && (
//               <HelperText
//                 type="error"
//                 visible={
//                   touched.items &&
//                   touched.items[index] &&
//                   errors.items &&
//                   errors.items[index] &&
//                   errors.items[index].itemName
//                 }
//               >
//                 {errors.items[index].itemName}
//               </HelperText>
//             )}

//           {showItemOptionsArray[index] && (
//             <View style={styles.suggestionsContainer}>
//               <ScrollView
//                 nestedScrollEnabled={true}
//                 style={styles.suggestionsList}
//               >
//                 {options.map((option, optionIndex) => (
//                   <List.Item
//                     key={optionIndex}
//                     title={option.name}
//                     onPress={async () => {
//                       setFieldValue(
//                         `items[${index}].itemName`,
//                         option.name
//                       );
//                       setFieldValue(
//                         `items[${index}].price`,
//                         option.price.toString()
//                       );
//                       handleShowItemOptions(false, index);
//                     }}
//                   >
//                     {" "}
//                     {option.name}
//                   </List.Item>
//                 ))}
//               </ScrollView>
//             </View>
//           )}
//         </View>

//         <TextInput
//           underlineColor="gray"
//           placeholder={`Item ${index + 1} Price`}
//           mode="flat"
//           keyboardType="numeric"
//           onChangeText={handleChange(`items[${index}].price`)}
//           onBlur={handleBlur(`items[${index}].price`)}
//           value={item.price}
//           error={
//             touched.items &&
//             touched.items[index] &&
//             errors.items &&
//             errors.items[index] &&
//             errors.items[index].price
//               ? true
//               : false
//           }
//           style={styles.input}
//         />
//         {touched.items &&
//           touched.items[index] &&
//           errors.items &&
//           errors.items[index] &&
//           errors.items[index].price && (
//             <HelperText
//               type="error"
//               visible={
//                 touched.items &&
//                 touched.items[index] &&
//                 errors.items &&
//                 errors.items[index] &&
//                 errors.items[index].price
//               }
//             >
//               {errors.items[index].price}
//             </HelperText>
//           )}
//         <TextInput
//           underlineColor="gray"
//           placeholder={`Item ${index + 1} Quantity`}
//           mode="flat"
//           keyboardType="numeric"
//           onChangeText={async (text) => {
//             handleChange(`items[${index}].quantity`)(text);
//             setFieldValue(
//               `items[${index}].total`,
//               (
//                 values.items[index].price *
//                 (text ? parseFloat(text) : 0)
//               ).toString()
//             );
//           }}
//           onBlur={handleBlur(`items[${index}].quantity`)}
//           value={item.quantity}
//           error={
//             touched.items &&
//             touched.items[index] &&
//             errors.items &&
//             errors.items[index] &&
//             errors.items[index].quantity
//               ? true
//               : false
//           }
//           style={styles.input}
//         />
//         {touched.items &&
//           touched.items[index] &&
//           errors.items &&
//           errors.items[index] &&
//           errors.items[index].quantity && (
//             <HelperText
//               type="error"
//               visible={
//                 touched.items &&
//                 touched.items[index] &&
//                 errors.items &&
//                 errors.items[index] &&
//                 errors.items[index].quantity
//               }
//             >
//               {errors.items[index].quantity}
//             </HelperText>
//           )}
//         <TextInput
//           underlineColor="gray"
//           mode="flat"
//           placeholder="Total"
//           value={item.total}
//           editable={false}
//           style={styles.input}
//         />

//         <Button
//           mode="outlined"