import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Card, Avatar } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const ProductDetailsCard = ({ item }) => {
  const [Opendetails, setOpendetails] = useState(false);
  const navigation = useNavigation();

  return (
    <ScrollView>
      <Card style={styles.card}>
        <View style={styles.container}>
          <View style={styles.ImageView}>
            {item.Img !== "null" ? (
              <Avatar.Image
                size={55}
                source={{ uri: item.Img }}
                style={styles.avatar}
              />
            ) : (
              <Avatar.Text
                size={55}
                label={item.Name.charAt(0)}
                style={styles.avatarPlaceholder}
              />
            )}
          </View>
          <View style={styles.TextView}>
            <Text style={styles.itemname}>{item.Name}</Text>
            <Text style={styles.priceText}>
              Selling Price: ${item["Selling Price"]}
            </Text>
            <Text style={styles.priceText}>
              Market Price: ${item["Market Price"]}
            </Text>
          </View>

          <View style={styles.ButtonTextView}>
            <View style={styles.ButtonView}>
              <View>
                <TouchableOpacity
                  onPress={() => console.log("Edit button clicked")}
                  style={styles.iconButton}
                >
                  <MaterialIcons name="edit" size={24} color="#1E88E5" />
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => console.log("Delete button clicked")}
                  style={styles.iconButton}
                >
                  <MaterialIcons name="delete" size={24} color="#E53935" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.Availabletext}>
              <Text style={item.Available ? styles.inStock : styles.outOfStock}>
                {item.Available
                  ? `In Stock(${item.itemCount})`
                  : "Out of Stock"}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 5,
    marginHorizontal: 10,
    // paddingVertical: 15,
    borderRadius: 8,
    elevation: 3,
    flex: 1,

    // alignContent:"center"
  },
  container: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 10,
    marginVertical:5,

  },
  ImageView: {
    paddingHorizontal: 7,
    marginLeft: 5,
  },
  TextView: {
    flex: 2,
  },
  ButtonTextView: {
    justifyContent: "space-between",
    flex: 1,
    marginRight:5
    // borderWidth: 2,
  },
  ButtonView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  itemname:{
    fontWeight:"bold",
    marginVertical:2,
  },
  avatar: {
    backgroundColor: "#fff",
  },
  avatarPlaceholder: {
    backgroundColor: "#ccc",
  },
  iconButton: {
    marginRight: 10, // Adds spacing between buttons
  },
  priceText: {
    fontSize: 14,
    color: "#555",

  },
  inStock: {
    color: "green",
    fontSize: 12,

  },
  outOfStock: {
    color: "red",
    fontSize: 12,
  },
  //   Availabletext:{
  //     marginRight:2
  //   }
});

export default ProductDetailsCard;
