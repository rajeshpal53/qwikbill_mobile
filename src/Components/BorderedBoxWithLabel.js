
import { Text } from "react-native-paper";
import {View, StyleSheet} from "react-native"

const BorderedBoxWithLabel = ({ label, children }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.boxLabel}>{label}</Text>
        {/* <View style={styles.borderedBox}>{children}</View> */}
      </View>
    );
  };


  export default BorderedBoxWithLabel;


  const styles = StyleSheet.create({
    container: {
      margin: 16,
      position: 'relative',
    },
    boxLabel: {
      position: 'absolute',
      top: -10,
      left: 20,
      backgroundColor: 'white',
      paddingHorizontal: 5,
      fontSize: 14,
      color: 'gray',
    },
    borderedBox: {
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 5,
      padding: 16,
      paddingTop: 20,
    },
  })

  