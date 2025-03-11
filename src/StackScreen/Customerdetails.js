import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { fontFamily, fontSize } from "../Util/UtilApi";
import { MaterialIcons } from "@expo/vector-icons"; // for icons
// import EditCustomerDetailsModal from "../Modal/EditCustomerDetailsModal";
import { useState } from "react";
// import EditCustomerDetailsModal from "../../Modal/EditCustomerDetailsModal";

const CustomerDetails = ({ route, navigation }) => {
  const { item, setCustomerData } = route.params; // Destructure both item and onEdit from route.params
  console.log("Items value", item);
//   const [SelectedEditItem, setSelectedEditItem] = useState(null);
//   const [editmodal, seteditmodal] = useState(false);

  // Function for handling Edit button press
//   const handleEdit = () => {
//     setSelectedEditItem(item);
//     seteditmodal(true);
//   };

//   // Function for handling Delete button press
//   const handleDelete = () => {
//     // Logic to handle deletion goes here
//     console.log("Customer deleted", item.id);
//   };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Title */}
        <Text style={styles.title}>{item?.user?.name ?? "Unknown"}</Text>

        {/* Profile Picture */}
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: item?.user?.profilePicurl }}
            style={styles.profilePic}
          />
        </View>

        {/* Name */}
        <View style={styles.detailRow}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{item?.user?.name ?? "Unknown"}</Text>
        </View>

        {/* Phone */}
        <View style={styles.detailRow}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{item?.user?.mobile ?? "N/A"}</Text>
        </View>

        {/* Email */}
        <View style={styles.detailRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{item?.user?.email ?? "N/A"}</Text>
        </View>

        {/* Address */}
        <View style={styles.detailRow}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>
            {item?.user?.address ?? "Not Provided"}
          </Text>
        </View>

        {/* Action Buttons */}
        {/* <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <MaterialIcons name="edit" size={24} color="#fff" />
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <MaterialIcons name="delete" size={24} color="#fff" />
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View> */}
      </View>
      {/* {editmodal && (
        <EditCustomerDetailsModal
          visible={editmodal}
          seteditmodal={seteditmodal}
          SelectedEditItem={SelectedEditItem}
          setCustomerData={setCustomerData}
        />
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    padding: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    elevation: 8, // Android shadow
    shadowColor: "#aaa", // iOS shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  title: {
    fontSize: fontSize.headingSmall,
    fontFamily: fontFamily.medium,
    textAlign: "center",
    marginBottom: 18,
    color: "#2a2a2a",
    borderBottomWidth: 2,
    borderBottomColor: "#ddd",
    paddingBottom: 12,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#ddd",
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    fontSize: fontSize.labelLarge,
    fontFamily: fontFamily.medium,
    color: "#777",
    fontWeight: "600",
  },
  value: {
    fontSize: fontSize.labelLarge,
    fontFamily: fontFamily.medium,
    color: "#333",
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E88E5",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 5,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E53935",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontFamily: fontFamily.medium,
    fontSize: fontSize.labelLarge,
    marginLeft: 8,
  },
});

export default CustomerDetails;
