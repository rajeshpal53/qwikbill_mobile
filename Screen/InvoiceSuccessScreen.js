import { useRoute } from "@react-navigation/native";
import { View, StyleSheet,Alert } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import React, { useState } from "react";
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

  const { formData,newData } = route.params;

  const [loading,setLoading]=useState(false)

  const convertHtmlToPdf = async (dataId) => {
    setLoading(true);
    try {

      const response = await fetch(`http://192.168.15.33:8888/download/invoice/invoice-${dataId}.pdf`, {
        credentials: "include",
      });
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = async () => {
        const base64data = reader.result.split(',')[1];
        const fileUri = `${FileSystem.documentDirectory}invoice.pdf`;
  
        console.log('File URI:', fileUri); // Debugging line
  
        await FileSystem.writeAsStringAsync(fileUri, base64data, {
          encoding: FileSystem.EncodingType.Base64,
        });
  
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        console.log('File Info:', fileInfo); 
        if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri, {
                  mimeType: "application/pdf",
                  dialogTitle: "Save file to Downloads",
                }); 
              }else{
                console.log("sharing is not possible")
              }
        // Debugging line
        // if (fileInfo.exists) {
        //   const intent = {
        //     action: IntentLauncher.ACTION_VIEW,
        //     data: fileInfo.uri,
        //     flags: 1,
        //     type: 'application/pdf',
        //   };
  
        //   await IntentLauncher.startActivityAsync(intent);
        // } else {
        //   Alert.alert("Error", "File does not exist.", [{ text: "OK" }]);
        // }
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      Alert.alert("Error", `Failed to download PDF. ${error.message}`, [{ text: "OK" }]);
    } finally {
      setLoading(false);
    }
  };

  // const [mediaBtnActive, setmediaBtnActive] = useState("whatsapp");
  // const [nextBtnActive, setNextBtnActive] = useState("anotherInvoice");

  const mediaBtnHandler = (key) => {

    // setmediaBtnActive(key); this was only for toggling button colors
  }

  const nextBtnHandler = (key) => {
    // setNextBtnActive(key); this was only for toggling button colors
    navigation.navigate("Home")
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
                icon="check-circle"
                style={styles.avatar}
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
                <Text style={styles.infoText}>Payment Mode : {route.params.paymentMode}</Text>
                </View>
                
              </ScrollView>
            </Card.Content>

            <Card.Actions style={styles.actions}>
               <Button 
               icon="download" 
              mode = "contained"
              
               onPress={() => convertHtmlToPdf(newData._id)}>
                 Downloads
               </Button>
               <Button 
               icon="share" 
              mode="contained"
              buttonColor="#FFF"
              textColor="black"
               onPress={() => mediaBtnHandler("whatsapp")}>
               share
               </Button>
             </Card.Actions>
          </Card>
          <View style={styles.buttonContainer}>
             <Button 
            mode="contained"
             onPress={() => nextBtnHandler("anotherInvoice")}>
               Make Another Invoice
             </Button>
             <Button   
            mode="contained"
             onPress={() => nextBtnHandler("home")}>
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
    backgroundColor:"green",
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
       justifyContent: 'space-between',
       paddingHorizontal: 16,
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