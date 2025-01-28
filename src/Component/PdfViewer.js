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
        <tr>
          <td>${item.productName}</td>
          <td>${item.quantity}</td>
          <td>$${item.price}</td>
          <td>$${item.totalprice}</td>
        </tr>`
    ).join("");

    const htmlContent = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            .container {
              width: 100%;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
              text-align: center;
              color: #333;
            }
            .section {
              margin-bottom: 10px;
            }
            .section label {
              font-weight: bold;
              margin-right: 5px;
            }
            .section p {
              display: inline;
              font-size: 16px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            table, th, td {
              border: 1px solid #ccc;
            }
            th, td {
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            .price-section {
              display: flex;
              justify-content: space-between;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Invoice</h1>
            <h1>QwikBill pvt. ltd. </h1>
            <div class="section">
              <label>Name:</label>
              <p>${values.name}</p>
            </div>
            <div class="section">
              <label>Phone:</label>
              <p>${values.phone}</p>
            </div>
            <div class="section">
              <label>Address:</label>
              <p>${values.address}</p>
            </div>
            <div class="section">
              <label>GST Number:</label>
              <p>${values.gstNumber}</p>
            </div>
            <div class="section">
              <label>Products:</label>
              <table>
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${productDetails}
                </tbody>
              </table>
            </div>
            <div class="section">
              <label>Total Price:</label>
              <p>$${values.Pricedetails[0].TotalPrice}</p>
            </div>
            <div class="section">
              <label>Discount:</label>
              <p>$${values.Pricedetails[0].Discount}</p>
            </div>
            <div class="section">
              <label>Amount to Pay:</label>
              <p>$${values.Pricedetails[0].PayAmount}</p>
            </div>
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
