
import { View, StyleSheet } from "react-native";
import { Text, Button,List } from "react-native-paper";
import { readApi,createApi,updateApi } from "../../Util/UtilApi";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";
import CustomTextInput from "../../Components/Custom/CustomTextInput";
import { useSnackbar } from "../../Store/SnackbarContext";
import { ScrollView } from "react-native-gesture-handler";
import { ShopDetailContext } from "../../Store/ShopDetailContext";
import { useContext,useState} from "react";
import React from "react";

const validationSchema = Yup.object().shape({
    paymentStatus: Yup.string()
      .required("paymentStatus is required"),
    invoiceNumber: Yup.string()
      .required("Invoice Number is required"),
    amount: Yup.string()
      .required("amount number is required"),
    people: Yup.string()
      .required("people is required"),
  });
  const fetchOptions = async (input,shopDetails) => {
    const headers={
      "Content-Type": "application/json",
    }
    const response = await readApi(`api/people/search?shop=${shopDetails}&fields=name&q=${input}&page=1&items=10`,headers);
    const data = await response;
    return data.result; // Adjust according to your API response
  }; 
  
export default function VendorFormScreen({route,navigation}) {
    const { showSnackbar } = useSnackbar();
    const handlePress = () => setExpanded(!expanded);
    const {shopDetails} = useContext(ShopDetailContext);
    const [options, setOptions] = useState([]);
    const [showOptions, setShowOptions] = useState(false);
    const [fetchData,setFetchData]= useState([])
    const [expanded, setExpanded] = React.useState(false);
    const [selected, setSelected] = React.useState("");
    const data = route?.params?.vendor;
    return (
        <View contentContainerStyle={styles.container}>
           <Formik
             initialValues={{
                paymentStatus: data?.paymentStatus|| "",
                invoiceNumber: data?.invoiceNumber?.toString() || "",
                amount: data?.amount?.toString() || "",
                people: data?.people?.name||""
             }}
             validationSchema={validationSchema}
             onSubmit={async (values, {resetForm}) => {


                // const vendorData = {
                //     name: values.firstName, // Map 'firstName' to 'name'
                //     email: values.email,
                //     phone: values.phone,
                //     people: values.people,
                //   };
                const postData= {
                  ...values,
                  people:data?.people._id||fetchData._id,
                  shop:shopDetails._id
                }
                if(data){
                    try {
                        headers = {
                          "Content-Type": "application/json",
                        };
                        const response = await updateApi(
                          `api/vendor/update/${data._id}`,
                          postData,
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
                    try {
                      headers = {
                        "Content-Type": "application/json",
                      };
                      const response = await createApi(
                        "api/vendor/create",
                        postData,
                        headers
                      );
          
                      console.log("response is , ", response)
                      showSnackbar("vendor created successfully", "success");
                      navigation.navigate("ViewVendor")
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
          setFieldValue,
          handleSubmit,
          values,
          errors,
          touched,
        }) =>(
            <ScrollView>
                {/* <View>
              <Text variant="headlineSmall" style={{ textAlign: "center" }}>
                {(data) ? "Update Vendor Details" : "Create New Vendor"}
              </Text>
            </View> */}
            <View style={styles.form}>
             <View style={styles.vendorDetails}>
             <CustomTextInput
                  placeholder="Name"
                  value={values.people}
                  onBlur={handleBlur("people")}
                  error={errors.people}
                  touched={touched.people}
                  onChangeText={async (text) => {
                    handleChange("people")(text);
                    if (text.length > 1) {
                      const fetchedOptions = await fetchOptions(text,shopDetails._id);
                      setOptions(fetchedOptions);
                      setShowOptions(true);
                    } else {
                      setShowOptions(false);
                    }
                  }}
                />
                 {showOptions && (
                  <View style={styles.suggestionsContainer}>
                  <ScrollView nestedScrollEnabled={true}  style={styles.suggestionsList} >
                    {options.map((option) => (
                        <List.Item
                          key={option._id}
                          title={option.name}
                          onPress={async () => {
                            setFieldValue(
                              "people",
                              option.name
                            );
                            setFetchData(option)
                            setShowOptions(false);
                          }}/>
                          
                    ))}
                  </ScrollView>
                  </View>
                )}
                <CustomTextInput
                  placeholder="amount"
                  value={values.amount}
                  onChangeText={handleChange("amount")}
                  onBlur={handleBlur("amount")}
                  error={errors.amount}
                  touched={touched.amount}
                  keyboardType="numeric"
                />
                <CustomTextInput
                  placeholder="Gst Invoice Number"
                  value={values.invoiceNumber}
                  onChangeText={handleChange("invoiceNumber")}
                  onBlur={handleBlur("invoiceNumber")}
                  error={errors.invoiceNumber}
                  touched={touched.invoiceNumber}
                  keyboardType="email-address"
                />
                 <View style={styles.modalContent}>

                  <List.Accordion
                    title={selected || "Select payamentStatus"}
                    expanded={expanded}
                    onPress={handlePress}
                    left={(props) => <List.Icon {...props} icon="account" />}
                  >
                    <List.Item
                      title="unpaid"
                      onPress={() => {
                        setSelected("unpaid");
                        setFieldValue("paymentStatus", "unpaid");
                        setExpanded(false);
                      }}
                    />
                    <List.Item
                      title="paid"
                      onPress={() => {
                        setSelected("paid");
                        setFieldValue("paymentStatus", "paid");
                        setExpanded(false);
                      }}
                    />
                  </List.Accordion>
                  </View>
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
    modalContent: {
      width: 300,
      padding: 10,
      backgroundColor: "white",
      borderRadius: 10,
    },
    vendorDetails: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
  
  });
  