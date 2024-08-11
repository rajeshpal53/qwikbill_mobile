import * as React from 'react';
import { DataTable, Text } from 'react-native-paper';
import { useState, useEffect} from 'react';


const InvoiceDataTable = ({formData}) => {
    console.log("fdfs", formData.items)
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPageList] = useState([2, 3, 4]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
  );

 
  // const [items] = useState([
  //  {
  //    key: 1,
  //    name: 'Cupcake',
  //    calories: 356,
  //    fat: 16,
  //  },
  //  {
  //    key: 2,
  //    name: 'Eclair',
  //    calories: 262,
  //    fat: 16,
  //  },
  //  {
  //    key: 3,
  //    name: 'Frozen yogurt',
  //    calories: 159,
  //    fat: 6,
  //  },
  //  {
  //    key: 4,
  //    name: 'Gingerbread',
  //    calories: 305,
  //    fat: 3.7,
  //  },
  // ]);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, formData.items.length);

  
  useEffect(() => {
    console.log("pra")
    setPage(0);
  }, [itemsPerPage]);

  return (
    <DataTable>
      <DataTable.Header>
        <DataTable.Title>
          <Text style={{fontWeight:"bold"}}>Sr. No.</Text> </DataTable.Title>
        <DataTable.Title numeric>
          <Text style={{fontWeight:"bold"}}>Product Name</Text> </DataTable.Title>
        <DataTable.Title numeric>
          <Text style={{fontWeight:"bold"}}>Quantity</Text> </DataTable.Title>
        <DataTable.Title numeric>
          <Text style={{fontWeight:"bold"}}>GST Rate</Text></DataTable.Title>
        <DataTable.Title numeric>
          <Text style={{fontWeight:"bold"}}>Amt</Text> </DataTable.Title>
      </DataTable.Header>

      {formData.items.slice(from, to).map((item, index) => (
        <DataTable.Row key={item.key}>
          <DataTable.Cell>{(from + index+1)}</DataTable.Cell>
          <DataTable.Cell>{((from+index+1) === formData.items.length) ? ("Total") : (item.itemName)}</DataTable.Cell>
          <DataTable.Cell numeric>{item.quantity}</DataTable.Cell>
          <DataTable.Cell numeric>{}</DataTable.Cell>
          <DataTable.Cell numeric>{((from+index+1) === formData.items.length) ? (item.Total) : (item.total)}</DataTable.Cell>
        </DataTable.Row>
      ))}

      {/* Total row
      {to === formData.items.length && (
        <DataTable.Row>
          <DataTable.Cell>Total</DataTable.Cell>
          <DataTable.Cell />
          <DataTable.Cell />
          <DataTable.Cell numeric>
            {formData.items.reduce((sum, item) => sum + parseInt(item.total), 0)}
          </DataTable.Cell>
        </DataTable.Row>
      )} */}

      <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil(formData.items.length / itemsPerPage)}
        onPageChange={(page) => setPage(page)}
        label={`${from + 1}-${to} of ${formData.items.length}`}
        numberOfItemsPerPageList={numberOfItemsPerPageList}
        numberOfItemsPerPage={itemsPerPage}
        onItemsPerPageChange={onItemsPerPageChange}
        showFastPaginationControls
        selectPageDropdownLabel={'Rows per page'}
      />
    </DataTable>
  );
};

export default InvoiceDataTable;