import React, { useEffect } from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { PieChart } from "react-native-chart-kit";
//import { PieChart } from "react-native-chart-kit";
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from "react-native-reanimated";
import { fontFamily, fontSize } from "../Util/UtilApi";

const screenWidth = Dimensions.get("window").width;

const PieChartComponent = ({ vendorStatus, t }) => {
    const rotation = useSharedValue(0);
    const { width, height } = Dimensions.get("window");

    useEffect(() => {
        if (vendorStatus) {
            rotation.value = withTiming(360, { duration: 2000 }); // Smooth rotation effect
        }
    }, [vendorStatus]);

    if (!vendorStatus) {
        return <Text style={styles.loadingText}>Loading Chart...</Text>;
    }

    const total =
    
        (vendorStatus?.totalSales || 0) +
        (vendorStatus?.numberOfProducts || 0) +
        (vendorStatus?.activeInvoices || 0) +
        (vendorStatus?.newCustomers || 0) +
        (vendorStatus?.totalInvoices || 0);

    const chartData =
        total === 0
            ? []
            : [
                  { name: "Total Products", population: vendorStatus.numberOfProducts, color: "#2ecc71", legendFontColor: "#333", legendFontSize: 0},
                  { name: "Active Invoices", population: vendorStatus.activeInvoices, color: "#f39c12", legendFontColor: "#333", legendFontSize: 0 },
                  { name: "New Customers", population: vendorStatus.newCustomers, color: "#3498db", legendFontColor: "#333", legendFontSize: 0 },
                  { name: "Total Invoices", population: vendorStatus.totalInvoices, color: "#9b59b6", legendFontColor: "#333", legendFontSize: 0},

                ];

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    return (
        <View style={styles.container}>
            <Text style={styles.chartTitle}>{t("Sales Overview")}</Text>

            <View style={styles.rowContainer}>
                {/* Legend */}
                <View style={styles.legendContainer}>
                    {chartData.map((item, index) => (
                        <View key={index} style={styles.legendItem}>
                            <View style={[styles.colorBox, { backgroundColor: item.color }]} />
                            <View>
                                <Text style={styles.legendText}>{t(item.name)}</Text>
                                <Text style={styles.legendValue}>{item.population}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Pie Chart with Rotation */}
                <View style={styles.chartWrapper}>
                    <View style={styles.chartContainer}>
                    <Animated.View style={[styles.pieChartWrapper ,animatedStyle ]}>
                        <PieChart
                            data={chartData}
                            width={screenWidth * 0.6}
                            height={210}
                            chartConfig={{
                                backgroundColor: "#fff",
                                backgroundGradientFrom: "#fff",
                                backgroundGradientTo: "#fff",
                                color: () => `rgba(0, 0, 0, 1)`,
                            }}
                            accessor={"population"}
                            backgroundColor={"transparent"}
                            paddingLeft={"25"}
                            center={[10, 4]}
                           hasLegend={false}
                        />
                    </Animated.View>
                    </View>

                    {/* Center Text */}
                    <View style={styles.centerText}>

                        <Text style={styles.chartText}>Products</Text>
                        <Text style={styles.chartValue}>{vendorStatus?.numberOfProducts ?? 0}</Text>

                    </View>

                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
       // marginTop:"-2%",

    },
    chartTitle: {
        fontSize: fontSize.headingSmall,
        fontFamily: fontFamily.medium,
        marginBottom: "5%",
    },
    loadingText: {
        fontFamily: fontFamily.medium,
        fontSize: fontSize.label,
        textAlign: "center",
        marginTop: "2%",
    },
    chartWrapper: {
       justifyContent: "center",
        alignItems: "center",
       // position: "relative",
    
        height:"20%",
        width:"45%",
        alignSelf:"center",
        alignContent:"center",
        marginTop:"-5%",
      marginLeft:"-5%",
    },
    chartContainer: {
        justifyContent: "flex-start",
        alignItems: "flex-start",

    },
    centerText: {
        position: "absolute",
        alignItems: "center",
       // top: "50%",
        //left: "50%",
        transform: [{ translateX: -20 }, { translateY: 12 }],
    },
    chartText: {
        fontSize: fontSize.labelLarge,
        fontFamily: fontFamily.medium,
        color: "#444",
        textAlign: "center",
    },
    chartValue: {
        fontSize: fontSize.labelLarge,
        fontFamily: fontFamily.medium,
        color: "rgba(0,0,0,0.8)",
    },
    legendContainer: {
        width: "25%",
        alignItems: "flex-start",

        marginLeft: "4%",
        marginTop: "2%",
        
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: "6%",
    },
    colorBox: {
        width: 15,
        height: 15,
        borderRadius: 3,
        marginRight: "15%",
    },
    legendText: {
        fontSize: fontSize.label,
        fontFamily: fontFamily.bold,
        color: "#333",
    },
    legendValue: {
        fontSize: fontSize.label,
        color: "#555",
    },
    rowContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "110%",

        marginBottom: "6%",

    },
    pieChartWrapper: {
        position: "absolute", // Prevents shifting during animation
        top: -100,
        left: -110,
     //backgroundColor:"pink",
        width:"110%"
        

    },
});

