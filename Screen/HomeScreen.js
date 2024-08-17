

import React, { useState, useContext, useEffect } from "react";
import { useRef } from "react";
import { View, Text, useWindowDimensions, Pressable } from "react-native";
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
import { Card, TextInput } from "react-native-paper";
import { AuthContext } from "../Store/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import { services } from "../tempList/ServicesList";
import CreateInvoice from "../Components/CreateInvoice";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { readApi } from "../Util/UtilApi";
import DropDownList from "../UI/DropDownList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoginTimeContext } from "../Store/LoginTimeContext";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useFonts } from "expo-font";
import { Roboto_400Regular, Roboto_700Bold, Roboto_300Light_Italic } from "@expo-google-fonts/roboto";
import AppLoading from "expo-app-loading";

export default function HomeScreen({ navigation }) {

  let [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    Roboto_300Light_Italic,
  });

  const { currentLoginTime, lastLoginTime, storeTime } = useContext(LoginTimeContext);
  // const [lastLoginTime, setLastLoginTime] = useState(route.params.previousLoginTime);
  // const { getData } = useContext(AuthContext);
  const [loginDetail, setLoginDetail] = useState({});

  const [searchQuery, setSearchQuery] = useState("");
  const { searchMode, setSearchMode } = useContext(AuthContext);
  // const {overlayHeight} = useContext(AuthContext);
  const pickerRef = useRef();
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;
  console.log(windowHeight)
  const overlayHeight = (0.20*windowHeight);
  console.log(responsiveHeight(80), "    --- responsiveHeight");
  console.log(verticalScale(700), "    --- verticalscale");

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

  function open() {
    pickerRef.current.focus();
  }

  function close() {
    pickerRef.current.blur();
  }

  // useFocusEffect(
  //   React.useCallback(() => {
  //     const onBackPress = () => {
  //       console.log("backPressed");
  //       if (searchMode) {
  //         setSearchMode(false);
  //         return true; // Prevent default back button behavior
  //       }
  //       return false; // Allow default back button behavior
  //     };

  //     BackHandler.addEventListener("hardwareBackPress", onBackPress);

  //     return () => {
  //       BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  //     };
  //   }, [searchMode])
  // );

  const goToHandler = (Screen) => {
    // navigation.navigate("wertone", {screen:'CreateInvoice'});
    // console.log("Pra ", item)
    console.log("hi")
    navigation.navigate("StackNavigator", { screen: Screen });
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View
        style={styles.overlay}
      ></View>

      <View style={styles.scrollView}>
        
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerText}>{`Welcome, ${loginDetail.name} ${loginDetail.surname}`}</Text>
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
                    <DropDownList/>
                    </View>
                         
                    <View style={styles.viewsContainer}>
                      <Pressable  style={styles.allThreeViews} onPress={() => navigation.navigate("Customer")}>
                      <Text style={styles.whiteColor}>View Customers</Text>
                      </Pressable>

                      <View style={{
                        backgroundColor:"rgba(0,0,0,0.3)",
                        width:1,
                        height:"50%"
                        }}></View>

                      <Pressable  style={styles.allThreeViews} 
                      onPress={() => goToHandler("Invoices")}>
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
              <FlatList
                style={styles.flatList}
                data={services}
                numColumns={4}
                renderItem={({ item ,index}) => (
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
                keyExtractor={(item,index) =>index}
               
                // ItemSeparatorComponent={<View style={{height:10}} />}
                ListEmptyComponent={<Text>No Items Found</Text>}
                // ListHeaderComponent={<Text style={styles.listHeader}>List</Text>}
                // ListFooterComponent={<Text>List end</Text>}
              />
            </View>
          </View>
        {/* </TouchableWithoutFeedback> */}
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
  container: { 
    marginHorizontal: responsiveWidth(5),
   
    height:responsiveHeight(80)
    // height:713,
    // height:"100%",
    // backgroundColor:"lightblue"
  },
  header: {
    flex: 0.3,
    // padding: 15,
    // padding: responsiveWidth(4),

    marginTop:4,
    marginLeft:10,
    // paddingBottom:0,
    gap: responsiveHeight(1),

  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
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
    paddingVertical:responsiveHeight(1),
  },
  dropDownContainer: {
    paddingVertical:10,
    paddingHorizontal:20,
  },
  viewsContainer: {
    height: "54%",
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 10,
    paddingVertical:10,
    alignItems:"center",
    paddingHorizontal:20,
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
    paddingVertical:5,
    // backgroundColor: "#fff",
    alignItems: "center",
    justifyContent:"center",
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
     fontSize:16
  },
});
