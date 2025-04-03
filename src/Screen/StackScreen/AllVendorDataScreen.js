import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import { ButtonColor, fontSize,getRandomImage,NORM_URL } from "../../Util/UtilApi";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useWindowDimensions } from "react-native"; // Import the hook
import { Avatar, Card, Icon } from "react-native-paper";
import UserDataContext from "../../Store/UserDataContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { debounce } from "lodash";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const AllVendorDataScreen = () => {
  const route = useRoute();
  const [imageFullScreenModalVisible, setImageFullScreenModalVisible] =
    useState(false);
  const { item, onDelete, onEditDetails, onEditItems, onAddOffer, onRole } =
    route.params;
  const [fullScreenImageUri, setFullScreenImageUri] = useState([]);
  const { height, width } = useWindowDimensions(); // Use hook to get dimensions
  const navigation = useNavigation(); // Access navigation here
  const [ratingModelVisible, setRatingModelVisible] = useState(false);
  const [selectedProviderRating, setSelectedProviderRating] = useState(null);
  // const { showSnackbar } = useSnackbar();
  const [rating, setRating] = useState({});
  const [imageUrl, setImageUrl] = useState(null);
  const [profilePicurl, setProfilePicurl] = useState(null);
  const { userData } = useContext(UserDataContext);
  const [isImageLoaded, setIsImageLoaded] = useState(false);


  const [ManuButton, SetManuButton] = useState([
    {
      icon: "info",
      label: "Details",
      value: "Details",
    },
    {
      icon: "edit",
      label: "Products",
      value: "Items",
    },
    {
      icon: "delete",
      label: "Delete",
      value: "Delete",
    },
    {
      icon: "person",
      label: "Role",
      value: "Role",
    },
  ]);

  const handlePress = (btn) => {
    try {
      if (btn?.value == "Details") {
        onEditDetails(item);
      } else if (btn?.value == "Items") {
        onEditItems(item);
      } else if (btn?.value == "Delete") {
        onDelete(item);
      }
      else if (btn?.value == "Role") {
        onRole(item);
      }
      else {
        console.log("No matching value found.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log("DATA OF ITEM IS ------------", item);

  // Set the shop name in the header dynamically when the component loads
  useEffect(() => {
    if (item?.shopname) {
      navigation.setOptions({
        headerTitle: () => (
          // <Text style={styles.headerTitle}>{item?.shopname}</Text>
          <Text
            style={styles.headerTitle}
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {item?.shopname}
          </Text>
        ),
      });
    }
  }, [navigation, item?.shopname]);


   useEffect(() => {
      if (item?.shopImage) {
        const tempUrl = `${NORM_URL}/${item?.shopImage}?${new Date().getTime()}`;
        updateImageUrl(tempUrl);
      } else {
        const tempUrl = getRandomImage();
        updateImageUrl(tempUrl);
      }
    }, []);

    const updateImageUrl = debounce((imageurl) => {
      setImageUrl(imageurl);
      setIsImageLoaded(true); // Set image loaded state to true once the image URL is set
    }, 100);


    useEffect(() => {

      const setImages = () => {
        let tempImage = item.imageurl?.trim()
        ? `${NORM_URL}${item.imageurl}?${new Date()?.getTime()}`
        : getRandomImage();

        setImageUrl(tempImage);

        tempImage = item?.user?.profilePicurl?.trim()
        ? `${NORM_URL}${item?.user?.profilePicurl}?${new Date()?.getTime()}`
        : getRandomImage();

        setProfilePicurl(tempImage);


      }
      setImages()
    }, [])


  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <Card
          style={{
            marginHorizontal: 20,
            marginTop: 8,
            elevation: 10,
            // paddingHorizontal: 10,
            backgroundColor: "#fff",
          }}
        >
          <View style={{}}>
            <Card.Cover
              source={{ uri: imageUrl }}
              resizeMode="cover"
              style={{
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                height: 160, // or any desired height
              }}
            />

            {/* <View
              style={{
                position: "absolute",
                right: 8,
                top: 5,
                // backgroundColor: "rgba(0, 0, 0, 0.5)",
                // borderRadius: 20,
              }}
            >
              <MaterialIcons
                name={item?.isVerified && "verified-user"}
                size={30}
                color={item?.isVerified ? "#006400" : "rgba(255, 0, 0, 0.8)"}
              />
            </View> */}
          </View>

          {/* Rating and all Vender Details */}

          <View style={{ flexDirection: "row" }}>
            {/* Approved, Address, Range, Email  */}
            <View style={{ flex: 2, paddingHorizontal: 5, paddingVertical: 8 }}>
              {/* Approved Section */}

              {/* Email Section */}
              <View style={styles.row}>
                <View>
                  <Text
                    style={[
                      styles.commontext,
                      {
                        marginLeft: 5,
                        color: "rgba(0, 0, 0, 0.6)",
                        fontFamily: "Poppins-Regular",
                        fontSize: fontSize.labelMedium,
                      },
                    ]}
                  >
                    {userData?.user?.email}
                  </Text>
                </View>
              </View>

              {/* Address Section */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "flex-end",
                }}
              >
                <MaterialCommunityIcons
                  name="map-marker"
                  size={15}
                  color="rgba(0, 0, 0, 0.6)"
                  style={styles.icon} // Custom style
                />
                <Text
                  style={[
                    styles.commontext,
                    {
                      color: "rgba(0, 0, 0, 0.6)",
                      fontFamily: "Poppins-Regular",
                      fontSize: fontSize.labelMedium,
                    },
                  ]}
                >
                  {[item?.shopAddress, item?.pincode].filter(Boolean).join(",")}
                </Text>
              </View>
            </View>
          </View>
          {/* {ratingModelVisible && (
            <CustomersRatingsModel
              ratingModelVisible={ratingModelVisible}
              setRatingModelVisible={setRatingModelVisible}
              toggleRatingVisible={toggleRatingVisible}
              selectedProviderRating={selectedProviderRating}
            />
          )} */}
        </Card>

        {/* VenderName and MobileNumber and Image */}
        <Card
          style={{
            marginHorizontal: 20,
            marginTop: 15,
            elevation: 10,
            paddingHorizontal: 5,
            backgroundColor: "#fff",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              height: 70,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
            >
              <View style={{}}>
                <Avatar.Image size={50} source={{ uri: profilePicurl }} />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.commontext,
                    {
                      width: "90%",
                      marginLeft: 10,
                      // fontWeight: "bold",
                      // color: "rgba(0, 0, 0, 0.6)",
                      fontFamily: "Poppins-Bold",
                      fontSize: fontSize.labelMedium,
                    },
                  ]}
                >
                  {userData?.user?.name}
                </Text>
              </View>
            </View>

            <View>
              <View
                style={{
                  borderRadius: 5,
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  paddingVertical: 8,
                }}
              >
                <Text
                  style={[
                    styles.commontext,
                    {
                      marginLeft: 5,
                      fontWeight: "bold",
                      marginRight: 5,
                      // color: "rgba(0, 0, 0, 0.6)",
                      fontFamily: "Poppins-Regular",
                      fontSize: fontSize.label,
                    },
                  ]}
                >
                  {userData?.user?.mobile}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        <Card
          style={{
            marginHorizontal: 20,
            marginTop: 15,
            elevation: 10,
            paddingHorizontal: 2,
            backgroundColor: "#fff",
          }}
        >
          <View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
            {ManuButton?.map((btn, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handlePress(btn)}
                style={[
                  styles.item,

                  // btn.value === "Delete" ? { backgroundColor: "#808080" } : {},

                  // btn.value === "Details" ? { backgroundColor: "#808080" } : {},
                ]}
              >
                <View style={{ flexDirection: "row" }}>
                  <MaterialIcons
                    name={btn?.icon}
                    size={width * 0.05}
                    color="#fff"
                    style={[styles.btnIcon]}
                  />
                  <Text
                    style={{
                      color: "#fff",
                      fontFamily: "Poppins-Medium",
                      fontSize: fontSize.labelLarge,
                    }}
                  >
                    {btn?.label}
                  </Text>
                </View>

              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* {imageFullScreenModalVisible && (
          <ImageFullScreenModal
            isVisible={imageFullScreenModalVisible}
            onClose={closeImageModal}
            imageUri={fullScreenImageUri}
            closeText="Close"
            // modalBackgroundStyle
            // closeButtonStyle
            // closeButtonTextStyle
            // imageStyle
          />
        )} */}
      </View>
    </ScrollView>
  );
};

export default AllVendorDataScreen;

const styles = StyleSheet.create({
  headerTitle: {
    fontFamily: "Poppins-Regular",
    fontSize: fontSize.headingSmall,
    fontWeight: "bold",
  },

  commontext: {
    fontFamily: "Poppins-Medium",
    fontSize: fontSize.labelLarge,
  },
  icon: {
    marginBottom: 6,
  },

  btnIcon: {
    marginRight: 5,
    marginTop: 4,
    paddingHorizontal: 5,
  },

  item: {
    // flexDirection: "row",
    alignItems: "center",
    backgroundColor: ButtonColor.SubmitBtn,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginVertical: 8,
    height: 48,
  },
  chevron: {
    marginLeft: "auto",
  },
  linksText: {
    color: "#1e90ff",
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    fontSize: fontSize.labelSmall,
  },
});

// {/* Rating Section */}

// <View style={{}}>
// <Pressable
//   style={{
//     flexDirection: "row",
//     alignItems: "center",
//     // backgroundColor:"orange",
//     minHeight: 48,
//   }}
//   // onPress={() => {
//   //   console.log("pressed button", item?.reviewCount);
//   // }}
//   onPress={() => {
//     if (item?.reviewCount > 0) {
//       toggleRatingVisible(item);
//     }
//   }}
// >
//   <View
//     style={{
//       flexDirection: "row",
//       // borderRadius: 20,
//       // marginTop: 2,
//       alignItems: "center",
//       marginRight: 5,
//       paddingHorizontal: 2,
//     }}
//   >
//     <View
//       style={{
//         flexDirection: "row",
//         // borderWidth: 1,
//         // borderRadius: 10,
//         marginRight: 5,
//         // backgroundColor: "#f1c40f",
//       }}
//     >
//       <Text
//         style={{
//           color: "#07C158",
//           fontSize: 13,
//           marginHorizontal: 2,
//           alignItems: "center",
//           marginLeft: 8,
//         }}
//       >
//         {/* Ensure averageRating is a valid number and format it to 1 decimal place */}
//         {isNaN(Number(rating.averageRating))
//           ? "0.0"
//           : Number(rating.averageRating).toFixed(1)}
//       </Text>
//       {/* Conditional rendering based on averageRating */}
//       {item?.averageRating != null &&
//       !isNaN(item?.averageRating) ? (
//         <MaterialIcons name="star" size={18} color="#9a7d0a" />
//       ) : (
//         <MaterialIcons
//           name="star-border"
//           size={18}
//           color="#9a7d0a"
//         />
//       )}
//     </View>
//   </View>
// </Pressable>
// </View>

{
  /* Range Section */
}

{
  /* <View>
                <Text
                  style={[
                    styles.commontext,
                    {
                      color: "rgba(0, 0, 0, 0.6)",
                      fontSize: 12,
                      marginLeft: 5,
                      fontFamily: "Poppins-Regular",
                      fontSize: fontSize.labelSmall,
                    },
                  ]}
                >
                  {`Available within a radius of ${item?.drange} km`}
                </Text>
              </View> */
}

{
  /* <View style={{ marginLeft: 5 }}>
                <TouchableOpacity onPress={openImageModal}>
                  <Text style={styles.linksText}>{"View Aadhar Card"}</Text>
                </TouchableOpacity>
              </View> */
}

{
  /* <View>
                <Text
                  style={[
                    styles.commontext,
                    {
                      color: item?.isApprove ? "green" : "rgba(255, 0, 0, 0.8)",
                      marginLeft: 5,
                    },
                  ]}
                >
                  {item?.isApprove ? "Approved": "Unapproved"}
                </Text>
              </View> */
}