export default PieChartComponent;








// import React, { useEffect } from "react";
// import { View, Text, Dimensions, StyleSheet } from "react-native";
// import PieChart from "react-native-pie-chart";
// import Animated, { useSharedValue, withTiming, useAnimatedStyle } from "react-native-reanimated";
// import { fontFamily, fontSize } from "../Util/UtilApi";

// const PieChartComponent = ({ vendorStatus, t }) => {
//   const rotation = useSharedValue(0);
//   const screenWidth = Dimensions.get("window").width;
//   const chartSize = screenWidth * 0.45;

//   useEffect(() => {
//     if (vendorStatus) {
//       rotation.value = withTiming(360, { duration: 2000 });
//     }
//   }, [vendorStatus]);

//   if (!vendorStatus) {
//     return <Text style={styles.loadingText}>Loading Chart...</Text>;
//   }

//   const rawData = [
//     {
//       value: vendorStatus.numberOfProducts || 0,
//       color: "#2ecc71",
//       label: "Total Products",
//     },
//     {
//       value: vendorStatus.activeInvoices || 0,
//       color: "#f39c12",
//       label: "Active Invoices",
//     },
//     {
//       value: vendorStatus.newCustomers || 0,
//       color: "#3498db",
//       label: "New Customers",
//     },
//     {
//       value: vendorStatus.totalInvoices || 0,
//       color: "#9b59b6",
//       label: "Total Invoices",
//     },
//   ];

//   const filteredData = rawData.filter((item) => item.value > 0);
//   const chartData = filteredData.map((item) => item.value); // Only values
//   const sliceColors = filteredData.map((item) => item.color); // Only colors
//   const labels = filteredData.map((item) => item.label); // Only labels

//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [{ rotate: `${rotation.value}deg` }],
//   }));

//   return (
//     <View style={styles.container}>
//       <Text style={styles.chartTitle}>{t("Sales Overview")}</Text>
//       <View style={styles.rowContainer}>
//         {/* Legend */}
//         <View style={styles.legendContainer}>
//           {chartData.map((value, index) => (
//             <View key={index} style={styles.legendItem}>
//               <View style={[styles.colorBox, { backgroundColor: sliceColors[index] }]} />
//               <View>
//                 <Text style={styles.legendText}>{t(labels[index])}</Text>
//                 <Text style={styles.legendValue}>{value}</Text>
//               </View>
//             </View>
//           ))}
//         </View>

//         {/* Pie Chart */}
//         <View style={styles.chartWrapper}>
//           <View style={styles.chartContainer}>
//             <Animated.View style={[animatedStyle]}>
//               <PieChart
//                 width={chartSize}
//                 height={chartSize}
//                 series={chartData}
//                 sliceColor={sliceColors}
//                 doughnut
//                 coverRadius={0.55}
//                 coverFill={"#fff"}
//               />
//             </Animated.View>
//           </View>

//           {/* Center Text */}
//           <View style={styles.centerText}>
//             <Text style={styles.chartText}>{t("Products")}</Text>
//             <Text style={styles.chartValue}>{vendorStatus?.numberOfProducts ?? 0}</Text>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   chartTitle: {
//     fontSize: fontSize.headingSmall,
//     fontFamily: fontFamily.medium,
//     marginBottom: "5%",
//   },
//   loadingText: {
//     fontFamily: fontFamily.medium,
//     fontSize: fontSize.label,
//     textAlign: "center",
//     marginTop: "2%",
//   },
//   chartWrapper: {
//     justifyContent: "center",
//     alignItems: "center",
//     height: "20%",
//     width: "45%",
//     alignSelf: "center",
//     marginTop: "-5%",
//     marginLeft: "-5%",
//   },
//   chartContainer: {
//     justifyContent: "flex-start",
//     alignItems: "flex-start",
//   },
//   centerText: {
//     position: "absolute",
//     alignItems: "center",
//     transform: [{ translateX: -20 }, { translateY: 12 }],
//   },
//   chartText: {
//     fontSize: fontSize.labelLarge,
//     fontFamily: fontFamily.medium,
//     color: "#444",
//     textAlign: "center",
//   },
//   chartValue: {
//     fontSize: fontSize.labelLarge,
//     fontFamily: fontFamily.medium,
//     color: "rgba(0,0,0,0.8)",
//   },
//   legendContainer: {
//     width: "25%",
//     alignItems: "flex-start",
//     marginLeft: "4%",
//     marginTop: "2%",
//   },
//   legendItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: "6%",
//   },
//   colorBox: {
//     width: 15,
//     height: 15,
//     borderRadius: 3,
//     marginRight: "15%",
//   },
//   legendText: {
//     fontSize: fontSize.label,
//     fontFamily: fontFamily.bold,
//     color: "#333",
//   },
//   legendValue: {
//     fontSize: fontSize.label,
//     color: "#555",
//   },
//   rowContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: "110%",
//     marginBottom: "6%",
//   },
// });

// export default PieChartComponent;
