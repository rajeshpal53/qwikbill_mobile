import React, { useState, useContext } from 'react';
import { View, TextInput, StyleSheet, Pressable,BackHandler } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../Store/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

const SearchHeader = ({ onSearch }) => {
//   const [searchMode, setSearchMode] = useState(false);
  const{searchMode, setSearchMode}= useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const {overlayHeight, setOverlayHeight} = useContext(AuthContext);
  

  const toggleSearch = () => {
    setSearchMode(!searchMode);
    setSearchQuery('');
    if(!searchMode){
        console.log("searching");
        setOverlayHeight("50%")
    }
    else{
        console.log("Not searching");
        setOverlayHeight("25%");
    }
    

    // Animated.timing(inputWidth, {
    //   toValue: searchMode ? 0 : 200,
    //   duration: 300,
    //   useNativeDriver: false,
    // }).start();
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.titleContainer}>
        <Ionicons name="logo-react" size={30} color="white" />
      </View> */}
      {(searchMode) ? 
      (
        <View style={[styles.inputContainer]}>
        <TextInput
          // selectionColor="black"
          style={styles.input}
          value={searchQuery}
          onChangeText={handleSearch}
          autoFocus
          placeholder="Search..."
          placeholderTextColor="#000"
        />
        <Pressable onPress={toggleSearch} style={styles.icon}>
        <Ionicons name="close" size={25} color="black" />
        </Pressable>
      </View>
      ) : (<Pressable onPress={toggleSearch} style={styles.icon}>
        <Ionicons name={searchMode ? "close" : "search"} size={25} color="white" />
      </Pressable>)}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // alignItems: 'center',
    flexGrow:1,
    marginLeft:"14%",
    // backgroundColor:"pink"
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  inputContainer: {
    height: "100%",
    width:"100%",
    justifyContent:"space-between",
    flexDirection:"row",
    // marginHorizontal: 10,
    // borderBottomWidth: 1,
    backgroundColor:"pink",
    borderWidth:1,
    borderRadius:25,
    borderBottomColor: 'white',
    overflow: 'hidden',
    backgroundColor:"white",
    borderColor:"black"
  },
  input: {
    // backgroundColor:"pink",
    
    borderRadius:2,
    color: 'black',
    fontSize: 18,
    paddingHorizontal:10,
    // paddingLeft:10
  },
  icon: {
    padding: 10,
  },
});

export default SearchHeader;
