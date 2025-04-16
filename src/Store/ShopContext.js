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

  console.log("SELECTED SHOP IS ", selectedShop);

  console.log("USER DATA IS 1578", userData?.user?.id);

  console.log("DATA OF ALL SHOP 1000", allShops);

  //Open for Add product modal
  useEffect(() => {
    const getProductsBYShops = async () => {
      const id = userData?.user?.id;
      if (!id) return; // early return if id is undefined

      try {
        let response = await readApi(
          `userRoles/getVendorByUserRolesUserId/${id}`,
          {
            Authorization: `Bearer ${userData?.token}`,
          }
        );
        console.log("response of products in shop context is ", response?.data);
        console.log(`${API_BASE_URL}vendors/getVendorsByUserId/${id}`);

        const hasProducts = response?.data.some((shop) => shop.product?.length > 0);

        if (hasProducts) {
          setNoItemModal(false);
        } else {
          setNoItemModal(true);
        }
      } catch (err) {
        console.log("unable to get products of shops ", err);
      }
    };

    if (userData?.user?.id) {
      getProductsBYShops();
    }
  }, [userData]);

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
        console.log("Fetched selected shop data:", response?.data);

        // Find the shop that matches the selected shop
        if (!Array.isArray(response?.data) || response?.data.length === 0) {
          setNoItemModal(false); // No vendors → don't show modal
          console.log("This condition")
          return;
        }

        const hasShopname = response?.data.some((shop) => shop.shopname?.trim());
        if (!hasShopname) {
          console.log("This condition2")
          setNoItemModal(false); // No shopname at all → don't show modal
          return;
        }

        const matchedShop = response?.data.find(
          (shop) => shop.shopname === selectedShop.shopname
        );

        const hasProducts = matchedShop?.product?.length > 0;
        setNoItemModal(!hasProducts); // if no products, show modal
      } catch (err) {
        console.log("Error checking products for selected shop:", err);
        setNoItemModal(true); // fallback: show modal
      }
    };

    checkSelectedShopProducts(userData?.user?.id);
  }, [selectedShop]);

  useEffect(() => {
    loadData();
  }, [userData]);

  // const loadData = async () => {
  //   try {
  //     setloader(true);
  //     if (userData?.token) {
  //       await fetchShopsFromServer();
  //       // await loadAllShops();
  //     } else {
  //       console.log("Tokan is not available ");
  //       setloader(false);
  //     }
  //   } catch (error) {
  //     console.log("Unable to fetch data for user:", error);
  //   } finally {
  //     setloader(false);
  //   }
  // };

  const loadData = async () => {
    try {
      setloader(true);
      if (userData?.token) {
        await fetchShopsFromServer();

        const storedSelectedShop = await AsyncStorage.getItem("selectedShop");

        if (storedSelectedShop) {
          console.log("Render this data ", storedSelectedShop);
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
      console.log("response of getting all shops are", response?.data);
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
