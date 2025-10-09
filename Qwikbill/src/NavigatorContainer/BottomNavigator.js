import { useState, useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
// import WertoneLogoTitle from "../Component/HeaderComponents/WertoneLogoTitle.js";
import WertoneLogoTitle from "../Components/HeaderComponents/WertoneLogoTitle.js";
import HomeScreen from "../Screen/HomeScreen.js";
import ProfileSetting from "../Screen/ProfileSetting";
import { Text, StyleSheet } from "react-native";
import ProductDetailsScreen from "../StackScreen/ProductSection/ProductDetailsScreen.js";
import HomeHeaderRight from "../Components/HeaderComponents/HomeHeaderRight.js";
import { fontSize } from "../Util/UtilApi.js";
import ViewInvoiceScreen1 from "../Screen/Invoices/ViewInvoiceScreen1.js";
import { useTranslation } from "react-i18next";
import { SafeAreaView,useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../constants/Theme.js";
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
  const{t}=useTranslation()
  const insets = useSafeAreaInsets(); 
  const{colors}=useTheme()
  // const handleSearch = (query) => {
  //   setSearchQuery(query);
  //   // Handle search logic here
  //   console.log(query);
  // };

  // console.log("set no item moal in tab",setNoItemModal)
  // console.log("set role detais",setroleDetails)
  return (
    // <SafeAreaView style={{ flex: 1, backgroundColor: colors?.background }}>
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: "#26a0df",
  tabBarInactiveTintColor: "#fff",
  headerShown: false,
  tabBarStyle: {
    height: 60, // compact height
    backgroundColor: "black",
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    borderTopWidth: 0.5,
    borderTopColor: "#444",
    paddingBottom: 5, // give some space for label
  },
  tabBarLabelStyle: {
    fontSize: 12,      // smaller font so it fits in compact height
    textAlign: "center",
    marginBottom: 2,   // fine-tune vertical alignment
  },
  tabBarIconStyle: {
    marginTop: 5,      // push icon slightly down
  },
  tabBarHideOnKeyboard: true,
          headerStyle: {
            backgroundColor: "#0c3b73",
            shadowColor: "transparent",
            elevation: 0,
          },
          headerTintColor: "white",
          headerTitleStyle: { fontWeight: "bold" },
          tabBarHideOnKeyboard: true,
        }}
    >
      <Tab.Screen
        name= "Home"
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
          tabBarLabel: t("Home"),
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
        name= {t("Invoices")}
        component={ViewInvoiceScreen1}
        // component={Invoice}
        options={{
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <Icon name="file-tray-full-outline" color={color} size={size} />
          ),
          headerTitle: () => (
            <Text style={styles.headerTitle}>{t("Invoices")}</Text>
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
        name=  "Products"
        component={ProductDetailsScreen}
        options={{
          headerShown: true,
          // headerTitle: t("Payments"),
          tabBarIcon: ({ color, size }) => (
            <Icon name="people-outline" color={color} size={size} />
          ),
          headerTitle: () => (
            <Text style={styles.headerTitle}>{t("Products Details")}</Text>
          ),

          headerTitleAlign: "center",
          
          tabBarLabel:t("Products")
        }}
      />

      <Tab.Screen
        name="Profile Setting"
        // component={ProfileSetting}
        options={{
          headerShown: true,
          tabBarLabel: t("Profile") ,
          tabBarIcon: ({ color, size }) => (
            <Icon name="person-outline" color={color} size={size} />
          ),

          headerTitle: () => (
            <Text style={styles.headerTitle}>{t("Profile ")}</Text>
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
    // </SafeAreaView>
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
