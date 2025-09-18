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


  useEffect(() => {
    console.log('[Shop] userId ➜', userData?.user?.id, 'token:', !!userData?.token);
  }, [userData]);

  useEffect(() => {
    console.log('[Shop] allShops.length ➜', allShops.length);
  }, [allShops]);

  useEffect(() => {
    console.log('[Shop] selectedShop ➜', selectedShop?.vendor?.id || null);
  }, [selectedShop]);


  useEffect(() => {
    if (userData?.token && userData?.user?.id) {
      fetchShopsFromServer();        // ★ NEW: always call on login
    }
  }, [userData?.user?.id, userData?.token]);


  useEffect(() => {
    if (!userData?.token) {
      setAllShops([]);
      setSelectedShop(null);
      AsyncStorage.multiRemove(['allShops', 'selectedShop']).catch(console.log);
    }
  }, [userData?.token]);


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

        if (response?.data.length === 0) {
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



  // useEffect(() => {
  //   loadData();
  // }, [userData]);

  useEffect(() => {
    if (userData?.token && userData?.user?.id) {
      fetchShopsFromServer();         // ← always fetch for the current user
    }
  }, [userData?.user?.id, userData?.token]);




  const loadData = async () => {
    try {
      setloader(true);

      if (!userData?.token) {
        console.log("User not logged in. Skipping shop loading.");
        return;
      }

      // await fetchShopsFromServer();

      const storedSelectedShop = await AsyncStorage.getItem("selectedShop");

      if (storedSelectedShop) {
        setSelectedShop(JSON.parse(storedSelectedShop));
      } else if (allShops.length > 0) {
        console.log("No stored shop, defaulting to first in allShops");
        setSelectedShop(allShops[0]);
        await AsyncStorage.setItem(
          "selectedShop",
          JSON.stringify(allShops[0])
        );
      }
    } catch (error) {
      console.log("Error loading data:", error);
    } finally {
      setloader(false);
    }
  };


  const fetchShopsFromServer = async () => {
    try {
      if (!userData?.token || !userData?.user?.id) {
        console.log("User not authenticated, skipping shop fetch.");
        return;
      }

      setloader(true);

      const response = await readApi(
        `userRoles/getVendorByUserRolesUserId/${userData.user.id}`,
        {
          Authorization: `Bearer ${userData.token}`,
        }
      );

      if (response?.data) {
        setAllShops(response.data);
        await AsyncStorage.setItem("allShops", JSON.stringify(response.data));

        if (!selectedShop && response.data.length > 0) {
          setSelectedShop(response.data[0]);
          await AsyncStorage.setItem(
            "selectedShop",
            JSON.stringify(response.data[0])
          );
        }
      }
    } catch (error) {
      console.log("Error getting shops from server:", error);
      setSelectedShop(null)
    } finally {
      console.log("Turning off loader");
      setloader(false);
    }
  };
  // Function to update selected shop
  const updateSelectedShop = async (shop) => {
    console.log("shop to update is:", shop);

    if (shop) {
      setSelectedShop(shop);
      await AsyncStorage.setItem("selectedShop", JSON.stringify(shop));
    } else {
      await AsyncStorage.removeItem("selectedShop");
    }
  };
  const clearSelectedShop = async () => {
    try {
      setSelectedShop(null); // Clear from Context
      await AsyncStorage.removeItem("selectedShop"); // Remove from Storage
      console.log("Selected shop cleared.");
      return true;
    } catch (error) {
      console.error("Error clearing selected shop:", error);
      return false;
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
        clearSelectedShop
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
