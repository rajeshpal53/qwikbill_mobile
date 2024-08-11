import React, { useContext } from 'react'
import AddCustomer from '../Components/AddCustomer'
import { StyleSheet ,ScrollView} from 'react-native'
import { useSnackbar } from '../Store/SnackbarContext'
import { createApi } from '../Util/UtilApi'
import { ShopDetailContext } from '../Store/ShopDetailContext'

const AddCustomerScreen = ({navigation}) => {

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
const response = await createApi(`api/people/create?shop=${shopDetails._id}`,postData,headers);
  console.log("response",response)
  showSnackbar("add customer Successfully","success")
    navigation.navigate('Customer')
}
catch(error){
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
const styles= StyleSheet.create({
    container:{
       flex:1,
      //  backgroundColor:"orange"
    }
})

export default AddCustomerScreen
