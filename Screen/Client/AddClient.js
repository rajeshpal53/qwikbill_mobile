import { Formik } from "formik";
import React, { useContext, useState } from "react";
import { View, Modal, Text, StyleSheet, ScrollView } from "react-native";
import { TextInput, Button, Portal, Provider, List,FAB} from "react-native-paper";
import * as Yup from "yup";
import { readApi,createApi } from "../../Util/UtilApi";
import { ShopDetailContext } from "../../Store/ShopDetailContext";
import { useSnackbar } from "../../Store/SnackbarContext";

const validationSchema = Yup.object({
  type: Yup.string().required("Type is required"),
});
const AddClient = ({ visible, onClose, onSubmit,navigation}) => {
  const [expanded, setExpanded] = React.useState(false);
  const [selected, setSelected] = React.useState("");
  const handlePress = () => setExpanded(!expanded);
  const [inputValue, setInputValue] = useState("");
  const { shopDetails } = useContext(ShopDetailContext);
  const [options, setOptions] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [fetchedData, setFetchedData] = useState([]);
  const {showSnackbar}=useSnackbar();
  const fetchOptions = async (input) => {
    const response = await readApi(
      `api/people/search?shop=${shopDetails._id}&${input}=&fields=firstname,lastname`
    );
    return response.result;
  };
  const fetchOptionCompany = async (input) => {
    const response = await readApi(
      `api/company/search?shop=${shopDetails._id}&${input}=&fields=name`
    );
    return response.result;
  };
  const initialValues = {
    people: "",
    type: "",
    company: "",
  };
  return (
    <Provider>
      <Portal>
        <Modal visible={visible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={ async (values) => {
                console.log(values);
                let postData={}
                if(values.type==="people"){
                    delete values.company
                    values.people=fetchedData._id
                    postData={...values}
                  }
                  else{
                    delete values.people
                    values.company= fetchedData._id
                    postData={...values}
                  }
                  console.log("postData",postData)
                  try{
                    headers={
                      "Content-Type": "application/json",
                    }
                    const response= await createApi("api/client/create",postData,headers);
                    console.log(response.result,"result")
                    showSnackbar("product added successfully","success")
                    onClose();
                    navigation.navigate("viewClient")
                } catch(error) {
                    console.error("errror to create new product", error);
                    showSnackbar("error to create new product","error")
                  }
                  
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
              }) => (
                <View style={styles.modalContent}>
                  <List.Accordion
                    title={selected || "Select Type"}
                    expanded={expanded}
                    onPress={handlePress}
                    left={(props) => <List.Icon {...props} icon="account" />}
                  >
                    <List.Item
                      title="People"
                      onPress={() => {
                        setSelected("people");
                        setFieldValue("type", "people");
                        setExpanded(false);
                      }}
                    />
                    <List.Item
                      title="Company"
                      onPress={() => {
                        setSelected("company");
                        setFieldValue("type", "company");
                        setExpanded(false);
                      }}
                    />
                  </List.Accordion>
                  {selected === "people" ? (
                    <View>
                      <TextInput
                        label="people"
                        mode="outlined"
                        onChangeText={async (text) => {
                          handleChange("people")(text);
                          if (text.length > 1) {
                            const fetchedOptions = await fetchOptions(
                              text,
                              shopDetails._id
                            );
                            setOptions(fetchedOptions);
                            setShowOptions(true);
                          } else {
                            setShowOptions(false);
                          }
                        }}
                        onBlur={handleBlur("people")}
                        value={values.people}
                        error={touched.people && errors.people ? true : false}
                        style={{ width: "100%", marginBottom: 10 }}
                      />

                      {touched.people && errors.people && (
                        <HelperText
                          type="error"
                          visible={touched.people && errors.people}
                        >
                          {errors.people}
                        </HelperText>
                      )}
                      {showOptions && (
                        <View style={styles.suggestionsContainer}>
                          <ScrollView
                            nestedScrollEnabled={true}
                            style={styles.suggestionsList}
                          >
                            {options.map((option) => (
                              <List.Item
                                key={option._id}
                                title={option.firstname + " " + option.lastname}
                                onPress={async () => {
                                  setFieldValue(
                                    "people",
                                    `${option.firstname} ${option.lastname}`
                                  );
                                  setFetchedData(option)
                                  //   setFetchData(option);
                                  setShowOptions(false);
                                }}
                              />
                            ))}
                          </ScrollView>
                        </View>
                      )}
                    </View>
                  ) : (
                    <View>
                      <TextInput
                        label="company"
                        mode="outlined"
                        onChangeText={async (text) => {
                          handleChange("company")(text);
                          if (text.length > 1) {
                            const fetchedOptions = await fetchOptionCompany(
                              text,
                              shopDetails._id
                            );
                            setOptions(fetchedOptions);
                            setShowOptions(true);
                          } else {
                            setShowOptions(false);
                          }
                        }}
                        onBlur={handleBlur("company")}
                        value={values.company}
                        error={touched.company && errors.company ? true : false}
                        style={{ width: "100%", marginBottom: 10 }}
                      />
                      {touched.company && errors.company && (
                        <HelperText
                          type="error"
                          visible={touched.company && errors.company}
                        >
                          {errors.company}
                        </HelperText>
                      )}
                      {showOptions && (
                        <View style={styles.suggestionsContainer}>
                          <ScrollView
                            nestedScrollEnabled={true}
                            style={styles.suggestionsList}
                          >
                            {options.map((option) => (
                              <List.Item
                                key={option._id}
                                title={option.name}
                                onPress={async () => {
                                  setFieldValue("company", option.name);
                                  //   setFetchData(option);
                                  setShowOptions(false);
                                  setFetchedData(option)
                               
                                }}
                              />
                            ))}
                          </ScrollView>
                        </View>
                      )}
                    </View>
                  )}
                  <Button
                    mode="contained"
                    onPress={() => {
                      handleSubmit();
                      setInputValue(""); // Clear input field after submission
                      onClose();
                    }}
                    style={styles.button}
                  >
                    Submit
                  </Button>
                  <Button onPress={onClose} style={styles.button}>
                    Close
                  </Button>
                </View>
              )}
            </Formik>
          </View>
        </Modal>
      </Portal>
    </Provider>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
  },
});

export default AddClient;
