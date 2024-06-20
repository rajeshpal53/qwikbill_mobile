import React,{useState} from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput, Text, HelperText,ScrollView,List } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
const fetchOptions = async (input) => {
    const response = await fetch(
      `http://192.168.1.8:8888/api/people/search?fields=phone&q=${input}&page=1&items=10`,
      {
        credentials: "include",
      }
    );
    const data = await response.json();
    return data.result; // Adjust according to your API response
  };

const validationSchema = Yup.object().shape({
  firstname: Yup.string()
    .required('First name is required'),
  lastname: Yup.string()
    .required('Last name is required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  phone: Yup.string()
    .required('Phone number is required')
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits"),
  type: Yup.string()
    .required('Type is required'),
});

const AddCustomer = ({navigation}) => {
    const [options, setOptions] = useState([]);
    const [showOptions, setShowOptions] = useState(false);
    const [typeOptions,setTypeOptions]= useState(["people",'company'])
    const [typeShowOptions,setTypeShowOptions]= useState(false)
    return(
  <Formik style={styles.container}
    initialValues={{ firstname: '', lastname: '', email: '', phone: '', type: '' }}
    validationSchema={validationSchema}
    onSubmit={async(values)=>{
            const postData={
                ...values,
                country: "USA",
        people: "6655af58afe60865000019cc",
            }
            console.log(postData)
            const url = "http://192.168.1.8:8888/api/people/create"; //put url into fetch arguments
            const response = await fetch(url, {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(postData),
            });
            if(response.ok){
                navigation.navigate('Customer')
         
            }
            else{
                    console.error("error to fetch customer",response)
            }
    }


    }
  >
    {({ handleChange, handleBlur, handleSubmit,setFieldValue, values, errors, touched }) => (
        
      <View style={styles.form}>
         <View  style={{
                   
                    marginVertical: 10,
                    marginHorizontal: 2,
                    marginBottom: 10,
                  }}>
                <TextInput
                  label="Phone"
                  
                  mode="outlined"
                  keyboardType="phone-pad"
                  onChangeText={async (text) => {
                    handleChange("phone")(text);
                    if (text.length > 2) {
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
                {showOptions &&
                  options.map((option) => (
                      <View><List.Item
                      key={option._id}
                      title={option.phone}
                      onPress={async () => {
                        setFieldValue("phone", option.phone)
                        setFieldValue("firstname", option.firstname);
                        setFieldValue("lastname", option.lastname);
                        setFieldValue("email", option.email);
                        setFieldValue('type',option.type)
                        setShowOptions(false);
                      }}
                    > {option.phone}</List.Item></View>
                  ))}
              </View>
         <View style={{ width: "100%", marginBottom: 10 }}>
                <TextInput
                  label="first Name"
                  mode="outlined"
                  onChangeText={handleChange("firstname")}
                  onBlur={handleBlur("firstname")}
                  value={values.firstname}
                  error={touched.firstname && errors.firstname ? true : false}
                  style={{ width: "100%", marginBottom: 10 }}
                />
                {touched.firstname && errors.firstname && (
                  <HelperText
                    type="error"
                    visible={touched.firstname && errors.firstname}
                  >
                    {errors.firstname}
                  </HelperText>
                )}
              </View>
              <View style={{ width: "100%", marginBottom: 10 }}>
                <TextInput
                  label="last Name"
                  mode="outlined"
                  onChangeText={handleChange("lastname")}
                  onBlur={handleBlur("lastname")}
                  value={values.lastname}
                  error={touched.lastname && errors.lastname ? true : false}
                  style={{ width: "100%", marginBottom: 10 }}
                />
                {touched.lastname && errors.lastname && (
                  <HelperText
                    type="error"
                    visible={touched.lastname && errors.lastname}
                  >
                    {errors.lastname}
                  </HelperText>
                )}
              </View>
              <View style={{ width: "100%", marginBottom: 10 }}>
                <TextInput
                  label="Email"
                  mode="outlined"
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  error={touched.email && errors.email ? true : false}
                  style={{ width: "100%", marginBottom: 10 }}
                />
                {touched.email && errors.email && (
                  <HelperText
                    type="error"
                    visible={touched.email && errors.email}
                  >
                    {errors.email}
                  </HelperText>
                )}
              </View><View style={{ width: "100%", marginBottom: 10 }}>
                <TextInput
                  label="Type"
                  mode="outlined"
                  onChangeText={async (text) => {
                    handleChange("type")(text);
                    if (text.length > 1) {
                      
                      setTypeShowOptions(true);
                    } else {
                      setTypeShowOptions(false);
                    }
                  }}
                  onBlur={handleBlur("type")}
                  value={values.type}
                  error={touched.type && errors.type ? true : false}
                  style={{ width: "100%", marginBottom: 10 }}
                />
                {touched.type && errors.type && (
                  <HelperText
                    type="error"
                    visible={touched.type && errors.type}
                  >
                    {errors.type}
                  </HelperText>
                )}
                {typeShowOptions &&
                  typeOptions.map((option,index) => (
                      <View><List.Item
                      key={index}
                      title={option}
                      onPress={async () => {
                        setFieldValue('type',option)
                        setTypeShowOptions(false);
                      }}
                    > {option}</List.Item></View>
                  ))}

              </View>
        <Button mode="contained" onPress={handleSubmit} style={styles.button}>
          Submit
        </Button>
      </View>
    )}
  </Formik>
)};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
    marginVertical: 20,
    
  },
  form: {
    backgroundColor: "#fff",
    margin:10,
    padding: 25,
    borderRadius: 10,
    elevation: 5, // For shadow on Android
    shadowColor: "#000", // For shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginVertical: 10,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
});

export default AddCustomer;
