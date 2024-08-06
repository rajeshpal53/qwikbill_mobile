import { View, Text, Pressable, StyleSheet } from "react-native";
import SearchHeader from "../SearchHeader";
import { useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../Store/AuthContext";
import { ActivityIndicator } from "react-native-paper";
import { useNavigation } from '@react-navigation/native';
import LogoutBtn from "./LogoutBtn";
import SearchBarComp from "../SearchBarComp";
import { Entypo } from "@expo/vector-icons";
// import {LogoutBtn} from "./LogoutBtn"

export default function HomeHeaderRight() {
    const navigation = useNavigation();

    const { isLoading, isAuthenticated, logout, searchMode, setSearchMode } = useContext(AuthContext);


  return (
    <View style={{
      // marginRight:"10%", 
      paddingRight:"5%",
      flexDirection:(searchMode) ? "row" : "column",
      alignItems:"center",
      }}>

      {/* <View style={styles.pressablesContainer}>

        <LogoutBtn/> 

         <Pressable
          style={styles.justifyCenter}
          onPress={() => console.log("bar Pressed")}
        >
          <Ionicons name="settings-outline" size={30} color="#ffffff" />
        </Pressable>
      </View> */}

      <SearchBarComp/>

      {(searchMode) && (<Entypo onPress={() => setSearchMode(false)} name="cross" size={30} color="#ffffff" />)}
      {/* <SearchHeader onSearch={onSearch} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  pressablesContainer: {
    flexDirection: "row-reverse",
    justifyContent: "center",
    gap:5
  },
  justifyCenter: {
    justifyContent: "center",
  },
});
