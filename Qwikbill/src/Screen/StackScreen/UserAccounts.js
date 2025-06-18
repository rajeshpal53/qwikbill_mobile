// import { Picker } from '@react-native-picker/picker';
// import { useContext, useEffect, useState } from 'react';
// import {
//     ActivityIndicator,
//     Dimensions,
//     Image,
//     ScrollView,
//     StyleSheet,
//     Text,
//     View,
// } from 'react-native';
// import { LineChart, PieChart } from 'react-native-chart-kit';
// import UserDataContext from '../../Store/UserDataContext';

// const screenWidth = Dimensions.get('window').width;

// const UserAccounts = () => {
//   const { fetchUserData } = useContext(UserDataContext);
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedYear, setSelectedYear] = useState('2025');
//   const [selectedMonth, setSelectedMonth] = useState('');

//   useEffect(() => {
//     const loadStats = async () => {
//       setLoading(true);
//       try {
//         const user = await fetchUserData();
//         const token = user?.token;

//         if (!token) {
//           console.error('Token not found in user data');
//           setLoading(false);
//           return;
//         }

//         const apiUrl = `https://qwikbill.in/qapi/invoice/getVendorStats?year=${selectedYear}&vendorfk=1${
//           selectedMonth ? `&month=${selectedMonth}` : ''
//         }`;

//         const response = await fetch(apiUrl, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const json = await response.json();
//         console.log('API Response:', json);

//         if (json.success) {
//           setStats({
//             ...json,
//             monthlyRevenue: json.monthlyRevenue || [],
//           });
//         } else {
//           console.error('API success is false');
//         }
//       } catch (error) {
//         console.error('Error fetching stats:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadStats();
//   }, [selectedYear, selectedMonth]);

//   if (loading) {
//     return <ActivityIndicator size="large" color="#002B5B" style={{ marginTop: 50 }} />;
//   }

//   if (!stats || !stats.success) {
//     return <Text style={{ textAlign: 'center', marginTop: 50 }}>Failed to load data</Text>;
//   }

//   const monthlyLabels = stats.monthlyRevenue.map((item) => item.month) || [];
//   const monthlyData = stats.monthlyRevenue.map((item) => item.revenue) || [];

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.headerSection}>
//         <View>
//           <Text style={styles.headerTitle}>Vendor</Text>
//           <Text style={styles.headerTitle}>Financial</Text>
//           <Text style={styles.headerTitle}>Overview</Text>
//         </View>
//         <Image source={require('../../../assets/qwikBill.jpeg')} style={styles.headerImage} />
//       </View>

//       {/* Year & Month Picker */}
//       <View style={styles.pickerContainer}>
//         <View style={styles.pickerWrapper}>
//           <Text style={styles.pickerLabel}>Select Year</Text>
//           <Picker
//             selectedValue={selectedYear}
//             onValueChange={(value) => {
//               setSelectedYear(value);
//               setSelectedMonth('');
//             }}>
//             {[2023, 2024, 2025].map((year) => (
//               <Picker.Item key={year} label={String(year)} value={String(year)} />
//             ))}
//           </Picker>
//         </View>

//         <View style={styles.pickerWrapper}>
//           <Text style={styles.pickerLabel}>Select Month</Text>
//           <Picker selectedValue={selectedMonth} onValueChange={(value) => setSelectedMonth(value)}>
//             <Picker.Item label="All Months" value="" />
//             {[
//               'January', 'February', 'March', 'April', 'May', 'June',
//               'July', 'August', 'September', 'October', 'November', 'December',
//             ].map((month, idx) => (
//               <Picker.Item key={month} label={month} value={String(idx + 1).padStart(2, '0')} />
//             ))}
//           </Picker>
//         </View>
//       </View>

//       {/* Cards */}
//       <View style={styles.cardContainer}>
//         <View style={[styles.card, { backgroundColor: '#002B5B' }]}>
//           <Text style={styles.cardTitlefirst}>Total Revenue</Text>
//           <Text style={styles.cardValue}>₹ {stats.totalRevenue || 0}</Text>
//         </View>

//         <View style={[styles.card, { backgroundColor: '#F0F7F4' }]}>
//           <Text style={styles.cardTitle}>Amount Paid</Text>
//           <Text style={styles.cardValueDark}>₹ {stats.amountPaid || 0}</Text>
//         </View>

