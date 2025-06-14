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

const CustomDropdown = ({
  paymentStatuses,
  setSelectedStatus,
  selectedStatus,
  userRole,
  t
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  // const [selectedStatus, setSelectedStatus] = useState('Select payment');
  // const paymentStatuses = ['Unpaid', 'Paid', 'Partially Paid'];

  console.log("SELECTED PAYMENT ", paymentStatuses)

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
        <Text style={styles.dropdownText}>{t(selectedStatus)}</Text>
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
                  <Text style={styles.modalItemText}>{t(item)}</Text>
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
    backgroundColor: "#fff",
    width: "60%",
  },

  dropdownButton: {
    backgroundColor: "#fff",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingVertical: 2,
    borderRadius: 10,
  },
  dropdownText: {
    // fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "Poppins-Medium",
    fontSize: fontSize.labelMedium,
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

export default CustomDropdown;
