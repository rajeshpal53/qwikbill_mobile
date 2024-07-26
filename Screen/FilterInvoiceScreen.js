import React, { useState, useContext, useRef } from "react";
import { Picker } from "@react-native-picker/picker";
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    TouchableWithoutFeedback, 
    Keyboard } from "react-native";
import { Button, RadioButton, Card, TextInput } from "react-native-paper";
import { AuthContext } from "../Store/AuthContext";
import { Entypo } from "@expo/vector-icons";

export default function FilterInvoiceScreen() {
  const [activeTab, setActiveTab] = useState("dateRange");
  const [selectedOption, setSelectedOption] = useState("lastOneMonth");
  const [numberOfInvoices, setNumberOfInvoices] = useState(0);
  const { selectedShop, setSelectedShop } = useContext(AuthContext);
  const pickerRef = useRef();
  const inputRef = useRef(null);

  const handlePressOutside = () => {
    // Hide the keyboard and blur the TextInput
    Keyboard.dismiss();
    if (inputRef.current) {
      inputRef.current.blur();
    }
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
             onChangeText={value => setNumberOfInvoices(value)}
             />
          </Card.Content>
        </Card>
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
    <View style={styles.container}>
      <View style={styles.logoPickerContainer}>
        <Entypo name="shop" size={30} color="#0c3b73" />
        <View style={styles.pickerContainer}>
          <Picker
            ref={pickerRef}
            selectedValue={selectedShop}
            onValueChange={(itemValue, itemIndex) => setSelectedShop(itemValue)}
          >
            <Picker.Item
              label="Kunal Electrical Shop"
              value="Kunal Electrical Shop"
            />
            <Picker.Item label="Kunal Dairy" value="Kunal Dairy" />
            <Picker.Item label="Kunal Kirana Shop" value="Kunal Kirana Shop" />
          </Picker>
        </View>
      </View>
      <View style={styles.tabContainer}>
        <Button
          mode={activeTab === "dateRange" ? "contained" : "outlined"}
          onPress={() => setActiveTab("dateRange")}
        >
          Date Range
        </Button>
        <Button
          mode={activeTab === "number" ? "contained" : "outlined"}
          onPress={() => setActiveTab("number")}
        >
          Number
        </Button>
      </View>
      {renderContent()}
      <View style={styles.buttonContainer}>
        <Button mode="outlined">View</Button>
        <Button mode="outlined">Download</Button>
      </View>
    </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
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
    borderWidth: 1,
    borderColor: "#0c3b73",
    borderRadius: 10,
    // backgroundColor: "#0c3b73",
    // backgroundColor:"orange",
    width: "90%",
    // height:"50%",
    paddingHorizontal: 10,
  },
  logoPickerContainer: {
    flexDirection: "row",
    // backgroundColor:"orange",
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 16,
  },
  row: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginVertical: 8,
  },
  label: {
    marginRight: 8,
  },
  radioBtnContainer:{
    alignItems:"flex-start",
    paddingLeft:10,
  },
});
