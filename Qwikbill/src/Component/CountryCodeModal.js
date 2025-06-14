import React from "react";
import { StyleSheet, Text, View, Modal, TouchableOpacity,  TouchableWithoutFeedback } from "react-native";

const CountryCodeModal = ({modalVisible, setModalVisible}) => {
  return (
        <Modal
      transparent={true}
      visible={modalVisible}
    //   animationType="slide"
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Country Code</Text>
          <TouchableOpacity
            style={styles.modalOption}
            onPress={() => {
              // Handle country code selection
              setModalVisible(false);
            }}
          >
            <Text style={styles.modalOptionText}>India  +91</Text>
          </TouchableOpacity>
          {/* Add more country options as needed */}
        </View>
      </View>
      </TouchableWithoutFeedback>
    </Modal>
    
  );
};

export default CountryCodeModal;


const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        width: '80%',
        alignItems: 'center',
      },
      modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
      },
      modalOption: {
        paddingVertical: 10,
        width: 50,
        width:"100%",
        alignItems: 'center',
      },
      modalOptionText: {
        fontSize: 18,
      },
})