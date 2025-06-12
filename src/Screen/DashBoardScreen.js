// VendorDashboard.js
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Image, ActivityIndicator } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import UserDataContext from '../Store/UserDataContext'; // adjust path as needed

const screenWidth = Dimensions.get('window').width;

const DashBoardScreen = () => {
  const { fetchUserData } = useContext(UserDataContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const user = await fetchUserData();
        console.log('Fetched user:', user);
        const token = user?.token;

        if (!token) {
          console.error('Token not found in user data');
          setLoading(false);
          return;
        }

        const response = await fetch(`https://qwikbill.in/qapi/invoice/getVendorStats?year=2025&vendorfk=1`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
           console.log('Status:', response.status);
        const json = await response.json();
        console.log('API Response:', json);
        
         if (json.success) {
        setStats(json);
      } else {
        console.error('API success is false');
      }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#002B5B" style={{ marginTop: 50 }} />;
  }

  if (!stats || !stats.success) {
    return <Text style={{ textAlign: 'center', marginTop: 50 }}>Failed to load data</Text>;
  }

  const monthlyLabels = stats.monthlyRevenue.map((item) => item.month);
  const monthlyData = stats.monthlyRevenue.map((item) => item.revenue);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerSection}>
        <View>
          <Text style={styles.headerTitle}>Vendor</Text>
          <Text style={styles.headerTitle}>Financial</Text>
          <Text style={styles.headerTitle}>Overview</Text>
        </View>
        <Image source={require('../../assets/qwikBill.jpeg')} style={styles.headerImage} />
      </View>

      <View style={styles.cardContainer}>
        <View style={[styles.card, { backgroundColor: '#002B5B' }]}>
          <Text style={styles.cardTitlefirst}>Total Revenue</Text>
          <Text style={styles.cardValue}>₹ {stats.totalRevenue}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: '#F0F7F4' }]}>
          <Text style={styles.cardTitle}>Amount Paid</Text>
          <Text style={styles.cardValueDark}>₹ {stats.amountPaid}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: '#FCE8E6' }]}>
          <Text style={styles.cardTitleRed}>Remaining Amount</Text>
          <Text style={styles.cardValueRed}>₹ {stats.amountRemaining}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: '#E8EAF6' }]}>
          <Text style={styles.cardTitle}>Active Invoices</Text>
          <Text style={styles.cardValueDark}>{stats.activeInvoices}</Text>
        </View>
      </View>

      <View style={[styles.chartCard, { backgroundColor: '#f9f9fc' }]}>
        <Text style={styles.sectionTitle}>Revenue Trend</Text>
        <LineChart
          data={{
            labels: monthlyLabels,
            datasets: [{ data: monthlyData }],
          }}
          width={screenWidth - 60}
          height={220}
          chartConfig={{
            backgroundColor: 'transparent',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
            labelColor: () => '#000',
          }}
          style={styles.chart}
        />
      </View>

      <View style={[styles.chartCard, { backgroundColor: '#f9f9fc' }]}>
        <Text style={styles.sectionTitle}>Payment Breakdown</Text>
        <PieChart
          data={[
            {
              name: 'Paid',
              population: stats.amountPaid,
              color: 'green',
              legendFontColor: '#000',
              legendFontSize: 12,
            },
            {
              name: 'Unpaid',
              population: stats.amountRemaining,
              color: 'red',
              legendFontColor: '#000',
              legendFontSize: 12,
            },
          ]}
          width={screenWidth - 60}
          height={200}
          chartConfig={{ color: () => `#000` }}
          accessor={'population'}
          backgroundColor={'transparent'}
          paddingLeft={'15'}
          absolute
          style={styles.chart}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#fff',
  },
  headerSection: {
  backgroundColor: '#E0F0FF',
  padding: 15,
  borderRadius: 15,
  marginBottom: 15,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'relative',
},
headerTitle: {
  fontSize: 30,
  fontWeight: 'bold',
  color: '#002B5B',
},
headerImage: {
  width: 200,
  height: 130,
  resizeMode: 'contain',
},
headerDate: {
  position: 'absolute',
  top: 10,
  right: 15,
  fontSize: 12,
  color: '#333',
},
  container: {
    padding: 15,
    backgroundColor: '#fff',
  },
  date: {
    textAlign: 'right',
    color: '#666',
    fontSize: 12,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  subHeading: {
    fontSize: 18,
    color: '#4B0082',
    fontWeight: '600',
    marginBottom: 15,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  cardTitlefirst:{
     fontSize:14,
     color:'white'
  },
  cardTitle: {
    fontSize: 14,
    color: '#333',
  },
  cardTitleRed: {
    fontSize: 14,
    color: 'red',
  },
  cardValue: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  cardValueDark: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  cardValueRed: {
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  chart: {
    marginVertical: 10,
    borderRadius: 10,
  },
  chartCard: {
  padding: 15,
  borderRadius: 10,
  marginBottom: 15,
  backgroundColor: '#fff',
  elevation: 3, // Android
  shadowColor: '#000', // iOS
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
},


});

export default DashBoardScreen;

// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, Dimensions, Image, ActivityIndicator } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { LineChart, PieChart } from 'react-native-chart-kit';

// const screenWidth = Dimensions.get('window').width;

// const DashBoardScreen = () => {
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const fetchStats = async () => {
//     try {
//       const token = await AsyncStorage.getItem('token');
//       const userJson = await AsyncStorage.getItem('user');
//       const user = JSON.parse(userJson);

//       if (!token || !user?.id) return;

//       const year = new Date().getFullYear();
//       const response = await fetch(`https://qwikbill.in/qapi/invoice/getVendorStats?year=${year}&vendorfk=${user.id}`, {
//         method: 'GET',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const result = await response.json();
//       if (result.success) {
//         setStats(result);
//       }
//     } catch (error) {
//       console.error('Error fetching vendor stats:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   if (loading) {
//     return <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 50 }} />;
//   }

//   const monthlyRevenueData = stats?.monthlyRevenue || [];
//   const chartLabels = monthlyRevenueData.map((item) => item.month);
//   const chartValues = monthlyRevenueData.map((item) => item.revenue);

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.headerSection}>
//         <View>
//           <Text style={styles.headerTitle}>Vendor</Text>
//           <Text style={styles.headerTitle}>Financial</Text>
//           <Text style={styles.headerTitle}>Overview</Text>
//         </View>
//         <Image source={require('../../assets/qwikBill.jpeg')} style={styles.headerImage} />
//       </View>

//       <View style={styles.cardContainer}>
//         <View style={[styles.card, { backgroundColor: '#002B5B' }]}>
//           <Text style={styles.cardTitlefirst}>Total Revenue</Text>
//           <Text style={styles.cardValue}>₹ {stats?.totalRevenue?.toLocaleString()}</Text>
//         </View>

//         <View style={[styles.card, { backgroundColor: '#F0F7F4' }]}>
//           <Text style={styles.cardTitle}>Amount Paid</Text>
//           <Text style={styles.cardValueDark}>₹ {stats?.amountPaid?.toLocaleString()}</Text>
//         </View>

//         <View style={[styles.card, { backgroundColor: '#FCE8E6' }]}>
//           <Text style={styles.cardTitleRed}>Remaining Amount</Text>
//           <Text style={styles.cardValueRed}>₹ {stats?.amountRemaining?.toLocaleString()}</Text>
//         </View>

//         <View style={[styles.card, { backgroundColor: '#E8EAF6' }]}>
//           <Text style={styles.cardTitle}>Payment Status</Text>
//           <Text style={styles.cardValueDark}>{stats?.noOfInvoices}</Text>
//         </View>
//       </View>

//       <View style={[styles.chartCard, { backgroundColor: '#f9f9fc' }]}>
//         <Text style={styles.sectionTitle}>Revenue Trend</Text>
//         <LineChart
//           data={{
//             labels: chartLabels,
//             datasets: [{ data: chartValues }],
//           }}
//           width={screenWidth - 60}
//           height={220}
//           chartConfig={{
//             backgroundColor: 'transparent',
//             backgroundGradientFrom: '#fff',
//             backgroundGradientTo: '#fff',
//             decimalPlaces: 0,
//             color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
//             labelColor: () => '#000',
//           }}
//           style={styles.chart}
//         />
//       </View>

//       <View style={[styles.chartCard, { backgroundColor: '#f9f9fc' }]}>
//         <Text style={styles.sectionTitle}>Payment Breakdown</Text>
//         <PieChart
//           data={[
//             {
//               name: 'Paid',
//               population: stats?.amountPaid || 0,
//               color: 'green',
//               legendFontColor: '#000',
//               legendFontSize: 12,
//             },
//             {
//               name: 'Unpaid',
//               population: stats?.amountRemaining || 0,
//               color: 'red',
//               legendFontColor: '#000',
//               legendFontSize: 12,
//             },
//           ]}
//           width={screenWidth - 60}
//           height={200}
//           chartConfig={{ color: () => `#000` }}
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
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
//   },
// });

// export default DashBoardScreen;

