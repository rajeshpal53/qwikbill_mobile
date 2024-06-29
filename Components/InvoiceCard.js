import React, { useContext, useState } from "react";
import { Button, Card, Text } from "react-native-paper";
import { IconButton, Icon } from "react-native-paper";
import { FlatList, StyleSheet, View } from "react-native";
import DeleteModal from "../UI/DeleteModal";
import { InvoiceContext } from "../Store/InvoiceContext";
import { useSnackbar } from '../Store/SnackbarContext'
function InvoiceCard({ invoices, navigation }) {
  const [visible, setVisible] = useState(false);
  const [invoiceId, setInvoiceId] = useState("");
  const {setInvoices}= useContext(InvoiceContext)
  const{showSnackbar}=useSnackbar()

  function detailInvoice(id) {
    navigation.navigate("InvoiceDetail", {
      invoiceId: id,
    });
  }
  function EditInvoice(id){
    navigation.navigate("EditInvoice",{
      invoiceId:id
    }    );
  }
  function deleteInvoiceHandler(id) {
    setInvoiceId(id);
    setVisible(true);
  }

  const handleDelete = async () => {
    // Your delete logic here
    console.log(invoiceId);
    const updatedInvoice = invoices.filter(item => item._id !== invoiceId);
    setInvoices(updatedInvoice);
    setVisible(false);
    try{
      const response= await fetch(`http://192.168.1.6:8888/api/invoice/delete/${invoiceId}`, {
          method: 'DELETE',
          credentials:'include'
        })
        if (response.ok) {
              console.log("item delted")
              showSnackbar("item delete successfully","success")
            } else {
              console.error('Failed to delete the item');
            }
          } catch (error) {
            console.error('Error:', error);
            showSnackbar("Failed to delete the item","error")

          }    
  };
  return(
    <View> 
      {invoices.map((item,index)=>(
      item && item.people && <Card
      key={index}
      style={styles.card}
      onPress={() => detailInvoice(item._id)}
    >
      <Card.Title title={item.date} titleStyle={styles.cardTitle} />
      <Card.Content>
        <Text variant="headlineLarge">{item?.people?.firstname}</Text>
        <Text variant="bodyMedium" style={styles.cardText}>
          {" "}
          {/* {item.client.people.phone} */}
        </Text>
        
      </Card.Content>
      {/* <NestedList data={item.items}/> */}
  
      {
        item.items.map((newItem)=>(
          <View key={newItem._id}>
               <Text variant="labelSmall" style={styles.cardText}>
                       {"items: " +
                         newItem.itemName +
                         ", price: " +
                         newItem.price +
                         ", quantity: " +
                         newItem.quantity}
                     </Text>
            </View>
        ))
      }
      <Card.Actions>
        <IconButton
          icon="delete"
          iconColor="#1976d2"
          size={20}
          onPress={() => deleteInvoiceHandler(item._id)}
        />
        {visible && (
          <DeleteModal
            visible={visible}
            setVisible={setVisible}
            handleDelete={handleDelete}
          />
        )}
        <Button style={{ backgroundColor: "#1976d2" }} onPress={()=>EditInvoice(item._id)}>
          <Icon source="pencil" color="white" size={20}  /> Edit
        </Button>
      </Card.Actions>
    </Card>
    ))}
    </View>
  )}
const styles = StyleSheet.create({
  cardTitle: {
    color: "gray",
  },
  card: {
    marginVertical: 10,
  },
  cardText: {
    marginVertical: 5,
  },
});
export default InvoiceCard;
