import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card, Icon, IconButton, Text } from "react-native-paper";
import { useSnackbar } from "../Store/SnackbarContext";
import DeleteModal from "../UI/DeleteModal";
import { deleteApi } from "../Util/UtilApi";
function InvoiceCard({ invoices, navigation, setInvoices }) {
  const [visible, setVisible] = useState(false);
  const [invoiceId, setInvoiceId] = useState("");
  const { showSnackbar } = useSnackbar();

  function detailInvoice(id) {
    navigation.navigate("InvoiceDetail", {
      invoiceId: id,
    });
  }
  function EditInvoice(id) {
    navigation.navigate("EditInvoice", {
      invoiceId: id,
    });
  }
  function deleteInvoiceHandler(id) {
    setInvoiceId(id);
    setVisible(true);
  }

  const handleDelete = async () => {
    // Your delete logic here
    console.log(invoiceId);

    try {
      // const headers = {
      //   "Content-Type": "application/json",
      // };
      const response = await deleteApi(`api/invoice/delete/${invoiceId}`);
      const updatedInvoice = invoices.filter((item) => item._id !== invoiceId);
      console.log("item delted");
      showSnackbar("item delete successfully", "success");
      setInvoices(updatedInvoice);
    } catch (error) {
      console.error("Failed to delete the item :", error);
      showSnackbar("Failed to delete the item", "error");
    } finally {
      setVisible(false);
    }
  };
  return (
    <View>
      {invoices.map(
        (item, index) =>
          item &&
          item.people && (
            <Card
              key={index}
              style={styles.card}
              onPress={() => detailInvoice(item._id)}
            >
              <Card.Title title={item.date} titleStyle={styles.cardTitle} />
              <Card.Content>
                <Text variant="headlineLarge">{item?.people?.firstname}</Text>
                <Text variant="bodyMedium" style={styles.cardText}>
                  {" "}
                  {/* {item.client.people.phone} */}
                </Text>
              </Card.Content>
              {/* <NestedList data={item.items}/> */}

              {item.items.map((newItem) => (
                <View key={newItem._id}>
                  <Text variant="labelSmall" style={styles.cardText}>
                    {"items: " +
                      newItem.itemName +
                      ", price: " +
                      newItem.price +
                      ", quantity: " +
                      newItem.quantity}
                  </Text>
                </View>
              ))}
              <Card.Actions>
                <IconButton
                  icon="delete"
                  iconColor="#0c3b73"
                  size={20}
                  onPress={() => deleteInvoiceHandler(item._id)}
                />
                {visible && (
                  <DeleteModal
                    visible={visible}
                    setVisible={setVisible}
                    handleDelete={handleDelete}
                  />
                )}
                <Button
                  style={{ backgroundColor: "#0c3b73" }}
                  onPress={() => EditInvoice(item._id)}
                >
                  <Icon source="pencil" color="white" size={20} /> Edit
                </Button>
              </Card.Actions>
            </Card>
          )
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  cardTitle: {
    color: "gray",
  },
  card: {
    marginVertical: 10,
  },
  cardText: {
    marginVertical: 5,
  },
});
export default InvoiceCard;
