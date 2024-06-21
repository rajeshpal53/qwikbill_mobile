import React from 'react'
import { Button, Card, Text } from "react-native-paper";
import { IconButton, Icon } from "react-native-paper";
import { StyleSheet,View} from "react-native";
function InvoiceCard({invoices,navigation}) {
    function detailInvoice(id){
        navigation.navigate("InvoiceDetail", {
          invoiceId:id
        })
    }
  return (
   <View>
    { invoices.map((item,index)=>{return( 
         <Card key={index} style={styles.card} onPress={()=>detailInvoice(item._id)}>
           <Card.Title title={item.date} titleStyle={styles.cardTitle} />
           <Card.Content key={index}>
             <Text variant="headlineLarge">{item.year}</Text>  
             <Text variant="bodyMedium" style={styles.cardText}>
               {" "}
                {/* {item.client.people.phone} */}
             </Text>
              {item.items.map((newItem)=>{return( 
               <Text variant="labelSmall" style={styles.cardText}>
               {"items: "+newItem.itemName+", price: "+newItem.price+", quantity: "+newItem.quantity}
             </Text>
              )})}
           </Card.Content>
           <Card.Actions>
             <IconButton
               icon="delete"
               iconColor="#1976d2"
               size={20}
               onPress={() => console.log(item._id)}
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
export default InvoiceCard;
