import {
  Text,
  Card,
  TextInput,
  Divider,
  Checkbox,
  Button,
  Modal,
  Portal,
  PaperProvider,
  IconButton,
} from "react-native-paper";
import { createApi, updateApi } from "../Util/UtilApi";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  View,
  StyleSheet,
  ScrollView,
  Animated,
  ActivityIndicator,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import InvoiceDataTable from "../Components/InvoiceDataTable";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  useWindowDimensions,
  BackHandler,
  TouchableWithoutFeedback,
} from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import { useFocusEffect } from "@react-navigation/native";
import { ShopDetailContext } from "../Store/ShopDetailContext";
import { useContext } from "react";
import { useSnackbar } from "../Store/SnackbarContext";
import CheckInternet from "./CheckInternet/CheckInternet";

const getYear = (date) => {
  if (!date) return "";
  const dateObj = new Date(date);
  return dateObj.getFullYear();
};
const getNextMonthDate = (date) => {
  if (!date) return "";
  const dateObj = new Date(date);
  const nextMonth = new Date(dateObj.setMonth(dateObj.getMonth() + 1));
  return nextMonth.toISOString().substring(0, 10);
};

export default function ReviewAndPayScreen({ navigation }) {
  const route = useRoute();
  const { showSnackbar } = useSnackbar();
  const [headerPosition] = useState(new Animated.Value(0)); // Start with header at its visible position
  const [headerVisible, setHeaderVisible] = useState(true);
  const { formData, fetchDataId, item } = route.params;
  const { shopDetails } = useContext(ShopDetailContext);
  const [checked, setChecked] = useState(false);
  const { width, height } = useWindowDimensions();
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const [touchStart, setTouchStart] = useState(null);
  const [scrolling, setScrolling] = useState(false);
  const touchTimeoutRef = useRef(null);
  const scrollRef = useRef(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  let paymentStatus = "paid";

  const [totalAdded, setTotalAdded] = useState(false);
  // useEffect(() => {
  //   if (!totalAdded) {
  //     // Calculate the total price of all items in the array
  //     const grandTotal = formData.items.reduce((accumulator, currValue) => {
  //       return accumulator + parseInt(currValue.total);
  //     }, 0);

  //     // Add the total to the items array if it doesn't already exist
  //     // if (!formData.items.some((item) => item.Total !== undefined)) {
  //     //   const obj = {
  //     //     Total: grandTotal,
  //     //   };
  //     //   formData.items.push(obj);
  //     //   setTotalAdded(true);
  //     // }
  //   }
  // }, [formData.items, totalAdded]); // Ensure dependencies are correct

  // Custom back button handler
  const onBackPress = async () => {
    // Perform any action when the back button is pressed
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT
    ); // Lock to portrait

    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("HOME");
    }
    return true; // Returning true prevents the default behavior (going back)
  };

  // Use useFocusEffect to handle back button when the screen is focused
  useFocusEffect(
    useCallback(() => {
      // Add the event listener when the screen is focused
      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      // Clean up the event listener when the screen is unfocused
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  const handleChecked = () => {
    if (checked) {
      setChecked(!checked);
      paymentStatus = "unpaid";
    } else {
      setChecked(!checked);
      paymentStatus = "paid";
    }
  };
  const buttonPressed = async (buttonName) => {
    hideModal();
    submitHandler(formData, fetchDataId, paymentStatus, buttonName);
    // navigation.navigate("StackNavigator", {
    //   screen: "InvoiceSuccess",
    //   params: {
    //     newData: newData,
    //     formData: formData,
    //     paymentMode: buttonName,
    //   },
    // });
  };
  // console.log(checked, "checked");

  const toggleHeader = () => {
    if (width > height) {
      setHeaderVisible((prevState) => !prevState);
      navigation.setOptions({ headerShown: !headerVisible });
    }
    console.log("touchablity");
  };

  const handleTouchStart = (event) => {
    setTouchStart(event.nativeEvent.timestamp);
    setScrolling(false);
  };

  const handleTouchEnd = (event) => {
    const touchDuration = event.nativeEvent.timestamp - touchStart;
    if (!scrolling && touchDuration < 300) {
      // Adjust duration if needed
      clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = setTimeout(() => {
        toggleHeader();
      }, 0);
    }
  };
  const handleScroll = () => {
    setScrolling(true);
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
    }
  };

  const submitHandler = async (
    values,
    fetchDataId,
    paymentStatus,
    buttonName
  ) => {
    const postData = {
      ...values,
      shop: shopDetails._id,
      client: fetchDataId,
      number: parseInt(values.phone),
      taxRate: 0,
      currency: "USD",
      status: "draft",
      year: getYear(values.date),
      expiredDate: getNextMonthDate(values.date),
      people: item?.people || fetchDataId,
    };
    delete postData.phone;
    // delete postData.address
    console.log(postData, "------postdata , ", item);
    if (item !== undefined) {
      console.log("items is p, ", item);
      try {
        setIsLoading(true);
        const headers = {
          "Content-Type": "application/json",
        };
        const response = await updateApi(
          `api/invoice/update/${item._id}`,
          postData,
          headers
        );

        showSnackbar("invoice updated Successfull", "success");
        console.log(response.result);

        navigation.navigate("StackNavigator", {
          screen: "InvoiceSuccess",
          params: {
            newData: response.result,
            formData: formData,
            paymentMode: checked ? "unpaid" : buttonName,
          },
        });
      } catch (error) {
        // console.error("Failed to update invoice", response);
        showSnackbar("Failed to update invoice", "error");
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const headers = {
          "Content-Type": "application/json",
        };
        const response = await createApi(
          "api/invoice/create",
          postData,
          headers
        );

        showSnackbar("invoice generated Successfully", "success");
        if (response) {
          console.log(response.result);
          navigation.navigate("StackNavigator", {
            screen: "InvoiceSuccess",
            params: {
              newData: response.result,
              formData: formData,
              paymentMode: checked ? "unpaid" : buttonName,
            },
          });
        }
      } catch (error) {
        // console.error("Failed to add invoice", response);
        showSnackbar("Failed to generate invoice", "error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handleTouchStart}
      onPressOut={handleTouchEnd}
    >
      <View style={styles.mainContainer}>
        <View style={styles.overlay}></View>

        <Modal
          transparent={true}
          animationType="none"
          visible={isLoading}
          onRequestClose={() => {}}
        >
          <View style={styles.modalBackground}>
            <View style={styles.activityIndicatorWrapper}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={{ color: "#fff", fontSize: 20 }}>Loading...</Text>
            </View>
          </View>
        </Modal>

        <ScrollView style={styles.scrollView} onScrollBeginDrag={handleScroll}>
          <View style={styles.cardContainer}>
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                {/* first View */}
                <View style={styles.contentFirstChild}>
                  <View style={styles.custDetailContainer}>
                    <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
                      Customer Name :-
                    </Text>
                    <Text style={styles.textStyle}>{formData.client}</Text>
                  </View>

                  <View style={styles.custDetailContainer}>
                    <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
                      Address :-
                    </Text>
                    <Text style={styles.textStyle}>{formData.address}</Text>
                  </View>

                  <View style={styles.custDetailContainer}>
                    <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
                      GST No. :-
                    </Text>
                    <Text style={styles.textStyle}>1234</Text>
                  </View>

                  <View style={styles.custDetailContainer}>
                    <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
                      Phone No. :-{" "}
                    </Text>
                    <Text style={styles.textStyle}>{formData.phone}</Text>
                  </View>

                  <View style={styles.custDetailContainer}>
                    <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
                      Invoice No. :-{" "}
                    </Text>
                    <Text style={styles.textStyle}>1234</Text>
                  </View>

                  <View style={styles.custDetailContainer}>
                    <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
                      Date :-{" "}
                    </Text>
                    <Text style={styles.textStyle}>{formData.date}</Text>
                  </View>
                </View>
                <Divider style={{ marginVertical: 10 }} />

                <Portal>
                  <Modal
                    visible={visible}
                    onDismiss={hideModal}
                    contentContainerStyle={styles.containerStyle}
                  >
                    <View style={{ alignItems: "center" }}>
                      <Text style={{ fontSize: 20 }}>Payment Through</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        // backgroundColor:"lightgreen",
                        justifyContent: "space-around",
                      }}
                    >
                      <View style={{ alignItems: "center" }}>
                        <View
                          style={{
                            borderWidth: 2,
                            borderRadius: 50,
                          }}
                        >
                          <IconButton
                            style={{ margin: 5 }}
                            icon="qrcode-scan"
                            iconColor="grey"
                            size={60}
                            onPress={() => buttonPressed("scan")}
                          />
                        </View>

                        <Text style={{ fontSize: 18 }}>Scanner</Text>
                      </View>

                      <View style={{ alignItems: "center" }}>
                        <View
                          style={{
                            // backgroundColor:"grey",
                            justifyContent: "center",
                            alignItems: "center",
                            borderWidth: 2,
                            borderRadius: 50,
                          }}
                        >
                          <FontAwesome
                            name="rupee"
                            size={50}
                            color="grey"
                            style={{ marginHorizontal: 30, marginVertical: 18 }}
                            onPress={() => buttonPressed("cash")}
                          />
                        </View>

                        <Text style={{ fontSize: 18 }}>Cash</Text>
                      </View>

                      <View style={{ alignItems: "center" }}>
                        <View style={{ borderWidth: 2, borderRadius: 50 }}>
                          <IconButton
                            style={{ margin: 5 }}
                            icon="credit-card"
                            iconColor="grey"
                            size={60}
                            onPress={() => buttonPressed("card")}
                          />
                        </View>

                        <Text style={{ fontSize: 18 }}>Card</Text>
                      </View>
                    </View>
                  </Modal>
                </Portal>

                {/* Second View */}
                <View style={{ gap: 10 }}>
                  <InvoiceDataTable formData={formData} />

                  <View style={styles.checkBoxContainer}>
                    <Checkbox
                      status={checked ? "checked" : "unchecked"}
                      onPress={handleChecked}
                    />
                    <Text>Pay Later</Text>
                  </View>

                  <View style={styles.confirmAndPayBtnContainer}>
                    <PaperProvider>
                      <Button
                        mode="contained"
                        style={{
                          backgroundColor: "#0c3b73",
                          width: "70%",
                          alignSelf: "center",
                        }}
                        onPress={
                          checked
                            ? async () => {
                                const newData = await submitHandler(
                                  formData,
                                  fetchDataId
                                );
                              }
                            : showModal
                        }
                      >
                        Confirm and Pay
                      </Button>
                    </PaperProvider>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // backgroundColor: "orange",
  },
  overlay: {
    position: "absolute",
    top: 0, // Adjust the top value as needed
    // left: 0,
    // right:0,
    // transform: [{ translateX: -75 }, { translateY: -75 }], // Center the overlay
    width: "100%",
    // height: 250,
    height: "20%",
    backgroundColor: "#0c3b73",
    zIndex: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  card: {
    // marginHorizontal:10
  },
  cardContainer: {
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  cardContent: {
    // backgroundColor:"orange"
  },
  scrollView: {
    marginTop: 4,
    flex: 1,
    marginHorizontal: 15,
  },
  custDetailContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  textStyle: {
    fontSize: 14,
    width: "50%",
  },
  contentFirstChild: {
    gap: 10,
  },
  checkBoxContainer: {
    flexDirection: "row",
    // backgroundColor:"lightgreen",
    alignItems: "center",
    marginLeft: 10,
  },
  confirmAndPayBtnContainer: {
    borderRadius: 20,
  },
  containerStyle: {
    backgroundColor: "white",
    padding: 20,
    gap: 10,
    marginHorizontal: 10,
  },
});