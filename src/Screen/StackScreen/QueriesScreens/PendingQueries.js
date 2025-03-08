// import React from 'react'
// import { View ,Text} from 'react-native'

// const PendingQueries = ()=> {
//   return (
//     <View>
//         <Text>Pending Queries</Text>
//     </View>
//   )
// }

// export default PendingQueries







import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { API_BASE_URL, readApi, updateApi } from "../../../Util/UtilApi";
import UserDataContext from "../../../Store/UserDataContext";
import { useSnackbar } from "../../../Store/SnackbarContext";
//import NoDataFound from "../../../Components/";
import { ActivityIndicator } from "react-native-paper";  
import QueryCard from "./QueryCard";
import { useIsFocused } from "@react-navigation/native";
import { RefreshControl } from "react-native-gesture-handler";
import ConfirmModal from "../../../Modal/ConfirmModal";
import ViewQueryDetailModal from "./viewQueryDetailModal";

const PendingQueries = () => {
  const [pendingQueries, setPendingQueries] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const PAGE_SIZE = 10;
  const [refreshPage, setRefreshPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { userData } = useContext(UserDataContext);
  const { showSnackbar } = useSnackbar();
  const [pullRefreshing, setPullRefreshing] = useState(false);
  const [resolvedQuery, setResolvedQuery] = useState(null)
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [queryDetailModalVisible, setQueryDetailModalVisible] = useState(false);
  const [viewDetailsItem, setViewDetailsItem] = useState(null);

  useEffect(() => {
    fetchData(page);
  }, [page, refreshPage]);

  // useEffect(() => {
  //   console.log("querymodalVisible is , ", queryDetailModalVisible)
  // }, [queryDetailModalVisible])
 
  const fetchData = async (pageNum) => {
    const url = `feedback/getAllUnResolvedByPagination?page=${pageNum}&limit=10`;

       const api = `${API_BASE_URL}feedback/getAllUnResolvedByPagination?page=${pageNum}&limit=10`

       console.log("api data isss",api)
    try {
      setIsLoading(true);

      const response = await readApi(url, {
        Authorization: `Bearer ${userData?.token}`,
      });

      console.log("response of getting pending feedBack is , ", response);
      if(page == 1){
        setPendingQueries(response?.data);
      }
      else if (response?.data?.length > 0) {  
        setPendingQueries((prev) => [...prev, ...response?.data]); 
      }
      
      if(response?.data?.length == 0){
        setHasMorePages(false);
      }
    } catch (error) {
      console.error(" error getting feedBackData is , ", error);
      showSnackbar("No Resolved Queries Found", "error");
      setPendingQueries([]);
      setHasMorePages(false)
    } finally {
      setIsLoading(false);
      setPullRefreshing(false);
    }
  };

  const loadMoreData = () => {
    if (hasMorePages) {
      setPage((prevPage) => prevPage + 1);
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

  const handleQueryResolved = async () => {

    const payload = {isResolved: true};

    try {
      const response = await updateApi(`feedback/updateFeedback/${resolvedQuery?.id}`, payload, 
        {
          Authorization: `Bearer ${userData?.token}`,
        }
      );

      console.log("response of updating query is , ", response);
      setPage(1);
      setHasMorePages(true);
      setRefreshPage((prev) => !prev);
      setConfirmModalVisible(false);
      showSnackbar("Query Resolved Successfully", "success");
      

    } catch (error) {
      showSnackbar("Something went wrong", "error");
      console.log("error updating query",error);
    }finally{

    }
  }

  const toggleQueryDetailModal = () => {
    setQueryDetailModalVisible((prev) => !prev);
  }
  const onRefresh = () => {
    setPage(1);
    setHasMorePages(true);
    setRefreshPage((prev) => !prev);
    setPullRefreshing(true);
  }

  return (
    <View style={{paddingHorizontal:15, paddingVertical:10}}>
      <FlatList
        data={pendingQueries}
        renderItem={({ item, index }) => (
          <View style={{marginVertical:10}}>
            <QueryCard 
             item={item}
             setQueryToAct={setResolvedQuery}
             setConfirmModalVisible={setConfirmModalVisible}
             setItem = {setViewDetailsItem}
             toggleModal = {toggleQueryDetailModal}
             />
             
          </View>
        )}
        refreshControl={
          <RefreshControl 
          refreshing={pullRefreshing}
          onRefresh = {onRefresh}
          colors={["#0a6846"]}
          progressBackgroundColor={"#fff"}
          />
        }
        keyExtractor={(item, index) => index}
        showsVerticalScrollIndicator={false}
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.5}
          ListFooterComponent={Loader}
        ListEmptyComponent={
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: "40%",
            }}
          >
            {/* <NoDataFound textString={"No Queries Found"} /> */}
          </View>
        }
      />

      {confirmModalVisible && 
      <ConfirmModal 
      visible={confirmModalVisible}
      message={"Are you sure you want to mark this query as resolved?"}
      heading={"Confirmation Message"}
      setVisible={setConfirmModalVisible}
      handlePress={handleQueryResolved}
      buttonTitle={"Resolved"}
      />}

        {queryDetailModalVisible && 
        <ViewQueryDetailModal 
        item = {viewDetailsItem}
        queryDetailModalVisible={queryDetailModalVisible}
        toggleModal = {toggleQueryDetailModal}
        />
        }

    </View>
  );
};

export default PendingQueries;

const styles = StyleSheet.create({});
