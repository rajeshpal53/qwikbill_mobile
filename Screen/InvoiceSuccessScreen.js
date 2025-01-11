import { useRoute } from "@react-navigation/native";
import { View, StyleSheet,Alert } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import React, { useContext, useState } from "react";
import {
  Button,
  Card,
  IconButton,
  Avatar,
  Text,
  Divider,

} from "react-native-paper";
// import { format } from "date-fns";

export default function InvoiceSuccessScreen({navigation}) {
  const route = useRoute();

  const { formData,newData, paymentMode } = route.params;

  const [loading,setLoading]=useState(false)
  const downloadPDF = async () => {
    try {
      const downloadResumable = FileSystem.createDownloadResumable(
        `https://wertone-billing.onrender.com/download/invoice/invoice-${newData._id}.pdf`,
        FileSystem.documentDirectory + `downloaded${newData._id}.pdf`
      );
      console.log(downloadResumable)
      console.log(newData._id)
      const { uri } = await downloadResumable.downloadAsync();
      console.log('Finished downloading to ', uri);
  
      // Share or view the PDF
      // Share.share({
      //   url: uri,
      //   title: 'Your PDF file',
      //   message: 'Here is your PDF file',
      // });
      if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri, {
                  mimeType: "application/pdf",
                  dialogTitle: "Save file to Downloads",
                });
              } else {
                console.log("sharing is not possible");
              }
    } catch (error) {
      console.error(error);
    }
  };
  // const [mediaBtnActive, setmediaBtnActive] = useState("whatsapp");
  // const [nextBtnActive, setNextBtnActive] = useState("anotherInvoice");

  const mediaBtnHandler = (key) => {

    // setmediaBtnActive(key); this was only for toggling button colors
  }

  const nextBtnHandler = (key) => {
    // setNextBtnActive(key); this was only for toggling button colors
    navigation.navigate(key)
  }

  return (
    // <View>
    //     <Text>{route.params.paymentMode}</Text>
    //     <Text>p</Text>

    // </View>
    <View style={styles.mainContainer}>
      <View style={styles.overlay}></View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.cardContainer}>
          <Card style={styles.card}>
            <View style={styles.header}>
              <Avatar.Icon
                size={80}
                icon= { (paymentMode=== "unpaid") ? "alert-circle" : "check-circle" }
                style={[styles.avatar, {backgroundColor:(paymentMode === "unpaid") ? "red" : "green" }]}
                color="white"
              />
              <Text style={styles.title}>Invoice Generated Successfully</Text>
              <Text style={styles.subtitle}>
                Invoice no: 25/24-25
              </Text>
              <Text style={styles.subtitle}>
                on 21 Jul 2024, 08:59 PM
              </Text>
            </View>
            <Divider style={{ marginVertical: 10 }} />
            <Card.Content style={styles.cardContent}>
              <ScrollView horizontal contentContainerStyle={styles.scrollHorizontal}>

                <View style={styles.textsContainer}>
                 <Text style={styles.infoText}>
                  Customer Name : {formData.client}
                 </Text>
                
                <Text style={styles.infoText}>Mobile No : {formData.phone}</Text>
                <Text style={styles.infoText}>Invoice Amt : ₹{formData.items[formData.items.length-1].total}/-</Text>
                <Text style={styles.infoText}>Payment Mode : 
                  <Text style={{
                    color: (paymentMode === "unpaid") ? "red" : "green"
                    }}>
                      {route.params.paymentMode}
                      </Text>
                  </Text>
                </View>
                
              </ScrollView>
            </Card.Content>
               <Button 
               icon="download" 
                mode = "contained"
                style={{justifyContent:"center", alignSelf:"center",marginVertical:10,width:"60%"}}
               onPress={() =>downloadPDF()}>
                 Download and Share
               </Button>
          </Card>
          <View style={styles.buttonContainer}>
             <Button 
            mode="contained"
             onPress={() => nextBtnHandler("CreateInvoice")}>
               Make Another Invoice
             </Button>
             <Button   
            mode="contained"
             onPress={() => nextBtnHandler("Home")}>
               Return Home
             </Button>
           </View>
          
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0, // Adjust the top value as needed
    width: "100%",
    // height: 250,
    height: "20%",
    backgroundColor: "#0c3b73",
    zIndex: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  card: {
    marginBottom: 20
  },
  header: {
    alignItems: "center",
    marginVertical: 10,
  },
  avatar: {
    marginBottom: 5,
    
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    color: "#777",
    textAlign: "center",
  },
  cardContainer: {
  },
  cardContent: {
    alignItems:"center",
  },
  scrollView: {
    marginTop: 4,
    flex: 1,
    marginHorizontal: 15,
  },
  scrollHorizontal:{
    alignItems: 'center',
    paddingVertical:10,
    paddingHorizontal:5
  },
  custDetailContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textStyle: {
    fontSize: 18,
  },
  textsContainer:{
    gap:15,
  },
  actions: {
       justifyContent: 'center',
       paddingHorizontal: 16,
       alignContent:"center"
    },
  contentFirstChild: {
    gap: 10,
  },
  checkBoxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  confirmAndPayBtnContainer: {
    backgroundColor: "lightgreen",
    borderRadius: 20,
  },
  containerStyle: {
    backgroundColor: "white",
    padding: 20,
    gap: 10,
    marginHorizontal: 10,
  },
  infoText: {
    fontSize: 20,
    
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    gap:5
},
});