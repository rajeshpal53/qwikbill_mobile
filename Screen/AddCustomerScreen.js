import React, { useContext, useState } from 'react'
import AddCustomer from '../Components/AddCustomer'
import { StyleSheet ,ScrollView, View} from 'react-native'
import { useSnackbar } from '../Store/SnackbarContext'
import { createApi } from '../Util/UtilApi'
import { ShopDetailContext } from '../Store/ShopDetailContext'
import { ActivityIndicator } from 'react-native-paper'

const AddCustomerScreen = ({navigation}) => {

  const [isLoading, setIsLoading] = useState(false)
  const {shopDetails} = useContext(ShopDetailContext);
 const initialValues={ 
  name: '', 
  gstnumber: '', 
  address:'', 
  email: '', 
  phone: '', 
  type: '' 
}
 const{showSnackbar}= useSnackbar();

 const handleSubmit=async (values)=>{
  const postData={
    ...values,
    shop: shopDetails._id
    // country: "USA",
// people: "6655af58afe60865000019cc",
}
console.log(postData, "data posted");
try{
const headers= {
  "Content-Type": "application/json",
} 
setIsLoading(true);
const response = await createApi(`api/people/create?shop=${shopDetails._id}`,postData,headers);
  console.log("response",response)
  showSnackbar("add customer Successfully","success")
    navigation.navigate('Customer')
}
catch(error){
        console.error("error to fetch customer",responsehandleSubmit)
        showSnackbar("error to fetch customer","error")
}finally{
  setIsLoading(false);
}

if(isLoading){
  <ActivityIndicator size="large" /> 
}
 }
  return (

    // <View contentContainerStyle={styles.container}>
    <AddCustomer navigation={navigation} initialValues={initialValues} handleSubmit={handleSubmit}/>
    // </View>

  )
}
const styles= StyleSheet.create({
    container:{
       flex:1,
      justifyContent:"center",
    }
})

export default AddCustomerScreen
