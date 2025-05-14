import { useState, useContext, useEffect } from "react";

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
import {
  Button,
  Pressable,
  TextComponent,
  View,
  Text,
  StyleSheet,
} from "react-native";
import AddProductScreen from "../Screen/AddProductScreen.js";
import ProductDetailScreen from "../Screen/ProductDetailScreen.js";
import EditProductScreen from "../Screen/EditProductScreen.js";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Feather } from "@expo/vector-icons";
import HomeHeaderRight from "../Components/HeaderComponents/HomeHeaderRight.js";
import CreateInvoice from "../Components/CreateInvoice.js";
import LocalAuthScreen from "../LocalAuthScreen.js";
import ViewInvoiceScreen from "../Screen/Invoices/ViewInvoiceScreen.js";
import RotateBtn from "../Components/HeaderComponents/RotateBtn.js";
import GenrateInvoiceScreen from "../Screen/GenrateInvoiceScreen.js";
import Forgetpasscode from "../Screen/ForgetPasscode/Forgetpasscode.js";
import CreateNewPasscode from "../Screen/ForgetPasscode/CreateNewPasscode.js";
import CreateShopScreen from "../Screen/StackScreen/Shops/Form/CreateShopScreen.js";
import ViewShopsScreen from "../Screen/StackScreen/Shops/ViewShopsScreen.js";
import VendorListScreen from "../Screen/Vendors/VendorListScreen.js";
import CheckInternet from "../Screen/CheckInternet/CheckInternet.js";
import ShopDetailScreen from "../Screen/StackScreen/Shops/ShopDetailScreen.js";
import VendorDetailScreen from "../Screen/Vendors/VendorDetailScreen.js";
import EditProfile from "../Screen/EditProfile.js";
import SetPasswordSreen from "../StackScreen/SetPasswordScreen.js";
import UserloginScreen from "../StackScreen/UserLoginScreen.js";
import CustomBackButton from "../Component/CustomBackButton.js";
import CustomerDetails from "../StackScreen/Customerdetails.js";
import AllItemProduct from "../../src/StackScreen/AllItemProduct.js";
import EnterNumberScreen from "../Screen/StackScreen/EnterNumberScreen.js";
import UserDataContext from "../Store/UserDataContext.js";
import PdfScreen from "../Component/PdfViewer.js";
import EditProfileScreen from "../Screen/StackScreen/EditProfileScreen.js";
import AddRole from "../Screen/StackScreen/Addrole.js";
import { withCopilot } from "react-native-copilot";
import ViewShopDetailsScreen from "../Screen/StackScreen/Shops/ViewShopDetailsScreen.js";
import ViewInvoiceScreen1 from "../Screen/Invoices/ViewInvoiceScreen1.js";
import InvoicePreviewScreen from "../Screen/Invoices/InvoicePreviewScreen.js";
import TransactionScreen from "../Screen/Transactions/TransactionScreen.js";
import TransactionDetailScreen from "../Screen/Transactions/TransactionDetailScreen.js";
import AdminSectionScreen from "../Screen/StackScreen/AdminSectionScreen.js";
import { API_BASE_URL, fontSize, readApi } from "../Util/UtilApi.js";
import AllUsersScreen from "../Screen/StackScreen/AllUsersScreen.js";
import AllInvoiceScreen from "../Screen/StackScreen/AllInvoiceScreen.js";
import AllVendorScreen from "../Screen/StackScreen/AllVendorScreen.js";
import AllVendorDataScreen from "../Screen/StackScreen/AllVendorDataScreen.js";
import ProductDetailsScreen from "../StackScreen/ProductSection/ProductDetailsScreen.js";
import CustomerDetail from "../StackScreen/CustomerSection/CustomerDetails.js";
import PoliciesDetailsScreen from "../StackScreen/PoliciesDetailsScreen.js";
import AllQueryAndSupport from "../../src/Screen/StackScreen/QueriesScreens/AllQueryAndSupport.js";
import EditRole from "../Screen/StackScreen/EditRole.js";
import RoleDetailsScreen from "../Screen/StackScreen/RoleDetailsScreen.js";
import InvoiceTransactionScreen from "../Screen/StackScreen/InvoiceTransactionScreen.js";
import { useTranslation } from "react-i18next";


