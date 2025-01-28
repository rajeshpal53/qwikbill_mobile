import { Text, View, StyleSheet, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { FAB, Searchbar } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import CustomerDetailsCard from "../../Component/Cards/CustomerDetailsCard";
import Searchbarwithmic from "../../Component/Searchbarwithmic";
import EditCustomerDetailsModal from "../../Modal/EditCustomerDetailsModal";

const customerdetails = [
  {
    id: 1,
    Name: "Akash",
    Number: "7089755870",
    Img: require("../../../assets/noDataFound1.png"),
    Address: "Housing Board",
    email: "test@gmail.com",
  },
  {
    id: 2,
    Name: "Deepak",
    Number: "7089755870",
    Img: "null",
    Address: "Housing Board",
    email: "test@gmail.com",
  },
  {
    id: 3,
    Name: "Yogesh",
    Number: "7089755870",
    Img: "null",
    Address: "Housing Board",
    email: "test@gmail.com",
  },
  {
    id: 4,
    Name: "Faizan",
    Number: "7089755870",
    Img: "null",
    Address: "Housing Board",
    email: "test@gmail.com",
  },
  {
    id: 5,
    Name: "Prathamesh",
    Number: "7089755870",
    Img: "null",
    Address: "Housing Board",
    email: "test@gmail.com",
  },
];

const CustomerDetail = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchmodal, setsearchmodal] = useState(false); // State for modal visibility
  const [transcript, setTranscript] = useState(""); // State for transcript
  const [SelectedEditItem, setSelectedEditItem] = useState(null);
  const [editmodal, seteditmodal] = useState(false);

  const filteredData = customerdetails.filter((item) =>
    item.Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openEditModal = (item) => {
    setSelectedEditItem(item); // Set selected offer
  };

  useEffect(() => {
    if (SelectedEditItem) {
      seteditmodal(true);
    }
  }, [SelectedEditItem]);

  return (
    <View style={{ flex: 1 }}>
      <Searchbarwithmic
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setsearchmodal={setsearchmodal}
        setTranscript={setTranscript}
        placeholderText="Search User by name ..."
        //    refuser={searchBarRef}
      />

      <FlatList
        data={filteredData}
        renderItem={({ item, index }) => (
          <CustomerDetailsCard
            item={item}
            index={index}
            navigation={navigation}
            onEdit={() => openEditModal(item)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      <FAB
        icon={() => <Icon name="add" size={25} color="#fff" />}
        style={styles.fab}
        onPress={() => console.log("FAB pressed")}
      />

      {editmodal && (
        <EditCustomerDetailsModal
          visible={editmodal}
          seteditmodal={seteditmodal}
          SelectedEditItem={SelectedEditItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 25,
    bottom: 25,
    backgroundColor: "#0c3b73",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CustomerDetail;
