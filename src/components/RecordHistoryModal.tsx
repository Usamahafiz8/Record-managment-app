import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { RecordHistory } from '../types';
import { format } from 'date-fns';

interface RecordHistoryModalProps {
  visible: boolean;
  history: RecordHistory[];
  onClose: () => void;
}

export default function RecordHistoryModal({
  visible,
  history,
  onClose,
}: RecordHistoryModalProps) {
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
            <Text style={styles.title}>Record History</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {history.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No changes recorded</Text>
              </View>
            ) : (
              history.map((entry, index) => (
                <View key={entry.id} style={styles.historyItem}>
                  <View style={styles.historyHeader}>
                    <Text style={styles.historyNumber}>#{history.length - index}</Text>
                    <Text style={styles.historyDate}>
                      {format(new Date(entry.changedAt), 'PPp')}
                    </Text>
                  </View>
                  {entry.changes.map((change, changeIndex) => (
                    <View key={changeIndex} style={styles.changeItem}>
                      <Text style={styles.changeField}>{change.field}:</Text>
                      <View style={styles.changeValues}>
                        <Text style={styles.oldValue}>
                          Old: {String(change.oldValue)}
                        </Text>
                        <Text style={styles.newValue}>
                          New: {String(change.newValue)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              ))
            )}
          </ScrollView>
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
    maxHeight: '80%',
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
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  historyItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  historyNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  historyDate: {
    fontSize: 12,
    color: '#666',
  },
  changeItem: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  changeField: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  changeValues: {
    marginLeft: 10,
  },
  oldValue: {
    fontSize: 13,
    color: '#999',
    textDecorationLine: 'line-through',
    marginBottom: 3,
  },
  newValue: {
    fontSize: 13,
    color: '#34C759',
    fontWeight: '600',
  },
});
