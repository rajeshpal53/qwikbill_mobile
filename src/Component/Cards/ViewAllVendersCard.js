import { ScrollView, Text, View, StyleSheet } from "react-native";
import { Card, Avatar } from "react-native-paper";
import { fontSize } from "../../Util/UtilApi";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";


const ViewAllVendersCard = ({ item }) => {


  return (
    <ScrollView>
      <Card style={styles.card}>

        <View style={styles.container}>
          <View style={styles.ImageView}>
            {
              <Avatar.Text
                size={40}
                label={item?.shopname.charAt(0)}
                style={styles.avatarPlaceholder}
              />
            }
          </View>
          <View style={styles.detailscontainerView}>
            <View style={styles.shopnameView}>
              <Text style={styles.shopnameText}>{item?.shopname}</Text>
            </View>
            <View style={styles.InnerDetailsView}>
              <View>
                <MaterialCommunityIcons
                  name="phone"
                  size={15}
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
                  name="email"
                  size={15}
                  color="rgba(0, 0, 0, 0.6)"
                  style={styles.icon} // Custom style
                />
              </View>
              <View>
                <Text style={styles.detailsText}>{item?.shopname}</Text>
              </View>
            </View>
            <View style={styles.InnerDetailsView}>
              <View>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={15}
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
            <View>
              <Text style={styles.Approvedtext}>Approved</Text>
            </View>
            <View>
              <Text style={styles.rating}>rating</Text>
            </View>
          </View>

        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 5,
    marginHorizontal: 10,
    // paddingVertical: 15,
    borderRadius: 8,
    elevation: 3,
    flex: 1,
    backgroundColor: "#fff",

    // alignContent:"center"
  },
  container: {
    flex: 1,
    paddingVertical: 5,
    marginVertical: 5,
    flexDirection: "row",
  },
  ImageView: {
    paddingHorizontal: 2,
    marginLeft: 5,
    flexDirection: "column",
    // borderWidth: 1,
  },
  detailscontainerView: {
    // marginVertical: 5,
    marginHorizontal: 5,
    flexDirection: "column",
    // borderWidth: 1,
    flex: 1,
  },
  StatusandRatingView: {
    flexDirection: "column",
    // borderWidth: 1,
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 5,
  },

  shopnameView: {
    flex: 1,
  },
  InnerDetailsView: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  statusView: {},
  shopnameText: {
    fontSize: fontSize.labelMedium,
    fontFamily: "Poppins-Bold",
  },
  detailsText: {
    paddingHorizontal: 5,
    fontSize: fontSize.label,
    fontFamily: "Poppins-Medium",
  },
  avatarPlaceholder: {
    borderRadius: 8,
    width: 40,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  Approvedtext: {
    fontSize: fontSize.label,
    fontFamily: "Poppins-Medium",
    // borderWidth:1,
    borderRadius: 5,
    paddingHorizontal: 5,
    backgroundColor: "#e1faeb",
    color: "#22C55E",
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
