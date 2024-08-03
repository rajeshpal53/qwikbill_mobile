import React,{useState} from 'react';
import { View, StyleSheet,TouchableOpacity} from 'react-native';
import { TextInput, Button, Text ,Card,Divider,Menu,useTheme,HelperText} from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { createApi } from '../Util/UtilApi';
import { useSnackbar } from '../Store/SnackbarContext';
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
  const handleSignup = async (values) => {
    console.log(values);
    try{
    const response= await createApi("api/signup",values,{
      'Content-Type': 'application/json',
    },false)
    console.log(response.result)
    showSnackbar("successfully create new user","success")
  }catch(error){
    console.error("failed to signup",error)
    showSnackbar("failed to singup","error")
  }
    
    // Handle signup logic here
  };
  const theme = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);
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
        <View style={styles.container}>
          <Text variant='headlineMedium' style={{textAlign:'center', marginBottom:10}}> Signup Form </Text>
          <Card style={{paddingVertical:10}}>       
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
            mode="outlined"
            style={styles.input}
            label="Surname"
            onChangeText={handleChange('surname')}
            onBlur={handleBlur('surname')}
            value={values.surname}
            error={touched.surname && errors.surname}
          />
          {touched.surname && errors.surname && <Text style={styles.errorText}>{errors.surname}</Text>}

          <TextInput
            mode="outlined"
            style={styles.input}
            label="Email"
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
            error={touched.email && errors.email}
            keyboardType="email-address"
          />
          {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <TextInput
            mode="outlined"
            style={styles.input}
            label="Password"
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            value={values.password}
            error={touched.password && errors.password}
            secureTextEntry
          />
          {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          <Menu
          
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <TextInput mode="outlined" onPress={() => setMenuVisible(true)} style={styles.input}>
                {values.role || 'Select Role'}
              </TextInput>
            }
          >
            {roleOptions.map((role) => (
              <Menu.Item
                key={role}
                onPress={() => {
                  setFieldValue('role', role);
                  setMenuVisible(false);
                }}
                title={role}
              />
            ))}
          </Menu>

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
    borderRadius:50,
    width:'90%',
    alignSelf:"center"

  },
  button: {
    marginTop: 20,
  },
});

export default Signup;
