import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useRef } from "react";
import { Text } from "react-native-paper";
import { clearCart } from "../Redux/reducers/cartReducers";
import { useDispatch, useSelector } from "react-redux";



const ViewCartOverlay = ({navigation, carts}) => {
  const {t} = useTranslation();
    const pendingActionRef = useRef(null);
  
  // const [selectedTypes, setSelectedTypes] = useState(0);

  // useEffect(() => {
  //     console.log("cart data is , ", cartData)
  //     setSelectedTypes(cartData?.totalUniqueItems || 0);
  // }, [cartData])
  function handleConfirm() {
      setShowModal(false);                           // close the modal
      if (pendingActionRef.current) {
        navigation.dispatch(pendingActionRef.current); // finally go back
      }
      dispatch(clearCart());
    }
  

  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: "lightblue",
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
          {t("Selected Item")} : {carts.length}
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
              {t("Go to Invoice")}
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
    width: "90%",
    alignSelf:"center",
    alignItems: "center",
  },
});
