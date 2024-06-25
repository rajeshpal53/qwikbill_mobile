import React, { useState } from 'react'
import { Button, Card, Text } from "react-native-paper";
import { IconButton, Icon } from "react-native-paper";
import { StyleSheet,View } from "react-native";
import DeleteModal from '../UI/DeleteModal';
export default function CustomerCard({customer,navigation}) {
  const[visible,setVisible]= useState(false);
  const [customerId,setCustomerId]=useState('')
  function deleteCustomerDelete(id) {
    setCustomerId(id);
    setVisible(true);
  }
  const handleDelete = async () => {
    // Your delete logic here
    console.log(customerId);
    // setInvoices((prev)=>prev.filter((item) => item.id !== invoiceId));
    setVisible(false);
    try{
      const response= await fetch(`http://192.168.1.2:8888/api/people/delete/${customerId}`, {
          method: 'DELETE',
          credentials:'include'
        })
        if (response.ok) {
              console.log("item delted")
              
            } else {
              console.error('Failed to delete the item');
            }
          } catch (error) {
            console.error('Error:', error);
          }    
  };
  function customerDetail(id){
    navigation.navigate("CustomerDetail", {
      customerId:id
    })
   
}
  return (
   <View>
    { customer.map((item)=>{return( 
         <Card key={item._id} style={styles.card} onPress={()=>{ customerDetail(item._id)}}>
           <Card.Title title={item.created} titleStyle={styles.cardTitle} />
           <Card.Content>
             <Text variant="headlineLarge">{item.firstname+item.lastname}</Text>
             <Text variant="bodyMedium" style={styles.cardText}>
               {" "}
                {item.phone}
             </Text>
             <Text variant="labelSmall" style={styles.cardText}>
               {" "}
               {item.email}
             </Text>
           </Card.Content>
           <Card.Actions>
             <IconButton
               icon="delete"
               iconColor="#1976d2"
               size={20}
               onPress={() => deleteCustomerDelete(item._id)}
             />
              {visible && (
                <DeleteModal
                  visible={visible}
                  setVisible={setVisible}
                  handleDelete={handleDelete}
                />
              )}
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

