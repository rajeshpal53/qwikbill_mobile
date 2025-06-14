import { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { fontFamily, fontSize } from "../Util/UtilApi";
import { Avatar } from "react-native-paper";
import { debounce } from "lodash";
import { API_BASE_URL, NORM_URL } from "../Util/UtilApi";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from "@expo/vector-icons"; // for icons
// import EditCustomerDetailsModal from "../Modal/EditCustomerDetailsModal";
// import EditCustomerDetailsModal from "../../Modal/EditCustomerDetailsModal";

const CustomerDetails = ({ route, navigation }) => {
  const { item, setCustomerData } = route.params; // Destructure both item and onEdit from route.params
  console.log("Items value", item);
  const [profileUrl, setProfileUrl] = useState("");
  const [fallbackText, setFallbackText] = useState("U");
  //   const [SelectedEditItem, setSelectedEditItem] = useState(null);
  //   const [editmodal, seteditmodal] = useState(false);

  // Function for handling Edit button press
  //   const handleEdit = () => {
  //     setSelectedEditItem(item);
  //     seteditmodal(true);
  //   };

  //   // Function for handling Delete button press
  //   const handleDelete = () => {
  //     // Logic to handle deletion goes here
  //     console.log("Customer deleted", item.id);
  //   };


  useEffect(() => {
    const setUrl = () => {
      if (item?.user?.profilePicurl) {
        const tempUrl = `${NORM_URL}/${item?.user?.profilePicurl}`;
        updateImageUrl(tempUrl);
      } else {
        const singleLetterText = getFallbackText();
        setFallbackText(singleLetterText);
      }
    };

    setUrl();
  }, []);

  const updateImageUrl = debounce((profilePicurl) => {
    setProfileUrl(`${profilePicurl}?${new Date().getTime()}`);
  }, 100);

  const getFallbackText = () => {
    let singleLetterText = "E";
    if (item?.user?.name) {
      singleLetterText = item.user.name.charAt(0).toUpperCase();
    }
    return singleLetterText;
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        {/* Title */}
        <Text style={styles.title}>{item?.user?.name ?? "Unknown"}</Text>

        {/* Profile Picture */}
        {/* <View style={styles.profileContainer}>
          <Image
            source={{ uri: item?.user?.profilePicurl }}
            style={styles.profilePic}
          />
        </View> */}
        <View style={styles.profileContainer}>
          {console.log(profileUrl, "profilePicUrl")}
          {item?.user?.profilePicurl && item?.user?.profilePicurl !== "" ? (
            <Avatar.Image
              size={100}
              // source={require("../../../assets/Mens-haircut.png")}
              source={{
                uri: profileUrl || `${NORM_URL}/assets/mobile/male.png`,
              }}
            />
          ) : (
            <>
              {/* {console.log("fallback is the , ", getFallbackText())} */}
              <Avatar.Text size={100} label={fallbackText || "U"} />
            </>
          )}
        </View>

        {/* Name */}
        <View style={styles.detailRow}>
          <Text style={styles.label}>Name :</Text>
          <Text style={styles.value}>{item?.user?.name ?? "Unknown"}</Text>
        </View>

        {/* Phone */}
        <View style={styles.detailRow}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{item?.user?.mobile ?? "N/A"}</Text>
        </View>

        {/* Email */}
        <View style={styles.detailRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{item?.user?.email ?? "N/A"}</Text>
        </View>

        {/* Address */}
        <View style={styles.detailRow}>
          <Text style={styles.label}>Address:</Text>
          <Text style={[styles.value, { flex: 1, textAlign: "right" }]} numberOfLines={2} ellipsizeMode="tail">
            {item?.user?.address ?? "Not Provided"}
          </Text>
        </View>

        {/* Action Buttons */}
        {/* <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <MaterialIcons name="edit" size={24} color="#fff" />
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <MaterialIcons name="delete" size={24} color="#fff" />
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View> */}
      </View>
      {/* {editmodal && (
        <EditCustomerDetailsModal
          visible={editmodal}
          seteditmodal={seteditmodal}
          SelectedEditItem={SelectedEditItem}
          setCustomerData={setCustomerData}
        />
      )} */}
      <View style={styles.container4}>
        <View style={styles.container2}>
          <View style={styles.totalOrder}>
            <Ionicons name="cart" size={24} color="#00008b" />
            <Text >Total Order</Text>
            <Text style={styles.amount}>1</Text>
          </View>
          <View style={styles.totalPurchase}>
            <Ionicons name="stats-chart" size={24} color="#00008b" />
            <Text>Total Purchase</Text>
            <Text style={styles.amount}>₹150</Text>
          </View>
        </View>
        <View style={styles.container3}>
          <View style={styles.remainingAmount}>
            <FontAwesome name="calendar" size={24} color="#00008b" />
            <Text>Remaining Amount</Text>
            <Text style={styles.amount}>₹0</Text>
          </View>
          <View style={styles.paidAmount}>
            <Ionicons name="checkmark-circle" size={24} color="#00008b" />
            <Text>Paid Amount</Text>
            <Text style={styles.amount}>₹150</Text>
          </View>
       {/*} </View>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
      <View style={styles.orderItem}>
        <View style={styles.orderRow}>
          <Text style={styles.orderLabel}>Order ID:</Text>
          <Text style={styles.orderValue}>Enterprises07052025P2</Text>
        </View>
        <View style={styles.orderRow}>
          <Text style={styles.orderLabel}>Order Date:</Text>
          <Text style={styles.orderValue}>2025-05-07</Text>
        </View>
        <View style={styles.orderRow}>
          <Text style={styles.orderLabel}>Amount:</Text>
          <Text style={styles.orderValue}>₹150</Text>
        </View>
        <View style={styles.orderRow}>
          <Text style={styles.orderLabel}>Payment Mode:</Text>
          <Text style={styles.orderValue}>COD</Text>
        </View>
        <TouchableOpacity style={styles.detailsButton}>
          <Text style={styles.detailsText}>View all invoices</Text>
        </TouchableOpacity>*/}
      </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    padding: 20,
    backgroundColor: "",
    margin:6,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    elevation: 8, // Android shadow
    shadowColor: "#aaa", // iOS shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  title: {
    fontSize: fontSize.headingSmall,
    fontFamily: fontFamily.medium,
    textAlign: "center",
    marginBottom: 18,
    color: "#2a2a2a",
    borderBottomWidth: 2,
    borderBottomColor: "#ddd",
    paddingBottom: 12,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#ddd",
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    fontSize: fontSize.labelLarge,
    fontFamily: fontFamily.medium,
    color: "#777",
    fontWeight: "600",
  },
  value: {
    fontSize: fontSize.labelLarge,
    fontFamily: fontFamily.medium,
    color: "#333",
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E88E5",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 5,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E53935",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontFamily: fontFamily.medium,
    fontSize: fontSize.labelLarge,
    marginLeft: 8,
  },
  container4:{
    alignItems:"center",
    flex:10,
    paddingTop:20,
  
  },
  container2: {
    gap: 10,
    flexDirection: "row",
    marginBottom: 20,
    paddingRight: 104,
    paddingLeft:62,
  },
  totalOrder: {
   width: "100%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    elevation: 8, // Android shadow
    shadowColor: "#aaa", // iOS shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    marginLeft:40,
     alignItems:"center",
  },
  totalPurchase: {
       width: "100%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    elevation: 8, // Android shadow
    shadowColor: "#aaa", // iOS shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
     alignItems:"center",
  },
  container3: {
    gap: 10,
    flexDirection: "row",
    marginBottom: 20,
    paddingRight: 104,
    paddingLeft:62,
  },
  remainingAmount: {
   width: "100%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 10,
    elevation: 8, // Android shadow
    shadowColor: "#aaa", // iOS shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    marginLeft:40,
   alignItems:"center",
   paddingTop:"20",
   
  },
  paidAmount: {
       width: "100%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    elevation: 8, // Android shadow
    shadowColor: "#aaa", // iOS shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
     alignItems:"center",
  },
    amount: { 
      fontSize: 16,
       fontWeight: 'bold',
        marginTop: 4 ,
      },
  sectionTitle: {
     marginLeft: 0,
      marginTop: 0, 
      fontSize: 22, 
      fontWeight: 'bold' },
  orderItem: {
        width: "100%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    elevation: 8, // Android shadow
    shadowColor: "#aaa", // iOS shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    margin:16,
    marginBottom:50,
    
  },
  orderRow: {
     flexDirection: 'row',
      justifyContent: 'space-between',
       marginVertical: 10 ,
      },
  orderLabel: {
     fontWeight: '600' ,
    },
  orderValue: { 
    fontWeight: '400' },
  detailsButton: { marginTop: 10,
     alignSelf: 'flex-end' ,
    },
  detailsText: { 
    color: '#2980b9', 
    fontWeight: 'bold' ,
  },
});

export default CustomerDetails;
