import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useTranslation } from "react-i18next";

const FilterButtons = ({selected,onFilterChange}) => {
  const { t } = useTranslation();

  const filters = ["All", "Unpaid", "Paid", "Partially Paid" ,"Gst" , "Provisional", "Quotation"];
  return (
    <View style={{ flexDirection: "row", padding: 10 }}>
      <FlatList
        data={filters}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onFilterChange(item)}
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
             {t(item)}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default FilterButtons;
