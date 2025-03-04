

import React from "react";
import { StyleSheet, Text, TouchableOpacity,View } from "react-native";
import { Card, Avatar } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { fontFamily, fontSize } from "../../Util/UtilApi";
import { API_BASE_URL } from "../../Util/UtilApi";

const CustomerDetailsCard = ({ item, onEdit }) => {
  const navigation = useNavigation();

  const profilePicUrl = item.profilePicurl ? `${API_BASE_URL}${item.profilePicurl}` : null;

  console.log("profile pic url isss ,", profilePicUrl)

  const displayName = item.name ? item.name.trim() : "Unknown";
  const firstLetter = displayName.charAt(0).toUpperCase(); // Ensure it's uppercase


  return (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate("CustomerDetails", { item: item })}
    >
      <Card.Title
        title={displayName}
        subtitle={item.mobile || "No Mobile"}
        titleStyle={styles.title}
        subtitleStyle={styles.subtitle}
        left={() =>
          profilePicUrl ? (
            <Avatar.Image size={50} source={{ uri: profilePicUrl }} style={styles.avatar} />
          ) : (
            <Avatar.Text
              size={60}
              label={firstLetter}
              style={styles.avatarPlaceholder}
            />
          )
        }
      // right={() => (
      //   <TouchableOpacity onPress={() => onEdit(item)} style={styles.editIcon}>
      //     <MaterialIcons name="edit" size={24} color="#1E88E5" />
      //   </TouchableOpacity>
      // )}
      />

      {/* Additional Details */}
      <Card.Content>
        <View style={{marginLeft:75}}>
        <View style={styles.detailsRow}>
          <Text style={[styles.detailsText ,{marginTop:2}]}>{item.gender || "N/A"}</Text>
          <Text style={{marginHorizontal:12,}}>|</Text>
          <Text style={[styles.detailsText ,{marginTop:2}]}>{item.dob || "N/A"}</Text>
        </View>
        
        <Text style={styles.addressText}>{item.address || "No Address Available"}</Text>
        </View>
      </Card.Content>

    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 5,
    marginHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 3,
    backgroundColor: "#fff",
    paddingBottom:1,
    shadowOffset:2
  },
  avatar: {
    backgroundColor: "#fff",
  },
  avatarPlaceholder: {
    backgroundColor: "#ccc",
  },
  editIcon: {
    marginRight: 15,
    marginBottom: 15
  },
  title: {
    fontSize: fontSize.headingSmall,
    marginLeft: 15,
    fontFamily: fontFamily.regular,
    marginTop:8
  },
  subtitle: {
    fontSize: fontSize.labelMedium,
    color: "rgba(0, 0, 0, 0.6)",
    marginLeft: 16,
    fontFamily: fontFamily.regular,
    marginTop:8
  },
  detailsRow: {
    flexDirection: "row",
   // justifyContent: "space-between",
   
  
  },
  detailsText: {
    fontSize: fontSize.label,
    fontFamily: fontFamily.medium,
    color: "rgba(0, 0, 0, 0.6)",
  },
  addressText: {
    fontSize: fontSize.label,
    fontFamily: fontFamily.medium,
    color: "rgba(0, 0, 0, 0.6)",
    marginTop: 8,
  },
});

export default CustomerDetailsCard;
