import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet,ScrollView } from 'react-native';
import ProductCard from'../Components/ProductCard'
import { Button} from 'react-native-paper';

export default function Products({navigation}) {
  const[products,setProducts]=useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://192.168.1.3:8888/api/product/list", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setProducts(result.result);
      } catch (error) {
        console.error("error", error);
      }
    }
    fetchData();
  }, []);
  return (
    <ScrollView style={styles.container}>
      <Button style={styles.addButton} buttonColor='#ffffff' textColor='white' onPress={()=>{navigation.navigate('AddProduct') }}> Add New Product</Button>
       {products?<ProductCard products={products} navigation={navigation}/>:<Text>no products found</Text>}
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
  },
  text: {
    fontSize: 24,
  },
});

