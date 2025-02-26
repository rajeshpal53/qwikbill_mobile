import React, { useContext } from "react";
import { View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import {
  TextInput,
  Button,
  RadioButton,
  Text,
  HelperText,
  Portal,
  Provider,
  Card,
} from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "../../Store/SnackbarContext";
import { ButtonColor, createApi, updateApi } from "../../Util/UtilApi";
const validationSchema = Yup.object({
  taxName: Yup.string().required("Hsn Code is required"),
  taxValue: Yup.number()
    .required("Tax Value is required")
    .min(0, "Value must be 0 or more")
    .max(100, "Tax Value cannot exceed 100"),

  enable: Yup.string().required("Enable status is required"),
  productname: Yup.string().required("Product Name is required"),
});

const TaxModel = ({
  visible,
  data,
  navigation,
  setRefresh,
  setOpenTax,
  setEditData,
}) => {
  const { showSnackbar } = useSnackbar();
  const initialValues = {
    taxName: data?.code || "",
    taxValue: data?.taxrate || "",
    enable: data?.enable || "enabled",
    productname: data?.productname || "",
  };
  console.log("Modal data", data);
  const Handleclosemodal = () => {
    setOpenTax(false);
    setEditData(null);
  };

  return (
    <Provider>
      <Portal>
        <Modal visible={visible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={async (values, { resetForm }) => {
                const postData = {
                  code: values?.taxName, // assuming hsnCode is a field in the form
                  taxrate: values?.taxValue, // another example
                  productname: values?.productname, // for example, a rate or tax field
                  isDefault: false, // if this is a necessary field for your API
                };
                console.log("This is a value : ", postData);
                if (data) {
                  try {
                    const response = await updateApi(
                      `hsn-codes/${data?.id}`,
                      postData
                    );
                    console.log("response is , ", response);
                    setOpenTax(false);
                    setEditData(null);
                    showSnackbar("HSNCODE updated successfully", "success");
                    resetForm();
                  } catch (error) {
                    console.log("error is ", error);
                    showSnackbar("error to update  taxes", "error");
                  } finally {
                    setRefresh(true);
                  }
                } else {
                  try {
                    const response = await createApi(
                      "hsn-codes",
                      postData
                    );
                    console.log("create a HSN code", response);
                    setOpenTax(false);
                    setEditData(null);
                    resetForm();
                    showSnackbar("HSNCODE added successfully", "success");
                  } catch (error) {
                    console.error("Failed to add HSNCODE", error);
                    showSnackbar("Failed to add HSNCODE", "error");
                  } finally {
                    setRefresh(true);
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
              }) => (
                <Card style={styles.card}>
                  <TextInput
                    label="Hsn Code"
                    value={values.taxName}
                    onChangeText={handleChange("taxName")}
                    onBlur={handleBlur("taxName")}
                    style={{
                      width: "100%",
                      marginBottom: 10,
                      backgroundColor: "rgba(0, 0, 0, 0)",
                    }}
                    error={touched.taxName && Boolean(errors.taxName)}
                    mode="flat"
                  />
                  {touched.taxName && errors.taxName && (
                    <HelperText type="error">{errors.taxName}</HelperText>
                  )}

                  <TextInput
                    label="Tax Value (%)"
                    value={values.taxValue}
                    onChangeText={handleChange("taxValue")}
                    onBlur={handleBlur("taxValue")}
                    keyboardType="numeric"
                    error={touched.taxValue && Boolean(errors.taxValue)}
                    mode="flat"
                    style={{
                      width: "100%",
                      marginBottom: 0,
                      backgroundColor: "rgba(0, 0, 0, 0)",
                    }}
                  />
                  {touched.taxValue && errors.taxValue && (
                    <HelperText type="error">{errors.taxValue}</HelperText>
                  )}

                  <TextInput
                    label="Product Name"
                    value={values.productname}
                    onChangeText={handleChange("productname")}
                    onBlur={handleBlur("productname")}
                    error={touched.productname && Boolean(errors.productname)}
                    mode="flat"
                    style={{
                      width: "100%",
                      marginBottom: 0,
                      backgroundColor: "rgba(0, 0, 0, 0)",
                    }}
                  />
                  {touched.productname && errors.productname && (
                    <HelperText type="error">{errors.productname}</HelperText>
                  )}

                  <Text style={{ marginTop: 20 }}>Enable</Text>
                  <RadioButton.Group
                    onValueChange={handleChange("enable")}
                    value={values.enable}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <RadioButton value="enabled" />
                      <Text>Enabled</Text>
                      <RadioButton value="disabled" />
                      <Text>Disabled</Text>
                    </View>
                  </RadioButton.Group>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      marginTop: 20,
                    }}
                  >
                    <TouchableOpacity
                      onPress={Handleclosemodal}
                      style={[styles.button, styles.cancelButton]}
                    >
                      <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleSubmit}
                      style={[styles.button, styles.addButton]}
                    >
                      <Text style={styles.buttonText}>Add</Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              )}
            </Formik>
          </View>
        </Modal>
      </Portal>
    </Provider>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  card: {
    width: "90%",
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginHorizontal: 10,
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 20,
  },
  // button: {
  //   marginTop: 10,
  // },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: "#A0A0A0",
    borderColor: "#ccc",
    borderWidth: 1,
  },
  addButton: {
    backgroundColor: ButtonColor.SubmitBtn,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default TaxModel;

// const handleSubmit = async (values) => {
//   console.log("Form Data:", values);
//   const postData = {
//     ...values,
//     isDefault: false,
//   };
//   if (data) {
//     try {
//       headers = {
//         "Content-Type": "application/json",
//       };
//       const response = await updateApi(
//         `api/taxes/update/${data._id}`,
//         postData,
//         headers
//       );
//       console.log("response is , ", response);
//       showSnackbar("HSNCODE updated successfully", "success");
//       navigation.navigate("hsncode");
//       close();
//     } catch (error) {
//       console.log("error is ", error);
//       showSnackbar("error to update  taxes", "error");
//     } finally {
//       setRefresh(true);
//     }
//   } else {
//     try {
//       const response = await createApi("api/taxes/create", postData);
//       navigation.navigate("hsncode");
//       showSnackbar("HSNCODE added successfully", "success");
//     } catch (error) {
//       console.error("Failed to add HSNCODE", error);
//       showSnackbar("Failed to add HSNCODE", "error");
//     } finally {
//       setRefresh(true);
//     }
//   }
//   close();
// };
