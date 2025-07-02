import { Text, View, StyleSheet } from "react-native";
import { Avatar, Button, Card } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useContext } from "react";
import UserDataContext from "../Store/UserDataContext";
import { fontSize } from "../Util/UtilApi";

const UserDetailsStore = ({ item }) => {
  const { userData } = useContext(UserDataContext);
  console.log("DATA OF USE IS SSSSSSSSSSSSSSS", userData);

  return (
    <Card style={styles.UserCard}>
      <View style={styles.MainContainer}>
        <View>
          <Text style={styles.ShopDetailsText}>Contact Details</Text>
        </View>

        <View style={styles.DetailsMainView}>
          <View>
            <MaterialCommunityIcons
              name="phone"
              size={18}
              color="rgba(0, 0, 0, 0.6)"
              style={styles.icon} // Custom style
            />
          </View>
          <View style={styles.DetailsMainTextView}>
            <View>
              <Text style={styles.Phonetext}>Phone Number</Text>
            </View>
            <View>
              <Text style={styles.PhoneNumbertext} >{userData?.user?.mobile}</Text>
            </View>
          </View>
        </View>
        <View style={styles.DetailsMainView}>
          <View>
            <MaterialCommunityIcons
              name="email"
              size={18}
              color="rgba(0, 0, 0, 0.6)"
              style={styles.icon} // Custom style
            />
          </View>
          <View style={styles.DetailsMainTextView}>
            <View>
              <Text style={styles.Phonetext}>Email</Text>
            </View>
            <View>
              <Text style={styles.PhoneNumbertext}>{userData?.user?.email}</Text>
            </View>
          </View>
        </View>
        <View style={styles.DetailsMainView}>
          <View>
            <MaterialCommunityIcons
              name="map-marker"
              size={18}
              color="rgba(0, 0, 0, 0.6)"
              style={styles.icon} // Custom style
            />
          </View>
          <View style={styles.DetailsMainTextView}>
            <View>
              <Text style={styles.Phonetext}>Address</Text>
            </View>
            <View>
              <Text style={styles.PhoneNumbertext} >
                {[userData?.user?.address, userData?.user?.pincode]
                  .filter(Boolean)
                  .join(", ")}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  UserCard: {
    marginVertical: 10,
    backgroundColor:"#fff"
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
  ShopDetailsText:{
    fontFamily:"Poppins-Bold",
    fontSize:fontSize.labelLarge
  },
  Phonetext:{
    fontFamily:"Poppins-Regular",
    fontSize:fontSize.labelMedium,
    color:("rgba(0,0,0,0.8)")
  },
  PhoneNumbertext:{
    fontFamily:"Poppins-Regular",
    fontSize:fontSize.labelMedium,
    color:("rgba(0,0,0,6)")
  },
});

export default UserDetailsStore;
