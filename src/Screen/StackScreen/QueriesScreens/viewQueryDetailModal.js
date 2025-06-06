import {
    StyleSheet,
    Text,
    View,
    Modal,
    TouchableOpacity,
    Image,
    ScrollView,
  } from "react-native";
  import React from "react";
  import { Entypo } from "@expo/vector-icons";
  import { API_BASE_URL, fontSize, NORM_URL } from "../../../Util/UtilApi";
  import { Divider } from "react-native-paper";
  import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
  import { Dimensions } from "react-native";
  const ViewQueryDetailModal = ({
    item,
    queryDetailModalVisible,
    toggleModal,
  }) => {
      const {height} = Dimensions.get("window");

      console.log(` feedback screenshot is ${API_BASE_URL}${item?.screenShotUrl}`)

      console.log(`${API_BASE_URL}assets/screenshots/prathmesh-1741153743538.jpg`)
    return (
      <View style={{ paddingHorizontal: 10 }}>
        <Modal
          animationType="slide"
          isVisible={queryDetailModalVisible}
          onRequestClose={toggleModal}
          // style={{ flex: 1 }}
        >
          <View style={styles.modalContent}>
            <View style={{maxHeight:height}}>
              <TouchableOpacity
                onPress={toggleModal}
                style={{
                
                  marginRight: 10,
                  marginTop: 10,
                  alignSelf: "flex-end",
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  borderRadius: 10,
                  padding: 2,
                }}
              >
                <Entypo name="cross" size={30} color="rgba(0, 0, 0, 0.7)" />
              </TouchableOpacity> 
  
              <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                style={{ marginTop: 5 }}
              >
                <View style={styles.contentStyle}>
                  {/* <Text>Hello modal</Text> */}
  
                  <View style={styles.textContainer}>
                    <Text style={[styles.name, styles.textColor]}>
                      {item?.name}
                    </Text>
                    <View style={styles.infoRow}>
                      <MaterialCommunityIcons
                        name="phone"
                        size={18}
                        color="#555"
                        style={{ marginBottom: 3 }}
                      />
                      <Text style={[styles.textStyle, styles.textColor]}>
                        {item?.mobile}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <MaterialCommunityIcons
                        name="email"
                        size={18}
                        color="#555"
                        style={{ marginBottom: 3 }}
                      />
                      <Text style={[styles.textStyle, styles.textColor]}>
                        {item?.email}
                      </Text>
                    </View>
  
                    <Text style={[styles.textStyle, styles.textColor]}>
                      {item?.description}
                    </Text>
  
                    <Text style={styles.feedbackType}>{item?.feedbackType}</Text>
  
                    {item?.isResolved ? (
                      <Text style={styles.queryTagStyle}>Query Resolved</Text>
                    ) : (
                      <Text style={styles.queryTagStyle}>Query Pending</Text>
                    )}
                  </View>
  
                  <View>
                    <Divider style={styles.dividerStyle} />
                    <Text
                      style={[
                        { fontFamily: "Poppins-Medium", marginBottom: 10 },
                        styles.textColor,
                      ]}
                    >
                      ScreenShot:
                    </Text>
                    <Image
                      source={{ uri: `${NORM_URL}${item?.screenShotUrl}` }}
                      style={{ width: 300, height: 500 }}
                      resizeMode="contain"
                    />
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    );
  };
  
  export default ViewQueryDetailModal;
  
  const styles = StyleSheet.create({
    modalHeaderStyle: {
      // flexDirection: "row",
      marginTop: 10,
      // justifyContent:"center"
    },
    modalContent: {
      flex: 1,
      // justifyContent: "flex-end",
      // marginBottom: 10,
      // maxHeight:600,
  
      // paddingBottom:10
    },
    contentStyle: {
      alignItems: "center",
      // paddingBottom: 20,
    },
    name: {
      fontFamily: "Poppins-Bold",
      fontSize: fontSize.headingSmall,
    },
    textStyle: {
      fontFamily: "Poppins-Medium",
    },
    textContainer: {
      gap: 10,
    },
    textColor: {
      color: "rgba(0, 0, 0, 0.7)",
    },
    dividerStyle: {
      marginVertical: 10,
      height: 1,
      // width:"100%"
    },
    queryTagStyle: {
      fontFamily: "Poppins-Bold",
      fontSize: fontSize.labelMedium,
      color: "#0a6846",
    },
    feedbackType: {
      color: "rgba(255, 0, 0, 0.7)",
      fontFamily: "Poppins-Bold",
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      // marginTop: 4,
    },
  });
  