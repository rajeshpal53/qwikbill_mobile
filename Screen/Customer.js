import React, { useState, useEffect, useContext } from "react";
import { ScrollView, Text, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, FAB } from "react-native-paper";
import CustomerCard from "../Components/CustomerCard";
import { useIsFocused } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { readApi } from "../Util/UtilApi";
export default function Customer({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [customer, setCustomer] = useState([]);
  const isFocused = useIsFocused();
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await readApi("api/people/list");
        const result = await response;
        setCustomer(result.result);
      } catch (error) {
        console.error("error", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [isFocused]);

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }
  return (
    <View style={styles.container}>
      <FAB  icon={() => <Icon name="person-add" size={20} color="white" />}
      theme={{ colors: { primary: '#fff' } }}
      color="white"
       onPress={() => {
        navigation.navigate("AddCustomer");
      }} style={styles.fab}
      label="Add New Customer"
      labelStyle={{color:"#ffffff"}}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: "20%" }}>
        {/* <Button
          style={styles.addButton}
          icon={() => <Icon name="person-add" size={20} color="white" />}
          buttonColor="#ffffff"
          textColor="white"
          onPress={() => {
            navigation.navigate("AddCustomer");
          }}
        >
          {" "}
          Add New Customer
        </Button> */}
        {customer ? (
          <CustomerCard
            customer={customer}
            navigation={navigation}
            setCustomer={setCustomer}
          />
        ) : (
          <Text> no Customer found</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    color: "floralwhite ",
    backgroundColor: "#96214e",
    marginVertical: 20,
  },
  container: {
    flex: 1,
  },
  text: {
    fontSize: 24,
  },
  fab: {
    position: "absolute",
    margin: 13,
    right: 0,
    bottom: 0,
    color: "floralwhite ",
    backgroundColor: "#96214e",
    zIndex: 100,
    color: "white",
  },
});
