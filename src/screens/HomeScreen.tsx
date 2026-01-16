import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { getCustomers, getSuppliers, getRecords } from '../services/storage';
import { formatCurrency } from '../services/currency';

export default function HomeScreen() {
  const { user } = useAuth();
  const { currency } = useCurrency();
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    customers: 0,
    suppliers: 0,
    records: 0,
    totalAmount: 0,
    creditTotal: 0,
    debitTotal: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    if (!user) return;

    const customers = await getCustomers(user.id);
    const suppliers = await getSuppliers(user.id);
    const records = await getRecords(user.id);

    const totalAmount = records.reduce((sum, r) => sum + r.amount, 0);
    const creditTotal = records
      .filter(r => (r.recordType || 'credit') === 'credit')
      .reduce((sum, r) => sum + r.amount, 0);
    const debitTotal = records
      .filter(r => (r.recordType || 'credit') === 'debit')
      .reduce((sum, r) => sum + r.amount, 0);

    setStats({
      customers: customers.length,
      suppliers: suppliers.length,
      records: records.length,
      totalAmount,
      creditTotal,
      debitTotal,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>{t.welcomeBack}</Text>
            <Text style={styles.name}>{user?.name}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: '#e3f2fd' }]}>
              <Ionicons name="people" size={28} color="#007AFF" />
            </View>
            <Text style={styles.statNumber}>{stats.customers}</Text>
            <Text style={styles.statLabel}>{t.customers}</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: '#e8f5e9' }]}>
              <Ionicons name="business" size={28} color="#34C759" />
            </View>
            <Text style={styles.statNumber}>{stats.suppliers}</Text>
            <Text style={styles.statLabel}>{t.suppliers}</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: '#fff3e0' }]}>
              <Ionicons name="document-text" size={28} color="#FF9500" />
            </View>
            <Text style={styles.statNumber}>{stats.records}</Text>
            <Text style={styles.statLabel}>{t.records}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financial Summary</Text>
        <View style={styles.financialCard}>
          <View style={styles.financialRow}>
            <View style={styles.financialItem}>
              <Ionicons name="arrow-up-circle" size={24} color="#34C759" />
              <View style={styles.financialText}>
                <Text style={styles.financialLabel}>Credit</Text>
                <Text style={[styles.financialValue, { color: '#34C759' }]}>
                  {formatCurrency(stats.creditTotal, currency)}
                </Text>
              </View>
            </View>
            <View style={styles.financialDivider} />
            <View style={styles.financialItem}>
              <Ionicons name="arrow-down-circle" size={24} color="#FF3B30" />
              <View style={styles.financialText}>
                <Text style={styles.financialLabel}>Debit</Text>
                <Text style={[styles.financialValue, { color: '#FF3B30' }]}>
                  {formatCurrency(stats.debitTotal, currency)}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(stats.totalAmount, currency)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>{t.developerBy}</Text>
      </View>
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
    paddingHorizontal: 12,
    paddingVertical: 16,
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
  },
  greeting: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: 0.3,
  },
  section: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  financialCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 16,
  },
  financialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  financialText: {
    flex: 1,
  },
  financialLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  financialValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  financialDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#007AFF',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    color: '#999',
    fontSize: 12,
  },
});
