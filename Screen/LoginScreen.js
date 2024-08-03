import {React ,useState,useContext} from 'react';
import { View,StyleSheet, Alert,Image,TouchableOpacity } from 'react-native';
import{Text,TextInput,Button, Card,Divider} from 'react-native-paper'
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../Store/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createApi } from '../Util/UtilApi';

 const LoginScreen = ({navigation}) => {
  const{login,isAuthenticated,isLoading,storeData,setLoginDetail}= useContext(AuthContext)

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required')
  });

  const handleLogin = async (values,{resetForm} ) => {
    const headers={
      'Content-Type': 'application/json',
    }
    const response= await createApi("api/login",values,headers)
    console.log(response,"newResponse")
      const data = await response
       await storeData("loginDetail",data.result);  
      setLoginDetail(data.result) ;    
     const token='dummyToken'
      login(token)
      if (isLoading) {
        {
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
          </View>
        }
       }
      if(isAuthenticated){
        // navigation.navigate("wertone",{screen:'invoice'})
        navigation.navigate('CreateNewPasscode');
        resetForm();
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
          <Card >
          <Image source={require('../assets/logo-wertone.png')} style={styles.img} />
          <Text variant='labelMedium' style={styles.wertoneTag}> wertone billing center</Text>
          <Text variant='bodyLarge' style={{alignSelf:"center"}}> Login</Text>
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
          <Button
            icon={"google"}
            // onPress={handleGoogleSignIn}
            textColor='white'
            style={[styles.button, { backgroundColor: '#DB4437' }]}
          >
            Login with Google
          </Button>
          <Button
            icon={"facebook"}
            // onPress={handleFacebookLogin}
            textColor='white'
            style={[styles.button, { backgroundColor: '#3b5998' }]}
          >
            Login with Facebook
          </Button>
          <Divider/>
  
          <TouchableOpacity onPress={() =>navigation.navigate("Signup")}>
        <Text style={styles.signup}>
          Don't have an account? <Text style={styles.signupText}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
          
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
  signup:{alignSelf:"center",marginVertical:10,color:"grey"},
  input: {
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius:50,
    width:'90%',
    alignSelf:"center"

  },
  signupText: {
    color: '#1e90ff', 
    fontWeight: 'bold',
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
    marginLeft:16
  },
  button:{
    backgroundColor:'#0c3b73',
    width:'80%',
    alignSelf:"center",
    marginBottom:20
  }
});

export default LoginScreen;