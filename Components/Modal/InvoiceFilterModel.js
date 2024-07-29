import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FAB } from 'react-native-paper';
// import { Modal } from 'react-native';
import Modal from 'react-native-modal'

export default function InvoiceFilterModel({isModalVisible, setModalVisible, toggleModal}) {
  

//   const toggleModal = () => {
//     setModalVisible(!isModalVisible);
//   };

  return (
    <View style={styles.container}>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal} // Close the modal when clicking outside
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={toggleModal} style={styles.option} >
            <Text>Paid</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleModal}  style={styles.option}>
            <Text>Unpaid</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleModal}  style={styles.option}>
            <Text>₹ Amount</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleModal} style={styles.option}>
            <Text>Oldest to Newest</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleModal} style={styles.option}>
            <Text>Reset</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    alignItems: 'flex-start',
  },
  option: {
    padding: 10,
    marginVertical: 5,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
