import { View, StyleSheet, Pressable } from "react-native";
import { Text, Card } from "react-native-paper";
import { fontSize, statusName } from "../Util/UtilApi";

const ViewInvoiceCard = ({ invoice, navigation }) => {
  return (
    <Pressable
      onPress={() =>
        navigation.navigate("PDFScreen", { viewInvoiceData: invoice })
      }
    >
      <Card style={styles.card}>
        {/* Header Row */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.invoiceNumber}>
              #{invoice?.invoiceNumber || invoice?.id}
            </Text>
            <Text style={styles.invoiceType}>
              {invoice?.type?.toUpperCase() || "INVOICE"}
            </Text>
          </View>
          <Text
            style={[
              styles.status,
              {
                color:
                  invoice?.statusfk === 1
                    ? "red"
                    : invoice?.statusfk === 2
                    ? "green"
                    : "orange",
              },
            ]}
          >
            {statusName[invoice?.statusfk]?.toUpperCase()}
          </Text>
        </View>

        {/* Middle Content */}
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.customerName}>
              {invoice?.user?.name || "User Name"}
            </Text>
            <Text style={styles.date}>
              Payment: {invoice?.paymentMode}
            </Text>
          </View>

          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.finalLabel}>Final Amount</Text>
            <Text style={styles.finalAmount}>₹{invoice?.finaltotal}</Text>
          </View>
        </View>

        {/* Footer Row */}
        <View style={styles.rowBetween}>
                  <Text style={styles.footerText}> {new Date(invoice?.createdAt).toDateString()}</Text>  
        </View>
      </Card>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 14,
    marginVertical: 6,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  invoiceNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  invoiceType: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
  status: {
    fontSize: 13,
    fontWeight: "bold",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
 
  },
  customerName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#000",
  },
  date: {
    fontSize: 12,
    color: "gray",
  },
  finalLabel: {
    fontSize: 12,
    color: "gray",
  },
  finalAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
  },
  footerText: {
    fontSize: 13,
    color: "#555",
    marginTop: 3,
  },

  
});

export default ViewInvoiceCard;
