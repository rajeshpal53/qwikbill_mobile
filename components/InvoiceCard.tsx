import React from "react";
import { Button, Card, Text } from "react-native-paper";
import { IconButton, Icon } from "react-native-paper";
import { StyleSheet,View } from "react-native";

function InvoiceCard() {
  return (
    <View>
      <Card>
        <Card.Title title="Date:11-05-2024" titleStyle={styles.cardTitle} />
        <Card.Content>
          <Text variant="headlineLarge"> Faizan Shaikh</Text>
          <Text variant="bodyMedium" style={styles.cardText}>
            {" "}
            price:$1234500
          </Text>
          <Text variant="labelSmall" style={styles.cardText}>
            {" "}
            items: headphone, fan bulb{" "}
          </Text>
        </Card.Content>
        <Card.Actions>
          <IconButton
            icon="delete"
            iconColor="#1976d2"
            size={20}
            onPress={() => console.log("Pressed")}
          />
          <Button style={{ backgroundColor: "#1976d2" }}>
            <Icon source="pencil" color="white" size={20} /> Edit
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
}
const styles = StyleSheet.create({
  cardTitle: {
    color: "gray",
  },
  cardText: {
    marginVertical: 5,
  },
});

export default InvoiceCard;
