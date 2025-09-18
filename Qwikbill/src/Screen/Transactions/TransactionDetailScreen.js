import { AntDesign, EvilIcons, Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Avatar, Button, Card } from "react-native-paper";
import { useDownloadInvoice } from "../../Util/DownloadInvoiceHandler";
import { API_BASE_URL, fontFamily, fontSize, readApi,NORM_URL } from "../../Util/UtilApi";


const TransactionDetailScreen = ({ item }) => {
  const route = useRoute();
  const [isLoading, setIsLoading] = useState(false);
  const [shareLoading, setShareLoading] = useState(false)
  const [detailData, setDetailData] = useState([])
  const transaction = route.params;
  const navigation = useNavigation();
  const { createdAt, transactionStatus, id, invoice, vendor, user, amount, invoicefk, name } = route.params.item || null;


  console.log("Invoice Data:", invoice);
  console.log("Vendor Data:", vendor);
  console.log("User Data:", user);
  console.log("invoice fk is ", invoicefk)
  console.log("item form route  is ", route.params.item)

  useEffect(() => {
    const transactionDetails = async () => {
      try {
        setIsLoading(true)
        const response = await readApi(`invoice/invoices/${invoicefk}`)
        console.log("response isss ", response)
        //  console.log(`${API_BASE_URL}invoice/invoices/${invoicefk}`)

        if (response) {
          setDetailData(Array.isArray(response) ? response : [response]);  // Ensure it's always an array

          console.log("Detail Data:", detailData);

          console.log("successful get transaction detail ")
        } else {
          console.log("something went wrong please try again")
          setDetailData([])
        }
      } catch (err) {
        console.log("unable to get data ", err)
        setDetailData([])
      }
      finally {
        setIsLoading(false)
      }
    }

    transactionDetails();

  }, [])


  console.log(route.params.item, "itemmmm")

  const { downloadInvoicePressHandler, shareInvoicePressHandler } = useDownloadInvoice();
  if (!transaction) {
    return <Text style={styles.errorText}>Error: No transaction data provided.</Text>;
  }

  console.log(transaction, "transaction");
  const userName = user?.name || "Unknown ";

  const handleDownload = async () => {
    try {
      setIsLoading(true);

      // const shopName = detailData.length > 0 ? detailData[0]?.vendor?.shopname : "Invoice";

      console.log("invoiceee iss", invoice)
      console.log("invoice id is , ", invoicefk);
      console.log("invoice name is ", name)


      await downloadInvoicePressHandler(
        `${API_BASE_URL}invoice/downloadInvoice/${invoicefk}`,
        `${vendor.shopname}${invoicefk}`||"invoice",
      );

      console.log("url for download invoice", `${API_BASE_URL}invoice/downloadInvoice/${invoicefk}`)
    } catch (error) {
      console.log("error in downloading pdf , ", error);

    } finally {
      setIsLoading(false);
    }
  }

  const shareHandle = async () => {
    try {
      setShareLoading(true)
      await shareInvoicePressHandler(
        `${API_BASE_URL}invoice/downloadInvoice/${invoice?.id}`,
        invoice?.id,
        invoice?.name || "invoice"
      );

    } catch (err) {
      console.log("error in sharing pdf , ", err);
    }
    finally {
      setShareLoading(false)
    }
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#0c3b73"
          style={{ marginTop: 20 }}
        />
      ) : (
        null
      )}
      {detailData && Array.isArray(detailData) && detailData.length > 0 ? (
        detailData.map((item) => (
          <Card key={item.id} style={styles.card}>
            <Text style={styles.amount}>₹{amount}</Text>
            <View style={[styles.statusView, { borderColor: transactionStatus === "complete" ? "green" : "red" }]}>
              {transactionStatus === "complete"
                ? <AntDesign name="checkcircleo" size={16} color="green" style={{ marginRight: 5 }} />
                : <AntDesign name="closecircleo" size={16} color="red" style={{ marginRight: 5 }} />}
              <Text style={[styles.statusText, { color: transactionStatus === "complete" ? "green" : "red" }]}>
                {transactionStatus}
              </Text>
            </View>

            <Text style={styles.date}>{new Date(createdAt)?.toLocaleString()}</Text>

            <View style={[styles.section, { marginBottom: 12, borderRadius: 10, elevation: 3 }]}>
              <View style={styles.row}>
                <View style={styles.preRow}>
                  <FontAwesome name="credit-card" size={16} color="gray" />
                  <Text style={styles.label}>Payment Mode </Text>
                </View>
                <Text style={styles.label}> {item?.paymentMode || "N/A"}</Text>
              </View>
              <View style={styles.row}>
                <View style={styles.preRow}>
                  <FontAwesome name="file" size={16} color="gray" />
                  <Text style={styles.label}>Invoice ID:</Text>

                </View>
                <Text style={styles.label}> {item?.id || "N/A"}</Text>
              </View>
              <View style={styles.row}>
                <View style={styles.preRow}>
                  <FontAwesome name="hashtag" size={16} color="gray" />
                  <Text style={styles.label}>Invoice Number:</Text>
                </View>
                <Text> {item.invoiceNumber || "N/A"}</Text>

              </View>
            </View>

            <View style={[styles.section, { marginBottom: 12, borderRadius: 10, elevation: 3 }]}>
              <View style={styles.userRow}>
                <Avatar.Text size={50} label={userName ? userName?.charAt(0)?.toUpperCase() :
                  <Feather name="arrow-down-right" size={20} color={"white"} />

                } />
                <View style={{ marginLeft: 10, gap: 3, paddingBottom: 5 }}>

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <MaterialIcons name="person" size={16} color="gray" style={{ marginHorizontal: 6 }} />
                    <Text style={styles.label}>{user?.name || "N/A"}</Text>
                  </View>

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <MaterialIcons name="phone" size={16} color="gray" style={{ marginHorizontal: 6 }} />
                      <Text style={styles.label}>{user?.mobile || "N/A"}</Text>
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <MaterialIcons name="location-on" size={16} color="gray" style={{ marginLeft: 12 }} />
                      <Text style={styles.address}>
                        {user.address
                          ? user.address.length > 18
                            ? user.address.slice(0, 18) + "..."
                            : user.address
                          : "N/A"}
                      </Text>
                    </View>
                  </View>

                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.preRow}>
                  <FontAwesome name="id-card" size={16} color="gray" />
                  <Text style={styles.label}>Shop Name:</Text>
                </View>
                <Text style={styles.label}>{vendor.shopname || "N/A"}</Text>
              </View>
              <View style={styles.row}>
                <View style={styles.preRow}>
                  <FontAwesome name="id-card" size={16} color="gray" />
                  <Text style={styles.label}>Shop ID:</Text>
                </View>
                <Text style={styles.label}>{id || "N/A"}</Text>
              </View>
              <View style={styles.row}>
                {/* <View style={styles.preRow}>
                  <FontAwesome name="money" size={16} color="gray" />
                  <Text style={styles.label}>Shop Profit:</Text>
                </View> */}
                {/* <Text style={styles.label}> ₹{item?.vendorprofit ?? "N/A"}</Text> */}
              </View>
            </View>

            {/* <View style={styles.buttonView}>
              <Button
                // mode="contained"
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  // paddingHorizontal: 2,

                  backgroundColor: "#007bff",

                }}
                icon={() => !isLoading && <FontAwesome name="download" size={16} color="white" />}
                labelStyle={{ fontSize: 12 }}
                onPress={handleDownload}
                loading={isLoading} // Shows the loader when true
                disabled={isLoading} // Disables the button when true
              >
                <Text style={{ color: "white" }}>{isLoading ? "Downloading..." : "Download Invoice"} </Text>
              </Button>

              <Button
                mode="outlined"
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  //  paddingHorizontal: 2,
                  borderColor: "#007bff",
                  borderWidth: 1
                }}
                icon={() => <EvilIcons name="share-google" size={24} color="#007bff" />}
                labelStyle={{ fontSize: 12, color: "#007bff", }}
                onPress={shareHandle}
              >
                Share Invoice
              </Button>
            </View>
            <TouchableOpacity style={styles.supportButton} onPress={() => navigation.navigate("Policies", {
                    webUri: `${NORM_URL}qapp/helpandsupport?view=mobile`,
                    headerTitle: "Help & Support",
                  })}>
              <FontAwesome name="phone" size={16} color="blue" />
              <Text style={styles.supportText}>Contact Support</Text>
            </TouchableOpacity> */}
          </Card>
        ))
      ) : (
        <Text style={styles.noDataText}>No transactions found.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#f9f9f9",
  },
  scrollContainer: {
    padding: 3,
  },
  card: {
    padding: 12,
    margin: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  amount: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 6,
  },
  status: {
    textAlign: "center",
    marginTop: 4,
    fontWeight: "600",
  },
  statusComplete: {
    color: "green",
  },
  buttonView: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 12,
  },
  statusPending: {
    color: "red",
  },
  date: {
    textAlign: "center",
    color: "gray",
    fontSize: 14,
    marginBottom: 10,
  },
  section: {
    backgroundColor: "#f9f9f9",
    padding: 14,
    // borderRadius: 10,
    // marginBottom: 10,
    // elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    marginVertical: 10,
    justifyContent: "space-between",
  },
  label: {
    marginLeft: 3,
    marginTop: 3,
    alignItems: "center"
  },
  preRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    // gap: 
  },
  address: {
    marginLeft: 3,
    color: "gray",
  },
  button: {
    marginTop: 8,
    backgroundColor: "#007bff",
  },
  supportButton: {
    marginTop: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#007bff",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  statusView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 8,
  },
  supportText: {
    marginLeft: 8,
    color: "#007bff",
    fontSize: 14,
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    padding: 16,
    textAlign: "center",
  },
  noDataText: {
    color: "red",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    fontFamily: fontFamily.medium,
    marginVertical: 8
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default TransactionDetailScreen;
