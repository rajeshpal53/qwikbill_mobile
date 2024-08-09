
import {
    MaterialCommunityIcons,
    FontAwesome5,
    Ionicons,
    AntDesign,
    Entypo,
    MaterialIcons,
    Octicons,
    FontAwesome
  } from "@expo/vector-icons";
import { responsiveFontSize } from "react-native-responsive-dimensions";
  
export const services = [
    {
      name: "Add Invoice",
      icon: <FontAwesome5 name="file-invoice" size={30} color="#0c3b73" />,
      key: "1",
      navigateTo:"CreateInvoice"
    },
    // {
    //   name: "Add Customer",
    //   icon: <AntDesign name="adduser" size={30} color="#0c3b73" />,
    //   key: "2",
    //   navigateTo:"AddCustomer"
    // },
    {
      name: "View Vendors",
      icon: <FontAwesome name="group" size={30} color="#0c3b73" />,
      key: "4",
      navigateTo:"ViewVendor"
    },
    {
      name: " Add HSN/SAC Code",
      icon: <FontAwesome5 name="user" size={30} color="#0c3b73" />,
      key: "6",
      navigateTo:"hsncode"
    },
    {
      name: "Create New Shop",
      icon:<MaterialIcons name="add-business" size={30} color="#0c3b73" />,
      key: "5",
      navigateTo:"CreateShopScreen"
    },
    {
      name: "View Your Shops",
      icon: <FontAwesome5 name="store" size={30} color="#0c3b73" />,
      key: "6",
      navigateTo:"ViewShops"
    },

    // {
    //   name: "Cheque Services",
    //   icon: (
    //     <MaterialCommunityIcons
    //       name="newspaper-variant"
    //       size={30}
    //       color="#0c3b73"
    //     />
    //   ),
    //   key: "7",
    //   navigateTo:"CreateInvoice"
    // },
    // {
    //   name: "Insurance",
    //   icon: <FontAwesome5 name="shield-alt" size={30} color="#0c3b73" />,
    //   key: "8",
    //   navigateTo:"CreateInvoice"
    // },
    {
      name: "Favourites",
      icon: <Ionicons name="heart-outline" size={30} color="#0c3b73" />,
      key: "9",
      navigateTo:"CreateInvoice"
    },
    // {
    //   name: "Deposits",
    //   icon: <FontAwesome5 name="piggy-bank" size={30} color="#0c3b73" />,
    //   key: "10",
    //   navigateTo:"CreateInvoice"
    // },
    // {
    //   name: "Recharge",
    //   icon: <Ionicons name="battery-charging" size={30} color="#0c3b73" />,
    //   key: "11",
    //   navigateTo:"CreateInvoice"
    // },
    // {
    //   name: "Investment/ASBA",
    //   icon: <Ionicons name="trending-up" size={30} color="#0c3b73" />,
    //   key: "12",
    //   navigateTo:"CreateInvoice"
    // },
    // {
    //   name: "Investment/ASBA",
    //   icon: <Ionicons name="trending-up" size={30} color="#0c3b73" />,
    //   key: "13",
    //   navigateTo:"CreateInvoice"
    // },
    // {
    //   name: "Investment/ASBA",
    //   icon: <Ionicons name="trending-up" size={30} color="#0c3b73" />,
    //   key: "14",
    //   navigateTo:"CreateInvoice"
    // },
    // {
    //   name: "Investment/ASBA",
    //   icon: <Ionicons name="trending-up" size={30} color="#0c3b73" />,
    //   key: "15",
    //   navigateTo:"CreateInvoice"
    // },
    // {
    //   name: "Investment/ASBA",
    //   icon: <Ionicons name="trending-up" size={30} color="#0c3b73" />,
    //   key: "16",
    //   navigateTo:"CreateInvoice"
    // },
    // {
    //   name: "Investment/ASBA",
    //   icon: <Ionicons name="trending-up" size={30} color="#0c3b73" />,
    //   key: "17",
    //   navigateTo:"CreateInvoice"
    // },
    // {
    //   name: "Investment/ASBA",
    //   icon: <Ionicons name="trending-up" size={30} color="#0c3b73" />,
    //   key: "18",
    //   navigateTo:"CreateInvoice"
    // },
    // {
    //   name: "Investment/ASBA",
    //   icon: <Ionicons name="trending-up" size={30} color="#0c3b73" />,
    //   key: "19",
    //   navigateTo:"CreateInvoice"
    // },
    // {
    //   name: "Investment/ASBA",
    //   icon: <Ionicons name="trending-up" size={30} color="#0c3b73" />,
    //   key: "20",
    //   navigateTo:"CreateInvoice"
    // },
    // {
    //   name: "Investment/ASBA",
    //   icon: <Ionicons name="trending-up" size={30} color="#0c3b73" />,
    //   key: "21",
    //   navigateTo:"CreateInvoice"
    // },
    // {
    //   name: "Investment/ASBA",
    //   icon: <Ionicons name="trending-up" size={30} color="#0c3b73" />,
    //   key: "22",
    //   navigateTo:"CreateInvoice"
    // },
    // {
    //   name: "Investment/ASBA",
    //   icon: <Ionicons name="trending-up" size={30} color="#0c3b73" />,
    //   key: "23",
    //   navigateTo:"CreateInvoice"
    // },
    // {
    //   name: "Investment/ASBA",
    //   icon: <Ionicons name="trending-up" size={30} color="#0c3b73" />,
    //   key: "24",
    //   navigateTo:"CreateInvoice"
    // },
    // {
    //   name: "Investment/ASBA",
    //   icon: <Ionicons name="trending-up" size={30} color="#0c3b73" />,
    //   key: "25",
    //   navigateTo:"CreateInvoice"
    // },
    // {
    //   name: "Investment/ASBA",
    //   icon: <Ionicons name="trending-up" size={30} color="#0c3b73" />,
    //   key: "26",
    //   navigateTo:"CreateInvoice"
    // },
    // {
    //   name: "Investment/ASBA",
    //   icon: <Ionicons name="trending-up" size={30} color="#0c3b73" />,
    //   key: "27",
    //   navigateTo:"CreateInvoice"
    // },
    // {
    //   name: "Investment/ASBA",
    //   icon: <Ionicons name="trending-up" size={30} color="#0c3b73" />,
    //   key: "28",
    //   navigateTo:"CreateInvoice"
    // },
    // {
    //   name: "Investment/ASBA",
    //   icon: <Ionicons name="trending-up" size={30} color="#0c3b73" />,
    //   key: "29",
    //   navigateTo:"CreateInvoice"
    // },
    // {
    //   name: "Investment/ASBA",
    //   icon: <Ionicons name="trending-up" size={30} color="#0c3b73" />,
    //   key: "30",
    //   navigateTo:"CreateInvoice"
    // },
    // {
    //   name: "Investment/ASBA",
    //   icon: <Ionicons name="trending-up" size={30} color="#0c3b73" />,
    //   key: "31",
    //   navigateTo:"CreateInvoice"
    // },
    // {
    //   name: "Investment/ASBA",
    //   icon: <Ionicons name="trending-up" size={30} color="#0c3b73" />,
    //   key: "32",
    //   navigateTo:"CreateInvoice"
    // },
    // {
    //   name: "Investment/ASBA",
    //   icon: <Ionicons name="trending-up" size={30} color="#0c3b73" />,
    //   key: "33",
    //   navigateTo:"CreateInvoice"
    // },
    // {
    //   name: "Investment/ASBA",
    //   icon: <Ionicons name="trending-up" size={30} color="#0c3b73" />,
    //   key: "34",
    //   navigateTo:"CreateInvoice"
    // },
    // {
    //   name: "Investment/ASBA",
    //   icon: <Ionicons name="trending-up" size={30} color="#0c3b73" />,
    //   key: "35",
    //   navigateTo:"CreateInvoice"
    // },
    // {
    //   name: "Investment/ASBA",
    //   icon: <Ionicons name="trending-up" size={30} color="#0c3b73" />,
    //   key: "36",
    //   navigateTo:"CreateInvoice"
    // },
    // {
    //   name: "Investment/ASBA",
    //   icon: <Ionicons name="trending-up" size={30} color="#0c3b73" />,
    //   key: "37",
    //   navigateTo:"CreateInvoice"
    // },
    // {
    //   name: "Investment/ASBA",
    //   icon: <Ionicons name="trending-up" size={30} color="#0c3b73" />,
    //   key: "38",
    //   navigateTo:"CreateInvoice"
    // },
    // {
    //   name: "Investment/ASBA",
    //   icon: <Ionicons name="trending-up" size={30} color="#0c3b73" />,
    //   key: "39",
    //   navigateTo:"CreateInvoice"
    // },
    // {
    //   name: "Investment/ASBA",
    //   icon: <Ionicons name="trending-up" size={30} color="#0c3b73" />,
    //   key: "40",
    //   navigateTo:"CreateInvoice"
    // },
  ];

  