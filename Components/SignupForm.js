import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text,Card} from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';

const SignupSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  surname: Yup.string().required('Surname is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  role: Yup.string().required('Role is required'),
});

const Signup = () => {
  const handleSignup = (values) => {
    console.log(values);
    // Handle signup logic here
  };

  return (
    <Formik
      initialValues={{
        name: '',
        surname: '',
        email: '',
        password: '',
        role: '',
      }}
      validationSchema={SignupSchema}
      onSubmit={handleSignup}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View style={styles.container}>
            <Card>        
             <TextInput
            style={styles.input}
            label="Name"
             mode="outlined"
            onChangeText={handleChange('name')}
            onBlur={handleBlur('name')}
            value={values.name}
            error={touched.name && errors.name}
          />
          {touched.name && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

          <TextInput
            style={styles.input}
            label="Surname"
             mode="outlined"
            onChangeText={handleChange('surname')}
            onBlur={handleBlur('surname')}
            value={values.surname}
            error={touched.surname && errors.surname}
          />
          {touched.surname && errors.surname && <Text style={styles.errorText}>{errors.surname}</Text>}

          <TextInput
            style={styles.input}
            label="Email"
             mode="outlined"
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
            error={touched.email && errors.email}
            keyboardType="email-address"
          />
          {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <TextInput
            style={styles.input}
            label="Password"
             mode="outlined"
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            value={values.password}
            error={touched.password && errors.password}
            secureTextEntry
          />
          {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <TextInput
            style={styles.input}
            label="Role"
            onChangeText={handleChange('role')}
            onBlur={handleBlur('role')}
            value={values.role}
            error={touched.role && errors.role}
          />
          {touched.role && errors.role && <Text style={styles.errorText}>{errors.role}</Text>}

          <Button mode="contained" onPress={handleSubmit} style={styles.button}>
            Sign Up
          </Button>
          </Card>

        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical:"30%",
    marginVertical:10,
    flex:1,
    justifyContent :"center", 
    paddingHorizontal: 16,
    elevation:12,
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
  input: {
    marginVertical: 16,
    paddingHorizontal: 8,
    borderRadius:50,
    width:'90%',
    alignSelf:"center"

  },
});


export default Signup;
