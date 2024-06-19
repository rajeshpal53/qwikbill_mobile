
 import 'react-native-gesture-handler';
import  React from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Invoice from "./Screen/Invoice";
import Products from "./Screen/Products";
import Customer from "./Screen/Customer";
import LoginScreen from './Screen/LoginScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-native-paper';
import AddProduct from './Screen/AddProduct';
import { DefaultTheme } from 'react-native-paper';
import AddInvoiceScreen from './Screen/AddInvoiceScreen';
import AddCustomerScreen from './Screen/AddCustomerScreen';
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
       
        <Drawer.Navigator >
        <Drawer.Screen name="Invoice" component={Invoice} />
        <Drawer.Screen name="Products" component={Products} />
        <Drawer.Screen name="Customer" component={Customer} />
        </Drawer.Navigator>
 
    )
}
export default function App() {
  return (
    <Provider theme={customTheme}> 
    <NavigationContainer>     
        <Stack.Navigator initialRouteName="login">
          <Stack.Screen name='wertone' component={DrawerNavigator} options={{headerShown:false}} />
        <Stack.Screen name='login' component={LoginScreen}  screenOptions={{headerShown: false}}/> 
        <Stack.Screen name='AddInvoice' component={AddInvoiceScreen}  screenOptions={{}}/>
        <Stack.Screen name='AddProduct' component={AddProduct}  screenOptions={{}}/>
        <Stack.Screen name='AddCustomer' component={AddCustomerScreen}  screenOptions={{}}/>
      </Stack.Navigator>    
    </NavigationContainer>
    </Provider>
  );
}