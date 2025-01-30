import React, { useState } from "react";
import { View, Button, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import Share from "react-native-share"; // Import for sharing functionality

const PdfScreen = ({ route }) => {
  const { formData } = route.params;
  const [isGenerated, setIsGenerated] = useState(false); // State to track PDF generation

  const generatePDF = (values) => {
    const productDetails = values.Product.map(
      (item) => `
        <tr class="item-row">
          <td colspan="2">${item.productName}</td>
          <td>${item.quantity}</td>
          <td>$${item.price.toFixed(2)}</td>
          <td>$${item.totalprice.toFixed(2)}</td>
        </tr>`
    ).join("");

    const partiallyPaidSection = values.Pricedetails[0].PartiallyPaid
      ? `
        <tr class="details-row">
          <td><strong>Partially Paid:</strong></td>
          <td colspan="4">$${values.Pricedetails[0].PartiallyPaid.toFixed(
            2
          )}</td>
        </tr>`
      : "";

    // Formatting for the total price, discount, and final amount after considering partial payment
    const totalPrice = values.Pricedetails[0].TotalPrice;
    const discount = values.Pricedetails[0].Discount;
    const payAmount = values.Pricedetails[0].PayAmount;
    const partiallyAmount = values.Pricedetails[0].PartiallyAmount;
    const paymentmethod = values.Pricedetails[0].PaymentMethod;


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
                  <strong>Invoice Number:</strong> ${values.invoiceNumber}<br>
                  <strong>Date:</strong> ${
                    values.createdAt
                      ? new Date(values.order?.createdAt).toLocaleDateString()
                      : "N/A"
                  }
                </td>
                <td colspan="3">
                  <strong>Shop Name:</strong> ${
                    values?.serviceProvider?.shopname || "N/A"
                  }<br>
                  <strong>Shop Contact:</strong> ${
                    values?.serviceProvider?.user?.mobile || "N/A"
                  }
                </td>
              </tr>
              <!-- Customer Information -->
              <tr>
                <td colspan="2">
                  <strong>Customer Name:</strong> ${values.name || "N/A"}<br>
                  <strong>Customer Contact:</strong> ${
                    values.phone || "N/A"
                  } <br>
                  <strong>Address:</strong> ${values.address || "N/A"}
                </td>
                <td colspan="3"></td>
              </tr>
              <!-- Payment Details -->
              <tr class="details-row">
                <td><strong>Payment Method:</strong></td>
                <td colspan="4">${values.paymentMethod || "N/A"}</td>
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
                <td>$${totalPrice.toFixed(2)}</td>
              </tr>
              <!-- Discount -->
              <tr class="total-row">
                <td colspan="4" style="text-align: right;"><strong>Discount:</strong></td>
                <td>$${discount.toFixed(2)}</td>
              </tr>
              <!-- Partially Pay -->
              <tr class="total-row">
                <td colspan="4" style="text-align: right;"><strong>Partially Pay:</strong></td>
                <td>$${partiallyAmount.toFixed(2)}</td>
              </tr>
              <!-- Amount to Pay -->
              <tr class="total-row">
                <td colspan="4" style="text-align: right;"><strong>Amount to Pay:</strong></td>
                <td>$${payAmount.toFixed(2)}</td>
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

  const handleGenerate = () => {
    // setIsGenerated(true); // Trigger PDF generation when the button is pressed
    console.log("Button pressed");
  };

  const handleShare = async () => {
    // You can use the react-native-share library to share the PDF
    const shareOptions = {
      title: "Share Invoice",
      message: "Check out this invoice",
      url: `data:text/html;base64,${btoa(generatePDF(formData))}`, // Using base64 encoding for inline content
      type: "text/html",
    };

    try {
      await Share.open(shareOptions); // Open native share options
    } catch (error) {
      console.log("Error sharing the document", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.buttonsContainer}>
        <Button title="Generate" onPress={handleGenerate} />
        <Button title="Share" onPress={handleShare} />
      </View>

      <WebView
        originWhitelist={["*"]}
        source={{ html: generatePDF(formData) }} // Pass formData to the PDF generation function
        style={{ height: "100%" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
});

export default PdfScreen;
