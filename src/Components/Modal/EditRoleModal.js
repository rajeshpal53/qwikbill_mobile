import React, { useContext, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Platform,
  Alert,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { TextInput } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialIcons"; // Import the Icon component
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import UserDataContext from "../../Store/UserDataContext";
import { ShopContext } from "../../Store/ShopContext";
import { ButtonColor, fontSize, updateApi } from "../../Util/UtilApi";
import DropDownList from "../../UI/DropDownList";
import { Picker } from "@react-native-picker/picker";

const EditRoleModal = ({ visible, onClose, selectedRole }) => {
  const { userData } = useContext(UserDataContext);
  const { allShops, selectedShop } = useContext(ShopContext);
  const [User, setUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [AddRode, SetAddRole] = useState("");
  const pickerRef = useRef();
  const [isDisabled, setIsDisabled] = useState(true);

  console.log("DATA OF SELECTED ", selectedRole?.role?.name );
  const roleOptions = [
    { label: "Owner", value: "Owner" },
    { label: "Manager", value: "Manager" },
    { label: "Employee", value: "Employee" },
    { label: "Viewer", value: "Viewer" },
  ];

  const validationSchema = Yup.object().shape({
    userRole: Yup.string().required("User Role is required"),
    // userMobile: Yup.string()
    //   .required("Phone is required")
    //   .matches(/^\d{10}$/, "Phone must be 10 digits"),
    // userName: Yup.string().required("User Name is required"),
    // email: Yup.string()
    //   .email("Invalid email format")
    //   .required("Email is required"),
  });

  const getStatusFk = () => {
    if (AddRode == "Owner") {
      return 1;
    } else if (AddRode == "Manager") {
      return 2;
    } else if (AddRode == "Employee") {
      return 3;
    } else if (AddRode == "Viewer") {
      return 4;
    } else {
      return 5;
    }
  };

  if (loading) {
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <Formik
          initialValues={{
            userRole: selectedRole?.role?.name || "",
          }}
          validationSchema={validationSchema}
          validateOnChange={true}
          validateOnBlur={true}
          onSubmit={async (values, { resetForm }) => {
            const updatedData = {
              ...selectedRole,
              role: {
                ...selectedRole.role,
                id: getStatusFk(),
                name: AddRode,
              },
              rolesfk: getStatusFk(),
            };
            console.log(
              "Updated data with only userRole changed:",
              updatedData
            );
            try {
              setLoading(true);
              const headers = {
                Authorization: `Bearer ${userData?.token}`,
              };
              const respons = await updateApi(
                `userRoles/${selectedRole?.id}`,
                updatedData,
                headers
              );
              console.log("DATA OF RESPONSE IS ", respons);
              resetForm();
              onClose();
            } catch (error) {
              console.log("Unable to update role", error);
            } finally {
              setLoading(false);
            }
          }}
        >
          {({
            handleChange,
            handleBlur,
            values,
            errors,
            handleSubmit,
            touched,
            setFieldValue,
            // isValid,
            disabled = { isDisabled },
          }) => (
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
              <View style={styles.formContainer}>
                <View style={{ flexDirection: "row" }}>
                  <View style={{}}>
                    <MaterialIcons
                      name="local-offer"
                      size={30}
                      color="black"
                      style={{ marginTop: 2 }}
                    />
                  </View>
                  <View style={{ flex: 1, alignItems: "center" }}>
                    <Text style={styles.title}>Edit Role</Text>
                  </View>
                </View>

                {/* User Mobile Number */}
                <Text style={styles.label}>User Mobile Number</Text>
                <View style={styles.disabledInput}>
                  <Text>{selectedRole?.user?.mobile}</Text>
                </View>

                {/* User Name */}
                <Text style={styles.label}>User Name</Text>
                <View style={styles.disabledInput}>
                  <Text>{selectedRole?.user?.name}</Text>
                </View>
                {/* User Email */}
                <Text style={styles.label}>User Email</Text>
                <View style={styles.disabledInput}>
                  <Text>{selectedRole?.user?.email}</Text>
                </View>

                {/*Select Shop */}
                <Text style={styles.label}>Select Shop</Text>
                <View
                  style={{
                    backgroundColor: "#f3f3f3",
                    borderRadius: 8,
                    marginTop: 4,
                  }}
                >
                  <DropDownList
                    options={allShops}
                    onValueChange={(selectedShop) =>
                      setFieldValue("selectShop", selectedShop)
                    }
                  />
                </View>

                {/* User Role Dropdown */}
                <View style={{ marginBottom: 10 }}>
                  <Text style={styles.label}>User Role</Text>
                  <Picker
                    selectedValue={values.userRole}
                    onValueChange={(itemValue) => {
                      setFieldValue("userRole", itemValue);
                      SetAddRole(itemValue);
                    }}
                    ref={pickerRef}
                    style={{ width: "100%", height: 60 }}
                  >
                    {/* <Picker.Item
                      label={
                        selectedRole ? selectedRole.role?.name : "Select Role"
                      }
                      // enabled={false}
                    /> */}
                    {roleOptions && roleOptions.length > 0
                      ? roleOptions.map((role, index) => (
                          <Picker.Item
                            key={index}
                            label={role?.label || "Unknown Role"}
                            value={role?.value || ""}
                          />
                        ))
                      : null}
                  </Picker>
                  {touched.userRole && errors.userRole && (
                    <Text style={styles.errorText}>{errors.userRole}</Text>
                  )}
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={onClose}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.saveText}>Update</Text>
                  </TouchableOpacity>
                </View>

                {/* <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={onClose}
                    style={styles.cancelButton}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSubmit}
                    style={[
                      styles.saveButton,
                      // !isValid && styles.saveButtonDisabled,
                    ]}
                    // disabled={!isValid}
                  >
                    <Text style={styles.saveButtonText}>Update</Text>
                  </TouchableOpacity>
                </View> */}
              </View>
            </ScrollView>
          )}
        </Formik>
      </View>
    </Modal>
  );
};

export default EditRoleModal;

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1, // This ensures the content stretches and enables scrolling
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  formContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    marginBottom: 10,
    backgroundColor: "#fff",
    height: 45,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: fontSize.labelLarge,
    fontFamily: "Poppins-Regular",
  },

  dateInput: {
    // backgroundColor: "#e8f5e9",
    borderRadius: 10,
    backgroundColor: "#EDEDED", // Light green background for date button
  },
  dateLabel: {
    paddingVertical: 12,
    marginLeft: 10,
    fontFamily: "Poppins-Medium",
    fontWeight: "medium",
    fontSize: fontSize.label,
    color: "rgba(0, 0, 0, 0.5)",
  },
  errorText: {
    fontSize: 12,
    color: "red",
  },
  // buttonContainer: {
  //   flexDirection: "row",
  //   justifyContent: "flex-end",
  //   gap: 20,
  //   marginTop: 20,
  // },

  // label: {
  //   fontSize: fontSize.labelLarge,
  //   fontFamily: "Poppins-Regular",
  //   fontWeight: "bold",
  //   color: "#333",
  //   marginBottom: 8,
  // },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 10,
  },

  disabledInput: {
    backgroundColor: "#f3f3f3",
    padding: 12,
    borderRadius: 8,
    marginTop: 4,
  },

  // saveButton: {
  //   padding: 10,
  //   backgroundColor: ButtonColor.SubmitBtn,
  //   borderRadius: 8,
  //   paddingHorizontal: 30,

  //   // paddingHorizontal: 30,
  // },
  // cancelButton: {
  //   padding: 10,
  //   backgroundColor: "#d9534f",
  //   // backgroundColor: theme?.colors?.yellow,
  //   // backgroundColor: "#fcb534",
  //   borderRadius: 8,
  //   paddingHorizontal: 30,
  // },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  dateTitle: {
    paddingVertical: 2,
    // width: "45%",
  },
  dateTitleText: {
    // fontSize: 16,
    // fontWeight: "bold",
    // color: "#333",

    fontFamily: "Poppins-Medium",
    fontWeight: "medium",
    fontSize: fontSize.labelMedium,
  },
  saveButtonDisabled: {
    backgroundColor: "gray",
  },

  TextShopDes: {
    // borderWidth:2,
    // paddingVertical:10,
    marginBottom: 3,
  },
  TextShop: {
    paddingVertical: 5,
    fontSize: fontSize.labelMedium,
    fontFamily: "Poppins-Regular",
  },
  loaderContainer: {
    alignItems: "center",
    marginVertical: 20,
    // justifyContent: "flex-end",
    // alignItems: "flex-end",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: "#E5E5E5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelText: {
    fontSize: 16,
    color: "#000",
  },
  saveButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveText: {
    fontSize: 16,
    color: "#fff",
  },
});

