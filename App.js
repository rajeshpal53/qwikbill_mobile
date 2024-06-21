
 import 'react-native-gesture-handler';
import  React, { useEffect } from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Invoice from "./Screen/Invoice";
import Products from "./Screen/Products";
import Customer from "./Screen/Customer";
import LoginScreen from './Screen/LoginScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-native-paper';
import { DefaultTheme,ActivityIndicator} from 'react-native-paper';
import AddInvoiceScreen from './Screen/AddInvoiceScreen';
import AddCustomerScreen from './Screen/AddCustomerScreen';
import { AuthProvider,AuthContext } from './Store/AuthContext';
import { useContext } from 'react';
import { CustomDrawerContent } from './Components/CustomDrawerContent';
import AddProductScreen from './Screen/AddProductScreen';
import InvoiceDetailScreen from './Screen/InvoiceDetailScreen';
import CustomerDetailScreen from './Screen/CustomerDetailScreen';
import ProductDetailScreen from './Screen/ProductDetailScreen';
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1976d2', // Set your custom primary color here
  },
};
function DrawerNavigator(){
    return(
       
      <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />} initialRouteName='Invoice'> 
        <Drawer.Screen name="Invoice" component={Invoice} />
        <Drawer.Screen name="Products" component={Products} />
        <Drawer.Screen name="Customer" component={Customer} /> 
        </Drawer.Navigator>
 
    )
}
function StackNavigator(){
    const {isAuthenticated,isLoading}=useContext(AuthContext)
    useEffect(()=>{
        isAuthenticated
       

    },[isAuthenticated])
  console.log(isAuthenticated)
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  
  return (
    <Stack.Navigator initialRouteName={isAuthenticated?'wertone':'login'}>
      <Stack.Screen name='wertone' component={DrawerNavigator} options={{headerShown:false}} />
        <Stack.Screen name='login' component={LoginScreen}  screenOptions={{headerShown: false}}/> 
        <Stack.Screen name='AddInvoice' component={AddInvoiceScreen}  screenOptions={{}}/>
        <Stack.Screen name='AddProduct' component={AddProductScreen}  screenOptions={{}}/>
        <Stack.Screen name='AddCustomer' component={AddCustomerScreen}  screenOptions={{}}/>
        <Stack.Screen name='InvoiceDetail' component={InvoiceDetailScreen}  screenOptions={{}}/>
        <Stack.Screen name='CustomerDetail' component={CustomerDetailScreen}  screenOptions={{}}/>
        <Stack.Screen name='ProductDetail' component={ProductDetailScreen}  screenOptions={{}}/>
    </Stack.Navigator>
  )

}
export default function App() {

  return (
    <AuthProvider>
    <Provider theme={customTheme}> 
    <NavigationContainer>     
        <Stack.Navigator initialRouteName='StackNavigator'>
          <Stack.Screen name='StackNavigator' component={StackNavigator} options={{headerShown:false}} />
      </Stack.Navigator>    
    </NavigationContainer>
    </Provider>
    </AuthProvider>
  );
}