import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { debounce } from "lodash";
// import { API_BASE_URL, fontSize } from "../Util/UtilApi";
import { API_BASE_URL, fontSize, NORM_URL } from "../../Util/UtilApi";
import { Avatar, Card, Divider } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { MaterialIcons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;


const UserCard = ({ item, index, handleEditProfile, HandleDeleteUser }) => {

  const [profileUrl, setProfileUrl] = useState("");
  const [fallbackText, setFallbackText] = useState("E");


  console.log("jayesh selected user data is ", item)
  // const handleDelete = (item) => {
  //   console.log("Button pressed");
  //   setShopDeleteId(item?.id);
  //   // setSelectedModal(null);
  // };


  // useEffect(() => {
  //   const setUrl = () => {
  //     if (item?.profilePicurl) {
  //       const tempUrl = `${NORM_URL}/${item?.profilePicurl}`;
  //       updateImageUrl(tempUrl);
  //     } else {
  //       const singleLetterText = getFallbackText();
  //       setFallbackText(singleLetterText);
  //     }
  //   };

  //   setUrl();
  // }, []);

  // const updateImageUrl = debounce((profilePicurl) => {
  //   setProfileUrl(`${profilePicurl}?${new Date().getTime()}`);
  // }, 100); // Adjust the delay as needed (e.g., 100ms)

  // const getFallbackText = () => {
  //   let singleLetterText;
  //   if (item?.name) {
  //     singleLetterText = item?.name.charAt(0).toUpperCase();
  //   }

  //   return singleLetterText;
  // };



  return (
    <Card
      style={{
        flex: 1,
        backgroundColor: "rgb(250, 250, 255)",
        marginHorizontal: "2%",
        marginBottom: 20,
      }}
      onPress={() => handleEditProfile(item, index)}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderRadius: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 10,
          }}
        >

          <TouchableOpacity
            style={{ position: "absolute", right: 0, zIndex: 1 }}
            onPress={() => {
              console.log("item select for delete is ", item.id);
              HandleDeleteUser(item)
            }}
          >
            <MaterialIcons name="delete" size={20} color="#1E88E5" />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ position: "absolute", right: 32, zIndex: 1 }}
            onPress={() => {
              console.log("Editing User:", item); // Log the user data before opening modal
              // handleEditUser(item);
              handleEditProfile(item, index)
            }}
          >
            <MaterialIcons name="edit" size={20} color="#1E88E5" />
          </TouchableOpacity>


          <View>
            {/* {profileUrl && profileUrl !== "" ? (
              <Avatar.Image
                size={60}
                // source={require("../../../assets/Mens-haircut.png")}
                source={{
                  uri: profileUrl || `${API_BASE_URL}/assets/mobile/male.png`,
                }}
              />
            ) : (
              <>
                <Avatar.Text size={60} label={fallbackText || "E"} />
              </>
            )} */}
            <Avatar.Text
              size={60}
              label={item?.name ? item.name.charAt(0) : "E"}
              style={styles.avatarPlaceholder}
            />
          </View>

          <View
            style={{
              flex: 1,
            }}
          >
            <View>
              <Text
                style={{
                  color: "rgba(0, 0, 0, 0.7)",
                  fontFamily: "Poppins-SemiBold",
                  marginRight: 22,
                  fontSize: fontSize.labelMedium,
                  maxWidth: "80%"
                }}
              >
                {item?.name ? item.name : "no name"}
              </Text>

              <Text
                style={{
                  fontSize: fontSize.labelSmall,
                  color: "rgba(0, 0, 0, 0.7)",
                  fontFamily: "Poppins-Regular",
                }}
              >
                {item?.mobile}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  marginLeft: -3,
                }}
              >
                <MaterialCommunityIcons
                  name="map-marker"
                  size={15}
                  color="rgba(0, 0, 0, 0.6)"
                />
                <Text
                  style={{
                    fontSize: fontSize.labelSmall,
                    color: "rgba(0, 0, 0, 0.7)",
                    fontFamily: "Poppins-Regular",
                  }}
                  numberOfLines={1}
                >
                  {item?.address ? item?.address : "no address found"}
                </Text>
              </View>

              <View
                style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
              >
                {/* {item?.dob && (
                  <>
                    <Text
                      style={{
                        fontSize: fontSize.labelSmall,
                        color: "rgba(0, 0, 0, 0.7)",
                        fontFamily: "Poppins-Regular",
                      }}
                    >
                      {item?.dob}
                    </Text>
                    <Divider style={{ width: 1.2, height: 11 }} />
                  </>
                )}

                {item?.gender && (
                  <>
                    <Text
                      style={{
                        fontSize: fontSize.labelSmall,
                        color: "rgba(0, 0, 0, 0.7)",
                        fontFamily: "Poppins-Regular",
                      }}
                    >
                      {item?.gender}
                    </Text>
                  </>
                )} */}

                {item?.roles && (
                  <>
                    <Divider style={{ width: 1.2, height: 11 }} />
                    <Text
                      style={{
                        fontSize: fontSize.labelSmall,
                        color: "rgba(0, 0, 0, 0.7)",
                        fontFamily: "Poppins-Regular",
                      }}
                    >
                      {item?.roles}
                    </Text>
                  </>
                )}
              </View>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );
};

export default UserCard;

const styles = StyleSheet.create({
  item: {
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
