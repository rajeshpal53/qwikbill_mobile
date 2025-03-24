import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // for using icons
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook
import { fontFamily, fontSize } from "../../Util/UtilApi";

const AllRoleDetailsCard = ({ item }) => {
  const navigation = useNavigation();
  useEffect(() => {
    console.log("DATA OF ITEM IS123 ", item);
  }, [item]);

  const handleCardPress = () => {
    navigation.navigate("RoleDetailsScreen", { item: item });
  };

  return (
    <View style={styles.container}>
      {" "}
      <Card style={styles.card}>
        <TouchableOpacity onPress={handleCardPress}>
          <View style={styles.header}>
            <View>
              <MaterialCommunityIcons
                name="account-circle"
                size={60}
                color="#0c3b73"
              />
            </View>
            <View style={{}}>
              <View style={styles.detailContainer}>
                <View style={{ marginBottom: 2 }}>
                  <Text
                    style={[
                      styles.label,
                      { fontWeight: "bold", fontSize: fontSize.headingSmall },
                    ]}
                  >
                    {item?.user?.name || "No Name Provided"}
                  </Text>
                </View>
                <View>
                  <Text style={styles.label}>
                    {item?.user?.email || "No Email Provided"}
                  </Text>
                </View>
                <View>
                  <Text style={styles.label}>
                    {item?.role?.name || "No Role Provided"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginVertical: 10,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    // paddingVertical: 5,
  },
  // cardTitle: {
  //   marginLeft: 15,
  // },
  detailContainer: {
    paddingVertical: 5,
    marginVertical: 5,
    marginHorizontal: 5,
  },
  cardText: {
    fontSize: fontSize.labelMedium,
    fontFamily: "Poppins-Regular",
  },
  label: {},
});

export default AllRoleDetailsCard;
