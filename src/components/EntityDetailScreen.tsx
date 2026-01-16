import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { getRecords, deleteRecord, updateRecord } from '../services/storage';
import { formatCurrency } from '../services/currency';
import { Customer, Supplier, Record } from '../types';
import { format } from 'date-fns';
import DateRangeFilter from './DateRangeFilter';
import ReportModal from './ReportModal';
import RecordHistoryModal from './RecordHistoryModal';

type EntityType = 'customer' | 'supplier';
type Entity = Customer | Supplier;

interface EntityDetailScreenProps {
  type: EntityType;
  addScreenName: string;
  editScreenName: string;
  primaryColor: string;
}

export default function EntityDetailScreen({
  type,
  addScreenName,
  editScreenName,
  primaryColor,
}: EntityDetailScreenProps) {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const { currency } = useCurrency();
  const entity = route.params?.[type] as Entity;
  const [records, setRecords] = useState<Record[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<Record[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedRecordHistory, setSelectedRecordHistory] = useState<Record | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadRecords();
    }, [])
  );

  const loadRecords = async () => {
    if (!user || !entity) return;
    const data = await getRecords(
      user.id,
      type === 'customer' ? entity.id : undefined,
      type === 'supplier' ? entity.id : undefined
    );
    setRecords(data);
    applyDateFilter(data);
  };

  const applyDateFilter = (data: Record[]) => {
    let filtered = data;
    
    if (startDate || endDate) {
      filtered = data.filter((record) => {
        const recordDate = new Date(record.date);
        if (startDate && recordDate < startDate) return false;
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (recordDate > end) return false;
        }
        return true;
      });
    }
    
    setFilteredRecords(filtered);
    const total = filtered.reduce((sum, r) => sum + r.amount, 0);
    setTotalAmount(total);
  };

  const creditTotal = filteredRecords
    .filter(r => (r.recordType || 'credit') === 'credit')
    .reduce((sum, r) => sum + r.amount, 0);
  
  const debitTotal = filteredRecords
    .filter(r => (r.recordType || 'credit') === 'debit')
    .reduce((sum, r) => sum + r.amount, 0);

  useEffect(() => {
    applyDateFilter(records);
  }, [startDate, endDate, records]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRecords();
    setRefreshing(false);
  };

  const handleDeleteRecord = (record: Record) => {
    Alert.alert(
      'Delete Record',
      'Are you sure you want to delete this record?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteRecord(record.id);
            loadRecords();
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    if (!entity) return;
    navigation.navigate(editScreenName as never, { [type]: entity } as never);
  };

  if (!entity) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.name}>No data available</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.name}>{entity.name}</Text>
          <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
            <Ionicons name="create-outline" size={24} color={primaryColor} />
          </TouchableOpacity>
        </View>
        {entity.email && (
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={18} color="#666" />
            <Text style={styles.info}>{entity.email}</Text>
          </View>
        )}
        {entity.phone && (
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={18} color="#666" />
            <Text style={styles.info}>{entity.phone}</Text>
          </View>
        )}
        {entity.address && (
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={18} color="#666" />
            <Text style={styles.info}>{entity.address}</Text>
          </View>
        )}
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Records</Text>
          <Text style={styles.summaryValue}>{filteredRecords.length}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Credit</Text>
          <Text style={[styles.summaryValue, { color: '#34C759' }]}>
            {formatCurrency(creditTotal, currency)}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Debit</Text>
          <Text style={[styles.summaryValue, { color: '#FF3B30' }]}>
            {formatCurrency(debitTotal, currency)}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Records</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setShowDateFilter(true)}
            >
              <Ionicons name="filter-outline" size={22} color="#666" />
            </TouchableOpacity>
            {filteredRecords.length > 0 && (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setShowReportModal(true)}
              >
                <Ionicons name="stats-chart-outline" size={22} color="#666" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: primaryColor }]}
              onPress={() =>
                navigation.navigate(addScreenName as never, {
                  [type === 'customer' ? 'customerId' : 'supplierId']: entity.id,
                  type,
                } as never)
              }
            >
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {(startDate || endDate) && (
          <View style={styles.filterInfo}>
            <Text style={styles.filterText}>
              Filtered: {startDate?.toLocaleDateString() || 'All'} - {endDate?.toLocaleDateString() || 'All'}
            </Text>
            <TouchableOpacity onPress={() => {
              setStartDate(null);
              setEndDate(null);
            }}>
              <Text style={styles.clearFilterText}>Clear</Text>
            </TouchableOpacity>
          </View>
        )}

        {filteredRecords.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No records yet</Text>
            <Text style={styles.emptySubtext}>Tap the + button to add a record</Text>
          </View>
        ) : (
          filteredRecords.map((record) => (
            <View key={record.id} style={styles.recordCard}>
              <View style={styles.recordHeader}>
                <View style={styles.recordAmountRow}>
                  <Text style={[styles.recordAmount, { color: primaryColor }]}>
                    {formatCurrency(record.amount, currency)}
                  </Text>
                  <View style={[styles.recordTypeBadge, (record.recordType || 'credit') === 'credit' ? styles.creditBadge : styles.debitBadge]}>
                    <Ionicons 
                      name={(record.recordType || 'credit') === 'credit' ? 'arrow-up' : 'arrow-down'} 
                      size={12} 
                      color="#fff" 
                    />
                    <Text style={styles.recordTypeText}>
                      {(record.recordType || 'credit').toUpperCase()}
                    </Text>
                  </View>
                </View>
                <View style={styles.recordActions}>
                  {record.history && record.history.length > 0 && (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedRecordHistory(record);
                        setShowHistoryModal(true);
                      }}
                      style={styles.iconButtonSmall}
                    >
                      <Ionicons name="time-outline" size={20} color="#666" />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => navigation.navigate('EditRecord' as never, { record } as never)}
                    style={styles.iconButtonSmall}
                  >
                    <Ionicons name="create-outline" size={20} color={primaryColor} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteRecord(record)}
                    style={styles.iconButtonSmall}
                  >
                    <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.recordDetails}>{record.details}</Text>
              <Text style={styles.recordDate}>
                {format(new Date(record.date + ' ' + record.time), 'PPp')}
              </Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Developer by Osama</Text>
      </View>

      <DateRangeFilter
        visible={showDateFilter}
        startDate={startDate}
        endDate={endDate}
        onConfirm={(start, end) => {
          setStartDate(start);
          setEndDate(end);
          setShowDateFilter(false);
        }}
        onCancel={() => setShowDateFilter(false)}
      />

      <ReportModal
        visible={showReportModal}
        records={filteredRecords}
        entityName={entity.name}
        entityType={type}
        currency={currency}
        startDate={startDate}
        endDate={endDate}
        onClose={() => setShowReportModal(false)}
      />

      <RecordHistoryModal
        visible={showHistoryModal}
        history={selectedRecordHistory?.history || []}
        onClose={() => {
          setShowHistoryModal(false);
          setSelectedRecordHistory(null);
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
    letterSpacing: 0.3,
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  info: {
    fontSize: 15,
    color: '#666',
    flex: 1,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 11,
    color: '#888',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  amount: {
    color: '#007AFF',
  },
  section: {
    padding: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  filterInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  filterText: {
    fontSize: 14,
    color: '#333',
  },
  clearFilterText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: 0.3,
  },
  addButton: {
    padding: 10,
    borderRadius: 12,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  recordAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  recordTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  creditBadge: {
    backgroundColor: '#34C759',
  },
  debitBadge: {
    backgroundColor: '#FF3B30',
  },
  recordTypeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  recordActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButtonSmall: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#f8f8f8',
  },
  recordAmount: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  recordDetails: {
    fontSize: 14,
    color: '#444',
    marginBottom: 6,
    lineHeight: 20,
  },
  recordDate: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 17,
    color: '#666',
    marginTop: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#999',
    fontSize: 12,
  },
});
