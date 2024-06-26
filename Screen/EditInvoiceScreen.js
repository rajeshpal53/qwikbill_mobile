import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import AddInvoice from "../Components/AddInvoice";

const getYear = (date) => {
    if (!date) return "";
    const dateObj = new Date(date);
    return dateObj.getFullYear();
  };
  const getNextMonthDate = (date) => {
    if (!date) return "";
    const dateObj = new Date(date);
    const nextMonth = new Date(dateObj.setMonth(dateObj.getMonth() + 1));
    return nextMonth.toISOString().substring(0, 10);
  };

function EditInvoiceScreen({ route,navigation }) {
  const invoiceId = route.params.invoiceId;
  const [initialValues, setInitialValues] = useState({
    date: new Date().toISOString().substring(0, 10),
    client: "",
    phone: "",
    items: [{ quantity: "", price: "", itemName: "" }],
    people:''
  });
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchDataHandler = async () => {
      try {
        const response = await fetch(
          `http://192.168.1.3:8888/api/invoice/read/${invoiceId}`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        const invoiceData = data.result;
        setInitialValues({
          date: new Date(invoiceData.date).toISOString().substring(0, 10) || "",
          client: invoiceData.people.firstname || "",
          phone: invoiceData.people.phone,
          people:invoiceData.people._id,
          items: invoiceData.items.map((item) => (
             {
              itemName: item.itemName,
              quantity: item.quantity,
              price: item.price,
              total: item.total,
            }
          )),
        });
      } catch (Error) {
        throw new Error("Item not found");
      } finally {
        setIsLoading(false);
      }
    }
    fetchDataHandler()
  }, []);
  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }
  const submitHandler= async( values,fetchDataId)=>{
    const postData = {
         ...values,
         client: "666130c9a9c613f884628d76",
         number: parseInt(values.phone),
         taxRate: 0,
         currency: "USD",
         status: "draft",
         year: getYear(values.date),
         expiredDate: getNextMonthDate(values.date),
       };
       delete postData.phone;
       console.log(postData, "------postdata");

       try{
        const response= await fetch(`http://192.168.1.3:8888/api/invoice/update/${invoiceId}`, {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        });     
        if (response.ok) {
          navigation.navigate("Invoice");
        }   
      } 
       catch (error){
        console.error("Failed to update invoice",response);
      }

    }
  return (
    <ScrollView>
      <AddInvoice initialValues={initialValues}navigation={navigation} submitHandler={submitHandler} />
    </ScrollView>
  );
}

export default EditInvoiceScreen;
