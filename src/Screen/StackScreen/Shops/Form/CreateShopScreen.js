import React, { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  Linking,
  Alert,
} from "react-native";
import {
  TextInput,
  Button,
  Checkbox,
  List,
  Divider,
  ActivityIndicator,
} from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
// import {
//   RichEditor,
//   RichToolbar,
//   actions,
// } from "react-native-pell-rich-editor";
import { useIsFocused, useRoute } from "@react-navigation/native";
// import SelectionDropdown from "../../../../ComponentContainer/SelectionDropdown";

import { API_BASE_URL, createApi, NORM_URL, readApi } from "../../../../Util/UtilApi";

// import UserDataContext from "../../../../Store/UserDataContext";
import { useSnackbar } from "../../../../Store/SnackbarContext";
// import { useLocation } from "../../../../Store/LocationContext";
import * as Location from "expo-location";
import ServiceImagePicker from "../../../../Components/ServiceImagePicker";
import { useTranslation } from "react-i18next";
// import ProviderProfileForm from "./ServiceProviderFormSections/ProviderProfileForm";
import ProviderProfileForm from "./ProviderProfileForm";
import ProviderServiceForm from "./ProviderServiceForm";
// import ProviderServiceForm from "./ServiceProviderFormSections/ProviderServiceForm";
// import ProviderMoreDetails from "./ServiceProviderFormSections/ProviderMoreDetails";
// import FormStepper from "./ServiceProviderFormSections/FormStepper";
// import {ProgressStep, ProgressSteps} from "react-native-progress-steps"
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import Icon from "react-native-vector-icons/AntDesign";
import axios from "axios";
import UserDataContext from "../../../../Store/UserDataContext";
import ProviderMoreDetails from "./ProviderMoreDetails";
import { ShopContext } from "../../../../Store/ShopContext";

// Form validation schema using Yup

// const validationSchema = Yup.object().shape({
//   name: Yup.string().required("name is required"),
//   shopName: Yup.string().required("Shop Name is required"),
//   whatsappNumber: Yup.string()
//     .matches(/^[6-9]\d{9}$/, "Invalid WhatsApp number")
//     .required("WhatsApp number is required"),
//   aadhaarNumber: Yup.string()
//     .matches(/^\d{12}$/, "Aadhaar number must be 12 digits")
//     .required("Aadhaar number is required"),
//   location: Yup.string().required("Location is required"),
//   kilometerRadius: Yup.number()
//     .min(1, "Kilometer radius must be greater than 0")
//     .required("Kilometer radius is required"),
//   email: Yup.string().email("Invalid email").required("Email is required"),
//   gender: Yup.string().required("Gender is required"),
//   age: Yup.number()
//     .required("age is required")
//     .min(5, "age is atleast 5 years") // Minimum age limit
//     .max(99, "age must be at most 99"), // Maximum age limit
// });

const uploadImagesSchema = Yup.object().shape({
  aadhaarNumber: Yup.string()
    .matches(/^\d{12}$/, "Aadhaar number must be 12 digits")
    .required("Aadhaar number is required"),

  aadharFrontImage: Yup.mixed().required("Aadhar Front image is required"),

  aadharBackImage: Yup.mixed().required("Aadhar Back image is required"),
});

const ShopValidataionSchema = Yup.object().shape({
  shopName: Yup.string().required("Shop Name is required"),
  shopAddress: Yup.string().required("Shop Address is required"),
  // gstNumber: Yup.string().matches(
  //   /^[A-Z]{2}[0-9]{1}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z0-9]{1}[Z]{1}[0-9]{1}$/,
  //   "Invalid GSTIN format. GSTIN should be 15 characters: State Code (2 letters) + 1 digit + PAN (5 letters + 4 digits + 1 letter) + 1 digit + 1 letter (usually Z) + 1 digit."
  // )  
  // location: Yup.string().required("Location is required"),
  // kilometerRadius: Yup.number()
  //   .min(1, "Kilometer radius must be greater than 0")
  //   .required("Kilometer radius is required"),
});

const ProfileValidationSchema = Yup.object().shape({
  profileImage: Yup.mixed().required("profile image is required"),
  name: Yup.string().required("name is required"),
  whatsappNumber: Yup.string()
    .required("WhatsApp number is required")
    .matches(/^[6-9]\d{9}$/, "Invalid WhatsApp number"),



  mobile: Yup.string().required("mobile number is required"),
  // .matches(/^[6-9]\d{9}$/, "Invalid Mobile Number")
  // email: Yup.string().email("Invalid email"),
  // .required("Email is required"),
  gender: Yup.string().required("Gender is required"),
  dob: Yup.string()
    .required("DOB is required")
    .test("min-age", "You must be at least 5 years old", function (value) {
      if (!value) return false;

      // Parse the entered DOB
      const enteredDate = new Date(value);

      // Ensure it's a valid date
      if (isNaN(enteredDate.getTime())) return false;

      // Get today's date
      const today = new Date();

      // Calculate the minimum age date (5 years ago from today)
      const minAgeDate = new Date(
        today.getFullYear() - 5,
        today.getMonth(),
        today.getDate()
      );

      // The entered DOB must be earlier than or equal to minAgeDate
      return enteredDate <= minAgeDate;
    }),

  //------------------------------------------------

  // userAddress : Yup.string()
  // .required("address is required"),
  // age: Yup.number()
  //   .required("age is required")
  //   .min(5, "age is atleast 5 years") // Minimum age limit
  //   .max(99, "age must be at most 99"), // Maximum age limit
});

