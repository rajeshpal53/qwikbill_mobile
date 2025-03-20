// import React from "react";
// import { View, Text, StyleSheet,TouchableOpacity, Pressable } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// const TransactionCard = ({ transaction }) => {
//   if (!transaction || !transaction.user || !transaction.invoice) {
//     return null; // Return null if transaction, user, or invoice is missing
//   }
//   const navigation = useNavigation();
//   const { amount, createdAt, transactionStatus, user, invoice } = transaction;
//   const formattedDate = createdAt ? new Date(createdAt).toLocaleDateString() : "N/A";
//   const firstLetter = user.name ? user.name.trim().charAt(0).toUpperCase() : "U";

//   return (
//   <Pressable onPress={()=>{navigation.navigate("TransactionDetailScreen",{transaction})}}>
//     <View style={styles.card}>
//       <View style={styles.avatarContainer}>
//         <Text style={styles.avatar}>{firstLetter}</Text>
//       </View>
//       <View style={styles.infoContainer}>
//         <View style={{flexDirection:'row',justifyContent:'space-between'}}>
//         <Text style={styles.name}>{user.name ? user.name.trim() : "User"}</Text>
//         <Text style={[styles.amount,{color:transactionStatus=="complete"?"green":"red"}]}> ₹{amount ?? "N/A"}</Text>
//         </View>
//         <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:"center"}}>
//         <Text style={styles.date}>Date: {formattedDate}</Text>
//         <Text style={[styles.status,{color:transactionStatus=="complete"?"green":"red"}]}> {transactionStatus ?? "N/A"}</Text>
//         </View>
//         <Text style={styles.address}>Address: {invoice.address ?? "N/A"}</Text>
//       </View>
//     </View>
//     </Pressable>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     padding: 15,
//     borderRadius: 10,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     elevation: 3,
//     margin: 10,
//   },
//   avatarContainer: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: "#007AFF",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 15,
//   },
//   avatar: {
//     fontSize: 20,
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   infoContainer: {
//     flex: 1,
//   },
//   name: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   amount: {
//     fontSize: 16,
//   },
//   status: {
//     fontSize: 16,
//     color: "#555",
//     marginVertical:3
//   },
//   date: {
//     fontSize: 14,
//     color: "#888",
//     marginVertical:4

//   },
//   address: {
//     fontSize: 14,
//     color: "#666",
//   },
// });

// export default TransactionCard;








import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { fontSize,fontFamily } from "../Util/UtilApi";

const TransactionCard = ({ item }) => {
  if (!item) {
    return <Text>No Data Available</Text>;
  }

  const navigation = useNavigation();
  const { amount, createdAt, transactionStatus } = item;
  const userName = item.user?.name ?? "Unknown "; 

  // Providing fallback values
  const formattedDate = createdAt
  ? new Date(createdAt).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  : "N/A";



  const firstLetter = "U"; // Default letter since user.name is missing

  return (
    <Pressable onPress={() => navigation.navigate("TransactionDetailScreen", { item })}>
      <View style={styles.card}>
        <View style={styles.avatarContainer}>
        
            <Feather name="arrow-down-right" size={20} color={"white"}/>
        </View>
        <View style={styles.infoContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between',alignItems:"flex-end" }}>
            <Text style={styles.billText}>Bill to</Text>
            <Text style={[styles.amount, { color: transactionStatus === "complete" ? "green" : "red" }]}> ₹{amount ?? "N/A"}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems:"flex-end" }}>
            <Text style={styles.name}> {userName}</Text>
            <Text style={styles.date}>{formattedDate}</Text>
          </View>
          <Text 
          style={[styles.status,
            //  { color: transactionStatus === "complete" ? "green" : "red" }
            ]}> 
            {transactionStatus ?? "N/A"}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    margin: 10,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatar: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: fontSize.headingSmall,
    fontFamily:fontFamily.medium,
  },
  amount: {
    fontSize:fontSize.headingSmall,
    fontFamily:fontFamily.bold,
    position:"absolute",
    right:5,
    bottom:-12

  },
  status: {
    fontSize:fontSize.labelLarge,
    fontFamily:fontFamily.medium,
    marginLeft:5,
    color:"rgba(0,0,0,0.6)",
    
  },
  date: {
    fontSize: fontSize.labelMedium,
    fontFamily:fontFamily.medium,
    color: "rgba(0,0,0,0.6)",
    marginBottom:-5,
  },
  address: {
    fontSize: 14,
    color: "#666",
  },
  billText:{
    color:"rgba(0,0,0,0.5)",
    fontSize:fontSize.labelMedium,
    fontFamily:fontFamily.regular,
    marginLeft:5

  }
});

export default TransactionCard;
