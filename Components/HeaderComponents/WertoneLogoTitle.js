import { Image, View, StyleSheet } from "react-native";
import {Text} from "react-native-paper"
export default function wertoneLogoTitle({title}) {
  return (
    <View style={{ flexDirection: "row", gap:10 }}>
      <View style={{alignItems:"center"}}>
        <Image
          style={{ width: 40, height: 40 }}
          source={require("../../assets/logo-wertone.png")}
        />
        {/* <Text style={styles.whiteColor}>WERTONE</Text> */}
      </View>

      <View style={{justifyContent:"center" }}>
        <Text  style={styles.whiteColor}>{title}</Text>
        {/* <Text style={styles.whiteColor}></Text> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  whiteColor:{
    color:"white",
    fontSize:20,
    fontWeight:"bold"
  }
})