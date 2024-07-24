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
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { View, StyleSheet, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import InvoiceDataTable from "../Components/InvoiceDataTable";
import { useEffect, useState } from "react";

export default function ReviewAndPayScreen({ navigation }) {
  const route = useRoute();

  const { formData } = route.params;
  const {submitHandler} = route.params;
  const [checked, setChecked] = useState(false);

  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const [totalAdded, setTotalAdded] = useState(false);
  useEffect(() => {
    if (!totalAdded) {
      // Calculate the total price of all items in the array
      const grandTotal = formData.items.reduce((accumulator, currValue) => {
        return accumulator + parseInt(currValue.total);
      }, 0);

      // Add the total to the items array if it doesn't already exist
      if (!formData.items.some((item) => item.Total !== undefined)) {
        const obj = {
          Total: grandTotal,
        };
        formData.items.push(obj);
        setTotalAdded(true);
      }
    }
  }, [formData.items, totalAdded]); // Ensure dependencies are correct

  const buttonPressed = (buttonName) => {
    console.log("buttonName , ", buttonName);

    hideModal();
    navigation.navigate("StackNavigator", { 
      screen: "InvoiceSuccess", 
      params: { 
        formData: formData,
        paymentMode:buttonName,
        submitHandler:submitHandler,
      } 
    });
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.overlay}></View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.cardContainer}>
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              {/* first View */}
              <View style={styles.contentFirstChild}>
                <View style={styles.custDetailContainer}>
                  <Text style={styles.textStyle}>Customer Name :-</Text>
                  <Text style={styles.textStyle}>{formData.client}</Text>
                </View>

                <View style={styles.custDetailContainer}>
                  <Text style={styles.textStyle}>Address :-</Text>
                  <Text style={styles.textStyle}>{formData.address}</Text>
                </View>

                <View style={styles.custDetailContainer}>
                  <Text style={styles.textStyle}>GST No. :-</Text>
                  <Text style={styles.textStyle}>1234</Text>
                </View>

                <View style={styles.custDetailContainer}>
                  <Text style={styles.textStyle}>Phone No. :- </Text>
                  <Text style={styles.textStyle}>{formData.phone}</Text>
                </View>

                <View style={styles.custDetailContainer}>
                  <Text style={styles.textStyle}>Invoice No. :- </Text>
                  <Text style={styles.textStyle}>1234</Text>
                </View>

                <View style={styles.custDetailContainer}>
                  <Text style={styles.textStyle}>Date :- </Text>
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
                    <Text style={{fontSize:20}}>Payment Through</Text>
                  </View>
                <View style={{
                    flexDirection:"row",
                    // backgroundColor:"lightgreen",
                    justifyContent:"space-around"
                    }}>

                  
                  <View style={{alignItems:"center"}}>
                    <View style={{ 
                        borderWidth: 2 , 
                        borderRadius:50,
                        }}>
                      <IconButton
                        style={{ margin: 5}}
                        icon="qrcode-scan"
                        iconColor="grey"
                        size={60}
                        onPress={() => buttonPressed("scanner")}
                      />
                    </View>

                    <Text style={{fontSize:18}}>Scanner</Text>
                  </View>

                  <View style={{alignItems:"center"}}>
                  <View style={{
                    // backgroundColor:"grey",
                    justifyContent:"center",
                    alignItems:"center",
                    borderWidth:2,
                    borderRadius:50
                  }}>
                     <FontAwesome name="rupee" size={50} color="grey"
                     style={{ marginHorizontal:30, marginVertical:18}}
                     onPress={() => buttonPressed("cash") }/>
                  </View>

                    <Text style={{fontSize:18}}>Cash</Text>
                  </View>

                  <View style={{alignItems:"center"}}>
                  <View style={{ borderWidth: 2 , borderRadius:50}}>
                      <IconButton
                        style={{ margin: 5}}
                        icon="credit-card"
                        iconColor="grey"
                        size={60}
                        onPress={() => buttonPressed("card")}
                      />
                    </View>

                    <Text style={{fontSize:18}}>Card</Text>
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
                    onPress={() => {
                      setChecked(!checked);
                    }}
                  />
                  <Text>Pay Later</Text>
                </View>

                <View style={styles.confirmAndPayBtnContainer}>
                  <PaperProvider>
                    <Button mode="contained" onPress={showModal}>
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
    // backgroundColor: "lightgreen",
  },
  cardContent: {
    // backgroundColor:"orange"
  },
  scrollView: {
    marginTop: 4,
    flex: 1,
    marginHorizontal: 15,
    // backgroundColor: "lightblue",
  },
  custDetailContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textStyle: {
    fontSize: 18,
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
    backgroundColor: "lightgreen",
    borderRadius: 20,
  },
  containerStyle: {
    backgroundColor: "white",
    padding: 20,
    gap:10,
    marginHorizontal: 10,
  },
});
