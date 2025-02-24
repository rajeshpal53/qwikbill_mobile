import React from "react";
import { Dialog, Portal, Button, Text } from "react-native-paper";
import { StyleSheet } from "react-native";

// Custom Filter Modal Component
const CustomeFilterDropDown = ({
  visible,
  onDismiss,
  filterOptions,
  onSelectFilter,
}) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Filter Options</Dialog.Title>
        <Dialog.Content>
          {filterOptions.map((item, index) => (
            <Button
              key={index}
              mode="text"
              onPress={() => onSelectFilter(item)}
              style={styles.filterButton}
            >
              {item}
            </Button>
          ))}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Close</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  filterButton: {
    padding: 10,
  },
});

export default CustomeFilterDropDown;
