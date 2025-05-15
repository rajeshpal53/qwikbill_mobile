import axios from 'axios';
// const API_BASE_URL = "https://wertone-billing.onrender.com/";
// const API_BASE_URL = "https://wertone-billing.onrender.com/";

export const API_BASE_URL = "https://qwikbill.in/qapi/";
import AsyncStorage from '@react-native-async-storage/async-storage';
// export const API_BASE_URL = "http://192.168.1.35:2235/";

//for preview:>  eas build --platform android  --profile preview
// for development:> eas build --platform android  --profile development
// for production:> eas build --platform android  --profile production

export const NORM_URL="https://rajeshpal.online/"
const apiRequest = async (method, url, data = null, customHeaders = {}) => {
  try {
    const userDataString = await AsyncStorage.getItem('userData');
    const userData = userDataString ? JSON.parse(userDataString) : null;
    const token = userData?.token;

    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...customHeaders,
    };

    const response = await axios({
      url: `${API_BASE_URL}${url}`,
      method,
      data: data ? JSON.stringify(data) : null,
      headers,
      withCredentials: true,
    });

    return response.data || '';
  } catch (error) {
    console.error(`Error with ${method.toUpperCase()} request to ${url}:`, error.response || error.message);
    throw error.response || error.message;
  }
};

  const deleteApiRequest= async( method ,url, headers={})=>{
        const response= await axios({
          url:`${API_BASE_URL}${url}`,
          method,
          headers:{
            "Content-Type":"application/json",
            ...headers,
          },
          withCredentials:true
        })
        return response
  }
  //CREATE
  export const createApi = async (endpoint, data, headers) => {
    return apiRequest('post', endpoint, data, headers);
  };

// READ
  export const readApi = async (endpoint, headers) => {
    return apiRequest('get', endpoint, null, headers);
  };

// UPDATE
export const updateApi = async (endpoint, data, headers) => {
    return apiRequest('put', endpoint, data, headers);
  };

  // DELETE
  export const deleteApi = async (endpoint,headers) => {
    return deleteApiRequest('delete', endpoint, headers);
  };
  export const fontSize = {
    headingLarge: 24,
    headingMedium: 22,
    heading: 20,
    headingSmall: 18,
    labelLarge: 16,
    labelMedium: 14,
    label: 12,
    labelSmall: 10,
    labelXSmall:9,
    labelXXSmall:8,
  };


  export const images = [
    `${NORM_URL}assets/serviceproviders/firstProvider.jpg`,
    `${NORM_URL}assets/serviceproviders/secondProvider.jpg `,
    `${NORM_URL}assets/serviceproviders/thirdProvider.jpg`,
    `${NORM_URL}assets/serviceproviders/fourthProvider.jpg`,
    `${NORM_URL}assets/serviceproviders/fifthProvider.jpg`,
    `${NORM_URL}assets/serviceproviders/sixthProvider.jpg`,
  ];
  export const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  };


  export const fontFamily = {
    regular: "Poppins-Regular",
    bold: "Poppins-Bold",
    medium: "Poppins-Medium",
    thin: "Poppins-Thin",
  };

  export const status={
    unpaid:1,
    paid:2,
    partially_paid:3,

  }
  export const statusName= {
    1:"unpaid",
    2:"paid",
    3:"partially paid",
  }
  export const RoleStatusName={
   1:"owner",
   2:"manager",
   3:"employee",
   4:"viewer",

  }
  export const roleStatus= {
    owner:1,
    manager:2,
    employee:3,
    viewer:4
  }


export const ButtonColor  = {
  SubmitBtn :"#007bff",
  DeleteBtn:"rgba(0, 0, 6, 0.5)"
}


const getTodaysDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = today.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  // Ensure we have a valid date
  if (isNaN(date.getTime())) {
    return ""; // Return empty string or a default value if invalid date
  }
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
};

export const generatePDF = (values) => {
  console.log("values of formdata is , ", values);
  console.log("values of formdata is 587, ", values?.products);
  const productDetails = values?.products
    ?.map(
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
                  values?.customerData?.phone || "N/A"
                } <br>
                <strong>Address:</strong> ${values?.customerData?.address || "N/A"}
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