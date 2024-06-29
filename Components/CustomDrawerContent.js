import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { React, useContext, useEffect,useState } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import { AuthContext } from "../Store/AuthContext";
import { useIsFocused } from '@react-navigation/native';
export function CustomDrawerContent(props) {
  // const { isLoggedIn } = useContext(AuthContext);
  // console.log(isLoggedIn)
  const {
    logout,
    isAuthenticated,
    isLoading,
    getData,
    loginDetail,
    setLoginDetail,
  } = useContext(AuthContext);
  console.log(loginDetail, "customDrawer");
  const [loginDetail1, setLoginDetail1] = useState(loginDetail);
  const isFocused=useIsFocused()
  const logoutHandler = () => {
    logout();
    if (isLoading) {
      {
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>;
      }
    }
    if (!isAuthenticated) {
      props.navigation.navigate("StackNavigator", { screen: "login" });
    }
  };

  useEffect(() => {
    async function xyz() {
      const newValue = await getData("loginDetail");
      console.log(newValue, "newValue");
      setLoginDetail1(newValue);
    }

    xyz();
  }, [isFocused,loginDetail]);
  const login=loginDetail || loginDetail1
  console.log(login,"login")
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.container}>
        <Image
          source={require("../assets/logo-wertone.png")}
          style={{ width: 100, height: 100 }}
        />
        <Text style={styles.text}>
          {`${login.name} ${login.surname}`}{" "}
        </Text>
        <Text style={styles.text}>{login.email} </Text>
      </View>
      <DrawerItemList {...props} />
      <DrawerItem label={"logout"} onPress={logoutHandler} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  text: {
    fontSize: 18,
  },
});
