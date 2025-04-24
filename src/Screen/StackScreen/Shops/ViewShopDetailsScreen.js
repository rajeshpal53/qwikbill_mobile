import { Text, View, StyleSheet, ScrollView } from "react-native";
import { Avatar, Button, Card } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useContext, useState ,useEffect } from "react";
import UserDataContext from "../../../Store/UserDataContext";
import UserDetailsStore from "../../../Component/UserDetailsstore";
import ShopDetailsStore from "../../../Component/ShopDetailsStore";
import ConfirmModal from "../../../Modal/ConfirmModal";
import { NORM_URL,deleteApi } from "../../../Util/UtilApi";
import { useSnackbar } from "../../../Store/SnackbarContext";
import { ShopContext } from "../../../Store/ShopContext";

const ViewShopDetailsScreen = ({ route }) => {
  const { item } = route.params;
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [ShopDeleteId, setShopDeleteId] = useState(null);
  const[isLoading,setIsLoading]=useState(false)
  const {showSnackbar}=useSnackbar();
  const { updateSelectedShop, allShops } = useContext(ShopContext);

  const defaultImage = require("../../../../assets/myShop.jpg");

  console.log("one selected shop item ",allShops)
  console.log("one selected shop name  item ",item.vendor.shopname)


  useEffect(() => {
    if (item?.vendor?.shopname && allShops?.length > 0) {
      const matchedShop = allShops.find(shop => shop.vendor.shopname === item.vendor.shopname);
      if (matchedShop) {
        updateSelectedShop(matchedShop);
      }
    }
  }, [item, allShops]);
  

  const DeleteHandler = async () => {
    try {
      setIsLoading(true);
      console.log(ShopDeleteId,";lkjhgfds")
      const response = await deleteApi(`vendors/${ShopDeleteId}`);
      // await fetchAllAddresses();
      console.log("response of delete is , ", response);
      showSnackbar("Shop Delete Deleted Successfully", "success");
    } catch (error) {
      console.error("Error deleting Shop , ", error.message,error);
      showSnackbar(`SomeThing Went Wrong , Please Try Again ${error}`, "error");
    } finally {
      setIsLoading(false);
      setConfirmModalVisible(false);
    }
  };


  // const updateImageUrl = debounce((profilePicurl) => {
  //   setProfileUrl(`${profilePicurl}?${new Date().getTime()}`);
  // }, 100);

  console.log("DATA OF ITEM IS SSSSSSSSSSS", item);
  return (
    <ScrollView>
      <View style={Styles.MainContainer}>
        <Card>
          <View style={Styles.ImageCard}>
            {console.log(`${NORM_URL}${item?.vendor?.shopImage}?${new Date().getTime()}`,"dldldldllddl")}
            <Card.Cover
              // source={{ uri: imageUrl }}
              source={
                item.vendor.shopImage && typeof item?.vendor?.shopImage === "string" && item?.vendor?.shopImage.trim() !== ""
                  ? { uri: `${NORM_URL}${item?.vendor?.shopImage}?${new Date().getTime()}` }
                  : defaultImage
              }
              resizeMode="cover"
              style={{
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                backgroundColor:"#fff",
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
