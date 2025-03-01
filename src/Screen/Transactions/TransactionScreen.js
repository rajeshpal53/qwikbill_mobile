import React, { useState,useEffect, useContext} from 'react'
import { View,FlatList} from 'react-native'
import { Text,ActivityIndicator} from 'react-native-paper'
import { readApi } from '../../Util/UtilApi';
import { ShopContext } from '../../Store/ShopContext'
import TransactionCard from '../../Component/TransactionCard';
function TransactionScreen() {
    const [transactions,setTransactions]=useState([]);
    const {selectedShop}=useContext(ShopContext)
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading,setIsLoading]=useState(false);
    

    
    useEffect(()=>{
        fetchTransactions();
    },[])
    const fetchTransactions=async()=>{
        try{
            setIsLoading(true)
            const response= await readApi(`transaction/getTransactionsByVendorfk/${selectedShop?.id}`)
            console.log(response,"transaction")
            if(page==1){
                setTransactions(response.transactions)
              }

            if(response?.Transactions?.length>0){
                setTransactions((prevData) => [...prevData, ...response.invoices]);

              }
              else {
                setHasMore(false);
              }
        
        }catch(error){
            if (page===1){
                setInvoices([])
              }
           
        }finally{
            setIsLoading(false)
        }
    }
    console.log(transactions,"transaction")
    const loadMoreData = () => {
        if (!isLoading && hasMore) {
          setPage((prevPage) => prevPage + 1); // Increment Page number
        }
      };
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
     <FlatList
       contentContainerStyle={{ paddingBottom: 140 }} 
          data={transactions}
          renderItem={({ item, index }) => 
          {
            console.log(item,"item")
            return(
              <TransactionCard transaction={item}/>
              // <Text> {item.id}</Text>
              )
          }
          }
          // renderItem={renderItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          // onScrollBeginDrag={handleSearchBar}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMoreData}
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
        />

  </View>
  )
}

export default TransactionScreen
