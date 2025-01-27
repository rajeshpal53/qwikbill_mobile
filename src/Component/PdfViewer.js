import React from "react";
import { WebView } from "react-native-webview";

const PdfScreen = ({ route }) => {
  const { formData } = route.params;

  const generatePDF = (values) => {
    // Map through products to create a list of items
    const productDetails = values.Product.map(
      (item) => `
        <tr>
          <td>${item.productName}</td>
          <td>${item.quantity}</td>
          <td>$${item.price}</td>
          <td>$${item.totalprice}</td>
        </tr>`
    ).join(""); // Join to combine all rows into a single string

    // Create the HTML content for the PDF
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
            .row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
            }
            .row div {
              flex: 1;
              padding: 5px;
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
            .price-section div {
              flex: 1;
              padding: 5px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Invoice</h1>
            <h1>QwikBill pvt. ltd. </h1>

            <!-- Shop and Customer Information in individual sections -->
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

            <!-- Product Information in a Table -->
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
                  ${productDetails} <!-- Insert product rows here -->
                </tbody>
              </table>
            </div>

            <!-- Price Details Section with Space Between for each detail -->
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
    return htmlContent; // Return the HTML content for the PDF
  };

  return (
    <WebView
      originWhitelist={["*"]}
      source={{ html: generatePDF(formData) }} // Pass formData to the PDF generation function
      style={{ height: "100%" }} // Make the WebView take up full screen
    />
  );
};

export default PdfScreen;
