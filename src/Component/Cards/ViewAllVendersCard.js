import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Card, Avatar, Menu, Button } from "react-native-paper";
import { fontSize } from "../../Util/UtilApi";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

const ViewAllVendersCard = ({ item }) => {
  const [selectedModal, setSelectedModal] = useState(null);
  const navigation = useNavigation();
  

  console.log("selected shop item is ",item)

  const handleModal = (id) => {
    setSelectedModal(selectedModal === id ? null : id);
  };

  const handleDelete = () => {
    setConfirmModalVisible(true);
    setAddressDeleteId(item?.id);
    setSelectedModal(null);
  };

  const handleAddProduct = () => {
  
   // setSelectedModal(null);
    navigation.navigate("AddProduct", {
      addressDetails: item,
      isUpdateAddress: true,
    });
  };


  const handleEditProduct = (item) => {
    console.log("DATA OF ITEM productt  IS ", item);
    setSelectedModal(null);
    navigation.navigate("AddProduct", {
      addressDetails: item,
      isUpdateAddress: true,
    });
  };

  return (
    <ScrollView>
      <Card style={styles.card}>
        <View style={styles.container}>
          <View style={styles.ImageView}>
            <View>
              {
                <Avatar.Text
                  size={40}
                  label={item?.shopname.charAt(0)}
                  style={styles.avatarPlaceholder}
                />
              }
            </View>
            <View style={styles.shopnameView}>

              <View style={styles.InnershopnameView}>
                <Text style={styles.shopnameText}>{item?.shopname}</Text>
              </View>

              {/* <View style={{ width: "20%" }}>
                <Menu
                  visible={selectedModal === item?.id}
                  onDismiss={() => setSelectedModal(null)}
                  anchor={
                    <View style={{}}>
                      <Button onPress={() => handleModal(item?.id)}>
                        <MaterialIcons
                          name="more-vert"
                          size={22}
                          color="black"
                        />
                      </Button>
                    </View>
                  }
                  contentStyle={{
                    padding: 1,
                    marginRight: 5,
                    marginTop: 30,
                    backgroundColor: "#F8F8F8",
                  }} // Content style for Menu items
                  elevation={1} // Adds shadow to the Menu component
                  mode="adaptive" // Use the adaptive mode, adjusting based on screen size and space

                  // anchorPosition='bottom'
                >
                  <Menu.Item onPress={() => handleAddProduct()} title="Add Product" />
                  <Menu.Item onPress={() => handleEditProduct(item)} title="Edit Product" />
                </Menu>
              </View> 
               */}
            </View>
          </View>

          <View style={styles.detailscontainerView}>
            <View style={styles.InnerDetailsView}>
              <View>
                <MaterialCommunityIcons
                  name="phone"
                  size={18}
                  color="rgba(0, 0, 0, 0.6)"
                  style={styles.icon} // Custom style
                />
              </View>
              <View>
                <Text style={styles.detailsText}>{item?.whatsappnumber}</Text>
              </View>
            </View>
            
            <View style={styles.InnerDetailsView}>
              <View>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={18}
                  color="rgba(0, 0, 0, 0.6)"
                  style={styles.icon} // Custom style
                />
              </View>
              <View>
                <Text style={styles.detailsText}>{item?.shopAddress}</Text>
              </View>
            </View>
            
          </View>
          <View style={styles.StatusandRatingView}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ViewShopDetailsScreen", { item: item })
              }
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <View>
                <Text style={styles.Approvedtext}>View Details</Text>
              </View>
              <View>
                <MaterialCommunityIcons
                  name="arrow-right"
                  size={15}
                  color="#2196F3"
                  style={styles.icon}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 8,
    elevation: 3,
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 5,

    // alignContent:"center"
  },
  container: {
    flex: 1,
    paddingVertical: 5,
    marginVertical: 5,
  
  },
  ImageView: {
    paddingHorizontal: 5,
    marginLeft: 5,
    flexDirection: "row",
  
  },
  detailscontainerView: {
    // marginVertical: 5,
    marginHorizontal: 10,
    marginVertical: 8,
    // flexDirection: "column",
    // borderWidth: 1,
    flex: 1,

  },
  StatusandRatingView: {
    flexDirection: "row",
    // borderWidth: 1,
    // justifyContent: "space-between",
    alignItems: "center",
    justifyContent: "flex-end",
    marginRight: 20,
    flex: 1,
    // borderWidth:2
  },

  shopnameView: {
    flex: 1,
    // borderWidth:2,
    paddingHorizontal: 8,
    flexDirection: "row",
  },
  InnershopnameView: {
    flex: 1,  
    alignSelf:"center"
  },
  InnerDetailsView: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  
    marginBottom:5,
    marginLeft:3
  },
  statusView: {},
  shopnameText: {
    fontSize: fontSize.labelLarge,
    fontFamily: "Poppins-Bold",
    marginTop: 2,
  },
  detailsText: {
    paddingHorizontal: 5,
    fontSize: fontSize.labelMedium,
    fontFamily: "Poppins-Medium",
  },
  avatarPlaceholder: {
     borderRadius: 15,
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  Approvedtext: {
    fontSize: fontSize.labelMedium,
    fontFamily: "Poppins-Medium",
    // borderWidth:1,
    borderRadius: 5,
    paddingHorizontal: 5,
    // backgroundColor: "#e1faeb",
    color: "#2196F3",
  },
  rating: {
    fontSize: fontSize.label,
    fontFamily: "Poppins-Medium",
    // borderWidth:1,
    borderRadius: 5,
    paddingHorizontal: 5,
    backgroundColor: "#f7ebba",
    color: "#edc009",
  },
  //   statusText: {
  //     paddingHorizontal: 5,
  //     fontFamily: "Poppins-Medium",
  //     fontSize: fontSize.labelMedium,
  //   },
});

export default ViewAllVendersCard;
