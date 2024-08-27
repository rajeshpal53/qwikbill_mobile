import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { WebView } from "react-native-webview";
import { Button } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import * as FileSystem from "expo-file-system";
import { ScrollView } from "react-native-gesture-handler";
import * as Sharing from "expo-sharing";
import { readApi } from "../Util/UtilApi";
import * as Linking from 'expo-linking';

// import * as IntentLauncher from 'expo-intent-launcher';
const NewGenrateInvoice = ({ data }) => {
  const [loading, setLoading] = useState(false);
  console.log("new generate invoice data is ", data);
  // const [fileUri,setFileUri]=useState();
  let imgsrc = "";
  if (data.paymentStatus === "unpaid") {
    imgsrc =
      "https://t4.ftcdn.net/jpg/03/53/98/37/360_F_353983709_EMteiTFWbe5rFtAPtaxCotjotHg4gqck.jpg";
  } else {
    imgsrc =
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0N2OTLA7ebEBgftFByOI29InQJxJZBjquOcl-LEtooFhju6-RBHDb3Gsmz4Ke2h74m3E&usqp=CAU";
  }
  const [htmlContent, setHtmlContent] = useState(`<p1>loading...</p1>`);
  useEffect(() => {
    setHtmlContent(`<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invoice</title>
          <style>
            body {
              font-family: Arial, sans-serif;
             
            }
            .container {
              max-width: 50em;
              margin: auto;
              padding: 0.5em;
              border: 1px solid #ccc;
              border-radius: 1em;
            }
            .header, .footer {
              text-align: center;
            }
            .header h1 {
              margin: 0;
            }
            .header p {
              margin: 0.25em 0;
            }
            .invoice-details {
              display: flex;
              justify-content: space-between;
              margin: 1.2em 0;
              padding-bottom: 5rem;
           
            }
            .invoice-details div {
              width: 45%;
              margin-top: px;
            }
            .right-detail-div{
                display: flex;
            justify-content: flex-end;
            flex-direction: column;
            align-items: flex-end;
                
            }
            .invoice-details p {
              margin:1em 0   0;
            }
              .tabelContainer{
              background-color:"orange";
              }
            .items {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 1.5em;
              padding-bottom: 3rem;
            }
            .items th, .items td {
              border: 1px solid #ccc;
              padding: 0.8em;
              text-align: center;
            }
            .items th {
              background-color: #f5f5f5;
            }
            .total {
              text-align: right;
              margin-right: 1.2em;
              font-size: 1.2em;
              font-weight: bold;
              padding-bottom: 2rem;
            }
            .note {
              font-style: italic;
            }
            .button-container {
              text-align: center;
              margin: 1.25em 0;
            }
            .button {
              display: inline-block;
              padding: 0.75em 1.25em;
              margin: 0.25em;
              background-color: #007bff;
              color: white;
              text-decoration: none;
              border-radius: 5px;
            }
            .logoUnpaid{
              display:flex;
              flex-direction: row;
              justify-content:flex-end;
              }
              .logoUnpaid img{
                height: 6rem;
              }
              .footer img{
                width: 1.5rem;
                height: 1.5rem;
              }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Invoice</h1>
              <h3>${data.shop.shopname}</h3>
              <p>Phone:${data.people.phone}</p>
            </div>
            <div class="logoUnpaid">
             <img src=${data.paymentStatus === "unpaid"
               ?"https://t4.ftcdn.net/jpg/03/53/98/37/360_F_353983709_EMteiTFWbe5rFtAPtaxCotjotHg4gqck.jp"
               :   "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0N2OTLA7ebEBgftFByOI29InQJxJZBjquOcl-LEtooFhju6-RBHDb3Gsmz4Ke2h74m3E&usqp=CAU"
              } alt='status'/>
            </div>
            <div class="invoice-details">
            
              <div> 
                <p><strong>Bill and Ship To:</strong></p>
                <p>${data.people.name}</p>
                <p>Phone:${data.people.phone}</p>
              </div>
              <div class="right-detail-div">
                <p><strong>Invoice No. 1</strong></p>
                <p> ${new Date(data.date).toISOString().substring(0, 10)}</p>
                <p>Total Amount: <strong>${data.total}</strong></p>
               
                
              </div>
            </div>
           
            <table class="items">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item Details</th>
                  <th>Price/Unit</th>
                  <th>Qty</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
              ${data.items.map(
                (item, index) =>
                  `<tr>
                      <td>${index + 1}</td>
                      <td>${item.itemName}</td>
                      <td>${item.price}/1PCS</td>
                      <td>${item.quantity}</td>
                      <td>${item.total}</td>
                    </tr>`
              )}
                
              </tbody>
            </table>
            <div class="total">
              Total Amount:${data.total}
               <p style="color: red;">${data.paymentStatus}</p>
            </div>
            <div class="footer">
              <p>~ THIS IS A DIGITALLY CREATED INVOICE ~</p>
              <p>Thank you for the business.</p>
              <div><img src="https://media.licdn.com/dms/image/D4E03AQGnw_RMI1_6JA/profile-displayphoto-shrink_400_400/0/1714732776742?e=1727913600&v=beta&t=tRl5POX-rSjbiuYiE6eB7GNdeR4va4swGFhKIShbvZo"/><p > Powered by Wertone Technology</p></div>
            </div>
          </div>
        </body>
        </html>
        `);
  }, []);

  // const convertHtmlToPdf = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch(
  //       `http://192.168.29.81:8888/download/invoice/invoice-${data._id}.pdf`,

  //       {
  //         credentials: "include",
  //       }
  //     );
  //     const blob = await response.blob();
      
  //     console.log("response",response)
  //     const reader = new FileReader();
  //     reader.onload = async () => {
  //       const base64data = reader.result.split(",")[1];
  //       const fileUri = `${FileSystem.documentDirectory}invoice${data._id}.pdf`;
        

  //       console.log("File URI:", fileUri); // Debugging line

  //       await FileSystem.writeAsStringAsync(fileUri, base64data, {
  //         encoding: FileSystem.EncodingType.Base64,
  //       });

  //       const fileInfo = await FileSystem.getInfoAsync(fileUri);
  //       console.log("File Info:", fileInfo);

  //       if (await Sharing.isAvailableAsync()) {
  //         await Sharing.shareAsync(fileUri, {
  //           mimeType: "application/pdf",
  //           dialogTitle: "Save file to Downloads",
  //         });
  //       } else {
  //         console.log("sharing is not possible");
  //       }
       
  //     };
  //     reader.readAsDataURL(blob);
  //   } catch (error) {
  //     Alert.alert("Error", `Failed to download PDF. ${error.message}`, [
  //       { text: "OK" },
  //     ]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const downloadPDF = async () => {
    try {
      const downloadResumable = FileSystem.createDownloadResumable(
        `http://192.168.29.81:8888/download/invoice/invoice-${data._id}.pdf`,
        FileSystem.documentDirectory + `downloaded${data._id}.pdf`
      );
      console.log(downloadResumable)
  
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

  const sendWhatsAppMessage = async (phoneNumber, message) => {
    // Replace the spaces in the message with '%20' to make it URL encoded
    const urlEncodedMessage = encodeURIComponent(message);
  
    // Construct the WhatsApp URL
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    const smsUrl = `sms:${phoneNumber}?&body=${encodeURIComponent(message)}`;
    // Use Linking to open the URL
    try {
      // Check if WhatsApp is installed
      // const whatsappUrl = 'whatsapp://send?text=' + encodeURIComponent(message);
      const isWhatsAppAvailable = await Linking.canOpenURL(whatsappUrl);

      if (isWhatsAppAvailable) {
        // Open WhatsApp
        Linking.openURL(whatsappUrl);
      } else {
        // Open SMS app
        const canOpenSms = await Linking.canOpenURL(smsUrl);
        if (canOpenSms) {
          Linking.openURL(smsUrl);
        } else {
          Alert.alert('Neither WhatsApp nor SMS is available on this device.');
        }
      }
    } catch (error) {
      console.error('An error occurred', error);
    }
  
  };
  return (
    <View style={styles.container}>
      <ScrollView>
        <WebView
          originWhitelist={["*"]}
          source={{ html: htmlContent }}
          onLoad={() => console.log("WebView loaded successfully")}
          onError={(error) => console.error("WebView error:", error)}
          style={styles.webView}
        />
      </ScrollView>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <View style={styles.buttonRow}>
        <Button
          onPress={()=>{downloadPDF()}}
          style={styles.button}
          icon={() => <Icon name="download-outline" size={30} color="#000" />}
        >
          Download and Share
        </Button>
        <Button
          onPress={()=>{sendWhatsAppMessage(data.people.phone,"http://192.168.29.81:8888/download/invoice/invoice-66cb4fc3dfabffc6f60ad322.pdf")}}
          style={styles.button}
          icon={() => <Icon name="download-outline" size={30} color="#000" />}
        >
          Share link on Whatsapp
        </Button>
      
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  webView: {
    flex: 1,
    width: "100%",
    height: 1000,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical:20
  },
  button: {
    marginHorizontal:5,
    paddingHorizontal:5
  },
});

export default NewGenrateInvoice;
