// import { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   useWindowDimensions,
//   Modal,
// } from "react-native";
// import NetInfo from "@react-native-community/netinfo";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import { useNavigation } from "@react-navigation/native";

// const InternetConnection = ({ visible, onClose }) => {
//   const { width, height } = useWindowDimensions();
//   const [isConnected, setIsConnected] = useState(true);
//   const navigation = useNavigation();

//   useEffect(() => {
//     const unsubscribe = NetInfo.addEventListener((state) => {
//       setIsConnected(state.isConnected);
//     });

//     return () => {
//       unsubscribe();
//     };
//   }, []);

//   const handleRetry = async () => {
//     const state = await NetInfo.fetch();
//     setIsConnected(state.isConnected);
//   };

//   useEffect(() => {
//     if (isConnected) {
//       onClose();
//     }
//   }, [isConnected, onClose]);

//   return (
//     <Modal
//       visible={visible}
//       transparent={true}
//       animationType="slide"
//       onRequestClose={onClose}
//       style={{ flex: 1,justifyContent:"center" }}
//     >
//       <View style={styles.modalOverlay}>
//         <View style={[styles.container, { paddingVertical: height * 0.01 }]}>
//           <View style={{ flexDirection: "row" }}>
//             <View style={styles.headerLeftContainer}>
//               <MaterialIcons name="wifi-off" size={30} color="gray" />
//             </View>

//             <View style={styles.headerContainer}>
//               <Text style={styles.headerText}>No Internet</Text>
//             </View>
//           </View>

//           <View style={[styles.InnerContainer, { paddingVertical: height * 0.03 }]}>
//             <Image
//               source={require("../../../assets/NoInternet.png")}
//               style={{ width: width * 0.8, height: width * 0.8 }}
//               resizeMode="contain"
//             />
//           </View>

//           <View style={styles.connectionView}>
//             <Text style={[styles.connectionText, { fontSize: width * 0.06 }]}>
//               No Internet Connection
//             </Text>
//           </View>

//           <View style={styles.DetailsView}>
//             <Text
//               style={[
//                 styles.DetailsText,
//                 { fontSize: width * 0.04, paddingVertical: height * 0.02 },
//               ]}
//             >
//               It appears you are not connected to the internet. Please check your
//               connection and try again....
//             </Text>
//           </View>

//           <View style={[styles.ButtonView, { marginTop: height * 0.04 }]}>
//             <TouchableOpacity
//               onPress={handleRetry}
//               style={styles.buttonPressable}
//             >
//               <Text style={styles.ButtonText}>Retry</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.5)", // dark transparent overlay
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   container: {
//     backgroundColor: "white",
//     borderRadius: 10,
//     padding: 20,
//     width: "90%",
//     alignItems: "center",
//   },
//   headerContainer: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   headerText: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   headerLeftContainer: {
//     paddingRight: 10,
//   },
//   InnerContainer: {
//     alignItems: "center",
//   },
//   connectionView: {
//     alignItems: "center",
//   },
//   connectionText: {
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   DetailsView: {
//     alignItems: "center",
//   },
//   DetailsText: {
//     textAlign: "center",
//     width: "90%",
//     marginVertical: 10,
//     color: "rgba(0,0,0,0.7)",
//   },
//   ButtonView: {
//     width: "100%",
//     borderRadius: 10,
//     backgroundColor: "#0a6846",
//   },
//   buttonPressable: {
//     minHeight: 47,
//     justifyContent: "center",
//     alignItems: "center",
//     width: "100%",
//   },
//   ButtonText: {
//     fontSize: 15,
//     fontWeight: "bold",
//     color: "#fff",
//     textAlign: "center",
//   },
// });

// export default InternetConnection;
