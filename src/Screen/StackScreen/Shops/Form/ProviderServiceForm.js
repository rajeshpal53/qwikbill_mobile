import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useRef, useState } from "react";
import { Checkbox, Divider, TextInput } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";
import ServiceImagePicker from "../../../../Components/ServiceImagePicker";
import GenericSwitch from "../../../../UI/GenericSwitch";
import { useSnackbar } from "../../../../Store/SnackbarContext";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";

const ProviderServiceForm = ({
  handleBlur,
  handleChange,
  setFieldValue,
  values,
  touched,
  errors,

  isAdmin,

  textInputMode,
  shopImageField,
}) => {
  const [isEnabled, setIsEnabled] = useState(false); // temporary
  const { t } = useTranslation();
  const [editorHeight, setEditorHeight] = useState(0);
  const scrollViewRef = useRef();
  // const { getAddressAllDetails } = useLocation();
  const { showSnackbar } = useSnackbar();
  const richText = useRef();
  const [editorContent, setEditorContent] = useState("");

  // const handleHeightChange = (height) => {
  //   if (height > editorHeight) {
  //     // If editor grows in height, scroll to bottom
  //     setEditorHeight(height);
  //     scrollViewRef.current?.scrollToEnd({ animated: true });
  //   }
  // };

  console.log("hellow service");

  const setLocationFields = async (data, setFieldValue) => {
    if (data?.latitude && data?.longitude) {
      // Set the Formik fields or local state with the lat and lng
      // const Address = await getAddressAllDetails(
      //   data?.latitude,
      //   data?.longitude
      // );
      // console.log("addresseing , ", Address?.formatted_address);

      setFieldValue("latitude", String(data?.latitude));
      setFieldValue("longitude", String(data?.longitude));
      setFieldValue("location", data?.showAddress);

      showSnackbar("Location Selected Successfully", "success");
    }
  };

  const showPopUpMessage = (massage, msgType) => {
    showSnackbar(massage, msgType);
  };

  const handleEditorChange = (content) => {
    setEditorContent(content); // Update local state
    setFieldValue("editorContent", content); // Update Formik state (if needed)
  };

  return (
    <View style={{ gap: 10 }}>
      <View style={{ marginVertical: 20 }}>
        <ServiceImagePicker
          image={values?.shopImage}
          label={"Shop Image"}
          setFieldValue={setFieldValue}
          uploadFieldName={shopImageField}
        />
      </View>
      <View>
        <TextInput
          label={t("Shop Name")}
          mode={textInputMode}
          style={{ backgroundColor: "transparent" }}
          onChangeText={handleChange("shopName")}
          onBlur={handleBlur("shopName")}
          value={values.shopName}
          error={touched.shopName && errors.shopName}
        />
        {touched.shopName && errors.shopName && (
          <Text style={{ color: "red" }}>{errors.shopName}</Text>
        )}
      </View>

      <View>
        {/* <Pressable
        onPress={() => {
          if(!values?.latitude || values?.latitude === ""){
            showPopUpMessage("Please First click on Change Location Button", "error");
          }
        }}
        > */}
        <TextInput
          label={t("Shop Address")}
          // disabled = { (!values?.latitude || values?.latitude === "") ? true : false}
          mode={textInputMode}
          style={{ backgroundColor: "transparent" }}
          onChangeText={handleChange("shopAddress")}
          onBlur={handleBlur("shopAddress")}
          value={values.shopAddress}
          error={touched.shopAddress && errors.shopAddress}
        />
        {/* </Pressable> */}
        {touched.shopAddress && errors.shopAddress && (
          <Text style={{ color: "red" }}>{errors.shopAddress}</Text>
        )}
      </View>

      <View style={{ width: "100%" }}>
        <RichToolbar
          editor={richText}
          actions={[
            actions.setBold,
            actions.setItalic,
            actions.setUnderline,
            actions.insertBulletsList,
            actions.insertOrderedList,
            actions.insertLink,
            actions.undo,
            actions.redo,
          ]}
        />
      </View>

      {/* <ScrollView
        ref={scrollViewRef}
        nestedScrollEnabled={true}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <RichEditor
          ref={richText}
          placeholder="Start writing here..."
          onChange={handleEditorChange}
          initialContentHTML={editorContent}
          // initialContentHTML={editorContent || ""}
          // onChange={(text) => {
          //   setEditorContent(text);
          //   // handleContentChange();
          // }}
          // // scrollEnabled={true}
          // // scrollEnabled={true}
          // onHeightChange={handleHeightChange}
          // onScroll={() => console.log("scrolling ")}
        />
      </ScrollView> */}

      {/* <View>
        <TextInput
          label={t("Kilometer Radius")}
          mode={textInputMode}
          style={{ backgroundColor: "transparent" }}
          keyboardType="numeric"
          maxLength={3}
          onChangeText={handleChange("kilometerRadius")}
          onBlur={handleBlur("kilometerRadius")}
          value={values.kilometerRadius}
          error={touched.kilometerRadius && errors.kilometerRadius}
        />
        {touched.kilometerRadius && errors.kilometerRadius && (
          <Text style={{ color: "red" }}>{errors.kilometerRadius}</Text>
        )}
      </View> */}

      {/* <View>
        {/* {console.log("values address", values.showAddress)} */}
      {/* <TextInput
          label={t("Address Details")}
          mode={textInputMode}
          style={{ backgroundColor: "transparent" }}
          onChangeText={handleChange("showAddress")}
          onBlur={handleBlur("showAddress")}
          value={values.showAddress}
          // error={touched.location && errors.location}
        /> */}
      {/* {touched.location && errors.location && (
          <Text style={{ color: "red" }}>{errors.location}</Text>
        )} */}
      {/* </View> */}

      {/* <View>
        <TextInput
          label={t("Latitude")}
          mode={textInputMode}
          style={{backgroundColor : "transparent"}}
          keyboardType="numeric"
          onChangeText={handleChange("latitude")}
          onBlur={handleBlur("latitude")}
          value={values.latitude}
          error={touched.latitude && errors.latitude}
        />
        {touched.latitude && errors.latitude && (
          <Text style={{ color: "red" }}>{errors.latitude}</Text>
        )}
      </View> */}

      {/* <View>
        <TextInput
          label={t("Longitude")}
          mode={textInputMode}
          style={{backgroundColor : "transparent"}}
          keyboardType="numeric"
          onChangeText={handleChange("longitude")}
          onBlur={handleBlur("longitude")}
          value={values.longitude}
          error={touched.longitude && errors.longitude}
        />
        {touched.longitude && errors.longitude && (
          <Text style={{ color: "red" }}>{errors.longitude}</Text>
        )}
      </View> */}

      {/* <View style={{}}>

        <Pressable
          onPress={() => {
            // navigation.navigate("LocationSearch"  , {
            //   navigationName: "AddServiceProvidersForm",
            //   onGoBack: (data) => {
            //     // console.log('Data from ScreenB:', data);
            //     setLocationFields(data, setFieldValue);
            //   },
            // });

          }}
          style={{
            minHeight: 48,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "#fff",
              backgroundColor: "#0a6846",
              borderRadius: 5,
              padding: 10,
              paddingTop: 12.5,
              fontFamily: "Poppins-SemiBold",
            }}
          >
            {t("Change Location")}
          </Text>
        </Pressable>
      </View> */}
      {/* Checkboxes */}

      {isAdmin && (
        <View
          style={{
            backgroundColor: "#fff",
            elevation: 5,
            paddingHorizontal: 5,
            gap: 8,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* <GenericSwitch
            label="Is Online"
            value={values?.isOnline}
            onValueChange={(newValue) => {
              setFieldValue("isOnline", newValue);
            }}
            color="#0a6846"
            containerStyle={styles.switchComponentStyle}
            labelStyle={{ fontFamily: "Poppins-Regular" }}
          /> */}

            {isAdmin && (
              <GenericSwitch
                label="Approved"
                value={values?.isApproved}
                onValueChange={(newValue) => {
                  setFieldValue("isApproved", newValue);
                }}
                color="#0a6846"
                containerStyle={styles.switchComponentStyle}
                labelStyle={{ fontFamily: "Poppins-Regular" }}
              />
            )}
          </View>

          <Divider style={{ width: "70%", height: 0.2, alignSelf: "center" }} />
          {/* <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <GenericSwitch
            label="Home Delivery"
            value={values?.homeDelivery}
            onValueChange={(newValue) => {
              setFieldValue("homeDelivery", newValue);
            }}
            color="#0a6846"
            containerStyle={styles.switchComponentStyle}
            labelStyle={{ fontFamily: "Poppins-Regular" }}
          />

          {isAdmin && (
          <GenericSwitch
            label="Is Verified"
            value={values?.isVerified}
            onValueChange={(newValue) => {
              setFieldValue("isVerified", newValue);
            }}
            color="#0a6846"
            containerStyle={styles.switchComponentStyle}
            labelStyle={{ fontFamily: "Poppins-Regular" }}
          />
          )}
        </View> */}
        </View>
      )}

      {/* <View style={{ padding: 5 }}>
        <View
          style={{
            //  height: 100, width: 100
            height: 300,
            backgroundColor: "#fff",
            elevation: 5,
          }}
        >
          <View style={{ width: "100%" }}>
            <RichToolbar
              editor={richText}
              actions={[
                actions.setBold,
                actions.setItalic,
                actions.setUnderline,
                actions.insertBulletsList,
                actions.insertOrderedList,
                actions.insertLink,
                actions.undo,
                actions.redo,
              ]}
            />
          </View>

          <ScrollView
            ref={scrollViewRef}
            // scrollEnabled={true}
            nestedScrollEnabled={true}
            contentContainerStyle={{ flexGrow: 1 }}
            // style={{padding:5}}
          >
            <RichEditor
              ref={richText}
              // style={{ flex: 1 }}
              placeholder="Start writing here..."
              initialContentHTML={editorContent || ""}
              onChange={(text) => {
                setEditorContent(text);
                // handleContentChange();
              }}
              // scrollEnabled={true}
              // scrollEnabled={true}
              onHeightChange={handleHeightChange}
              // onScroll={() => console.log("scrolling ")}
            />
          </ScrollView>


        </View>
      </View> */}
    </View>
  );
};

export default ProviderServiceForm;

const styles = StyleSheet.create({
  switchComponentStyle: {
    flexDirection: "row-reverse",
    // backgroundColor:"pink",
    alignItems: "center",
  },
});
