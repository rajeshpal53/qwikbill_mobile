import {
  FontAwesome5,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons
} from "@expo/vector-icons";


export const rolePermissions = {
  owner: ["Create Invoice", "Add Product", "Add Shop","View Your Shops","Transactions","Product Upload","View Customer", "Accounts Dashboard"],
  manager: ["Create Invoice", "Add Product","View Your Shops","Transactions","Product Upload","View Customer", "Accounts Dashboard"],
  employee:["Create Invoice","View Your Shops","Transactions","View Customer", "Accounts Dashboard"],
  viewer: ["View Your Shops", "Transactions","View Customer", "Accounts Dashboard"], 
};
export const services = [
  {
    name: "Create Invoice",
    icon: <FontAwesome5 name="file-invoice" size={30} color="#26a0df" />,
    key: "1",
    navigateTo: "CreateInvoice",
    testID: "Create-Invoice",
  },
  {
    name: "Add Product",
    icon: <Ionicons name="bag-add-outline" size={30} color="#26a0df" />,
    key: "2",
    navigateTo: "AddProduct",
    testID: "Add-Product",
  },
  // {
  //   name: "Add Customer",
  //   icon: <AntDesign name="adduser" size={30} color="#26a0df" />,
  //   key: "3",
  //   navigateTo:"AddCustomer",
  //   testID:"Add-Customer"
  // },
  {
    name: "Add Shop",
    icon: <MaterialIcons name="add-business" size={30} color="#26a0df" />,
    key: "4",
    navigateTo: "CreateShopScreen",
    testID: "Create-ShopScreen",
  },
  // {
  //   name: "View Vendors",
  //   icon: <FontAwesome name="group" size={30} color="#26a0df" />,
  //   key: "6",
  //   navigateTo:"ViewVendor",
  //   testID:"View-Vendor"
  // },
  {
    name: "View Your Shops",
    icon: <FontAwesome5 name="store" size={30} color="#26a0df" />,
    key: "7",
    navigateTo: "ViewShops",
    testID: "View-Shops",
  },
  {
    name: "Transactions",
    icon: (
      <MaterialCommunityIcons
        name="newspaper-variant"
        size={30}
        color="#26a0df"
      />
    ),
    key: "8",
    navigateTo: "TransactionScreen",
  },
  {
    name: "Product Upload",
    icon: (
      <MaterialCommunityIcons
        name="upload"
        size={30}
        color="#26a0df"
      />
    ),
    key: "8",
    navigateTo: "bulkUpload",
  },
  {
    name: "View Customer",
    icon: (
      <Ionicons
        name="people-outline"
        size={30}
        color="#26a0df"
      />
    ),
    key: "8",
    navigateTo: "Customer",
  },
  {
    name: "Accounts Dashboard",
   // icon: <FontAwesome name="dashboard"  size={30}   color="#26a0df"/>,
    icon: <MaterialIcons name="dashboard"  size={30}   color="#26a0df"/>,

    key: "9",
    navigateTo: "UserAccounts",
  },
  {
    name: "",
    icon: "",
    key: "10",
    navigateTo: "",
  },
  // {
  //   name: "More",
  //   icon: <Feather name="more-horizontal" size={30} color="#26a0df" />,
  //   key: "6",

  //   navigateTo:"ViewShops"
  // },

  // {
  //   name: "Cheque Services",
  //   icon: (
  //     <MaterialCommunityIcons
  //       name="newspaper-variant"
  //       size={22}
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
