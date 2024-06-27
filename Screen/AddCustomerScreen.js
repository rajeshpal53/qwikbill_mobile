import React from 'react'
import AddCustomer from '../Components/AddCustomer'
import { StyleSheet ,ScrollView} from 'react-native'
import { useSnackbar } from '../Store/SnackbarContext'

const AddCustomerScreen = ({navigation}) => {
 const initialValues={ firstname: '', lastname: '', email: '', phone: '', type: '' }
 const{showSnackbar}= useSnackbar();
 const handleSubmit=async (values)=>{
  const postData={
    ...values,
    country: "USA",
people: "6655af58afe60865000019cc",
}
console.log(postData)
const url = "http://192.168.1.9:8888/api/people/create"; //put url into fetch arguments
const response = await fetch(url, {
  method: "POST",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(postData),
});
if(response.ok){
  console.log("response",response)
  showSnackbar("add customer Successfully","success")
    navigation.navigate('Customer')
}
else{
        console.error("error to fetch customer",responsehandleSubmit)
        showSnackbar("error to fetch customer","error")
}

 }
  return (
<ScrollView style={styles.container}>
    <AddCustomer navigation={navigation} initialValues={initialValues} handleSubmit={handleSubmit}/>
</ScrollView>
  )
}
styles= StyleSheet.create({
    container:{
       flex:1,
    }
})

export default AddCustomerScreen
