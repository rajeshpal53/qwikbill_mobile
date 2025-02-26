import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { readApi } from "../../Util/UtilApi";

const CategoryDropDown = ({setSelectedCat}) => {
  const [pressed, setPressed] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Selected Category");

  const handlePress = () => {
    setPressed(!pressed);
  };


  useEffect(() => {
    const getCategory = async () => {
      try {
        const api = `qapi/product-categories/`;
        const response = await readApi(api);
        setCategoryData(response);
      } catch (error) {
        console.log("Unable to fetch data", error);
      }
    };
    getCategory();
  }, []);

  const handleCategorySelect = (categoryName) => {
    console.log("Data of cat is ",categoryName)
    setSelectedCategory(categoryName?.name);
    setSelectedCat(categoryName?.id)
    setPressed(false); // Collapse the dropdown after selecting a category
  };

  return (
    <ScrollView>
      <View style={styles.main}>
        <TouchableOpacity onPress={handlePress} style={styles.button}>
          <Text style={styles.text}>{selectedCategory}</Text>
          <MaterialIcons
            name={pressed ? "keyboard-arrow-up" : "keyboard-arrow-down"}
            size={24}
            color="black"
          />
        </TouchableOpacity>

        {/* Show the dropdown container below the button */}
        {pressed && (
          <View style={styles.dropdownContainer}>
            {categoryData.map((category) => (
              <TouchableOpacity
                key={category.id} // Assuming each category has a unique ID
                onPress={() => handleCategorySelect(category)}
                style={styles.dropdownItem}
              >
                <Text>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  main: {
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 5,
    // marginBottom:10,
    borderColor:"#A9A9A9"
},
  button: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",

  },
  text: {
    fontSize: 16,
    marginRight: 10,
    flex: 1,
  },
  dropdownContainer: {
    borderTopWidth: 0,
    marginTop: 10,
    borderRadius: 5,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 5,

  },
});

export default CategoryDropDown;
