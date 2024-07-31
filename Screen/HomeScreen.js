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
export default function HomeScreen({ navigation, route }) {
  const [lastLoginTime, setLastLoginTime] = useState(route.params.previousLoginTime);
  const { getData } = useContext(AuthContext);
  const [loginDetail, setLoginDetail] = useState({});

  const [searchQuery, setSearchQuery] = useState("");
  const { searchMode, setSearchMode } = useContext(AuthContext);
  // const {overlayHeight} = useContext(AuthContext);
  const pickerRef = useRef();
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;

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

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        console.log("backPressed");
        if (searchMode) {
          setSearchMode(false);
          return true; // Prevent default back button behavior
        }
        return false; // Allow default back button behavior
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [searchMode])
  );

  const handleOutsidePress = () => {
    setSearchMode(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Handle search logic here
    console.log(query);
  };

  const goToHandler = (Screen) => {
    // navigation.navigate("wertone", {screen:'CreateInvoice'});
    // console.log("Pra ", item)
    navigation.navigate("StackNavigator", { screen: Screen });
  };
  return (
    <SafeAreaView style={styles.safeContainer}>
      <View
        style={[
          styles.overlay,
          // {height:overlayHeight}
        ]}
      ></View>

      <ScrollView style={styles.scrollView}>
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
          <View style={[styles.container, { height: windowHeight - 142 }]}>
            <View style={styles.header}>
              {/* <TextInput></TextInput> */}
              {/* <SearchHeader onSearch={handleSearch}/> */}
              <Text style={styles.headerText}>{`Welcome ${loginDetail.name} ${loginDetail.surname}`}</Text>
              <Text style={styles.subHeaderText}>
                Last Login: {lastLoginTime}
              </Text>
            </View>
            <View style={{ flex: 0.7, marginBottom: 5 }}>
              <Card style={styles.card}>
                <View>
                  <Card.Content style={styles.cardContent}>
                         <DropDownList/>
                    <View style={styles.viewsContainer}>
                    <Pressable style={styles.allThreeViews}>
                      <Text style={styles.whiteColor}>View</Text>
                      <Text style={styles.whiteColor}>Customer</Text>
                      </Pressable>
                      <Pressable style={styles.allThreeViews} 
                      onPress={() => goToHandler("Invoices")}>
                      <Text style={styles.whiteColor}>View</Text>
                      <Text style={styles.whiteColor}>Invoices</Text>
                      </Pressable>

                      <Pressable style={styles.allThreeViews}>
                      <Text style={styles.whiteColor}>View</Text>
                      <Text style={styles.whiteColor}>Stocks</Text>
                      </Pressable>
                  </View>


                    {/* <Text style={styles.accountNumber}>2070100000085650</Text>
           <Text style={styles.balance}>₹ 924.56</Text> */}
                  </Card.Content>
                </View>
              </Card>
            </View>
            <View style={{ flex: 1 }}>
              <FlatList
                style={styles.flatList}
                data={services}
                numColumns={4}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.item}
                    onPress={() => goToHandler(item.navigateTo)}
                  >
                    <View style={{ alignItems: "center" }}>
                      {item.icon}
                      <Text style={styles.itemText}>{item.name}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.key}
                key={4}
                // ItemSeparatorComponent={<View style={{height:10}} />}
                ListEmptyComponent={<Text>No Items Found</Text>}
                // ListHeaderComponent={<Text style={styles.listHeader}>List</Text>}
                // ListFooterComponent={<Text>List end</Text>}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    // flex: 1,
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingTop: 0,
  },
  scrollView: {
    height: "100%",
  },
  container: { 
    marginHorizontal: 10,
  },
  header: {
    flex: 0.2,
    padding: 15,
    gap: 4,
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  subHeaderText: {
    color: "#fff",
    fontSize: 14,
  },
  card: {
    flex: 1,
  },
  cardContent: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    justifyContent: "space-around",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#0c3b73",
    borderRadius: 10,
    width: "100%",
    paddingHorizontal: 10,
  },
  viewsContainer: {
    height: "50%",
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 10,
  },
  allThreeViews: {
    width: "30%",
    backgroundColor: "#0c3b73",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  flatList: {
    flex: 1,
  },
  item: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemText: {
    marginTop: 5,
    fontSize: 10,
    textAlign: "center",
    color: "#0c3b73",
  },
  listHeader: {
    textAlign: "center",
    marginBottom: 5,
    fontSize: 10,
  },
  overlay: {
    position: "absolute",
    top: 0, // Adjust the top value as needed
    width: "100%",
    height: "20%",
    backgroundColor: "#0c3b73",
    zIndex: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  whiteColor: {
    color: "white",
  },
});
