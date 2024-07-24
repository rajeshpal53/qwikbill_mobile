import { View, Text, Pressable, StyleSheet } from "react-native";
import SearchHeader from "../SearchHeader";
import { useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../Store/AuthContext";
import { ActivityIndicator } from "react-native-paper";
import { useNavigation } from '@react-navigation/native';
import LogoutBtn from "./LogoutBtn";
import SearchBarComp from "../SearchBarComp";
// import {LogoutBtn} from "./LogoutBtn"

export default function HomeHeaderRight() {
    const navigation = useNavigation();

    const { isLoading, isAuthenticated, logout } = useContext(AuthContext);

    // const logoutHandler = () => {
    //     console.log("Logging out");
    //     logout();
    //     if (isLoading) {
    //       return (
    //         <View
    //           style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    //         >
    //           <ActivityIndicator size="large" />
    //         </View>
    //       );
    //     }
    //     if (!isAuthenticated) {
    //         console.log("logged out");
    //       navigation.navigate("StackNavigator", { screen: "login" });
    //     }
    //   };

  return (
    <View style={{flexDirection:"row-reverse"}}>

      <View style={styles.pressablesContainer}>
        {/* <Pressable
          style={styles.justifyCenter}
          onPress={logoutHandler}
        >
          <Ionicons name="log-out-outline" size={30} color="#ffffff" />
        </Pressable> */}
        <LogoutBtn/>

        <Pressable
          style={styles.justifyCenter}
          onPress={() => console.log("bar Pressed")}
        >
          <Ionicons name="settings-outline" size={30} color="#ffffff" />
        </Pressable>
      </View>

      <SearchBarComp/>
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
