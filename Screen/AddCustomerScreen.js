import React from 'react'
import AddCustomer from '../Components/AddCustomer'
import { StyleSheet ,ScrollView} from 'react-native'

const AddCustomerScreen = ({navigation}) => {
  return (
<ScrollView style={styles.container}>
    <AddCustomer navigation={navigation}/>
</ScrollView>
  )
}
styles= StyleSheet.create({
    container:{
       flex:1,
    }
})

export default AddCustomerScreen
