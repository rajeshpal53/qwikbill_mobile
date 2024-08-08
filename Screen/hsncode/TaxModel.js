import React from 'react';
import { View,StyleSheet,Modal } from 'react-native';
import {  TextInput, Button, RadioButton, Text, HelperText,Portal,Provider, Card } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from '../../Store/SnackbarContext';
import { createApi } from '../../Util/UtilApi';
const validationSchema = Yup.object({
  taxName: Yup.string().required('Hsn Code is required'),
  taxValue: Yup.number()
    .required('Tax Value is required')
    .min(0, 'Value must be 0 or more'),
  enable: Yup.string().required('Enable status is required'),
});

const TaxModel = ({ visible, close }) => {
  const { showSnackbar } = useSnackbar();
  const initialValues = {
    taxName: '',
    taxValue: '',
    enable: 'enabled',
  };
  const handleSubmit = async (values) => {
    console.log('Form Data:', values);
    const postData = {
      ...values,
      isDefault: false,
    };
    try {
      const response= await createApi("api/taxes/create",postData)
        console.log('HSNCODE added successfully',response);
        showSnackbar('HSNCODE added successfully', 'success');
        
    } catch (error) {
      console.error('Failed to add HSNCODE', error);
      showSnackbar('Failed to add HSNCODE', 'error');
    }
    close();
  };

  return (
    <Provider>
      <Portal>
    <Modal visible={visible} transparent={true} animationType="slide">
      <View  style={styles.modalContainer}>     
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <Card style={ styles.card}>
            <TextInput
              label="Hsn Code"
              value={values.taxName}
              onChangeText={handleChange('taxName')}
              onBlur={handleBlur('taxName')}
              style={{ width: "100%", marginBottom: 10 }}
              error={touched.taxName && Boolean(errors.taxName)}
              mode="outlined"
            />
            {touched.taxName && errors.taxName && (
              <HelperText type="error">{errors.taxName}</HelperText>
            )}

            <TextInput
              label="Tax Value (%)"
              value={values.taxValue}
              onChangeText={handleChange('taxValue')}
              onBlur={handleBlur('taxValue')}
              keyboardType="numeric"
              error={touched.taxValue && Boolean(errors.taxValue)}
              mode="outlined"
              style={{ width: "100%", marginBottom: 0 }}
            />
            {touched.taxValue && errors.taxValue && (
              <HelperText type="error">{errors.taxValue}</HelperText>
            )}

            <Text style={{ marginTop: 20 }}>Enable</Text>
            <RadioButton.Group
              onValueChange={handleChange('enable')}
              value={values.enable}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RadioButton value="enabled" />
                <Text>Enabled</Text>
                <RadioButton value="disabled" />
                <Text>Disabled</Text>
              </View>
            </RadioButton.Group>
            
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 }}>
              <Button onPress={close} mode="outlined" style={{ marginRight: 10 }}>
                Cancel
              </Button>
              <Button onPress={handleSubmit} mode="contained">
                Add
              </Button>
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
  card:{
    width:"90%",
    paddingVertical:15,
    paddingHorizontal:10,
    marginHorizontal:10,
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
  button: {
    marginTop: 10,
  },
});

export default TaxModel;
