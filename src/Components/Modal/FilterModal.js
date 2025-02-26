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

const FilterModal = ({ isModalVisible, setModalVisible, setSortBy, sortBy,dateRange,setDateRange}) => {
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);


  const filterOptions = [
    { label: "1 Month", value: "1months" },
    { label: "3 Months", value: "3months" },
    { label: "6 Months", value: "6months" },
    { label: "Date Wise", value: "datewise" },
  ];

  const handlePress = (item) => {
    if (item.value === "datewise") {
      setShowStartDatePicker(true);
      setSortBy("datewise")
    } else {
      setSortBy(item.value);
      setModalVisible(false)
    }
  };

  const handleDateChange = (selectedDate, type) => {
    if (selectedDate) {
      setDateRange((prev) => ({
        ...prev,
        [type]: selectedDate,
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
    setSortBy({
      startDate: dateRange.startDate.toISOString().split("T")[0],
      endDate: dateRange.endDate.toISOString().split("T")[0],
    });
    setModalVisible(false);
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

              <Text style={styles.modalTitle}>Select Filter</Text>

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
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}

              {/* Start Date Picker */}
              {showStartDatePicker && (
                <DateTimePicker
                  value={dateRange.startDate}
                  mode="date"
                  display="default"
                  onChange={(event, date) => handleDateChange(date, "startDate")}
                />
              )}

              {/* End Date Picker */}
              {showEndDatePicker && (
                <DateTimePicker
                  value={dateRange.endDate}
                  mode="date"
                  display="default"
                  onChange={(event, date) => handleDateChange(date, "endDate")}
                />
              )}

              {/* Display Selected Dates */}
              {sortBy === "datewise" && (
                <View style={styles.dateDisplayContainer}>
                  <Text style={styles.dateText}>
                    Start Date: {dateRange.startDate.toDateString()}
                  </Text>
                  <Text style={styles.dateText}>
                    End Date: {dateRange.endDate.toDateString()}
                  </Text>
                </View>
              )}

              {/* Submit Button */}
              {sortBy === "datewise" && (
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
