import { View ,StyleSheet,TouchableOpacity,Pressable} from "react-native";
import { Text,Card} from "react-native-paper";
import {statusName} from "../Util/UtilApi";

const ViewInvoiceCard = ({ invoice,navigation }) => {
    return (
        <Pressable onPress={()=>{navigation.navigate("InvoicePreviewScreen",{params:invoice})}}>
      <Card style={styles.card}>
        <View style={{flexDirection:"row", justifyContent:"space-between",width:"100%", }}>
        <Text style={styles.invoice}>Invoice #{invoice.id}</Text>
        <Text style={{color: invoice?.statusfk === 1 ? "red" : invoice?.statusfk === 2 ? "green" : "orange" }}>{statusName[invoice.statusfk]?.toUpperCase()}</Text>
        </View>
        <Text style={styles.title}>{invoice?.user?.name?invoice?.user?.name:"User Name" }</Text>
        <Text style={styles.date}>{new Date(invoice.createdAt).toDateString()}</Text>
        <Text style={styles.date}>{invoice.address}</Text>
        <View style={styles.row}>
          <Text>Subtotal:</Text>
          <Text>₹{invoice.subtotal}</Text>
        </View>
        <View style={styles.row}>
          <Text>Discount:</Text>
          <Text>₹{invoice.discount}</Text>
        </View>
        <View style={styles.row}>
          <Text>Final Total:</Text>
          <Text style={styles.finalTotal}>₹{invoice.finaltotal}</Text>
        </View>
        <View style={styles.row}>
          <Text>Payment Mode:</Text>
          <Text>{invoice.paymentMode}</Text>
        </View>
      </Card>
      </Pressable>
    );
    };
    const styles = StyleSheet.create({
        card: {
          backgroundColor: "#fff",
          padding: 15,
          marginVertical: 2,
          marginHorizontal: 16,
          borderRadius: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 3,
        },
        title: {
          fontSize: 18,
          fontWeight: "bold",
        },
        date: {
          fontSize: 14,
          color: "gray",
          marginBottom: 5,
        },
        invoice:{
            fontSize: 18,    
            color: "gray",
        },
        address: {
          fontSize: 14,
          marginBottom: 5,
        },
        row: {
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: 2,
        },
        finalTotal: {
          fontWeight: "bold",
          fontSize: 16,
          color: "green",
        },
      });
  
  export default ViewInvoiceCard;