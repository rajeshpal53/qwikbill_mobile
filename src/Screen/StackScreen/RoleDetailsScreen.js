import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // for using icons

const RoleDetailsScreen = ({ route }) => {
  // Get the passed item object from route.params
  const item = route.params;

  console.log("DATA I AM GETTING IN ", item?.item?.item?.user?.name);

  return (
    <View style={style.main}>
      {/* User Profile Section */}
      <View style={style.detailsView}>
        <MaterialCommunityIcons name="account-circle" size={80} color="#0c3b73" />
        {/* Display user name dynamically */}
        <Text style={style.userName}>{item?.item?.user?.name}</Text>
      </View>

      {/* Details Section */}
      <View style={style.detailsContainer}>
        {/* Use dynamic data from item */}
        <DetailRow label="Name" value={item?.item?.user?.name || "N/A"} />
        <DetailRow label="Role" value={item?.item?.role?.name || "N/A"} />
        <DetailRow label="Email" value={item?.item?.user?.email || "N/A"} />
        <DetailRow label="Vendor" value={item?.item?.vendor?.shopname || "N/A"} />
        {/* <DetailRow label="Created At" value={item?.item?.createdAt || "N/A"} />
        <DetailRow label="Updated At" value={item?.item?.updatedAt || "N/A"} /> */}
      </View>

      {/* Button Section */}
      <View style={style.ButtonView}>
        <TouchableOpacity style={style.button} onPress={() => { console.log("Edit Button pressed") }}>
          <Text style={style.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[style.button, style.deleteButton]} onPress={() => { console.log("Delete Button pressed") }}>
          <Text style={style.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Reusable Detail Row component
const DetailRow = ({ label, value }) => (
  <View style={style.detailRow}>
    <Text style={style.label}>{label}</Text>
    <Text style={style.value}>{value}</Text>
  </View>
);

const style = StyleSheet.create({
  main: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  detailsView: {
    alignItems: "center",
    marginBottom: 30,
    paddingVertical: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  userName: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  detailsContainer: {
    marginBottom: 40,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  label: {
    fontSize: 16,
    color: "#555",
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  ButtonView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#0c3b73",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#e53935", // Red color for delete
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default RoleDetailsScreen;
