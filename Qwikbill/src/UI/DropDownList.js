import React, { useContext, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { List, ActivityIndicator } from "react-native-paper";
import { ShopContext } from "../Store/ShopContext";

function DropDownList({ options, disabled }) {
  const { selectedShop, updateSelectedShop } = useContext(ShopContext);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const selectedLabel = selectedShop
    ? `${selectedShop.vendor.shopname} (by ${selectedShop.role?.name})`
    : "Select Shop *";

  const handleSelect = (item) => {
    updateSelectedShop(item);
    setDropdownVisible(false);
  };

  return (
    <View style={styles.container}>
      {isLoading && <ActivityIndicator size="small" />}
      <List.Accordion
        title={selectedLabel}
        expanded={dropdownVisible}
        onPress={() => !disabled && setDropdownVisible(!dropdownVisible)}
        style={[
          styles.accordion,
          { opacity: disabled ? 0.5 : 1 },
        ]}
        disabled={disabled}
      >
        <ScrollView
          nestedScrollEnabled
          style={styles.scrollArea}
          contentContainerStyle={{ paddingBottom: 10 }}
        >
          {options?.map((item) => (
            <List.Item
              key={item.vendor.id}
              title={`${item.vendor.shopname ?? "Unnamed"} (by ${item.role?.name})`}
              onPress={() => handleSelect(item)}
              style={[
                styles.listItem,
                selectedShop?.vendor?.id === item.vendor.id && styles.selectedItem,
              ]}
            />
          ))}
        </ScrollView>
      </List.Accordion>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 10,
  },
  accordion: {
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.3)",
  },
  scrollArea: {
    maxHeight: 400,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.3)",
  },
  listItem: {
    backgroundColor: "transparent",
  },
  selectedItem: {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
});

export default DropDownList;