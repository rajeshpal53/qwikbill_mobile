import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { Button, ActivityIndicator, FAB, PaperProvider } from "react-native-paper";
import InvoiceCard from "../Components/InvoiceCard";
import { AuthContext } from "../Store/AuthContext";
import { readApi } from "../Util/UtilApi";
import { useIsFocused } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
export default function Invoice({ navigation }) {
  const { logout } = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [invoices, setInvoices] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await readApi("api/invoice/list");
        setInvoices(response.result);
      } catch (error) {
        console.error("error", error);
        console.log(response);
        logout();
        navigation.navigate("StackNavigator", { screen: "login" });
        throw new Error("Network response was not ok", response);
      }
    }
    fetchData();
  }, [isFocused]);
  const addInvoiceHandler = () => {
    navigation.navigate("StackNavigator", { screen: "AddInvoice" });
  };
  return (

    <View contentContainerStyle={styles.container}>  
     <FAB icon={() => <Icon name="add-outline" size={20} color="white" />}
     theme={{ colors: { primary: '#fff' } }}
        style={styles.fab}
        color="white"
        onPress={addInvoiceHandler}
        label="Add New Invoice"
        labelStyle={{color:"#ffffff"}}
       />   
    <ScrollView contentContainerStyle={{paddingBottom:"20%"}} >
      {invoices ? (
        <InvoiceCard
          invoices={invoices}
          navigation={navigation}
          setInvoices={setInvoices}
        
        />
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>
      )}
    </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  fabLabel:{
      color:"floralwhite"
  },
  text: {
    fontSize: 24,
  },
  addButton: {
    color: "floralwhite ",
    backgroundColor: "#96214e",
    marginVertical: 20,
  
  },
  // fab: {
  //   position: 'absolute',
  //   right: 16,
  //   bottom: 16,
  //   zIndex:1000
  // },
    fab: {
    position: "absolute",
    margin: 13,
    right: 0,
    bottom: 0,
    color: "floralwhite ",
    backgroundColor: "#96214e",
    zIndex:100,
    color:"white"
  },
});
