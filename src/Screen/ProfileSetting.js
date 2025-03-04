// import { useContext, useEffect, useState } from "react";
// import { StyleSheet, View } from "react-native";
// import {
//   Card,
//   Title,
//   Paragraph,
//   Button,
//   Avatar,
//   ActivityIndicator,
//   Icon,
// } from "react-native-paper";
// import { AuthContext } from "../Store/AuthContext";
// import { useIsFocused } from "@react-navigation/native";
// import { createApi } from "../Util/UtilApi";
// import UserDataContext from "../Store/UserDataContext";
// import { useSnackbar } from "../Store/SnackbarContext";
// function ProfileSetting({ navigation }) {
// const { loginDetail, getData, isLoading, isAuthenticated, logout } =useContext(AuthContext);
//   const [loginDetail1, setLoginDetail1] = useState(loginDetail);
//   const [newLoading, setNewLoading] = useState(true);
//   const isFocused = useIsFocused();
//   const {userData,saveUserData}=useContext(UserDataContext)
//   const {showSnackbar}=useSnackbar();
//     console.log(userData,"userData")
//   const logoutHandler = async() => {
//     // navigation.navigate("login")
//         try{
//       const response= await createApi("users/logout",{mobile:userData.user.mobile},{
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${userData.token}`,
//       } )
//       console.log(response)
//       showSnackbar("logout successfull","success")
//       saveUserData(null)
//       if (isLoading) {
//         return (
//           <View
//             style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
//           >
//             <ActivityIndicator size="large" />
//           </View>
//         );
//       }
//       navigation.navigate("login");

//     }catch(err){
//       console.error("failed to logout",err)
//     }

//   };
//   useEffect(() => {
//     async function loginDetailHandler() {
//       try {
//         const newValue = (await getData("loginDetail")) || "";

//         setLoginDetail1(newValue);
//       } catch {
//         console.log("failed get data ");
//       } finally {
//         setNewLoading(false);
//       }
//     }

//     loginDetailHandler();
//   }, [isFocused, loginDetail]);
//   const login = loginDetail1;
//   if (newLoading) {
//     return <ActivityIndicator size="large" />;
//   }
//   const editProfileHandler=()=>{
//     navigation.navigate("editProfile",{login:login})
//   }
//   return (
//     <View style={styles.container}>
//       <Card style={styles.card}>
//         <View>
//         <Avatar.Text
//           size={100}
//           label={login.name?.charAt(0)}
//           style={styles.avatar}
//         />

//         </View>

//         <Card.Content style={{ alignSelf: "center",margin:20}}>
//           <Title
//             style={styles.titleStyle}
//           >{`${login.name} ${login.surname}`}</Title>
//           {/* <Paragraph style={styles.paragraph}>ID: {login._id}</Paragraph> */}
//           <Paragraph style={styles.paragraph}>First Name: {login.name}</Paragraph>
//           <Paragraph style={styles.paragraph}>
//             Surname: {login.surname}
//           </Paragraph>
//           <Paragraph style={styles.paragraph}>Email: {login.email}</Paragraph>
//           <Paragraph style={styles.paragraph}>Role: {login.role}</Paragraph>
//         </Card.Content>
//         <Card.Actions>
//           <Button icon="pencil" mode="contained" buttonColor="#26a0df" labelStyle={styles.buttonText} onPress={editProfileHandler}>
//             Edit
//           </Button>
//           <Button
//        icon={() => <Icon name="log-out-outline" size={20} color="white" />}
//         buttonColor="#26a0df"
//         onPress={logoutHandler}
//         mode="contained"
//         labelStyle={styles.buttonText}

//       >
//         LogOut
//       </Button>
//         </Card.Actions>
//       </Card>
//     </View>
//   );
// }
// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//     paddingHorizontal:10
//   },
//   buttonText: {
//     color: "white",
//   },
//   card: {
//     width: "100%",
//     height:"100%",
//     color: "#fff",

//     justifyContent:"center"
//   },
//   logout:{ alignSelf: "flex-end", marginBottom: 10, backgroundColor:"#0c3b73"},
//   paragraph: {
//     marginVertical: 10,
//     fontSize:15,
//     paddingVertical:5
//   },
//   titleStyle: {
//     fontWeight: "bold",
//     fontSize:25,
//     marginBottom: 10,
//     alignSelf: "center",
//   },
//   iconButton: {
//     backgroundColor: "#fff",
//   },
//   iconButton2: {
//     backgroundColor: "#fff",
//   },
//   avatar: {
//     justifySelf: "center",
//     alignSelf: "center",
//     marginVertical: 10,
//   },
// });

// export default ProfileSetting;

import React, { useContext, useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { Text, Card, Avatar, Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
// import ChangeLanguageModal from "../Modal/ChangeLanguageModal";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../Modal/ConfirmModal";
import UserDataContext from "../Store/UserDataContext";
import { createApi, NORM_URL } from "../Util/UtilApi";
import { useIsFocused } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";
// import { WalletContext } from "../Store/WalletContext";
import FastImage from "react-native-fast-image";
import auth from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSnackbar } from "../Store/SnackbarContext";
import ChangeLanguageModal from "../Modal/ChangeLanguageModal";


const ProfileSetting = ({ navigation, myOrdersTabShow }) => {
  const [isFullImageModalVisible, setIsFullImageModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const [loginConfirmModalVisible, setLoginConfirmModalVisible] =
    useState(false);
  const [languageModalvisible, setLanguageModalVisible] = useState(false);
  const [language, setLanguage] = useState("English"); // Default language
  const [visible, setVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState(`${NORM_URL}assets/mobile/male.png`);
  const { showSnackbar } = useSnackbar();
  const { userData, clearUserData } = useContext(UserDataContext);
  // const { setCreateuser } = useContext(WalletContext);

  const { t, i18n } = useTranslation();
  const isFocused = useIsFocused();
  const AdminOption = [
    // {icon: "person-add", label: "Add Service Provider Admin", value: "AddServiceProvider"},
    // {icon: "edit", label: "Edit Service Provider Admin", value: "EditServiceProvider"},
    // {icon: "person", label: "All Users", value: "AllUsers"},
    {
      icon: "person",
      label: " Admin Section ",
      value: "AdminSection",
    },
  ];
  // const [sameMenuItems, setSameMeuItems] = useState()
  const [menuItems, setMenuItems] = useState();
  useEffect(() => {
    if (myOrdersTabShow) {
      setMenuItems([
        ...(userData
          ? [
              {
                icon: "language",
                label: "Address",
                value: "Address",
              },
            ]
          : []),
        {
          icon: "language",
          label: "Change Language",
          value: "changeLanguage",
        },
        {
          icon: "flag",
          label: "Edit  a Vendor ",
          value: "Edit a Vendor",
        },
        ...(userData?.user?.roles === "admin" ? AdminOption : []),

        { icon: "policy", label: "Policies", value: "Policies" },
        ...(userData
          ? [{ icon: "logout", label: "Logout", value: "Logout" }]
          : []),
      ]);
    } else {
      setMenuItems([
        ...(userData
          ? [
              {
                icon: "language",
                label: "Address",
                value: "Address",
              },
            ]
          : []),
        {
          icon: "language",
          label: "Change Language",
          value: "changeLanguage",
        },
        {
          icon: "flag",
          label: "Become a Vendor",
          value: "Become a Vendor",
        },
        ...(userData?.user?.roles === "admin" ? AdminOption : []),

        { icon: "policy", label: "Policies", value: "Policies" },
        ...(userData
          ? [
              {
                icon: "person-add",
                label: "Assign New Role",
                value: "Assign New Role",
              },
              { icon: "logout", label: "Logout", value: "Logout" },
              { icon: "logout", label: "Logout1", value: "Logout1" },

            ]
          : []),
      ]);
    }
  }, [myOrdersTabShow, isFocused, userData]);

  // useEffect(() => {
  //   if (userData) {
  //     if (userData?.user?.gender == null) {
  //       setImageUrl();
  //     } else if (userData?.user?.gender === "Female") {
  //       setImageUrl(`https://servicediary.online/assets/mobile/female.png`);
  //     } else if (
  //       userData?.user?.gender === "Male" ||
  //       userData?.user?.gender === "male"
  //     ) {
  //       setImageUrl(`https://servicediary.online/assets/mobile/male.png`);
  //     } else {
  //       setImageUrl(`https://servicediary.online/assets/mobile/neutral.png`);
  //     }
  //   } else {
  //     setImageUrl(`https://servicediary.online/assets/mobile/neutral.png`);
  //   }
  // }, [isFocused, imageUrl, userData]);

  useEffect(() => {
    if (userData) {
      if (userData?.user?.profilePicurl) {
        const nevVar = `${NORM_URL}/${userData?.user?.profilePicurl}`;
        setImageUrl(nevVar);
      } else if (userData?.user?.gender == null) {
        setImageUrl(`${NORM_URL}assets/mobile/neutral.png`);
      } else if (userData?.user?.gender === "Female") {
        setImageUrl(`${NORM_URL}assets/mobile/female.png`);
      } else if (
        userData?.user?.gender === "Male" ||
        userData?.user?.gender === "male"
      ) {
        setImageUrl(`${NORM_URL}assets/mobile/male.png`);
      } else {
        setImageUrl(`${NORM_URL}assets/mobile/neutral.png`);
      }
    } else {
      setImageUrl(`${NORM_URL}assets/mobile/neutral.png`);
    }
  }, [isFocused, userData]); // Removed imageUrl from dependency array

  const languageModalOpen = () => {
    setLanguageModalVisible(true);
  };

  const languageModalClose = () => {
    setLanguageModalVisible(false);
  };

  const openImageModal = (uri) => {
    setSelectedImageUri(uri);
    setIsFullImageModalVisible(true);
  };

  const closeImageModal = () => {
    setIsFullImageModalVisible(false);
    setSelectedImageUri(null);
  };

  const handlePress = (value) => {
    console.log("Data of value ", value);
    if (value == "Address") {
      navigation.navigate("Address");
      // navigation.navigate("TestingScreen");
    } else if (value == "Policies") {
      navigation.navigate("Policies", {
        webUri: `${NORM_URL}/privacy-policy?view=mobile`,
        headerTitle: "Privacy and Policies",
      });
    } else if (value == "Become a Vendor") {
      if (userData) {
        navigation.navigate("AddServiceProvidersFormScreen");
      } else {
        setLoginConfirmModalVisible(true);
      }
    } else if (value === "Edit a Vendor") {
      if (userData) {
        navigation.navigate("ViewEditServicesScreen");
      } else {
        setLoginConfirmModalVisible(true);
      }
    } else if (value == "changeLanguage") {
      setLanguageModalVisible(true);
    } else if (value == "Logout") {
      setVisible(true);
    } else if (value === "AdminSection") {
      navigation.navigate("AdminSection");
    } else if (value === "Assign New Role") {
      navigation.navigate("AddroleScreen");
    }else if (value == "Logout1") {
      navigation.navigate("login")
    }
  };
  const logoutHandler = async () => {
    try {
      const response =  await createApi(
        "users/logout",
        { mobile: userData?.user?.mobile },
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        }
      );
      console.log("response", response);
      showSnackbar("Logged out successfully", "success");
      await clearUserData();
      // setCreateuser(null);
      setVisible(false);

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "login" }],
        })
      );
      await auth().signOut();
    } catch (error) {
      showSnackbar("Error logging out", "error");
      console.log("error logging out - ", error);
    }

    // navigation.navigate("EnterNumber");
  };

  const handleEditPress = () => {
    navigation.navigate("EditProfilePage");
  };

  const loginClickHandler = () => {
    setLoginConfirmModalVisible(false);

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "EnterNumber" }],
      })
    );
  };

  return (
    <>
      {/* <Text>{t("hello there")}</Text> */}
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View>
            <Card style={styles.card}>
              <View
                style={{
                  justifyContent: "center",
                  marginBottom: 25,
                  alignItems: "center",
                  backgroundColor: "#fff",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    if (userData?.user?.profilePicurl) {
                      openImageModal(
                        `${NORM_URL}/${
                          userData?.user?.profilePicurl
                        }?${new Date().getTime()}`
                      );
                    }
                  }}
                >
                  <FastImage
                    source={{
                      uri: `${imageUrl}?${new Date().getTime()}`,
                      // headers: { Accept: "*/*" },
                      // priority: FastImage.priority.high,
                      // cache: FastImage.cacheControl.web,
                    }}
                    style={styles.avatar}
                  />
                </TouchableOpacity>
                {/* <Avatar.Image
                size={100}
                source={{uri:imageUrl}}
                style={styles.avatar}
              /> */}
                {userData ? (
                  <View style={{ alignItems: "center" }}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: "Poppins-Bold",
                        color: "#7E8A8C",
                      }}
                    >
                      {userData?.user?.name || userData?.user?.mobile}
                    </Text>
                    <TouchableOpacity
                      onPress={handleEditPress}
                      style={{
                        height: 50,
                        justifyContent: "center",
                        width: 150,
                        alignItems: "center",
                      }}
                    >
                      <Button
                        icon="pencil"
                        mode="contained"
                        buttonColor="#0c3b73"
                        style={styles.button}
                      >
                        {t("Edit")}
                      </Button>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Button
                    onPress={loginClickHandler}
                    // icon="pencil"
                    mode="contained"
                    buttonColor="#0c3b73"
                    style={styles.button}
                  >
                    {t("Login")}
                  </Button>
                )}
              </View>
              <Card.Content style={{ backgroundColor: "#fff" }}>
                {menuItems?.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handlePress(item.value)}
                    style={styles.item}
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
                ))}
              </Card.Content>
            </Card>
          </View>
        </ScrollView>
      </SafeAreaView>
      <ChangeLanguageModal
        languageModalvisible={languageModalvisible}
        setLanguageModalVisible={setLanguageModalVisible}
        languageModalOpen={languageModalOpen}
        languageModalClose={languageModalClose}
        language={language}
        setLanguage={setLanguage}
        t={t}
        i18nChangeLanguage={i18n.changeLanguage}
      />
      {loginConfirmModalVisible && (
        <ConfirmModal
          visible={loginConfirmModalVisible}
          setVisible={setLoginConfirmModalVisible}
          handlePress={loginClickHandler}
          message="Please Login to Become Service Provider"
          heading="Login"
          buttonTitle="Login"
        />
      )}

      {visible && (
        <ConfirmModal
          visible={visible}
          message="are you sure you want to logout"
          heading={"Confirm Logout"}
          setVisible={setVisible}
          handlePress={logoutHandler}
          buttonTitle="Logout"
        />
      )}

      {isFullImageModalVisible && (
        <Modal
          visible={isFullImageModalVisible}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalBackground}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeImageModal}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            <Image
              source={{ uri: selectedImageUri }}
              style={styles.fullImage}
            />
          </View>
        </Modal>
      )}
    </>
  );
};
const styles = StyleSheet.create({
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
  container: {
    // flex: 1,
    height: "100%",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
  },
  label: {
    fontFamily: "Poppins-Regular",
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
    backgroundColor: "#B3ECFF",
  },
  chevron: {
    marginLeft: "auto",
  },
  button: {
    color: "white",
    justifySelf: "center",
    width: "70%",
    borderRadius: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "90%",
    height: "80%",
    resizeMode: "contain",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 20,
  },
  closeButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
});
export default ProfileSetting;
