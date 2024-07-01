import "react-native-gesture-handler";
import React, { useEffect } from "react";
import Icon from "react-native-vector-icons/Ionicons";

import { Button, View } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Invoice from "./Screen/Invoice";
import Products from "./Screen/Products";
import Customer from "./Screen/Customer";
import LoginScreen from "./Screen/LoginScreen";
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
  return (
    <Tab.Navigator initialRouteName="Invoice"  screenOptions={{
      headerStyle: {
        backgroundColor: `#0c3b73`, // Set your desired header background color here
      },
      headerTintColor: 'white', // Set your desired header text color here
      headerTitleStyle: {
        fontWeight: 'bold', // Optional: Set your desired font weight
      },  
    }}>
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
        name="AddProduct"
        component={AddProductScreen}
        screenOptions={{}}
      />
      <Stack.Screen
        name="AddCustomer"
        component={AddCustomerScreen}
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
