import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Record } from '../types';
import { formatCurrency, Currency as CurrencyType } from '../services/currency';
import { format } from 'date-fns';

interface ReportModalProps {
  visible: boolean;
  records: Record[];
  entityName: string;
  entityType: 'customer' | 'supplier';
  currency: CurrencyType;
  startDate: Date | null;
  endDate: Date | null;
  onClose: () => void;
}

export default function ReportModal({
  visible,
  records,
  entityName,
  entityType,
  currency,
  startDate,
  endDate,
  onClose,
}: ReportModalProps) {
  const [generating, setGenerating] = useState(false);

  const totalAmount = records.reduce((sum, r) => sum + r.amount, 0);
  const creditAmount = entityType === 'customer' ? totalAmount : 0;
  const debitAmount = entityType === 'supplier' ? totalAmount : 0;

  const generatePDF = async () => {
    setGenerating(true);
    try {
      let pdfContent = `
RECORD MANAGEMENT REPORT
${entityType === 'customer' ? 'Customer' : 'Supplier'}: ${entityName}
Date Range: ${startDate ? format(startDate, 'PP') : 'All'} - ${endDate ? format(endDate, 'PP') : 'All'}
Generated: ${format(new Date(), 'PPp')}

SUMMARY
Total Records: ${records.length}
Total Amount: ${formatCurrency(totalAmount, currency)}
${entityType === 'customer' ? `Credit: ${formatCurrency(creditAmount, currency)}` : `Debit: ${formatCurrency(debitAmount, currency)}`}

DETAILED RECORDS
`;

      records.forEach((record, index) => {
        pdfContent += `
${index + 1}. ${format(new Date(record.date + ' ' + record.time), 'PPp')}
   Amount: ${formatCurrency(record.amount, currency)}
   Details: ${record.details}
`;
      });

      pdfContent += `
---
Developer by Osama
`;

      const fileUri = FileSystem.documentDirectory + `report_${entityName}_${Date.now()}.txt`;
      await FileSystem.writeAsStringAsync(fileUri, pdfContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/plain',
          dialogTitle: 'Export Report',
        });
        Alert.alert('Success', 'Report exported successfully!');
      } else {
        Alert.alert('Error', 'Sharing is not available on this device');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      Alert.alert('Error', 'Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Report</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Entity:</Text>
                <Text style={styles.summaryValue}>{entityName}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Type:</Text>
                <Text style={styles.summaryValue}>{entityType === 'customer' ? 'Customer' : 'Supplier'}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Date Range:</Text>
                <Text style={styles.summaryValue}>
                  {startDate ? format(startDate, 'PP') : 'All'} - {endDate ? format(endDate, 'PP') : 'All'}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Records:</Text>
                <Text style={styles.summaryValue}>{records.length}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Amount:</Text>
                <Text style={[styles.summaryValue, styles.amountValue]}>
                  {formatCurrency(totalAmount, currency)}
                </Text>
              </View>
              {entityType === 'customer' && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Credit:</Text>
                  <Text style={[styles.summaryValue, styles.creditValue]}>
                    {formatCurrency(creditAmount, currency)}
                  </Text>
                </View>
              )}
              {entityType === 'supplier' && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Debit:</Text>
                  <Text style={[styles.summaryValue, styles.debitValue]}>
                    {formatCurrency(debitAmount, currency)}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Records ({records.length})</Text>
              {records.map((record, index) => (
                <View key={record.id} style={styles.recordItem}>
                  <View style={styles.recordHeader}>
                    <Text style={styles.recordNumber}>#{index + 1}</Text>
                    <Text style={styles.recordAmount}>
                      {formatCurrency(record.amount, currency)}
                    </Text>
                  </View>
                  <Text style={styles.recordDate}>
                    {format(new Date(record.date + ' ' + record.time), 'PPp')}
                  </Text>
                  <Text style={styles.recordDetails}>{record.details}</Text>
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.exportButton, generating && styles.buttonDisabled]}
              onPress={generatePDF}
              disabled={generating}
            >
              <Text style={styles.exportButtonText}>
                {generating ? 'Generating...' : '📄 Export Report'}
              </Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
  },
  content: {
    maxHeight: 500,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  amountValue: {
    color: '#007AFF',
    fontSize: 18,
  },
  creditValue: {
    color: '#34C759',
  },
  debitValue: {
    color: '#FF3B30',
  },
  recordItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordNumber: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  recordAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  recordDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  recordDetails: {
    fontSize: 14,
    color: '#333',
  },
  footer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  exportButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
