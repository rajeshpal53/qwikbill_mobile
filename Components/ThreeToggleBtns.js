
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

export default function ThreeToggleBtns({buttonsModes, setButtonsModes, toggleButtonsTexts}){
  
    const handleButtonPress = (button) => {
        setButtonsModes((prevstate) => {
          if (button === "first" && !prevstate.firstButtonMode) {
            return {
              firstButtonMode: true,
              secondButtonMode: false,
              thirdButtonMode: false,
            };
          } else if (
            button === "second" &&
            !prevstate.secondButtonMode
          ) {
            console.log("pr")
            return {
              firstButtonMode: false,
              secondButtonMode: true,
              thirdButtonMode: false,
            };
          } else if (button === "third" && !prevstate.thirdButtonMode) {
            return {
              firstButtonMode: false,
              secondButtonMode: false,
              thirdButtonMode: true,
            };
          } else {
            return prevstate;
          }
        });
      };

    return (
        <View style={styles.buttonContainer}>
          <Button
            style={{
              //   width: "50%",
              backgroundColor: buttonsModes.firstButtonMode
                ? "#6dbbc7"
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
            style={{
              //   width: "50%",
              backgroundColor: buttonsModes.secondButtonMode
                ? "#6dbbc7"
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
            style={{
              //   width: "50%",
              backgroundColor: buttonsModes.thirdButtonMode
                ? "#6dbbc7"
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
    flexDirection: "row",
    justifyContent:"space-evenly",
    marginTop:10
  },
 
});