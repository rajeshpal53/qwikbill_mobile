import { Text, View, StyleSheet } from "react-native";

const CustomerDetails = ({ route }) => {
    const { item } = route.params;
    console.log("Items value", item)

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Name: <Text style={styles.value}>{item.Name}</Text></Text>
            <Text style={styles.label}>Phone: <Text style={styles.value}>{item.Number}</Text></Text>
            <Text style={styles.label}>Email: <Text style={styles.value}>{item.email}</Text></Text>
            <Text style={styles.label}>Address: <Text style={styles.value}>{item.Address}</Text></Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        margin: 10,
    },
    label: {
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 5,
    },
    value: {
        fontWeight: "normal",
    },
});

export default CustomerDetails;
