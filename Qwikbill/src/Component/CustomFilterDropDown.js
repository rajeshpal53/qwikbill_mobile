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



const CustomeFilterDropDown = ({
  filterOptions,
  filtermodal,
  setFilterModal,
  filterData,
  SetFilterData

}) => {
  // const [isModalVisible, setIsModalVisible] = useState(false);
  // const [selectedStatus, setSelectedStatus] = useState('Select payment');
  // const paymentStatuses = ['Unpaid', 'Paid', 'Partially Paid'];

  // Toggle the visibility of the modal
  const toggleModal = () => {
    setFilterModal(!filtermodal);
  };

  // Select an item and close the modal
  const selectStatus = (status) => {
    SetFilterData(status);
    toggleModal(); // Close the modal
  };

  return (
    <View style={styles.container}>
      {/* Modal for Dropdown */}
      <Modal
        visible={filtermodal}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleModal} // Close modal when the back button is pressed (on Android)
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={filterOptions}
              keyExtractor={(index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
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
    padding: 10,
    elevation: 5, // Shadow for Android
  },
  modalItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  modalItemText: {
    fontSize: 16,
    color: "#333",
  },
});

export default CustomeFilterDropDown;
