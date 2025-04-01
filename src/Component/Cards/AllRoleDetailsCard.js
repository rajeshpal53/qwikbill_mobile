import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Card } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // for using icons
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook
import { ButtonColor, fontFamily, fontSize } from "../../Util/UtilApi";

const AllRoleDetailsCard = ({ item }) => {
  const navigation = useNavigation();

  useEffect(() => {
    console.log("DATA OF ITEM IS123 ", item);
  }, [item]);

  const HandleEditRole = () => {
    navigation.navigate("AddroleScreen", {editData: item, isUpdateEditdata: true, });
  };

  const HandleDeleteRole = () => {
    console.log("Delete user is");
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={[styles.row, { marginBottom: 8 }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.usernameText}>
                {item?.user?.name || "No Name Provided"}
              </Text>
            </View>
            <View style={{paddingHorizontal:5, borderRadius:10, alignItems:"center",backgroundColor:"#EFF6FF"}}>
              <Text style={{color:"#2563EB"}}>{item?.role?.name || "No Role Provided"}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="email-outline"
                size={18}
                color="#4B5563"
              />
            </View>
            <View>
              <Text style={styles.label}>
                {item?.user?.email || "No Email Provided"}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="office-building"
                size={18}
                color="#4B5563"
              />
            </View>
            <View>
              <Text style={styles.label}>
                {item?.vendor?.shopname || "No Role Provided"}
              </Text>
            </View>
          </View>

          {/* Buttons with Icons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={HandleEditRole}>
              <MaterialCommunityIcons
                name="pencil"
                size={18}
                color="white"
                style={styles.icon}
              />
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={HandleDeleteRole}
            >
              <MaterialCommunityIcons
                name="trash-can"
                size={18}
                color="white"
                style={styles.icon}
              />
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginVertical: 10,
    backgroundColor: "#ffffff",
    paddingVertical: 8,
  },
  header: {
    marginHorizontal: 15,
    paddingVertical: 5,
  },
  row: {
    flexDirection: "row",
    // marginBottom: 5,
    alignItems: "center",
    marginTop:2
  },
  iconContainer: {
    marginRight: 5,

  },
  usernameText: {
    fontSize: fontSize.labelLarge,
    fontFamily: "Poppins-Regular",
    fontWeight: "bold",
  },
  label: {
    fontSize: fontSize.labelMedium,
    fontFamily: "Poppins-Regular",
    color:"#4B5563"
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ButtonColor.SubmitBtn,
    paddingVertical: 7,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "#e53946",
  },
  buttonText: {
    color: "#fff",
    fontSize: fontSize.labelMedium,
    fontFamily: "Poppins-Regular",
    marginLeft: 5,
  },
  icon: {
    marginRight: 5,
  },
});

export default AllRoleDetailsCard;
