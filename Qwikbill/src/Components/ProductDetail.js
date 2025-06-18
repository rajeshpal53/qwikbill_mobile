import { FlatList, StyleSheet, View } from "react-native";
import { Card, Divider, Text } from "react-native-paper";

function ProductDetail({ detail }) {
  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.fieldName}</Text>
      <Text style={styles.cell}>{item.fieldValue}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Card style={{ backgroundColor: "#0c3b73" }}>
        <Card.Title title={detail.created} titleStyle={{color:'#fff'}} />
        <Card.Content style={styles.cardContainer}>
          <Text style={styles.label}> Product Name:</Text>
          <Text style={styles.value}>{detail.name}</Text>
        </Card.Content>
        <Divider style={{ marginVertical: 10 }} />

        <Card.Content style={styles.cardContainer}>
          <View style={{ width: "100%", flexDirection: "row" }}>
            <Text style={styles.descriptionText}> Product Category: </Text>
            <Text style={styles.descriptionText}>{detail?.productCategory?.name}</Text>
          </View>
          <View style={{ width: "100%", flexDirection: "row" }}>
            <Text style={styles.descriptionText}> description: </Text>
            <Text style={styles.descriptionTextValue}>
             {detail?.productCategory?.description}
            </Text>
          </View>
        </Card.Content>
      </Card>
      <View style={styles.tableContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>Name</Text>
          <Text style={styles.headerCell}>Value</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>price</Text>
          <Text style={styles.cell}>{detail.price}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>taxRate</Text>
          <Text style={styles.cell}>{detail.taxRate}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Currency</Text>
          <Text style={styles.cell}>{detail.currency}</Text>
        </View>
        
        <FlatList data={detail.customField} renderItem={renderItem}  keyExtractor={(item, index) => index.toString()}/>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    margin: 10,
    // backgroundColor: "#fff",
    height:"96%"

  },

  label: {
    fontSize: 16,
    marginVertical: 10,
    marginRight: 5,
    color:"#fff"
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    color:"#fff"
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  descriptionText: {
    color: "#fff",
    marginVertical: 5,
  },
  descriptionTextValue: {
    flex: 1,
    flexGrow: 1,
    color: "#fff",
    marginVertical: 5,
  },
  tableContainer: {
    width: "100%",
    marginVertical: 20,
    marginHorizontal: 2,
  },
  headerRow: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#000",
    paddingVertical: 10,

    backgroundColor: "#f4f4f4",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
  },
  cell: {
    flex: 1,
    fontSize: 16,
  },
  headerCell: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProductDetail;
