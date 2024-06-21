import React from 'react'
import AddProduct from '../Components/AddProduct'
import { StyleSheet ,ScrollView} from 'react-native'

const AddProductScreen = ({navigation}) => {
  return (
<ScrollView style={styles.container}>
    <AddProduct navigation={navigation}/>
</ScrollView>
  )
}
styles= StyleSheet.create({
    container:{
       flex:1,
    }
})

export default AddProductScreen;
