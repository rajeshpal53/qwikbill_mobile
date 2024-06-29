import React, { useEffect, useState,useContext } from 'react';
import { View, Text, StyleSheet,ScrollView } from 'react-native';
import ProductCard from'../Components/ProductCard'
import { ActivityIndicator, Button} from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import { readApi } from '../Util/UtilApi';
export default function Products({navigation}) {
  const [products,setProducts]=useState([])
  const[isLoading,setIsLoading]=useState(true)
  const isFocused = useIsFocused();
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await readApi("api/product/list");
        const result = await response;
        setProducts(response.result);
      } catch (Error) {
        throw new Error("Network response was not ok");
      }
      finally{
        setIsLoading(false)
      }
    }
    fetchData();
  }, [isFocused]);
  if(isLoading){
    return<ActivityIndicator size='large'/>
  }
  return (
    <ScrollView style={styles.container}>
      <Button style={styles.addButton} buttonColor='#ffffff' textColor='white' onPress={()=>{navigation.navigate('AddProduct') }}> Add New Product</Button>
      <ProductCard products={products} navigation={navigation}setProducts={setProducts}/>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  addButton:{
    color:"floralwhite ",
    backgroundColor:"#1976d2",
    marginVertical:20,   
 },
  container: {
    flex: 1,
    padding:16
  },
  text: {
    fontSize: 24,
  },
});

