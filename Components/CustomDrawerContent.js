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
  const [loginDetail1, setLoginDetail1] = useState(loginDetail);
  const [newLoading,setNewLoading] =useState(true)
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
    async function loginDetailHandler() {
      try{
      const newValue = await getData("loginDetail")||'';
      setLoginDetail1(newValue);
      }catch{
        console.log("failed get data ")
      }
      finally{
        setNewLoading(false)
      }
    }

    loginDetailHandler();
  }, [isFocused,loginDetail]);
  const login=loginDetail1
  if(newLoading){
    return <ActivityIndicator size="large"/>
  }
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
