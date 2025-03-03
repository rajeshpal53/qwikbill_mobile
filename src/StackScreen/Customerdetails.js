// import { Text, View, StyleSheet } from "react-native";
// import { fontFamily, fontSize } from "../Util/UtilApi";

// const CustomerDetails = ({ route }) => {
//     const { item } = route.params;
//     console.log("Items value", item)

//     return (
//         <View style={styles.container}>
//             <Text style={styles.label}>Name : <Text style={styles.value}>{item.name }</Text></Text>
//             <Text style={styles.label}>Phone: <Text style={styles.value}>{item.mobile}</Text></Text>
//             <Text style={styles.label}>Email: <Text style={styles.value}>{item.email}</Text></Text>
//             <Text style={styles.label}>Address: <Text style={styles.value}>{item.address}</Text></Text>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         padding: 20,
//         backgroundColor: "#f9f9f9",
//         borderRadius: 8,
//         margin: 12,
//     },
//     label: {
//         fontSize:fontSize.labelLarge,
//         marginBottom: 3,
//         fontFamily:fontFamily.regular
//     },
//     value: {
//        // fontWeight: "normal",
//        fontSize:fontSize.labelLarge,
//        fontFamily:fontFamily.regular
//     },
// });

// export default CustomerDetails;







import { Text, View, StyleSheet } from "react-native";
import { fontFamily, fontSize } from "../Util/UtilApi";

const CustomerDetails = ({ route }) => {
    const { item } = route.params;
    console.log("Items value", item);

    return (
        
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Customer Details</Text>

                <View style={styles.detailRow}>
                    <Text style={styles.label}>Name:</Text>
                    <Text style={styles.value}>{item.name ?? "Unknown"}</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.label}>Phone:</Text>
                    <Text style={styles.value}>{item.mobile ?? "N/A"}</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.value}>{item.email ?? "N/A"}</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.label}>Address:</Text>
                    <Text style={styles.value}>{item.address ?? "Not Provided"}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2f2f2",
        padding: 15,
    },
    card: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 18,
        elevation: 5, // Android shadow
        shadowColor: "#000", // iOS shadow
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    title: {
        fontSize: fontSize.headingSmall,
        fontFamily:fontFamily.medium,
        textAlign: "center",
        marginBottom: 12,
        color: "#333",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        paddingBottom: 8,
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5,
    },
    label: {
        fontSize:fontSize.labelLarge,
        fontFamily:fontFamily.medium,
        color: "#555",
    },
    value: {
        fontSize: fontSize.labelLarge,
        fontFamily:fontFamily.medium,
        color: "#555",
    },
});

export default CustomerDetails;
