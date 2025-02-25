import React, { useContext, useRef, useState } from "react";
import { View, Button, StyleSheet, Alert, Platform } from "react-native";
import { WebView } from "react-native-webview";
import Share from "react-native-share"; // Import for sharing functionality
import { API_BASE_URL, createApi, fontSize } from "../Util/UtilApi";
import UserDataContext from "../Store/UserDataContext";
import { useRoute } from "@react-navigation/native";
import { useSnackbar } from "../Store/SnackbarContext";
import { Text } from "react-native-paper";
import { useDispatch } from "react-redux";
import { clearCart } from "../Redux/slices/CartSlice";
// import RNHTMLtoPDF from "react-native-html-to-pdf";
import { useDownloadInvoice } from "../Util/DownloadInvoiceHandler";

const PdfScreen = ({ navigation }) => {
  const [pdfPath, setPdfPath] = useState("");
  const { formData } = useRoute().params;
  const dispatch = useDispatch();
  const [isGenerated, setIsGenerated] = useState(false); // State to track PDF generation
  const { userData } = useContext(UserDataContext);
  const invoiceCreated = useRef(false);
  const [createdInvoice, setCreatedInvoice] = useState(null);
  const { showSnackbar } = useSnackbar();
  
  const { downloadInvoicePressHandler, shareInvoicePressHandler } = useDownloadInvoice();

  const generatePDF = (values) => {
    console.log("values of formdata is , ", values);
    const productDetails = values?.products
      .map(
        (item) => `
        <tr class="item-row">
          <td colspan="2">${item?.name}</td>
          <td>${item?.quantity}</td>
          <td>₹${item?.sellPrice?.toFixed(2)}</td>
          <td>₹${item?.totalPrice?.toFixed(2)}</td>
          
        </tr>`
      )
      .join("");

    const partiallyPaidSection =
      values?.statusfk == 3
        ? `
        <tr class="details-row">
          <td><strong>Partially Paid:</strong></td>
          <td colspan="4">₹${50}</td>
        </tr>`
        : "";

    // Formatting for the total price, discount, and final amount after considering partial payment
    const totalPrice = values?.subtotal;
    const discount = values?.discount;
    const payAmount = values?.finaltotal;
    const partiallyAmount = values?.io || 0;
    const paymentmethod = "cod";

    const htmlContent = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
            }

            h1 {
              text-align: center;
            }

            .invoice-box {
              max-width: 800px;
              margin: auto;
              padding: 30px;
              border: 1px solid #eee;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
              font-size: 16px;
              line-height: 24px;
              color: #555;
            }

            .invoice-box table {
              width: 100%;
              border-collapse: collapse;
              line-height: inherit;
              text-align: left;
            }

            .invoice-box table td,
            .invoice-box table th {
              padding: 10px;
              vertical-align: top;
              border: 1px solid #ddd;
            }

            .invoice-box table th {
              background-color: #f5f5f5;
              font-weight: bold;
            }

            .invoice-box .details-row td {
              background-color: #f9f9f9;
              text-align: right;
            }

            .invoice-box .total-row td {
              border-top: 2px solid #eee;
              font-weight: bold;
              text-align: right;
            }

            .item-row td {
              text-align: center;
            }

            .item-row td:first-child {
              text-align: left;
            }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <table cellpadding="0" cellspacing="0">
              <!-- Invoice Header -->
              <tr>
                <td colspan="5" style="text-align: center; font-size: 24px; padding: 20px 0;">
                  <strong>Invoice</strong>
                </td>
              </tr>
              <!-- Invoice Information -->
              <tr>
                <td colspan="2">
                  <strong>Invoice Number:</strong> ${
                    values?.invoiceNumber || "INV123"
                  }<br>
                  <strong>Date:</strong> ${
                    values?.createdAt
                      ? new Date(values?.order?.createdAt).toLocaleDateString()
                      : getTodaysDate()
                  }
                </td>
                <td colspan="3">
                  <strong>Shop Name:</strong> ${
                    values?.serviceProviderData?.shopname || "N/A"
                  }<br>
                  <strong>Shop Contact:</strong> ${
                    values?.serviceProviderData?.whatsappnumber || "N/A"
                  }
                </td>
              </tr>
              <!-- Customer Information -->
              <tr>
                <td colspan="2">
                  <strong>Customer Name:</strong> ${
                    values?.customerData?.name || "N/A"
                  }<br>
                  <strong>Customer Contact:</strong> ${
                    values?.customerData?.mobile || "N/A"
                  } <br>
                  <strong>Address:</strong> ${values?.address || "N/A"}
                </td>
                <td colspan="3"></td>
              </tr>
              <!-- Payment Details -->
              <tr class="details-row">
                <td><strong>Payment Method:</strong></td>
                <td colspan="4">${
                  (values?.statusfk == 3 && "Partially Paid") ||
                  (values?.statusfk == 2 && "Paid") ||
                  (values?.statusfk == 1 && "Unpaid") ||
                  "N/A"
                }</td>
              </tr>
              <tr class="details-row">
                <td><strong>Status:</strong></td>
                <td colspan="4">${paymentmethod || "Pending"}</td>

              </tr>
              <!-- Item Details -->
              <tr>
                <th colspan="2">Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
              ${productDetails}
              <!-- Grand Total -->
              <tr class="total-row">
                <td colspan="4" style="text-align: right;"><strong>Grand Total:</strong></td>
                <td>₹${totalPrice?.toFixed(2)}</td>
              </tr>
              <!-- Discount -->
              <tr class="total-row">
                <td colspan="4" style="text-align: right;"><strong>Discount:</strong></td>
                <td>₹${discount?.toFixed(2)}</td>
              </tr>
              <!-- Partially Pay -->
              <tr class="total-row">
                <td colspan="4" style="text-align: right;"><strong>Partially Pay:</strong></td>
                <td>₹${partiallyAmount?.toFixed(2)}</td>
              </tr>
              <!-- Amount to Pay -->
              <tr class="total-row">
                <td colspan="4" style="text-align: right;"><strong>Amount to Pay:</strong></td>
                <td>₹${payAmount?.toFixed(2)}</td>
              </tr>
              <!-- Partially Paid (if exists) -->
              ${partiallyPaidSection}
            </table>
          </div>
        </body>
      </html>
    `;

    
    return htmlContent;
  };

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
      let api = "qapi/invoice/invoices";

      const { customerData, serviceProviderData, ...payloadData } = formData;

      const newProducts = payloadData?.products?.map((item) => {

        return ({
          id: item?.id,
          productname: item?.name,
          price: item?.sellPrice,
          quantity: item?.quantity,
        });
      });

      const newPayload = {
        ...payloadData,
        products: newProducts,
      }
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
      if(button == "download"){
        return response?.customer;
      }
      else if(button == "generate"){
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
    let invoiceData = ""
    if(!createdInvoice){
      invoiceData = await handleGenerate("download")
    }
    console.log("invoice data that we get is , ", invoiceData);
    await downloadInvoicePressHandler(`${API_BASE_URL}qapi/invoice/downloadInvoice/${invoiceData?.id}`, invoiceData?.id, invoiceData?.name);
  }

  const handleShare = async () => {
    shareInvoicePressHandler(api, id, name);
    try {
      // You can use the react-native-share library to share the PDF
    console.log("share 1")
    const htmlContent = generatePDF(formData);
    console.log("share 2")
    let options = {
      html: htmlContent,
      fileName: "Invoice",
      directory: "Documents",
    };

    console.log("share 3 , ", options);

    // const file = await RNHTMLtoPDF.convert(options)

    console.log("share 4 , ", file);

    if (!file?.filePath) {
      Alert.alert("Error", "Generate the PDF first!");
      return;
    }
    
    const shareOptions = {
      title: "Share Invoice",
      // message: "Check out this invoice",
      url: Platform.OS === "android" ? `file://${file.filePath}` : file,
      type: "application/pdf",
    };

    console.log("shareOptions is , ", shareOptions);
    
      await Share.open(shareOptions); // Open native share options
    } catch (error) {
      console.log("Error sharing the document", error);
    }
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

      <WebView
        originWhitelist={["*"]}
        source={{ html: generatePDF(formData) }} // Pass formData to the PDF generation function
        style={{ height: "100%" }}
      />

      <View style={styles.buttonsContainer}>
        <Button disabled={createdInvoice ? true : false} title="Generate" onPress={handleGenerate} />
        <Button title="Share" onPress={handleShare} />
        <Button title="Download" onPress={handleDownload} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: "row",
    // justifyContent: "space-between",
    justifyContent: "flex-end",
    gap: 20,
    padding: 20,
  },
});

export default PdfScreen;
