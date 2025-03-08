// import { Text, View, StyleSheet, FlatList } from "react-native";
// import React, { useEffect, useState } from "react";
// import { FAB, Searchbar } from "react-native-paper";
// import Icon from "react-native-vector-icons/Ionicons";
// import CustomerDetailsCard from "../../Component/Cards/CustomerDetailsCard";
// import Searchbarwithmic from "../../Component/Searchbarwithmic";
// import EditCustomerDetailsModal from "../../Modal/EditCustomerDetailsModal";
// import { API_BASE_URL, readApi } from "../../Util/UtilApi";
// import axios from "axios";

// const customerdetails = [
//   {
//     id: 1,
//     Name: "Akash",
//     Number: "7089755870",
//     Img: require("../../../assets/noDataFound1.png"),
//     Address: "Housing Board",
//     email: "test@gmail.com",
//   },
//   {
//     id: 2,
//     Name: "Deepak",
//     Number: "7089755870",
//     Img: "null",
//     Address: "Housing Board",
//     email: "test@gmail.com",
//   },
//   {
//     id: 3,
//     Name: "Yogesh",
//     Number: "7089755870",
//     Img: "null",
//     Address: "Housing Board",
//     email: "test@gmail.com",
//   },
//   {
//     id: 4,
//     Name: "Faizan",
//     Number: "7089755870",
//     Img: "null",
//     Address: "Housing Board",
//     email: "test@gmail.com",
//   },
//   {
//     id: 5,
//     Name: "Prathamesh",
//     Number: "7089755870",
//     Img: "null",
//     Address: "Housing Board",
//     email: "test@gmail.com",
//   },
// ];

// const CustomerDetail = ({ navigation }) => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchmodal, setsearchmodal] = useState(false); // State for modal visibility
//   const [transcript, setTranscript] = useState(""); // State for transcript
//   const [SelectedEditItem, setSelectedEditItem] = useState(null);
//   const [editmodal, seteditmodal] = useState(false);
//   const [customerData , setCustomerData]= useState([])
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);


//   const filteredData = customerdetails.filter((item) =>
//     item.Name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const openEditModal = (item) => {
//     setSelectedEditItem(item); // Set selected offer
//   };

//   useEffect(() => {
//     if (SelectedEditItem) {
//       seteditmodal(true);
//     }
//   }, [SelectedEditItem]);


//   useEffect(() => {
//     console.log("Updated customer data:", customerData);
//   }, [customerData]);



//   useEffect(() => {
//     const fetchCustomerData = async () => {
//       try {
//         const url = `${API_BASE_URL}transaction/getAllUsersByVenderfk/22`;
//         console.log("Fetching data from API:", url);

//         const response = await axios.get(url, {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });

//         console.log("API Response:", response.data);

//         if (Array.isArray(response.data)) {
//           setCustomerData(response.data);
//         } else {
//           console.error("Invalid response format:", response.data);
//           setError("Unexpected response format");
//         }
//       } catch (err) {
//         console.error("Error fetching customer data:", err);
//         setError("Failed to fetch data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCustomerData();
//   }, []);


//   return (
//     <View style={{ flex: 1 }}>
//       <Searchbarwithmic
//         searchQuery={searchQuery}
//         setSearchQuery={setSearchQuery}
//         setsearchmodal={setsearchmodal}
//         setTranscript={setTranscript}
//         placeholderText="Search User by name ..."
//       //    refuser={searchBarRef}
//       />

//       <FlatList
//         data={filteredData}
//         renderItem={({ item, index }) => (
//           <CustomerDetailsCard
//             item={item}
//             index={index}
//             navigation={navigation}
//             onEdit={() => openEditModal(item)}
//           />
//         )}
//         keyExtractor={(item) => item.id.toString()}
//       />

//       <FAB
//         icon={() => <Icon name="add" size={25} color="#fff" />}
//         style={styles.fab}
//         onPress={() => console.log("FAB pressed")}
//       />

//       {editmodal && (
//         <EditCustomerDetailsModal
//           visible={editmodal}
//           seteditmodal={seteditmodal}
//           SelectedEditItem={SelectedEditItem}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   fab: {
//     position: "absolute",
//     right: 25,
//     bottom: 25,
//     backgroundColor: "#0c3b73",
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

// export default CustomerDetail;














import { Text, View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { FAB } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import CustomerDetailsCard from "../../Component/Cards/CustomerDetailsCard";
import Searchbarwithmic from "../../Component/Searchbarwithmic";
import EditCustomerDetailsModal from "../../Modal/EditCustomerDetailsModal";
import { API_BASE_URL } from "../../Util/UtilApi";

const CustomerDetail = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchmodal, setsearchmodal] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [SelectedEditItem, setSelectedEditItem] = useState(null);
  const [editmodal, seteditmodal] = useState(false);
  const [customerData, setCustomerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const openEditModal = (item) => {
    setSelectedEditItem(item);
   //  console.log("item for edit modal ", item)

  };


  const filteredData = customerData
    .map((item) => ({
      ...item,
      name: item.name ?? "Unknown", // Replace null or undefined name with "Unknown"
    }))
    .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );


  useEffect(() => {
    if (SelectedEditItem) {
      seteditmodal(true);
    }
  }, [SelectedEditItem]);


  useEffect(() => {
    console.log("Updated customer data:", customerData);
  }, [customerData]);


  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const url = `${API_BASE_URL}transaction/getAllUsersByVenderfk/22`;
        console.log("Fetching data from API:", url);

        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("API Response:", response.data);

        // const profileData = response.data

        // console.log("profile image is ")
        // const profileImage = profileData.users[1].profilePicurl

        // console.log(`${API_BASE_URL}${profileImage}`)

        if (response.data && Array.isArray(response.data.users)) {
          setCustomerData(response.data.users);
        } else {
          console.error("Invalid response format:", response.data);
          setError("Unexpected response format");
        }

      } catch (err) {
        console.error("API Fetch Error:", err.message);
        console.error("Error Response:", err.response?.data);
        console.error("Request Config:", err.config);
        setError("Failed to fetch customer data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();

  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginTop: 5 }}>
        <Searchbarwithmic
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setsearchmodal={setsearchmodal}
          setTranscript={setTranscript}
          placeholderText="Search User by name..."

        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0c3b73" style={{ marginTop: 20 }} />
      ) : error ? (
        <Text style={{ color: "red", textAlign: "center", marginTop: 20 }}>{error}</Text>
      ) : filteredData.length === 0 ? (
        // Show "No data found" message if filteredData is empty
        <Text style={{ textAlign: "center", marginTop: 20, fontSize: 16, color: "#666" }}>
          No data found
        </Text>)
        : (
          <FlatList
            data={filteredData}
            renderItem={({ item }) => (
              <CustomerDetailsCard
                item={item}
                navigation={navigation}
                onEdit={() => openEditModal(item)}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        )}

      {/* <FAB
        icon={() => <Icon name="add" size={25} color="#fff" />}
        style={styles.fab}
        onPress={() => console.log("FAB pressed")}
      /> */}

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