const CreateShopScreen = ({ navigation }) => {
  let months = [
    "January",
    "Feburary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const route = useRoute();

  const { fetchShopsFromServer } = useContext(ShopContext);
  const [pages, setPages] = useState([1, 2, 3]);
  const [currentStep, setCurrentStep] = useState(0);
  const [editorContent, setEditorContent] = useState("");
  const [genderDropDownVisible, setGenderDropDownVisible] = useState(false);
  const [shopImage, setShopImage] = useState(null);
  const [aadharImage, setAadharImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const richText = useRef();
  const routeData = route?.params?.editItem || null;
  const isAdmin = route?.params?.isAdmin ?? false;
  const isFocused = useIsFocused();
  // console.log("routeLocation = ", routeLocation);
  const { showSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  // const { location } = useLocation();
  // const { getAddressFrom } = useLocation();
  const submit = useRef(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const [role, Setrole] = useState("");
  const [roleId, setroleId] = useState(null);

  const { t } = useTranslation();

  const { userData, saveUserData } = useContext(UserDataContext);

  // const routeData = useRoute()?.params?.routeData || null;
  // const isUpdateAddress = useRoute()?.params?.isUpdateAddress || null;

  console.log("USER DATA IS15369 ", routeData);

  const [genderList, setGenderList] = useState([
    { label: "Select Gender", value: null },
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "other" },
  ]);
  const textInputMode = "flat";
  const progressRef = useRef(null);

  // const [genderList, setGenderList] = useState([
  //   { gender: "Male" },
  //   { gender: "Female" },
  //   { gender: "Other" },
  // ]);

  const [selectedGender, setSelectedGender] = useState(() => {
    console.log("routedata is the , ", routeData);
    if (routeData) {
      const gender = genderList.find((item) => {
        return item?.value?.toLocaleLowerCase() === routeData?.user?.gender;
      });
      console.log("userData , ", userData);
      console.log("found gender is , ", gender);
      return gender?.value || userData?.user?.gender || "";
    } else if (!isAdmin) {
      const gender = genderList.find((item) => {
        return item?.value?.toLocaleLowerCase() === userData?.user?.gender;
      });

      return gender?.gender || userData?.user?.gender || "";
    } else {
      return "Select Gender";
    }
  });

  // console.log("route data is , ", routeData)
  console.log("userData is , ", userData);

  const [initialData, setInitialData] = useState({
    name: userData?.user?.name || "",
    mobile: userData?.user?.mobile || "",
    email: userData?.user?.email || "",
    gender: userData?.user?.gender || "",
    dob: new Date() || null,
    shopName: routeData?.shopname || "",
    whatsappNumber: routeData?.whatsappnumber || "",
    aadhaarNumber: userData?.user?.aadharCard || "",
    location: userData?.user?.aadharCard || "",
    kilometerRadius: "",
    latitude: routeData?.latitude || "",
    longitude: routeData?.longitude || "",
    isApproved: routeData?.shopname || false,
    gstNumber: routeData?.gstNumber || "",
    // isOnline: false,
    // isVerified: false,
    // homeDelivery: false,
    // showAddress: "",
    shopImage: routeData?.shopImage || null,
    aadharFrontImage: userData?.user?.aadharCardFronturl || null,
    aadharBackImage: userData?.user?.aadharCardBackurl || null,
    profileImage: userData?.user?.profilePicurl || null,
  });

  useEffect(() => {
    const handleBackPress = navigation.addListener("beforeRemove", (e) => {
      if (!submit.current && !isFormSubmitted) {
        e.preventDefault();

        Alert.alert(
          "Warning!",
          "If you go back, all of your Filled Form Data will be lost. Are you sure you want to go back?",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Yes",
              style: "destructive",
              onPress: () => {
                navigation.dispatch(e.data.action);
                return true;
              },
            },
          ]
        );
      }
    });

    return handleBackPress;
  }, [navigation, isFormSubmitted]);

  useEffect(() => {
    navigation.setOptions({
      title: routeData ? "Edit a Vendor" : "Add a Vendor",
    });

    const setContent = () => {
      console.log("content is the , ", routeData);
      if (routeData) {
        if (routeData?.details) {
          if (routeData.details == "undefined") {
            setEditorContent("");
          } else {
            setEditorContent(routeData.details);
          }
        } else {
          setEditorContent("");
        }
      }
    };

    setContent();
  }, [navigation]);

  useEffect(() => {
    console.log("selected Gender ", selectedGender);
  }, [selectedGender]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const api = `roles`;
        const response = await readApi(api);
        Setrole(response); // Ensure response is an array

        if (role.length > 0) {
          const { id } = role[0];
          setroleId(id);
          console.log("Data of id:", id);
        }
      } catch (error) {
        console.log("Unable to fetch role data", error);
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    if (routeData) {
      setRouteData();
    } else if (!isAdmin) {
      setDataWithoutRouteData();
    }
  }, [routeData]);

  const parseServerDate = (dateString) => {
    console.log("Hi date , ", dateString);
    // Parse the date string "01 June 2024" to a Date object
    if (/\d{1,2} [a-zA-Z]+ \d{4}/.test(dateString)) {
      const [day, monthName, year] = dateString.split(" ");
      const month = months?.indexOf(monthName);
      console.log("new date bro , ", new Date(year, month, day));
      return new Date(year, month, day); // Return Date object
    } else {
      return new Date();
    }
  };

  // Utility function to format date as dd-mm-yyyy
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0"); // Ensures 2 digits
    const month = date.toLocaleString("default", { month: "long" }); // Full month name
    const year = date.getFullYear();
    return `${day} ${month} ${year}`; // Concatenate in "DD Month YYYY" format
  };

  const setRouteData = async () => {
    try {
      setIsLoading(true);
      console.log("sdfsdfh, toute , ", routeData);
      if (routeData) {
        console.log("sdfsdfh, toute 1 is, ", routeData?.user);
        // const tempShowAddress = await getAddressFrom(
        //   routeData?.latitude,
        //   routeData?.longitude
        // );

        console.log("under if routeData ", routeData.whatsappnumber);
        // console.log(
        //   "under if routeData tempshowaddress ",
        //   tempShowAddress?.formatted_address
        // );
        setInitialData({
          name: routeData?.user?.name || "",
          mobile: routeData?.user?.mobile || "",
          email: routeData?.user?.email || "",
          gender: routeData?.user?.gender || userData?.user?.gender || "",
          dob:
            (routeData?.user?.dob && parseServerDate(routeData?.user?.dob)) ||
            new Date() ||
            null,
          userAddress: routeData?.user?.address || "",
          pincode: routeData?.user?.pincode || "",
          shopName: routeData?.shopname || "",
          shopAddress: routeData?.shopAddress || "",
          gstNumber: routeData?.gstNumber || "",
          whatsappNumber: routeData?.whatsappnumber || "",
          aadhaarNumber:
            routeData?.aadharCard || routeData?.user?.aadharCard || "",

          kilometerRadius: routeData?.drange || "",
          latitude: routeData?.latitude || "",
          longitude: routeData?.longitude || "",
          isApproved: routeData?.isApprove || false,
          isOnline: routeData?.isOnline || false,
          isVerified: routeData?.isVerified || false,
          homeDelivery: routeData?.homeServiceProvide || false,
          // showAddress: tempShowAddress?.formatted_address || "",
          shopImage:
            (routeData?.shopImage &&
              formatUrl(routeData?.shopImage, "shopImage")) ||
            null,
          aadharFrontImage:
            (routeData?.user?.aadharCardFronturl &&
              formatUrl(
                routeData?.user?.aadharCardFronturl,
                "aadharCardFronturl"
              )) ||
            null,
          aadharBackImage:
            (routeData?.user?.aadharCardBackurl &&
              formatUrl(
                routeData?.user?.aadharCardBackurl,
                "aadharCardBackurl"
              )) ||
            null,
          profileImage:
            (routeData?.user?.profilePicurl &&
              formatUrl(routeData?.user?.profilePicurl, "profilePicurl")) ||
            null,
        });
      }
    } catch (error) {
      console.log("eror is , ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setDataWithoutRouteData = async () => {
    try {
      setIsLoading(true);

      setInitialData((prevData) => ({
        ...prevData,
        name: userData?.user?.name || "",
        mobile: userData?.user?.mobile || "",
        email: userData?.user?.email || "",
        gender: userData?.user?.gender || "",
        dob:
          (userData?.user?.dob && parseServerDate(userData?.user?.dob)) ||
          new Date(),
        profileImage:
          (userData?.user?.profilePicurl &&
            formatUrl(userData?.user?.profilePicurl, "profilePicurl")) ||
          null,
        aadharFrontImage:
          (userData?.user?.aadharCardFronturl &&
            formatUrl(
              userData?.user?.aadharCardFronturl,
              "aadharCardFronturl"
            )) ||
          null,
        aadharBackImage:
          (userData?.user?.aadharCardBackurl &&
            formatUrl(
              userData?.user?.aadharCardBackurl,
              "aadharCardBackurl"
            )) ||
          null,
        aadhaarNumber: userData?.user?.aadharCard || "",
      }));
    } catch (error) {
      console.log("eror is , ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatUrl = (url, imageDetail) => {
    const imageFile = {
      uri: `${NORM_URL}${url}`,
      // uri: `${NORM_URL}/${url}`,
      name: `${imageDetail}.jpeg`,
      type: `image/jpeg`,
    };

    console.log("imagefie , ", imageFile);
    return imageFile;
  };

  //  // Convert `dd-mm-yyyy` to a `Date` object
  //  const parseServerDate = (dateString) => {
  //   // Parse the date string "01 June 2024" to a Date object

  //   const [day, monthName, year] = dateString.split(" ");
  //   const month = new Date(`${monthName} 1, 2024`).getMonth(); // Get month index (0-based)
  //   return new Date(year, month, day); // Return Date object
  // };

  const handleGenderDropDownPress = () => {
    setGenderDropDownVisible((prev) => !prev);
  };

  const getLatAndLong = async (setFieldValue) => {
    // Request location permission
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status === "denied") {
      // Check if the user has denied permanently
      const permissionResponse = await Location.getForegroundPermissionsAsync();
      if (permissionResponse.canAskAgain) {
        console.log("Permission denied but can ask again.");
        showSnackbar("Permission denied but can ask again.", "error");
      } else {
        console.log("Permission denied permanently.");
        Alert.alert(
          "Location Permission Needed",
          "Please enable location permissions in your device settings to continue.",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Open Settings",
              onPress: () => Linking.openSettings(),
            },
          ]
        );
      }
      return;
    }

    if (status === "granted") {
      try {
        let location = await Location.getCurrentPositionAsync({});
        console.log("location , ", location);

        const routeData = await getAddressFrom(
          location?.coords?.latitude,
          location?.coords?.longitude
        );

        // console.log("routeData , ", routeData?.formatted_address);
        const formattedAddress = routeData?.formatted_address;
        setFieldValue("showAddress", formattedAddress);

        setFieldValue("latitude", String(location?.coords?.latitude));
        setFieldValue("longitude", String(location?.coords?.longitude));
        console.log("setted");
        showSnackbar("Current location is Selected Successfully", "success");
      } catch (error) {
        showSnackbar(error, "error");
      }
    }
  };

  const handleNextStep = async (validateForm, setFieldTouched) => {
    const errors = await validateForm();

    // Blur (mark as touched) only the fields with errors
    Object.keys(errors).forEach((field) => {
      if (errors[field]) {
        setFieldTouched(field, true); // Mark fields with errors as touched
      }
    });

    if (Object.keys(errors).length > 0) {
      console.log("validation failed ", errors);
      return false;
    } else if (currentStep < 2) {
      console.log("next steop");
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", backgroundColor: "#fff" }}
      >
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  // useEffect(() => {
  //   console.log(" values are m  ini", initialData);
  // }, [initialData]);

  return (
    <Formik
      initialValues={initialData}
      enableReinitialize={true}
      validationSchema={
        currentStep === 0
          ? ProfileValidationSchema
          : currentStep === 1
          ? ShopValidataionSchema
          : uploadImagesSchema
      }
      onSubmit={async (values) => {
        console.log("hi prathesm");
        console.log("submitted Values are ", values);

        let createdUserId = null;

        const updateUserPayloadData = new FormData();

        updateUserPayloadData.append("name", values?.name);
        updateUserPayloadData.append("mobile", values?.mobile);
        updateUserPayloadData.append("aadharCard", values?.aadhaarNumber);

        const formattedDate = formatDate(values?.dob);
        updateUserPayloadData.append("dob", formattedDate);

        updateUserPayloadData.append("email", values?.email || "");
        updateUserPayloadData.append("gender", values?.gender);

        // console.log("gender is , ", values?.gender);
        if (values?.profileImage) {
          console.log("profdkdkd 111, ", values?.profileImage);
          updateUserPayloadData.append("profilePicurl", values?.profileImage);
        }
        if (values?.aadharFrontImage) {
          updateUserPayloadData.append(
            "aadharCardFronturl",
            values?.aadharFrontImage
          );
        }

        if (values?.aadharBackImage) {
          updateUserPayloadData.append(
            "aadharCardBackurl",
            values?.aadharBackImage
          );
        }

        updateUserPayloadData.append("password", userData?.user?.password);

        // updateUserPayloadData.append("roles", "admin");

        // console.log("router ddd , data is , ", routeData);
        console.log("updateUserPayloadData is the , ", updateUserPayloadData);
        console.log(
          "userApi , ",
          `${API_BASE_URL}users/upsertOnlyUserProfileImg`
        );
        console.log("userData token , ", `${userData?.token}`);

        try {
          const response = await axios.post(
            `${API_BASE_URL}users/upsertOnlyUserProfileImg`,
            updateUserPayloadData,
            {
              headers: {
                Authorization: `Bearer ${userData?.token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );

          console.log(
            "response of user updated or created is , ",
            response?.data
          );
          createdUserId = response?.data?.id;

          if (!isAdmin || routeData?.user?.mobile === userData?.user?.mobile) {
            const saveUser = {
              token: userData?.token,
              user: response?.data,
            };

            saveUserData(saveUser);
          }

          showSnackbar(t("Your profile has been updated"), "success");
        } catch (error) {
          console.log("Error creating or updating user , ", error);
        } finally {
        }

        const data = new FormData();
        // data.append("aadharCard", values?.aadhaarNumber);

        data.append("whatsappnumber", values?.whatsappNumber || "");
        data.append("shopname", values?.shopName);
        // data.append("homeServiceProvide", values?.homeDelivery);
        // if(editorContent){
        data.append("details", editorContent);
        // }
        data.append("shopAddress", values?.shopAddress);
        data.append("latitude", values?.latitude || "213.234");
        data.append("longitude", values?.longitude || "213.234");
        // data.append("drange", values?.kilometerRadius);
        // data.append("isOnline", values?.isOnline);

        if (isAdmin) {
          // data.append("isVerified", values?.isVerified);
          data.append("isApprove", values?.isApproved);
        } else if (!isAdmin && routeData) {
          // data.append("isVerified", routeData?.isVerified);
          data.append("isApprove", routeData?.isApprove);
        } else {
          // data.append("isVerified", false);
          data.append("isApprove", false);
        }

        const userfk = routeData ? routeData?.user?.id : createdUserId;

        data.append("usersfk", userfk);

        if (routeData) {
          data.append("id", routeData?.id);
        }

        // If the image is a local file, include it as a binary file
        if (values?.shopImage) {
          data.append("shopImage", values?.shopImage);
        }

        // if (values?.aadharImage) {
        //   data.append("aadharCardurl", aadharImage);
        // }

        // console.log("image si , ", shopImage);
        console.log("updateProviderPayload is , ", data);

        try {
          if (!isLoading) {
            setIsLoading(true);
          }

          if (routeData) {
            const response = await axios.put(
              `${API_BASE_URL}vendors/updateVendorWithImage/${routeData?.id}`,
              data,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${userData?.token}`,
                },
              }
            );
            console.log("Service provider Updated successfullyyy: ", response);

            showSnackbar(t("Service provider Updated successfully"), "success");

            // navigation.navigate("ViewEditServicesScreen", {
            //   Admin: isAdmin,
            // });
            submit.current = true;
            // navigation.pop(2);
            navigation.goBack();
          } else {
            const response = await axios.post(
              `${API_BASE_URL}vendors/createVendorWithImage`,
              data,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${userData?.token}`,
                },
              }
            );

            console.log("Service provider Created Successfully ", response);

            showSnackbar(t("Service provider Created Successfully"), "success");

            // navigation.navigate("ViewEditServicesScreen", {
            //   Admin: isAdmin,
            // });

            if (!isAdmin) {
              await fetchShopsFromServer();
            }
            submit.current = true;
            // navigation.pop(2);
            navigation.goBack();
          }
        } catch (error) {
          if (isLoading) {
            setIsLoading(false);
          }

          if (routeData) {
            console.log("DATA OF USER ", routeData)
            console.log(
              "Something went Wrong Updating Service Provider route data",
              error
            );

            showSnackbar(
              t("Something went Wrong Updating Service Provider route data"),
              "error"
            );
          } else {
            console.log(
              "Something went Wrong Creating Service Provider else route ",
              error
            );

            showSnackbar(
              t("Something went Wrong Creating Service Provider route data"),
              "error"
            );
          }
        } finally {
          setIsLoading(false);
        }
      }}
      // onSubmit={async (values, { resetForm }) => {
      //   const formattedDate = formatDate(values?.dob);
      //   console.log("Data of date", values?.dob);
      //   console.log("hi prathesm");
      //   console.log("submitted Values are ", values);
      //   const DataContainer = {
      //     ...values,
      //     VenderData: [
      //       {
      //         whatsappnumber: values?.whatsappNumber,
      //         details: values?.whatsappNumber || "",
      //         shopAddress: values?.shopAddress,
      //         pincode: values.pincode,
      //         isApprove: values?.isOnline,
      //         usersfk: userData?.user?.id,
      //         shopImage: values?.shopImage || null,
      //         latitude: 213.234, //values?.latitude ||
      //         longitude: 213.234, //values?.longitude,
      //         shopname: values?.shopName,
      //       },
      //     ],
      //     UserData: [
      //       {
      //         mobile: values?.mobile || "",
      //         aadharCard: values?.aadhaarNumber || "",
      //         aadharCardFronturl: values?.aadharFrontImage?.uri || "",
      //         aadharCardBackurl: values?.aadharBackImage?.uri || "",
      //         profilePicurl: values?.profileImage?.uri || "",
      //         name: values?.name || "",
      //         dob: formattedDate,
      //         gender: values?.gender || "",
      //         email: values?.email || "",
      //         address: values?.shopAddress || "",
      //         pincode: values?.pincode || "",
      //         password: userData?.user?.password || "",
      //         token_validity: values?.token_validity || null,
      //         latitude: 213.234 || "",
      //         longitude: 213.234 || "",
      //         fcmtokens: userData?.token || "",
      //         rolesfk: roleId,
      //       },
      //     ],
      //   };
      //   try {
      //     if (DataContainer.VenderData) {
      //       const api = `vendors`;
      //       const headers = {
      //         Authorization: `Bearer ${userData?.token}`, // Add token to headers
      //       };
      //       const VenderResponse = await createApi(
      //         api,
      //         DataContainer.VenderData[0],
      //         headers
      //       );
      //       console.log("Vender Data Created", VenderResponse);
      //     }
      //     if (DataContainer.UserData) {
      //       const api = `users/upsertOnlyUserProfileImg`;
      //       const headers = {
      //         Authorization: `Bearer ${userData?.token}`, // Add token to headers
      //       };
      //       const UserResponse = await createApi(
      //         api,
      //         DataContainer.UserData[0],
      //         headers
      //       );
      //       console.log(" User Data Created", UserResponse);
      //     }
      //     setIsFormSubmitted(true);
      //     submit.current = true;
      //     resetForm();
      //     navigation.goBack();
      //   } catch (error) {
      //     console.log("Unable to create a data", error);
      //   }
      // }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        setFieldTouched,
        validateForm,
        values,
        errors,
        touched,
      }) => {
        return (
          <View
            style={{
              paddingHorizontal: 20,

              //  backgroundColor: "orange",
              //  padding:5,
              flex: 1,
              backgroundColor: "#fff",
              gap: 10,
            }}
          >
            <ProgressSteps
              activeStep={currentStep}
              topOffset={10}
              marginBottom={20}
            >
              <ProgressStep
                label="Profile Details"
                scrollViewProps={styles.scrollViewProps}
                removeBtnRow={true}
              >
                <View>
                  <ProviderProfileForm
                    title={"Profile Details"}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    values={values}
                    touched={touched}
                    errors={errors}
                    selectedGender={selectedGender}
                    genderDropDownVisible={genderDropDownVisible}
                    handleGenderDropDownPress={handleGenderDropDownPress}
                    genderList={genderList}
                    setSelectedGender={setSelectedGender}
                    setGenderDropDownVisible={setGenderDropDownVisible}
                    textInputMode={textInputMode}
                    profileImage={profileImage}
                    routeProfileImageUrl={routeData?.aadharCardurl}
                    setProfileImage={setProfileImage}
                    isAdmin={isAdmin}
                    isRouteDataPresent={routeData ? true : false}
                    profileImageField="profileImage"
                  />
                </View>
              </ProgressStep>
              <ProgressStep
                label="Shop Details"
                removeBtnRow={true}
                scrollViewProps={styles.scrollViewProps}
                // previousBtnTextStyle={{ display: 'none' }}
              >
                <View>
                  <ProviderServiceForm
                    title={"Shop Details"}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    values={values}
                    touched={touched}
                    errors={errors}
                    getLatAndLong={getLatAndLong}
                    navigation={navigation}
                    isAdmin={isAdmin}
                    richText={richText}
                    editorContent={editorContent}
                    setEditorContent={setEditorContent}
                    textInputMode={textInputMode}
                    shopImageField="shopImage"
                  />
                </View>
              </ProgressStep>
              <ProgressStep
                label="Upload Images"
                onSubmit={handleSubmit}
                scrollable={true}
                removeBtnRow={true}
                scrollViewProps={styles.scrollViewProps}
              >
                <View>
                  <ProviderMoreDetails
                    title={"Upload Images"}
                    shopImage={shopImage}
                    setShopImage={setShopImage}
                    aadharImage={aadharImage}
                    setAadharImage={setAadharImage}
                    profileImage={profileImage}
                    setProfileImage={setProfileImage}
                    routeProviderImageUrl={routeData?.shopImage}
                    routeAadharImageUrl={routeData?.aadharCardurl}
                    isAdmin={isAdmin}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    values={values}
                    setFieldValue={setFieldValue}
                    touched={touched}
                    errors={errors}
                    textInputMode={textInputMode}
                    aadharFrontImageField="aadharFrontImage"
                    aadharBackImageField="aadharBackImage"
                  />
                </View>
              </ProgressStep>
            </ProgressSteps>

            {/* --------------------------------------------------------------------------------------------- */}

            <View style={{ gap: 5 }}>
              <View
                style={{
                  // backgroundColor:"orange",
                  flexDirection: "row",
                  gap: 5,
                  // alignSelf:"flex-end"
                  marginVertical: 10,
                }}
              >
                <Button
                  mode="contained"
                  // icon={"arrow-left"}
                  onPress={handlePrevStep}
                  disabled={currentStep === 0 ? true : false}
                  // style={{ flex: 1 }}
                >
                  {/* Previous */}
                  <Icon name="arrowleft" size={20} color="#fff" />
                </Button>

                {currentStep < 2 && (
                  <Button
                    mode="contained"
                    // icon={"arrow-right"}
                    contentStyle={{ flexDirection: "row-reverse" }}
                    disabled={currentStep === 2 ? true : false}
                    onPress={() =>
                      handleNextStep(validateForm, setFieldTouched)
                    }
                    style={{ flex: 1 }}
                  >
                    Next
                  </Button>
                )}

                {currentStep === 2 && (
                  <Button
                    mode="contained"
                    onPress={handleSubmit}
                    disabled={currentStep === 2 ? false : true}
                    style={{ flex: 1 }}
                  >
                    {t("Submit")}
                  </Button>
                )}
              </View>
            </View>
          </View>
        );
      }}
    </Formik>
  );
};
const styles = StyleSheet.create({
  scrollViewProps: {
    showsVerticalScrollIndicator: false,
  },
  progressBar: {
    marginBottom: 0,
    backgroundColor: "orange",
    padding: 10,
  },
  stepperContainer: {
    // position:"absolute",
    top: 0, // Just below the header
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "#fff", // Ensure it's not transparent
    // Border for visual separation
    borderBottomWidth: 1,
    borderBottomColor: "#d3d3d3",
  },
  input: {
    backgroundColor: "#fff",
  },
  editor: {
    flex: 1,
    // height: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
  },
  genderDropdownContainer: {
    backgroundColor: "#f1f1f1",
    // position:"relative",
    height: 170,
  },
});

export default CreateShopScreen;

//-----------------------------------Submit Code------------------------------------------------------

// return ;
//   // usersfk in s-diaryy
//   let createdUserId = null;

//   const updateUserPayloadData = new FormData();

//   updateUserPayloadData.append("name", values?.name);
//   updateUserPayloadData.append("mobile", values?.mobile);
//   updateUserPayloadData.append("aadharCard", values?.aadhaarNumber);

//   const formattedDate = formatDate(values?.dob);
//   updateUserPayloadData.append("dob", formattedDate);

//   updateUserPayloadData.append("email", values?.email || "");
//   updateUserPayloadData.append("gender", values?.gender);

//   // console.log("gender is , ", values?.gender);
//   if (values?.profileImage) {
//     console.log("profdkdkd 111, ", values?.profileImage);
//     updateUserPayloadData.append("profilePicurl", values?.profileImage);
//   }
//   if (values?.aadharFrontImage) {
//     updateUserPayloadData.append(
//       "aadharCardFronturl",
//       values?.aadharFrontImage
//     );
//   }

//   if (values?.aadharBackImage) {
//     updateUserPayloadData.append(
//       "aadharCardBackurl",
//       values?.aadharBackImage
//     );
//   }

//   updateUserPayloadData.append("password", userData?.user?.password)

//   // updateUserPayloadData.append("roles", "admin");

//   // console.log("router ddd , data is , ", routeData);
//   console.log("updateUserPayloadData is the , ", updateUserPayloadData);
//   console.log("userApi , ", `${API_BASE_URL}users/upsertOnlyUserProfileImg`);
//   console.log("userData token , ", `${userData?.token}`);

//   try {
//     const response = await axios.post(
//       `${API_BASE_URL}users/upsertOnlyUserProfileImg`,
//       updateUserPayloadData,
//       {
//         headers: {
//           Authorization: `Bearer ${userData?.token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );

//     console.log(
//       "response of user updated or created is , ",
//       response?.data
//     );
//     createdUserId = response?.data?.id;

//     if (!isAdmin || routeData?.user?.mobile === userData?.user?.mobile) {
//       const saveUser = {
//         token: userData?.token,
//         user: response?.data,
//       };

//       saveUserData(saveUser);
//     }

//     showSnackbar(t("Your profile has been updated"), "success");
//   } catch (error) {
//     console.log("Error creating or updating user , ", error);
//   } finally {
//   }

//   try{
//     const api = `users/upsertOnlyUserProfileImg`
//     const headers = {
//       Authorization: `Bearer ${userData?.token}`, // Add token to headers
//     };
//     const response = readApi(api, updateUserPayloadData, headers)

//   }catch (error){
//     console.log("Unable to upload data", error)
//   }

//   const data = new FormData();
//   // data.append("aadharCard", values?.aadhaarNumber);

//   data.append("whatsappnumber", values?.whatsappNumber || "");
//   data.append("shopname", values?.shopName);
//   // data.append("homeServiceProvide", values?.homeDelivery);
//   // if(editorContent){
//     data.append("details", editorContent);
//   // }
//   data.append("address", values?.shopAddress);
//   data.append("latitude", values?.latitude || "213.234");
//   data.append("longitude", values?.longitude || "213.234");
//   // data.append("drange", values?.kilometerRadius);
//   // data.append("isOnline", values?.isOnline);

//   if (isAdmin) {
//     // data.append("isVerified", values?.isVerified);
//     data.append("isApprove", values?.isApproved);
//   } else if (!isAdmin && routeData) {
//     // data.append("isVerified", routeData?.isVerified);
//     data.append("isApprove", routeData?.isApprove);
//   } else {
//     // data.append("isVerified", false);
//     data.append("isApprove", false);
//   }

//   const userfk = routeData ? routeData?.user?.id : createdUserId;

//   data.append("usersfk", userfk);

//   if (routeData) {
//     data.append("id", routeData?.id);
//   }

//   // If the image is a local file, include it as a binary file
//   if (values?.shopImage) {
//     data.append("shopImage", values?.shopImage);
//   }

//   // if (values?.aadharImage) {
//   //   data.append("aadharCardurl", aadharImage);
//   // }

//   // console.log("image si , ", shopImage);
//   console.log("updateProviderPayload is , ", data);

//   try {
//     if (!isLoading) {
//       setIsLoading(true);
//     }

//     if (routeData) {
//       const response = await axios.put(
//         `${API_BASE_URL}vendors/updateVendorWithImage/${routeData?.id}`,
//         data,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${userData?.token}`,
//           },
//         }
//       );

//       console.log("Service provider Updated successfullyyy: ", response);

//       showSnackbar(t("Service provider Updated successfully"), "success");

//       // navigation.navigate("ViewEditServicesScreen", {
//       //   Admin: isAdmin,
//       // });
//       submit.current = true;
//       // navigation.pop(2);
//       navigation.goBack();
//     } else {
//       const response = await axios.post(
//         `${API_BASE_URL}vendors/createVendorWithImage`,
//         data,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${userData?.token}`,
//           },
//         }
//       );

//       console.log("Service provider Created Successfully ", response);

//       showSnackbar(t("Service provider Created Successfully"), "success");

//       // navigation.navigate("ViewEditServicesScreen", {
//       //   Admin: isAdmin,
//       // });
//       submit.current = true;
//       // navigation.pop(2);
//       navigation.goBack();
//     }
//   } catch (error) {
//     if (isLoading) {
//       setIsLoading(false);
//     }

//     if (routeData) {
//       console.log(
//         "Something went Wrong Updating Service Provider",
//         error
//       );

//       showSnackbar(
//         t("Something went Wrong Updating Service Provider"),
//         "error"
//       );
//     } else {
//       console.log(
//         "Something went Wrong Creating Service Provider",
//         error
//       );

//       showSnackbar(
//         t("Something went Wrong Creating Service Provider"),
//         "error"
//       );
//     }
//   } finally {
//     setIsLoading(false);
//   }
// }}

//-------------------------------------------------------------------------------------------------------------------------
// import React, { useState } from "react";
// import { View, StyleSheet, ScrollView } from "react-native";
// import { Button, Card, Divider, Text } from "react-native-paper";
// import { Formik } from "formik";
// import * as Yup from "yup";
// import { useNavigation } from "@react-navigation/native";
// import CustomTextInput from "../../Components/Custom/CustomTextInput";
// import { createApi, updateApi } from "../../Util/UtilApi";
// import { useSnackbar } from "../../Store/SnackbarContext";
// import { useRoute } from "@react-navigation/native";
// // Validation Schema using Yup
// const validationSchema = Yup.object().shape({
//   shopName: Yup.string()
//     .required("Shop name is required")
//     .min(2, "Shop name must be at least 2 characters long"),
//   email: Yup.string()
//     .email("Invalid email format")
//     .required("Email is required"),
//   country: Yup.string().required("Country is required"),
//   state: Yup.string()
//     .required("State is required")
//     .min(2, "State must be at least 2 characters long"),
//   city: Yup.string()
//     .required("City is required"),
//   pincode: Yup.string()
//     .required("Pincode is required")
//     .min(6, "Pincode must be 6 digits long")
//     .max(6, "Pincode must not be more than 6 digits long"),
//   phone: Yup.string()
//     .required("Phone number is required")
//     .min(10, "Phone number must be at least 10 digits")
//     .max(15, "Phone number must be at most 15 digits"),
//   gstNumber: Yup.string()
//     .required("GST number is required")
//     .matches(
//       /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[0-9A-Z]{1}$/,
//       "Invalid GST number"
//     ),
//   accountNumber: Yup.string()
//     // .required("Account number is required")
//     .matches(/^[0-9]+$/, "Account number must contain only digits")
//     .min(9, "Account number must be at least 9 digits long")
//     .max(18, "Account number must be at most 18 digits long"),
//   ifscCode: Yup.string()
//     // .required("IFSC code is required")
//     .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code"),
// });

// export default function CreateShopScreen({ route }) {
//   const navigation = useNavigation();
//   const { showSnackbar } = useSnackbar();

//   const {isHome} = route.params||false;

//   // const {isHome} = route.params.isHome;
//   const data = route?.params?.shop;
//   console.log("Route data is , ", isHome);

//   // console.log("routedata , ", data);
//   return (
//     <View contentContainerStyle={styles.container}>
//       <Formik
//         initialValues={{
//           shopName: data?.shopname || "",
//           email: data?.email || "",
//           phone: String(data?.phone) || "",
//           phone: data?.phone !== undefined ? String(data.phone) : "",
//           gstNumber: data?.gstnumber || "",
//           country: data?.address[0]?.country || "",
//           state: data?.address[0]?.state || "",
//           city: data?.address[0]?.city || "",
//           pincode:
//             data?.address?.[0]?.pincode !== undefined
//               ? String(data.address[0].pincode)
//               : "",
//           accountNumber: data?.bankDetail[0]?.account || "",
//           ifscCode: data?.bankDetail[0]?.ifsccode || "",
//           bankName: data?.bankDetail[0]?.bankname || "",
//           branch: data?.bankDetail[0]?.branch || "",
//         }}
//         validationSchema={validationSchema}
//         onSubmit={async (values, { resetForm }) => {
//           console.log("shop created and values are , ", values);

//           const formattedData = {
//             shopname: values.shopName,
//             address: [
//               {
//                 country: values.country,
//                 state: values.state,
//                 city: values.city,
//                 pincode: values.pincode,
//               },
//             ],
//             bankDetail: [
//               {
//                 account: values.accountNumber,
//                 bankname: values.bankName,
//                 branch: values.branch,
//                 ifsccode: values.ifscCode,
//               },
//             ],
//             phone: values.phone,
//             gstnumber: values.gstNumber,
//             email: values.email,
//           };

//           if (data) {
//             console.log("data is , ", data);
//             try {
//               headers = {
//                 "Content-Type": "application/json",
//               };
//               const response = await updateApi(
//                 `api/shop/update/${data._id}`,
//                 formattedData,
//                 headers
//               );

//               console.log("response is , ", response);
//               showSnackbar("shop updated successfully", "success");
//               if(isHome){
//                 navigation.navigate("Home")
//               }else{
//                 navigation.navigate("ViewShops");
//               }

//             } catch (error) {
//               console.log("error is ", error);
//               showSnackbar("error to create new product", "error");
//             }
//           } else {
//             try {
//               headers = {
//                 "Content-Type": "application/json",
//               };
//               const response = await createApi(
//                 "api/shop/create",
//                 formattedData,
//                 headers
//               );

//               console.log("response is , ", response);
//               showSnackbar("shop created successfully", "success");
//               // resetForm();
//               navigation.navigate("ViewShops");
//             } catch (error) {
//               console.log("error is ", error);
//               showSnackbar("error to create new product", "error");
//             }
//           }
//         }}
//       >
//         {({
//           handleChange,
//           handleBlur,
//           handleSubmit,
//           values,
//           errors,
//           touched,
//         }) => (
//           <ScrollView>
//             <View style={styles.form}>
//               <View style={styles.shopDetails}>
//                 <Text
//                   style={{ color: "#555555" }}
//                   variant="bodyMedium"
//                 >
//                   Shop Details
//                 </Text>
//                 <Divider style={[styles.dividerStyle, { width: "70%" }]} />
//                 <CustomTextInput
//                   placeholder="Shop Name"
//                   value={values.shopName}
//                   onChangeText={handleChange("shopName")}
//                   onBlur={handleBlur("shopName")}
//                   error={errors.shopName}
//                   touched={touched.shopName}
//                 />
//                 <CustomTextInput
//                   placeholder="Email ID"
//                   value={values.email}
//                   onChangeText={handleChange("email")}
//                   onBlur={handleBlur("email")}
//                   error={errors.email}
//                   touched={touched.email}
//                   keyboardType="email-address"
//                 />
//                 <CustomTextInput
//                   placeholder="Mobile Details"
//                   value={values.phone}
//                   onChangeText={handleChange("phone")}
//                   onBlur={handleBlur("phone")}
//                   error={errors.phone}
//                   touched={touched.phone}
//                   keyboardType="numeric"
//                 />
//                 <CustomTextInput
//                   placeholder="GST Number"
//                   value={values.gstNumber}
//                   onChangeText={handleChange("gstNumber")}
//                   onBlur={handleBlur("gstNumber")}
//                   error={errors.gstNumber}
//                   touched={touched.gstNumber}
//                   // keyboardType=""
//                 />
//                 </View>
//                 <View style={styles.shopDetails}>
//                 <Text
//                   style={{ color: "#555555" }}
//                   variant="bodyMedium"
//                 >
//                   Address
//                 </Text>
//                 <Divider style={[styles.dividerStyle, { width: "80%" }]} />
//                 <CustomTextInput
//                   placeholder="Country"
//                   value={values.country}
//                   onChangeText={handleChange("country")}
//                   onBlur={handleBlur("country")}
//                   error={errors.country}
//                   touched={touched.country}
//                 />
//                 <CustomTextInput
//                   placeholder="State"
//                   value={values.state}
//                   onChangeText={handleChange("state")}
//                   onBlur={handleBlur("state")}
//                   error={errors.state}
//                   touched={touched.state}
//                 />
//                 <CustomTextInput
//                   placeholder="City"
//                   value={values.city}
//                   onChangeText={handleChange("city")}
//                   onBlur={handleBlur("city")}
//                   error={errors.city}
//                   touched={touched.city}
//                 />
//                 <CustomTextInput
//                   placeholder="Pincode"
//                   value={values.pincode}
//                   onChangeText={handleChange("pincode")}
//                   onBlur={handleBlur("pincode")}
//                   error={errors.pincode}
//                   touched={touched.pincode}
//                   keyboardType="numeric"
//                 />
//                 </View>
//                 <View style={styles.shopDetails}>
//                 <Text
//                   style={{ color: "#555555" }}
//                   variant="bodyMedium"
//                 >
//                   Bank Details
//                 </Text>
//                 <Divider style={[styles.dividerStyle, { width: "70%" }]} />
//                 <CustomTextInput
//                   placeholder="Account No."
//                   value={values.accountNumber}
//                   onChangeText={handleChange("accountNumber")}
//                   onBlur={handleBlur("accountNumber")}
//                   error={errors.accountNumber}
//                   touched={touched.accountNumber}
//                   keyboardType="numeric"
//                 />
//                 <CustomTextInput
//                   placeholder="IFSC Code"
//                   value={values.ifscCode}
//                   onChangeText={handleChange("ifscCode")}
//                   onBlur={handleBlur("ifscCode")}
//                   error={errors.ifscCode}
//                   touched={touched.ifscCode}
//                   // keyboardType="numeric"
//                 />
//                 <CustomTextInput
//                   placeholder="Bank Name"
//                   value={values.bankName}
//                   onChangeText={handleChange("bankName")}
//                   onBlur={handleBlur("bankName")}
//                   error={errors.bankName}
//                   touched={touched.bankName}
//                 />
//                 <CustomTextInput
//                   placeholder="Branch"
//                   value={values.branch}
//                   onChangeText={handleChange("branch")}
//                   onBlur={handleBlur("branch")}
//                   error={errors.branch}
//                   touched={touched.branch}
//                 />
//               </View>

//               <Button
//                 mode="contained"
//                 onPress={handleSubmit}
//                 style={styles.button}
//               >
//                 {data ? "Update Shop" : "Create Shop"}
//               </Button>
//             </View>
//           </ScrollView>
//         )}
//       </Formik>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     justifyContent: "center",
//     padding: 20,
//     backgroundColor: "#f5f5f5",
//     marginVertical: 20,
//     position: "relative",
//   },
//   form: {
//     // padding: 20,
//     borderRadius: 10,
//     gap:10,
//     // elevation: 5, // For shadow on Android

//     margin: 10,
//   },
//   button: {
//     marginTop: 10,
//   },
//   shopDetails: {
//     // flexDirection: "row",
//     // flexWrap: "wrap",
//     padding:10,
//     backgroundColor:"#fff",
//     justifyContent: "space-between",
//     elevation:2,
//     shadowColor: "#000", // For shadow on iOS
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//   },
//   dividerStyle: {
//     marginTop: 10,
//     position: "relative",
//     top: -17,
//     alignSelf: "flex-end",
//   },
// });
