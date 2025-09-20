import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { useTranslation } from "react-i18next"; // if not already
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Card } from "react-native-paper";
import { ShopContext } from "../Store/ShopContext";
import { useSnackbar } from "../Store/SnackbarContext";
import UserDataContext from "../Store/UserDataContext";
import { deleteApi, fontSize } from "../Util/UtilApi";

const ShopDetailsStore = ({ item, setConfirmModalVisible, setShopDeleteId }) => {
  console.log("DATA OF ITEM  jayesh ssssss ", item);
  const { userData } = useContext(UserDataContext);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { selectedShop } = useContext(ShopContext)
  const {showSnackbar}=useSnackbar()
  // const handleDelete = (item) => {
  //   console.log("Button pressed", item);
  //   setConfirmModalVisible(true);
  //   setShopDeleteId(item?.id);
  //   // setSelectedModal(null);
  // };


  const handleDelete = async (item) => {
    // console.log("vendor id isss", item.vendor.id);
    const id = item.vendor.id 
    console.log("my tokennn ",userData?.token)
    try {
      const response = await deleteApi(`vendors/${id}`, {
      
          Authorization: `Bearer ${userData?.token}`,
    
      });

      console.log("response s  ", response);
      console.log("item deleted");
      showSnackbar("item delete successfully", "success");
    } catch (error) {
      console.error("Failed to delete the item :", error);
      showSnackbar("Failed to delete the item", "error");
    }
  };

  const handleEdit = (item) => {
    // setSelectedModal(null);
    console.log("item under viewshop , ", item);
    const newPayload = { user: item?.user, ...item?.vendor }
    console.log("new payload is , ", newPayload);

    console.log("newPayload before navigating:", newPayload?.user?.id);

    if (!item || !item.vendor) {
      console.warn("🚫 Payload is incomplete or null. Navigation skipped.");
      return;
    }
    navigation.navigate("CreateShopScreen", {
      editItem: newPayload,
      isUpdateAddress: true,

    });
  };

  const handleViewProduct = () => {
    // navigation.navigate("wertone", {
    //   screen: "ShowProductScreen",
    //   params: { item },
    // });
    navigation.navigate(
      "ShowProductScreen"
    )
  }

  return (
    <View>
      <Card style={styles.UserCard}>
        <View style={styles.MainContainer}>
          <View>
            <Text style={styles.ShopDetailsText}>Business Details</Text>
          </View>

          <View style={styles.DetailsMainView}>
            <View>
              <MaterialCommunityIcons
                name="file-document"
                size={18}
                color="rgba(0, 0, 0, 0.6)"
                style={styles.icon}
              />
            </View>
            <View style={styles.DetailsMainTextView}>
              <View>
                <Text style={styles.Phonetext}>Registration Number</Text>
              </View>
              <View>
                <Text style={styles.PhoneNumbertext}>---</Text>
              </View>
            </View>
          </View>
          <View style={styles.DetailsMainView}>
            <View>
              <MaterialCommunityIcons
                name="file-document"
                size={18}
                color="rgba(0, 0, 0, 0.6)"
                style={styles.icon}
              />
            </View>
            <View style={styles.DetailsMainTextView}>
              <View>
                <Text style={styles.Phonetext}>Aadhar Card Number</Text>
              </View>
              <View>
                {/* Uncomment and update the following line when you have the actual value */}
                <Text style={styles.PhoneNumbertext}>
                  {userData?.user?.aadharCard || "Not Available"}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.DetailsMainView}>
            <View>
              <MaterialCommunityIcons
                name="file-document"
                size={18}
                color="rgba(0, 0, 0, 0.6)"
                style={styles.icon}
              />
            </View>
            <View style={styles.DetailsMainTextView}>
              <View>
                <Text style={styles.Phonetext}>Business Category</Text>
              </View>
              <View>
                <Text style={styles.PhoneNumbertext}>
                  {item?.category || "Not Available"}{" "}
                  {/* Update this based on item structure */}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.DetailsMainView}>
            <View>
              <MaterialCommunityIcons
                name="file-document"
                size={18}
                color="rgba(0, 0, 0, 0.6)"
                style={styles.icon}
              />
            </View>
            <View style={styles.DetailsMainTextView}>
              <View>
                <Text style={styles.Phonetext}>
                  License Number OR GST Number
                </Text>
              </View>
              <View>
                <Text style={styles.PhoneNumbertext}>--- </Text>
              </View>
            </View>
          </View>
        </View>
      </Card>

      <View style={styles.ButtonView}>

        <View style={styles.ButtonView}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleViewProduct}

          >
            <Text style={{ color: "#fff" }}>View Products </Text>
          </TouchableOpacity>
        </View>


        {selectedShop?.role?.name === "owner" && (<View>
          <View style={styles.ButtonView}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => handleEdit(item)}
            >
              <Text style={{ color: "#fff" }}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.ButtonView}>
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={() => handleDelete(item)}
            >
              <Text style={{ color: "#fff" }}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>)
        }

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  UserCard: {
    marginVertical: 2,
    backgroundColor: "#fff"
  },
  MainContainer: {
    paddingHorizontal: 5,
    marginVertical: 10,
  },
  DetailsMainView: {
    flexDirection: "row",
    alignItems: "center",
  },
  DetailsMainTextView: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  ShopDetailsText: {
    fontFamily: "Poppins-Bold",
    fontSize: fontSize.labelLarge,
  },
  Phonetext: {
    fontFamily: "Poppins-Regular",
    fontSize: fontSize.labelMedium,
    color: "rgba(0,0,0,0.8)",
  },
  PhoneNumbertext: {
    fontFamily: "Poppins-Regular",
    fontSize: fontSize.labelMedium,
    color: "rgba(0,0,0,0.6)", // Fixed color syntax
  },
  closeButton: {
    paddingVertical: 13,
    borderRadius: 10,
    flex: 0.45,
    alignItems: "center",
    backgroundColor: "#26a0df",
  },
  downloadButton: {
    backgroundColor: "#1B4872",
    paddingVertical: 13,
    borderRadius: 10,
    flex: 0.5,
    alignItems: "center",
  },
  ButtonView: {
    paddingVertical: 10,
  },
});

export default ShopDetailsStore;
