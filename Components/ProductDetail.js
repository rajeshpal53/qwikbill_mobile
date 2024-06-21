import { Card, Text } from "react-native-paper";
import { StyleSheet, View } from "react-native";
function ProductDetail({ detail }) {
  return (
    <View style={styles.container}>
      <Card>
        <Card.Content>
          <Text variant="headlineLarge" style={styles.label}>
            Name
          </Text>
          <Text variant="headlineLarge" style={styles.value}>
            {detail.name}
          </Text>

          <Text variant="labelSmall" style={styles.cardText}>
            ${detail.price}
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
});

export default ProductDetail;
