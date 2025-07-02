import { Pressable, StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { Checkbox, Divider, TextInput } from "react-native-paper";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";
import ServiceImagePicker from "../../../../Components/ServiceImagePicker";
import GenericSwitch from "../../../../UI/GenericSwitch";
import { useSnackbar } from "../../../../Store/SnackbarContext";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
// import { QuillEditor, QuillToolbar } from "react-native-cn-quill";
// import QuillEditor from "react-native-cn-quill/lib/QuillEditor";
// import QuillToolbar from "react-native-cn-quill/lib/QuillToolbar";

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
  const [editorContent, setEditorContent] = useState("Hello THere");
  const [isEditorReady, setEditorReady] = useState(false);

  useEffect(() => {
    if (richText.current && editorContent && isEditorReady) {
      try {
        richText.current?.setContentHTML(editorContent);
      } catch (err) {
        console.error("RichEditor Error:", err);
      }
    }
  }, [editorContent, isEditorReady]);

  const handleHeightChange = (height) => {
    if (height > editorHeight) {
      // If editor grows in height, scroll to bottom
      setEditorHeight(height);
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }
  };

  console.log("hellow service");
  console.log(editorContent, " editor content is ");

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

  useEffect(() => {
    if (richText.current && editorContent && isEditorReady) {
      try {
        richText.current.setContentHTML(editorContent);
      } catch (err) {
        console.error("RichEditor Error:", err);
      }
    }
  }, [isEditorReady]);

  return (
    <View style={{ gap: 12}}>
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
          label={t("Shop Name") + " *"}
          mode={textInputMode}
          style={{ backgroundColor: "transparent" }}
          onChangeText={handleChange("shopName")}
          onBlur={handleBlur("shopName")}
          value={values.shopName || ""}
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
          label={t("Shop Address") + " *"}
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

        <TextInput
          label={t("Gst Number")}
          // disabled = { (!values?.latitude || values?.latitude === "") ? true : false}
          mode={textInputMode}
          style={{ backgroundColor: "transparent" }}
          onChangeText={handleChange("gstNumber")}
          onBlur={handleBlur("gstNumber")}
          value={values.gstNumber}
          error={touched.gstNumber && errors.gstNumber}
        />
        {/* </Pressable> */}
        {touched.gstNumber && errors.gstNumber && (
          <Text style={{ color: "red" }}>{errors.gstNumber}</Text>
        )}

        <TextInput
          label={t("CIN Number")}
          // disabled = { (!values?.latitude || values?.latitude === "") ? true : false}
          mode={textInputMode}
         style={{ backgroundColor: "transparent" }}
          onChangeText={handleChange("cinNumber")}
          onBlur={handleBlur("cinNumber")}
          value={values.cinNumber}
          error={touched.cinNumber && errors.cinNumber}
        />


      </View>
      <View style={{ padding: 5 }}>
  <View style={{ padding: 10 }}>
    <TextInput
      mode="outlined"
      multiline
      numberOfLines={10} // Helps Paper calculate height
      maxLength={500}
      placeholder="Enter description (max 500 characters)..."
      value={values.description}
      onChangeText={handleChange('description')}
      onBlur={handleBlur('description')}
      style={{
        height: 250,
        textAlignVertical: 'top', // Start from top
        backgroundColor: '#fff',  // Prevent transparent issues
      }}
    />
    <Text style={{ color: 'rgba(0,0,0,0.5)', marginTop: 5 }}>
      {values?.description?.length || 0}/500
    </Text>
  </View>
</View>
 


      {/* <View
      style={{
        height: 300,
        backgroundColor: "#fff",
        elevation: 5,

      }}
    >
      <View>
        <QuillToolbar editor={richText} options="full" />
      </View>

        <QuillEditor
          ref={richText}
          style={{ minHeight: 200 }}
          onTextChange={(text) => setEditorContent(text)}
          defaultValue={editorContent || ""}
          placeholder="Start writing here..."
        />
    </View> */}
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
        </View>
      )}
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
