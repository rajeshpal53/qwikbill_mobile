import { useRoute } from '@react-navigation/native'
import React from 'react'
import {View,Text} from "react-native";
import { WebView } from "react-native-webview";
import { generatePDF } from '../../Util/UtilApi';
function InvoicePreviewScreen() {
    const route=useRoute()
    const {params}=route.params||{};
    console.log(params,"paramsss")
  return (
    <View>
         <WebView
        originWhitelist={["*"]}
        source={{ html: generatePDF(params) }} // Pass formData to the PDF generation function
        style={{ height: "100%" }}
      />
    </View>
  )
}

export default InvoicePreviewScreen
