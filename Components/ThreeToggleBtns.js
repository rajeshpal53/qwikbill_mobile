
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

export default function ThreeToggleBtns({buttonsModes, setButtonsModes, toggleButtonsTexts, handleButtonPress}){

    return (
        <View style={styles.buttonContainer}>
          <Button
          textColor={buttonsModes.firstButtonMode ? "#fff" : "#26a0df"}
            style={{
              //   width: "50%",
              // color:"#26a0df",
              // paddingVertical:1,
              // paddingHorizontal:5,
              flex:1,
              backgroundColor: buttonsModes.firstButtonMode
                ? "#777"
                : "transparent",
            }}
            mode={
              buttonsModes.firstButtonMode ? "contained" : "contained-disabled"
            }
            onPress={() => handleButtonPress("first")}
          >
            {toggleButtonsTexts.first}
          </Button>

          <Button
          textColor={buttonsModes.secondButtonMode ? "#fff" : "#26a0df"}
            style={{
              //   width: "50%",
              flex:1,
              backgroundColor: buttonsModes.secondButtonMode
                ? "#777"
                : "transparent",
            }}
            mode={
              buttonsModes.secondButtonMode
                ? "contained"
                : "contained-disabled"
            }
            onPress={() => handleButtonPress("second")}
          >
            {toggleButtonsTexts.second}
          </Button>

          <Button
          textColor= {buttonsModes.thirdButtonMode ? "#fff" : "#26a0df"}
            style={{
              //   width: "50%",
              flex:1,
              backgroundColor: buttonsModes.thirdButtonMode
                ? "#777"
                : "transparent",
            }}
            mode={
              buttonsModes.thirdButtonMode
                ? "contained"
                : "contained-disabled"
            }
            onPress={() => handleButtonPress("third")}
          >
            {toggleButtonsTexts.third}
          </Button>
        </View>
    );
};


const styles = StyleSheet.create({
  ScrollView: {
    flex: 1,
    paddingHorizontal: 10,
  },
  contentContainer: {
    gap: 18,
  },
  shopText: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
  },

  buttonContainer: {
    flex:1,
    flexDirection: "row",
    justifyContent:"space-between",
    backgroundColor:"#fff",
    elevation:2,
    // paddingVertical:5,
    borderRadius:25,

    // marginTop:
  },
 
});