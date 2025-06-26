import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL, readApi } from "../Util/UtilApi";
import UserDataContext from "./UserDataContext";
// import { ActivityIndicator } from "react-native-paper";

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [allShops, setAllShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [noItemModal, setNoItemModal] = useState(false);

  const { userData } = useContext(UserDataContext);
  const [loader, setloader] = useState(false);

  // console.log("SELECTED SHOP ISSSSS ", selectedShop);

  // console.log("USER DATA IS 1578", userData?.user?.id);

  // console.log("DATA OF ALL SHOP 1000", allShops);

  //Open for Add product modal
  // useEffect(() => {
  //   const getProductsBYShops = async () => {
  //     const id = userData?.user?.id;
  //     if (!id) return; // early return if id is undefined

  //     try {
  //       let response = await readApi(
  //         `userRoles/getVendorByUserRolesUserId/${id}`,
  //         {
  //           Authorization: `Bearer ${userData?.token}`,
  //         }
  //       );
  //       console.log("response of products in shop context is ", response?.data);


  //       const hasProducts = response.some(
  //         (shop) => Array.isArray(shop.vendor?.product) && shop.vendor.product.length > 0
  //       );

  //       if (hasProducts) {
  //         setNoItemModal(false);
  //       } else {
  //         setNoItemModal(true);
  //       }
  //     } catch (err) {
  //       console.log("unable to get products of shops ", err);
  //     }
  //   };

  //   if (userData?.user?.id) {
  //     getProductsBYShops();
  //   }
  // }, [userData]);





  useEffect(() => {
    const checkSelectedShopProducts = async (id) => {
      if (!selectedShop) return;

      try {
        const response = await readApi(
          `userRoles/getVendorByUserRolesUserId/${id}`,
          {
            Authorization: `Bearer ${userData?.token}`,
          }
        );

        // console.log("Fetched selected shop data:", response?.data);
        console.log(`${API_BASE_URL}userRoles/getVendorByUserRolesUserId/${id}`);

        const matchedShop = response?.data.find(
          (shop) => shop.vendor?.id === selectedShop.vendor?.id
        );

        const hasProducts = Array.isArray(matchedShop?.vendor?.product) && matchedShop.vendor.product.length > 0;

        setNoItemModal(!hasProducts); // Show modal only if selected shop has no products

        if(response?.data.length === 0) {
          setNoItemModal(false); // If no shops found, show modal
        }

      } catch (err) {
        console.log("Error checking products for selected shop:", err);
        
        setNoItemModal(true); // fallback: show modal
      }
    };

    if (selectedShop && userData?.user?.id) {
      checkSelectedShopProducts(userData?.user?.id);
    }
  }, [selectedShop]);



  useEffect(() => {
    loadData();
  }, [userData]);



  const loadData = async () => {
    try {
      setloader(true);
      if (userData?.token) {
        await fetchShopsFromServer();

        const storedSelectedShop = await AsyncStorage.getItem("selectedShop");

        if (storedSelectedShop) {
          // console.log("Render this data ", storedSelectedShop);
          setSelectedShop(JSON.parse(storedSelectedShop));
        } else if (allShops.length > 0) {
          // If no selected shop exists in AsyncStorage, select the first shop by default
          console.log("ALLSHOP IS-------------", allShops[0]);
          setSelectedShop(allShops[0]);
          await AsyncStorage.setItem(
            "selectedShop",
            JSON.stringify(allShops[0])
          );
        }
      } else {
        console.log("Token is not available.");
      }
    } catch (error) {
      console.log("Error loading data:", error);
      setloader(false);
    } finally {
      setloader(false);
    }
  };

  const fetchShopsFromServer = async () => {
    try {
      setloader(true);
      // Fetch from backend
      const response = await readApi(
        `userRoles/getVendorByUserRolesUserId/${userData?.user?.id}`,
        {
          Authorization: `Bearer ${userData?.token}`,
        }
      );
      // console.log("response of getting all shops are", response?.data);
      if (response?.data) {
        setAllShops(response?.data);
        await AsyncStorage.setItem("allShops", JSON.stringify(response?.data));
      }

      if (!selectedShop && response?.data.length > 0) {
        setSelectedShop(response?.data[0]);
        await AsyncStorage.setItem(
          "selectedShop",
          JSON.stringify(response?.data[0])
        );
      }
    } catch (error) {
      console.log("error getting shops from server is , ", error);
      setloader(false);
    } finally {
      console.log("Turning off loader12");
      setloader(false);
    }
  };

  // Function to update selected shop
  const updateSelectedShop = async (shop) => {
    setSelectedShop(shop);
    console.log("shop to update is:", shop);

    if (shop) {
      await AsyncStorage.setItem("selectedShop", JSON.stringify(shop));
    } else {
      await AsyncStorage.removeItem("selectedShop");
    }
  };

  return (
    <ShopContext.Provider
      value={{
        noItemModal,
        setNoItemModal,
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
