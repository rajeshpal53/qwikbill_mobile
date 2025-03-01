import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Card } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { fontSize } from "../Util/UtilApi";
import { useContext, useState } from "react";
import UserDataContext from "../Store/UserDataContext";
import { useNavigation } from "@react-navigation/native";

const ShopDetailsStore = ({ item, setConfirmModalVisible, setShopDeleteId }) => {
  console.log("DATA OF ITEM IS ", item);
  const { userData } = useContext(UserDataContext);
  const navigation = useNavigation();

  const handleDelete = () => {
    console.log("Button pressed");
    setConfirmModalVisible(true);
    setShopDeleteId(item?.id);
    // setSelectedModal(null);
  };

  const handleEdit = (item) => {
    // setSelectedModal(null);
    navigation.navigate("CreateShopScreen", {
      addressDetails: item,
      isUpdateAddress: true,
    });
  };

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
                <Text style={styles.PhoneNumbertext}>7485759875</Text>
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
                <Text style={styles.PhoneNumbertext}>JHSJJSKS741587</Text>
              </View>
            </View>
          </View>
        </View>
      </Card>

      <View style={styles.ButtonView}>
        <View style={styles.ButtonView}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => handleEdit(item)}
          >
            <Text>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.ButtonView}>
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={handleDelete}
          >
            <Text>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  UserCard: {
    marginVertical: 2,
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
    backgroundColor: "#F59E0B",
  },
  downloadButton: {
    backgroundColor: "#EF4444",
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
