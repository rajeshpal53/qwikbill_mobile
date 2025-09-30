
import { View, StyleSheet, Pressable } from "react-native";
import { Text, Card } from "react-native-paper";
import { statusName } from "../Util/UtilApi";
import { useTheme } from "../../constants/Theme";
import { Menu, IconButton } from "react-native-paper";
import { useState } from "react";

const ViewInvoiceCard = ({
  invoice,
  navigation,
  setInvoiceId,
  setVisible,
  isSelected,
  onSelect,
  onLongSelect,
  selectionMode,
  cloneInvoiceHandler
}) => {
  const { colors, isDark } = useTheme();
  const styles = makeStyles(colors);
  const [menuVisible, setMenuVisible] = useState(false);

    const  toggleHandler = () => setMenuVisible(!menuVisible);

  return (
    <Pressable
      onPress={() => {
        if (selectionMode) {
          onSelect();
        } else {
          navigation.navigate("PDFScreen", { viewInvoiceData: invoice });
        }
      }}
      onLongPress={onLongSelect}
    >
      <Card
        style={[
          styles.card,
          {
            backgroundColor: colors.background,
            shadowColor: isDark ? "#ffffff30" : "#000000",
          },
          isSelected && {
            borderColor: colors.primary,
            backgroundColor: colors.secondary + "22", // ✅ faint tint for selected
          },
        ]}
      >
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
           <View style={styles.headerRight}>
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

    <Menu
     style={{ margin: 0, padding: 0 ,backgroundColor:colors.background}} 
      visible={menuVisible}
      onDismiss={toggleHandler}
      anchor={
        <IconButton
          style={{ margin: 0, padding: 0 }}
          icon="dots-vertical"
          size={20}
          onPress={toggleHandler}
        />
      }
      contentStyle={{ backgroundColor: colors.background }} 
    >
      <Menu.Item
    style={{ backgroundColor: colors.background }}
    onPress={()=>{cloneInvoiceHandler(invoice,toggleHandler)}}
    title="Clone Invoice"
    leadingIcon="file-document-outline"   // 👈 Material icon name
  />
  
  <Menu.Item
    onPress={() => {
      console.log("Delete pressed");
      toggleHandler();
    }}
    title="Delete"
    leadingIcon="delete"         // 👈 icon for delete
     // optional text color
  />
    </Menu>
  </View>
         
        </View>

        {/* Middle Content */}
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.customerName}>
              {invoice?.user?.name || "User Name"}
            </Text>
            <Text style={styles.date}>Payment: {invoice?.paymentMode}</Text>
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
      borderWidth: 1.2, // to show selection border
      borderColor: "transparent",
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
    headerRight: {
  flexDirection: "row",
  alignItems: "center",
},
    status: {
      fontSize: 14,
      fontWeight: "bold",
      marginRight:0,
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
