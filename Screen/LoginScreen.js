import {React ,useState} from 'react';
import { View,StyleSheet, Alert,Image } from 'react-native';
import{Text,TextInput,Button} from 'react-native-paper'
import { Formik } from 'formik';
import * as Yup from 'yup';

 const LoginScreen = ({navigation}) => {

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required')
  });

  const handleLogin = async (values,{resetForm} ) => {
     console.log(values)
      // const response = await axios.post("https://localhost:8888/api/login",{
      //   values
      // }); 
      // console.log(response)   
      // const data= response.result;
      // if (data.success) {  
      //     useNavigation().navigate("/")
      //   // localStorage.setItem('user',data.result);
      //   // dispatch({ type: 'LOGIN', payload: users});
      // } else {
      //   alert("Wrong Login Credentials!");
      // }     

      const response = await fetch('http:/192.168.1.4:8888/api/login', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials:'include',
        body: JSON.stringify(values),
      });
      const data = await response.json();
      console.log(data.result)
      navigation.navigate("wertone",{screen:'invoice'})
      resetForm();
}
  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={handleLogin}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View style={styles.container}>
          <Image source={require('../assets/logo-wertone.png')} style={styles.img} />
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
            autoCapitalize='none'
          />
          {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}
            {/* <Link href='' style={styles.link}> forget password?..</Link> */}
          <Button onPress={handleSubmit} textColor='white' style={styles.button} >Login</Button>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent :"center", 
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