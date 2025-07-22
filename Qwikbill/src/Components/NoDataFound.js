import React from 'react'
import { View,Image } from 'react-native';
import { Button,Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

function NoDataFound({textString,home,}) {
    const navigation=useNavigation()
  return (
    <View
    style={{
      alignItems: "center",
      justifyContent: "center",
    }}
    >
    <Image
      source={require("../../assets/noDataFoundImage2.jpg")}
      style={{ width: 300, height: 230 }}
    />
    <Text
      style={{
        fontSize: 20,
        color: "rgba(0, 0, 0, 0.5)",
        fontStyle: "bold",
        textAlign:"center"
      }}
    >
      {textString}
    </Text>
    {
        home&&(<Button
        onPress={() => {
          navigation.navigate("LocationSearch", {
            navigationName: "Home",
          });
        }}
      >
        Please try with different location{" "}
      </Button>)

    }

    </View>
  )
}

export default NoDataFound;
