import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { updateRecord, getRecords } from '../../services/storage';
import { CURRENCIES } from '../../services/currency';
import { Record } from '../../types';
import DateTimePicker from '../../components/DateTimePicker';
import { Ionicons } from '@expo/vector-icons';

export default function EditRecordScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const { currency } = useCurrency();
  const record = route.params?.record as Record;

  const [details, setDetails] = useState(record?.details || '');
  const [amount, setAmount] = useState(record?.amount.toString() || '');
  const [recordType, setRecordType] = useState<'credit' | 'debit'>(record?.recordType || 'credit');
  const [date, setDate] = useState(record ? new Date(record.date) : new Date());
  const [time, setTime] = useState(record ? new Date(record.date + ' ' + record.time) : new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const today = new Date();

  const handleSave = async () => {
    if (!details.trim()) {
      Alert.alert('Error', 'Please enter record details');
      return;
    }

    if (!amount.trim() || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!user || !record) return;

    setLoading(true);

    const oldRecord = { ...record };
    const updatedRecord: Record = {
      ...record,
      details: details.trim(),
      amount: Number(amount),
      recordType,
      date: date.toISOString().split('T')[0],
      time: time.toTimeString().split(' ')[0].slice(0, 5),
    };

    // Track changes
    const changes: { field: string; oldValue: any; newValue: any }[] = [];
    if (oldRecord.details !== updatedRecord.details) {
      changes.push({ field: 'details', oldValue: oldRecord.details, newValue: updatedRecord.details });
    }
    if (oldRecord.amount !== updatedRecord.amount) {
      changes.push({ field: 'amount', oldValue: oldRecord.amount, newValue: updatedRecord.amount });
    }
    if ((oldRecord.recordType || 'credit') !== updatedRecord.recordType) {
      changes.push({ field: 'recordType', oldValue: oldRecord.recordType || 'credit', newValue: updatedRecord.recordType });
    }
    if (oldRecord.date !== updatedRecord.date || oldRecord.time !== updatedRecord.time) {
      changes.push({ 
        field: 'date/time', 
        oldValue: `${oldRecord.date} ${oldRecord.time}`, 
        newValue: `${updatedRecord.date} ${updatedRecord.time}` 
      });
    }

    if (changes.length > 0) {
      const success = await updateRecord(updatedRecord, user.id, changes);
      setLoading(false);

      if (success) {
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to update record');
      }
    } else {
      setLoading(false);
      navigation.goBack();
    }
  };

  const formatDate = (d: Date) => {
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (t: Date) => {
    return t.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!record) {
    return (
      <View style={styles.container}>
        <Text>Record not found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.form}>
          <Text style={styles.label}>Details *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter record details"
            value={details}
            onChangeText={setDetails}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Amount * ({CURRENCIES[currency].symbol})</Text>
          <TextInput
            style={styles.input}
            placeholder={`0.00 ${CURRENCIES[currency].code}`}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Type *</Text>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[styles.typeButton, recordType === 'credit' && styles.typeButtonActive]}
              onPress={() => setRecordType('credit')}
            >
              <Ionicons name="arrow-up-circle" size={20} color={recordType === 'credit' ? '#34C759' : '#999'} />
              <Text style={[styles.typeButtonText, recordType === 'credit' && styles.typeButtonTextActive]}>Credit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeButton, recordType === 'debit' && styles.typeButtonActive]}
              onPress={() => setRecordType('debit')}
            >
              <Ionicons name="arrow-down-circle" size={20} color={recordType === 'debit' ? '#FF3B30' : '#999'} />
              <Text style={[styles.typeButtonText, recordType === 'debit' && styles.typeButtonTextActive]}>Debit</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Date *</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setDatePickerOpen(true)}
          >
            <Text style={styles.dateText}>{formatDate(date)}</Text>
          </TouchableOpacity>
          <DateTimePicker
            visible={datePickerOpen}
            mode="date"
            value={date}
            maximumDate={today}
            onConfirm={(selectedDate) => {
              const maxDate = new Date();
              maxDate.setHours(23, 59, 59, 999);
              const finalDate = selectedDate > maxDate ? maxDate : selectedDate;
              setDate(finalDate);
              setDatePickerOpen(false);
            }}
            onCancel={() => setDatePickerOpen(false)}
          />

          <Text style={styles.label}>Time *</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setTimePickerOpen(true)}
          >
            <Text style={styles.dateText}>{formatTime(time)}</Text>
          </TouchableOpacity>
          <DateTimePicker
            visible={timePickerOpen}
            mode="time"
            value={time}
            onConfirm={(selectedTime) => {
              setTime(selectedTime);
              setTimePickerOpen(false);
            }}
            onCancel={() => setTimePickerOpen(false)}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Updating...' : 'Update Record'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    minHeight: 44,
    justifyContent: 'center',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  typeButtonActive: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f7ff',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  typeButtonTextActive: {
    color: '#007AFF',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
