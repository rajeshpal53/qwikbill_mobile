import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { fontSize } from "../Util/UtilApi";
import Icon from "react-native-vector-icons/FontAwesome"; // Import the Icon component
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Import MaterialCommunityIcons

const AddroleDropdown = ({
  paymentStatuses,
  setSelectedStatus,
  selectedStatus,
  userRole
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  // const [selectedStatus, setSelectedStatus] = useState('Select payment');
  // const paymentStatuses = ['Unpaid', 'Paid', 'Partially Paid'];

  // Toggle the visibility of the modal
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  // Select an item and close the modal
  const selectStatus = (status) => {
    if(userRole){
      userRole(status)
    }
    setSelectedStatus(status);
    toggleModal(); // Close the modal
  };

  return (
    <View style={styles.container}>
      {/* Custom Dropdown Button */}
      <TouchableOpacity style={styles.dropdownButton} onPress={toggleModal}>
        <Text style={styles.dropdownText}>{selectedStatus}</Text>
        {/* Right-side dropdown icon */}
        <Icon name="caret-down" size={15}  style={styles.icon} />
      </TouchableOpacity>

      {/* Modal for Dropdown */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleModal} // Close modal when the back button is pressed (on Android)
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={paymentStatuses}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.modalItem, {backgroundColor: selectedStatus == item ? "rgba(0, 0, 0, 0.2)" : "#fff"}]}
                  onPress={() => selectStatus(item)} // Set selected item and close modal
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "#fff",
    width: "100%",
  },

  dropdownButton: {
    flexDirection: "row", // Align text and icon horizontally
    justifyContent: "space-between", // Space out text and icon
    alignItems: "center", // Center vertically
    paddingVertical: 8,
    // borderRadius: 10,
    // borderWidth: 1, // Add border to button if needed
    borderColor: "#ddd", // Border color for the dropdown
    // paddingHorizontal: 12, // Add some padding around text and icon
  },
  icon: {
    marginRight: 20, // Add space between text and icon
  },

  dropdownText: {
    // fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "Poppins-Medium",
    fontSize: fontSize.labelMedium,
    paddingHorizontal:10
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // Overlay background color
  },
  modalContent: {
    backgroundColor: "#fff",
    width: 250,
    borderRadius: 8,
    overflow:"hidden",
    // padding: 10,
    elevation: 5, // Shadow for Android
  },
  modalItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor:"orange",
    padding:10
  },
  modalItemText: {
    fontSize: 16,
    color: "#333",
  },
});

export default AddroleDropdown;