// <TextInput
//                   mode="flat"
//                   label="Enter User Mobile Number"
//                   style={styles.input}
//                   onChangeText={async (phoneNumber) => {
//                     setFieldValue("userMobile", phoneNumber);
//                     await fetchUserData(phoneNumber, setFieldValue);
//                   }}
//                   value={values.userMobile}
//                   keyboardType="phone-pad"
//                   editable={false}
//                   //   right={
//                   //     values.userMobile ? (
//                   //       <TextInput.Icon
//                   //         icon="close"
//                   //         size={20}
//                   //         style={{ marginBottom: -22 }}
//                   //         onPress={() => setFieldValue("userMobile", "")}
//                   //       />
//                   //     ) : null
//                   //   }
//                 />
//                 {touched.userMobile && errors.userMobile && (
//                   <Text style={styles.errorText}>{errors.userMobile}</Text>
//                 )}

//                 {/* User Name */}

//                 <TextInput
//                   mode="flat"
//                   label="Enter User Name"
//                   style={styles.input}
//                   onChangeText={handleChange("userName")}
//                   onBlur={handleBlur("userName")}
//                   value={values.userName}
//                   editable={false}
//                   //   right={
//                   //     loading ? (
//                   //       <ActivityIndicator
//                   //         size={10}
//                   //         color="#000"
//                   //         style={{ marginBottom: -22 }}
//                   //       />
//                   //     ) : values.userName ? (
//                   //       <TextInput.Icon
//                   //         icon="close"
//                   //         size={20}
//                   //         style={{ marginBottom: -22 }}
//                   //         onPress={() => setFieldValue("userName", "")}
//                   //       />
//                   //     ) : null
//                   //   }
//                 />
//                 {touched.userName && errors.userName && (
//                   <Text style={styles.errorText}>{errors.userName}</Text>
//                 )}

