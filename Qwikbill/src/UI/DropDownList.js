import { useContext, useState } from "react";
import { Keyboard, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { ActivityIndicator, List } from "react-native-paper";
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
    <TouchableWithoutFeedback
    onPress={() => {
      if (dropdownVisible) {
        setDropdownVisible(false);
        Keyboard.dismiss(); // just in case keyboard is open
      }
    }}
  >
    <View style={styles.container}>
      {isLoading && <ActivityIndicator size="small " />}
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
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: -20, // adjust based on where you want to show it
    left: 40,
    right: 0,
    zIndex: 999, // 👈 ensures it appears on top
    // elevation: 10, // Android support
    backgroundColor: "transparent",
    width: "90%",
    // height: 58,
    marginTop:10,
    
  },
  accordion: {
    backgroundColor: "#fff",
    borderBottomWidth: 0,
    borderBottomColor: "rgba(0, 0, 0, 0.3)",
    paddingVertical:0,
    borderBottomLeftRadius:10,
  },
  scrollArea: {
    maxHeight: 300,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.3)",
    backgroundColor: "#fff",
    borderRadius:10,
  },
  listItem: {
    backgroundColor: "transparent",
  },
  selectedItem: {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
});


export default DropDownList;
