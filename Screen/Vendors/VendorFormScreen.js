
import { View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import { createApi, updateApi } from "../../Util/UtilApi";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";
import CustomTextInput from "../../Components/Custom/CustomTextInput";
import { useSnackbar } from "../../Store/SnackbarContext";
import { ScrollView } from "react-native-gesture-handler";
import { ShopDetailContext } from "../../Store/ShopDetailContext";
import { useContext } from "react";


const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("name is required")
      .min(2, "name must be at least 2 characters long"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    phone: Yup.string()
      .required("Phone number is required")
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must be at most 15 digits"),
    people: Yup.string()
      .required("people is required"),
  });
  
export default function VendorFormScreen({route}) {
    const navigation = useNavigation();
    const { showSnackbar } = useSnackbar();
    const {shopDetails} = useContext(ShopDetailContext);

    console.log("shopDetails , ", shopDetails)
    const data = route?.params?.vendor;

    return (
        <View contentContainerStyle={styles.container}>
           <Formik
             initialValues={{
                name: data?.name || "",
                email: data?.email || "",
                phone: data?.phone || "",
                people: "company"
             }}
             validationSchema={validationSchema}
             onSubmit={async (values, {resetForm}) => {
                console.log("form values are ", values);

                // const vendorData = {
                //     name: values.firstName, // Map 'firstName' to 'name'
                //     email: values.email,
                //     phone: values.phone,
                //     people: values.people,
                //   };

                if(data){
                    console.log("data is present")
                    try {
                        headers = {
                          "Content-Type": "application/json",
                        };
                        const response = await updateApi(
                          `api/company/update/${data._id}`,
                          values,
                          headers
                        );
            
                        console.log("response is , ", response)
                        showSnackbar("vendor updated successfully", "success");
                        navigation.navigate("ViewVendor")
                      } catch (error) {
                        console.log("error is ", error);
                        showSnackbar("error to create new vedor", "error");
                      }
                }else{
                    console.log("data is not present")
                    try {
                      headers = {
                        "Content-Type": "application/json",
                      };
                      const response = await createApi(
                        "api/company/create",
                        values,
                        headers
                      );
          
                      console.log("response is , ", response)
                      showSnackbar("vendor created successfully", "success");
                      resetForm();
                    } catch (error) {
                      console.log("error is ", error);
                      showSnackbar("error to create new product", "error");
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
        }) =>(
            <ScrollView>
                <View>
              <Text variant="headlineSmall" style={{ textAlign: "center" }}>
                {(data) ? "Update Vendor Details" : "Create New Vendor"}
              </Text>
            </View>
            <View style={styles.form}>
             <View style={styles.vendorDetails}>
                <CustomTextInput
                  label="First Name"
                  value={values.name}
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  error={errors.name}
                  touched={touched.name}
                />
                <CustomTextInput
                  label="Phone"
                  value={values.phone}
                  onChangeText={handleChange("phone")}
                  onBlur={handleBlur("phone")}
                  error={errors.phone}
                  touched={touched.phone}
                  keyboardType="numeric"
                />
                <CustomTextInput
                  label="Email ID"
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  error={errors.email}
                  touched={touched.email}
                  keyboardType="email-address"
                />
                <CustomTextInput
                  label="Type"
                  value={values.people}
                  onChangeText={handleChange("people")}
                  onBlur={handleBlur("people")}
                  error={errors.people}
                  touched={touched.people}
                />
             </View>
             <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.button}
              >
                {(data) ? "Update Vendor" : "Create Vendor"}
              </Button>
            </View>
            </ScrollView>
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
    form: {
      backgroundColor: "#fff",
      padding: 20,
      borderRadius: 10,
      elevation: 5, // For shadow on Android
      shadowColor: "#000", // For shadow on iOS
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      margin: 10,
    },
    button: {
      marginTop: 10,
    },
    vendorDetails: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
  
  });
  