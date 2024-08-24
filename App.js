import "react-native-gesture-handler";
import React, { useEffect } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import WertoneLogoTitle from "./Components/HeaderComponents/WertoneLogoTitle.js";
import { Button, Pressable, TextComponent, View, Text } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Invoice from "./Screen/Invoice";
import PasscodeScreen from "./Screen/PasscodeScreen.js";
import Products from "./Screen/Products";
import Customer from "./Screen/Customer";
import LoginScreen from "./Screen/LoginScreen";
import SearchHeader from "./Components/SearchHeader.js";
import {
  HeaderStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import { Provider, Snackbar } from "react-native-paper";
import { DefaultTheme, ActivityIndicator } from "react-native-paper";
import AddInvoiceScreen from "./Screen/AddInvoiceScreen";
import AddCustomerScreen from "./Screen/AddCustomerScreen";
import { AuthProvider, AuthContext } from "./Store/AuthContext";
import { useContext } from "react";
import { StyleSheet } from "react-native";
import { CustomTabBar } from "./Components/CustomDrawerContent";
import AddProductScreen from "./Screen/AddProductScreen";
import InvoiceDetailScreen from "./Screen/InvoiceDetailScreen";
import CustomerDetailScreen from "./Screen/CustomerDetailScreen";
import ProductDetailScreen from "./Screen/ProductDetailScreen";
import EditInvoiceScreen from "./Screen/EditInvoiceScreen";
import EditProductScreen from "./Screen/EditProductScreen";
import EditCustomerScreen from "./Screen/EditCustomerScreen";
import { SnackbarProvider } from "./Store/SnackbarContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ProfileSetting from "./Screen/ProfileSetting";
import HomeScreen from "./Screen/HomeScreen.js";
import { useState } from "react";
import { size } from "lodash";
// import { Ionicons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Feather } from "@expo/vector-icons";
import HomeHeaderRight from "./Components/HeaderComponents/HomeHeaderRight.js";
import CreateInvoice from "./Components/CreateInvoice.js";
import LogoutBtn from "./Components/HeaderComponents/LogoutBtn.js";
import ReviewAndPayScreen from "./Screen/ReviewAndPayScreen.js";
import InvoiceSuccessScreen from "./Screen/InvoiceSuccessScreen.js";
import AddVendorScreen from "./Screen/AddVendorScreen.js";
import * as LocalAuthentication from "expo-local-authentication";
import LocalAuthScreen from "./LocalAuthScreen.js";
import FilterInvoiceScreen from "./Screen/FilterInvoiceScreen.js";
import ViewInvoiceScreen from "./Screen/Invoices/ViewInvoiceScreen.js";
import RotateBtn from "./Components/HeaderComponents/RotateBtn.js";
import { ShopDetailProvider } from "./Store/ShopDetailContext.js";
import { ShopDetailContext } from "./Store/ShopDetailContext.js";
import { LoginTimeProvider } from "./Store/LoginTimeContext.js";
import GenrateInvoiceScreen from "./Screen/GenrateInvoiceScreen.js";
import Forgetpasscode from "./Screen/ForgetPasscode/Forgetpasscode.js";
import CreateNewPasscode from "./Screen/ForgetPasscode/CreateNewPasscode.js";
import CreateShopScreen from "./Screen/Shops/CreateShopScreen.js";
import ViewShopsScreen from "./Screen/Shops/ViewShopsScreen.js";
import VendorListScreen from "./Screen/Vendors/VendorListScreen.js";
import { PasskeyProvider } from "./Store/PasskeyContext.js";
import SignupScreen from "./Screen/SignupScreen.js";
import ViewClientScreen from "./Screen/Client/ViewClientScreen.js";
import VendorFormScreen from "./Screen/Vendors/VendorFormScreen.js";
import TaxScreen from "./Screen/hsncode/TaxScreen.js";
import CustomBackButton from "./Components/HeaderComponents/CustomBackButton.js";
import CheckInternet from "./Screen/CheckInternet/CheckInternet.js";
import ShopDetailScreen from "./ShopDetailScreen.js";
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const customTheme = {
  ...DefaultTheme,
 
  colors: {
    ...DefaultTheme.colors,
    primary: "#0c3b73",
    accent: "#fff",
    secondry: "#96214e",
    // Set your custom primary color here
  },
};
function DrawerNavigator() {
  const [searchQuery, setSearchQuery] = useState("");
  const { searchMode } = useContext(AuthContext);

  // const handleSearch = (query) => {
  //   setSearchQuery(query);
  //   // Handle search logic here
  //   console.log(query);
  // };

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: '#26a0df', // Color for active tab
        tabBarInactiveTintColor: '#fff', // Color for inactive tabs
        tabBarLabelStyle: {
          fontSize: 14, // Adjust the label font size
          // borderRadius:10,
        },
        headerShown: false,
        tabBarStyle: {
          height: 55,
          backgroundColor:"black",
          color:"white",
          borderTopRightRadius:15,
          borderTopLeftRadius:15,
          borderTopColor:"#fff",
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
        headerRight: () => <HomeHeaderRight/>,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-outline" color={color} size={size} />
          ),
          headerShown: true,
          // title:"myHome",
          headerTitle: !searchMode
            ? () => <WertoneLogoTitle title="Billing Software" />
            : "",
          headerTitleStyle: {
            backgroundColor: "white",
          },
          // headerTitle:"",
          headerTitleAlign: !searchMode ? "center" : "left",
          tabBarLabel: "Home",
          headerRight: () => null,
          // tabBarVisible:false,
          // tabBarButton: () => null
        }}
      />
      <Tab.Screen
        name="Invoice"
        component={FilterInvoiceScreen}
        // component={Invoice}
        options={{
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <Icon name="file-tray-full-outline" color={color} size={size} />
          ),
          headerTitle: !searchMode
            ? () => <WertoneLogoTitle title="Invoices" />
            : "",

          headerTitleAlign: "left",
        }}
      />

      <Tab.Screen
        name="Products"
        component={Products}
        options={{
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <Icon name="pricetag-outline" color={color} size={size} />
          ),
          headerTitle: !searchMode
            ? () => <WertoneLogoTitle title="Products" />
            : "",

          headerTitleAlign: "left",
        }}
      />
      <Tab.Screen
        name="Customer"
        component={Customer}
        options={{
          headerShown: true,
          tabBarLabel: "People",
          tabBarIcon: ({ color, size }) => (
            <Icon name="people-outline" color={color} size={size} />
          ),
          headerTitle: !searchMode
            ? () => <WertoneLogoTitle  title="Peoples"/>
            : "",

          headerTitleAlign: "left",
        }}
      />
      <Tab.Screen
        name="Profile Setting"
        component={ProfileSetting}
        options={{
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <Icon name="person-outline" color={color} size={size} />
          ),
          headerTitle: !searchMode
            ? () => <WertoneLogoTitle title="Profile Settings" />
            : "",

          headerTitleAlign: !searchMode ? "center" : "left",
          headerRight: () => ""
        }}
      />
      {/* <Tab.Screen
        name="more"
        component={ProfileSetting}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="more-horizontal" size={size} color="#0c3b73" />
          ),
        }}
      /> */}
    </Tab.Navigator>
  );
}
function StackNavigator() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const { isAuthenticated, isLoading,  searchMode  } = useContext(AuthContext);
  const { shopDetails } = useContext(ShopDetailContext);

  
  // if (isLoading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator size="large" />
  //     </View>
  //   );
  // }

  return (
    <>
    <Stack.Navigator
      initialRouteName={isAuthenticated ? "Passcode" : "login"}
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0c3b73", // Set your desired header background color here
        },
        headerTitleAlign:"center",
        headerTintColor: "white", // Set your desired header text color here
        headerTitleStyle: {
          fontWeight: "bold", // Optional: Set your desired font weight
        },
        headerLeft: searchMode ? () => null : undefined, // This removes the back button
      }}
    >
      <Stack.Screen
        name="wertone"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="local"
        component={LocalAuthScreen}
        screenOptions={{ headerShown: false }}
      />
      <Stack.Screen
        name="login"
        component={LoginScreen}
        screenOptions={{ headerShown: false }}
        options={{ title: 'Login ' }} 
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        screenOptions={{ headerShown: false }}
        options={{ title: 'Sign Up ' }} 
      />
      <Stack.Screen
        name="AddInvoice"
        component={AddInvoiceScreen}
        screenOptions={{
          headerTitle:"Create Invoice"
        }}
      />
      <Stack.Screen
        name="AddCustomer"
        component={AddCustomerScreen}
        options={{
          headerTitle:"Add Customer"
        }}
      />
      <Stack.Screen
        name="AddProduct"
        component={AddProductScreen}
        options={{
          headerTitle:"Add Product"
        }}
      />
      <Stack.Screen
        name="ViewVendor"
        component={VendorListScreen}
        options={{
          headerRight: () => <HomeHeaderRight />,
          // headerStyle: {
          //   backgroundColor: "#0c3b73", // Your desired background color
          // },
          headerTitle: (searchMode) ? "" : "View Vendor",
          headerTitleAlign:(searchMode) ? "left" : "center",
        }}
      />

      <Stack.Screen name="viewClient" component={ViewClientScreen} />

      <Stack.Screen
        name="hsncode"
        component={TaxScreen}
        options={{
          headerRight: () => <HomeHeaderRight />,
          headerStyle: {
            backgroundColor: "#0c3b73", // Your desired background color
          },
          headerTitle: (searchMode) ? "" : "HSN Codes",
          headerTitleAlign:(searchMode) ? "left" : "center"
        }}
      />
      <Stack.Screen
        name="VendorForm"
        component={VendorFormScreen}
        options={{
          headerTitle:"Add Vendor"
        }}
      />
      <Stack.Screen
        name="InvoiceDetail"
        component={InvoiceDetailScreen}
        options={{
          headerTitle:"Invoice Details"
        }}
      />
      <Stack.Screen
        name="CustomerDetail"
        component={CustomerDetailScreen}
        options={{
          headerTitle:"Customer Details"
        }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{
          headerTitle:"Product Details"
        }}
      />
      <Stack.Screen
        name="EditInvoice"
        component={EditInvoiceScreen}
        options={{
          headerTitle:"Edit Invoice Details"
        }}
      />
      <Stack.Screen
        name="EditProduct"
        component={EditProductScreen}
        options={{
          headerTitle:"Edit Product Details"
        }}
      />
      <Stack.Screen
        name="EditCustomer"
        component={EditCustomerScreen}
        options={{
          headerTitle:"Edit People Details"
        }}
      />
      <Stack.Screen
        name="Passcode"
        component={PasscodeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="forgetPasscode"
        component={Forgetpasscode}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateNewPasscode"
        component={CreateNewPasscode}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateInvoice"
        component={CreateInvoice}
        options={{
          headerTitle:"Add Invoice"
        }}
      />
      <Stack.Screen
        name="CreateShopScreen"
        component={CreateShopScreen}
        options={{
          headerTitle:"Add Shop"
        }}
      />
      <Stack.Screen
        name="genrateInvoice"
        component={GenrateInvoiceScreen}
        options={{
          headerTitle:"Generate Invoice"
        }}
      />
      <Stack.Screen
        name="ReviewAndPay"
        component={ReviewAndPayScreen}
        options={{
          headerTitle: "Review And Pay",
          headerRight: () => <RotateBtn isLandscape={isLandscape} setIsLandscape={setIsLandscape} />,
          headerLeft:() => <CustomBackButton isLandscape={isLandscape} setIsLandscape={setIsLandscape} />
        }}
      />
      <Stack.Screen
        name="InvoiceSuccess"
        component={InvoiceSuccessScreen}
        options={{
          headerTitle:"Invoice Success"
        }}
      />
      <Stack.Screen
        name="Invoices"
        component={FilterInvoiceScreen}
        options={
          {
            // headerTitle: ((false)?
            //      (() => ("")):
            //      ("kunal store"))
          }
        }
      />
      <Stack.Screen
        name="ViewInvoices"
        component={ViewInvoiceScreen} 
        options={({ route }) => ({
          headerTitle: shopDetails.shopname,
          headerRight: () => <RotateBtn isLandscape={isLandscape} setIsLandscape={setIsLandscape} />,
          headerLeft:() => <CustomBackButton isLandscape={isLandscape} setIsLandscape={setIsLandscape} />
        })}
      />
      <Stack.Screen
        name="ViewShops"
        component={ViewShopsScreen}
        options={{
          headerRight: () => <HomeHeaderRight />,
          headerTitle: !searchMode ? "My Shops" : "", // Provide a default title
        }}
      />

      <Stack.Screen
        name="ShopDetails"
        component={ShopDetailScreen}
        options={{
          headerRight: () => <HomeHeaderRight />,
          headerTitle: !searchMode ? "My Shops" : "", // Provide a default title
        }}
      />
    </Stack.Navigator>
    
    <CheckInternet
        isConnected={isConnected}
        setIsConnected={setIsConnected}
      />
    </>
    
  );
}
export default function App() {
  return (
    <SafeAreaProvider>
    <ShopDetailProvider>
        <PasskeyProvider>
          <SnackbarProvider>
            <Provider theme={customTheme}>
              <NavigationContainer>
                <AuthProvider>
                  <LoginTimeProvider>
                  <Stack.Navigator
                    initialRouteName="StackNavigator"
                    optionScreen={{
                      headerStyle: { backgroundColor: "black" },
                      headerTintColor: "white",
                    }}
                  >
                    <Stack.Screen
                      name="StackNavigator"
                      component={StackNavigator}
                      options={{ headerShown: false }}
                    />
                  </Stack.Navigator>
                  </LoginTimeProvider>
                </AuthProvider>
              </NavigationContainer>
            </Provider>
          </SnackbarProvider>
        </PasskeyProvider>
    </ShopDetailProvider>
    </SafeAreaProvider>
  );
}
