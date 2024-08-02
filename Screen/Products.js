import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import ProductCard from "../Components/ProductCard";
import { ActivityIndicator, Button,FAB} from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import { readApi } from "../Util/UtilApi";
import Icon from "react-native-vector-icons/Ionicons";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { AuthContext } from "../Store/AuthContext";

export default function Products({ navigation }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { searchMode, setSearchMode } = useContext(AuthContext);
  const isFocused = useIsFocused();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await readApi("api/product/list");
        const result = await response;
        setProducts(response.result);
      } catch (Error) {
        throw new Error("Network response was not ok");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [isFocused]);

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  const handleOutsidePress = () => {
    setSearchMode(false);
  };
  return (
    <View  style={styles.container}>
      <View style={{flex:1}}>
      <TouchableWithoutFeedback onPress={handleOutsidePress} style={{height:"100%"}}>

      {products ? (<ProductCard
          products={products}
          navigation={navigation}
          setProducts={setProducts}
        />) : (
          <Text> no Product found</Text>
        )}
        <FAB
        icon={() => <Icon name="add-outline" size={20} color="white" />}
        theme={{ colors: { primary: '#fff' } }}
        color="white"
        style={styles.fab}
        textColor="white"
        onPress={() => {
          navigation.navigate("AddProduct");
        }}
        label="Add New Product"
        labelStyle={{color:"#ffffff"}}
      />
      </TouchableWithoutFeedback>
      </View>
      
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
    // zIndex: 100,
    color: "white",
  },
});
