import { useState, useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
// import WertoneLogoTitle from "../Component/HeaderComponents/WertoneLogoTitle.js";
import WertoneLogoTitle from "../Components/HeaderComponents/WertoneLogoTitle.js";
import HomeScreen from "../Screen/HomeScreen.js";
import FilterInvoiceScreen from "../Screen/FilterInvoiceScreen.js";
import CustomerDetail from "../StackScreen/CustomerSection/CustomerDetails.js";
import ProfileSetting from "../Screen/ProfileSetting";
import CustomBackButton from "../Component/CustomBackButton";
import { Text, StyleSheet } from "react-native";
import ProductDetailsScreen from "../StackScreen/ProductSection/ProductDetailsScreen.js";
import { AuthContext } from "../Store/AuthContext.js";
import HomeHeaderRight from "../Components/HeaderComponents/HomeHeaderRight.js";
import { fontSize } from "../Util/UtilApi.js";
import ViewInvoiceScreen1 from "../Screen/Invoices/ViewInvoiceScreen1.js";
export default function BottomNavigator({
  roleDetails,
  setroleDetails,
  fetchServiceProvider,
  noItemModal,
  setNoItemModal
}) {
  const [searchQuery, setSearchQuery] = useState("");
  // const { searchMode } = useContext(AuthContext);
  const Tab = createBottomTabNavigator();
  // const handleSearch = (query) => {
  //   setSearchQuery(query);
  //   // Handle search logic here
  //   console.log(query);
  // };

  // console.log("set no item moal in tab",setNoItemModal)
  // console.log("set role detais",setroleDetails)
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: "#26a0df", // Color for active tab
        tabBarInactiveTintColor: "#fff", // Color for inactive tabs
        tabBarLabelStyle: {
          fontSize: 14, // Adjust the label font size
          // borderRadius:10,
        },
        headerShown: false,
        tabBarStyle: {
          height: 55,
          backgroundColor: "black",
          color: "white",
          borderTopRightRadius: 15,
          borderTopLeftRadius: 15,
          borderTopColor: "#fff",
          // borderTo
        },
        headerStyle: {
          // backgroundColor: `#262580`, // Set your desired header background color here
          backgroundColor: "#0c3b73",
          shadowColor: "transparent", // This removes the shadow on iOS
          elevation: 0, // This removes the shadow on Android
          // marginTop:2,
        },
        tabBarHideOnKeyboard: true,
        headerTintColor: "white", // Set your desired header text color here
        headerTitleStyle: {
          fontWeight: "bold", // Optional: Set your desired font weight
        },
        // headerLeft: () => (
        //   <Pressable onPress={() => console.log("bar Pressed")}>
        //     <Ionicons name="person-circle-outline" size={40} color="#ffffff" />
        //   </Pressable>
        // ),
        headerRight: () => <HomeHeaderRight />,
      }}
    >
      <Tab.Screen
        name="Home"
        //component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-outline" color={color} size={size} />
          ),
          headerShown: true,
          // title:"myHome",
          headerTitle: () => <WertoneLogoTitle title="Invoicely" />,
          headerTitleAlign: "center",
          // headerTitle: !searchMode
          //   ? () => <WertoneLogoTitle title="Invoicely" />
          //   : "",
          // headerTitleStyle: {
          //   backgroundColor: "white",
          // },
          // headerTitle:"",
          // headerTitleAlign: !searchMode ? "center" : "left",
          tabBarLabel: "Home",
          headerRight: () => null,
          // tabBarVisible:false,
          // tabBarButton: () => null
        }}
      >
        {({ navigation }) => (
          <HomeScreen
            navigation={navigation}
            //noItemData={noItemData}
            setNoItemModal={setNoItemModal}
            noItemModal={noItemModal}
          />
        )}

       </Tab.Screen>

      <Tab.Screen
        name="Invoice"
        component={ViewInvoiceScreen1}
        // component={Invoice}
        options={{
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <Icon name="file-tray-full-outline" color={color} size={size} />
          ),
          headerTitle: () => (
            <Text style={styles.headerTitle}>{"Invoices"}</Text>
          ),
          headerTitleAlign: "center",

          // headerTitle: !searchMode
          //   ? () => (
          //       <Text
          //         style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
          //       >
          //         Invoices
          //       </Text>
          //     )
          //   : "",
          // headerLeft: () => <CustomBackButton />,
        }}
      />

      <Tab.Screen
        name="Products"
        component={ProductDetailsScreen}
        options={{
          headerShown: true,
          // headerTitle: t("Payments"),
          tabBarIcon: ({ color, size }) => (
            <Icon name="people-outline" color={color} size={size} />
          ),
          headerTitle: () => (
            <Text style={styles.headerTitle}>{"Products Details"}</Text>
          ),

          headerTitleAlign: "center",
          // headerStyle: {
          //   backgroundColor: "transparent",
          //   // backgroundColor: "#fff"
          // },
          // headerLeft: () => <CustomBackButton />,
        }}
      />

      <Tab.Screen
        name="Profile Setting"
        // component={ProfileSetting}
        options={{
          headerShown: true,
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Icon name="person-outline" color={color} size={size} />
          ),

          headerTitle: () => (
            <Text style={styles.headerTitle}>{"Profile Setting"}</Text>
          ),
          headerTitleAlign: "center",
        }}
      >
        {({ navigation }) => (
          <ProfileSetting
            navigation={navigation}
            roleDetails={roleDetails}
            setroleDetails={setroleDetails}
            fetchServiceProvider={fetchServiceProvider}

          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
const styles = StyleSheet.create({
  headerTitle: {
    fontFamily: "Poppins-Regular",
    fontSize: fontSize.headingSmall,
    fontWeight: "bold",
    color: "#fff",
  },
});
