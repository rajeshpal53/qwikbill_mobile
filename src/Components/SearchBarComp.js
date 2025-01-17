import * as React from "react";
import { Searchbar } from "react-native-paper";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../Store/AuthContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Pressable } from "react-native";
import { StyleSheet, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const SearchBarComp = () => {
  const {searchQuery, setSearchQuery}  = useContext(AuthContext);
  const { searchMode, setSearchMode } = useContext(AuthContext);
  const { overlayHeight, setOverlayHeight } = useContext(AuthContext);

  useEffect(() => {
    console.log(searchQuery);
  }, [searchQuery]);

  
  useEffect(() => {

    if(!searchMode){
      setSearchQuery("");
    }
  }, [searchMode])

  // const handleOutsidePress = () => {
  //   if (isSearchBarVisible) {
  //     setIsSearchBarVisible(false);
  //     Keyboard.dismiss(); // This will dismiss the keyboard as well
  //   }
  // };


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

  const handleFocus = () => {
    console.log("focused")
  }
  const handleBlur = () => {
    console.log("blured")
  }
  const handle = () => {
    console.log("trailing")
  }
  return (
    
    <View style={styles.container}>
      {searchMode ? (
        
        <View style={[styles.inputContainer]}>
          <Searchbar
            style={{ width: "95%", height:50, marginLeft:10 }}
            placeholder="Search..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            mode="bar" 
            onFocus={handleFocus}
            onBlur={handleBlur}
            onTraileringIconPress={handle}
            clearIcon={() => null}
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
    // marginVertical:
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
