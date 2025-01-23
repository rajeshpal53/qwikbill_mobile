import { useState, useContext } from "react";

import {
  createStackNavigator,
  HeaderStyleInterpolators,
} from "@react-navigation/stack";
import BottomNavigator from "./BottomNavigator.js";
import { AuthContext } from "../Store/AuthContext.js";
import { ShopDetailContext } from "../Store/ShopDetailContext.js";
import Icon from "react-native-vector-icons/Ionicons";
import { ActivityIndicator } from "react-native-paper";
import PasscodeScreen from "../Screen/PasscodeScreen.js";
import LoginScreen from "../Screen/LoginScreen.js";
import AddInvoiceScreen from "../Screen/AddInvoiceScreen.js";
import {
  Button,
  Pressable,
  TextComponent,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { CustomTabBar } from "../Components/CustomDrawerContent.js";
import AddProductScreen from "../Screen/AddProductScreen.js";
import InvoiceDetailScreen from "../Screen/InvoiceDetailScreen.js";
import ProductDetailScreen from "../Screen/ProductDetailScreen.js";
import EditInvoiceScreen from "../Screen/EditInvoiceScreen.js";
import EditProductScreen from "../Screen/EditProductScreen.js";
import EditCustomerScreen from "../Screen/EditCustomerScreen.js";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Feather } from "@expo/vector-icons";
import HomeHeaderRight from "../Components/HeaderComponents/HomeHeaderRight.js";
import CreateInvoice from "../Components/CreateInvoice.js";
import LogoutBtn from "../Components/HeaderComponents/LogoutBtn.js";
import ReviewAndPayScreen from "../Screen/ReviewAndPayScreen.js";
import InvoiceSuccessScreen from "../Screen/InvoiceSuccessScreen.js";
import AddVendorScreen from "../Screen/AddVendorScreen.js";
import * as LocalAuthentication from "expo-local-authentication";
import LocalAuthScreen from "../LocalAuthScreen.js";
import FilterInvoiceScreen from "../Screen/FilterInvoiceScreen.js";
import ViewInvoiceScreen from "../Screen/Invoices/ViewInvoiceScreen.js";
import RotateBtn from "../Components/HeaderComponents/RotateBtn.js";
import GenrateInvoiceScreen from "../Screen/GenrateInvoiceScreen.js";
import Forgetpasscode from "../Screen/ForgetPasscode/Forgetpasscode.js";
import CreateNewPasscode from "../Screen/ForgetPasscode/CreateNewPasscode.js";
import CreateShopScreen from "../Screen/Shops/CreateShopScreen.js";
import ViewShopsScreen from "../Screen/Shops/ViewShopsScreen.js";
import VendorListScreen from "../Screen/Vendors/VendorListScreen.js";
import SignupScreen from "../Screen/SignupScreen.js";
import ViewClientScreen from "../Screen/Client/ViewClientScreen.js";
import VendorFormScreen from "../Screen/Vendors/VendorFormScreen.js";
import TaxScreen from "../Screen/hsncode/TaxScreen.js";
import CheckInternet from "../Screen/CheckInternet/CheckInternet.js";
import ShopDetailScreen from "../Screen/Shops/ShopDetailScreen.js";
import VendorDetailScreen from "../Screen/Vendors/VendorDetailScreen.js";
import EditProfile from "../Screen/EditProfile.js";
import SetPasswordSreen from "../StackScreen/SetPasswordScreen.js";
import UserloginScreen from "../StackScreen/UserLoginScreen.js";
import CustomBackButton from "../Component/CustomBackButton.js";
import CustomerDetails from "../StackScreen/Customerdetails.js";
import AddCustomerScreen from "../Screen/AddCustomerScreen";
import AllItemProduct from "../../src/StackScreen/AllItemProduct.js";
// <<<<<<< Akash

// export default function StackNavigator() {
//   const Stack = createStackNavigator();
//   const [isConnected, setIsConnected] = useState(false);
//   const [isLandscape, setIsLandscape] = useState(false);
//   const { isAuthenticated, isLoading, searchMode } = useContext(AuthContext);
//   const { shopDetails } = useContext(ShopDetailContext);

