import React, { useState, useContext, useRef, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import { Button, RadioButton, Card, TextInput, Divider } from "react-native-paper";
import { AuthContext } from "../Store/AuthContext";
import { Entypo } from "@expo/vector-icons";
import { readApi } from "../Util/UtilApi";
import { useNavigation } from "@react-navigation/native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import DropDownList from "../UI/DropDownList";
import { ScrollView } from "react-native-gesture-handler";
import ThreeToggleBtns from "../Components/ThreeToggleBtns";

export default function FilterInvoiceScreen() {
  const [activeTab, setActiveTab] = useState("dateRange");
  const [selectedOption, setSelectedOption] = useState("lastOneMonth");
  const [paidUnpaidAll, setpaidUnpaidAll] = useState("all")
  const [filter, setFilter] = useState("all");
  const [url, setUrl] = useState("")


  const [buttonsModes, setButtonsModes] = useState({
    firstButtonMode: true,
    secondButtonMode: false,
    thirdButtonMode: false,

  });

  const toggleButtonsTexts = {
    first: "All",
    second: "Paid",
    third: "Unpaid"
  }

  const [numberOfInvoices, setNumberOfInvoices] = useState(0);
  const [date, setDate] = useState(new Date());
  const [options, setOptions] = useState([]);
  const [selectedShop, setSelectedShop] = useState({ shopName: "", shopId: "" });
  // const { selectedShop, setSelectedShop } = useContext(AuthContext);
  const pickerRef = useRef();
  const inputRef = useRef(null);
  const navigation = useNavigation();
  const flex=true


  useEffect(() => {
    async function fetchOptions() {
      const response = await readApi(`api/shop/list`);
      setOptions(response.result); // Adjust according to your API response
    }
    fetchOptions();
  }, []);


  useEffect(() => {

    function paidUnpaidAllHandler(){

      if(buttonsModes.firstButtonMode){
        setpaidUnpaidAll("all");
      }else if(buttonsModes.secondButtonMode){
        setpaidUnpaidAll("paid");
      }else{
        setpaidUnpaidAll("unpaid")
      }
    }

    paidUnpaidAllHandler()
  }, [buttonsModes]);

  useEffect(() => {

    if(paidUnpaidAll === "paid"){
      setUrl(`api/invoice/filter?filter=paymentStatus&equal=paid&`)
    }
    else if(paidUnpaidAll === "unpaid"){
      setUrl(`api/invoice/filter?filter=paymentStatus&equal=unpaid&`)
    }
    else{
      console.log("p11111")
      setUrl(`api/invoice/list?`)
    }

    if(selectedOption === "dateWise"){

      setUrl(`api/invoice/filter?filter=date&equal=${date.toISOString().split('T')[0]}&`)
    }
  }, [paidUnpaidAll, date, selectedOption])

  useEffect(() => {
    console.log("url is , ", url);
  }, [url])

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

  const handlePressOutside = () => {
    // Hide the keyboard and blur the TextInput
    Keyboard.dismiss();
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const navigationHandler = () => {
    // navigation.navigate("ViewInvoices")

    let data = {};

    if (activeTab === "dateRange") {
      data = {
        filteredBy: "dateRange",
        selectedOption: selectedOption,
        date:date.toString(),
        url,
      };
    } else {
      data = {
        filteredBy: "number",
        numberOfInvoices,
        url,
      };
    }

    navigation.navigate("StackNavigator", {
      screen: "ViewInvoices",
      params: {
        data: data,
      },
    });
  };

  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange: (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
      },
      mode: "date",
    });
  };

  const renderContent = () => {
    if (activeTab === "dateRange") {
      return (
        <Card style={styles.card}>
          <Card.Content>

            <RadioButton.Group
              onValueChange={(newValue) => setSelectedOption(newValue)}
              value={selectedOption}
            >
              <View style={styles.radioBtnContainer}>
                <View style={styles.row}>
                  <Text style={styles.label}>Last one month</Text>
                  <RadioButton value="lastOneMonth" />
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Last three months</Text>
                  <RadioButton value="lastThreeMonths" />
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Last six months</Text>
                  <RadioButton value="lastSixMonths" />
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Date wise</Text>
                  <RadioButton value="dateWise" />
                </View>
              </View>

            </RadioButton.Group>

            {selectedOption === "dateWise" && (
              <TouchableOpacity
                onPress={showDatePicker}
                style={styles.datePickerButton}
              >
                <Text style={styles.dateText}>{date.toDateString()}</Text>
              </TouchableOpacity>
            )}
          </Card.Content>
        </Card>
      );
    } else {
      return (
        <Card style={styles.card}>
          <Card.Content>
            {/* <Text style={styles.cardText}>No. of Recent Invoice</Text> */}
            <TextInput
              ref={inputRef}
              label="No. of Recent Invoices"
              keyboardType="numeric"
              value={numberOfInvoices}
              onChangeText={(value) => setNumberOfInvoices(value)}
            />
          </Card.Content>
        </Card>
      );
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      {/* <TouchableWithoutFeedback onPress={handlePressOutside}> */}
        <View style={styles.container}>
          <View style={styles.logoPickerContainer}>
            <Entypo name="shop" size={30} color="#0c3b73" />
            <View style={styles.pickerContainer}>
              <DropDownList options={[]} />
            </View>
          </View>
        </View>

        <ThreeToggleBtns
        buttonsModes={buttonsModes}
        setButtonsModes={setButtonsModes}
        handleButtonPress={handleButtonPress}
        toggleButtonsTexts={toggleButtonsTexts}
        flex={flex}

        />

        <View style={styles.tabContainer}>
          <Button
            mode={activeTab === "dateRange" ? "contained" : ""}
            onPress={() => setActiveTab("dateRange")}
            buttonColor={activeTab === "dateRange" ? "#777" : "#fff"} // Background color
            textColor={activeTab === "dateRange" ? "#ffffff" : "#26a0df"}  // Text color
          >
            Date Range
          </Button>
          <Button
            mode={activeTab === "number" ? "contained" : ""}
            onPress={() => setActiveTab("number")}
            buttonColor={activeTab === "number" ? "#777" : "#fff"} // Background color
            textColor={activeTab === "number" ? "#ffffff" : "#26a0df"}  // Text color
          >
            Number
          </Button>
        </View>
        {renderContent()}
        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            //  onPress={fetchDataHandler}
            onPress={navigationHandler}
          >
            View
          </Button>
          <Button mode="outlined">Download</Button>
        </View>
    {/* </TouchableWithoutFeedback> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView:{
    flex:1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pickerContainer: {
    borderColor: "#0c3b73",
    borderRadius: 10,
    width: "90%",
  },
  logoPickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  icon: {
    padding: 8,
  },
  shopInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 16,
  },
  card: {
    marginVertical: 16,
  },
  cardText: {
    fontSize: 18,
    textAlign: "center",
  },
  paidUnpaidBtnContainer:{
    // backgroundColor:"orange",
    flexDirection:"row",
    justifyContent:"center"
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 16,

  },
  row: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginVertical: 8,
    // backgroundColor:"purple"
  },
  label: {
    marginRight: 8,
  },
  radioBtnContainer: {
    alignItems: "flex-start",
    paddingLeft: 10,
  },
  datePickerButton: {
    marginTop: 16,
    padding: 10,
    // backgroundColor: "#f0f0f0",

    backgroundColor: "#777",
    borderRadius: 5,
  },
  dateText: {
    textAlign: "center",
    fontSize: 16,
    color:"#fff"
  },
});