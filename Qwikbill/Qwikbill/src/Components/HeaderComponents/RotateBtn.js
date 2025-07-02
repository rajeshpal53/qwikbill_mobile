
import { View } from "react-native";
import { useEffect, useState } from "react";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from '@expo/vector-icons';
//import {Orientation} from 'react-native-orientation-locker';
//import { useOrientationChange } from "react-native-orientation-locker";
//import { useDeviceOrientationChange } from "react-native-orientation-locker";
//import { useLockListener } from "react-native-orientation-locker";

//import * as ScreenOrientation from "expo-screen-orientation"
export default function RotateBtn({isLandscape, setIsLandscape}){

    // const [isLandscape, setIsLandscape] = useState(false);

      const handleRotate = async () => {
        if (isLandscape) {
         // await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT); // Lock to portrait
        } else {
          //await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE); // Lock to landscape
        }
        setIsLandscape(!isLandscape); // Toggle the state
      };


    return (
        <View style={{marginRight:20}}>
            <MaterialCommunityIcons
            name="phone-rotate-landscape"
            size={24}
            color="black"
            onPress={() => handleRotate()}
            />
        </View>
    );
};