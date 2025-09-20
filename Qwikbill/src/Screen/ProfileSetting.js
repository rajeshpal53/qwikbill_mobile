
import { useContext, useEffect, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Card, Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
// import ChangeLanguageModal from "../Modal/ChangeLanguageModal";
import { CommonActions, useIsFocused } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../Components/Modal/ConfirmModal";
import UserDataContext from "../Store/UserDataContext";
import { createApi, fontSize, NORM_URL, readApi } from "../Util/UtilApi";
// import { WalletContext } from "../Store/WalletContext";
//import FastImage from "react-native-fast-image";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ChangeLanguageModal from "../Components/Modal/ChangeLanguageModal";
import { ShopContext } from "../Store/ShopContext";
import { useSnackbar } from "../Store/SnackbarContext";
import { useTheme } from "../../constants/Theme";
const ProfileSetting = ({
  navigation,
  roleDetails,
  setroleDetails,
  fetchServiceProvider,
}) => {
  const [isFullImageModalVisible, setIsFullImageModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const [loginConfirmModalVisible, setLoginConfirmModalVisible] =
    useState(false);
  const [languageModalvisible, setLanguageModalVisible] = useState(false);
  const [language, setLanguage] = useState("English"); // Default language
  const [visible, setVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState(`${NORM_URL}assets/mobile/male.png`);
  const{colors}=useTheme()
  const { showSnackbar } = useSnackbar();
  const { userData, clearUserData, saveUserData } = useContext(UserDataContext);
  // const { setCreateuser } = useContext(WalletContext);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState(null);

  const { updateSelectedShop, noItemModal, selectedShop, clearSelectedShop } =
    useContext(ShopContext);
      const styles=profileStyle(colors);
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchServiceProvider(userData);
    setRefreshing(false);
    await fetchUser(setRefreshing);
  };
  const fetchUser = async (setRefreshing) => {
    try {
      const response = await readApi(
        `users/getUserByMobile/${userData?.user?.mobile}`
      );
      const updatedresponse = {
        user: response,
        token: userData.token,
      };
      console.log(response, "setrefreshresponse");
      saveUserData(updatedresponse);
      return true;
    } catch (err) {
      console.error("error in fetching user data", err);
    } finally {
      setRefreshing(false);
      return false;
    }
  };

  const { t, i18n } = useTranslation();
  const isFocused = useIsFocused();
  const AdminOption = [
    {
      icon: "person",
      label: "Admin Section",
      value: "AdminSection",
    },
  ];

  // const [sameMenuItems, setSameMeuItems] = useState()
  const [menuItems, setMenuItems] = useState();

  // console.log("user data in profile ", userData)

  useEffect(() => {
    const UpdatemanuItem = () => {
      setIsLoading(true);
      try {
        const baseItem = [
          {
            icon: "language",
            label: "Change Language",
            value: "changeLanguage",
          },

          ...(userData?.user?.roles === "admin" ? AdminOption : []),
          { icon: "policy", label: " Terms and Policy ", value: "Policies" },

          ...(userData
            ? [
                selectedShop
                  ? {
                      icon: "person-add",
                      label: "Add or Edit Role",
                      //  value: roleDetails ? "EditRole" : "AssignNewRole",
                      value: "AddOrEditRole",
                    }
                  : null,
                // { icon: "logout", label: "Logout1", value: "Logout1" },
              ].filter(Boolean) // << THIS REMOVES null SAFELY
            : []),
          { icon: "chat", label: "QwikBill Assistant", value: "ChatWithUs" },

          ...(userData
            ? [{ icon: "logout", label: "Logout", value: "Logout" }]
            : []),

          { label: "Need more help?", value: "needMoreHelp" },
        ];

        setMenuItems(baseItem);
      } catch (error) {
        console.log("Unable to fetch data ", error);
      } finally {
        setIsLoading(true);
      }
    };
    UpdatemanuItem();
  }, [roleDetails, isFocused, userData]);

  useEffect(() => {
    if (userData) {
      if (userData?.user?.profilePicurl) {
        const nevVar = `${NORM_URL}/${userData?.user?.profilePicurl}`;
        console.log("profile image issss", nevVar);
        setImageUrl(nevVar);
      } else if (userData?.user?.gender == null) {
        setImageUrl("https://dailysabji.com/assets/mobile/neutral.png");
      } else if (userData?.user?.gender === "Female") {
        setImageUrl("https://dailysabji.com/assets/mobile/female.png");
      } else if (
        userData?.user?.gender === "Male" ||
        userData?.user?.gender === "male"
      ) {
        setImageUrl("https://dailysabji.com/assets/mobile/male.png");
      } else {
        setImageUrl("https://dailysabji.com/assets/mobile/neutral.png");
      }
    } else {
      setImageUrl("https://dailysabji.com/assets/mobile/neutral.png");
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
    console.log("Opening image modal for:", uri);
    setIsFullImageModalVisible(true);
  };

  const closeImageModal = () => {
    setIsFullImageModalVisible(false);
    setSelectedImageUri(null);
  };

  const handlePress = (value) => {
    console.log("Data of value ", value);
    // if (value == "Address") {
    //   navigation.navigate("Address");
    //   // navigation.navigate("TestingScreen");
    // }

    if (value == "Policies") {
      navigation.navigate("Policies", {
        webUri: `${NORM_URL}qapp/privacy-policy?view=mobile`,
        headerTitle: "Privacy and Policies",
      });
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
    } else if (value === "AddOrEditRole") {
      if (roleDetails) {
        navigation.navigate("EditRoleScreen", {
          isAdmin: false,
          AdminRoleData: null,
        });
      } else {
        navigation.navigate("AddroleScreen");
      }
    } else if (value == "ChatWithUs") {
      navigation.navigate("ChatWithUs");
    } else if (value === "needMoreHelp") {
      navigation.navigate("Policies", {
        webUri: `${NORM_URL}qapp/helpandsupport?view=mobile`,
        headerTitle: "Help & Support",
      });
    }
  };
  const logoutHandler = async () => {
    console.log("userData before logout :", userData);
    try {
      const response = await createApi(
        "users/logout",
        { mobile: userData?.user?.mobile },
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        }
      );

      if (response) {
        showSnackbar("Logged out successfully", "success");

        // Clear user + shop
        await clearUserData();
        await AsyncStorage.clear(); // clear everything
        await clearSelectedShop(); // clear selectedShop from context

        console.log("User data after logout:", userData);
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "login" }],
          })
        );
      } else {
        showSnackbar("Error logging out", "error");
      }
    } catch (error) {
      console.error("Logout error:", error);
      showSnackbar("Error logging out", "error");
    } finally {
      setVisible(false);
    }
  };

  const handleEditPress = () => {
    navigation.navigate("EditProfilePage");
  };

  const loginClickHandler = () => {
    setLoginConfirmModalVisible(false);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "login" }],
      })
    );
  };

  return (
    <>
      {/* <Text>{t("hello there")}</Text> */}
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors?.primary]}
              //  #26a0df
              progressBackgroundColor={colors?.background}
            />
          }
        >
          <View>
            <Card style={styles.card}>
              <View
                style={{
                  justifyContent: "center",
                  marginBottom: 25,
                  alignItems: "center",
                  backgroundColor: colors?.background,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    if (userData?.user?.profilePicurl) {
                      const freshUrl = `${NORM_URL}${
                        userData?.user?.profilePicurl
                      }?${new Date().getTime()}`;
                      console.log("Opening image modal with URL:", freshUrl);
                      setModalImageUrl(freshUrl);
                      openImageModal(freshUrl);
                    }
                  }}
                >
                  <Image
                    source={{
                      uri: `${imageUrl}?${new Date().getTime()}`,
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
                        color: colors?.avatarBackground,
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
                        buttonColor={colors?.accent}
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
                    buttonColor={colors?.primary}
                    style={styles.button}
                  >
                    {t("Login")}
                  </Button>
                )}
              </View>
              <Card.Content style={{ backgroundColor: colors?.background}}>
                {menuItems?.map((item, index) =>
                  item?.value === "needMoreHelp" ? (
                    <Pressable
                      onPress={() => {
                        handlePress("needMoreHelp");
                      }}
                      key={index}
                    >
                      <View>
                        <Text style={{ fontFamily: "Poppins-Medium",color:colors?.text }}>
                          {t(item?.label)}
                        </Text>
                        <View style={styles.helpItem}>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 5,
                            }}
                          >
                            {/* <MaterialCommunityIcons
                            name="message-reply"
                            size={24}
                            color="black"
                          /> */}
                            <MaterialIcons
                              name="support-agent"
                              size={24}
                              color={colors?.text}
                            />
                            <View style={{ flex: 1 }}>
                              <Text style={{ fontFamily: "Poppins-Medium",color:colors?.textSecondary}}>
                                {t("Feedback and Help")}
                              </Text>
                              <Text
                                style={{
                                  fontFamily: "Poppins-Regular",
                                  color: colors?.textSecondary,
                                  fontSize: fontSize.label,
                                }}
                              >
                                {t("Contact us for your query and support")}
                              </Text>
                            </View>

                            <Text
                              style={{
                                fontFamily: "Poppins-Medium",
                                color: colors?.accent,
                              }}
                            >
                              {t("Support")}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </Pressable>
                  ) : (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handlePress(item.value)}
                      style={styles.item}
                    >
                      <Icon
                        name={item.icon}
                        size={24}
                        color={colors?.secondary}
                        // #26a0df
                        style={styles.icon}
                      />
                      <Text style={styles.label}>{t(item.label)}</Text>
                      <Icon
                        name="chevron-right"
                        size={24}
                        color={colors?.text}
                        style={styles.chevron}
                      />
                    </TouchableOpacity>
                  )
                )}
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
          message="Are you sure you want to log out ?"
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
            {/* <Image
              source={{ uri: selectedImageUri }}
              style={styles.fullImage}
            /> */}
            <Image
              key={selectedImageUri} // 👈 force re-render
              source={
                selectedImageUri
                  ? { uri: selectedImageUri, cache: "reload" }
                  : { uri: "https://dailysabji.com/assets/mobile/neutral.png" }
              }
              style={styles.fullImage}
            />
          </View>
        </Modal>
      )}
    </>
  );
};
const profileStyle = (colors) =>
StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors?.surface,
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
    backgroundColor: colors?.background,
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
  },
  label: {
    fontFamily: "Poppins-Regular",
    color:colors?.text
  },
  card: {
    width: "100%",
    height: "100%",
    backgroundColor: colors?.background,
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
    backgroundColor: colors?.avatarBackground,
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
  helpItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors?.surface,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: colors?.text,
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
    backgroundColor: colors?.background,
    padding: 10,
    borderRadius: 20,
  },
  closeButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
})
export default ProfileSetting;
