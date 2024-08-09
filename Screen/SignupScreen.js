import React,{useState} from 'react';
import { View, StyleSheet,TouchableOpacity,Image} from 'react-native';
import { TextInput, Button, Text ,Card,Divider,Menu,useTheme,HelperText,List} from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { createApi } from '../Util/UtilApi';
import { useSnackbar } from '../Store/SnackbarContext';
import { Feather } from "@expo/vector-icons";
import axios from 'axios';
const SignupSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  surname: Yup.string().required('Surname is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  role: Yup.string().required('Role is required'),
});

const Signup = ({navigation}) => {
  const { showSnackbar } = useSnackbar();
  const [expanded, setExpanded] = React.useState(false);
  const handlePress = () => setExpanded(!expanded);
  const [selected, setSelected] = React.useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [eyeOn, setEyeOn] = useState(false);
  const handleSignup = async (values) => {
    console.log(values);
    try{


    const response= await axios.post("http://192.168.1.3:8888/api/signup", JSON.stringify(values),{
      headers:{'Content-Type': 'application/json'},
    })
    const data= await response.data
    console.log(data)
    showSnackbar("successfully create new user","success")
    navigation.navigate("login")
  }catch(error){
    console.error("failed to signup",error)
    showSnackbar("failed to singup","error")
  }
    
    // Handle signup logic here
  };

  const handleEyePress = () => {
    setSecureTextEntry(!secureTextEntry);
    setEyeOn(!eyeOn);
  };
  const theme = useTheme();
  const roleOptions= ["admin", "owner", "employee", "manager", "create_only", "read_only"];
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
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched,setFieldValue }) => (
          <Card style={styles.container}>     
           <Image source={require('../assets/logo-wertone.png')} style={styles.img} />
           <Text variant='labelMedium' style={styles.wertoneTag}> wertone billing center</Text>  
            <Text variant='headlineMedium' style={{textAlign:'center', marginBottom:10}}> Signup Form </Text>
          <TextInput
            style={styles.input}
            label="Name"
             mode="flat"
            onChangeText={handleChange('name')}
            onBlur={handleBlur('name')}
            value={values.name}
            error={touched.name && errors.name}
          />
          {touched.name && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

          <TextInput
            mode="flat"
            style={styles.input}
            label="Surname"
            onChangeText={handleChange('surname')}
            onBlur={handleBlur('surname')}
            value={values.surname}
            error={touched.surname && errors.surname}
          />
          {touched.surname && errors.surname && <Text style={styles.errorText}>{errors.surname}</Text>}

          <TextInput
            mode="flat"
            style={styles.input}
            label="Email"
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
            error={touched.email && errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          <View style={{flexDirection:"row",alignItems:"center",paddingHorizontal:5}}>
          <TextInput
            mode="flat"
            style={styles.input}
            label="Password"
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            value={values.password}
            error={touched.password && errors.password}
            secureTextEntry={secureTextEntry}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={handleEyePress}>
                              {eyeOn ? (
                                <Feather name="eye" size={25} color="#0c3b73"  />
                              ) : (
                                <Feather
                                  name="eye-off"
                                  size={25}
                                  color="#0c3b73"
                                />
                              )}
                            </TouchableOpacity>
                            </View>
                            {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          <List.Accordion
                  style={{ paddingHorizontal: 8}}
                    title={selected || "Select Role"}
                    expanded={expanded}
                    onPress={handlePress}
                    left={(props) => <List.Icon {...props} icon="account" />}
                  >
            {roleOptions.map((role) => (
              <List.Item
                key={role}
                onPress={() => {
                  setFieldValue('role', role);
                  setExpanded(false)
                  setSelected(role)
                }}
                title={role}
              />
            ))}
          </List.Accordion>
          {touched.role && errors.role && (
            <Text style={{ color: 'red', marginTop: 10 }}>{errors.role}</Text>
          )}

          <Button mode="contained" onPress={handleSubmit} style={styles.button}>
            Sign Up
          </Button>
          <TouchableOpacity onPress={() =>navigation.navigate("login")}>
        <Text style={styles.signup}>
          Alreay have an account? <Text style={styles.signupText}>login</Text>
        </Text>
      </TouchableOpacity>
          </Card>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
  
    marginVertical:10,
    flex:1,
    justifyContent :"center", 
    paddingHorizontal: 16,
    elevation:12,
    backgroundColor:"#ffffff"
  },
  signup:{alignSelf:"center",marginVertical:10,color:"grey"},
  signupText: {
    color: '#1e90ff', 
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginBottom: 10,
  },
  input: {
    marginBottom: 16,
    paddingHorizontal: 8,

    border:"none",
    width:'90%',
    alignSelf:"flexStart",
    marginHorizontal:6,
     backgroundColor:"#ffffff"

  },
  button: {
    marginTop: 20,
  },
  img:{
    height:60,
    width:60,
    elevation:2,
    alignSelf:"center",
    marginVertical:10,
},
wertoneTag:{
  color:'gray',
  alignSelf:'center',
  marginVertical:5,
},
});

export default Signup;
