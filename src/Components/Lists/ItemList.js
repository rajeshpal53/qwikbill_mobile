import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Avatar, Card, Text } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { fontSize } from "../../Util/UtilApi";

export default function ItemList({ item,onEdit,onDelete }) {
  const [visible, setVisible] = useState(false);

  console.log(item, "Value of data123"); // This will log the individual item

  return (
    <ScrollView>
      <Card style={styles.card}>
        <View style={styles.container}>
          <View style={styles.ImageView}>
            <Avatar.Text
              size={55}
              label={item?.productname?.charAt(0) || "P"}
              style={styles.avatarPlaceholder}
            />
          </View>
          <View style={styles.TextView}>
            <Text style={styles.itemname}>{item?.productname}</Text>
            <Text style={styles.priceText}>Code: {item?.code}</Text>
            <Text style={styles.sellPrice}>Tax Rate: {item?.taxrate}</Text>
          </View>

          <View style={styles.ButtonTextView}>
            <View style={styles.ButtonView}>
              <TouchableOpacity
                onPress={() => onEdit(item?.id)}
                style={styles.iconButton}
              >
                <MaterialIcons name="edit" size={24} color="#1E88E5" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onDelete(item?.id)}
                style={styles.iconButton}
              >
                <MaterialIcons name="delete" size={24} color="#E53935" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 8,
    elevation: 3,
    backgroundColor: "#fff",
  },
  container: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  ImageView: {
    paddingHorizontal: 7,
    marginLeft: 5,
  },
  TextView: {
    flex: 2,
  },
  ButtonTextView: {
    justifyContent: "space-between",
    flex: 1,
    marginRight: 5,
  },
  ButtonView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  itemname: {
    fontWeight: "bold",
    marginVertical: 2,
    fontSize: fontSize.labelLarge,
    paddingVertical: 2,
  },
  priceText: {
    color: "#555",
    fontSize: fontSize.label,
  },
  sellPrice: {
    color: "#555",
    fontSize: fontSize.label,
  },
  iconButton: {
    marginRight: 10,
  },
});

// console.log("data is , ", typeof data);
//   const toggleExpand = (id) => {
//     setExpandedId(expandedId === id ? null : id);
//   };
//   const showMenu = (item) => {
//     setCurrentItem(item);
//     setVisible(true);
//   };

//   const hideMenu = () => {
//     setVisible(false);
//     setCurrentItem(null);
//   };

//   const renderInternalItem = ({ item, index }) => {
//     console.log("ITem ------------",item)
//     const isExpanded = item._id === expandedId;
//     return (
//       <View
//         style={{
//           elevation: 2,
//           // marginTop: 10,
//           borderRadius: 10,
//           marginBottom: 10,
//           marginHorizontal: 10,
//           backgroundColor: "#fff",
//           // backgroundColor:"pink",
//           // paddingLeft:5
//         }}
//       >
//         <TouchableOpacity
//           onPress={() => toggleExpand(item._id)}
//           //  onPress={() => onView(item._id)}
//           style={
//             {
//               // backgroundColor:"lightblue",
//               // marginBottom:5,
//               // marginHorizontal:5,
//               // marginHorizontal:10,
//               // marginVertical:20,
//             }
//           }
//         >
//           <View
//             style={[
//               styles.itemContainer,
//               // {borderBottomWidth: (isExpanded)? 0 : 1 }
//             ]}
//           >
//             <View style={styles.underItemContainer}>
//               <Avatar.Text
//                 color="#fff"
//                 style={{
//                   backgroundColor: "#355a74",
//                   marginHorizontal: 8,
//                 }}
//                 label={item[titleKey]?.charAt(0)}
//                 size={38}
//               />

//               <View style={styles.itemContent}>
//                 <Text style={styles.title}>
//                   {item[titleKey]?.toUpperCase()}
//                 </Text>
//                 <Text style={styles.subtitle}>{item[subtitleKey]}</Text>
//                 {console.log("item --- , ", item[subtitleKey])}
//                 {isExpanded && expandedItems(item)}
//               </View>

