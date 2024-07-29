import { ScrollView, View,Text} from "react-native";
import { useState, useEffect } from "react";
import { readApi } from "../Util/UtilApi";
import NewGenrateInvoice from "../Components/NewGenrateInvoice";

function GenrateInvoiceScreen({ route }) {
  const { detail } = route.params;
  console.log(detail,"hello detail")

  return (
    <View>
      <ScrollView>
        {/* <GenrateInvoice data={detail}/> */}
        {/* <NewGenrateInvoice data={detail} /> */}
        <Text>genrate invoice</Text>
      </ScrollView>
    </View>
  );
}

export default GenrateInvoiceScreen;
