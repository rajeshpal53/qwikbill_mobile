import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { deleteApi, readApi } from "../../../Util/UtilApi";
import UserDataContext from "../../../Store/UserDataContext";
import { useSnackbar } from "../../../Store/SnackbarContext";
//import NoDataFound from "../../../../ComponentContainer/NoDataFound";
import { ActivityIndicator } from "react-native-paper";
import QueryCard from "./QueryCard";
import { RefreshControl } from "react-native-gesture-handler";
import ConfirmModal from "../../../Modal/ConfirmModal";
import ViewQueryDetailModal from "./viewQueryDetailModal";

const ResolvedQueries = () => {
  const [resolvedQueries, setResolvedQueries] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const PAGE_SIZE = 10;
  const [refreshPage, setRefreshPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { userData } = useContext(UserDataContext);
  const { showSnackbar } = useSnackbar();
  const [pullRefreshing, setPullRefreshing] = useState(false);
  const [queryToDelete, setQueryToDelete] = useState(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
   const [queryDetailModalVisible, setQueryDetailModalVisible] = useState(false);
   const [viewDetailsItem, setViewDetailsItem] = useState(null);

  useEffect(() => {
    fetchData(page);
  }, [page, refreshPage]);

  const fetchData = async (pageNum) => {
    const url = `feedback/getAllResolvedByPagination?page=${pageNum}&limit=10`;

    try {
      setIsLoading(true);

      const response = await readApi(url, {
        Authorization: `Bearer ${userData?.token}`,
      });

      console.log("response of getting resolved feedBack is , ", response);

      if (page == 1) {
        setResolvedQueries(response?.data);
      } else if (response?.data?.length > 0) {
        setResolvedQueries((prev) => [...prev, ...response?.data]);
      }

      if (response?.data?.length == 0) {
        setHasMorePages(false);
      }
    } catch (error) {
      console.error(" error getting feedBackData is , ", error);
      showSnackbar("No Resolved Queries Found", "error");
      setResolvedQueries([]);
      setHasMorePages(false);
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

  const toggleQueryDetailModal = () => {
    setQueryDetailModalVisible((prev) => !prev);
  }

  const onRefresh = () => {
    setPage(1);
    setHasMorePages(true);
    setRefreshPage((prev) => !prev);
    setPullRefreshing(true);
  };

  const handleDeleteQuery = async () => {

    try {
      
      const response = await deleteApi(`feedback/deleteFeedback/${queryToDelete?.id}`, 
        {
          Authorization : `Bearer ${userData?.token}`
        }
      );

      setPage(1);
      setHasMorePages(true);
      setRefreshPage((prev) => !prev);
      setConfirmModalVisible(false)
      showSnackbar("Query Deleted Successfully", "success");
      
    } catch (error) {
      showSnackbar("Something went wrong", "error");
      console.log("error deleting query",error);
    }
  };

  return (
    <View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
      <FlatList
        data={resolvedQueries}
        renderItem={({ item, index }) => (
          <View style={{ marginVertical: 10 }}>
            {/* <Text>{item?.description}</Text> */}
            <QueryCard
              item={item}
              setQueryToAct={setQueryToDelete}
              setConfirmModalVisible={setConfirmModalVisible}
              setItem={setViewDetailsItem}
              toggleModal={toggleQueryDetailModal}
            />
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={pullRefreshing}
            onRefresh={onRefresh}
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

      {confirmModalVisible && (
        <ConfirmModal
          visible={confirmModalVisible}
          message={"Are you sure you want to delete this query?"}
          heading={"Confirmation Message"}
          setVisible={setConfirmModalVisible}
          handlePress={handleDeleteQuery}
          buttonTitle={"Delete"}
        />
      )}

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

export default ResolvedQueries;

const styles = StyleSheet.create({});
