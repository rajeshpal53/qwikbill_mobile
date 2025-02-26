import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";

const FilterButtons = () => {
  const [selected, setSelected] = useState("All");

  const filters = ["All", "Paid", "Unpaid", "Partially Paid"];

  return (
    <View style={{ flexDirection: "row", padding: 10 }}>
      <FlatList
        data={filters}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelected(item)}
            style={{
              backgroundColor: selected === item ? "#6200EA" : "#F1F1F1",
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 20,
              marginHorizontal: 5,
            }}
          >
            <Text
              style={{
                color: selected === item ? "white" : "black",
                fontWeight: "bold",
              }}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default FilterButtons;
