
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
import { services, rolePermissions } from "../tempList/ServicesList";
import CreateInvoice from "../Components/CreateInvoice";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { API_BASE_URL, ButtonColor, fontFamily, fontSize, readApi } from "../Util/UtilApi";
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
import ConfirmModal from "../Components/Modal/ConfirmModal";
import { useTranslation } from "react-i18next";
import FileUploadModal from "../Components/BulkUpload/FileUploadModal";


export default function HomeScreen({ navigation, noItemData }) {
  const { t } = useTranslation();
  const { currentLoginTime, lastLoginTime, storeTime } =
    useContext(LoginTimeContext);
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

    console.log("all services ,", services);
    console.log("all services isLoading,", allShops);

  }, [allShops]);

  useEffect(() => {
    if (noItemModal) {
      console.log("Modal should show now because noItemModal is true.");
    }
  }, [noItemModal]);

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

      const id = selectedShop?.vendor?.id
      setIsLoading(true);
      setVendorStatus({});

      const response = await readApi(
        `invoice/getVendorStats/${id}`
      );

      if (response && response.success) {
        console.log("Dashboard Vendor Status Response:", response);
        console.log(`${API_BASE_URL}invoice/getVendorStats/${selectedShop?.vendor?.id}`)
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

    if (selectedShop?.vendor?.id && userData?.user?.mobile) {
      fetchVendorStaus();
    }
  }, [userData?.user?.mobile, selectedShop?.vendor?.id, isFocused]);


  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchVendorStaus()
    } catch (error) {
      console.error('Refresh Error:', error);
    } finally {
      setRefreshing(false);
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

      <View style={styles.overlay}>
        <View style={styles.header}>
          <View style={{ marginBottom: -10 }}>
            <Text style={styles.headerText}>
              {t("Welcome")}{" "}
              {userData?.user?.name
                ? `${userData?.user?.name}`
                : `${userData?.user?.mobile}`}
            </Text>
          </View>
          <Text style={styles.subHeaderText}>Last Login : {lastLoginTime}</Text>
        </View>

        <View>
          <View style={styles.dropDownContainer}>
            <View style={styles.dropdownRow}>
              <Ionicons name="storefront-sharp" size={24} color="#0c3b73" />
              <DropDownList options={allShops} />
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollView}
        scrollEnabled={allShops && allShops.length > 0 && Boolean(total)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.scrollView}>
          <TourGuideZoneByPosition
            zone={0}
            shape={"circle"}
            isTourGuide
            top={200}
            text={"Welcome to the QwikBill"}
          />

          <View style={styles.container}>

            {allShops && allShops.length > 0 && vendorStatus?.numberOfProducts != 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: "row", gap: 7, height: height * 0.09, marginVertical: "4%", }}>
                  <StatCard title="Total Sales" value={`₹ ${vendorStatus?.totalSales ?? "N/A"}`} />
                  <StatCard title="Total Products" value={vendorStatus?.numberOfProducts ?? "N/A"} />
                  <StatCard title="Active Invoices" value={vendorStatus?.activeInvoices ?? "N/A"} />
                  <StatCard title="New Customers" value={vendorStatus?.newCustomers ?? "N/A"} />
                  <StatCard title="Total Invoices" value={vendorStatus?.totalInvoices ?? "N/A"} />
                </View>
              </ScrollView>
            )}

            {allShops && allShops.length > 0 && vendorStatus != null && total > 0 && (
              <PieChartComponent
                key={userData?.user?.mobile}
                vendorStatus={vendorStatus}
                t={t}
              />
            )}

            <View style={{ flex: total ? 2 : 7 }}>
              {allShops?.length > 0 ? (
                <View style={{ flex: 1, justifyContent: "center", marginTop: "5%" }}>
                  <FlatList
                    style={styles.flatList}
                    data={services.filter(service => {
                      if (service.name === "Add Product") {
                        return !!selectedShop;
                      }
                      return true
                    })}
                    numColumns={3}
                    renderItem={({ item, index }) => {
                      const role = selectedShop?.role?.name;
                      const isDisabled = !rolePermissions[role]?.includes(item.name);

                      return (
                        <View style={styles.flatListitem}>
                          <TouchableOpacity
                            style={[styles.item, isDisabled && { opacity: 0.5 },]}
                            onPress={() => {
                              if (!isDisabled) {
                                goToHandler(item.navigateTo);
                              }
                            }}
                            disabled={isDisabled}
                          >
                            <View style={{ alignItems: "center" }}>
                              <Text>{item.icon}</Text>
                              <Text style={styles.itemText}>{t(item.name)}</Text>
                            </View>
                          </TouchableOpacity>
                          <TourGuideZone
                            key={index}
                            zone={4 + index}
                            text={item.name ? `Go to ₹{item.name}` : "Finished"}
                            shape={"circle"}
                            style={{
                              position: "absolute",
                              top: height * 0.02,
                              left: width * 0.1,
                              height: height * 0.1,
                              backgroundColor: "transparent",
                              flex: 1,
                              margin: width * 0.05,
                            }}
                            pointerEvents="box-none"
                          />
                        </View>
                      )
                    }}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={<Text>No Items Found</Text>}
                  />
                </View>
              ) : (
                <View style={{ flex: 0.5, justifyContent: "flex-end", alignItems: "center", marginTop: "10%" }}>
                  <Image
                    source={require("../../assets/invoiceGenrate.png")}
                    style={{ width: 300, height: 280 }}
                  />
                  <Text style={styles.vendorText}>To Generate New Invoice</Text>
                  <TouchableOpacity
                    style={styles.touchableview}
                    onPress={() => navigation.navigate("CreateShopScreen")}
                  >
                    <Text style={styles.btntext}>Please add a shop</Text>
                  </TouchableOpacity>
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
    // flex: 1,
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

    // height: verticalScale(900),
    flex: 1
  },
  header: {
    flex: 0.5,
    marginVertical: 10,
    marginLeft: 15,
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
    marginHorizontal: 15

  },
  userDropdown: {
    paddingVertical: "2.5%",
    paddingHorizontal: "7%",
    backgroundColor: "#f6f2f7",
    borderRadius: 10,
    marginTop: "3%",
    marginHorizontal: 15
  },

  dropdownRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: "5%", // Space between icon and dropdown
    // backgroundColor:"yellow"
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
    paddingHorizontal: "1%",
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
    flexGrow: 1

  },
  item: {
    flex: 1,
    margin: 10,
    // padding: 2,
    // paddingVertical: 5,
    // backgroundColor: "orange",
    alignItems: "center",
    justifyContent: "center",


  },
  itemText: {
    marginTop: 5,
    fontSize: 12,
    textAlign: "center",
    color: "#555555",
  },
  overlay: {
    // position: "absolute",
    // top: 0, // Adjust the top value as needed
    width: "100%",
    height: responsiveHeight(23),
    backgroundColor: "#0c3b73",
    //zIndex: 0,
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
    //  backgroundColor: "pink"
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


