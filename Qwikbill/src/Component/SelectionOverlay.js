import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const SelectionOverlay = ({ selectedProducts, onDelete, onClearSelection }) => (
  <View style={overlayStyles.container}>
    <View style={overlayStyles.overlayBox}>
      {/* Left Section: Selected Count */}
      <Text style={overlayStyles.itemText}>
        Selected: {selectedProducts.length}
      </Text>

      <View style={overlayStyles.actionRow}>
        {/* Clear Selection (Cross) */}
        <TouchableOpacity
          style={overlayStyles.clearButton}
          onPress={onClearSelection}
        >
          <MaterialIcons name="close" size={20} color="red" />
        </TouchableOpacity>

        {/* Delete Button */}
        <TouchableOpacity
          style={overlayStyles.deleteButton}
          onPress={onDelete}
        >
          <MaterialIcons name="delete" size={18} color="white" />
          <Text style={overlayStyles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const overlayStyles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: "8%",
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
  },
  overlayBox: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#00796B",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  clearButton: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 6,
    borderWidth: 1,
    borderColor: "red",
    marginRight: 10,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "red",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 6,
  },
});

export default SelectionOverlay;
