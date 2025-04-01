import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  
  StyleSheet,
  Alert,
  Platform,
  TouchableOpacity,
} from "react-native";
import { WebView } from "react-native-webview";
import Share from "react-native-share"; // Import for sharing functionality
import {
  API_BASE_URL,
  createApi,
  fontSize,
  formatDate,
  generatePDF,
  statusName
} from "../Util/UtilApi";
import UserDataContext from "../Store/UserDataContext";
import { useRoute } from "@react-navigation/native";
import { useSnackbar } from "../Store/SnackbarContext";
import { ActivityIndicator, Card, Text,Button } from "react-native-paper";
import { useDispatch } from "react-redux";
import { clearCart } from "../Redux/slices/CartSlice";
// import RNHTMLtoPDF from "react-native-html-to-pdf";
import { useDownloadInvoice } from "../Util/DownloadInvoiceHandler";
import { useTranslation } from "react-i18next";
import { AntDesign, Feather,FontAwesome5,MaterialCommunityIcons} from "@expo/vector-icons";



const PdfScreen = ({ navigation }) => {
  const [pdfPath, setPdfPath] = useState("");
  const formData = useRoute()?.params?.formData || null;
  const selectedButton = useRoute()?.params?.selectedButton || null;
  const resetForm = useRoute()?.params?.resetForm
  const viewInvoiceData = useRoute()?.params?.viewInvoiceData || null;
  const customerResponse=useRoute()?.params?.customerResponse||null
  const dispatch = useDispatch();
  const [isGenerated, setIsGenerated] = useState(false); // State to track PDF generation
  const { userData } = useContext(UserDataContext);
  const invoiceCreated = useRef(false);
  const [createdInvoice, setCreatedInvoice] = useState(null);
  const { showSnackbar } = useSnackbar();

  console.log("createdInvoice----------", createdInvoice);
  console.log("selectedButton----------", selectedButton);

  const { t } = useTranslation();
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const { downloadInvoicePressHandler, shareInvoicePressHandler,shareInvoiceOnWhatsApp } =
    useDownloadInvoice();

  useEffect(() => {
    console.log("view InvoiceData is under useEffect , ", viewInvoiceData);

    if (viewInvoiceData) {
      setCreatedInvoice(viewInvoiceData);
    }
  }, [viewInvoiceData]);

  useEffect(() => {
    console.log("view InvoiceData is under useEffect formData , ", formData);
      
    if (formData) {
      setCreatedInvoice(customerResponse);
    }
  }, [formData]);

  const getTodaysDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = today.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  };

  const handleDownload = async () => {
    let invoiceData = "";
    if (!createdInvoice) {
      showSnackbar(
        "Invoice Not Created, First Click On Generate Button",
        "error"
      );
      // invoiceData = await handleGenerate("download");
      // console.log("invoice data that we get is , ", invoiceData);
      // await downloadInvoicePressHandler(
      //   `${API_BASE_URL}invoice/downloadInvoice/${invoiceData?.id}`,
      //   invoiceData?.id,
      //   invoiceData?.name
      // );
    } else {
      console.log(
        "invoice data that we get for download is , ",
        createdInvoice
      );

      try {
        setDownloadLoading(true);
        await downloadInvoicePressHandler(
          `${API_BASE_URL}invoice/downloadInvoice/${createdInvoice?.id}`,
          createdInvoice?.id,
          createdInvoice?.name
        );
      } catch (error) {
        console.log("error in downloading pdf , ", error);
      } finally {
        setDownloadLoading(false);
      }
    }
  };

  const handleShare = async () => {
    if (!createdInvoice) {
      showSnackbar(
        "Invoice Not Created, First Click On Generate Button",
        "error"
      );
    } else {
      console.log("invoice data that we get for share is , ", createdInvoice);
      try {
        setShareLoading(true);
        await shareInvoicePressHandler(
          `${API_BASE_URL}invoice/downloadInvoice/${createdInvoice?.id}`,
          createdInvoice?.id,
          createdInvoice?.name
        );
      } catch (error) {
        console.log("error in sharing pdf , ", error);
      } finally {
        setShareLoading(false);
      }
    }
   

  }

    const handleWhatsappShare= async()=>{
      if (!createdInvoice) {
        showSnackbar(
          "Invoice Not Created, First Click On Generate Button",
          "error"
        );
      } else {
        console.log("invoice data that we get for share is , ", createdInvoice);
  
        try {
          await shareInvoiceOnWhatsApp(
            `${API_BASE_URL}invoice/downloadInvoice/${createdInvoice?.id}`,
            createdInvoice?.id,
            createdInvoice?.name
          );
        } catch (error) {
          console.log("error in sharing pdf , ", error);
        } finally {
          setShareLoading(false);
        }
      }
    }
   let params={}
    if(formData){
      params={
        shopname:formData?.vendor?.shopname,
        userName:formData.user?.name,
        finaltotal:formData?.finaltotal,
        paidAmount:parseInt(formData?.finaltotal-formData?.remainingamount),
        vendorfk:formData?.vendorfk ,
        invoicefk:formData?.id ,
        userfk:formData?.usersfk||formData?.userfk,
      
      }
    }else{
      params={
        shopname:viewInvoiceData?.vendor?.shopname,
        userName:viewInvoiceData.user?.name,
        finaltotal:viewInvoiceData?.finaltotal,
        paidAmount:parseInt(viewInvoiceData?.finaltotal-viewInvoiceData?.remainingamount),
        vendorfk:viewInvoiceData?.vendorfk ,
        invoicefk:viewInvoiceData?.id ,
        userfk:viewInvoiceData?.usersfk||viewInvoiceData?.userfk,
      }
    }
  return (
    <View style={{ flex: 1 }}>
      {/* <View style={{alignItems:"center"}}>
        <Text style={{fontFamily:"Poppins-Bold", fontSize:fontSize.headingSmall}}>Invoice Preview</Text>
      </View> */}

      {viewInvoiceData ? (
        <WebView
          originWhitelist={["*"]}
          source={{ html: generatePDF(viewInvoiceData) }}
          style={{ height: "80%"}}
        />
      ) : (
        <WebView
          originWhitelist={["*"]}
          source={{ html: generatePDF(formData) }}
          style={{ height: "80%"  }}
        />
      )}
     <Card style={styles.card}>
      {/* Customer Name and Amount Section */}
      <View style={styles.headerContainer}>
        <View style={styles.detailContainer}>
        <Text style={styles.userName}> Bill To :{viewInvoiceData?.user?.name || formData?.user?.name}</Text>
        <Text style={styles.unpaidText}>Genrated By :{viewInvoiceData?.vendor?.shopname || formData?.vendor?.shopname}</Text>
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.amountText}>₹{ viewInvoiceData?.finaltotal||formData?.finaltotal}</Text>
          <Text style={styles.unpaidText}>
  {statusName[viewInvoiceData?.statusfk || formData?.statusfk]?.toUpperCase()}
