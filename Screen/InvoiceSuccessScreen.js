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
      const response = await fetch(`http://192.168.1.3:8888/download/invoice/invoice-${dataId}.pdf`, {
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

//   console.log("params are, ", route.params)
//   console.log("formData are, ", formData)
  //   const now = new Date();
  //   const formattedDate = format(now, "dd MMM yyyy, hh:mm a");

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
            //  mode= { (nextBtnActive === "anotherInvoice") ? ("contained") : ("outlined")} 
            mode="contained"
             onPress={() => nextBtnHandler("anotherInvoice")}>
               Make Another Invoice
             </Button>
             <Button 
            //  mode= { (nextBtnActive === "home") ? ("contained") : ("outlined")}  
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
    // backgroundColor: "orange",
  },
  overlay: {
    position: "absolute",
    top: 0, // Adjust the top value as needed
    // left: 0,
    // right:0,
    // transform: [{ translateX: -75 }, { translateY: -75 }], // Center the overlay
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
    // backgroundColor: "lightgreen",
  },
  cardContent: {
    // backgroundColor:"lightgreen",
    alignItems:"center",
  },
  scrollView: {
    marginTop: 4,
    flex: 1,
    marginHorizontal: 15,
    // backgroundColor: "lightblue",
  },
  scrollHorizontal:{
    alignItems: 'center',
    // backgroundColor:"lightblue",
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
    // backgroundColor:"orange"
  },
  actions: {
       justifyContent: 'space-between',
       paddingHorizontal: 16,
    //    backgroundColor:"orange"
    },
  contentFirstChild: {
    gap: 10,
  },
  checkBoxContainer: {
    flexDirection: "row",
    // backgroundColor:"lightgreen",
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
    
    // marginVertical: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    // backgroundColor:"orange",
    gap:5
},
});

// ---------------------------------------------------------------------

// import React from 'react';
// import { StyleSheet, View, Text } from 'react-native';
// import { Button, Card, IconButton, Avatar } from 'react-native-paper'

// export default function InvoiceSuccessScreen(){

//     return (
//         <View style={styles.container}>
//           <Card style={styles.card}>
//             <Card.Title
//               title="Invoice Generated Successfully"
//               subtitle="Invoice no: 25/24-25 on 21 Jul 2024, 08:59 PM"
//               left={(props) => <Avatar.Icon {...props} icon="check-circle" />}
//             />
//             <Card.Content>
//               <Text style={styles.infoText}>Customer Name: Kunal Electronics</Text>
//               <Text style={styles.infoText}>Mobile No: 9730025434</Text>
//               <Text style={styles.infoText}>Invoice Amt: ₹75086/-</Text>
//               <Text style={styles.infoText}>Payment Mode: Debit Card</Text>
//             </Card.Content>
//             <Card.Actions style={styles.actions}>
//               <Button icon="gmail" onPress={() => console.log('Send Email')}>
//                 Gmail
//               </Button>
//               <Button icon="whatsapp" onPress={() => console.log('Send via WhatsApp')}>
//                 WhatsApp
//               </Button>
//             </Card.Actions>
//           </Card>
//           <View style={styles.buttonContainer}>
//             <Button mode="contained" onPress={() => console.log('Make Another Invoice')}>
//               Make Another Invoice
//             </Button>
//             <Button mode="outlined" onPress={() => console.log('Return Home')}>
//               Return Home
//             </Button>
//           </View>
//         </View>
//       );
// };

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       justifyContent: 'center',
//       padding: 16,
//       backgroundColor: '#f5f5f5',
//     },
//     card: {
//       marginBottom: 20,
//     },
//     infoText: {
//       fontSize: 16,
//       marginVertical: 4,
//     },
//     actions: {
//       justifyContent: 'space-between',
//       paddingHorizontal: 16,
//     },
//     buttonContainer: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//     },
//   });

// ---------------------------------------------------------------------
{
  /* <View style={styles.contentFirstChild}>
                <View style={styles.custDetailContainer}>
                  <Text style={styles.textStyle}>Customer Name :-</Text>
                  <Text style={styles.textStyle}>{formData.client}</Text>
                </View>

                <View style={styles.custDetailContainer}>
                  <Text style={styles.textStyle}>Address :-</Text>
                  <Text style={styles.textStyle}>{formData.address}</Text>
                </View>

                <View style={styles.custDetailContainer}>
                  <Text style={styles.textStyle}>GST No. :-</Text>
                  <Text style={styles.textStyle}>1234</Text>
                </View>

                <View style={styles.custDetailContainer}>
                  <Text style={styles.textStyle}>Phone No. :- </Text>
                  <Text style={styles.textStyle}>{formData.phone}</Text>
                </View>

                <View style={styles.custDetailContainer}>
                  <Text style={styles.textStyle}>Invoice No. :- </Text>
                  <Text style={styles.textStyle}>1234</Text>
                </View>

                <View style={styles.custDetailContainer}>
                  <Text style={styles.textStyle}>Date :- </Text>
                  <Text style={styles.textStyle}>{formData.date}</Text>
                </View>
              </View>
              <Divider style={{ marginVertical: 10 }} />

              <Portal>
                <Modal
                  visible={visible}
                  onDismiss={hideModal}
                  contentContainerStyle={styles.containerStyle}
                >
                  <View style={{ alignItems: "center" }}>
                    <Text style={{ fontSize: 20 }}>Payment Through</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      // backgroundColor:"lightgreen",
                      justifyContent: "space-around",
                    }}
                  >
                    <View style={{ alignItems: "center" }}>
                      <View
                        style={{
                          borderWidth: 2,
                          borderRadius: 50,
                        }}
                      >
                        <IconButton
                          style={{ margin: 5 }}
                          icon="qrcode-scan"
                          iconColor="grey"
                          size={60}
                          onPress={() => buttonPressed("scanner")}
                        />
                      </View>

                      <Text style={{ fontSize: 18 }}>Scanner</Text>
                    </View>

                    <View style={{ alignItems: "center" }}>
                      <View
                        style={{
                          // backgroundColor:"grey",
                          justifyContent: "center",
                          alignItems: "center",
                          borderWidth: 2,
                          borderRadius: 50,
                        }}
                      >
                        <FontAwesome
                          name="rupee"
                          size={50}
                          color="grey"
                          style={{ marginHorizontal: 30, marginVertical: 18 }}
                          onPress={() => buttonPressed("cash")}
                        />
                      </View>

                      <Text style={{ fontSize: 18 }}>Cash</Text>
                    </View>

                    <View style={{ alignItems: "center" }}>
                      <View style={{ borderWidth: 2, borderRadius: 50 }}>
                        <IconButton
                          style={{ margin: 5 }}
                          icon="credit-card"
                          iconColor="grey"
                          size={60}
                          onPress={() => buttonPressed("card")}
                        />
                      </View>

                      <Text style={{ fontSize: 18 }}>Card</Text>
                    </View>
                  </View>
                </Modal>
              </Portal>

             
              <View style={{ gap: 10 }}>
                <InvoiceDataTable formData={formData} />

                <View style={styles.checkBoxContainer}>
                  <Checkbox
                    status={checked ? "checked" : "unchecked"}
                    onPress={() => {
                      setChecked(!checked);
                    }}
                  />
                  <Text>Pay Later</Text>
                </View>

                <View style={styles.confirmAndPayBtnContainer}>
                  <PaperProvider>
                    <Button mode="contained" onPress={showModal}>
                      Confirm and Pay
                    </Button>
                  </PaperProvider>
                </View>
              </View> */
}
