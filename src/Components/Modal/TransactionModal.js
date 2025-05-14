
// import React, { useState,useContext } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Modal,
//   Alert,
// } from "react-native";
// import { createApi } from "../Util/UtilApi";
// import UserDataContext from "../Store/UserDataContext";
// import { useSnackbar } from "../Store/SnackbarContext";

// const TransactionModal = ({ visible, onClose,invoices }) => {
//   const [amount, setAmount] = useState("");
//   const totalBill = 2450; // Example total amount
//   const paidAmount = 1200;
// const {userData}= useContext(UserDataContext)
// const{showSnackbar}=useSnackbar()
//   const handleSave =async () => {
//     try{
//         const enteredAmount = parseFloat(amount);
//     if (isNaN(enteredAmount) || enteredAmount <= 0) {
//       Alert.alert("Invalid Input", "Please enter a valid amount.");
//     } else if (enteredAmount > invoices?.finaltotal) {
//       Alert.alert("Error", "Amount cannot be greater than the total bill.");
//     } else {
//         const payload={vendorfk:invoices?.vendorfk ,
//             invoicefk:invoices?.invoicefk ,
//             userfk: invoices?.userfk,
//             amount: amount}
//             console.log(payload)
//         const response =await createApi("transaction/transactions",payload, {
//                 Authorization: `Bearer ${userData.token}`,
//               })
//               console.log(response,"of Transaction")
//               showSnackbar("transaction create successfully","success")
//     //   Alert.alert("Success", "Transaction saved successfully!");
 
//     }
//     }catch(err){
//       console.log(err.data.message,"error response")
//         showSnackbar(`${err.data.message}`,"error")

//     }finally{
//         onClose();
//     }
    
//   };

//   return (
//     <Modal visible={visible} animationType="slide" transparent>
//       <View style={styles.modalContainer}>
//         <View style={styles.modalContent}>
//           <Text style={styles.header}>New Transaction</Text>

//           {/* Vendor */}
//           <Text style={styles.label}>Vendor</Text>
//           <View style={styles.disabledInput}>
//             <Text>{invoices?.shopname}</Text>
//           </View>

//           {/* Customer Name */}
//           <Text style={styles.label}>Customer Name</Text>
//           <View style={styles.disabledInput}>
//             <Text>{invoices?.userName}</Text>
//           </View>

//           {/* Total Bill */}
//           <Text style={styles.label}>Total Bill</Text>
//           <View style={styles.disabledInput}>
//             <Text>₹{invoices?.finaltotal.toFixed(2)}</Text>
//           </View>

//           {/* Paid Amount */}
//           <Text style={styles.label}>Paid Amount</Text>
//           <View style={styles.disabledInput}>
//             <Text>₹{invoices?.paidAmount.toFixed(2)}</Text>
//           </View>

//           {/* Enter Amount (Only Editable Field) */}
//           <Text style={styles.label}>Enter Amount</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="₹ Enter amount"
//             keyboardType="numeric"
//             value={amount}
//             onChangeText={setAmount}
//           />

//           {/* Buttons */}
//           <View style={styles.buttonContainer}>
//             <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
//               <Text style={styles.cancelText}>Cancel</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
//               <Text style={styles.saveText}>Save</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = {
//   modalContainer: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContent: {
//     width: "90%",
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 20,
//   },
//   header: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: "500",
//     marginTop: 10,
//   },
//   disabledInput: {
//     backgroundColor: "#f3f3f3",
//     padding: 12,
//     borderRadius: 8,
//     marginTop: 4,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#007AFF",
//     padding: 12,
//     borderRadius: 8,
//     marginTop: 4,
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 20,
//   },
//   cancelButton: {
//     backgroundColor: "#E5E5E5",
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//   },
//   cancelText: {
//     fontSize: 16,
//     color: "#000",
//   },
//   saveButton: {
//     backgroundColor: "#007AFF",
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//   },
//   saveText: {
//     fontSize: 16,
//     color: "#fff",
//   },
// };

// export default TransactionModal;
import React, { useState,useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { createApi } from "../../Util/UtilApi";
import UserDataContext from "../../Store/UserDataContext";
import { useSnackbar } from "../../Store/SnackbarContext";

const TransactionModal = ({ visible, onClose,invoices }) => {
  const [amount, setAmount] = useState("");
  const totalBill = 2450; // Example total amount
  const paidAmount = 1200;
const {userData}= useContext(UserDataContext)
const{showSnackbar}=useSnackbar()
  const handleSave =async () => {
    try{
        const enteredAmount = parseFloat(amount);
    if (isNaN(enteredAmount) || enteredAmount <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid amount.");
    } else if (enteredAmount > invoices?.finaltotal) {
      Alert.alert("Error", "Amount cannot be greater than the total bill.");
    } else {
        const payload={vendorfk:invoices?.vendorfk ,
            invoicefk:invoices?.invoicefk ,
            userfk: invoices?.userfk,
            amount: amount}
            console.log(payload)
        const response =await createApi("transaction/transactions",payload, {
                Authorization: `Bearer ${userData.token}`,
              })
              console.log(response,"of Transaction")
              showSnackbar("transaction create successfully","success")
    //   Alert.alert("Success", "Transaction saved successfully!");

    }
    }catch(err){
      console.log(err.data.message,"error response")
        showSnackbar(`${err.data.message}`,"error")

    }finally{
        onClose();
    }

  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.header}>New Transaction</Text>

          {/* Vendor */}
          <Text style={styles.label}>Vendor</Text>
          <View style={styles.disabledInput}>
            <Text>{invoices?.shopname}</Text>
          </View>

          {/* Customer Name */}
          <Text style={styles.label}>Customer Name</Text>
          <View style={styles.disabledInput}>
            <Text>{invoices?.userName}</Text>
          </View>

          {/* Total Bill */}
          <Text style={styles.label}>Total Bill</Text>
          <View style={styles.disabledInput}>
            <Text>₹{invoices?.finaltotal.toFixed(2)}</Text>
          </View>

          {/* Paid Amount */}
          <Text style={styles.label}>Paid Amount</Text>
          <View style={styles.disabledInput}>
            <Text>₹{invoices?.paidAmount.toFixed(2)}</Text>
          </View>

          {/* Enter Amount (Only Editable Field) */}
          <Text style={styles.label}>Enter Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="₹ Enter amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />


          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 10,
  },
  disabledInput: {
    backgroundColor: "#f3f3f3",
    padding: 12,
    borderRadius: 8,
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#E5E5E5",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelText: {
    fontSize: 16,
    color: "#000",
  },
  saveButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveText: {
    fontSize: 16,
    color: "#fff",
  },
};

export default TransactionModal;

