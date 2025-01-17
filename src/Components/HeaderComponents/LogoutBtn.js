
import { View, Text } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { AuthContext } from "../../Store/AuthContext";
import { useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function LogoutBtn(){

    const navigation = useNavigation();

    const { isLoading, isAuthenticated, logout } = useContext(AuthContext);

    const logoutHandler = () => {
        console.log("Logging out");
        logout();
        if (isLoading) {
          return (
            <View
              style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            >
              <ActivityIndicator size="large" />
            </View>
          );
        }
        if (!isAuthenticated) {
            console.log("logged out");
          navigation.navigate("StackNavigator", { screen: "login" });
        }
      };
    return (
        <Pressable
          style={{justifyContent:"center"}}
          onPress={logoutHandler}
        >
          <Ionicons name="log-out-outline" size={30} color="#ffffff" />
        </Pressable>
    );
};