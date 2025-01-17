
import React,{useEffect,useState,useContext}from 'react'
import { View,StyleSheet, SafeAreaView } from 'react-native'
import { Text,ActivityIndicator,FAB} from 'react-native-paper'
import { useIsFocused } from '@react-navigation/native'
import { readApi, deleteApi } from "../../Util/UtilApi";
import { ShopDetailContext } from "../../Store/ShopDetailContext";
import ItemList from '../../Components/Lists/ItemList';
import DeleteModal from "../../UI/DeleteModal";
import { useSnackbar } from '../../Store/SnackbarContext';
import AddClient from './AddClient';
import Icon from "react-native-vector-icons/Ionicons";
export default function ViewClientScreen({navigation}) {
    const [clients,setClients]= useState([])
    const isFocused = useIsFocused();
    const [isLoading,setIsLoading]= useState(false)
    const{shopDetails}=useContext(ShopDetailContext)
    const [deleteId, setDeleteId] = useState();
    const { showSnackbar } = useSnackbar();
  // const [customer, setCustomer] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddClient,setIsAddClient]=useState(false)
    const menuItems = [
        // { title: "View", onPress: (id) => handleView(id) },
        { title: "Edit", onPress: (id) => handleEdit(id) },
        { title: "Delete", onPress: (id) => setModalVisible(id) },
      ]
    useEffect(() => {
        async function fetchData() {
          setIsLoading(true);
          try {
            const response = await readApi(
              `api/client/list?shop=${shopDetails._id}`
            );
            setClients(response.result);
          } catch (error) {
            console.error("error", error);
          } finally {
            setIsLoading(false);
          }
        }
        fetchData();
      }, [isFocused]);
    
      if (isLoading) {
        return <ActivityIndicator size="large" />;
      }
      const renderExpandedContent = (item) => (
        <View style={{
          marginLeft:"14.5%"
        }}>
          <Text>{item.email}</Text>
          <Text>{item.type}</Text>
            
        </View>
      );
      console.log(clients, "client");
      const handleEdit = (id) => {
        setIsAddClient(true)
      };
    
      const handleView = (id) => {
        navigation.navigate("CustomerDetail", { customerId: id });
      };
      const handleDelete = async () => {
        console.log("delte id , ", deleteId);
        const updatedCustomers = clients.filter((item) => item._id !== deleteId);
        
        try {
          const response = await deleteApi(`api/client/delete/${deleteId}`);
          setIsModalVisible(false);
          showSnackbar("People delete successfully", "success");
          setClients(updatedCustomers);
        } catch (error) {
          console.error("Error:", error);
          showSnackbar("Failed to delete the people", "error");
        }
      };
      const setModalVisible = (id) => {

        setDeleteId(id);
        setIsModalVisible(true);
    
      }
  return (
    <View style={{flex:1,paddingBottom:40}}>
  <View style={{flex:1, paddingHorizontal:10}}>
        <ItemList  data={clients}
        titleKey="name"
        subtitleKey="phone"
        menuItems={menuItems}
        onEdit={handleEdit}
        onView={handleView}
        expandedItems={renderExpandedContent}
        onDelete={setModalVisible}
        
        />
        {isModalVisible && (
        <DeleteModal
          visible={isModalVisible}
          setVisible={setIsModalVisible}
          handleDelete={handleDelete}
        />
      )}
      <AddClient
       visible={isAddClient}
       onClose={() => setIsAddClient(false)}
       navigation={navigation}/>
  </View>
  <FAB icon={() => <Icon name="add-outline" size={20} color="white" />}
     theme={{ colors: { primary: '#fff' } }}
        style={styles.fab}
        color="white"
        onPress={()=>setIsAddClient(true)}
        label="Add New Client"
        labelStyle={{color:"#ffffff"}}
       />  
  </View>
  )
}
const styles= StyleSheet.create({
    fab: {
        position: "absolute",
        margin: 13,
        right: 0,
        bottom: 0,
        color: "floralwhite ",
        backgroundColor: "#96214e",
        zIndex:100,
        color:"white"
      },
})