export default function StackNavigator() {
  const Stack = createStackNavigator();
  const [isLandscape, setIsLandscape] = useState(false);
  const { isAuthenticated, isLoading, searchMode } = useContext(AuthContext);
  const { userData, fetchUserData, clearUserData } =
    useContext(UserDataContext);
  const [isForgetPasswordState, setIsForgetPasswordState] = useState(false);
  const [roleDetails, setroleDetails] = useState(false);
  const [noItemModal, setNoItemModal] = useState(false);
  const [noItemData, setNoItemData] = useState({});
    const{t}=useTranslation()
  const fetchServiceProvider = async (userData) => {
    try {
      if (userData) {
        const userfk = userData?.user?.id;
        console.log("USERFK ", userfk);
        const response = await readApi(`userRoles/${userfk}`, {
          Authorization: `Bearer ${userData?.token}`,
        });

        console.log("full response isss ", response);

        if (Object.keys(response?.data).length > 0) {
          setroleDetails(true);
        } else {
          setroleDetails(false);
        }
      } else {
        console.log("service Provider Not Found , ", userData);
        setroleDetails(false);
      }
    } catch (err) {
      console.log("Error is , , - ", err);
      console.log("err.data.status", err.status);
     
    } finally {
      // setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData()
      .then((userData) => {
        console.log("User Data: ", userData);
        if (userData) {
          fetchServiceProvider(userData);
        }
      })
      .catch((error) => {
        console.log("Error fetching user data: ", error);
      });
  }, []);


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
        // initialRouteName={userData ? "Passcode" : "login"}
        initialRouteName={
          isForgetPasswordState ? "login" : userData ? "Passcode" : "login"
        }
        screenOptions={
          {
            // headerTitle: "Create Invoice",
          }
        }
      >
        <Stack.Screen
          name="wertone"
          options={{
            headerShown: false,
            cardStyle: { backgroundColor: "#fff" },
          }}
        >
          {({ navigation }) => (
            <BottomNavigator
              navigation={navigation}
              roleDetails={roleDetails}
              setroleDetails={setroleDetails}
              fetchServiceProvider={fetchServiceProvider}
              noItemModal={noItemModal}
              setNoItemModal={setNoItemModal}
              noItemData={noItemData}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="AddProduct"
          component={AddProductScreen}
          options={{
            // headerTitle: "Add Product",
            headerTitle: () => (
              <Text style={styles.headerTitle}>{t("Add Product")}</Text>
            ),
            headerTitleAlign: "center",
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
            // headerTitle: searchMode ? "" : "View Vendor",
            // headerTitleAlign: searchMode ? "left" : "center",
          }}
        />
        <Stack.Screen
          name="EditProfilePage"
          component={EditProfileScreen}
          options={{
            headerTitle: () => (
              <Text style={styles.headerTitle}>{t("EditProfilePage")}</Text>
            ),

            headerTitleAlign: "center",

            // headerLeft: () => <CustomBackButton />,
          }}
        />
        <Stack.Screen
          name="InvoiceTransactionScreen"
          component={InvoiceTransactionScreen}
          options={{
            headerTitle: "Transaction Details",
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
        {/* <Stack.Screen
          name="EditCustomer"
          component={EditCustomerScreen}
          options={{
            headerTitle: "Edit People Details",
          }}
        /> */}
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
            // headerTitle: "Add Invoice",
            headerTitle: () => (
              <Text style={styles.headerTitle}>{"Add Invoice"}</Text>
            ),
            headerTitleAlign: "center",
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
       
       
        {/* <Stack.Screen
          name="Invoices"
          component={FilterInvoiceScreen}
          options={
            {
              // headerTitle: ((false)?
              //      (() => ("")):
              //      ("kunal store"))
            }
          }
        /> */}
        <Stack.Screen
          name="ViewInvoices"
          component={ViewInvoiceScreen}
          options={({ route }) => ({
            headerTitle: shopDetails?.shopname,
            headerRight: () => (
              <RotateBtn
                isLandscape={isLandscape}
                setIsLandscape={setIsLandscape}
              />
            ),
            headerTitleAlign: "center",
            // headerLeft: () => (
            //   <CustomBackButton
            //     isLandscape={isLandscape}
            //     setIsLandscape={setIsLandscape}
            //   />
            // ),
          })}
        />
        <Stack.Screen
          name="ViewInvoices1"
          component={ViewInvoiceScreen1}
          options={({ route }) => ({
            headerTitle: "View Invoices",
            headerRight: () => (
              <RotateBtn
                isLandscape={isLandscape}
                setIsLandscape={setIsLandscape}
              />
            ),
            headerTitleAlign: "center",
            // headerLeft: () => (
            //   <CustomBackButton
            //     isLandscape={isLandscape}
            //     setIsLandscape={setIsLandscape}
            //   />
            // ),
          })}
        />
        <Stack.Screen
          name="TransactionScreen"
          component={TransactionScreen}
          options={({ route }) => ({
            headerTitle: "Transactions",
            // headerLeft: () => (
            //   <CustomBackButton
            //     isLandscape={isLandscape}
            //     setIsLandscape={setIsLandscape}
            //   />
            // ),
            headerTitleAlign: "center",
          })}
        />
        <Stack.Screen
          name="TransactionDetailScreen"
          component={TransactionDetailScreen}
          options={({ route }) => ({
            headerTitle: "Transaction Detail",
            // headerLeft: () => (
            //   <CustomBackButton
            //     isLandscape={isLandscape}
            //     setIsLandscape={setIsLandscape}
            //   />
            // ),
            headerTitleAlign: "center",
          })}
        />
        <Stack.Screen
          name="InvoicePreviewScreen"
          component={InvoicePreviewScreen}
          options={({ route }) => ({
            headerTitle: "preview Invoices",
            // headerLeft: () => (
            //   <CustomBackButton
            //     isLandscape={isLandscape}
            //     setIsLandscape={setIsLandscape}
            //   />
            // ),
            headerTitleAlign: "center",
          })}
        />
        <Stack.Screen
          name="ViewShops"
          component={ViewShopsScreen}
          options={{
            headerRight: () => <HomeHeaderRight />,
             headerTitle: "View Shop" ,
            // headerTitleAlign: searchMode ? "left" : "center",
            headerTitleAlign: "center",

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
              // backgroundColor: "transparent",
              // backgroundColor: "#fff"
            },
            headerLeft: () => <CustomBackButton />,
          }}
        />

        <Stack.Screen
          name="AdminSection"
          component={AdminSectionScreen}
          options={{
            // headerShown: false,
            headerTitle: () => (
              <Text style={styles.headerTitle}>{"Admin Section"}</Text>
            ),
            headerTitleAlign: "center",
            // headerTintColor: "#000",
            // headerShadowVisible: false,
            // headerLeft: () => <CustomBackButton />,
          }}
        />

        <Stack.Screen
          name="AllUsers"
          component={AllUsersScreen}
          options={{
            headerTitle: () => (
              <Text style={styles.headerTitle}>{"All Users"}</Text>
            ),

            headerTitleAlign: "center",
            // headerLeft: () => <CustomBackButton />,
          }}
        ></Stack.Screen>

        <Stack.Screen
          name="AllInvoice"
          component={AllInvoiceScreen}
          options={{
            headerTitle: () => (
              <Text style={styles.headerTitle}>{"All Invoice"}</Text>
            ),

            headerTitleAlign: "center",
            // headerLeft: () => <CustomBackButton />,
          }}
        />

        <Stack.Screen
          name="AllVendor"
          component={AllVendorScreen}
          options={{
            headerTitle: () => (
              <Text style={styles.headerTitle}>{"All Vendor"}</Text>
            ),

            headerTitleAlign: "center",
            // headerLeft: () => <CustomBackButton />,
          }}
        />

        <Stack.Screen
          name="AllVendorDataScreen"
          component={AllVendorDataScreen}
          options={{
            headerTitle: () => (
              <Text style={styles.headerTitle}>{"Vendor Data"}</Text>
            ),

            headerTitleAlign: "center",
            // headerLeft: () => <CustomBackButton />,
          }}
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
        <Stack.Screen name="EnterNumberScreen" options={{ headerShown: false }}>
          {(props) => (
            <EnterNumberScreen
              {...props}
              setIsForgetPasswordState={setIsForgetPasswordState}
            />
          )}
        </Stack.Screen>
       

        <Stack.Screen
          name="CustomerDetails"
          component={CustomerDetails}
          options={{
            headerShown: true,
            // // headerTitle: t("Payments"),
            // tabBarIcon: ({ color, size }) => (
            //   <Icon name="people-outline" color={color} size={size} />
            // ),
            headerTitle: () => (
              <Text style={styles.headerTitle}>{"Customer Details"}</Text>
            ),
            headerTitleAlign: "center",
            // headerStyle: {
            //   backgroundColor: "transparent",
            //   // backgroundColor: "#fff"
            // },

            // headerLeft: () => <CustomBackButton />,
          }}
        />

        <Stack.Screen
          name="PDFScreen"
          component={PdfScreen}
          options={{
            headerTitle: () => (
              <Text style={styles.headerTitle}>{"Invoice Preview"}</Text>
            ),
            headerTitleAlign: "center",
            // headerTitle: "Invoice Preview",
          }}
        />

        <Stack.Screen
          name="AddroleScreen"
          component={AddRole}
          options={{
            headerTitle: () => (
              <Text style={styles.headerTitle}>{"Add Role"}</Text>
            ),
            headerTitleAlign: "center",
            // headerTitle: "Add Role",
          }}
        />

        <Stack.Screen
          name="EditRoleScreen"
          component={EditRole}
          options={{
            headerTitle: () => (
              <Text style={styles.headerTitle}>{"Edit Role"}</Text>
            ),
            headerTitleAlign: "center",
            // headerTitle: "Add Role",
          }}
        />

        <Stack.Screen
          name="RoleDetailsScreen"
          component={RoleDetailsScreen}
          options={{
            headerTitle: () => (
              <Text style={styles.headerTitle}>{"User Role Details"}</Text>
            ),
            headerTitleAlign: "center",
            // headerTitle: "Add Role",
          }}
        />

        <Stack.Screen
          name="ViewShopDetailsScreen"
          component={ViewShopDetailsScreen}
          options={{
            headerTitle: () => (
              <Text style={styles.headerTitle}>{"View Shop Details"}</Text>
            ),
            headerTitleAlign: "center",
            // headerTitle: "View Shop Details",
          }}
        />

        <Stack.Screen
          name="ProductScreen"
          component={ProductDetailsScreen}
          options={{
            headerTitle: () => (
              <Text style={styles.headerTitle}>{"View Product Details"}</Text>
            ),
            headerTitleAlign: "center",
            // headerTitle: "View Shop Details",
          }}
        />

        <Stack.Screen
          name="Customer"
          component={CustomerDetail}
          // screenOptions={{ headerShown: false }}
          options={{
            headerTitle: () => (
              <Text style={styles.headerTitle}>{"All Customer"}</Text>
            ),
            headerTitleAlign: "center",
            // headerTitle: "All Customer",
          }}
        />

        <Stack.Screen
          name="Policies"
          component={PoliciesDetailsScreen}
          options={{
            headerShown: false,
            headerTintColor: "#000",
            headerShadowVisible: false,
            // headerLeft: () => <CustomBackButton />,
          }}
        />
        <Stack.Screen
          name="AllQuerysAndSupport"
          component={AllQueryAndSupport}
          options={{
            headerTitle: "View Shop Details",
          }}
        />
      </Stack.Navigator>
      <CheckInternet />
    </>
  );
}
const styles = StyleSheet.create({
  headerTitle: {
    fontFamily: "Poppins-Regular",
    fontSize: fontSize.headingSmall,
    fontWeight: "bold",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
