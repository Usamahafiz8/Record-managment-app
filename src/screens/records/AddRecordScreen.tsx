import React, { useState } from 'react';
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
import { saveRecord } from '../../services/storage';
import { CURRENCIES } from '../../services/currency';
import { Record } from '../../types';
import DateTimePicker from '../../components/DateTimePicker';
import CalculatorModal from '../../components/CalculatorModal';
import { Ionicons } from '@expo/vector-icons';

export default function AddRecordScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const { currency } = useCurrency();
  const { customerId, supplierId, type } = route.params as {
    customerId?: string;
    supplierId?: string;
    type: 'customer' | 'supplier';
  };

  const [details, setDetails] = useState('');
  const [amount, setAmount] = useState('');
  const [recordType, setRecordType] = useState<'credit' | 'debit'>('credit');
  const today = new Date();
  const [date, setDate] = useState(today);
  const [time, setTime] = useState(today);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [calculationHistory, setCalculationHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!details.trim()) {
      Alert.alert('Error', 'Please enter record details');
      return;
    }

    if (!amount.trim() || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!user) return;

    setLoading(true);

    const record: Record = {
      id: Date.now().toString(),
      customerId: customerId || undefined,
      supplierId: supplierId || undefined,
      type,
      recordType,
      details: details.trim() + (calculationHistory.length > 0 ? `\n\nCalculation History:\n${calculationHistory.join('\n')}` : ''),
      amount: Number(amount),
      date: date.toISOString().split('T')[0],
      time: time.toTimeString().split(' ')[0].slice(0, 5),
      createdAt: new Date().toISOString(),
      userId: user.id,
    };

    const success = await saveRecord(record);
    setLoading(false);

    if (success) {
      navigation.goBack();
    } else {
      Alert.alert('Error', 'Failed to save record');
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

          <View style={styles.amountRow}>
            <View style={styles.amountInputContainer}>
              <Text style={styles.label}>Amount * ({CURRENCIES[currency].symbol})</Text>
              <TextInput
                style={styles.input}
                placeholder={`0.00 ${CURRENCIES[currency].code}`}
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
              />
            </View>
            <TouchableOpacity
              style={styles.calculatorButton}
              onPress={() => setCalculatorOpen(true)}
            >
              <Ionicons name="calculator-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <CalculatorModal
            visible={calculatorOpen}
            onConfirm={(calculatedAmount, history) => {
              setAmount(calculatedAmount.toString());
              setCalculationHistory(history);
              setCalculatorOpen(false);
            }}
            onCancel={() => setCalculatorOpen(false)}
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
              {loading ? 'Saving...' : 'Save Record'}
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
  amountRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  amountInputContainer: {
    flex: 1,
  },
  calculatorButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  calculatorIcon: {
    fontSize: 24,
  },
});
