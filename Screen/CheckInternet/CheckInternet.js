import {View, Text, StyleSheet, Image, Modal} from "react-native"
import React, { useEffect } from "react"
import NetInfo from "@react-native-community/netinfo"


const CheckInternet = ({isConnected, setIsConnected}) => {

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log("Connection type", state.type);
            console.log("Is connected?", state.isConnected);
            setIsConnected(state.isConnected);
          });

          // Unsubscribe
          return () => {
            unsubscribe();
          };
    }, [])
    return (
      <Modal
        visible={!isConnected}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.container}>
             <Image
                source={require('../../assets/noInternet.png')}
                style={styles.image}
           />
        </View>
      </Modal>
    );
};

export default CheckInternet;

const styles = StyleSheet.create({
    container:{
      flex:1,
      backgroundColor:"#fff",
      justifyContent:"center",
    },
    image:{
        width:200,
        height:200,
        alignSelf:"center"
    }
})

// NoInternetScreen.js
// import React from "react";
// import { View, Text, StyleSheet, Button } from "react-native";
// import { Image } from "react-native";

// const CheckInternet = ({ onRetry }) => {
//   return (
//     <View style={styles.container}>
//         <Image
//           source={require("../../assets/noInternet.png")}
//           style={styles.image}
//         />
//         <Button title="Retry" onPress={onRetry} />
//     </View>
//   );
// };


// export default CheckInternet;

// const styles = StyleSheet.create({
//     container:{
//         backgroundColor:"#fff",
//         justifyContent:"center",
//     },
//     image:{
//         width:200,
//         height:200,
//         alignSelf:"center"
//     }
// })