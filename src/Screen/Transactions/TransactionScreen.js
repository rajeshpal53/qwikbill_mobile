// import React, { useState,useEffect, useContext} from 'react'
// import { View,FlatList} from 'react-native'
// import { Text,ActivityIndicator} from 'react-native-paper'
// import { readApi } from '../../Util/UtilApi';
// import { ShopContext } from '../../Store/ShopContext'
// import TransactionCard from '../../Component/TransactionCard';
// function TransactionScreen() {
//     const [transactions,setTransactions]=useState([]);
//     const {selectedShop}=useContext(ShopContext)
//     const [page, setPage] = useState(1);
//     const [hasMore, setHasMore] = useState(true);
//     const [isLoading,setIsLoading]=useState(false);



//     useEffect(()=>{
//         fetchTransactions();
//     },[])
//     const fetchTransactions=async()=>{
//         try{
//             setIsLoading(true)
//             const response= await readApi(`transaction/getTransactionsByVendorfk/${selectedShop?.id}`)
//             console.log(response,"transaction")
//             if(page==1){
//                 setTransactions(response.transactions)
//               }

//             if(response?.Transactions?.length>0){
//                 setTransactions((prevData) => [...prevData, ...response.invoices]);

//               }
//               else {
//                 setHasMore(false);
//               }

//         }catch(error){
//             if (page===1){
//                 setInvoices([])
//               }

//         }finally{
//             setIsLoading(false)
//         }
//     }
//     console.log(transactions,"transaction")
//     const loadMoreData = () => {
//         if (!isLoading && hasMore) {
//           setPage((prevPage) => prevPage + 1); // Increment Page number
//         }
//       };
//       const Loader = () => {
//         if (!isLoading) return null;
//         return (
//           <View style={{ flex: 1, justifyContent: "center" }}>
//             <ActivityIndicator size={"large"}></ActivityIndicator>
//           </View>
//         );
//       };


//   return (
//   <View>
//      <FlatList
//        contentContainerStyle={{ paddingBottom: 140 }} 
//           data={transactions}
//           renderItem={({ item, index }) => 
//           {
//             console.log(item,"item")
//             return(
//               <TransactionCard transaction={item}/>
//               // <Text> {item.id}</Text>
//               )
//           }
//           }
//           // renderItem={renderItem}
//           keyExtractor={(item, index) => `${item.id}-${index}`}
//           // onScrollBeginDrag={handleSearchBar}
//           showsVerticalScrollIndicator={false}
//           onEndReached={loadMoreData}
//           onEndReachedThreshold={0.5}
//           ListFooterComponent={Loader}
//           ListEmptyComponent={
//             // <View style={styles.empty}><Text>No Data Found</Text></View>
//             <View
//               style={{
//                 alignItems: "center",
//                 justifyContent: "center",
//                 marginTop: "40%",
//               }}
//             >
//               <Text> No Data Found </Text>
//             </View>
//           }
//         />

//   </View>
//   )
// }

// export default TransactionScreen









import React, { useState, useEffect, useContext } from 'react'
import { View, FlatList } from 'react-native'
import { Text, ActivityIndicator } from 'react-native-paper'
import { readApi } from '../../Util/UtilApi';
import { ShopContext } from '../../Store/ShopContext'
import TransactionCard from '../../Component/TransactionCard';
import Searchbarwithmic from '../../Component/Searchbarwithmic';

function TransactionScreen() {
  const [transactions, setTransactions] = useState([]);
  const { selectedShop } = useContext(ShopContext)
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchmodal, setsearchmodal] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error , setError]  =useState(null)


  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        
        // Fetch data from API
        const response = await readApi(`transaction/transactions`);
        console.log("API Response:", response); 
  
        // Ensure response.data is an array before setting state
        if (response && Array.isArray(response)) {
          setTransactions(response); 
          console.log("Transactions updated:", response); 
        } else {
          setError("No transaction data found in response");
          setTransactions([]); // Ensure empty array if data is not found
        }
      } catch (err) {
        console.log("Error fetching transactions:", err);
        setError("Unable to get transactions!");
        setTransactions([]);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchTransactions();
  }, []);

  
  // Log transactions AFTER state update
  useEffect(() => {
    console.log("Updated Transactions:", transactions);
  }, [transactions]);

  {console.log("my transaction history",transactions)}


  const filteredData = transactions
    .map((item) => ({
      ...item,
      name: item.user.name ?? "Unknown", // Replace null or undefined name with "Unknown"
    }))
    .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );




  // const loadMoreData = () => {
  //   if (!isLoading && hasMore) {
  //     setPage((prevPage) => prevPage + 1); // Increment Page number
  //   }
  // };


  const Loader = () => {
    if (!isLoading) return null;
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size={"large"}></ActivityIndicator>
      </View>
    );
  };


  return (
    <View>

      <View style={{ marginTop: 5 }}>
        <Searchbarwithmic
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setsearchmodal={setsearchmodal}
          setTranscript={setTranscript}
          placeholderText="Search Your transactions..."

        />
      </View>

      {/* <FlatList
        contentContainerStyle={{ paddingBottom: 140 }}
        data={transactions}
        renderItem={({ item, index }) => {
          console.log(item, "item")
          return (
            <TransactionCard transaction={item} />

          )
        }
        }
        // renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        // onScrollBeginDrag={handleSearchBar}
        showsVerticalScrollIndicator={false}
        // onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        ListFooterComponent={Loader}
        ListEmptyComponent={
          // <View style={styles.empty}><Text>No Data Found</Text></View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: "40%",
            }}
          >
            <Text> No Data Found </Text>
          </View>
        }
      /> */}


      {isLoading ? (
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
              <TransactionCard
                item={item}
               // navigation={navigation}
                //onEdit={() => openEditModal(item)}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        )}


    </View>
  )
}

export default TransactionScreen
