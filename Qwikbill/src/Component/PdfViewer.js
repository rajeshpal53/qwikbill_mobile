import React, { use, useContext, useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { ActivityIndicator, Card, Text } from "react-native-paper";
import { AntDesign, Feather, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Print from "expo-print";
import { WebView } from "react-native-webview";
import { useRoute } from "@react-navigation/native";
import { useSnackbar } from "../Store/SnackbarContext";
import UserDataContext from "../Store/UserDataContext";
import { useDownloadInvoice } from "../Util/DownloadInvoiceHandler";
import { API_BASE_URL, statusName } from "../Util/UtilApi";
import * as FileSystem from 'expo-file-system/legacy';

const PdfScreen = ({ navigation }) => {
  const [pdfBase64, setPdfBase64] = useState("");
  const [loading, setLoading] = useState(true);
  const { showSnackbar } = useSnackbar();
  const { userData } = useContext(UserDataContext);

  const route = useRoute();
  const viewInvoiceData = route?.params?.viewInvoiceData || null;
  const formData = route?.params?.formData || null;
  const [createdInvoice, setCreatedInvoice] = useState(viewInvoiceData || formData);
  const { downloadInvoicePressHandler, shareInvoicePressHandler, shareInvoiceOnWhatsApp } =
    useDownloadInvoice();

      const [pdfUri, setPdfUri] = useState(null);
 const [html, setHtml] = useState(null);


    useEffect(() => {
      if (viewInvoiceData) {
        setCreatedInvoice(viewInvoiceData);
      } else if (formData) {
        setCreatedInvoice(formData);
      }
    }, [viewInvoiceData, formData]);
  const { width } = Dimensions.get("window");
  const scale = width / 375;
  const styles = pdfStyle(scale);

  // 🔹 Load PDF from API as base64
  useEffect(() => {
    const fetchPdfAsBase64 = async () => {
      if (!createdInvoice?.id) return;
      console.log("Fetching PDF for invoice ID:", createdInvoice)
      try {
          setPdfUri(`${API_BASE_URL}invoice/downloadInvoice/${createdInvoice?.id}`)
      } catch (err) {
        console.log("PDF fetch error:", err);
        showSnackbar("Failed to load PDF", "error");
        setLoading(false);
      }
    };

    fetchPdfAsBase64();
  }, [createdInvoice]);




// useEffect(() => {
//     const loadPdf = async () => {
//       try {
//         const remoteUrl =
//           "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
//         const localUri = FileSystem.cacheDirectory + "invoice.pdf";
//         const { uri } = await FileSystem.downloadAsync(remoteUrl, localUri);
//         console.log("PDF downloaded to:", uri); 
//         const base64 = await FileSystem.readAsStringAsync(uri, {
//           encoding: FileSystem.EncodingType.Base64,
//         });

//          console.log("PDF downloaded to:", base64); 
//         const htmlData = `
//           <html>
//             <body style="margin:0;padding:0;">
//               <embed src="data:application/pdf;base64,${base64}" width="100%" height="100%" type="application/pdf" />
//             </body>
//           </html>
//         `;
//         setHtml(htmlData);
//                console.log("PDF downloaded to:", htmlData); 
//       } catch (error) {
//         console.log("Error loading PDF:", error);
//       }
//     };

//     loadPdf();
//   }, []);
   
  // 🔹 Print or Download PDF using expo-print
  const handlePrint = async () => {
    try {
      await Print.printAsync({ base64: pdfBase64 });
    } catch (err) {
      showSnackbar("Printing failed", "error");
    }
  };

  const handleDownload = async () => {
    try {
      await downloadInvoicePressHandler(
        `${API_BASE_URL}invoice/downloadInvoice/${createdInvoice?.id}`,
        createdInvoice?.id,
        createdInvoice?.name
      );
    } catch (err) {
      showSnackbar("Download failed", "error");
    }
  };

  const handleShare = async () => {
    try {
      await shareInvoicePressHandler(
        `${API_BASE_URL}invoice/downloadInvoice/${createdInvoice?.id}`,
        createdInvoice?.id,
        userData?.token
      );
    } catch (err) {
      showSnackbar("Share failed", "error");
    }
  };

  const handleWhatsappShare = async () => {
    try {
      await shareInvoiceOnWhatsApp(
        `${API_BASE_URL}invoice/downloadInvoice/${createdInvoice?.id}`,
        createdInvoice?.id,
        userData?.token
      );
    } catch (err) {
      showSnackbar("WhatsApp share failed", "error");
    }
  };

  console.log(pdfUri,"pdfUri")

  return (
    <View style={{ flex: 1 }}>
      {!pdfUri ? (
  <View style={styles.loaderContainer}>
    <ActivityIndicator size="large" />
  </View>
) : (
//   <WebView
//   originWhitelist={["*"]}
//   allowFileAccess={true}
//   allowUniversalAccessFromFileURLs={true}
//   source={{
//     html: `
//       <html>
//         <body style="margin:0;padding:0;overflow:hidden">
//           <iframe
//             src="data:application/pdf;base64,${pdfBase64}"
//             type="application/pdf"
//             width="100%"
//             height="100%"
//             style="border:none;"
//           ></iframe>
//         </body>
//       </html>
//     `,
//   }}
//   style={{ flex: 1 }}
//   useWebKit={true}
//   javaScriptEnabled={true}
//   scalesPageToFit={true}
// />
 <WebView
      originWhitelist={["*"]}
      style={{ flex: 1 }}
       source={{ uri: `https://docs.google.com/gview?embedded=true&url=${pdfUri}` }}
      //  source={{ uri: pdfUri }}
  allowsBackForwardNavigationGestures
   
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        injectedJavaScript={`
          document.body.style.zoom = '1.0';
          true;
        `}
    />
    // <WebView originWhitelist={["*"]} source={{ html }} style={{ flex: 1 }} />
    //  <WebView
    //   originWhitelist={["*"]}
    //   allowFileAccess={true}
    //   allowUniversalAccessFromFileURLs={true}
    //   source={{ uri: 'https://f2gfinance.com/' }}
    //   style={{ flex: 1 ,width: '100%', height: '50%', backgroundColor: 'gray',marginTop:10 ,zIndex:100}}
    //   onError={(err) => console.log("WebView error:", err)}
    // />
)}

      <Card style={styles.card}>
        <View style={styles.headerContainer}>
          <View style={styles.detailContainer}>
            <Text style={styles.userName}>
              Bill To: {createdInvoice?.user?.name}
            </Text>
            <Text style={styles.unpaidText}>
              Generated By: {createdInvoice?.vendor?.shopname}
            </Text>
          </View>
          <View style={styles.amountContainer}>
            <Text style={styles.amountText}>₹{createdInvoice?.finaltotal}</Text>
            <Text style={styles.unpaidText}>
              {statusName[createdInvoice?.statusfk]?.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.recordButton}
            onPress={() =>
              navigation.navigate("InvoiceTransactionScreen", {
                invoices: createdInvoice,
              })
            }
          >
            <MaterialCommunityIcons name="newspaper-variant" size={24} color="#fff" />
            <Text style={styles.buttonText}> Transactions</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.paymentButton} onPress={handleWhatsappShare}>
            <FontAwesome5 name="whatsapp" size={24} color="#fff" />
            <Text style={styles.buttonText}> Share Invoice</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.iconButton} onPress={handlePrint}>
            <Feather name="printer" size={22} color="#4CAF50" />
            <Text style={styles.iconText}>Print</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={handleDownload}>
            <AntDesign name="download" size={22} color="#2196F3" />
            <Text style={styles.iconText}>Download</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
            <Feather name="share" size={22} color="#9C27B0" />
            <Text style={styles.iconText}>Share</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </View>
  );
};

