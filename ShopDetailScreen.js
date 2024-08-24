import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { useRoute } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";
import { readApi } from "./Util/UtilApi";

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

  useEffect(() => {
    console.log("shopdata, , ", shopData);
  }, [shopData])

  if(isLoading){
    return<ActivityIndicator size={"large"}/>
  }

  return (
    <View>
      <Text>ShopDetails</Text>
    </View>
  );
};

export default ShopDetailScreen;
