import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTranslation } from "react-i18next";


const FilterModal = ({
  isModalVisible,
  setModalVisible,
  setSortBy,
  sortBy,
  dateRange,
  setDateRange,
  formatDate
}) => {
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showDateWise, setShowDateWise] = useState(false);
  const { t } = useTranslation();


  const filterOptions = [
    { label: "1 Month", value: "1months" },
    { label: "3 Months", value: "3months" },
    { label: "6 Months", value: "6months" },
    { label: "Date Wise", value: "datewise" },
  ];

  const handlePress = (item) => {
    if (item.value === "datewise") {
      setShowDateWise(true);
      setShowStartDatePicker(true);
    } else {
      setSortBy(item.value);
      setModalVisible(false);
    }
  };

  const handleDateChange = (event, selectedDate, type) => {
    if (selectedDate) {
      setDateRange((prev) => ({
        ...prev,
        [type]: selectedDate, // Keep as a Date object
      }));
    }
    if (type === "startDate") {
      setShowStartDatePicker(false);
      setShowEndDatePicker(true);
    } else {
      setShowEndDatePicker(false);
    }
  };



  const handleSubmit = () => {
    setSortBy("datewise");
    setModalVisible(false);
    setShowDateWise(false)
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              {/* Close Button */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <AntDesign name="close" size={24} color="black" />
              </TouchableOpacity>

              <Text style={styles.modalTitle}>{t("Select Filter")}</Text>

              {filterOptions.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handlePress(item)}
                  style={[
                    styles.optionButton,
                    sortBy === item.value && styles.selectedOption,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      sortBy === item.value && styles.selectedText,
                    ]}
                  >
                   {t(item.label)}
                  </Text>
                </TouchableOpacity>
              ))}

              {/* Start Date Picker */}
              {showStartDatePicker && (
                <DateTimePicker
                  value={dateRange.startDate ? new Date(dateRange.startDate) : new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, date) => handleDateChange(event, date, "startDate")}
                />
              )}

              {/* End Date Picker */}
              {showEndDatePicker && (
                <DateTimePicker
                  value={dateRange.endDate ? new Date(dateRange.endDate) : new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, date) => handleDateChange(event, date, "endDate")}
                />
              )}

              {/* Display Selected Dates */}
              {showDateWise && dateRange?.startDate && dateRange?.endDate && (
                <View style={styles.dateDisplayContainer}>
                  <Text style={styles.dateText}>
                    Start Date: {formatDate(dateRange.startDate)}
                  </Text>
                  <Text style={styles.dateText}>
                    End Date: {formatDate(dateRange.endDate)}
                  </Text>
                </View>
              )}

              {/* Submit Button */}
              {showDateWise && (
                <TouchableOpacity style={styles.okayButton} onPress={handleSubmit}>
                  <Text style={styles.okayButtonText}>OK</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 300,
    alignItems: "center",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  optionButton: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    marginVertical: 5,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  selectedOption: {
    backgroundColor: "#6200EA",
  },
  selectedText: {
    color: "white",
    fontWeight: "bold",
  },
  dateDisplayContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    marginBottom: 5,
  },
  okayButton: {
    marginTop: 20,
    backgroundColor: "#6200EA",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  okayButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default FilterModal;
