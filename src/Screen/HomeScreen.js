import React, { useState, useContext, useEffect } from "react";
import { useRef } from "react";
import {
  View,
  Text,
  useWindowDimensions,
  Pressable,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform,
  StyleSheet,
  FlatList,
  BackHandler,
  TouchableOpacity,
} from "react-native";
import {
  MaterialCommunityIcons,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import { Button, Card, TextInput } from "react-native-paper";
import { AuthContext } from "../Store/AuthContext";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { services } from "../tempList/ServicesList";
import CreateInvoice from "../Components/CreateInvoice";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { ButtonColor, fontSize, readApi } from "../Util/UtilApi";
import DropDownList from "../UI/DropDownList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoginTimeContext } from "../Store/LoginTimeContext";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useFonts } from "expo-font";
import UserDataContext from "../Store/UserDataContext";

export default function HomeScreen({ navigation }) {
  const { currentLoginTime, lastLoginTime, storeTime } =
    useContext(LoginTimeContext);
  // const [lastLoginTime, setLastLoginTime] = useState(route.params.previousLoginTime);
  // const { getData } = useContext(AuthContext);
  const [loginDetail, setLoginDetail] = useState({});
  const [vendorsDetails, setVendorDetails] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { searchMode, setSearchMode } = useContext(AuthContext);
  // const {overlayHeight} = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const pickerRef = useRef();
  const { width, height } = useWindowDimensions();
  console.log(width, "  ", height);
  // const overlayHeight = (0.20*windowHeight);
  // console.log(responsiveHeight(80), "    --- responsiveHeight");
  // console.log(verticalScale(700), "    --- verticalscale");
  const { userData } = useContext(UserDataContext);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        setIsLoading(true);
        const token = userData?.token;
        // const api = `qapi/vendors/${userData?.user?.id}`
        const response = await readApi(`qapi/vendors//getVendorsByUserId/${userData?.user?.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        setVendorDetails(response);
      } catch (err) {
        setVendorDetails([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendorData();
  }, [isFocused]);

  useEffect(() => {
    const getItem = async () => {
      try {
        const data = await AsyncStorage.getItem("loginDetail");
        if (data) {
          setLoginDetail(JSON.parse(data)); // Parse the data to JSON
        }
      } catch (error) {
        console.log("Failed to fetch login details:", error);
      }
    };

    getItem();
  }, []);

  // function open() {
  //   pickerRef.current.focus();
  // }

  // function close() {
  //   pickerRef.current.blur();
  // }

  const goToHandler = (Screen) => {
    // navigation.navigate("wertone", {screen:'CreateInvoice'});
    // console.log("Pra ", item)
    if (Screen === "CreateShopScreen") {
      navigation.navigate(Screen, { isHome: false });
    }
    console.log("hi");
    // navigation.navigate("StackNavigator", { screen: Screen });
    navigation.navigate(Screen);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.overlay}></View>
      <View style={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>
              Welcome{" "}
              {userData?.user?.name
                ? `${userData?.user?.name}`
                : `${userData?.user?.mobile}`}
            </Text>
            {/* <Text style={styles.headerText1}>{`Welcome ${loginDetail.name} ${loginDetail.surname}`}</Text> */}
            <Text style={styles.subHeaderText}>
              Last Login: {lastLoginTime}
            </Text>
          </View>
          <View style={{ flex: 0.6 }}>
            <Card style={styles.card}>
              <View>
                <Card.Content style={styles.cardContent}>
                  <View style={styles.dropDownContainer}>
                    <DropDownList options={vendorsDetails} />
                  </View>

                  <View style={styles.viewsContainer}>
                    <Pressable
                      style={styles.allThreeViews}
                      onPress={() => navigation.navigate("Customer")}
                    >
                      <Text style={styles.whiteColor}>View Customers</Text>
                    </Pressable>

                    <View
                      style={{
                        backgroundColor: "rgba(0,0,0,0.3)",
                        width: 1,
                        height: "50%",
                      }}
                    ></View>

                    <Pressable
                      style={styles.allThreeViews}
                      onPress={() => goToHandler("Invoices")}
                    >
                      <Text style={styles.whiteColor}>View Invoices</Text>
                    </Pressable>

                    {/* <Pressable style={styles.allThreeViews}>
                      <Text style={styles.whiteColor}>View</Text>
                      <Text style={styles.whiteColor}>Stocks</Text>
                      </Pressable> */}
                  </View>
                </Card.Content>
              </View>
            </Card>
          </View>

          <View style={{ flex: 2 }}>
            {vendorsDetails.length > 0 ? (
              <FlatList
                style={styles.flatList}
                data={services}
                numColumns={3}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    style={styles.item}
                    key={index}
                    onPress={() => goToHandler(item.navigateTo)}
                  >
                    <View style={{ alignItems: "center" }}>
                      {item.icon}
                      <Text style={styles.itemText}>{item.name}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index}
                ListEmptyComponent={<Text>No Items Found</Text>}
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("../../assets/invoiceGenrate.png")}
                  style={{ width: 300, height: 250 }}
                />
                <Text style={styles.vendorText}> To Genrate New Invoice</Text>
                <TouchableOpacity
                  style={styles.touchableview}
                  onPress={() => navigation.navigate("CreateShopScreen")}
                >
                  <Text style={styles.btntext}>Please Become a vendor</Text>
                </TouchableOpacity>
                {/* <Button mode="contained"> Please Become a vendor </Button> */}
              </View>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    // flex: 1,
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollView: {
    height: "100%",
  },
  vendorText: {
    fontWeight: "bold",
    marginVertical: 20,
    // fontSize: 18,
    fontFamily: "Poppins-Medium",
    fontSize: fontSize.headingSmall,
  },
  container: {
    marginHorizontal: responsiveWidth(5),
    // backgroundColor:"orange",
    height: verticalScale(578),
    // height:responsiveHeight(80)

    // height:713,
    // height:"100%",
    // backgroundColor:"lightblue"
  },
  header: {
    flex: 0.3,
    // padding: 15,
    // padding: responsiveWidth(4),

    marginTop: 4,
    marginLeft: 10,
    // paddingBottom:0,
    gap: responsiveHeight(1),
  },

  btntext: {
    fontFamily: "Poppins-Medium",
    fontSize: fontSize.labelLarge,
    color: "#fff",
  },

  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    //  fontFamily:'Roboto_700Bold'
  },
  // headerText1: {
  //   color: "#fff",
  //   fontSize: responsiveFontSize(2.5),
  //   // fontWeight: "bold",
  //   fontFamily:"Roboto_300Light_Italic"

  // },
  subHeaderText: {
    color: "#fff",
    fontSize: 13,
  },
  card: {
    flex: 1,
    borderRadius: responsiveWidth(3),
  },
  cardContent: {
    width: "100%",
    height: "100%",
    // borderRadius: 10,
    borderRadius: responsiveWidth(3),
    justifyContent: "space-around",
    paddingVertical: responsiveHeight(1),
  },
  dropDownContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  viewsContainer: {
    height: "54%",
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    paddingHorizontal: 20,
    // backgroundColor:"orange"
  },
  allThreeViews: {
    // width: "%",
    // backgroundColor: "#0c3b73",
    // backgroundColor: "#26a0df",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  flatList: {
    flex: 1,
  },
  item: {
    flex: 1,
    margin: 10,
    padding: 2,
    paddingVertical: 5,
    // backgroundColor: "orange",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 2,
    // elevation: 2,
  },
  itemText: {
    marginTop: 5,
    fontSize: 12,
    textAlign: "center",
    color: "#555555",
  },
  overlay: {
    position: "absolute",
    top: 0, // Adjust the top value as needed
    width: "100%",
    height: responsiveHeight(20),
    backgroundColor: "#0c3b73",
    zIndex: 0,
    borderBottomLeftRadius: responsiveWidth(3),
    borderBottomRightRadius: responsiveWidth(3),
  },
  whiteColor: {
    color: "#26a0df",
    fontSize: 16,
  },
  touchableview: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: ButtonColor.SubmitBtn,
  },
});
