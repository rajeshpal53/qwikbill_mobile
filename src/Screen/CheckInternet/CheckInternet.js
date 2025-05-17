import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";

const { width, height } = Dimensions.get("window");

const CheckInternet = ({ isConnected, setIsConnected }) => {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View style={{  }}>
      <Modal visible={!isConnected} animationType="slide" transparent={true}>
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <Image
              source={require("../../../assets/NoInternet.png")}
              style={styles.image}
            />

            <Text style={styles.title}>No Internet Connection</Text>

            <Text style={styles.description}>
              It appears you are not connected to the internet. Please check your
              connection and try again...
            </Text>

            <TouchableOpacity onPress={() => { }} style={styles.retryButton}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CheckInternet;

const styles = StyleSheet.create({
  overlay: {
    flex: 1, // Fills the whole screen
    backgroundColor: "#fff", // Solid white background (not transparent)
    justifyContent: "center",
    alignItems: "center",
  },
 
  modalContent:{
  
    justifyContent:"center",
    alignItems:"center",
    // backgroundColor: "rgba(255, 255, 255, 0.97)",
     alignContent:"center"
  },
  image: {
    width: width * 0.7,
    height: width * 0.7,
    resizeMode: "contain",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    textAlign: "center",
    color: "#000",
  },
  description: {
    fontSize: 16,
    color: "#555",
    marginTop: 12,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 25,
    backgroundColor: "#CD232E",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
