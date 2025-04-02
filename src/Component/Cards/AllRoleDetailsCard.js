import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Card } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // for using icons
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook
import { ButtonColor, deleteApi, fontFamily, fontSize } from "../../Util/UtilApi";
import EditRoleModal from "../../Components/Modal/EditRoleModal";
import UserDataContext from "../../Store/UserDataContext";


const AllRoleDetailsCard = ({ item, getRoleData , setRoleId, setVisible}) => {
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [selectedRole, setselectedRole] = useState(null);


  const {userData} = useContext(UserDataContext)

  useEffect(() => {
    console.log("DATA OF ITEM IS123 ", item);
  }, [item]);

  const HandleEditRole = (item) => {
    setEditModalVisible(true);
    console.log("Edit item is ", item);
    setselectedRole(item);
  };

  const HandleRole = (item) =>{
    console.log("Data of is is ", item)
    setRoleId(item?.id)
    setVisible(true);

  }

  const closeEditModal = () => {
    setEditModalVisible(false);
    setselectedRole(null);
    getRoleData();
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
            <View
              style={{
                paddingHorizontal: 5,
                borderRadius: 10,
                alignItems: "center",
                backgroundColor: "#EFF6FF",
              }}
            >
              <Text style={{ color: "#2563EB" }}>
                {item?.role?.name
                  ? item.role.name.charAt(0).toUpperCase() +
                    item.role.name.slice(1)
                  : "No Role Provided"}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="phone"
                size={18}
                color="#4B5563"
              />
            </View>
            <View>
              <Text style={styles.label}>
                {item?.user?.mobile || "No Role Provided"}
              </Text>
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
            <TouchableOpacity
              style={styles.button}
              onPress={() => HandleEditRole(item)}
            >
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
              onPress={() => HandleRole(item) }
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

          {isEditModalVisible && (
            <EditRoleModal
              visible={isEditModalVisible}
              onClose={closeEditModal}
              selectedRole={selectedRole}
            />
          )}
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
    color: "#4B5563",
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
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "rgba(0, 0, 6, 0.5)",
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
