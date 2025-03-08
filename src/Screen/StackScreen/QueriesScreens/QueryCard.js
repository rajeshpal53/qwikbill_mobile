// import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
// import React, { useState } from 'react'
// import { Button, Card, Menu } from 'react-native-paper'
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import { fontSize } from '../../../Util/UtilApi';
// import { fonts } from '@rneui/base';
// const QueryCard = ({
//     item,
//     setQueryToAct,
//     setConfirmModalVisible,
//     setItem,
//     toggleModal,
// }) => {

//     const [menuVisible, setMenuVisible] = useState(false);
//   return (
//     <Card>
//       <View style={{paddingVertical:10}}>
//         <View style={{
//             position: "absolute",
//             right: 10,
//             top: 8,
//             zIndex:1
//         }}>
//             <Menu
//              visible={menuVisible}
//              onDismiss={() => setMenuVisible(false)}
//              anchor={
//                 <TouchableOpacity onPress={() =>{
//                     console.log("menu pressed")
//                     setMenuVisible(true);

//                 } }
//                 >
//                 <MaterialCommunityIcons 
//                 name="dots-vertical"
//                 size={20}
//                 color="rgba(0, 0, 0, 0.4)"
//                 />
//                 </TouchableOpacity>
//              }
//              contentStyle={{
//                 marginRight:5,
//                 marginTop:35,
//                 backgroundColor:"#e3e1e1",
//              }}
//              >
//                 <Menu.Item 
//                 onPress={() => {
//                     setItem(item);
//                     setMenuVisible(false);
//                     toggleModal();
//                 }}
//                 title = "View"
//                 />
//                 {item?.isResolved && <Menu.Item 
//                 onPress={() => {
//                    setQueryToAct(item);
//                    setConfirmModalVisible(true);
//                     setMenuVisible(false);
//                 }}
//                 title = "Delete"
//                 />}
//                 {!item?.isResolved && <Menu.Item 
//                 onPress={() => {
//                     setQueryToAct(item);
//                     setConfirmModalVisible(true);
//                     setMenuVisible(false);
//                 }}
//                 title = "Query Resolved"
//                 />}
                
//              </Menu>
//         </View>
//         {/* <View>
//             <Text style={{fontFamily:"Poppins-Medium"}}>{item?.name}</Text>
//             <Text style={{fontFamily:"Poppins-Regular"}}>{item?.mobile}</Text>
//             <Text style={{fontFamily:"Poppins-Regular"}}>{item?.email}</Text>
//             <Text style={{fontFamily:"Poppins-Regular"}}>{item?.description}</Text>
//         </View> */}
//         {/* Contact Details */}
//         <View style={styles.details}>
//           <Text style={styles.feedbackType}>{item?.feedbackType}</Text>
//           <Text style={styles.name}>{item?.name}</Text>

//           <View style={styles.infoRow}>
//             <MaterialCommunityIcons name="phone" size={18} color="#555" />
//             <Text style={styles.infoText}>{item?.mobile}</Text>
//           </View>

//           <View style={styles.infoRow}>
//             <MaterialCommunityIcons name="email" size={18} color="#555" />
//             <Text style={styles.infoText}>{item?.email}</Text>
//           </View>

//           <View style={styles.infoRow}>
//             <MaterialCommunityIcons name="information" size={18} color="#555" />
//             <Text numberOfLines={1} style={[styles.infoText, {width:"80%"}]}>{item?.description}</Text>
//           </View>
//         </View>
//       </View>
//     </Card>
//   )
// }

// export default QueryCard

// const styles = StyleSheet.create({
//     card: {
//         margin: 10,
//         borderRadius: 10,
//         backgroundColor: "#fff",
//         elevation: 3, // Shadow effect
//       },
//       content: {
//         flexDirection: "row",
//         alignItems: "center",
//       },
//       avatar: {
//         backgroundColor: "#4CAF50", // Green color for avatar
//       },
//       details: {
//         marginLeft: 10,
//         flex: 1,
//       },
//       name: {
//         fontSize: fontSize.labelMedium,
//         fontFamily:"Poppins-Medium",
//         color: "#333",
//       },
//       infoRow: {
//         flexDirection: "row",
//         alignItems: "center",
//         marginTop: 4,
//       },
//       infoText: {
//         marginLeft: 6,
//         fontSize: fontSize.label,
//         fontFamily:"Poppins-Regular",
//         color: "#555",
//       },
//       feedbackType:{
//         fontFamily:"Poppins-Medium",
//         fontSize:fontSize.label,
//         color: "rgba(255, 0, 0, 0.7)",
//       },
// })







import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { Card, Menu } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { fontFamily, fontSize } from '../../../Util/UtilApi';

const QueryCard = ({ item, setQueryToAct, setConfirmModalVisible, setItem, toggleModal }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <Card style={styles.card}>
      <View style={styles.cardContent}>
        {/* Menu Icon */}
        <View style={styles.menuContainer}>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <TouchableOpacity onPress={() => setMenuVisible(true)}>
                <MaterialCommunityIcons name="dots-vertical" size={24} color="#555" />
              </TouchableOpacity>
            }
            contentStyle={styles.menuContent}
          >
            <Menu.Item
              onPress={() => {
                setItem(item);
                setMenuVisible(false);
                toggleModal();
              }}
              title="View"
            />
            {item?.isResolved ? (
              <Menu.Item
                onPress={() => {
                  setQueryToAct(item);
                  setConfirmModalVisible(true);
                  setMenuVisible(false);
                }}
                title="Delete"
              />
            ) : (
              <Menu.Item
                onPress={() => {
                  setQueryToAct(item);
                  setConfirmModalVisible(true);
                  setMenuVisible(false);
                }}
                title="Mark as Resolved"
              />
            )}
          </Menu>
        </View>

        {/* Contact Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.feedbackType}>{item?.feedbackType}</Text>
          <Text style={styles.name}>{item?.name}</Text>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="phone" size={18} color="#555" />
            <Text style={styles.infoText}>{item?.mobile}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="email" size={18} color="#555" />
            <Text style={styles.infoText}>{item?.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="information" size={18} color="#555" />
            <Text numberOfLines={2} style={styles.description}>{item?.description}</Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

export default QueryCard;

const styles = StyleSheet.create({
  card: {
    margin: 4,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 4,
    padding: 10,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
   // backgroundColor:
  },
  menuContainer: {
    position: 'absolute',
    right: 6,
    top: 10,
    zIndex: 1,
  },
  menuContent: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  detailsContainer: {
    flex: 1,
    paddingLeft: 8,
  },
  name: {
    fontSize: fontSize.labelLarge,
    fontFamily:fontFamily.medium,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  infoText: {
    marginLeft: 8,
    fontSize: fontSize.label,
    fontFamily:fontFamily.medium,
    color: '#555',
  },
  feedbackType: {
    fontSize: fontSize.label,
    fontFamily:fontFamily.medium,
    color: '#d9534f',
    marginBottom: 4,
  },
  description: {
    marginLeft: 8,
    fontSize: fontSize.label,
    fontFamily:fontFamily.medium,
    color: '#555',
    width: '80%',
  },
});
