import * as React from "react";
import { Searchbar } from "react-native-paper";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../Store/AuthContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Pressable } from "react-native";
import { StyleSheet, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const SearchBarComp = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { searchMode, setSearchMode } = useContext(AuthContext);
  const { overlayHeight, setOverlayHeight } = useContext(AuthContext);

  useEffect(() => {
    console.log(searchQuery);
  }, [searchQuery]);



  const toggleSearch = () => {
    setSearchMode(!searchMode);
    // setSearchQuery('');
    if (!searchMode) {
      console.log("searching");
      setOverlayHeight("50%");
    } else {
      console.log("Not searching");
      setOverlayHeight("25%");
    }
  };
  return (
    
    <View style={styles.container}>
      {searchMode ? (
        
        <View style={[styles.inputContainer]}>
          <Searchbar
            style={{ width: "100%" }}
            placeholder="Search"
            onChangeText={setSearchQuery}
            value={searchQuery}
            mode="bar"
          />
        </View>
      ) : (
        <Pressable onPress={toggleSearch} style={styles.icon}>
          <Ionicons
            name={searchMode ? "close" : "search"}
            size={25}
            color="white"
          />
        </Pressable>
      )}
    </View>
  );
};

export default SearchBarComp;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexGrow: 1,
    marginLeft: "14%",
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    //   borderColor:"black"
  },

  icon: {
    padding: 10,
  },
});
