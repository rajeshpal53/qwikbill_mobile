import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { readApi } from "../Util/UtilApi";
import UserDataContext from "./UserDataContext";
// import { ActivityIndicator } from "react-native-paper";

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [allShops, setAllShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const { userData } = useContext(UserDataContext);
  const [loader, setloader] = useState(false);


  console.log("SELECTED SHOP IS ", selectedShop)

  console.log("USER DATA IS 1578", userData);
  // useEffect(() => {
  //   const loadAllShops = async () => {
  //     try {
  //       // Get stored shops from AsyncStorage
  //       const storedShops = await AsyncStorage.getItem("allShops");

  //       console.log("DATA OF ALL SHOP _________", storedShops)

  //       if (storedShops && JSON.parse(storedShops).length > 0) {
  //         const parsedShops = JSON.parse(storedShops);
  //         setAllShops(parsedShops);

  //         // Load selected shop if exists
  //         const storedSelectedShop = await AsyncStorage.getItem("selectedShop");

  //         // console.log("json parsed storedSelectedShop is , ", JSON.parse(storedSelectedShop));
  //         if (storedSelectedShop) {
  //           // console.log("storedSelectedShop is , ", storedSelectedShop)
  //           setSelectedShop(JSON.parse(storedSelectedShop));
  //         } else {
  //           setSelectedShop(parsedShops[0]); // Default to first shop
  //           await AsyncStorage.setItem("selectedShop", JSON.stringify(parsedShops[0]));
  //         }
  //       } else {
  //        await fetchShopsFromServer();
  //       }
  //     } catch (error) {
  //       console.error("Error loading shops:", error);
  //     }
  //   };

  //   if(userData?.token){
  //     loadAllShops();
  //   }

  // }, [userData]);

  useEffect(() => {
    loadData();
  }, [userData]);

  const loadData = async () => {
    try {
      setloader(true);
      if (userData?.token) {
        await fetchShopsFromServer();
        // await loadAllShops();
      } else {
        console.log("Tokan is not available ");
        setloader(false);
      }
    } catch (error) {
      console.log("Unable to fetch data for user:", error);
    } finally {
      setloader(false);
    }
  };

  // const loadAllShops = async () => {
  //   try {
  //     // Get stored shops from AsyncStorage
  //     const storedShops = await AsyncStorage.getItem("allShops");

  //     console.log("DATA OF ALL SHOP _________", storedShops);

  //     if (storedShops && JSON.parse(storedShops).length > 0) {
  //       const parsedShops = JSON.parse(storedShops);
  //       setAllShops(parsedShops);

  //       // Load selected shop if exists
  //       const storedSelectedShop = await AsyncStorage.getItem("selectedShop");

  //       // console.log("json parsed storedSelectedShop is , ", JSON.parse(storedSelectedShop));
  //       if (storedSelectedShop) {
  //         // console.log("storedSelectedShop is , ", storedSelectedShop)
  //         setSelectedShop(JSON.parse(storedSelectedShop));
  //       } else {
  //         setSelectedShop(parsedShops[0]); // Default to first shop
  //         await AsyncStorage.setItem(
  //           "selectedShop",
  //           JSON.stringify(parsedShops[0])
  //         );
  //       }
  //     } else {
  //       console.log("Else condition work ");
  //     }
  //   } catch (error) {
  //     console.error("Error loading shops:", error);
  //   }
  // };

  const fetchShopsFromServer = async () => {
    try {
      setloader(true);
      // Fetch from backend
      const response = await readApi(
        `vendors/getVendorsByUserId/${userData?.user?.id}`,
        {
          Authorization: `Bearer ${userData?.token}`,
        }
      );
      console.log("response of getting all shops are", response);
      setAllShops(response);
      await AsyncStorage.setItem("allShops", JSON.stringify(response));
      if (allShops.length > 0 && !selectedShop) {
        console.log("Inside a if condition ");
        setSelectedShop(response[0]); // Set first shop as default
        console.log("selectedShop setting is , ", response[0]);
        await AsyncStorage.setItem("selectedShop", JSON.stringify(response[0]));
      } else {
        console.log("Shop not available");
      }

      // if (response?.length > 0) {
      //   console.log("Inside if condition")
      //   setAllShops(response);
      //   await AsyncStorage.setItem("allShops", JSON.stringify(response));
      //   setSelectedShop(response[0]); // Set first shop as default
      //   console.log("selectedShop setting is , ", response[0]);
      //   await AsyncStorage.setItem("selectedShop", JSON.stringify(response[0]));
      // }
    } catch (error) {
      console.log("error getting shops from server is , ", error);
      setloader(false);
    } finally {
      setloader(false);
    }
  };

  // Function to update selected shop
  const updateSelectedShop = async (shop) => {
    setSelectedShop(shop);
    console.log("shop to update is , ", shop);
    await AsyncStorage.setItem("selectedShop", JSON.stringify(shop));
  };

  // if (loader) {
  //   <View style={{ flex: 1, justifyContent: "center" }}>
  //     <ActivityIndicator size={"large"}></ActivityIndicator>
  //   </View>;
  // }

  return (
    <ShopContext.Provider
      value={{
        allShops,
        selectedShop,
        updateSelectedShop,
        fetchShopsFromServer,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