//   if (isLoading) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }
//   console.log(isLoading);
//   console.log(isAuthenticated, "akdskddkfkfkf");
//   return (
//     <>
//       <Stack.Navigator
//         initialRouteName={isAuthenticated ? "Passcode" : "login"}
//         screenOptions={{
//           headerStyle: {
//             backgroundColor: "#0c3b73", // Set your desired header background color here
//           },
//           headerTitleAlign: "center",
//           headerTintColor: "white", // Set your desired header text color here
//           headerTitleStyle: {
//             fontWeight: "bold", // Optional: Set your desired font weight
//           },
//           headerLeft: searchMode ? () => null : undefined, // This removes the back button
//         }}
//       >
//         <Stack.Screen
//           name="wertone"
//           component={BottomNavigator}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="local"
//           component={LocalAuthScreen}
//           screenOptions={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="login"
//           component={LoginScreen}
//           screenOptions={{ headerShown: false }}
//           // options={{ title: 'Login '}}
//           options={{
//             headerShown: false,
//           }}
//         />
//         <Stack.Screen
//           name="Signup"
//           component={SignupScreen}
//           screenOptions={{ headerShown: false }}
//           options={{
//             headerShown: false,
//           }}
//         />
//         <Stack.Screen
//           name="AddInvoice"
//           component={AddInvoiceScreen}
// =======
import CustomerDetailScreen from "../Screen/CustomerDetailScreen.js";
import EnterNumberScreen from "../Screen/StackScreen/EnterNumberScreen.js";
import UserDataContext from "../Store/UserDataContext.js";
export default function StackNavigator() {
  const Stack = createStackNavigator();
  const [isConnected, setIsConnected] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const { isAuthenticated, isLoading, searchMode } = useContext(AuthContext);
  const { userData } = useContext(UserDataContext);
  const { shopDetails } = useContext(ShopDetailContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  console.log("userData is", userData);
  // console.log(isLoading);
  // console.log(isAuthenticated, "akdskddkfkfkf");
  return (
    <>
      <Stack.Navigator
        initialRouteName={userData ? "Passcode" : "login"}
        screenOptions={{
          headerTitle: "Create Invoice",
        }}
      >
        <Stack.Screen
          name="AddCustomer"
          component={AddCustomerScreen}
          options={{
            headerTitle: "Add Customer",
          }}
        />
        <Stack.Screen
          name="AddProduct"
          component={AddProductScreen}
          options={{
            headerTitle: "Add Product",
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
            headerTitle: searchMode ? "" : "View Vendor",
            headerTitleAlign: searchMode ? "left" : "center",
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
            headerTitle: searchMode ? "" : "HSN Codes",
            headerTitleAlign: searchMode ? "left" : "center",
          }}
        />
        <Stack.Screen
          name="VendorForm"
          component={VendorFormScreen}
          options={{
            headerTitle: "Add Vendor",
          }}
        />
        <Stack.Screen
          name="InvoiceDetail"
          component={InvoiceDetailScreen}
          options={{
            headerTitle: "Invoice Details",
          }}
        />
        <Stack.Screen
          name="CustomerDetail"
          component={CustomerDetailScreen}
          options={{
            headerTitle: "Customer Details",
          }}
        />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{
            headerTitle: "Product Details",
          }}
        />
        <Stack.Screen
          name="EditInvoice"
          component={EditInvoiceScreen}
          options={{
            headerTitle: "Edit Invoice Details",
          }}
        />
        <Stack.Screen
          name="EditProduct"
          component={EditProductScreen}
          options={{
            headerTitle: "Edit Product Details",
          }}
        />
        <Stack.Screen
          name="editProfile"
          component={EditProfile}
          options={{
            headerTitle: "Edit Profile",
          }}
        />
        <Stack.Screen
          name="EditCustomer"
          component={EditCustomerScreen}
          options={{
            headerTitle: "Edit People Details",
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
            headerTitle: "Add Invoice",
          }}
        />
        <Stack.Screen
          name="CreateShopScreen"
          component={CreateShopScreen}
          options={{
            headerTitle: "Add Shop",
          }}
        />
        <Stack.Screen
          name="genrateInvoice"
          component={GenrateInvoiceScreen}
          options={{
            headerTitle: "Generate Invoice",
          }}
        />
        <Stack.Screen
          name="ReviewAndPay"
          component={ReviewAndPayScreen}
          options={{
            headerTitle: "Review And Pay",
            headerRight: () => (
              <RotateBtn
                isLandscape={isLandscape}
                setIsLandscape={setIsLandscape}
              />
            ),
            headerLeft: () => (
              <CustomBackButton
                isLandscape={isLandscape}
                setIsLandscape={setIsLandscape}
              />
            ),
          }}
        />
        <Stack.Screen
          name="InvoiceSuccess"
          component={InvoiceSuccessScreen}
          options={{
            headerTitle: "Invoice Success",
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
            headerRight: () => (
              <RotateBtn
                isLandscape={isLandscape}
                setIsLandscape={setIsLandscape}
              />
            ),
            headerLeft: () => (
              <CustomBackButton
                isLandscape={isLandscape}
                setIsLandscape={setIsLandscape}
              />
            ),
          })}
        />
        <Stack.Screen
          name="ViewShops"
          component={ViewShopsScreen}
          options={{
            headerRight: () => <HomeHeaderRight />,
            headerTitle: !searchMode ? "My Shops" : "", // Provide a default title
            headerTitleAlign: searchMode ? "left" : "center",
          }}
        />

        <Stack.Screen
          name="ShopDetails"
          component={ShopDetailScreen}
          options={{
            headerTitle: "My Shops", // Provide a default title
          }}
        />

        <Stack.Screen
          name="VendorDetail"
          component={VendorDetailScreen}
          options={{
            headerTitle: "Vendor Details", // Provide a default title
          }}
        />
        <Stack.Screen
          name="SetPasswordScreen"
          component={SetPasswordSreen}
          options={{
            headerTitle: "Set Password", // Provide a default title
          }}
        />
        <Stack.Screen
          name="UserloginScreen"
          component={UserloginScreen}
          options={{
            headerTitle: "User Login", // Provide a default title
          }}
        />

       

        <Stack.Screen
          name="AllItemProduct"
          component={AllItemProduct}
          options={{
            headerShown: true,
            // headerTitle: t("Payments"),
            tabBarIcon: ({ color, size }) => (
              <Icon name="people-outline" color={color} size={size} />
            ),
            headerTitle: () => (
              <Text style={styles.headerTitle}>{"Product "}</Text>
            ),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "transparent",
              // backgroundColor: "#fff"
            },
            headerLeft: () => <CustomBackButton />,
          }}
        />

        <Stack.Screen
          name="wertone"
          component={BottomNavigator}
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
          // options={{ title: 'Login '}}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="EnterNumberScreen"
          component={EnterNumberScreen}
          screenOptions={{ headerShown: false }}
          // options={{ title: 'Login '}}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          screenOptions={{ headerShown: false }}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="AddInvoice"
          component={AddInvoiceScreen}
          screenOptions={{
            headerTitle: "Create Invoice",
          }}
        />

     
       
     

        <Stack.Screen
          name="CustomerDetails"
          component={CustomerDetails}
          options={{
            headerShown: true,
            // headerTitle: t("Payments"),
            tabBarIcon: ({ color, size }) => (
              <Icon name="people-outline" color={color} size={size} />
            ),
            headerTitle: () => (
              <Text style={styles.headerTitle}>{"Customer Details"}</Text>
            ),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "transparent",
              // backgroundColor: "#fff"
            },
            headerLeft: () => <CustomBackButton />,
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
const styles = StyleSheet.create({
  headerTitle: {
    fontFamily: "Poppins-Regular",
    // fontSize: fontSize.headingSmall,
    fontWeight: "bold",
  },
});
// >>>>>>> prathamesh
