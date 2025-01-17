import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Card, Divider, Text } from "react-native-paper";
import { useRoute } from "@react-navigation/native";
import { ActivityIndicator, StyleSheet } from "react-native";
import { readApi } from "../../Util/UtilApi";

const ShopDetailScreen = () => {
  const [shopData, setShopData] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const shopId = useRoute().params.shopId;

  console.log(shopId);

  useEffect(() => {
    async function fetchDetailHandler() {
      try {
        setIsLoading(true);
        const response = await readApi(`api/shop/list?shop=${shopId}`);
        const data = await response;
        setShopData(data.result);
      } catch (error) {
        throw new Error("Item not found");
      } finally {
        setIsLoading(false);
      }
    }
    fetchDetailHandler();
  }, []);


  if (isLoading) {
    return <ActivityIndicator size={"large"} />;
  }

  // const row = (item, label) => {
  //   return (
  //     <View style={styles.custDetailContainer}>
  //       <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
  //         {label} :-
  //       </Text>
  //       <Text style={styles.textStyle}>{item}</Text>
  //     </View>
  //   );
  // };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.contentFirstChild}>
            <View style={styles.custDetailContainer}>
              <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
                Shop Name :-
              </Text>
              <Text style={styles.textStyle}>{shopData[0].shopname}</Text>
            </View>

            <View style={styles.custDetailContainer}>
              <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
                Email :-
              </Text>
              <Text style={styles.textStyle}>{shopData[0].email}</Text>
            </View>

            <View style={styles.custDetailContainer}>
              <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
                Phone No. :-{" "}
              </Text>
              <Text style={styles.textStyle}>{shopData[0].phone}</Text>
            </View>

            <View style={styles.custDetailContainer}>
              <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
                GST Number :-{" "}
              </Text>
              <Text style={styles.textStyle}>{shopData[0].gstnumber}</Text>
            </View>

            <View style={styles.custDetailContainer}>
              <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
                Address
              </Text>
              <Divider style={{ height: 2, width: "50%", backgroundColor:"#bbb" }} />
            </View>

            <View style={styles.custDetailContainer}>
              <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
                Country :-
              </Text>
              <Text style={styles.textStyle}>
                {shopData[0].address[0]?.country?.toUpperCase()}
              </Text>
            </View>

            <View style={styles.custDetailContainer}>
              <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
                State :-
              </Text>
              <Text style={styles.textStyle}>
                {shopData[0].address[0]?.state?.toUpperCase()}
              </Text>
            </View>

            <View style={styles.custDetailContainer}>
              <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
                City :-
              </Text>
              <Text style={styles.textStyle}>
                {shopData[0].address[0]?.city?.toUpperCase()}
              </Text>
            </View>

            <View style={styles.custDetailContainer}>
              <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
                Pin Code :-
              </Text>
              <Text style={styles.textStyle}>
                {shopData[0].address[0].pincode}{" "}
              </Text>
            </View>

            <View style={styles.custDetailContainer}>
              <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
                Bank Details
              </Text>
              <Divider style={{ height: 2, width: "50%", backgroundColor:"#bbb" }} />
            </View>

            <View style={styles.custDetailContainer}>
              <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
                Bank Name :-
              </Text>
              <Text style={styles.textStyle}>
                {shopData[0].bankDetail[0].bankname}
              </Text>
            </View>

            <View style={styles.custDetailContainer}>
              <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
              Account No :-
              </Text>
              <Text style={styles.textStyle}>
              {shopData[0].bankDetail[0].account}
              </Text>
            </View>

            <View style={styles.custDetailContainer}>
              <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
                Branch :-
              </Text>
              <Text style={styles.textStyle}>
                {shopData[0].bankDetail[0].branch}
              </Text>
            </View>

            <View style={styles.custDetailContainer}>
              <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
                IFSC Code :-
              </Text>
              <Text style={styles.textStyle}>
                {shopData[0].bankDetail[0].ifsccode}{" "}
              </Text>
            </View>

          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

export default ShopDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  contentFirstChild: {
    height: "100%",
    // backgroundColor:"orange",
    gap: 10,
  },
  card: {
    flex: 1,
    // backgroundColor:"lightblue"
  },
  cardContent: {
    backgroundColor: "#0c3b73",
    borderRadius: 12,
    height: "100%",
  },
  custDetailContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // backgroundColor:"orange",
    alignItems: "center",
    flex: 1,
  },
  textStyle: {
    color:"#bbb",
    fontSize: 14,
    width: "50%",
  },
});