//         <View style={[styles.card, { backgroundColor: '#FCE8E6' }]}>
//           <Text style={styles.cardTitleRed}>Remaining Amount</Text>
//           <Text style={styles.cardValueRed}>₹ {stats.amountRemaining || 0}</Text>
//         </View>

//         <View style={[styles.card, { backgroundColor: '#E8EAF6' }]}>
//           <Text style={styles.cardTitle}>Active Invoices</Text>
//           <Text style={styles.cardValueDark}>{stats.activeInvoices || 0}</Text>
//         </View>
//       </View>

//       {/* Line Chart - only show when month is not selected */}
//       {!selectedMonth && stats.monthlyRevenue.length > 0 && (
//         <View style={[styles.chartCard, { backgroundColor: '#f9f9fc' }]}>
//           <Text style={styles.sectionTitle}>Revenue Trend</Text>
//           <LineChart
//             data={{
//               labels: monthlyLabels,
//               datasets: [{ data: monthlyData }],
//             }}
//             width={screenWidth - 60}
//             height={220}
//             chartConfig={{
//               backgroundColor: 'transparent',
//               backgroundGradientFrom: '#fff',
//               backgroundGradientTo: '#fff',
//               decimalPlaces: 0,
//               color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
//               labelColor: () => '#000',
//             }}
//             style={styles.chart}
//           />
//         </View>
//       )}

//       {/* Pie Chart */}
//       <View style={[styles.chartCard, { backgroundColor: '#f9f9fc' }]}>
//         <Text style={styles.sectionTitle}>Payment Breakdown</Text>
//         <PieChart
//           data={[
//             {
//               name: 'Paid',
//               population: stats.amountPaid,
//               color: 'green',
//               legendFontColor: '#000',
//               legendFontSize: 12,
//             },
//             {
//               name: 'Unpaid',
//               population: stats.amountRemaining,
//               color: 'red',
//               legendFontColor: '#000',
//               legendFontSize: 12,
//             },
//           ]}
//           width={screenWidth - 60}
//           height={200}
//           chartConfig={{ color: () => '#000' }}
//           accessor={'population'}
//           backgroundColor={'transparent'}
//           paddingLeft={'15'}
//           absolute
//           style={styles.chart}
//         />
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 15,
//     backgroundColor: '#fff',
//   },
//   headerSection: {
//     backgroundColor: '#E0F0FF',
//     padding: 15,
//     borderRadius: 15,
//     marginBottom: 15,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     position: 'relative',
//   },
//   headerTitle: {
//     fontSize: 30,
//     fontWeight: 'bold',
//     color: '#002B5B',
//   },
//   headerImage: {
//     width: 200,
//     height: 130,
//     resizeMode: 'contain',
//   },
//   pickerContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 15,
//   },
//   pickerWrapper: {
//     flex: 1,
//     marginRight: 10,
//   },
//   pickerLabel: {
//     fontWeight: 'bold',
//     marginBottom: 5,
//     color: '#002B5B',
//   },
//   cardContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   card: {
//     width: '48%',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 15,
//   },
//   cardTitlefirst: {
//     fontSize: 14,
//     color: 'white',
//   },
//   cardTitle: {
//     fontSize: 14,
//     color: '#333',
//   },
//   cardTitleRed: {
//     fontSize: 14,
//     color: 'red',
//   },
//   cardValue: {
//     fontSize: 18,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   cardValueDark: {
//     fontSize: 18,
//     color: '#000',
//     fontWeight: 'bold',
//   },
//   cardValueRed: {
//     fontSize: 18,
//     color: 'red',
//     fontWeight: 'bold',
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginTop: 20,
//     marginBottom: 10,
//   },
//   chart: {
//     marginVertical: 10,
//     borderRadius: 10,
//   },
//   chartCard: {
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 15,
//     backgroundColor: '#fff',
//     elevation: 3, // Android
//     shadowColor: '#000', // iOS
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
//   },
// });

// export default UserAccounts;

import { Text, View } from 'react-native'

const UserAccounts = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>User Accounts Screen</Text>
    </View>
  )
}

export default UserAccounts