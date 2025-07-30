import { useContext, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import { ActivityIndicator, List } from "react-native-paper";
import { ShopContext } from "../Store/ShopContext";

const windowHeight = Dimensions.get("window").height;

function DropDownList({ options, disabled }) {
  const { selectedShop, updateSelectedShop } = useContext(ShopContext);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const selectedLabel = selectedShop
    ? `${selectedShop.vendor.shopname} (by ${selectedShop.role?.name})`
    : "No shop Added";

  const handleSelect = (item) => {
    updateSelectedShop(item);
    setDropdownVisible(false);
  };

  return (
    <View style={styles.wrapper}>
      {/* Full-screen transparent overlay to detect outside taps */}
      {dropdownVisible && (
        <Pressable
          style={styles.overlay}
          onPress={() => setDropdownVisible(false)}
        />
      )}

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
          {selectedShop && (
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
          )}
        </List.Accordion>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    zIndex: 999,
    width: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    height: windowHeight,
    backgroundColor: "transparent",
    zIndex: 1,
  },
  container: {
    position: "absolute",
    top: -35,
    left: 40,
    right: 0,
    backgroundColor: "transparent",
    width: "90%",
    marginTop: 11,
    zIndex: 2, // above overlay
  },
  accordion: {
    backgroundColor: "white",
    borderBottomWidth: 0,
    paddingVertical: 0,
  },
  scrollArea: {
    maxHeight: 300,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.3)",
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  listItem: {
    backgroundColor: "transparent",
  },
  selectedItem: {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
});

export default DropDownList;
