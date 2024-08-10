// ItemList.js
import React, { useState, useCallback } from "react";
import { View, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from "react-native";
import { Avatar, Menu, Text } from "react-native-paper";
import { Feather } from "@expo/vector-icons";

export default function ItemList({
  data,
  titleKey,
  subtitleKey,
  onDelete,
  onEdit,
  onView,
  expandedItems,
  menuItems,
}) {
  const [visible, setVisible] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };
  const showMenu = (item) => {
    setCurrentItem(item);
    setVisible(true);
  };

  const hideMenu = () => {
    setVisible(false);
    setCurrentItem(null);
  };

  const renderInternalItem = ({ item }) => {
    const isExpanded = item._id === expandedId;
    return (
    <>
    <TouchableOpacity
     onPress={() => toggleExpand(item._id)}
    //  onPress={() => onView(item._id)}
    style={{
      // backgroundColor:"orange", 
      // marginHorizontal:10, 
      // marginVertical:10,
    }}
     >
      <View style={[
        styles.itemContainer,
        {borderBottomWidth: (isExpanded)? 0 : 1 }
        ]}>
        <View style={styles.underItemContainer}>
          <Avatar.Text label={item[titleKey]?.charAt(0)} size={40} />
          <View style={styles.itemContent}>
            <Text style={styles.title}>{item[titleKey].toUpperCase()}</Text>
            <Text style={styles.subtitle}>{item[subtitleKey]}</Text>
          </View>
         
          <Menu
            visible={visible && currentItem?._id === item._id}
            onDismiss={hideMenu}
            anchor={
              <TouchableOpacity onPress={() => showMenu(item)} style={styles.menuButton}>
                <Feather name="more-vertical" size={24} color="black" />
              </TouchableOpacity>
            }
          >
            {menuItems.map((menuItem, index) => (
                  <Menu.Item
                    key={index}
                    onPress={() => {
                      hideMenu();
                      menuItem.onPress(item);
                    }}
                    title={menuItem.title}
                  />
                ))}
            {/* <Menu.Item 
            onPress={() => {
                hideMenu()
                onView(item._id)
            }} 
            title="View" />

            <Menu.Item onPress={() => {
                hideMenu()
                onEdit(item._id)
            }} 
            title="Edit" />

            <Menu.Item onPress={() => {
                hideMenu()
                onDelete(item._id)
                
            }} 
            title="Delete" /> */}
          </Menu> 
        </View>
        {isExpanded && (
            // <View>
            //     <Text>More items</Text>
            // </View>
            expandedItems(item)
        )}
      </View>
    </TouchableOpacity>
    {isExpanded && (
      <TouchableOpacity 
      style={{
       borderBottomWidth:1,
       borderBottomColor: "#ccc",
       paddingLeft:"17%",
       paddingBottom:5
       }} 
       onPress={() => onView(item._id)

       }>
        <Text style={{color:"blue"}}>more</Text>
      </TouchableOpacity>
    )}
    </>
  );

}
  return (
    <FlatList
      data={data}
      renderItem={renderInternalItem}
      keyExtractor={(item,index) => index}
    />
  );
}

const styles = StyleSheet.create({
  itemContainer: {
   paddingVertical:15,
  //  paddingHorizontal:4,
   marginVertical:6,
  //  elevation:2,

    // borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemContent: {
    flex: 1,
    marginLeft: 10,
  },
  menuButton: {
    padding: 10,
  },
  underItemContainer: {
    flexDirection: "row",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#555",
  },
});
