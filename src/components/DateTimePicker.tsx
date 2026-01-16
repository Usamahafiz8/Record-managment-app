import React, { useState, useEffect } from 'react';
import { Platform, Modal, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface CustomDateTimePickerProps {
  visible: boolean;
  mode: 'date' | 'time';
  value: Date;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
  minimumDate?: Date;
  maximumDate?: Date;
}

export default function CustomDateTimePicker({
  visible,
  mode,
  value,
  onConfirm,
  onCancel,
  minimumDate,
  maximumDate,
}: CustomDateTimePickerProps) {
  const [selectedDate, setSelectedDate] = useState(value);

  useEffect(() => {
    setSelectedDate(value);
  }, [value]);

  if (!visible) {
    return null;
  }

  const today = new Date();
  const maxDate = maximumDate || (mode === 'date' ? today : undefined);

  const handleChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      // On Android, the picker closes automatically
      if (event.type === 'dismissed' || event.type === 'neutralButtonPressed') {
        onCancel();
        return;
      }
      
      if (selectedDate) {
        // Ensure date is not in the future for date mode
        if (mode === 'date' && maxDate) {
          const finalDate = selectedDate > maxDate ? maxDate : selectedDate;
          onConfirm(finalDate);
        } else {
          onConfirm(selectedDate);
        }
      }
    } else {
      // iOS - handled differently
      if (event.type === 'dismissed') {
        onCancel();
        return;
      }
      
      if (selectedDate) {
        // Ensure date is not in the future for date mode
        if (mode === 'date' && maxDate) {
          const finalDate = selectedDate > maxDate ? maxDate : selectedDate;
          onConfirm(finalDate);
        } else {
          onConfirm(selectedDate);
        }
      }
    }
  };

  // For Android, the picker shows as a native modal automatically
  if (Platform.OS === 'android') {
    return (
      <DateTimePicker
        value={value}
        mode={mode}
        display="default"
        onChange={handleChange}
        minimumDate={minimumDate}
        maximumDate={maxDate}
      />
    );
  }

  // For iOS, wrap in a Modal
  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onCancel} style={styles.button}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.title}>
              {mode === 'date' ? 'Select Date' : 'Select Time'}
            </Text>
            <TouchableOpacity 
              onPress={() => {
                if (mode === 'date' && maxDate) {
                  const finalDate = selectedDate > maxDate ? maxDate : selectedDate;
                  onConfirm(finalDate);
                } else {
                  onConfirm(selectedDate);
                }
              }} 
              style={styles.button}
            >
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>
          <DateTimePicker
            value={selectedDate}
            mode={mode}
            display="spinner"
            onChange={(event, selectedDate) => {
              if (selectedDate) {
                setSelectedDate(selectedDate);
              }
            }}
            minimumDate={minimumDate}
            maximumDate={maxDate}
            style={styles.picker}
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
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  button: {
    padding: 8,
  },
  cancelText: {
    fontSize: 16,
    color: '#666',
  },
  doneText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  picker: {
    height: 200,
  },
});
