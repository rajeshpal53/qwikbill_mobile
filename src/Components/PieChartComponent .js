import React, { useEffect } from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { PieChart } from "react-native-chart-kit";
import Animated, { useSharedValue, withTiming, useAnimatedStyle, withRepeat } from "react-native-reanimated";
import { fontFamily, fontSize } from "../Util/UtilApi";

const PieChartComponent = ({ vendorStatus }) => {
    const rotation = useSharedValue(0);

    useEffect(() => {
        if (vendorStatus) {
            rotation.value = withTiming(360, { duration: 2000 }); // Smooth rotation effect
        }
    }, [vendorStatus]);

    if (!vendorStatus) {
        return <Text style={{ fontFamily: fontFamily.medium, fontSize: fontSize.label }}>Loading Chart...</Text>;
    }

    // useEffect(() => {
    //     // Infinite rotation loop
    //     rotation.value = withRepeat(
    //         withTiming(360, { duration: 5000 }), // 5 seconds per full rotation
    //         -1, // Infinite repetitions
    //         false // Do not reverse animation
    //     );
    // }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    // Calculate total for percentage
    const total =
        (vendorStatus?.totalSales || 0) +
        (vendorStatus?.activeInvoices || 0) +
        (vendorStatus?.newCustomers || 0) +
        (vendorStatus?.totalInvoices || 0);


    const chartData =
        total === 0
            ? [
                { key: 1, value: 25, svg: { fill: "#ddd" }, label: "Transactions" },
                { key: 2, value: 25, svg: { fill: "#ddd" }, label: "Total Sales" },
                { key: 3, value: 25, svg: { fill: "#ddd" }, label: "Payments" },
                { key: 4, value: 25, svg: { fill: "#ddd" }, label: "Other" },
            ]
            : [
                { key: 1, value: vendorStatus.totalSales, svg: { fill: "#2ecc71" }, label: "Total Sales" },
                { key: 2, value: vendorStatus.activeInvoices, svg: { fill: "#f39c12" }, label: "Active Invoices" },
                { key: 3, value: vendorStatus.newCustomers, svg: { fill: "#3498db" }, label: "New Customers" },
                { key: 4, value: vendorStatus.totalInvoices, svg: { fill: "#9b59b6" }, label: "Total Invoices" },
            ];

    return (
        <View style={styles.container}>
            <Text style={styles.chartTitle}>Sales Overview</Text>

            <View style={styles.rowConainer}>

                <View style={styles.legendContainer}>

                    {chartData.map((item) => {
                        // Calculate percentage
                        // const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;

                        return (
                            <View key={item.key} style={styles.legendItem}>
                                <View style={[styles.colorBox, { backgroundColor: item.svg.fill }]} />
                                <View>
                                    <Text style={styles.legendText}>{item.label}</Text>
                                    <Text style={styles.legendValue}>{item.value}</Text>
                                </View>
                            </View>
                        )
                    })
                    }
                </View>


                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <Animated.View style={[styles.chartContainer, animatedStyle]}>
                        <PieChart
                            style={styles.pieChart}
                            data={chartData}
                            innerRadius={"70%"} // Donut effect
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

    },
    chartTitle: {
        fontSize: fontSize.headingSmall,
        fontFamily: fontFamily.medium,
        marginBottom: 10,
        position: "absolute",
        top: -50,
    },
    chartContainer: {
        justifyContent: 'flex-start',
        alignItems: "flex-start",

    },
    pieChart: {
        height: 190,
        width: Dimensions.get("window").width - 68
    },
    centerText: {
        // position: "absolute",
        alignItems: "center",
        top: "-50%",
        // left: "37%",

    },
    chartText: {
        fontSize: fontSize.labelMedium,
        fontFamily: fontFamily.medium,
        color: "#555",
        textAlign: "center"
    },
    chartValue: {
        fontSize: fontSize.labelLarge,
        fontFamily: fontFamily.medium,
        color: "rgba(0,0,0,0.8)"
    },

    legendContainer: {
        width: "25%",
        //  justifyContent: "center",
        alignItems: "flex-start",
        marginLeft: 12,
        marginTop: 5

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
        marginRight: 10
    },
    legendText: {
        fontSize: fontSize.label,
        fontFamily: fontFamily.bold,
        color: "#333"
    },
    legendValue: {
        fontSize: 12,
        color: "#555"
    },
    rowConainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "110%",
        marginBottom: 20,

    }
});

export default PieChartComponent;
