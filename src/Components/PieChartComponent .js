import React, { useEffect } from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { PieChart } from "react-native-chart-kit";
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from "react-native-reanimated";
import { fontFamily, fontSize } from "../Util/UtilApi";

const screenWidth = Dimensions.get("window").width;

const PieChartComponent = ({ vendorStatus }) => {
    const rotation = useSharedValue(0);

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
        (vendorStatus?.activeInvoices || 0) +
        (vendorStatus?.newCustomers || 0) +
        (vendorStatus?.totalInvoices || 0);

    const chartData =
        total === 0
            ? []
            : [
                  { name: "Total Sales", population: vendorStatus.totalSales, color: "#2ecc71", legendFontColor: "transparent", legendFontSize: 0},
                  { name: "Active Invoices", population: vendorStatus.activeInvoices, color: "#f39c12", legendFontColor: "#333", legendFontSize: 0 },
                  { name: "New Customers", population: vendorStatus.newCustomers, color: "#3498db", legendFontColor: "#333", legendFontSize: 0 },
                  { name: "Total Invoices", population: vendorStatus.totalInvoices, color: "#9b59b6", legendFontColor: "#333", legendFontSize: 0},
             
                ];

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    return (
        <View style={styles.container}>
            <Text style={styles.chartTitle}>Sales Overview</Text>

            <View style={styles.rowContainer}>
                {/* Legend */}
                <View style={styles.legendContainer}>
                    {chartData.map((item, index) => (
                        <View key={index} style={styles.legendItem}>
                            <View style={[styles.colorBox, { backgroundColor: item.color }]} />
                            <View>
                                <Text style={styles.legendText}>{item.name}</Text>
                                <Text style={styles.legendValue}>{item.population}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Pie Chart with Rotation */}
                <View style={styles.chartWrapper}>
                    <Animated.View style={[styles.chartContainer ,animatedStyle ]}>
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
                            paddingLeft={"20"}
                            center={[10, 4]}
                           hasLegend={false}
                        />
                    </Animated.View>

                    {/* Center Text */}
                    <View style={styles.centerText}>
                        <Text style={styles.chartText}>Total</Text>
                        <Text style={styles.chartValue}>${vendorStatus?.totalSales ?? 0}</Text>
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
        marginTop:-20
    },
    chartTitle: {
        fontSize: fontSize.headingSmall,
        fontFamily: fontFamily.medium,
        marginBottom: 10,
    },
    loadingText: {
        fontFamily: fontFamily.medium,
        fontSize: fontSize.label,
        textAlign: "center",
        marginTop: 20,
    },
    chartWrapper: {
       justifyContent: "center",
        alignItems: "center",
       // position: "relative",
        //backgroundColor:"orange",
        height:180,
        width:180,
        alignSelf:"center",
        alignContent:"center",
        marginTop:-10

    },
    chartContainer: {
        justifyContent: "flex-start",
        alignItems: "flex-start",
        
    },
    centerText: {
        position: "absolute",
        alignItems: "center",
        top: "45%",
        //left: "50%",
        transform: [{ translateX: -28 }, { translateY: -12 }],
    },
    chartText: {
        fontSize: fontSize.labelMedium,
        fontFamily: fontFamily.medium,
        color: "#555",
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
        marginLeft: 12,
        marginTop: 5,
        
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    colorBox: {
        width: 15,
        height: 15,
        borderRadius: 3,
        marginRight: 10,
    },
    legendText: {
        fontSize: fontSize.label,
        fontFamily: fontFamily.bold,
        color: "#333",
    },
    legendValue: {
        fontSize: 12,
        color: "#555",
    },
    rowContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "110%",
        marginBottom: 20,
        
    },
});

export default PieChartComponent;