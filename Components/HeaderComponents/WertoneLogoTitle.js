import { Image, View, Text, StyleSheet } from "react-native";
export default function wertoneLogoTitle() {
  return (
    <View style={{ flexDirection: "row" }}>
      <View style={{alignItems:"center"}}>
        <Image
          style={{ width: 40, height: 40 }}
          source={require("../../assets/logo-wertone.png")}
        />
        <Text style={styles.whiteColor}>WERTONE</Text>
      </View>

      <View>
        <Text style={styles.whiteColor}>Billing</Text>
        <Text style={styles.whiteColor}>Software</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  whiteColor:{
    color:"white"
  }
})