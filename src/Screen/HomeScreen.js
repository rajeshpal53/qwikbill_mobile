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
import { ButtonColor, fontFamily, fontSize, readApi } from "../Util/UtilApi";
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
import { ShopDetailContext } from "../Store/ShopDetailContext";
import { RefreshControl } from "react-native-gesture-handler";
import {
  TourGuideProvider,
  TourGuideZone,
  TourGuideZoneByPosition,
  useTourGuideController,
} from "rn-tourguide";
import { ShopContext } from "../Store/ShopContext";
import {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import PieChartComponent from "../Components/PieChartComponent ";
import { Dimensions } from "react-native";
import ConfirmModal from "../Modal/ConfirmModal";
import { useTranslation } from "react-i18next";
import FileUploadModal from "../Components/BulkUpload/FileUploadModal";
export default function HomeScreen({ navigation, noItemData }) {
  const { t } = useTranslation();
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
  const [vendorStatus, setVendorStatus] = useState({});
  const { userData } = useContext(UserDataContext);
  const { allShops, selectedShop, noItemModal, setNoItemModal } =
    useContext(ShopContext);
  const isFocused = useIsFocused();
  const [currentStep, setCurrentStep] = useState(0);
  const [isTourGuideActive, setIsTourGuideActive] = useState(false);
  const { canStart, start, stop, eventEmitter } = useTourGuideController();
  const [bulkUploadModalVisible, setBulkUploadModalVisible] = useState(false)
  const [refreshing, setRefreshing] = useState(false);
  const [userSkipped, setUserSkipped] = useState(false);
  const [ready, setReady] = useState(false);


  useEffect(() => {
    console.log("allshops in homescreen 1, ", selectedShop);
    console.log("all services ,", services);
    console.log("all services isLoading,", allShops);
  }, [allShops]);

  useEffect(() => {
    if (noItemModal) {
      console.log("Modal should show now because noItemModal is true.");
    }
  }, [noItemModal]);

  // useEffect(() => {
  //   const checkIfTourSeen = async () => {
  //     try {
  //       const hasSeenTour = await AsyncStorage.getItem("hasSeenTour");
  //       if (hasSeenTour !== "true" && canStart) {
  //         start();
  //       }
  //     } catch (error) {
  //       console.log("Error checking tour guide status", error);
  //     }
  //   };

  //   checkIfTourSeen();
  // }, [canStart]);

  // useEffect(() => {
  //   // Start the tour guide when entering the Home screen
  //   setIsTourGuideActive(true);

  //   // Optionally, handle screen navigation here
  //   // const goToHandler = (Screen) => { ... };

  //   return () => {
  //     setIsTourGuideActive(false);
  //   };
  // }, []);

  // useEffect(() => {
  //   if (currentStep === 13 || userSkipped) {
  //     console.log("Tour completed or skipped");
  //     AsyncStorage.setItem("hasSeenTour", "true");
  //   }
  // }, [currentStep, userSkipped]);

console.log("DATA F USER IS ",userData)


  useEffect(() => {
    const checkTourStatus = async () => {
      try {
        const hasSeen = await AsyncStorage.getItem('hasSeenTour');
        console.log('hasSeenTour value:', hasSeen);

        if (!hasSeen) {
          console.log('Starting the tour...');
          start();
          await AsyncStorage.setItem('hasSeenTour', 'true');
        } else {
          console.log('Tour already seen');
        }

        setReady(true); // set this after AsyncStorage completes
      } catch (error) {
        console.error('Error checking AsyncStorage:', error);
        setReady(true); // still render something
      }
    };


    checkTourStatus();
  }, []);

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


  const fetchVendorStaus = async () => {
    try {
      setIsLoading(true);
      setVendorStatus({});

      const response = await readApi(
        `invoice/getVendorStats/${selectedShop.id}`
      );

      if (response && response.success) {
        console.log("Dashboard Vendor Status Response:", response);
        setVendorStatus({ ...response });
        await AsyncStorage.setItem("vendorStatus", JSON.stringify(response));
      } else {
        console.log("Something went wrong, please try again!");
        setVendorStatus({});
        await AsyncStorage.removeItem("vendorStatus"); // Clear AsyncStorage on error
      }
    } catch (error) {
      console.log("Unable to get vendor dashboard data", error);
      setVendorStatus({});
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {

    if (selectedShop?.id && userData?.user?.mobile) {
      fetchVendorStaus();
    }
  }, [userData?.user?.mobile, selectedShop?.id, isFocused]);


  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchVendorStaus()
    } catch (error) {
      console.error('Refresh Error:', error);
    } finally {
      setRefreshing(false);  // 🔑 Always stop the loader
    }
  };

  const total =
    (vendorStatus?.totalSales || 0) +
    (vendorStatus?.numberOfProducts || 0) +
    (vendorStatus?.activeInvoices || 0) +
    (vendorStatus?.newCustomers || 0) +
    (vendorStatus?.totalInvoices || 0);

  const goToHandler = (Screen) => {
    // navigation.navigate("wertone", {screen:'CreateInvoice'});
    // console.log("Pra ", item)
    if (Screen === "CreateShopScreen") {
      navigation.navigate(Screen, { isHome: false });
    } else if (Screen === "bulkUpload") {
      setBulkUploadModalVisible(true)
    }
    else {
      console.log("hi");
      // navigation.navigate("StackNavigator", { screen: Screen });
      navigation.navigate(Screen, { startTour: true });
    }
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

  console.log("DATA OF ALL SHOP ", allShops.length);
  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        scrollEnabled={allShops && allShops.length > 0} // Disable scroll if allShops exists
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        // scrollEnabled={allShops && allShops.length > 0} // Disable scroll if allShops exists
      >
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
            <View
              style={
                allShops && allShops.length > 0
                  ? styles.header
                  : styles.userHeader
              }
            >
              <>
                <TourGuideZone
                  zone={1}
                  text={"User Name"}
                  shape="rectangle"
                  // tooltipBottomOffset={5} // Adjusts vertical position
                  // keepTooltipPosition={true} // Keeps the tooltip in place
                  pointerEvents="box-none"
                  style={{
                    position: "absolute",
                    width: width * 0.8, // Adjust width based on screen size
                    top: height * 0.04, // Adjust top position based on screen height
                    height: 32,
                  }}
                />
                <View style={{ marginBottom: -10 }}>
                  <Text style={styles.headerText}>
                    {t("Welcome")}{" "}
                    {userData?.user?.name
                      ? `${userData?.user?.name}`
                      : `${userData?.user?.mobile}`}
                  </Text>
                </View>
              </>

              <Text style={styles.subHeaderText}>
                Last Login : {lastLoginTime}
              </Text>

              <TourGuideZone
                zone={2}
                text={"Last login"}
                shape="rectangle"
                // tooltipBottomOffset={20} // Adjusts vertical position
                // keepTooltipPosition={true} // Keeps the tooltip in place
                pointerEvents="box-none"
                style={{
                  position: "absolute",
                  width: width * 0.7, // Adjust width
                  top: height * 0.082, // Adjust vertical position
                  height: 20,
                }}
              />
            </View>

            <View
              style={{
                // flex: allShops && allShops.length > 0 ? 1 : 0.6,
                marginTop: allShops && allShops.length > 0 ? 5 : 1,
              }}
            >
              <View
                style={
                  allShops && allShops.length > 0
                    ? styles.dropDownContainer
                    : styles.userDropdown
                }
              >
                <TourGuideZone
                  zone={3}
                  text={"See all the vender in dropdown"}
                  shape="rectangle"
                  pointerEvents="box-none"
                  // tooltipBottomOffset={20} // Adjusts vertical position
                  // keepTooltipPosition={true} // Keeps the tooltip in place
                  style={{
                    position: "absolute",
                    width: width * 0.8, // Adjust width based on screen width
                    top: height * 0.04, // Adjust top position
                    height: 45,
                    marginLeft: 20,
                  }}
                />

                <View style={styles.dropdownRow}>
                  <Ionicons name="storefront-sharp" size={24} color="#0c3b73" />
                  <DropDownList options={allShops} />
                </View>
              </View>
            </View>

            {/* vendorStatus == null */}
            {allShops && allShops.length > 0 && vendorStatus?.numberOfProducts != 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{

                  // paddingHorizontal: "5%",

                }}
              >
                <View style={{ flexDirection: "row", gap: 7, height: height * 0.09, marginTop: "8%", marginBottom: "-4%" }}>
                  <StatCard title="Total Sales" value={`$${vendorStatus?.totalSales ?? "N/A"}`} />
                  <StatCard title="Total Products" value={vendorStatus?.numberOfProducts ?? "N/A"} />

                  <StatCard title="Active Invoices" value={vendorStatus?.activeInvoices ?? "N/A"} />
                  <StatCard title="New Customers" value={vendorStatus?.newCustomers ?? "N/A"} />
                  <StatCard title="Total Invoices" value={vendorStatus?.totalInvoices ?? "N/A"} />


                </View>
              </ScrollView>
            )}

                {/* PieChartComponent */}
                {allShops &&
                  allShops.length > 0 &&
                  vendorStatus != null &&
                  total > 0 && (
                    <PieChartComponent
                      key={userData?.user?.mobile}
                      vendorStatus={vendorStatus}
                      t={t}
                    />
                  )}


            <View style={{
              // flex: 3
              flex: total ? 3 : 7
            }}>
              {allShops?.length > 0 ? (
                <FlatList
                  style={styles.flatList}
                  data={services}
                  numColumns={3}
                  renderItem={({ item, index }) => (
                    <View style={styles.flatListitem}>
                      <TouchableOpacity
                        style={styles.item}
                        onPress={() => goToHandler(item.navigateTo)}
                      >
                        <View style={{ alignItems: "center" }}>
                          <Text>{item.icon}</Text>
                          <Text style={styles.itemText}>{t(item.name)}</Text>
                        </View>
                      </TouchableOpacity>
                      <TourGuideZone
                        key={index}
                        zone={4 + index}
                        text={item.name ? `Go to ${item.name}` : "Finished"}
                        shape={"circle"}
                        style={{
                          position: "absolute",
                          top: height * 0.02,
                          left: width * 0.1,
                          // width: 80,
                          height: height * 0.1,
                          // borderRadius: 25,
                          backgroundColor: "transparent",
                          flex: 1,
                          margin: width * 0.05,
                        }}
                        pointerEvents="box-none"
                      />
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  ListEmptyComponent={<Text>No Items Found</Text>}
                />
              ) : (
                <View
                  style={{
                    // flex: 1.5,
                    justifyContent: "flex-start",
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
                    <Text style={styles.btntext}>Please add a shop</Text>
                  </TouchableOpacity>
                  {/* <Button mode="contained"> Please Become a vendor </Button> */}
                </View>
              )}
            </View>

            {noItemModal && (
              <ConfirmModal
                visible={noItemModal}
                setVisible={setNoItemModal}
                handlePress={() => {
                  navigation.navigate("AddProduct", { editItem: noItemData });
                  setNoItemModal(false);
                }}
                message="Hey Provider Please Add Products in your Shop"
                heading="Add Products"
                buttonTitle="Add Products"

              />
            )}

            <View>

              {bulkUploadModalVisible && (
                <FileUploadModal
                  visible={bulkUploadModalVisible}
                  setBulkUploadModalVisible={setBulkUploadModalVisible}
                />
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const StatCard = ({ title, value, change }) => {
  return (
    <Card style={styles.statCard}>
      <View style={{ flexDirection: "row" }}>
        <Text
          style={{
            marginRight: 15,
            fontSize: fontSize.label,
            fontFamily: fontFamily.medium,
          }}
        >
          {title}
        </Text>
        {/* <Text style={[styles.statChange, { color: change.includes("-") ? "red" : "green" }]}>
          {change}
        </Text> */}
      </View>
      <Text
        style={{
          fontSize: fontSize.label,
          fontFamily: fontFamily.bold,
          marginLeft: 5,
        }}
      >
        {value ?? "N/A"}
      </Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollView: {
    //height: "140%",
    flexGrow: 1,
    // paddingHorizontal: responsiveWidth(1),  // instead of fixed 20px
    //paddingVertical: responsiveHeight(2),
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
    height: verticalScale(900),
  },
  header: {
    flex: 0.5,
    marginTop: 4,
    marginLeft: 10,
    // paddingBottom:0,
    gap: responsiveHeight(1),
  },
  userHeader: {
    flex: 0.3,
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
    marginTop: 5,

    //  fontFamily:'Roboto_700Bold'
  },

  subHeaderText: {
    color: "#fff",

    fontSize: fontSize.labelSmall,
    fontFamily: fontFamily.medium,
    marginTop: 7,
  },
  dropDownContainer: {
    paddingVertical: "2.5%",
    paddingHorizontal: "7%",
    backgroundColor: "#f6f2f7",
    borderRadius: 10,
    marginTop: "3%",
  },
  userDropdown: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    backgroundColor: "#f6f2f7",
    borderRadius: 10,
    marginTop: "3%",
  },

  dropdownRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: "5%", // Space between icon and dropdown
  },

  viewsContainer: {
    height: 50,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "green",
  },
  allThreeViews: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
    backgroundColor: "red",
  },
  statCard: {
    height: "100%",

    marginHorizontal: 3,
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000", // Use black for a soft shadow
    shadowOffset: { width: 0, height: 2 }, // Adds depth
    shadowOpacity: 0.3, // Light shadow effect
    shadowRadius: 3, // Soft shadow edges
    elevation: 4, // More depth on Android
    justifyContent: "flex-end",
    alignSelf: "flex-end",
    width: 140,
  },

  flatList: {
    flex: 1,

    // height: 50,
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
    height: responsiveHeight(22),
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
    position: "absolute",
    top: 30,
    left: 40,
    // width: 80,
    height: 80,
    // borderRadius: 25,
    backgroundColor: "transparent",
    flex: 1,
    margin: 10,
    // alignItems: "center",
    // justifyContent: "center",
  },
  flatListitem: {
    // borderWidth:2,
    marginTop: 10,
    paddingVertical: 8,
    flex: 1,
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor:"#fff",
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  centerText: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    top: "45%",
    left: "45%",
  },
  chartText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
  },
  chartValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },

});
