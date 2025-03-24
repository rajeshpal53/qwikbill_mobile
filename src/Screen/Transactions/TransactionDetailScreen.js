import React, { useEffect,useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Avatar, Card, Button } from "react-native-paper";
import { FontAwesome, MaterialIcons,AntDesign,EvilIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useDownloadInvoice } from "../../Util/DownloadInvoiceHandler";
import { API_BASE_URL } from "../../Util/UtilApi";
import { Feather } from "@expo/vector-icons";

const TransactionDetailScreen = ({item}) => {
  const route = useRoute();
  const [isLoading,setIsLoading]=useState(false);
  const[shareLoading, setShareLoading]=useState(false)
  const transaction = route.params;
  const { createdAt, transactionStatus, id ,invoice,vendor,user,paymentMode} = route.params.item||null;


  console.log(route.params.item,"itemmmmmm")
 const { downloadInvoicePressHandler, shareInvoicePressHandler } =useDownloadInvoice();
  if (!transaction) {
    return <Text style={styles.errorText}>Error: No transaction data provided.</Text>;
  }
  
  console.log(transaction, "transaction");
  const userName = user?.name || "Unknown "; 

  const handleDownload=async()=>{
    try{
      setIsLoading(true);
      console.log("invoice id is , ", invoice?.id);
       await downloadInvoicePressHandler(
                `${API_BASE_URL}invoice/downloadInvoice/${invoice?.id}`,
                invoice?.id,
                invoice?.name
              );
    }catch(error){
      console.log("error in downloading pdf , ", error);

    }finally{
      setIsLoading(false);
    }
  }
  const shareHandle=async()=>{
      try{
        setShareLoading(true)
         await shareInvoicePressHandler(
                  `${API_BASE_URL}invoice/downloadInvoice/${invoice?.id}`,
                  invoice?.id,
                  invoice?.name||"invoice"
                );

      }catch(err){
        console.log("error in sharing pdf , ", error);
      }
      finally{
        setShareLoading(false)
      }
  }

  return (
    <Card style={styles.card}>
      <Text style={styles.amount}>₹{userName}</Text>
      <View
      style={
        [styles.statusView,
        {
        borderColor: transactionStatus === "complete" ? "green" : "red",
      }]}
    >
      {transactionStatus === "complete" ? ( <AntDesign name="checkcircleo" size={16} color="green" style={{ marginRight: 5 }} />)
      : (<AntDesign name="closecircleo" size={16} color="red" style={{ marginRight: 5 }} />)}
     
      <Text
        style={[
          { fontSize: 16,textAlign:"center"},
          transactionStatus === "complete" ? { color: "green" } : { color: "red" },
        ]}
      >
        {transactionStatus}
      </Text>
    </View>
      
      <Text style={styles.date}>{new Date(createdAt)?.toLocaleString()}</Text>
      
      <View style={styles.section}>
        <View style={styles.row}>
          <View style={styles.preRow}>
          <FontAwesome name="credit-card" size={16} color="gray" />
          <Text style={styles.label}>Payment Mode </Text>
          </View>
          <Text style={styles.label}> {invoice?.paymentMode || "N/A"}</Text>
        </View>
        <View style={styles.row}>
        <View style={styles.preRow}>
          <FontAwesome name="file" size={16} color="gray" />
          <Text style={styles.label}>Invoice ID:</Text>

          </View>
          <Text style={styles.label}> {invoice?.id || "N/A"}</Text>
        </View>
        <View style={styles.row}>
        <View style={styles.preRow}>
        <FontAwesome name="hashtag" size={16} color="gray" />
          <Text style={styles.label}>Provision Number:</Text>
          </View>
          <Text> {invoice?.provisionNumber || "N/A"}</Text>
         
        </View>
      </View>
      
      <View style={styles.section}>
        <View style={styles.userRow}>
          <Avatar.Text size={50} label={userName ? userName?.charAt(0)?.toUpperCase() : 
                        <Feather name="arrow-down-right" size={20} color={"white"}/>
            
          } />
          <View style={{marginLeft:10}}>
          <Text style={styles.label}>{user?.name || "N/A"}</Text>
          <Text style={styles.label}>{user?.mobile || "N/A"}</Text>
          </View>
        </View>
        <View style={styles.preRow}>
          <MaterialIcons name="location-on" size={16} color="gray" />
          <Text style={styles.address}>{invoice?.address || "N/A"}</Text>
        </View>
      </View>
      <View style={styles.section}>
      <View style={styles.row}>
          <View style={styles.preRow}>
          <FontAwesome name="id-card" size={16} color="gray" />
          <Text style={styles.label}>Shop Name:</Text>
          </View>
          <Text style={styles.label}>{vendor?.shopname||"N/A"}</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.preRow}>
          <FontAwesome name="id-card" size={16} color="gray" />
          <Text style={styles.label}>Shop ID:</Text>
          </View>
          <Text style={styles.label}>{id || "N/A"}</Text>
        </View>
        <View style={styles.row}>
        <View style={styles.preRow}>
        <FontAwesome name="money" size={16} color="gray" />
        <Text style={styles.label}>Shop Profit:</Text>
        </View>
        <Text style={styles.label}> ₹{invoice?.vendorprofit ?? "N/A"}</Text>
        </View>
      </View>
      
        <View style={styles.buttonView}>
        <Button
      mode="contained"
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        backgroundColor: "#007bff",
      }}
      icon={() => !isLoading && <FontAwesome name="download" size={16} color="white" />}
      labelStyle={{ fontSize: 12 }}
      onPress={handleDownload}
      loading={isLoading} // Shows the loader when true
      disabled={isLoading} // Disables the button when true
    >
      {isLoading ? "Downloading..." : "Download Invoice"}
    </Button>

      <Button
        mode="outlined"
        style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 10,borderColor:"#007bff", borderWidth:1}}
        icon={() =><EvilIcons name="share-google" size={24} color="#007bff" />}
        labelStyle={{fontSize:12,color:"#007bff",}}
        onPress={shareHandle}
      >
        Share Invoice
      </Button>
        </View>
      <TouchableOpacity style={styles.supportButton}>
        <FontAwesome name="phone" size={16} color="blue" />
        <Text style={styles.supportText}>Contact Support</Text>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    margin: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  amount: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical:10
  },
  status: {
    textAlign: "center",
    marginTop: 4,
    fontWeight: "600",
  },
  statusComplete: {
    color: "green",
  },
  buttonView:{
    flexDirection:"row",
    justifyContent:"space-evenly",
    marginVertical:10

  },
  statusPending: {
    color: "red",
  },
  date: {
    color: "gray",
    textAlign: "center",
    marginBottom: 8,
  },
  section: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    marginVertical:10,
    justifyContent:"space-between",
  },
  label: {
    marginLeft: 3,
    marginTop:3 
  },
  preRow:{
  flexDirection:"row",
  alignItems:"center"
},
userRow:{
   flexDirection:"row",
  alignItems:"center",
  marginVertical:10
},
  address: {
    marginLeft: 8,
    color: "gray",
  },
  button: {
    marginTop: 8,
    backgroundColor: "#007bff",
  },
  supportButton: {
    marginTop: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#007bff",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  statusView:
  {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom:10
  },
  supportText: {
    marginLeft: 8,
    color: "#007bff",
  },
  errorText: {
    color: "red",
    padding: 16,
    textAlign: "center",
  },
});

export default TransactionDetailScreen;
