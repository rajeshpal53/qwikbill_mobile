import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Card, Divider, Text } from "react-native-paper";
import { useRoute } from "@react-navigation/native";
import { ActivityIndicator, StyleSheet } from "react-native";
import { readApi } from "../../Util/UtilApi";

const VendorDetailScreen = () => {
  const [vendorData, setVendorData] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const vendorId = useRoute().params.vendorId;

  useEffect(() => {
    async function fetchDetailHandler() {
      try {
        setIsLoading(true);
        const response = await readApi(`api/vendor/read/${vendorId}`);
        const data = await response;
        setVendorData(data.result);
      } catch (error) {
        throw new Error("Item not found");
      } finally {
        setIsLoading(false);
      }
    }
    fetchDetailHandler();
  }, []);

  useEffect(() => {
    console.log("vendordata, , ", vendorData);
  }, [vendorData]);

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
                Name :-
              </Text>
              <Text style={styles.textStyle}>{vendorData.people.name}</Text>
            </View>

            <View style={styles.custDetailContainer}>
              <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
                Phone :-
              </Text>
              <Text style={styles.textStyle}>{vendorData.people.phone}</Text>
            </View>

            <View style={styles.custDetailContainer}>
              <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
                Email :-
              </Text>
              <Text style={styles.textStyle}>{vendorData.people.email}</Text>
            </View>

            <View style={styles.custDetailContainer}>
              <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
                GST Number :-
              </Text>
              <Text style={styles.textStyle}>{vendorData.people.gstnumber}</Text>
            </View>

            {/* <View style={styles.custDetailContainer}>
              <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
                Address
              </Text>
              <Divider style={{ height: 2, width: "50%" }} />
            </View> */}

            <View style={styles.custDetailContainer}>
              <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
                Address :-
              </Text>
              <Text style={styles.textStyle}>
                {vendorData.people.address}
              </Text>
            </View>


            <View style={styles.custDetailContainer}>
              <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
                Payment Status :-
              </Text>
              <Text style={[
                styles.textStyle,
                {
                    color: (vendorData.paymentStatus === "paid") ? "green" : "red",
                }
                ]}>
                {vendorData.paymentStatus}
              </Text>
            </View>

            {/* <View style={styles.custDetailContainer}>
              <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
                Pin Code :-
              </Text>
              <Text style={styles.textStyle}>
                {shopData[0].address[0].pincode}{" "}
              </Text>
            </View> */}

            {/* <View style={styles.custDetailContainer}>
              <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
                Bank Details
              </Text>
              <Divider style={{ height: 2, width: "50%" }} />
            </View> */}

            {/* <View style={styles.custDetailContainer}>
              <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
                Bank Name :-
              </Text>
              <Text style={styles.textStyle}>
                {shopData[0].bankDetail[0].bankname}
              </Text>
            </View> */}

            {/* <View style={styles.custDetailContainer}>
              <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
              Account No :-
              </Text>
              <Text style={styles.textStyle}>
              {shopData[0].bankDetail[0].account}
              </Text>
            </View> */}

            {/* <View style={styles.custDetailContainer}>
              <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
                Branch :-
              </Text>
              <Text style={styles.textStyle}>
                {shopData[0].bankDetail[0].branch}
              </Text>
            </View> */}

            {/* <View style={styles.custDetailContainer}>
              <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
                IFSC Code :-
              </Text>
              <Text style={styles.textStyle}>
                {shopData[0].bankDetail[0].ifsccode}{" "}
              </Text>
            </View> */}

          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

export default VendorDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  contentFirstChild: {
    height: "50%",
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
    color:"#aaa",
    fontSize: 14,
    width: "50%",
  },
});
