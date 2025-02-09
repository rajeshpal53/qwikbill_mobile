import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { RadioButton, Button } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChangeLanguageModal = ({
  languageModalvisible,
  setLanguageModalVisible,
  languageModalOpen,
  languageModalClose,
  language,
  setLanguage,
  i18nChangeLanguage,
  t,
}) => {
  const saveLanguage = async () => {
    // Handle save logic here, like updating the language setting
    try {
      console.log(`Selected Language: ${language}`);
      if (language === "Hindi") {
        await AsyncStorage.setItem("appLanguage", "hi");
        i18nChangeLanguage("hi");
      } else {
        await AsyncStorage.setItem("appLanguage", "en");
        i18nChangeLanguage("en");
      }
    } catch (err) {
      console.err("error in storage", err);
    } finally {
      languageModalClose();
    }
  };

  return (
    <View style={styles.container}>
      {/* Button to Open the Modal */}
      {/* <TouchableOpacity onPress={openModal} style={styles.editButton}>
        <Text>Change Language</Text>
      </TouchableOpacity> */}

      {/* Modal */}
      <Modal
        visible={languageModalvisible}
        transparent={true}
        animationType="slide"
        onRequestClose={languageModalClose}
      >
        <TouchableWithoutFeedback onPress={languageModalClose}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  backgroundColor: "#0a6846",
                  paddingHorizontal: 10,
                  paddingVertical: 15,
                  borderTopRightRadius: 10,
                  borderTopLeftRadius: 10,
                }}
              >
                <Text style={styles.modalTitle}>
                  {t("Select Your Language")}
                </Text>

                <TouchableOpacity
                  onPress={languageModalClose}
                  style={styles.closeButton}
                >
                  {/* <Text style={styles.closeText}>X</Text> */}
                  <Entypo name="cross" size={25} color="#000" />
                </TouchableOpacity>
              </View>

              <View style={{ padding: 20 }}>
                <RadioButton.Group
                  onValueChange={(newValue) => setLanguage(newValue)}
                  value={language}
                >
                  <RadioButton.Item label="हिन्दी" value="Hindi" />
                  <RadioButton.Item label="English" value="English" />
                </RadioButton.Group>
                <Button
                  mode="contained"
                  onPress={saveLanguage}
                  style={styles.saveButton}
                >
                  {t("Save")}
                </Button>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    width: "80%",
    borderRadius: 10,
    position: "relative",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    // marginVertical: 10,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#0a6846",
    borderRadius: 10,
  },
  closeButton: {
    // position: 'absolute',
    // top: 10,
    // right: 10,
    // padding: 5,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 30,
  },
  closeText: {
    fontSize: 16,
    color: "red",
  },
});

export default ChangeLanguageModal;
