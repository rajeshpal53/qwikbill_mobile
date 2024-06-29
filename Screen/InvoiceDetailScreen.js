import { lazy, useEffect, useState } from "react";
import { ActivityIndicator, Text } from "react-native-paper";
import { View } from "react-native";
import InvoiceDetail from "../Components/InvoiceDetail";
import { readApi } from "../Util/UtilApi";

function InvoiceDetailScreen({ route }) {
  const invoiceId = route.params.invoiceId;
  const [detail, setDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchDetailHandler() {
      if (invoiceId === undefined) {
        return [];
      }
      try {
        const headers = {
          "Content-Type": "application/json",
        };
        const response = await readApi(
          `api/invoice/read/${invoiceId}`,
          headers
        );
        const data = await response;
        setDetail(data.result);
      } catch (errror) {
        throw new Error("Item not found");
      } finally {
        setLoading(false);
      }
    }
    fetchDetailHandler();
  }, []);

  const copydetail = detail;
  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View>
      <InvoiceDetail detail={copydetail} />
    </View>
  );
}

export default InvoiceDetailScreen;
