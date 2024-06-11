import React from 'react';
import { View,StyleSheet, Alert,Image } from 'react-native';
import{Text,TextInput,Button} from 'react-native-paper'
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';

const LoginScreen = () => {
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required')
  });

  const handleLogin = async (values: any ) => {
     console.log(values)
     try {
      const response = await fetch("http://localhost:8888/api/login",{
        credentials:"include",
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      const result = await response.json();
      if (result.success) {  
          console.log(result.result)
        // localStorage.setItem('user',result.result);
        // dispatch({ type: 'LOGIN', payload: users});
      } else {
        alert("Wrong Login Credentials!");
      }
    } catch (error) {
      console.error("Error fetching users data:", error);
    }
     
}
  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={handleLogin}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View style={styles.container}>
          <Image source={require('../assets/images/logo-wertone.png')} style={styles.img} />
          <Text variant='labelMedium' style={styles.wertoneTag}> wertone billing center</Text>
          <Text variant='bodyLarge'> Login</Text>
          <TextInput
          label='email'
            style={styles.input}
            autoCorrect={false}
             mode="outlined"
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}
          <TextInput
           mode="outlined"
           label='password'
            style={styles.input}
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            value={values.password}
            secureTextEntry
          />
          {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}
            <Link href='' style={styles.link}> forget password?..</Link>
          <Button onPress={handleSubmit} textColor='white' style={styles.button} >Login</Button>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,  
    paddingHorizontal: 16,
    alignItems:"center",
    elevation:12,
  },
  input: {
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius:50,
    width:'90%'

  },
  img:{
      height:100,
      width:100,
      elevation:2,
      alignSelf:"center",
      marginVertical:10,
  },
  wertoneTag:{
    color:'gray',
    alignSelf:'center',
    marginVertical:5,
  },
  link:{
      alignSelf:'flex-end',
      color:'gray',
      marginVertical:10,
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
  button:{
    backgroundColor:'#1976d2',
    width:'80%'
  }
});

export default LoginScreen;
