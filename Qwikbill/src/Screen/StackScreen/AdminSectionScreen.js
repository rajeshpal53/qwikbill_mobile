// import React, { useEffect, useState, useContext } from "react";
// import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
// import { Text, Card } from "react-native-paper";
// import UserDataContext from "../../Store/UserDataContext";
// import { useIsFocused,CommonActions} from "@react-navigation/native";
// import FastImage from "react-native-fast-image";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { NORM_URL,createApi} from "../../Util/UtilApi";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import { useTranslation } from "react-i18next";
// import ConfirmModal from "../../Modal/ConfirmModal";
// import { fontFamily, fontSize } from "../../Util/UtilApi";
// import { useSnackbar } from "../../Store/SnackbarContext";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// const AdminSectionScreen = ({ navigation }) => {
//   const { t } = useTranslation();
//   const isFocused = useIsFocused();
//   const { userData, saveUserData,clearUserData} = useContext(UserDataContext);
//   const [imageUrl, setImageUrl] = useState("");
//   const [visible, setVisible] = useState(false);
//   const {showSnackbar}=useSnackbar();
//   const [menuItems, setMenuItems] = useState([
//     {
//       isDisabled: false,
//       icon: "receipt",
//       label: "All Invoice",
//       value: "AllInvoice",
//     },

//     {
//       isDisabled: false,
//       icon: "people",
//       label: "All Users",
//       value: "AllUsers",
//     },

//     {
//       isDisabled: false,
//       icon: "local-shipping",
//       label: "All Vendor ",
//       value: "AllVendor",
//     },
//     {
//       isDisabled: false,
//       icon: "support-agent",
//       label: "All Queries and Support",
//       value: "AllQuerysAndSupport",
//     },
//     {
//       isDisabled: false,
//       icon: "logout",
//       label: "logout",
//       value: "Logout",
//     },
//   ]);

//   const handlePress = (value) => {
//     console.log("DATA OF VALUE IS ------", value); // Log the value received
//     if (value === "AllInvoice") {
//       navigation.navigate("AllInvoice", { Admin: true });
//     } else if (value === "AllVendor") {
//       navigation.navigate("AllVendor", { isAdmin: true });
//     } else if (value === "AllUsers") {
//       navigation.navigate("AllUsers");
//     } else if (value === "AllQuerysAndSupport") {
//       navigation.navigate("AllQuerysAndSupport");
//     } else if (value === "Logout") {
//       setVisible(true);
//     }
//   };

//   const logoutHandler = async () => {
//     try {
//       // Get token from AsyncStorage (in case it's not in userData)
//       const token = userData?.token || (await AsyncStorage.getItem("userToken"));

//       if (!token) {
//         console.error("Error: No token found for logout!");
//         showSnackbar("Session expired. Please log in again.", "error");
//         navigation.replace("login"); // Redirect to login if token is missing
//         return;
//       }

//       const response = await createApi(
//         "users/logout",
//         { mobile: userData?.user?.mobile },
//         {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         }
//       );

//       console.log("Logout Response:", response);

//       if (response?.success) {
//         showSnackbar("Logged out successfully", "success");

//         // Perform logout actions
//         await clearUserData();
//         await AsyncStorage.clear();
//         await AsyncStorage.removeItem("allShops");
//         await AsyncStorage.removeItem("selectedShop");

//         console.log("Successfully logged out");

//         setVisible(false);
//         navigation.dispatch(
//           CommonActions.reset({
//             index: 0,
//             routes: [{ name: "login" }],
//           })
//         );
//       } else {
//         console.error("Error during logout response:", response);
//         showSnackbar("Error logging out", "error");
//       }
//     } catch (error) {
//       console.error("Error during logout - ", error);
//       showSnackbar("Error logging out", "error");
//     }
//   };

//   useEffect(() => {
//     if (userData) {
//       if (userData?.user?.profilePicurl) {
//         setImageUrl(`${NORM_URL}/${userData?.user?.profilePicurl}?${new Date()}`);
//       } else if (userData?.user?.gender == null) {
//         setImageUrl();
//       } else if (userData?.user?.gender === "Female") {
//         setImageUrl(`https://servicediary.online/assets/mobile/female.png`);
//       } else if (
//         userData?.user?.gender === "Male" ||
//         userData?.user?.gender === "male"
//       ) {
//         setImageUrl(`https://servicediary.online/assets/mobile/male.png`);
//       } else {
//         setImageUrl(`https://servicediary.online/assets/mobile/neutral.png`);
//       }
//     } else {
//       setImageUrl(`https://servicediary.online/assets/mobile/neutral.png`);
//     }
//   }, [isFocused, imageUrl, userData]);

