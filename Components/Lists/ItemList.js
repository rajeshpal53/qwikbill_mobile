// ItemList.js
import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { Avatar, Button, Card, Menu, Text } from "react-native-paper";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

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
      <View
        style={{
          elevation: 2,
          // marginTop: 10,
          borderRadius: 10,
          marginBottom:10,
          marginHorizontal: 10,
          backgroundColor: "#fff",
          // backgroundColor:"pink",
          // paddingLeft:5
        }}
      >
        <TouchableOpacity
          onPress={() => toggleExpand(item._id)}
          //  onPress={() => onView(item._id)}
          style={
            {
              // backgroundColor:"lightblue",
              // marginBottom:5,
              // marginHorizontal:5,
              // marginHorizontal:10,
              // marginVertical:20,
            }
          }
        >
          <View
            style={[
              styles.itemContainer,
              // {borderBottomWidth: (isExpanded)? 0 : 1 }
            ]}
          >
            <View style={styles.underItemContainer}>
              <Avatar.Text
                color="#fff"
                style={{
                  backgroundColor: "#355a74",
                  marginHorizontal: 8,
                }}
                label={item[titleKey]?.charAt(0)}
                size={38}
              />

              <View style={styles.itemContent}>
                <Text style={styles.title}>{item[titleKey].toUpperCase()}</Text>
                <Text style={styles.subtitle}>{item[subtitleKey]}</Text>

                {isExpanded && expandedItems(item)}
              </View>

              {!isExpanded ? (
                <Menu
                  visible={visible && currentItem?._id === item._id}
                  onDismiss={hideMenu}
                  anchor={
                    <TouchableOpacity
                      onPress={() => showMenu(item)}
                      style={styles.menuButton}
                    >
                      <Feather name="more-vertical" size={24} color="#777777" />
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
              ) : (
                <Button
                  textColor="#26a0df"
                  icon={()=> <MaterialCommunityIcons style={{}} name="greater-than" size={18} color="#26a0df"/> }
                  onPress={() => {
                    onView(item._id);
                  }}
                  contentStyle={{
                    flexDirection:"row-reverse",
                    }}
                    labelStyle={{
                      marginRight: 10, // Ensure no extra margin between the text and the icon
                    }}
                >View</Button>
              )}
            </View>
          </View>
        </TouchableOpacity>
        {/* {isExpanded && (
      <TouchableOpacity 
      style={{
       borderBottomWidth:1,
       borderBottomColor: "#ccc",
       paddingLeft:"17%",
       paddingBottom:5
       }} 
       onPress={() => onView(item._id)

       }>
        <Text>more</Text>
      </TouchableOpacity>
    )} */}
      </View>
    );
  };
  return (
    <FlatList
      data={data}
      style={{ backgroundColor: "#fff", marginTop:10 }}
      renderItem={renderInternalItem}
      keyExtractor={(item, index) => index}
    />
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    paddingVertical: 4,
    //  backgroundColor:"lightblue",
    //  paddingHorizontal:4,
    //  marginVertical:6,
    //  elevation:2,

    // backgroundColor:"orange",
    // borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemContent: {
    flex: 1,
    // marginLeft: 20,
    // backgroundColor:"lightblue"
  },
  menuButton: {
    padding: 10,
  },
  underItemContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 14,
    // fontWeight: "bold",
    
    color: "#555555",
  },
  subtitle: {
    color: "#777",
    fontSize: 12,
  },
});
