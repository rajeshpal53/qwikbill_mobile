import React,{useState}from 'react'
import { Button, Card, Text } from "react-native-paper";
import { IconButton, Icon } from "react-native-paper";
import { StyleSheet,View} from "react-native";
import DeleteModal from '../UI/DeleteModal';
function InvoiceCard({invoices,navigation}) {
  const [visible,setVisible]=useState(false)
  const [invoiceId,setInvoiceId]= useState('')

    function detailInvoice(id){
        navigation.navigate("InvoiceDetail", {
          invoiceId:id
        })
      }
    function deleteInvoiceHandler(id){
        setInvoiceId(id)
        setVisible(true)
    }
    

  return (
   <View>
    { invoices.map((item,index)=>{return( 
         <Card key={index} style={styles.card} onPress={()=>detailInvoice(item._id)}>
           <Card.Title title={item.date} titleStyle={styles.cardTitle} />
           <Card.Content key={index}>
             <Text variant="headlineLarge">{item.people.firstname}</Text>  
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
               onPress={()=>deleteInvoiceHandler(item._id)}
             />
             {/* {visible&&<DeleteModal visible={visible} setVisible={setVisible} invoiceId={invoiceId}/>} */}
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