//   console.log(imageUrl);

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
//         <View
//           style={{
//             justifyContent: "center",
//             // backgroundColor: "#fff",
//             backgroundColor: "lightblue",
//             height: "100%",
//             // flex:1
//           }}
//         >
//           <Card style={styles.card}>
//             <View
//               style={{
//                 justifyContent: "center",
//                 marginBottom: 25,
//                 alignItems: "center",
//                 backgroundColor: "#fff",
//               }}
//             >
//               <FastImage
//                 source={{
//                   uri: imageUrl,
//                   // userData? `${NORM_URL}/${userData?.user?.profilePicurl }?${new Date().getTime()}`: imageUrl,
//                   // headers: { Accept: "*/*" },
//                   // priority: FastImage.priority.high,
//                   // cache: FastImage.cacheControl.web,
//                 }}
//                 style={styles.avatar}
//               />
//               {userData && (
//                 <Text style={styles.text}>
//                   {userData?.user?.name || userData?.user?.mobile}
//                 </Text>
//               )}
//             </View>
//             <Card.Content style={{ backgroundColor: "#fff" }}>
//               {menuItems?.map((item, index) =>
//                 !(item.value === "Logout" && !userData) ? (
//                   <TouchableOpacity
//                     key={index}
//                     style={[styles.item, item.isDisabled && { opacity: 0.5 }]}
//                     onPress={() => handlePress(item.value)}
//                     disabled={item.isDisabled}
//                   >
//                     <Icon
//                       name={item.icon}
//                       size={24}
//                       color="#26a0df"
//                       style={styles.icon}
//                     />
//                     <Text style={styles.label}>{item.label}</Text>
//                     <Icon
//                       name="chevron-right"
//                       size={24}
//                       color="#000"
//                       style={styles.chevron}
//                     />
//                   </TouchableOpacity>
//                 ) : null
//               )}
//             </Card.Content>
//           </Card>
//         </View>
//       </ScrollView>
//       <ConfirmModal
//         visible={visible}
//         message="are you sure you want to logout"
//         heading={"Log Out"}
//         setVisible={setVisible}
//         handlePress={logoutHandler}
//         buttonTitle="Logout"
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   text: {
//     fontSize: fontSize.heading,
//     marginBottom: 10,
//     fontFamily: fontFamily.regular,
//   },
//   container: {
//     // flex: 1,
//     height: "100%",
//     justifyContent: "center",
//     backgroundColor: "#fff",
//   },
//   card: {
//     width: "100%",
//     height: "100%",
//     backgroundColor: "#fff",
//     justifyContent: "center",
//   },
//   avatar: {
//     width: 100,
//     height: 100,
//     justifySelf: "center",
//     alignSelf: "center",
//     marginVertical: 10,
//     borderRadius: 50,
//     backgroundColor: "gray",
//     backgroundColor: "#0a6846",
//   },
//   label: {
//     fontFamily: fontFamily.regular,
//   },
//   button: {
//     color: "white",
//     justifySelf: "center",
//     justifyContent: "center",
//     width: "100%",
//     borderRadius: 14,
//   },
//   item: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#f0f0f0",
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//     marginVertical: 10,
//   },
//   icon: {
//     marginRight: 15,
//   },

//   chevron: {
//     marginLeft: "auto",
//   },
// });

// export default AdminSectionScreen;



















import { CommonActions, useIsFocused } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Text } from "react-native-paper";
import UserDataContext from "../../Store/UserDataContext";
//import FastImage from "react-native-fast-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import ConfirmModal from "../../Components/Modal/ConfirmModal";
import { useSnackbar } from "../../Store/SnackbarContext";
import { NORM_URL, createApi, fontFamily, fontSize } from "../../Util/UtilApi";
const AdminSectionScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const { userData, saveUserData, clearUserData } = useContext(UserDataContext);
  const [imageUrl, setImageUrl] = useState("");
  const [visible, setVisible] = useState(false);
  const { showSnackbar } = useSnackbar();

  const [menuItems, setMenuItems] = useState([
    {
      isDisabled: false,
      icon: "receipt",
      label: "All Invoice",
      value: "AllInvoice",
    },

    {
      isDisabled: false,
      icon: "people",
      label: "All Users",
      value: "AllUsers",
    },

    {
      isDisabled: false,
      icon: "local-shipping",
      label: "All Vendor",
      value: "AllVendor",
    },
    {
      isDisabled: false,
      icon: "support-agent",
      label: "All Queries and Support",
      value: "AllQuerysAndSupport",
    },
    {
      isDisabled: false,
      icon: "logout",
      label: "logout",
      value: "Logout",
    },
  ]);

  const handlePress = (value) => {
    console.log("DATA OF VALUE IS ------", value); // Log the value received
    if (value === "AllInvoice") {
      navigation.navigate("AllInvoice", { Admin: true });
    } else if (value === "AllVendor") {
      navigation.navigate("AllVendor", { isAdmin: true });
    } else if (value === "AllUsers") {
      navigation.navigate("AllUsers");
    } else if (value === "AllQuerysAndSupport") {
      navigation.navigate("AllQuerysAndSupport");
    } else if (value === "Logout") {
      setVisible(true);
    }
  };

  const logoutHandler = async () => {
    try {
      console.log("Attempting logout...");

      // 🔹 Clear all user data immediately (before API call)
      await AsyncStorage.clear();
      await clearUserData();

      // 🔹 Get token (if still available)
      const token = userData?.token || (await AsyncStorage.getItem("userToken"));

      // 🔹 If token is missing or expired, force logout without API call
      if (!token) {
        console.warn("No token found or already expired. Redirecting to login.");
        showSnackbar("Session expired. Please log in again.", "error");
        navigation.replace("login"); // Force login screen
        return;
      }

      // 🔹 Attempt API call (just in case backend still accepts it)
      const response = await createApi(
        "users/logout",
        { mobile: userData?.user?.mobile },
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      );

      console.log("Logout Response:", response);

      if (response?.success) {
        showSnackbar("Logged out successfully", "success");
      } else {
        console.warn("Logout request failed, likely due to expired token.");
      }

      // 🔹 Force user to login screen after clearing storage
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "login" }],
        })
      );
    } catch (error) {
      console.error("Error during logout - ", error);
      showSnackbar("Session expired. Please log in again.", "error");

      // 🔹 Ensure user data is cleared and user is redirected to login
      await AsyncStorage.clear();
      await clearUserData();
      navigation.replace("login");
    }
  };


  useEffect(() => {
    if (userData) {
      if (userData?.user?.profilePicurl) {
        setImageUrl(`${NORM_URL}/${userData?.user?.profilePicurl}?${new Date()}`);
      } else if (userData?.user?.gender == null) {
        setImageUrl();
      } else if (userData?.user?.gender === "Female") {
        setImageUrl(`https://servicediary.online/assets/mobile/female.png`);
      } else if (
        userData?.user?.gender === "Male" ||
        userData?.user?.gender === "male"
      ) {
        setImageUrl(`https://servicediary.online/assets/mobile/male.png`);
      } else {
        setImageUrl(`https://servicediary.online/assets/mobile/neutral.png`);
      }
    } else {
      setImageUrl(`https://servicediary.online/assets/mobile/neutral.png`);
    }
  }, [isFocused, imageUrl, userData]);

  console.log(imageUrl);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View
          style={{
            justifyContent: "center",
            // backgroundColor: "#fff",
            backgroundColor: "lightblue",
            height: "100%",
            // flex:1
          }}
        >
          <Card style={styles.card}>
            <View
              style={{
                justifyContent: "center",
                marginBottom: 25,
                alignItems: "center",
                backgroundColor: "#fff",
              }}
            >
              <Image
                source={{ uri: imageUrl }}
                style={styles.avatar}
              />

              {userData && (
                <Text style={styles.text}>
                  {userData?.user?.name || userData?.user?.mobile}
                </Text>
              )}
            </View>
            <Card.Content style={{ backgroundColor: "#fff" }}>
              {menuItems?.map((item, index) =>
                !(item.value === "Logout" && !userData) ? (
                  <TouchableOpacity
                    key={index}
                    style={[styles.item, item.isDisabled && { opacity: 0.5 }]}
                    onPress={() => handlePress(item.value)}
                    disabled={item.isDisabled}
                  >
                    <Icon
                      name={item.icon}
                      size={24}
                      color="#26a0df"
                      style={styles.icon}
                    />
                    <Text style={styles.label}>{t(item.label)}</Text>
                    <Icon
                      name="chevron-right"
                      size={24}
                      color="#000"
                      style={styles.chevron}
                    />
                  </TouchableOpacity>
                ) : null
              )}
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
      <ConfirmModal
        visible={visible}
        message="are you sure you want to logout"
        heading={"Log Out"}
        setVisible={setVisible}
        handlePress={logoutHandler}
        buttonTitle="Logout"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: fontSize.heading,
    marginBottom: 10,
    fontFamily: fontFamily.regular,
  },
  container: {
    // flex: 1,
    height: "100%",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  card: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    justifySelf: "center",
    alignSelf: "center",
    marginVertical: 10,
    borderRadius: 50,
    backgroundColor: "gray",
    backgroundColor: "#0a6846",
  },
  label: {
    fontFamily: fontFamily.regular,
  },
  button: {
    color: "white",
    justifySelf: "center",
    justifyContent: "center",
    width: "100%",
    borderRadius: 14,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
  },
  icon: {
    marginRight: 15,
  },

  chevron: {
    marginLeft: "auto",
  },
});

export default AdminSectionScreen;