// components/ProductDetailTable.js
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const ProductDetailTable = ({ data }) => {
  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={
          <View style={styles.headerRow}>
            <Text style={[styles.cell, styles.headerCell]}>Name</Text>
            <Text style={[styles.cell, styles.headerCell]}>Value</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  cell: {
    flex: 1,
    fontSize: 16,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    paddingVertical: 10,
    backgroundColor: '#f4f4f4',
  },
  headerCell: {
    fontWeight: 'bold',
  },
});

export default ProductDetailTable;