//                 {/* Email */}
//                 <TextInput
//                   mode="flat"
//                   label="Enter User Email"
//                   style={[styles.input, { color: "#fff" }]}
//                   onChangeText={handleChange("email")}
//                   onBlur={handleBlur("email")}
//                   value={values.email}
//                   keyboardType="email-address"
//                   editable={false}
//                 />
//                 {touched.email && errors.email && (
//                   <Text style={styles.errorText}>{errors.email}</Text>
//                 )}

//                 {/* Shop Description */}
//                 <View style={{ marginBottom: 10 }}>
//                   <Text style={styles.label}>Shop Description</Text>
//                   <View style={styles.TextShopDes}>
//                     <Text style={styles.TextShop}>
//                       {selectedShop?.details ||
//                         "This is dummy data, This is a shop details. "}
//                     </Text>
//                   </View>
//                 </View>

//                 {/* Shop Dropdown */}
//                 <View style={{ marginBottom: 10 }}>
//                   <Text style={styles.label}>Select Shop</Text>
//                   <View>
//                     {isDisabled && (
//                       <DropDownList
//                         options={allShops}
//                         onValueChange={(selectedShop) =>
//                           setFieldValue("selectShop", selectedShop)
//                         }
//                         disabled={isDisabled}
//                       />
//                     )}
//                   </View>
//                 </View>
