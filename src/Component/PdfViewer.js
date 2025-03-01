import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Button,
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
  generatePDF,
} from "../Util/UtilApi";
import UserDataContext from "../Store/UserDataContext";
import { useRoute } from "@react-navigation/native";
import { useSnackbar } from "../Store/SnackbarContext";
import { ActivityIndicator, Text } from "react-native-paper";
import { useDispatch } from "react-redux";
import { clearCart } from "../Redux/slices/CartSlice";
// import RNHTMLtoPDF from "react-native-html-to-pdf";
import { useDownloadInvoice } from "../Util/DownloadInvoiceHandler";
import { useTranslation } from "react-i18next";
import { AntDesign, Feather } from "@expo/vector-icons";

const PdfScreen = ({ navigation }) => {
  const [pdfPath, setPdfPath] = useState("");
  const formData = useRoute()?.params?.formData || null;
  const viewInvoiceData = useRoute()?.params?.viewInvoiceData || null;
  const dispatch = useDispatch();
  const [isGenerated, setIsGenerated] = useState(false); // State to track PDF generation
  const { userData } = useContext(UserDataContext);
  const invoiceCreated = useRef(false);
  const [createdInvoice, setCreatedInvoice] = useState(null);
  const { showSnackbar } = useSnackbar();

  const { t } = useTranslation();
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const { downloadInvoicePressHandler, shareInvoicePressHandler } =
    useDownloadInvoice();

  console.log("formData is 121 , ", formData);
  useEffect(() => {
    console.log("view InvoiceData is under useEffect , ", viewInvoiceData);

    if (viewInvoiceData) {
      setCreatedInvoice(viewInvoiceData);
    }
  }, [viewInvoiceData]);
  const getTodaysDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = today.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  };

  const handleGenerate = async (button = "button") => {
    // setIsGenerated(true); // Trigger PDF generation when the button is pressed
    try {
      let api = "invoice/invoices";

      const { customerData, serviceProviderData, ...payloadData } = formData;

      const newProducts = payloadData?.products?.map((item) => {
        return {
          id: item?.id,
          productname: item?.name,
          price: item?.sellPrice,
          quantity: item?.quantity,
        };
      });

      const newPayload = {
        ...payloadData,
        products: newProducts,
      };
      console.log("after removing someData, payloadData is , ", newPayload);
      console.log("userData is , ", userData);
      console.log("userData token is , ", userData?.token);

      const response = await createApi(api, newPayload, {
        Authorization: `Bearer ${userData?.token}`,
      });

      console.log("response of create invoice is, ", response);
      showSnackbar("Invoice Created Successfully", "success");
      setCreatedInvoice(response?.customer);

      invoiceCreated.current = true;
      if (button == "download") {
        return response?.customer;
      } else if (button == "generate") {
        dispatch(clearCart());
        navigation.pop(2);
      }
    } catch (error) {
      console.log("error creating invoice is , ", error);
      showSnackbar("Something went wrong creating Invoice is", "error");
    }
    console.log("Button pressed");
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

    // try {
    //   // You can use the react-native-share library to share the PDF
    //   console.log("share 1");
    //   const htmlContent = generatePDF(formData);
    //   console.log("share 2");
    //   let options = {
    //     html: htmlContent,
    //     fileName: "Invoice",
    //     directory: "Documents",
    //   };

    //   console.log("share 3 , ", options);

    //   // const file = await RNHTMLtoPDF.convert(options)

    //   console.log("share 4 , ", file);

    //   if (!file?.filePath) {
    //     Alert.alert("Error", "Generate the PDF first!");
    //     return;
    //   }

    //   const shareOptions = {
    //     title: "Share Invoice",
    //     // message: "Check out this invoice",
    //     url: Platform.OS === "android" ? `file://${file.filePath}` : file,
    //     type: "application/pdf",
    //   };

    //   console.log("shareOptions is , ", shareOptions);

    //   await Share.open(shareOptions); // Open native share options
    // } catch (error) {
    //   console.log("Error sharing the document", error);
    // }
  };

  // const downloadInvoiceHandler = async (api, id, name) => {
  //   console.log("api , ", api);
  //   console.log("id , ", id);
  //   console.log("name , ", name);
  //   await downloadInvoicePressHandler(api, id, name);
  // };

  // const shareInvoiceHandler = (api, id, name) => {
  //   shareInvoicePressHandler(api, id, name);
  // };

  return (
    <View style={{ flex: 1 }}>
      {/* <View style={{alignItems:"center"}}>
        <Text style={{fontFamily:"Poppins-Bold", fontSize:fontSize.headingSmall}}>Invoice Preview</Text>
      </View> */}

      {viewInvoiceData ? (
        <WebView
          originWhitelist={["*"]}
          source={{ html: generatePDF(viewInvoiceData) }}
          style={{ height: "100%" }}
        />
      ) : (
        <WebView
          originWhitelist={["*"]}
          source={{ html: generatePDF(formData) }}
          style={{ height: "100%" }}
        />
      )}

      <View style={styles.buttonsContainer}>
        {!createdInvoice && (
          <TouchableOpacity
            disabled={createdInvoice ? true : false}
            onPress={handleGenerate}
            style={{
              backgroundColor: "#9C27B0",
              alignItems: "center",
              paddingVertical: 8,
              borderRadius:5
            }}
          >
            <Text style={{ color: "#fff" }}>{t("Generate")}</Text>
          </TouchableOpacity>
        )}

        {/* <Button
          disabled={createdInvoice ? true : false}
          title="Generate"
          onPress={handleGenerate}
          style={{backgroundColor:"#FF9800"}}
        /> */}
        <View style={styles.downloadShareButtons}>
          <TouchableOpacity
            onPress={handleShare}
            disabled={createdInvoice ? false : true}
            style={[
              styles.touchableButtonsStyle,
              { backgroundColor: "#2196F3", opacity: createdInvoice ? 1 : 0.5, flexDirection:"row", justifyContent:"center" },
            ]}
          >
             <Feather name="share" size={22} color="#fff" />
            <Text style={{ color: "#fff", paddingLeft:4 }}>{t("Share")}</Text>
            {shareLoading && (
              <View style={styles.loaderOverlay}>
                <ActivityIndicator color="#fff" size="small" />
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDownload}
            disabled={createdInvoice ? false : true}
            style={[
              styles.touchableButtonsStyle,
              { backgroundColor: "#4CAF50", opacity: createdInvoice ? 1 : 0.5, flexDirection:"row", justifyContent:"center" },
            ]}
          >
          <AntDesign name="download" size={22} color="#fff" />

            <Text style={{ color: "#fff", paddingLeft:4}}>{t("Download")}</Text>
            {downloadLoading && (
              <View style={styles.loaderOverlay}>
                <ActivityIndicator color="#fff" size="small" />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    // flexDirection: "row",
    // justifyContent: "space-between",
    // justifyContent: "flex-end",
    backgroundColor:"#fff",
    gap: 20,
    padding: 20,
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
    borderRadius:5
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
