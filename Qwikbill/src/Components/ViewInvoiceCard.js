import { View, StyleSheet, Pressable } from "react-native";
import { Text, Card } from "react-native-paper";
import { statusName } from "../Util/UtilApi";
import { useTheme } from "../../constants/Theme";

const ViewInvoiceCard = ({ invoice, navigation }) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors); // 👈 generate theme-aware styles

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
                    ? colors.danger
                    : invoice?.statusfk === 2
                    ? colors.success
                    : colors.warning,
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
          <Text style={styles.footerText}>
            {new Date(invoice?.createdAt).toDateString()}
          </Text>
        </View>
      </Card>
    </Pressable>
  );
};

// 👇 Style generator function
const makeStyles = (colors) =>
  StyleSheet.create({
    card: {
      padding: 14,
      marginVertical: 6,
      marginHorizontal: 16,
      borderRadius: 12,
      elevation: 3,
      backgroundColor: colors.background,
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
      color: colors.text,
    },
    invoiceType: {
      fontSize: 12,
      color: colors.muted,
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
      color: colors.text,
    },
    date: {
      fontSize: 12,
      color: colors.muted,
    },
    finalLabel: {
      fontSize: 12,
      color: colors.muted,
    },
    finalAmount: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.success,
    },
    footerText: {
      fontSize: 13,
      color: colors.muted,
      marginTop: 3,
    },
  });

export default ViewInvoiceCard;
