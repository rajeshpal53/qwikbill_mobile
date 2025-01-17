import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Card, Avatar } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const CustomerDetailsCard = ({ item, onEdit }) => {
  const [Opendetails, setOpendetails] = useState(false);
  const navigation = useNavigation();

  return (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate("CustomerDetails", { item: item })}
    >
      <Card.Title
        title={item.Name}
        subtitle={item.Number}
        left={(props) =>
          item.Img !== "null" ? (
            <Avatar.Image
              size={50}
              source={item.Img}
              style={styles.avatar}
            />
          ) : (
            <Avatar.Text
              size={50}
              label={item.Name.charAt(0)}
              style={styles.avatarPlaceholder}
            />
          )
        }
        right={(props) => (
          <TouchableOpacity
            onPress={() => onEdit("Edit button pressed", item)}
            style={styles.editIcon}
          >
            <Text>
              <MaterialIcons name={"edit"} size={24} color={"#1E88E5"} />
            </Text>
          </TouchableOpacity>
        )}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 5,
    marginHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 8,
    elevation: 3,
  },
  avatar: {
    backgroundColor: "#fff",
  },
  avatarPlaceholder: {
    backgroundColor: "#ccc",
  },
  editIcon: {
    marginRight: 10, // Adds spacing from the edge
  },
});

export default CustomerDetailsCard;
