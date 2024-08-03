// ItemList.js
import React, { useState } from "react";
import { View, FlatList, TouchableOpacity, StyleSheet } from "react-native";
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
  menuItems
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
     >
      <View style={[
        styles.itemContainer,
        {borderBottomWidth: (isExpanded)? 0 : 1 }
        ]}>
        <View style={styles.underItemContainer}>
          <Avatar.Text label={item[titleKey].charAt(0)} size={40} />
          <View style={styles.itemContent}>
            <Text style={styles.title}>{item[titleKey]}</Text>
            <Text style={styles.subtitle}>₹{item[subtitleKey]}</Text>
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
                      menuItem.onPress(item._id);
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
      keyExtractor={(item) => item._id}
    />
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    padding: 10,
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
