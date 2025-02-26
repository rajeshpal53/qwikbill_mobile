import React, { useEffect,useContext,useState, useRef } from 'react'
import { View,Text,FlatList } from 'react-native'
import { readApi } from '../../Util/UtilApi'
import { ShopContext } from '../../Store/ShopContext'
import { ActivityIndicator,FAB } from 'react-native-paper'
import ViewInvoiceCard from '../../Components/ViewInvoiceCard'
import Searchbarwithmic from '../../Component/Searchbarwithmic'
import OpenmiqModal from '../../Modal/Openmicmodal'
import FilterButtons from '../../Components/FilterButtons'
import FilterModal from '../../Components/Modal/FilterModal'
function ViewInvoiceScreen1({navigation}) {
  const [invoices,setInvoices]=useState([])
  const [page, setPage] = useState(1);
  const {allShops,selectedShop} = useContext(ShopContext);
  const [isLoading,setIsLoading]=useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery,setSearchQuery]=useState("")
  const [searchModal,setSearchmodal]=useState(false)
  const searchBarRef = useRef();
  const [transcript, setTranscript] = useState(""); 
  const [isModalVisible,setModalVisible]=useState(false)
  useEffect(()=>{
    fetchInvoices(page)
    console.log(selectedShop,"selectedShop")
  },[page])
  const fetchInvoices=async(pageNum)=>{
    try{
      setIsLoading(true)
      const response= await readApi(`invoice/getInvoices?vendorfk=${selectedShop?.id}&page=${pageNum}&size=10`)
    // console.log(JSON.stringify(response))
    if (response?.invoices?.length > 0) {
      setInvoices((prevData) => [...prevData, ...response.invoices]);
    } else {
      setHasMore(false);
    }
    }catch(err){

    }
    finally{
      setIsLoading(false);
    }
    
  }
  const loadMoreData = () => {
    if (!isLoading && hasMore) {
      setPage((prevPage) => prevPage + 1); // Increment Page number
    }
  };
  const fetchSearchedData= async()=>{

  }
  const Loader = () => {
    if (!isLoading) return null;
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size={"large"}></ActivityIndicator>
      </View>
    );
  };
  return (
  <View style={{backgroundColor:"#fff"}}>
    <View style={{marginTop:8}}>
     
    <Searchbarwithmic
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setsearchmodal={setSearchmodal}
        setTranscript={setTranscript}
        placeholderText="Search Invoices..."
        refuser={searchBarRef}
        searchData={fetchSearchedData}
    />
     <FilterButtons/>

    </View>
<FlatList
       contentContainerStyle={{ paddingBottom: 140 }} 
          data={invoices}
          renderItem={({ item, index }) => (
            <View>
              <ViewInvoiceCard  invoice={item} navigation={navigation}/>
            </View>
          )}
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
        
      <FAB
        style={{  position: "absolute",
          margin: 16,
          right: 5,
          bottom: 120,
          backgroundColor: "#26a0df",}}
        icon="filter" // Plus icon for FAB
        onPress={() => {
          setModalVisible(true)
        }}
        color="#fff"
      />
     {searchModal && (
        <OpenmiqModal
          modalVisible={searchModal}
          setModalVisible={setSearchmodal}
          transcript={transcript}
        />
      )}
      {
      isModalVisible&&(
        <FilterModal
        setModalVisible={setModalVisible}
        isModalVisible={isModalVisible}
        />    
      )
      }
  </View>
  )
}

export default ViewInvoiceScreen1
