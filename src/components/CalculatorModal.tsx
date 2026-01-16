import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

interface CalculatorModalProps {
  visible: boolean;
  onConfirm: (amount: number, calculationHistory: string[]) => void;
  onCancel: () => void;
}

export default function CalculatorModal({
  visible,
  onConfirm,
  onCancel,
}: CalculatorModalProps) {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [calculationHistory, setCalculationHistory] = useState<string[]>([]);

  const handleNumber = (num: string) => {
    if (display === '0') {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperation = (op: string) => {
    const currentValue = parseFloat(display);
    
    if (previousValue === null) {
      setPreviousValue(currentValue);
      setOperation(op);
      setDisplay('0');
    } else {
      const result = calculate(previousValue, currentValue, operation!);
      const historyEntry = `${previousValue} ${operation} ${currentValue} = ${result}`;
      setCalculationHistory([...calculationHistory, historyEntry]);
      setPreviousValue(result);
      setOperation(op);
      setDisplay('0');
    }
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const handleEquals = () => {
    if (previousValue !== null && operation) {
      const currentValue = parseFloat(display);
      const result = calculate(previousValue, currentValue, operation);
      const historyEntry = `${previousValue} ${operation} ${currentValue} = ${result}`;
      const finalHistory = [...calculationHistory, historyEntry];
      
      setDisplay(result.toString());
      setPreviousValue(null);
      setOperation(null);
      setCalculationHistory(finalHistory);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setCalculationHistory([]);
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleConfirm = () => {
    const finalAmount = parseFloat(display);
    if (!isNaN(finalAmount)) {
      onConfirm(finalAmount, calculationHistory);
      handleClear();
    }
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
            <Text style={styles.title}>Calculator</Text>
            <TouchableOpacity onPress={onCancel}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          {calculationHistory.length > 0 && (
            <ScrollView style={styles.historyContainer}>
              {calculationHistory.map((entry, index) => (
                <Text key={index} style={styles.historyText}>{entry}</Text>
              ))}
            </ScrollView>
          )}

          <View style={styles.displayContainer}>
            <Text style={styles.display}>{display}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={handleClear}>
              <Text style={styles.buttonText}>C</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.operatorButton]} onPress={() => handleOperation('÷')}>
              <Text style={styles.buttonText}>÷</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.operatorButton]} onPress={() => handleOperation('×')}>
              <Text style={styles.buttonText}>×</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.operatorButton]} onPress={() => handleOperation('-')}>
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => handleNumber('7')}>
              <Text style={styles.buttonText}>7</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleNumber('8')}>
              <Text style={styles.buttonText}>8</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleNumber('9')}>
              <Text style={styles.buttonText}>9</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.operatorButton]} onPress={() => handleOperation('+')}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => handleNumber('4')}>
              <Text style={styles.buttonText}>4</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleNumber('5')}>
              <Text style={styles.buttonText}>5</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleNumber('6')}>
              <Text style={styles.buttonText}>6</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.equalsButton]} onPress={handleEquals}>
              <Text style={styles.buttonText}>=</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => handleNumber('1')}>
              <Text style={styles.buttonText}>1</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleNumber('2')}>
              <Text style={styles.buttonText}>2</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleNumber('3')}>
              <Text style={styles.buttonText}>3</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.equalsButton]} onPress={handleConfirm}>
              <Text style={styles.buttonText}>✓</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.zeroButton]} onPress={() => handleNumber('0')}>
              <Text style={styles.buttonText}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleDecimal}>
              <Text style={styles.buttonText}>.</Text>
            </TouchableOpacity>
          </View>
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
    padding: 20,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
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
  historyContainer: {
    maxHeight: 100,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  historyText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  displayContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    alignItems: 'flex-end',
  },
  display: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  clearButton: {
    backgroundColor: '#ff6b6b',
  },
  operatorButton: {
    backgroundColor: '#4ecdc4',
  },
  equalsButton: {
    backgroundColor: '#007AFF',
  },
  zeroButton: {
    flex: 2,
  },
});
