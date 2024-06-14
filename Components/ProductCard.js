import React from 'react'
import { Button, Card, Text } from "react-native-paper";
import { IconButton, Icon } from "react-native-paper";
import { StyleSheet,View } from "react-native";
function ProductCard({products}) {
  return (
   <View>
    { products.map((item)=>{return( 
         <Card key={item._id} style={styles.card}>
           <Card.Title title={item.created} titleStyle={styles.cardTitle} />
           <Card.Content>
             <Text variant="headlineLarge">{item.name}</Text>
             <Text variant="bodyMedium" style={styles.cardText}>
               {" "}
                {item.productCategory.name}
             </Text>
             <Text variant="labelSmall" style={styles.cardText}>
               {" "}
               {item.productCategory.description}
             </Text>
             <Text variant="labelSmall" style={styles.cardText}>
               {" "}
               ${item.price}
             </Text>
           </Card.Content>
           <Card.Actions>
             <IconButton
               icon="delete"
               iconColor="#1976d2"
               size={20}
               onPress={() => console.log("Pressed")}
             />
             <Button style={{ backgroundColor: "#1976d2" }}>
               <Icon source="pencil" color="white" size={20} /> Edit
             </Button>
           </Card.Actions>
         </Card>
    )})}
   </View>
  )
}
const styles = StyleSheet.create({
    cardTitle: {
      color: "gray",
    },
    card:{
        marginVertical:10,
    },
    cardText: {
      marginVertical: 5,
    },
  });
export default ProductCard
