import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import {React,useContext} from "react";
import { View, Text, Image, StyleSheet,ActivityIndicator } from "react-native";
import { AuthContext } from "../Store/AuthContext";
export function CustomDrawerContent(props) {
  // const { isLoggedIn } = useContext(AuthContext);
  // console.log(isLoggedIn)
  const{logout,isAuthenticated,isLoading}= useContext(AuthContext)
  const logoutHandler=()=>{
    logout();
    if (isLoading) {
     {
       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
         <ActivityIndicator size="large" />
       </View>
     }
    }
       if(!isAuthenticated){
            props.navigation.navigate('StackNavigator',{screen:'login'})
       }
       
   }
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.container}>
        {/* <Image
          source={require("../../assets/images/profile.png")}
          style={{ width: 100, height: 100 }}
        /> */}
        <Text style={styles.text}>wertone Admin </Text>
        <Text  style={styles.text}>admin@wertone.in </Text>
      </View>
     <DrawerItemList {...props} />
      <DrawerItem label={"logout"} onPress={logoutHandler} />
     
    </DrawerContentScrollView>
      
  );
}

const styles = StyleSheet.create({
  container: {
    padding:10,
    
  },
  text:{
    fontSize: 18,
  }
});