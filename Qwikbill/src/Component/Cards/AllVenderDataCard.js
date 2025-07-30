import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Avatar, Card } from "react-native-paper";
import { fontSize, getRandomImage, NORM_URL } from "../../Util/UtilApi";

import { useNavigation } from "@react-navigation/native";
import { debounce } from "lodash";
import { useWindowDimensions } from "react-native"; // Import the hook
import { ShopContext } from "../../Store/ShopContext";

const AllVenderDataCard = ({
  item,
  onDelete,
  onEditDetails,
  onEditItems,
  onRole,
}) => {
  const { height, width } = useWindowDimensions(); // Use hook to get dimensions
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { allShops, selectedShop } = useContext(ShopContext);

  const navigation = useNavigation();
  const [imageurl, setImageUrl] = useState("");

  //console.log("Data of item 1234", selectedShop);

  // useEffect(() => {
  //   if (item?.shopImage) {
  //     const tempUrl = `${NORM_URL}/${item?.shopImage}?${new Date().getTime()}`;
  //     updateImageUrl(tempUrl);
  //   } else {
  //     const tempUrl = getRandomImage();
  //     updateImageUrl(tempUrl);
  //   }
  // }, []);

  // const updateImageUrl = debounce((imageurl) => {
  //   setImageUrl(imageurl);
  // }, 100);

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

  return (
    // <View>
    //     <Text>{item?.shopname}</Text>
    // </View>
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 8,
        marginVertical: 5,
      }}
    >
      <Card
        style={{
          ...styles.card,
          marginBottom: 10,
        }}
        onPress={() => {
          navigation.navigate("AllVendorDataScreen", {
            item: item,
            onDelete: onDelete,
            onEditDetails: onEditDetails,
            onEditItems: onEditItems,
            onRole: onRole,
          });
        }}
      >
        <View
          style={{
            ...styles.headerContainer,
            padding: 5,
          }}
        >
          <View style={styles.avatarContainer}>
            {/* {imageurl && (
              <Avatar.Image
                size={60}
                source={{ uri: imageurl }}
                style={{ marginRight: width * 0.02 }} // Inline style for margin
              />
            )}
          </View> */}
            {isImageLoaded ? ( // Conditionally render the image after it has loaded
              <Avatar.Image
                size={60}
                source={{ uri: imageurl }}
                style={{ marginRight: width * 0.02 }} // Inline style for margin
              />
            ) : (
              <ActivityIndicator size="small" color="#0000ff" /> // Show loading indicator while the image is loading
            )}
          </View>

          <View style={styles.shopInfoContainer}>
            <View style={{ width: "90%" }}>
              <Text style={{ ...styles.shopName }} numberOfLines={1}>
                {item?.shopname
                  ? item.shopname.charAt(0).toUpperCase() +
                    item.shopname.slice(1)
                  : ""}
              </Text>
            </View>

            <View style={{ width: "90%" }}>
              <Text style={{ fontSize: fontSize.labelMedium, marginLeft: 3 }}>
                {item?.whatsappnumber}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "flex-end",
                // marginBottom: 3,
              }}
            >
              <MaterialCommunityIcons
                name="map-marker"
                size={15}
                color="rgba(0, 0, 0, 0.6)"
              />
              <Text
                style={{
                  fontSize: fontSize.labelMedium,
                }}
                numberOfLines={1}
              >
                {[item?.shopAddress, item?.pincode].filter(Boolean).join(", ")}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerContainer: {
    flexDirection: "row",

    // width: "100%", // Use percentage for width
  },

  avatarContainer: {
    marginTop: 4,
  },
  shopInfoContainer: {
    flex: 1,
    position: "relative",
    paddingVertical: 2,
    padding: 5,
    alignItems: "flex-start",
  },
  shopName: {
    fontSize: fontSize.labelLarge, // fontSize: width > 400 ? 18 : 16, // Responsive font size
    fontFamily: "Poppins-Bold",
    // color: "rgba(0, 0, 0, 0.6)",
    marginLeft: 3,
  },
  rangeText: {
    color: "#555",
    // fontSize: width > 400 ? 14 : 12,
  },
});

export default AllVenderDataCard;
