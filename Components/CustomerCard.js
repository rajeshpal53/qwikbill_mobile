import React, { useState, useContext } from "react";
import { Button, Card, Text } from "react-native-paper";
import { IconButton, Icon } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import DeleteModal from "../UI/DeleteModal";
import { CustomerContext } from "../Store/CustomerContext";
import { useSnackbar } from '../Store/SnackbarContext'
export default function CustomerCard({ customer, navigation }) {
  const { setCustomer } = useContext(CustomerContext);
  const [visible, setVisible] = useState(false);
  const [customerId, setCustomerId] = useState("")
  const{showSnackbar}=useSnackbar()
  function deleteCustomerDelete(id) {
    setCustomerId(id);
    setVisible(true);
  }
  const handleDelete = async () => {
    const updateCustomer = customer.filter((item) => item._id !== customerId);
    setCustomer(updateCustomer);
    setVisible(false);
    try {
      const response = await fetch(
        `http://192.168.1.6:8888/api/people/delete/${customerId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (response.ok) {
        console.log("item delted");
        showSnackbar("item delete successfully","success")

      }
    } catch (error) {
      console.error("Error:", error);
      showSnackbar("Failed to delete the item","error")

    }
  };
  function customerDetail(id) {
    navigation.navigate("CustomerDetail", {
      customerId: id,
    });
  }
  function editCustomerhandler(id) {
    navigation.navigate("EditCustomer", {
      customerId: id,
    });
  }
  return (
    <View>
      {customer.map((item, index) => {
        return (
          <Card
            key={index}
            style={styles.card}
            onPress={() => {
              customerDetail(item._id);
            }}
          >
            <Card.Title title={item.created} titleStyle={styles.cardTitle} />
            <Card.Content>
              <Text variant="headlineLarge">
                {`${item.firstname} ${item.lastname}`}
              </Text>
              <Text variant="bodyMedium" style={styles.cardText}>
                {" "}
                {item.phone}
              </Text>
              <Text variant="labelSmall" style={styles.cardText}>
                {" "}
                {item.email}
              </Text>
            </Card.Content>
            <Card.Actions>
              <IconButton
                icon="delete"
                iconColor="#1976d2"
                size={20}
                onPress={() => deleteCustomerDelete(item._id)}
              />
              {visible && (
                <DeleteModal
                  visible={visible}
                  setVisible={setVisible}
                  handleDelete={handleDelete}
                />
              )}
              <Button
                style={{ backgroundColor: "#1976d2" }}
                onPress={() => editCustomerhandler(item._id)}
              >
                <Icon source="pencil" color="white" size={20} /> Edit
              </Button>
            </Card.Actions>
          </Card>
        );
      })}
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
