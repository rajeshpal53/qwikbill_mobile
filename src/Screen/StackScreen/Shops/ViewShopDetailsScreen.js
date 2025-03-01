import { Text, View, StyleSheet, ScrollView } from "react-native";
import { Avatar, Button, Card } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useContext, useState } from "react";
import UserDataContext from "../../../Store/UserDataContext";
import UserDetailsStore from "../../../Component/UserDetailsstore";
import ShopDetailsStore from "../../../Component/ShopDetailsStore";
import ConfirmModal from "../../../Modal/ConfirmModal";


const ViewShopDetailsScreen = ({ route }) => {
  const { item } = route.params;
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [ShopDeleteId, setShopDeleteId] = useState(null);

  const DeleteHandler = async () => {
    //
    try {
      setIsLoading(true);
      const response = await deleteApi(`addresses/${ShopDeleteId}`);
      // await fetchAllAddresses();
      await removeAddress(ShopDeleteId);
      console.log("response of delete is , ", response);

      showSnackbar("Address Deleted Successfully", "success");
    } catch (error) {
      console.error("Error deleting Address , ", error);
      showSnackbar("SomeThing Went Wrong , Please Try Again", "error");
    } finally {
      setIsLoading(false);
      setConfirmModalVisible(false);
    }
  };

  console.log("DATA OF ITEM IS SSSSSSSSSSS", item);
  return (
    <ScrollView>
      <View style={Styles.MainContainer}>
        <Card>
          <View style={Styles.ImageCard}>
            <Card.Cover
              // source={{ uri: imageUrl }}
              source={require("../../../../assets/myShop.jpg")}
              resizeMode="cover"
              style={{
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                height: 180, // or any desired height
              }}
            />
            <View style={Styles.ShopNameView}>
              <Text style={Styles.ShopNameText}>{item?.shopname}</Text>
            </View>
          </View>
        </Card>
        <View>
          <UserDetailsStore item={item} />
        </View>
        <View>
          <ShopDetailsStore
            item={item}
            setConfirmModalVisible={setConfirmModalVisible}
            setShopDeleteId={setShopDeleteId}

          />
        </View>
      </View>

      {confirmModalVisible && (
        <ConfirmModal
          visible={confirmModalVisible}
          setVisible={setConfirmModalVisible}
          handlePress={DeleteHandler}
          message="Are you sure you want to delete this item?"
          heading="Confirm Delete"
          buttonTitle="Delete"
        />
      )}
    </ScrollView>
  );
};

const Styles = StyleSheet.create({
  MainContainer: {
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 10,
    flex: 1,
  },
  ImageCard: {
    position: "relative",
  },
  ShopNameView: {
    position: "absolute",
    bottom: "5",
    left: "15",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  ShopNameText: {
    color: "#fff",
  },
});
export default ViewShopDetailsScreen;
