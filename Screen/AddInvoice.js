import React from 'react';
import { View, StyleSheet, ScrollView,  } from 'react-native';
import { TextInput, Button, HelperText,Divider,Text } from 'react-native-paper';
import { Formik, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Directions } from 'react-native-gesture-handler';

// Validation Schema using Yup
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters long'),
    date: Yup.string()
    .required('date is required')
    .min(2, 'date must be at least 2 characters long'),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]+$/, 'Phone number must be only digits')
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be at most 15 digits'),
  items: Yup.array()
    .of(
      Yup.object().shape({
        itemName: Yup.string()
          .required('Item name is required')
          .min(2, 'Item name must be at least 2 characters long'),
        price: Yup.number()
          .required('Price is required')
          .positive('Price must be a positive number')
          .typeError('Price must be a number'),
        quantity: Yup.number()
          .required('Price is required')
          .positive('Price must be a positive number')
          .typeError('Price must be a number'),
      })
    )
    .required('Must have items')
    .min(1, 'Minimum of 1 item'),
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
const AddInvoice = ({navigation}) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Formik
        initialValues={{ name: '', phone: '',date: new Date().toISOString().substring(0, 10), items: [{ itemName: '', price: '',quantity:'' }] }}
        validationSchema={validationSchema}
        onSubmit={ async (values) => {
          const postData = {
            ...values,
            number:  parseInt(values.phone),
            taxRate: 0,
            currency: "USD",
            status: "draft",
            year: getYear(values.date),
            expiredDate: getNextMonthDate(values.date),
            };
          delete postData.phone;
            const response = await fetch(
              "http://192.168.1.4:8888/api/invoice/create",
              {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(postData),
              }
            );
            if (response.ok) {
              console.log(response,"ddddddddddddddddddddddd")
              navigation.navigate("Invoice");
            }
            else{
            console.error("Failed to add invoice",);
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
          <View style={styles.form}>
          <View style={styles.customerDetail}>           
             <TextInput
              label="Name"
              mode="outlined"
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              error={touched.name && errors.name ? true : false}
              style={{ width: '100%',}}
            />
            {touched.name && errors.name && (
              <HelperText type="error" visible={touched.name && errors.name}>
                {errors.name}
              </HelperText>
            )}
             <TextInput
              label="Phone"
              mode="outlined"
              keyboardType="phone-pad"
              onChangeText={handleChange('phone')}
              onBlur={handleBlur('phone')}
              value={values.phone}
              error={touched.phone && errors.phone ? true : false}
              style={{width:'50%',marginVertical:10,}}
            />
            {touched.phone && errors.phone && (
              <HelperText type="error" visible={touched.phone && errors.phone}>
                {errors.phone}
              </HelperText>
            )}
             <TextInput
              label="date"
              style={{width:'45%',marginVertical:10, marginHorizontal:2}}
              mode="outlined"
              onChangeText={handleChange('date')}
              onBlur={handleBlur('date')}
              value={values.date}
              error={touched.date && errors.date ? true : false}
            />
            {touched.date && errors.date && (
              <HelperText type="error" visible={touched.date && errors.date}>
                {errors.date}
              </HelperText>
            )}
           
            </View>
            <Divider style={{ marginVertical:10}}/>

            <FieldArray name="items">
             
              {({ insert, remove, push }) => (
                <View>
                   <Text variant='titleMedium'>add new Items</Text>
                  {values.items.map((item, index) => (
                    <View key={index} style={styles.itemContainer}>
                      <TextInput
                        label={`Item ${index + 1} Name`}
                        mode="outlined"
                        onChangeText={handleChange(`items[${index}].itemName`)}
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
                        onChangeText={handleChange(`items[${index}].quantity`)}
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
                      <Button
                        mode="outlined"
                        onPress={() => remove(index)}
                        disabled={values.items.length === 1}
                        style={styles.button}
                      >
                        Remove
                      </Button>
                    </View>
                  ))}
                  <Button
                    mode=""
                    onPress={() => push({ itemName: '', price: '' })}
                    style={{alignSelf:'flex-start', marginTop: 10,}}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
    marginVertical:20
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5, // For shadow on Android
    shadowColor: '#000', // For shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginVertical:10
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
  itemContainer: {
    marginBottom: 10,
  },
  customerDetail:{
    flexDirection:'row',
    flexWrap:'wrap',
    justifyContent:'space-between',
  }


});

export default AddInvoice;
