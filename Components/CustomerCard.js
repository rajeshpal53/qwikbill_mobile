import React, { useState, useContext } from "react";
import { Button, Card, Text } from "react-native-paper";
import { IconButton, Icon, Avatar } from "react-native-paper";
import { StyleSheet, View, FlatList } from "react-native";
import DeleteModal from "../UI/DeleteModal";
import { useSnackbar } from "../Store/SnackbarContext";
import { deleteApi } from "../Util/UtilApi";
export default function CustomerCard({ customer, navigation, setCustomer }) {
  const [visible, setVisible] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const { showSnackbar } = useSnackbar();
  function deleteCustomerDelete(id) {
    setCustomerId(id);
    setVisible(true);
  }

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };
  const handleDelete = async () => {
    const updateCustomer = customer.filter((item) => item._id !== customerId);
    setCustomer(updateCustomer);
    setVisible(false);
    try {
      const response = await deleteApi(`api/people/delete/${customerId}`);

      showSnackbar("item delete successfully", "success");
    } catch (error) {
      showSnackbar("Failed to delete the item", "error");
    }
  };
  function customerDetail(id) {
    navigation.navigate("CustomerDetail", {
      customerId: id,
    });
  }
  function editCustomerhandler(id) {
    navigation.navigate("EditCustomer", {
      customerId: id,
    });
  }

  const renderItem = ({ item }) => {
    const isExpanded = item._id === expandedId;
    return (
      // <TouchableOpacity onPress={() => toggleExpand(item._id)} style={styles.item}>
      <Card
        // key={index}
        style={styles.card}
        onPress={() => {
          // customerDetail(item._id);
          toggleExpand(item._id);
        }}
      >
        {/* <Card.Title title={item.created} titleStyle={styles.cardTitle} /> */}
        <Card.Content style={styles.itemContent}>
           <View style={styles.cardMainContent}>
            {/*<View style={{alignItems:"flex-start"}}>
              <Avatar.Text label={item.firstname.charAt(0)} size={40} />
            <Text
              style={styles.name}
            >{`${item.firstname} ${item.lastname}`}</Text>
            </View> */}
            <Text
              style={styles.name}
            >{`${item.firstname} ${item.lastname}`}</Text>
            <Text style={styles.phone}>{item.phone}</Text>
          </View>

          {isExpanded && (
            <View style={styles.extraInfo}>
              <Text>{item.email}</Text>
              <Text>{item.isClient ? "Client" : "not a Client"}</Text>
              <Text>Address : {item?.address || "NA"}</Text>
              <Text>GST Number : {item?.gstnumber || "NA"}</Text>
            </View>
          )}
        </Card.Content>
        {isExpanded && (
          <Card.Actions>
            <View style={styles.actionBtnContainer}>
              <Button
                style={styles.actionBtns}
                onPress={() => customerDetail(item._id)}
              >
                <Icon source="eye" color="white" size={20} />{" "}
                <Text style={{ color: "white" }}>View</Text>
              </Button>
              <IconButton
                icon="delete"
                iconColor="#0c3b73"
                size={20}
                onPress={() => deleteCustomerDelete(item._id)}
              />
              {visible && (
                <DeleteModal
                  visible={visible}
                  setVisible={setVisible}
                  handleDelete={handleDelete}
                />
              )}
              <Button
                style={styles.actionBtns}
                onPress={() => editCustomerhandler(item._id)}
              >
                <Icon source="pencil" color="white" size={20} /> 
                <Text style={{color:"white"}}>Edit</Text>
              </Button>
            </View>
          </Card.Actions>
        )}
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Peoples List</Text>
      <FlatList
        data={customer}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  cardTitle: {
    color: "gray",
  },
  card: {
    padding: 10,
    marginBottom: 10,
  },
  cardMainContent: {
    // backgroundColor:"orange",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  cardText: {
    marginVertical: 5,
  },
  actionBtnContainer: {
    // backgroundColor: "orange",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
  },
  actionBtns:{ 
    backgroundColor: "#0c3b73", 
    width:100, 
    justifyContent:"center"  
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  item: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  itemContent: {
    flexDirection: "column",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  phone: {
    fontSize: 16,
    color: "#555",
  },
  extraInfo: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
});