//               {!isExpanded ? (
//                 <Menu
//                   visible={visible && currentItem?._id === item._id}
//                   onDismiss={hideMenu}
//                   anchor={
//                     <TouchableOpacity
//                       onPress={() => showMenu(item)}
//                       style={styles.menuButton}
//                     >
//                       <Feather name="more-vertical" size={24} color="#777777" />
//                     </TouchableOpacity>
//                   }
//                 >
//                   {menuItems.map((menuItem, index) => (
//                     <Menu.Item
//                       key={index}
//                       onPress={() => {
//                         hideMenu();
//                         menuItem.onPress(item);
//                       }}
//                       title={menuItem.title}
//                     />
//                   ))}
//                   {/* <Menu.Item
//             onPress={() => {
//                 hideMenu()
//                 onView(item._id)
//             }}
//             title="View" />

//             <Menu.Item onPress={() => {
//                 hideMenu()
//                 onEdit(item._id)
//             }}
//             title="Edit" />

//             <Menu.Item onPress={() => {
//                 hideMenu()
//                 onDelete(item._id)

//             }}
//             title="Delete" /> */}
//                 </Menu>
//               ) : (
//                 <Button
//                   textColor="#26a0df"
//                   icon={() => (
//                     <MaterialCommunityIcons
//                       style={{}}
//                       name="greater-than"
//                       size={18}
//                       color="#26a0df"
//                     />
//                   )}
//                   onPress={() => {
//                     onView(item._id);
//                   }}
//                   contentStyle={{
//                     flexDirection: "row-reverse",
//                   }}
//                   labelStyle={{
//                     marginRight: 10, // Ensure no extra margin between the text and the icon
//                   }}
//                 >
//                   View
//                 </Button>
//               )}
//             </View>
//           </View>
//         </TouchableOpacity>
//         {/* {isExpanded && (
//       <TouchableOpacity
//       style={{
//        borderBottomWidth:1,
//        borderBottomColor: "#ccc",
//        paddingLeft:"17%",
//        paddingBottom:5
//        }}
//        onPress={() => onView(item._id)

//        }>
//         <Text>more</Text>
//       </TouchableOpacity>
//     )} */}
//       </View>
//     );
//   };
//   return (
//     <FlatList
//       data={data}
//       renderItem={({ item, index }) => renderInternalItem({ item, index })}
//       keyExtractor={(item) => item.id.toString()}
//       contentContainerStyle={styles.flatListContainer}
//       ListEmptyComponent={() => (
//         <View style={{ alignItems: "center", backgroundColor: "white" }}>
//           <Image
//             source={require("../../../assets/noDataFoundImage2.jpg")}
//             style={{ width: 300, height: 300 }}
//           ></Image>
//           <Text variant="titleLarge" style={{ color: "#555" }}>
//             No data found
//           </Text>
//         </View>
//       )}
//     />
//   );

//   //   <FlatList
//   //     data={data}
//   //     style={{ backgroundColor: "#fff", marginTop: 10 }}
//   //     renderItem={renderInternalItem}
//   //     keyExtractor={(item, index) => index}
//   //   />
//   // ) : (
//   //   <View style={{ alignItems: "center", backgroundColor: "white" }}>
//   //     <Image
//   //       source={require("../../../assets/noDataFoundImage2.jpg")}
//   //       style={{ width: 300, height: 300 }}
//   //     ></Image>
//   //     <Text variant="titleLarge" style={{ color: "#555" }}>
//   //       No data found
//   //     </Text>
//   //   </View>
//   // );
// }

// const styles = StyleSheet.create({
//   itemContainer: {
//     paddingVertical: 4,
//     //  backgroundColor:"lightblue",
//     //  paddingHorizontal:4,
//     //  marginVertical:6,
//     //  elevation:2,

//     // backgroundColor:"orange",
//     // borderBottomWidth: 1,
//     borderBottomColor: "#ccc",
//   },
//   itemContent: {
//     flex: 1,
//     backgroundColor: "white",
//     // marginLeft: 20,
//     // backgroundColor:"lightblue"
//   },
//   menuButton: {
//     padding: 10,
//   },
//   underItemContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   title: {
//     fontSize: 14,
//     // fontWeight: "bold",

//     color: "#555555",
//   },
//   subtitle: {
//     color: "#777",
//     fontSize: 12,
//   },
