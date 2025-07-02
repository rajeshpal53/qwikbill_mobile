import { Formik } from "formik";
import { useContext, useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  List,
  Text,
  TextInput
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import UserDataContext from "../../Store/UserDataContext";
// import { useLocation } from "../../Store/LocationContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { useTranslation } from "react-i18next";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ConfirmModal from "../../Components/Modal/ConfirmModal";
import { useSnackbar } from "../../Store/SnackbarContext";
import ServiceImagePicker from "../../UI/ServiceImagePicker";
import {
  API_BASE_URL,
  NORM_URL
} from "../../Util/UtilApi";

const referenceDate = new Date("2025-01-08T07:29:04.338Z");
// Minimum date for a person to be at least 5 years old
const minAgeDate = new Date(
  referenceDate.getFullYear() - 5,
  referenceDate.getMonth(),
  referenceDate.getDate()
);

const validationSchema = Yup.object().shape({
  // profileImage: Yup.mixed().required("Profile image is required"),
  name: Yup.string()
    .required("Name is required")
    .min(2, "name atleast 2 characters long"),
  mobile: Yup.string()
    .required("mobile number is required")
    .min(10, "mobile number must be at least 10 digits")
    .max(15, "mobile number must be at most 15 digits"),
  // email: Yup.string().email("Invalid email").required("Email is required"),
  gender: Yup.string().required("Gender is required").nullable(),
  address: Yup.string()
    .required("Address is required")
    .min(4, "address atleast 4 characters long"),
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

});

//hello

export default function EditProfileScreen({ navigation }) {
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
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [postData, setPostData] = useState({});
  // const { location } = useLocation();
  const { t } = useTranslation();
  const [extraData, setExtraData] = useState({});
  const [fieldsDisabled, setFieldsDisabled] = useState(false);

  const { showSnackbar } = useSnackbar();
  const { saveUserData, userData } = useContext(UserDataContext);
  const [profileImage, setProfileImage] = useState(null);
  const routeData = useRoute().params?.item || null;
  const onGoBack = useRoute().params?.onGoBack || null;
  const today = new Date();
  const [initialData, setInitialData] = useState({
    name: "",
    mobile: "",
    email: "",
    gender: "",
    dob: new Date() || null,
    address: "",
    // latitude: "",
    // longitude: "",
    profileImage: null,
    aadharFrontImage: null,
    aadharBackImage: null,


  });

  console.log("fieldsDisabled:", fieldsDisabled); // Debugging

  const [genderList, setGenderList] = useState([
    { gender: "Male" },
    { gender: "Female" },
    { gender: "Other" },
  ]);

  const [selectedGender, setSelectedGender] = useState("");
  // Access the theme provided by PaperProvider
  // const theme = useTheme();


  console.log("Route Data is the , ", routeData);

  useEffect(() => {
    const setInitialDataFunc = async (Data) => {

      console.log("Hetting data issss", Data);
      setInitialData({
        name: Data?.user?.name || "",
        mobile: Data?.user?.mobile || "",
        email: Data?.user?.email || "",
        gender: Data?.user?.gender || "",
        // age: String(Data?.user?.age != null ? Data.user.age : ""),
        dob: (Data?.user?.dob && parseServerDate(Data?.user?.dob)) || null,
        pincode: Data?.user?.pincodefk || "",
        address: Data?.user?.address || "",

        // latitude: Data?.user?.latitude || "",
        // longitude: Data?.user?.longitude || "",
        profileImage:
          (Data?.user?.profilePicurl &&
            formatUrl(Data?.user?.profilePicurl, "profilePicurl")) ||
          null,

        aadharFrontImage:
          (Data?.aadharCardFronturl &&
            formatUrl(Data?.aadharCardFronturl, "aadharCardFronturl")) ||
          null,
        aadharBackImage:
          (Data?.aadharCardFronturl &&
            formatUrl(Data?.aadharCardBackurl, "aadharCardBackurl")) ||
          null,
      });

    };




    if (routeData) {
      const tempRouteData = {
        user: routeData,
      };
      setInitialDataFunc(tempRouteData);
    } else {
      setInitialDataFunc(userData);
    }
  }, []);

  console.log("userData is m ", userData);

  useEffect(() => {
    console.log("postData is , ", postData);
  }, [postData]);

  const handlePress = () => setDropdownVisible(!dropdownVisible);

  const editHandler = async () => {
    try {
      setModalVisible(false);
      setIsLoading(true);
      console.log("post data beta is , ", postData);

      const response = await axios.post(
        `${API_BASE_URL}users/upsertOnlyUserProfileImg`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${userData?.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("JSON Response:", response.data);
      if ((routeData && routeData?.mobile === userData?.user?.mobile) || !routeData) {
        const saveUser = {
          token: userData.token,
          user: response?.data,
        };

        saveUserData(saveUser);
      }

      showSnackbar(t("Your profile has been updated Successfully"), "success");

      if (routeData && onGoBack) {

        console.log("route set dara, ", response?.data);

        onGoBack(response?.data);
      }

      navigation.goBack();
    } catch (err) {
      console.error("err", err);
      showSnackbar(`Failed to update profile`, "error");
      if (err.response) {
        console.log("Response Data:", err.response.data);
        console.log("Status:", err.response.status);
        console.log("Headers:", err.response.headers);
      } else if (err.request) {
        console.log("Request Made But No Response:", err.request);
      } else {
        console.log("Error Message:", err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    console.log("USER DATA IS SHOWING ", userData?.user?.gender);
    setSelectedGender(userData?.user?.gender || "Select Gender");
  }, [userData]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size={"large"} color="green" />
      </View>
    );
  }

  const formatUrl = (url, imageDetail) => {
    if (!url) return null; // Handle null cases

    // Ensure no double slashes in the final URL
    const formattedUrl = `${NORM_URL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;

    const imageFile = {
      uri: formattedUrl,
      name: `${imageDetail}.jpeg`,
      type: `image/jpeg`,
    };

    console.log("✅ Corrected Image URL:", imageFile);
    return imageFile;
  };

  // // Convert `dd-mm-yyyy` to a `Date` object
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

  const formatShowDate = (date) => {
    console.log("formatted date is for display is 1 , ", date);
    const day = date.getDate().toString().padStart(2, "0"); // Ensures 2 digits
    const month = date.toLocaleString("default", { month: "long" }); // Full month name
    const year = date.getFullYear();
    console.log(
      "formatted date is for display is , ",
      `${day} ${month} ${year}`
    );
    return `${day} ${month} ${year}`; // Concatenate in "DD Month YYYY" format
  };

  const formatDate = (date) => {
    console.log("formatted date is for display is 1 , ", date);
    const day = date.getDate().toString().padStart(2, "0"); // Ensures 2 digits
    const month = date.toLocaleString("default", { month: "long" }); // Full month name
    const year = date.getFullYear();
    console.log(
      "formatted date is for display is , ",
      `${day} ${month} ${year}`
    );
    return `${day} ${month} ${year}`; // Concatenate in "DD Month YYYY" format
  };


  const setLocationFields = async (data, setFieldValue) => {
    if (data?.latitude && data.longitude) {
      setFieldValue("latitude", String(data?.latitude));
      setFieldValue("longitude", String(data?.longitude));
      setFieldValue("address", data?.showAddress);

      showSnackbar("Location Selected Successfully", "success");
    }
  };


  const showPopUpMessage = (massage, msgType) => {
    showSnackbar(massage, msgType);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Formik

        initialValues={initialData}
        enableReinitialize={true}

        validationSchema={validationSchema}
        onSubmit={(values) => {
          // Handle form submission
          setModalVisible(true);

          const profileFormData = new FormData();

          profileFormData.append("name", values?.name);
          profileFormData.append("mobile", values?.mobile);

          console.log("why profile not comming is , ", values?.profileImage);

          if (values?.profileImage) {
            profileFormData.append("profilePicurl", values?.profileImage);
          }

          if (values?.dob) {
            const formattedDate = formatDate(values.dob);
            profileFormData.append("dob", formattedDate);
          }

          profileFormData.append("gender", values?.gender);

          profileFormData.append("email", values?.email || "");

          profileFormData.append("address", values?.address);

          if (values?.latitude) {
            profileFormData.append("latitude", values.latitude);
          }
          if (values?.longitude) {
            profileFormData.append("longitude", values.longitude);
          }

          setPostData(profileFormData);

        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
        }) => {

          useEffect(() => {
            console.log("profile image updated:", values?.profileImage);
          }, [values.profileImage]);

          console.log("🖼 Profile Image in Formik Values:", values?.profileImage);


          return (
            <SafeAreaView style={{ flex: 1 }}>
              <View>
                <ScrollView>
                  <View style={styles.container}>
                    <View style={styles.inputsContainer}>

                      {console.log(
                        "profile image is sssddd, ",
                        values?.profileImage
                      )}
                      <View>
                        <ServiceImagePicker
                          image={values?.profileImage}
                          label="Profile Image"
                          isAdmin={true}
                          setFieldValue={setFieldValue}
                          uploadFieldName={"profileImage"}
                          type={"rounded"}

                        />
                        {touched.profileImage && errors.profileImage ? (
                          <Text
                            style={[styles.errorText, { alignSelf: "center" }]}
                          >
                            {errors.profileImage}
                          </Text>
                        ) : null}
                      </View>

                      <View>
                        <TextInput
                          label="Name*"
                          mode="flat"
                          style={styles.input}
                          // placeholder={"Enter Name"}
                          onChangeText={handleChange("name")}
                          onBlur={handleBlur("name")}
                          value={values.name}
                        />
                        {touched.name && errors.name ? (
                          <Text style={styles.errorText}>{errors.name}</Text>
                        ) : null}
                      </View>

                      <View>
                        <TextInput
                          label="Mobile Number*"
                          mode="flat"
                          style={styles.input}
                          onChangeText={handleChange("mobile")}
                          onBlur={handleBlur("mobile")}
                          keyboardType="numeric"
                          value={values.mobile}
                          disabled
                        />
                        {touched.mobile && errors.mobile ? (
                          <Text style={styles.errorText}>{errors.mobile}</Text>
                        ) : null}
                      </View>

                      <View>
                        <TextInput
                          label="Email"
                          mode="flat"
                          style={styles.input}
                          placeholder={"Email"}
                          onChangeText={handleChange("email")}
                          onBlur={handleBlur("email")}
                          value={values.email}
                        />
                        {touched.email && errors.email ? (
                          <Text style={styles.errorText}>{errors.email}</Text>
                        ) : null}
                      </View>

                      <View style={styles.ageGenderContainer}>
                        <View>
                          <List.Accordion
                            accessibilityLabel="Gender"

                            style={{
                              height: 56,
                              borderBottomWidth: 1,
                              borderBottomColor: "rgba(0, 0, 0, 0.3)",
                            }}

                            title={selectedGender || "Select Gender"}
                            expanded={dropdownVisible}
                            onPress={handlePress}
                          // left={(props) => <List.Icon {...props} icon="earth" />}
                          >
                            <View style={styles.dropdownContainer}>
                              <ScrollView
                                contentContainerStyle={{ width: "100%" }}
                              >
                                {genderList.map((item, index) => (
                                  <List.Item
                                    key={index}
                                    title={item.gender}

                                    onPress={() => {
                                      setSelectedGender(item.gender);
                                      setFieldValue("gender", item.gender);
                                      setDropdownVisible(false);
                                    }}
                                  />
                                ))}
                              </ScrollView>
                            </View>
                          </List.Accordion>
                          {touched.gender && errors.gender ? (
                            <Text style={styles.errorText}>{errors.gender}</Text>
                          ) : null}
                        </View>


                      </View>

                      <View style={{ marginTop: 10 }}>
                        <View style={styles.dateTitle}>
                          <Text style={styles.dateTitleText}>Date Of Birth*</Text>

                          <Pressable
                            onPress={() => setShowDateTimePicker(true)}
                            style={styles.dateText}
                          >
                            <Icon name="calendar" size={20} color="#0a6846" />
                            <Text style={styles.buttonText}>
                              {values?.dob
                                ? formatShowDate(values.dob)
                                : "No date selected"}
                            </Text>
                          </Pressable>
                        </View>
                        {touched.dob && errors.dob ? (
                          <Text style={styles.errorText}>{errors.dob}</Text>
                        ) : null}

                        {showDateTimePicker && (
                          <DateTimePicker
                            value={values.dob || new Date()}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                              setShowDateTimePicker(false);
                              if (selectedDate) {

                                setFieldValue("dob", selectedDate);
                              }
                            }}
                          />
                        )}

                      </View>

                      <View>
                        <Pressable
                          onPress={() => {
                            if (!values?.latitude || values?.latitude === "") {
                              showPopUpMessage(
                                "Please First click on Change Location Button",
                                "error"
                              );
                            }
                          }}
                        >
                          <TextInput
                            label="Address*"
                            mode="flat"
                            style={styles.input}
                            onChangeText={handleChange("address")}
                            onBlur={handleBlur("address")}
                            value={values.address}
                          />
                          {touched.address && errors.address ? (
                            <Text style={styles.errorText}>{errors.address}</Text>
                          ) : null}
                        </Pressable>
                      </View>
                    </View>
                    <View style={styles.btnTxtContainer}>
                      <Button
                        mode="contained"
                        onPress={handleSubmit}
                        style={styles.button}
                      >
                        Update
                      </Button>
                    </View>
                  </View>
                </ScrollView>
              </View>
            </SafeAreaView>
          )
        }}
      </Formik>
      {modalVisible && (
        <ConfirmModal
          visible={modalVisible}
          message="are you sure you want to update profile ?"
          heading={"Confirm update profile"}
          setVisible={setModalVisible}
          handlePress={editHandler}
          buttonTitle="Update"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    padding: 20,
  },
  inputsContainer: {
    // backgroundColor: "orange",
    gap: 10,
  },
  img: {
    width: "100%",
    height: 300,
  },
  button: {
    borderRadius: 15,
    // backgroundColor:"#fcb53",
    // width:"50%",
    // alignSelf:"center"
  },
  link: {
    color: "#1e90ff",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
  input: {
    backgroundColor: "#fff",
  },
  btnTxtContainer: {
    // backgroundColor: "lightblue",
    gap: 10,
    marginTop: 20,
  },
  termsContainer: {
    marginVertical: 15,
  },
  termsPolityText: {
    color: "#1e90ff",
    fontWeight: "bold",
  },
  ageGenderContainer: {
    // flexDirection: "row",
    gap: 20,
    // justifyContent: "space-between",
  },
  dropdownContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#fafafa",
    zIndex: 1000, // To ensure it stays on top of other elements
    // borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    maxHeight: 200, // Set a max height for the dropdown
  },
  dateTitle: {
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.3)",
    marginVertical: 5,
  },
  dateTitleText: {
    position: "absolute",
    fontSize: 12,
    // fontWeight: "bold",
    backgroundColor: "#fff",
    paddingHorizontal: 5,
    color: "#333",
    top: -10,
    left: 20,
  },
  buttonText: {
    color: "#3e3e3e",
    fontWeight: "600",
    // marginRight: 2,
    marginLeft: 10,
  },
  dateText: {
    flexDirection: "row",
    minHeight: 48,
    alignItems: "center",
  },
});
