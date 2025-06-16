// import React from "react";
// import { Text, TextInput, HelperText,Button,Avatar } from "react-native-paper";
// import { StyleSheet, View } from "react-native";
// import { Formik } from "formik";
// import * as Yup from "yup";
// import { updateApi } from "../Util/UtilApi";
// import { useSnackbar } from "../Store/SnackbarContext";
// import { ScrollView } from "react-native-gesture-handler";
// const validationSchema = Yup.object().shape({
//     // name: Yup.string().required("firstname is required"),
//     surname: Yup.string().required("surname is required"),
//     email: Yup.string().required("email is required"),
//     cPassword: Yup.string()
//     .oneOf([Yup.ref('password'), null], 'Passwords must match'),
//     password: Yup.string()
//     .min(8, 'Password must be at least 8 characters'),
//   });

// function EditProfile({ navigation, route }) {
//   const { login } = route.params;
//   const { showSnackbar } = useSnackbar();
//   const initialValues = {
//     name: login.name || null,
//     surname: login.surname || "",
//     email: login.email || "",
//     password: "",
//     cPassword: "",
//   };
 
//   return (
//     <Formik
//       initialValues={initialValues}
//       style={styles.container}
//       validationSchema={validationSchema}
//       onSubmit={async (values) => {
//         if(values.password===values.cPassword&& values.password.length>0){
//           const newPassword={password:values.password, passwordCheck: values.cPassword}
//           console.log(newPassword,"newPassword")
//           const response= await updateApi("api/admin/profile/password",newPassword,{
//             "Content-Type": "application/json",
//           } )
//           console.log(response)

//         }   
//         delete values.password;
//         delete values.cPassword;
//         console.log(values,"vlaues")
//         try{
//           const response= await updateApi("api/admin/profile/update",values,{
//             "Content-Type": "application/json",
//           })
//               console.log(response)
//               navigation.navigate("Profile Setting")
//               showSnackbar(" update profile successfully","success")

//         }catch(err){
//           console.error("failed to update error",err)
//           showSnackbar(` failed to update profile ${err}`,"error")
//         }
       
//       }}
//     >
//       {({
//         handleChange,
//         handleBlur,
//         handleSubmit,
//         values,
//         errors,
//         touched,
//         setFieldValue,
//       }) => (
//         <ScrollView>
//         <View style={styles.form}>
//         <Avatar.Text
//           size={100}
//           label={login.name?.charAt(0)}
//           style={styles.avatar}
//         />
//           <View
//             style={{
//               marginHorizontal: 2,
//               position: "relative",
//             }}
//           >
//             <TextInput
//               label="First Name"
//               underlineColor="gray"
//               mode="flat"
//               onChangeText={handleChange("name")}
//               onBlur={handleBlur("name")}
//               value={values.name}
//               style={styles.input}
//               error={touched.name && !!errors.name}
//             />
//             <HelperText
//               type="error"
//               visible={touched.name && !!errors.name}
//             >
//               {errors.name}
//             </HelperText>
//           </View>
//           <View
//             style={{
//               marginHorizontal: 2,
//               position: "relative",
//             }}
//           >
//             <TextInput
//               label="Surname"
//               underlineColor="gray"
//               mode="flat"
//               onChangeText={handleChange("surname")}
//               onBlur={handleBlur("surname")}
//               value={values.surname}
//               style={styles.input}
//               error={touched.surname && !!errors.surname}
//             />
//             <HelperText
//               type="error"
//               visible={touched.surname && !!errors.surname}
//             >
//               {errors.surname}
//             </HelperText>
//           </View>
//           <View
//             style={{
//               marginHorizontal: 2,
//               position: "relative",
//             }}
//           >
//             <TextInput
//               label="email"
//               underlineColor="gray"
//               mode="flat"
//               onChangeText={handleChange("email")}
//               onBlur={handleBlur("email")}
//               value={values.email}
//               style={styles.input}
//               error={touched.email && !!errors.email}
//             />
//             <HelperText type="error" visible={touched.email && !!errors.email}>
//               {errors.email}
//             </HelperText>
//           </View>
//           <View
//             style={{
//               marginHorizontal: 2,
//               position: "relative",
//             }}
//           >
//             <TextInput
//               label=" New Password"
//               underlineColor="gray"
//               mode="flat"
//               onChangeText={handleChange("password")}
//               onBlur={handleBlur("password")}
//               value={values.password}
//               style={styles.input}
//               error={touched.password && !!errors.password}
//             />
//             <HelperText type="error" visible={touched.password && !!errors.password}>
//               {errors.password}
//             </HelperText>
//           </View>
//           <View
//             style={{
//               marginHorizontal: 2,
//               position: "relative",
//             }}
//           >
//             <TextInput
//               label="confirm Password"
//               underlineColor="gray"
//               mode="flat"
//               onChangeText={handleChange("cPassword")}
//               onBlur={handleBlur("cPassword")}
//               value={values.cPassword}
//               style={styles.input}
//               error={touched.cPassword && !!errors.cPassword}
//             />
//             <HelperText type="error" visible={touched.cPassword && !!errors.cPassword}>
//               {errors.cPassword}
//             </HelperText>
//           </View> 
//           <Button mode="contained" style={styles.button} onPress={handleSubmit}>
//             Submit
//           </Button>
//         </View>
//         </ScrollView>
//       )}
//     </Formik>
//   );
// }

// const styles = StyleSheet.create({
//   form: {
//     // backgroundColor: "#fff",
//     // backgroundColor: "lightgreen",
//     // height:"100%",
//     // margin: 10,
//     marginVertical: 5,
//     marginHorizontal: 10,
//     paddingVertical: 50,
//     borderRadius: 10,
//     elevation: 5, // For shadow on Android
//     shadowColor: "#000", // For shadow on iOS
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//     paddingHorizontal: 20,
//     flex: 1,
//     justifyContent: "center",
//   },
//   avatar: {
//     justifySelf: "center",
//     alignSelf: "center",
//     marginVertical: 10,
//   },
//   container: {
//     // backgroundColor: "#fff",
//     // backgroundColor: "green",
//     // margin: 10,
//     // padding: 25,
//     borderRadius: 10,
//     elevation: 5, // For shadow on Android
//     shadowColor: "#000", // For shadow on iOS
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//     marginVertical: 10,
//     flex: 1,
//     height: "100%",
//   },
//   input: {
//     // marginBottom: 5,
//     backgroundColor: "rgba(0,0,0,0)",
//     // shadowOffset: { width: 0, height: 2 },
//     // shadowOpacity: 0.8,
//     // shadowRadius: 2,
//     // elevation: 4,
//     overflow: "hidden",
//   },
//   error: {
//     fontSize: 12,
//     color: "red",
//     marginBottom: 10,
//   },
//   button: {
//     marginTop: 20,
//     width: "90%",
//     alignSelf: "center",
//     marginBottom: 10,
//   },
// });

// export default EditProfile;
