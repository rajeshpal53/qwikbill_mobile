
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
import AddInvoice from './Components/AddInvoice';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
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
    <NavigationContainer>     
        <Stack.Navigator initialRouteName="login">
          <Stack.Screen name='wertone' component={DrawerNavigator} options={{headerShown:false}} />
        <Stack.Screen name='login' component={LoginScreen}  screenOptions={{headerShown: false}}/> 
        <Stack.Screen name='addInvoice' component={AddInvoice}  screenOptions={{}}/>
      </Stack.Navigator>    
    </NavigationContainer>
  );
}