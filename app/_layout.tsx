import 'react-native-gesture-handler';
import {Drawer} from "expo-router/drawer"
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomDrawerContent from '@/components/CustomDrawerContent';

const DrawerLayout =()=>{
  return(
    <GestureHandlerRootView>
      <Drawer drawerContent={CustomDrawerContent}>
        <Drawer.Screen
          name='index'
          options={{
            drawerLabel:'Invoice',
            headerTitle:'Invoice',
          }}
        />
         <Drawer.Screen
          name='customer'
          options={{
            drawerLabel:'Customer',
            headerTitle:'Customer',
          }}
        />
         <Drawer.Screen
          name='products'
          options={{
            drawerLabel:'Products',
            headerTitle:'Products',
          }}
        />
       
      </Drawer>
    </GestureHandlerRootView>
  )
}
export default DrawerLayout;