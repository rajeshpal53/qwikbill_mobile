import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useDownloadInvoice } from "../Util/DownloadInvoiceHandler";
import { useContext, useState } from "react";
import { API_BASE_URL } from "../Util/UtilApi";
import UserDataContext from "../Store/UserDataContext";
const ShareTransaction = ({id}) => {
  const { colors } = useTheme();
  const {shareInvoicePressHandler}=useDownloadInvoice()
    const [shareLoading,setShareLoading]=useState(false)
    const{userData}=useContext(UserDataContext)
  return (
    <TouchableOpacity
      onPress={ async ()  => {
        console.log("Share clicked");
        try{
         await shareInvoicePressHandler(
                  `${API_BASE_URL}invoice/downloadTransactions/${id}`,
                 id,
                  userData?.token,
                  "Transaction"
                );
              } catch (error) {
                console.log("error in sharing pdf , ", error);
              } finally {
                setShareLoading(false);
              }
      }}
      style={{ marginRight: 16 }}
    >
      <MaterialIcons name="share" size={24} color={colors.text} />
    </TouchableOpacity>
  );
};

export default ShareTransaction;
