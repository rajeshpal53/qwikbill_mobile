import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {  Button, Dialog, Portal, Paragraph } from 'react-native-paper';
const DeleteModal = ({visible,setVisible, handleDelete}) => {
    const hideDialog = () => setVisible(false);
  return (
    <View style={styles.container}>
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Title>Confirm Delete</Dialog.Title>
        <Dialog.Content>
          <Paragraph>Are you sure you want to delete this item?</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog}>Cancel</Button>
          <Button onPress={handleDelete}>OK</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
  });

export default DeleteModal
