import React, { useState, useContext, useEffect, useRef } from "react";
import {
  View,
  Text,
  useWindowDimensions,
  Pressable,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform,
  StyleSheet,
  FlatList,
  BackHandler,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  MaterialCommunityIcons,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import { Button, Card, TextInput, ActivityIndicator } from "react-native-paper";
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
import {
  TourGuideProvider,
  TourGuideZone,
  TourGuideZoneByPosition,
  useTourGuideController,
} from "rn-tourguide";
import { ShopContext } from "../Store/ShopContext";

export default function HomeScreen({ navigation }) {
  const { currentLoginTime, lastLoginTime, storeTime } =
    useContext(LoginTimeContext);
  // const [lastLoginTime, setLastLoginTime] = useState(route.params.previousLoginTime);
  // const { getData } = useContext(AuthContext);
  const [loginDetail, setLoginDetail] = useState({});
  // const [vendorsAll, setVendorDetails] = useState([]);
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
  const {allShops, selectedShop} = useContext(ShopContext);
  const isFocused = useIsFocused();
  const [currentStep, setCurrentStep] = useState(0);
  const [isTourGuideActive, setIsTourGuideActive] = useState(false);
  const { canStart, start, stop, eventEmitter } = useTourGuideController();

  useEffect(() => {
    console.log("allshops in homescreen 1, ", allShops);
  }, [allShops]);

  useEffect(() => {
    const checkIfTourSeen = async () => {
      try {
        const hasSeenTour = await AsyncStorage.getItem("hasSeenTour");
        if (!hasSeenTour && canStart) {
          start();
        }
      } catch (error) {
        console.log("Error checking tour guide status", error);
      }
    };

    checkIfTourSeen();
  }, [canStart]);

  useEffect(() => {
    // Start tour guide when entering the Home screen
    setIsTourGuideActive(true);

    // Reset tour guide when navigating away from this screen
    return () => {
      setIsTourGuideActive(false);
    };
  }, []);

  // const handleSkipTour = async () => {
  //   stop(); // This will stop the tour
  //   await AsyncStorage.setItem("hasSeenTour", "true"); // Marks the tour as skipped/completed
  //   console.log("Tour skipped");
  // };

  useEffect(() => {
    if (currentStep === 13) {
      console.log("Tour completed");
      AsyncStorage.setItem("hasSeenTour", "true");
    }
  }, [currentStep]);

  // useEffect(() => {
  //   const fetchVendorData = async () => {
  //     try {
  //       setIsLoading(true);
  //       const token = userData?.token;
  //       // const api = `vendors/${userData?.user?.id}`
  //       const response = await readApi(
  //         `vendors/getVendorsByUserId/${userData?.user?.id}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       console.log(response);
  //       setVendorDetails(response);
  //     } catch (err) {
  //       setVendorDetails([]);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchVendorData();
  // }, [isFocused]);

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
    navigation.navigate(Screen, { startTour: true });
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator
          animating={isLoading}
          color={"#FFC107"}
          size="large"
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.overlay}></View>
      <View style={styles.scrollView}>
        <TourGuideZoneByPosition
          zone={0}
          shape={"circle"}
          isTourGuide
          top={200}
          // left={50}
          // width={64}
          // height={64}
          text={"Welcome to the QwikBill"}
        />
        <View style={styles.container}>
          <View style={styles.header}>
            <TourGuideZone
              zone={1}
              text={"User Name"}
              shape="rectangle"
              // tooltipBottomOffset={20} // Adjusts vertical position
              keepTooltipPosition={true} // Keeps the tooltip in place
              pointerEvents="box-none"
              style={{
                position: "absolute",
                width: "100%",
                top: 36,
                height: 32,
              }}
            />
            <Text style={styles.headerText}>
              Welcome{" "}
              {userData?.user?.name
                ? `${userData?.user?.name}`
                : `${userData?.user?.mobile}`}
            </Text>

            {/* <Text style={styles.headerText1}>{`Welcome ${loginDetail.name} ${loginDetail.surname}`}</Text> */}
            <TourGuideZone
              zone={2}
              text={"Last login"}
              shape="rectangle"
              // tooltipBottomOffset={20} // Adjusts vertical position
              keepTooltipPosition={true} // Keeps the tooltip in place
              pointerEvents="box-none"
              style={{
                position: "absolute",
                width: "100%",
                top: 70,
                height: 18,
              }}
            />
            <Text style={styles.subHeaderText}>
              Last Login: {lastLoginTime}
            </Text>
          </View>
          <View style={{ flex: 0.6 }}>
            <Card style={styles.card}>
              <View>
                <Card.Content style={styles.cardContent}>
                  <View style={styles.dropDownContainer}>
                    <TourGuideZone
                      zone={3}
                      text={"See all the vender in dropdown"}
                      shape="rectangle"
                      pointerEvents="box-none"
                      // tooltipBottomOffset={20} // Adjusts vertical position
                      // keepTooltipPosition={true} // Keeps the tooltip in place
                      style={{
                        position: "absolute",
                        width: "80%",
                        top: 50,
                        height: 32,
                        marginLeft: 30,
                      }}
                    />

                    <DropDownList options={allShops} />
                  </View>

                  <View style={styles.viewsContainer}>
                    <TourGuideZone
                      zone={4}
                      text={"View Customer"}
                      shape="rectangle"
                      // tooltipBottomOffset={20} // Adjusts vertical position
                      // keepTooltipPosition={true} // Keeps the tooltip in place
                      pointerEvents="box-none"
                      style={{
                        position: "absolute",
                        width: "45%",
                        top: 45,
                        height: 32,
                        marginLeft: 20,
                      }}
                    />
                    <Pressable
                      style={styles.allThreeViews}
                      onPress={() => navigation.navigate("Customer")}
                    >
                      <Text style={styles.whiteColor}>View Customer</Text>
                    </Pressable>
                    <View
                      style={{
                        backgroundColor: "rgba(0,0,0,0.3)",
                        width: 1,
                        height: "50%",
                      }}
                    ></View>
                    <TourGuideZone
                      zone={5}
                      text={"View Invoices"}
                      shape="rectangle"
                      // tooltipBottomOffset={20} // Adjusts vertical position
                      // keepTooltipPosition={true} // Keeps the tooltip in place
                      pointerEvents="box-none"
                      style={{
                        position: "absolute",
                        width: "45%",
                        top: 45,
                        height: 32,
                        marginLeft: 162,
                      }}
                    />
                    <Pressable
                      style={styles.allThreeViews}
                      onPress={() => goToHandler("ViewInvoices1")}
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
            {allShops?.length > 0 ? (
              <FlatList
                style={styles.flatList}
                data={services}
                numColumns={3}
                renderItem={({ item, index }) => (
                  <TourGuideZone
                    key={index}
                    zone={6 + index} // Unique zone ID for each item
                    text={`Go to ${item.name}`} // Tooltip text
                    // Tooltip action (can be empty if needed)
                    shape={"circle"} // Adjust shape as necessary
                    style={[styles.tourGuideZone, styles.item]} // Apply styles to TourGuideZone
                    pointerEvents="box-none"
                  >
                    <TouchableOpacity
                      style={styles.item}
                      onPress={() => goToHandler(item.navigateTo)}
                    >
                      <View style={{ alignItems: "center" }}>
                        <Text>{item.icon}</Text>
                        <Text style={styles.itemText}>{item.name}</Text>
                      </View>
                    </TouchableOpacity>
                  </TourGuideZone>
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
    // padding: 2,
    // paddingVertical: 5,
    // backgroundColor: "orange",
    alignItems: "center",
    justifyContent: "center",

    // borderRadius: 10,
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
  tourGuideZone: {
    // position: "absolute",
    top: 30,
    // left: 38,
    // // width: 80,
    // height: 80,
    // borderRadius: 25,
    backgroundColor: "transparent",
  },
});