</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.recordButton} onPress={()=>{navigation.navigate("InvoiceTransactionScreen",{invoices:params})}}>
          <MaterialCommunityIcons
                  name="newspaper-variant"
                  size={24}
                  color="#fff"
                />
          <Text style={styles.buttonText}> Transactions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.paymentButton} onPress={handleWhatsappShare}>
        <FontAwesome5 name="whatsapp" size={24} color="#fff" />
        <Text style={styles.buttonText}>  Share Link</Text>
        </TouchableOpacity>
      </View>

      {/* Print, Download, Share Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={[styles.iconButton,{opacity:0.5}]} disabled={true}>
          <Feather name="printer" size={22} color="#4CAF50" />
          <Text style={styles.iconText}>Print</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={handleDownload} disabled={!createdInvoice}>
          <AntDesign name="download" size={22} color="#2196F3" />
          <Text style={styles.iconText}>Download</Text>
          {downloadLoading && <ActivityIndicator color="#2196F3" size="small" />}
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={handleShare} disabled={!createdInvoice}>
          <Feather name="share" size={22} color="#9C27B0" />
          <Text style={styles.iconText}>Share</Text>
          {shareLoading && <ActivityIndicator color="#9C27B0" size="small" />}
        </TouchableOpacity>
      </View>
    </Card>


     
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    // flexDirection: "row",
    // justifyContent: "space-between",
    // justifyContent: "flex-end",
    backgroundColor: "#fff",
    gap: 20,
    padding: 20,
  },
  card: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginTop: 10,
    height:"30%"
  
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal:20
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  amountContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  detailContainer:{
    flexDirection: "column",
    alignItems: "flex-start",
  },
  amountText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  unpaidText: {
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  recordButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#26a0df",
    alignItems: "center",
    borderRadius: 5,
    marginRight: 5,
    flexDirection:"row",
    justifyContent:"center"
  },
  paymentButton: {
    flex: 1,
    
    paddingVertical: 10,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    borderRadius: 5,
    flexDirection:"row",
    justifyContent:"center"

  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
  },
  iconButton: {
    alignItems: "center",
  },
  iconText: {
    marginTop: 4,
    fontSize: 14,
    color: "#000",
  },

  
  upperButton:{
    flexDirection:"row",
    justifyContent:"center"
  },
  downloadShareButtons: {
    flexDirection: "row",
    gap: 10,
    // backgroundColor:"orange",
    // justifyContent:"space-around"
  },
  touchableButtonsStyle: {
    flex: 1,
    // backgroundColor: "orange",
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 5,
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject, // Makes the overlay cover the button
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Slightly dark transparent overlay
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5, // Match button's border-radius
  },
});

export default PdfScreen;
