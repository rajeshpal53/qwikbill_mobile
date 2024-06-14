import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import {React,useContext} from "react";
import { View, Text, Image, StyleSheet } from "react-native";
export function CustomDrawerContent(props) {
  const router = useRouter();
  // const { isLoggedIn } = useContext(AuthContext);
  // console.log(isLoggedIn)
  const styles = StyleSheet.create({
    container: {
      padding:10,
      
    },
    text:{
      fontSize: 18,
    }
  });
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/profile.png")}
          style={{ width: 100, height: 100 }}
        />
        <Text style={styles.text}>wertone Admin </Text>
        <Text  style={styles.text}>admin@wertone.in </Text>
      </View>
     <DrawerItemList {...props} />
      <DrawerItem label={"logout"} onPress={() => router.replace("/")} />
      <DrawerItem
        label="Close Drawer"
        onPress={() => props.navigation.closeDrawer()}
      />
      <DrawerItem
        label="Toggle Drawer"
        onPress={() => props.navigation.toggleDrawer()}
      />  
    </DrawerContentScrollView>
      
  );
}

