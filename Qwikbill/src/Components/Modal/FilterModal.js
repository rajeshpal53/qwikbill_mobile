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
import { Picker } from "@react-native-picker/picker";
import { fontFamily } from "../../Util/UtilApi";

const FilterModal = ({
  isModalVisible,
  setModalVisible,
  setSortBy,
  sortBy,
  dateRange,
  setDateRange,
  formatDate,
  setTypeFilter,
}) => {
  const { t } = useTranslation();
  const [selectedValue, setSelectedValue] = useState(sortBy || "");
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const dateFilters = [
    { label: "1 Month", value: "1months" },
    { label: "3 Months", value: "3months" },
    { label: "6 Months", value: "6months" },
    { label: "Date Wise", value: "datewise" },
  ];

  const typeFilters = [
    { label: "Gst", value: "gst" },
    { label: "Provisional", value: "provisional" },
    { label: "Quotation", value: "quotation" },
  ];

  const handleSubmit = () => {
    if (selectedValue === "datewise") {
      setSortBy("datewise");
      setTypeFilter("");
    }
    setModalVisible(false);
  };

  const handleDateChange = (event, selectedDate, type) => {
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

              {/* Date Filters as List */}
              <View style={styles.optionList}>
                {dateFilters.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.optionItem}
                    onPress={() => {
                      setSelectedValue(option.value);
                      if (option.value === "datewise") {
                        setShowStartDatePicker(true);
                      } else {
                        setSortBy(option.value);
                        setTypeFilter("");
                        setModalVisible(false);
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedValue === option.value && {
                          fontWeight: "bold",
                          color: "#6200EA",
                        },
                      ]}
                    >
                      {t(option.label)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Type Filters as Picker */}
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={
                    ["gst", "provisional", "quotation"].includes(selectedValue)
                      ? selectedValue
                      : ""
                  }
                  onValueChange={(itemValue) => {
                    if (itemValue !== "") {
                      setSelectedValue(itemValue);
                      setTypeFilter(itemValue);
                      setSortBy("");
                      setModalVisible(false);
                    }
                  }}
                >
                  <Picker.Item label={t("Select Type")} value="" />
                  {typeFilters.map((option, index) => (
                    <Picker.Item
                      key={index}
                      label={t(option.label)}
                      value={option.value}
                    />
                  ))}
                </Picker>
              </View>

              {/* Date Pickers */}
              {selectedValue === "datewise" && (
                <>
                  {showStartDatePicker && (
                    <DateTimePicker
                      value={
                        dateRange.startDate
                          ? new Date(dateRange.startDate)
                          : new Date()
                      }
                      mode="date"
                      display="default"
                      onChange={(e, date) =>
                        handleDateChange(e, date, "startDate")
                      }
                    />
                  )}
                  {showEndDatePicker && (
                    <DateTimePicker
                      value={
                        dateRange.endDate
                          ? new Date(dateRange.endDate)
                          : new Date()
                      }
                      mode="date"
                      display="default"
                      onChange={(e, date) =>
                        handleDateChange(e, date, "endDate")
                      }
                    />
                  )}

                  {dateRange.startDate && dateRange.endDate && (
                    <View style={styles.dateDisplayContainer}>
                      <Text style={styles.dateText}>
                        Start Date: {formatDate(dateRange.startDate)}
                      </Text>
                      <Text style={styles.dateText}>
                        End Date: {formatDate(dateRange.endDate)}
                      </Text>
                    </View>
                  )}

                  <TouchableOpacity
                    style={styles.okayButton}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.okayButtonText}>OK</Text>
                  </TouchableOpacity>
                </>
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
    minHeight: 250,
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
    marginBottom: 10,
  },
  optionList: {
    width: "100%",
    marginBottom: 10,
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
  
   backgroundColor:"#f0f0f0",
   marginBottom:5,
   borderRadius:12,
   textAlign:"center",
   alignItems:"center",
   fontFamily:fontFamily.medium
  },
  optionText: {
    fontSize: 16,
  },
  pickerContainer: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    overflow: "hidden",
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
