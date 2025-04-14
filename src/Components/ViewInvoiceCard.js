import { View ,StyleSheet,TouchableOpacity,Pressable} from "react-native";
import { Text,Card} from "react-native-paper";
import {fontSize, statusName} from "../Util/UtilApi";

const ViewInvoiceCard = ({ invoice,navigation }) => {
  console.log(invoice,"in ViewScreen")
    return (
        <Pressable onPress={()=>{navigation.navigate("PDFScreen",{viewInvoiceData:invoice})}}>
      <Card style={styles.card}>
        <View style={{flexDirection:"row", justifyContent:"space-between",width:"100%", }}>
        <Text style={styles.invoice}>Invoice #{invoice.id}</Text>
        <Text style={{color: invoice?.statusfk === 1 ? "red" : invoice?.statusfk === 2 ? "green" : "orange" }}>{statusName[invoice.statusfk]?.toUpperCase()}</Text>
        </View>
        <Text style={styles.title}>{invoice?.user?.name?invoice?.user?.name:"User Name" }</Text>
        <Text style={styles.date}>{new Date(invoice.createdAt).toDateString()}</Text>
        <Text style={styles.date}>{invoice.address}</Text>
        <View style={styles.row}>
          <Text style={styles.allText}>Total Amount:</Text>
          <Text style={styles.allText}>₹{invoice.subtotal}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.allText}>Discount:</Text>
          <Text style={styles.allText}>₹{invoice.discount}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.allText}>Final Amount:</Text>
          <Text style={styles.finalTotal}>₹{invoice.finaltotal}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.allText}>Payment Mode:</Text>
          <Text style={styles.allText}> {invoice.paymentMode}</Text>
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
          fontSize: fontSize.label,
          color: "gray",
          marginBottom: 5,
        },
        invoice:{
            fontSize: 18,
            color: "gray",
        },
        address: {
          fontSize: fontSize.label,
          marginBottom: 5,
        },
        row: {
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: 2,
        },
        finalTotal: {
          fontWeight: "bold",
          fontSize: fontSize.labelMedium,
          color: "green",
        },
        allText:{
          fontSize: fontSize.labelMedium,
        }
      });

  export default ViewInvoiceCard;