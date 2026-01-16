import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import DateTimePicker from './DateTimePicker';

interface DateRangeFilterProps {
  visible: boolean;
  startDate: Date | null;
  endDate: Date | null;
  onConfirm: (startDate: Date | null, endDate: Date | null) => void;
  onCancel: () => void;
}

export default function DateRangeFilter({
  visible,
  startDate,
  endDate,
  onConfirm,
  onCancel,
}: DateRangeFilterProps) {
  const [localStartDate, setLocalStartDate] = useState<Date | null>(startDate);
  const [localEndDate, setLocalEndDate] = useState<Date | null>(endDate);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const today = new Date();

  const handleConfirm = () => {
    onConfirm(localStartDate, localEndDate);
  };

  const handleClear = () => {
    setLocalStartDate(null);
    setLocalEndDate(null);
    onConfirm(null, null);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Filter by Date Range</Text>
            <TouchableOpacity onPress={onCancel}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dateRow}>
            <View style={styles.dateInput}>
              <Text style={styles.label}>From Date</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowStartPicker(true)}
              >
                <Text style={styles.dateText}>
                  {localStartDate
                    ? localStartDate.toLocaleDateString()
                    : 'Select start date'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dateInput}>
              <Text style={styles.label}>To Date</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowEndPicker(true)}
              >
                <Text style={styles.dateText}>
                  {localEndDate
                    ? localEndDate.toLocaleDateString()
                    : 'Select end date'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleConfirm}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>

          <DateTimePicker
            visible={showStartPicker}
            mode="date"
            value={localStartDate || today}
            maximumDate={localEndDate || today}
            onConfirm={(date) => {
              setLocalStartDate(date);
              setShowStartPicker(false);
            }}
            onCancel={() => setShowStartPicker(false)}
          />

          <DateTimePicker
            visible={showEndPicker}
            mode="date"
            value={localEndDate || today}
            maximumDate={today}
            onConfirm={(date) => {
              if (!localStartDate || date >= localStartDate) {
                setLocalEndDate(date);
              }
              setShowEndPicker(false);
            }}
            onCancel={() => setShowEndPicker(false)}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
  },
  dateRow: {
    marginBottom: 20,
  },
  dateInput: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  dateButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
