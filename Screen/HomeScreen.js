import React from "react";
import { View, Text } from "react-native";
import {
  SafeAreaView,
  StatusBar,
  Platform,
  StyleSheet,
  FlatList,
} from "react-native";

import {
  MaterialCommunityIcons,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import { TextInput } from "react-native-paper";

const services = [
  {
    name: "My Accounts",
    icon: <MaterialCommunityIcons name="account" size={30} color="#0c3b73" />,
    key: "1",
  },
  {
    name: "Fund Transfer",
    icon: <FontAwesome5 name="money-bill-alt" size={30} color="#0c3b73" />,
    key: "2",
  },
  {
    name: "Card Services",
    icon: <Ionicons name="card" size={30} color="#0c3b73" />,
    key: "3",
  },
  {
    name: "UPI",
    icon: <Ionicons name="md-send" size={30} color="#0c3b73" />,
    key: "4",
  },
  {
    name: "Utility Payments",
    icon: (
      <MaterialCommunityIcons name="file-document" size={30} color="#0c3b73" />
    ),
    key: "5",
  },
  {
    name: "Market Place",
    icon: <FontAwesome5 name="store" size={30} color="#0c3b73" />,
    key: "6",
  },
  {
    name: "Cheque Services",
    icon: (
      <MaterialCommunityIcons
        name="check-box-outline"
        size={30}
        color="#0c3b73"
      />
    ),
    key: "7",
  },
  {
    name: "Insurance",
    icon: <FontAwesome5 name="shield-alt" size={30} color="#0c3b73" />,
    key: "8",
  },
  {
    name: "Favourites",
    icon: <Ionicons name="heart-outline" size={30} color="#0c3b73" />,
    key: "9",
  },
  {
    name: "Deposits",
    icon: <FontAwesome5 name="piggy-bank" size={30} color="#0c3b73" />,
    key: "10",
  },
  {
    name: "Recharge",
    icon: <Ionicons name="battery-charging" size={30} color="#0c3b73" />,
    key: "11",
  },
  {
    name: "Investment/ASBA",
    icon: <Ionicons name="trending-up" size={30} color="#0c3b73" />,
    key: "12",
  },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TextInput></TextInput>
          <Text style={styles.headerText}>Welcome YOGESH D GAHANE</Text>
          <Text style={styles.subHeaderText}>
            Last Login: 14 Jul 2024, 12:49 AM
          </Text>
        </View>
        <View style={styles.balanceContainer}>
          <Text style={styles.accountNumber}>2070100000085650</Text>
          <Text style={styles.balance}>₹ 924.56</Text>
        </View>
        <FlatList
          data={services}
          numColumns={4}
          renderItem={({ item }) => (
            <View style={styles.item}>
              {item.icon}
              <Text style={styles.itemText}>{item.name}</Text>
            </View>
          )}
          keyExtractor={(item) => item.key}
          key={4}
          // ItemSeparatorComponent={<View style={{height:10}} />}
          ListEmptyComponent={<Text>No Items Found</Text>}
          // ListHeaderComponent={<Text style={styles.listHeader}>List</Text>}
          // ListFooterComponent={<Text>List end</Text>}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    // backgroundColor:"blue"
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#0c3b73",
    padding: 15,
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  subHeaderText: {
    color: "#fff",
    fontSize: 14,
    marginTop: 5,
  },
  balanceContainer: {
    backgroundColor: "#fff",
    padding: 20,
    marginVertical: 10,
    alignItems: "center",
  },
  accountNumber: {
    fontSize: 16,
    color: "#0c3b73",
  },
  balance: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 5,
  },
  item: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemText: {
    marginTop: 5,
    fontSize: 10,
    textAlign: "center",
    color: "#0c3b73",
  },
  listHeader:{
    textAlign:"center",
    marginBottom:5,
    fontSize:10
  }
});