const pdfStyle = (scale) =>
  StyleSheet.create({
    loaderContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    card: {
      padding: 10,
      borderRadius: 10,
      backgroundColor: "#fff",
      marginTop: 10,
      height: "30%",
    },
    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8 * scale,
      paddingHorizontal: 12 * scale,
    },
    detailContainer: {
      flexDirection: "column",
      alignItems: "flex-start",
      maxWidth: "70%",
    },
    userName: { fontSize: 16 * scale, fontWeight: "bold" },
    amountText: { fontSize: 18 * scale, fontWeight: "bold", color: "#000" },
    unpaidText: { fontSize: 12 * scale, flexWrap: "wrap" },
    actionButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 8 * scale,
    },
    recordButton: {
      flex: 1,
      paddingVertical: 10,
      backgroundColor: "#26a0df",
      alignItems: "center",
      borderRadius: 5,
      marginRight: 5,
      flexDirection: "row",
      justifyContent: "center",
    },
    paymentButton: {
      flex: 1,
      paddingVertical: 10,
      backgroundColor: "#4CAF50",
      alignItems: "center",
      borderRadius: 5,
      flexDirection: "row",
      justifyContent: "center",
    },
    buttonText: { color: "#fff", fontSize: 16 * scale },
    bottomButtons: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: 15,
    },
    iconButton: { alignItems: "center" },
    iconText: { marginTop: 4, fontSize: 14 * scale, color: "#000" },
  });

export default PdfScreen;
