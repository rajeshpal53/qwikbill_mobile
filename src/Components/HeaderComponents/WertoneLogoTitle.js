import { Image, View, StyleSheet } from "react-native";
import {Text} from "react-native-paper"
export default function wertoneLogoTitle({title}) {
  return (
    <View style={{ flexDirection: "row",}}>
      <View style={{alignItems:"center"}}>
        <Image
          style={{ width: 140, height: 70, paddingTop:10 }}
          source={require("../../../assets/aaaa_transparent.png")}
        />
        {/* <Text style={styles.whiteColor}>WERTONE</Text> */}
      </View>
      {/* <View style={{justifyContent:"center" }}>
        <Text  style={styles.whiteColor}>{title}</Text>
        <Text style={styles.whiteColor}></Text>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  whiteColor:{
    color:"white",
    fontSize:20,
    fontWeight:"bold",
  }
})