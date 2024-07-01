// import {
//   DrawerContentScrollView,
//   DrawerItemList,
//   DrawerItem,
// } from "@react-navigation/drawer";
// import { React, useContext, useEffect,useState } from "react";
// import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
// import { AuthContext } from "../Store/AuthContext";
// import { useIsFocused } from '@react-navigation/native';
// import { Button } from "react-native-paper";
// export function CustomDrawerContent(props) {
//   // const { isLoggedIn } = useContext(AuthContext);
//   // console.log(isLoggedIn)
//   const {
//     logout,
//     isAuthenticated,
//     isLoading,
//     getData,
//     loginDetail,
//     setLoginDetail,
//   } = useContext(AuthContext);
//   const [loginDetail1, setLoginDetail1] = useState(loginDetail);
//   const [newLoading,setNewLoading] =useState(true)
//   const isFocused=useIsFocused()
//   const logoutHandler = () => {
//     logout();
//     if (isLoading) {
//       {
//         <View
//           style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
//         >
//           <ActivityIndicator size="large" />
//         </View>;
//       }
//     }
//     if (!isAuthenticated) {
//       props.navigation.navigate("StackNavigator", { screen: "login" });
//     }
//   };

//   useEffect(() => {
//     async function loginDetailHandler() {
//       try{
//       const newValue = await getData("loginDetail")||'';
//       setLoginDetail1(newValue);
//       }catch{
//         console.log("failed get data ")
//       }
//       finally{
//         setNewLoading(false)
//       }
//     }

//     loginDetailHandler();
//   }, [isFocused,loginDetail]);
//   const login=loginDetail1
//   if(newLoading){
//     return <ActivityIndicator size="large"/>
//   }
//   return (
//     <DrawerContentScrollView {...props}>
//       <View style={styles.container}>
//         <Image
//           source={require("../assets/logo-wertone.png")}
//           style={{ width: 100, height: 100 }}
//         />
//         <Text style={styles.text}>
//           {`${login.name} ${login.surname}`}{" "}
//         </Text>
//         <Text style={styles.text}>{login.email} </Text>
//       </View>
//       {/* <DrawerItemList {...props} /> */}
//       <Button label={"logout"} onPress={logoutHandler} />
//     </DrawerContentScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 10,
//   },
//   text: {
//     fontSize: 18,
//   },
// });

import { StyleSheet,View} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Text } from "react-native-paper";
export  function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <View
            key={index}
            style={[
              styles.tab,
              isFocused && styles.activeTab,
            ]}
          >
           
            <Text
              style={{
                color: isFocused ? "blue" : "gray",
              }}
            >
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  activeTab: {
    borderTopWidth: 3,
    borderTopColor: 'blue',
  },
});