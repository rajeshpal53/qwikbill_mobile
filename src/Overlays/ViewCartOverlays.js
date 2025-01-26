import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native";
import { Text } from "react-native-paper";

const ViewCartOverlay = ({navigation, carts}) => {
  // const [selectedTypes, setSelectedTypes] = useState(0);

  // useEffect(() => {
  //     console.log("cart data is , ", cartData)
  //     setSelectedTypes(cartData?.totalUniqueItems || 0);
  // }, [cartData])

  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: "#fff",
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-around",
          paddingVertical: 10,
          borderRadius: 10,
        }}
      >
        <View
          style={{
            width: "50%",
            alignItems: "center",
            justifyContent: "center",

          }}
        >
          <Text style={{ fontSize: 16, color: "#1c6a4a" }}>
          Selected Item : {carts.length}
          </Text>
        </View>
        <View style={{ }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
            //   width: "90%",
            //   alignItems: "center",
              height: 40,
              justifyContent: "center",
              backgroundColor: "#1e90ff",
              borderRadius: 10,
            }}
          >
            <Text
              style={{

                fontSize: 16,
                color: "#fff",
                // paddingVertical: 5,
                paddingHorizontal: 10,

              }}
            >
              Go to Invoice
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ViewCartOverlay;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: "10%",
    width: "100%",
    alignItems: "center",
  },
});
