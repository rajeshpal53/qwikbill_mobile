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
import Ionicons from '@expo/vector-icons/Ionicons';
import { Feather } from "@expo/vector-icons";
import HomeHeaderRight from "./Components/HeaderComponents/HomeHeaderRight.js";
import CreateInvoice from "./Components/CreateInvoice.js";
import LogoutBtn from "./Components/HeaderComponents/LogoutBtn.js";
import ReviewAndPayScreen from "./Screen/ReviewAndPayScreen.js";
import InvoiceSuccessScreen from "./Screen/InvoiceSuccessScreen.js";
import AddVendorScreen from "./Screen/AddVendorScreen.js";
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#0c3b73",
    accent:"#fff",
    secondry: "#96214e",
    // Set your custom primary color here
  },
};
function DrawerNavigator() {

  const [searchQuery, setSearchQuery] = useState('');
  const {searchMode} = useContext(AuthContext);

  const handleSearch = (query) => {
    console.log("seravj")
    setSearchQuery(query);
    // Handle search logic here
    console.log(query);
  };

  return (
    <Tab.Navigator 
    initialRouteName="Home"
      screenOptions={{
      headerShown:false,
      headerStyle: {
        // backgroundColor: `#262580`, // Set your desired header background color here
        backgroundColor:"#0c3b73",
        shadowColor: 'transparent', // This removes the shadow on iOS
        elevation: 0,               // This removes the shadow on Android
      },
      tabBarHideOnKeyboard:true,
      headerTintColor: 'white', // Set your desired header text color here
      headerTitleStyle: {
        fontWeight: 'bold', // Optional: Set your desired font weight
      },  
      headerLeft:() => (
        <Pressable onPress={()=> console.log("bar Pressed")}>
          <Ionicons name="person-circle-outline" size={40} color="#ffffff" />
        </Pressable>
      ),
      headerRight:() => (
        <HomeHeaderRight onSearch={handleSearch} />

      ),

    }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="home-outline" color = "#0c3b73" size={size} />
          ),
          headerShown:true,
          // title:"myHome",
          headerTitle: ((!searchMode)? 
             ((props) => (<WertoneLogoTitle {...props} />)):
             ("")),
          headerTitleStyle:{
            backgroundColor:"white",
          },
          // headerTitle:"",
          headerTitleAlign:((!searchMode)?"center":"left"),
          tabBarLabel:"Home", 
          // tabBarVisible:false,
          // tabBarButton: () => null
        }}
      />
      <Tab.Screen
        name="Invoice"
        component={Invoice}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="file-tray-full-outline" color="#0c3b73" size={size} />
          ),
        }}
      />
      
      <Tab.Screen
        name="Products"
        component={Products}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="pricetag-outline" color="#0c3b73" size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Customer"
        component={Customer}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="people-outline" color="#0c3b73" size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile Setting"
        component={ProfileSetting}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="person-outline" color="#0c3b73" size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="more"
        component={ProfileSetting}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="more-horizontal" size={size} color="#0c3b73"/>
          ),
        }}
      />
      
    </Tab.Navigator>
  );
}
function StackNavigator() {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  useEffect(() => {
    isAuthenticated;
  }, [isAuthenticated]);
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator initialRouteName={isAuthenticated ? "wertone" : "login"}  screenOptions={{
      headerStyle: {
        backgroundColor: '#0c3b73', // Set your desired header background color here
      },
      headerTintColor: 'white', // Set your desired header text color here
      headerTitleStyle: {
        fontWeight: 'bold', // Optional: Set your desired font weight
      },
    }}>
      <Stack.Screen
        name="wertone"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="login"
        component={LoginScreen}
        screenOptions={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddInvoice"
        component={AddInvoiceScreen}
        screenOptions={{}}
      />
      <Stack.Screen
        name="AddCustomer"
        component={AddCustomerScreen}
        screenOptions={{}}
      />
      <Stack.Screen
        name="AddProduct"
        component={AddProductScreen}
        screenOptions={{}}
      />
      <Stack.Screen
       name="AddVendor"
       component={AddVendorScreen}
       screenOptions={{}}
       />
      <Stack.Screen
        name="InvoiceDetail"
        component={InvoiceDetailScreen}
        screenOptions={{}}
      />
      <Stack.Screen
        name="CustomerDetail"
        component={CustomerDetailScreen}
        screenOptions={{}}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        screenOptions={{}}
      />
      <Stack.Screen
        name="EditInvoice"
        component={EditInvoiceScreen}
        screenOptions={{}}
      />
      <Stack.Screen
        name="EditProduct"
        component={EditProductScreen}
        screenOptions={{}}
      />
      <Stack.Screen
        name="EditCustomer"
        component={EditCustomerScreen}
        screenOptions={{}}
      />
      <Stack.Screen
        name="Passcode"
        component={PasscodeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
      name="CreateInvoice"
      component={CreateInvoice}
      options={{
        headerRight:() => (
          <LogoutBtn/>
        ),
      }}
      />
      <Stack.Screen
      name="ReviewAndPay"
      component={ReviewAndPayScreen}
      options={{
        headerRight:() => (
          <LogoutBtn/>
        )
      }}
      />
      <Stack.Screen
      name="InvoiceSuccess"
      component={InvoiceSuccessScreen}
      options={{
        headerRight:() => (
          <LogoutBtn/>
        )
      }}
      />
    </Stack.Navigator>
  );
}
export default function App() {

  

  return (
    <SafeAreaProvider>
      <SnackbarProvider>
        <Provider theme={customTheme}>
          <NavigationContainer>
            <AuthProvider>
              <Stack.Navigator initialRouteName="StackNavigator"  optionScreen={{headerStyle:{backgroundColor:"black"},
                  headerTintColor: 'white'}}>
                <Stack.Screen
                  name="StackNavigator"
                  component={StackNavigator}
                  options={{headerShown:false}}
                />
              </Stack.Navigator>
            </AuthProvider>
          </NavigationContainer>
        </Provider>
      </SnackbarProvider>
    </SafeAreaProvider>
  );
}
