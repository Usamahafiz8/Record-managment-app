import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { exportAllData, importAllData } from '../services/storage';
import { getStorageSize } from '../services/storageUtils';
import { Currency, CURRENCIES } from '../services/currency';
import { Language } from '../services/language';

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const { language, setLanguage, t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [storageSize, setStorageSize] = useState({ size: 0, formatted: '0 B' });

  React.useEffect(() => {
    loadStorageSize();
  }, []);

  const loadStorageSize = async () => {
    const size = await getStorageSize();
    setStorageSize(size);
  };

  const handleExport = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const data = await exportAllData(user.id);
      const jsonString = JSON.stringify(data, null, 2);
      
      const fileUri = FileSystem.documentDirectory + `record_management_backup_${Date.now()}.json`;
      await FileSystem.writeAsStringAsync(fileUri, jsonString, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Export Record Management Data',
        });
        Alert.alert('Success', 'Data exported successfully!');
      } else {
        Alert.alert('Error', 'Sharing is not available on this device');
      }
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Error', 'Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!user) return;

    Alert.alert(
      'Import Data',
      'This will merge imported data with your existing data. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Import',
          onPress: async () => {
            setLoading(true);
            try {
              const result = await DocumentPicker.getDocumentAsync({
                type: 'application/json',
                copyToCacheDirectory: true,
              });

              if (!result || !('uri' in result)) {
                setLoading(false);
                return;
              }

              const fileContent = await FileSystem.readAsStringAsync(result.uri as string);
              const data = JSON.parse(fileContent);

              if (!data.customers || !data.suppliers || !data.records) {
                throw new Error('Invalid file format');
              }

              const success = await importAllData(data, user.id);
              if (success) {
                Alert.alert('Success', 'Data imported successfully!');
              } else {
                throw new Error('Import failed');
              }
            } catch (error) {
              console.error('Import error:', error);
              Alert.alert('Error', 'Failed to import data. Please check the file format.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Processing...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.account}</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>{t.name}</Text>
          <Text style={styles.infoValue}>{user?.name}</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>{t.email}</Text>
          <Text style={styles.infoValue}>{user?.email}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.preferences}</Text>
        
        <TouchableOpacity 
          style={styles.optionCard} 
          onPress={() => setShowLanguagePicker(true)}
        >
          <View style={styles.optionContent}>
            <Ionicons name="language-outline" size={24} color="#007AFF" />
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>{t.language}</Text>
              <Text style={styles.optionSubtitle}>
                {language === 'en' ? t.english : t.urdu}
              </Text>
            </View>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.optionCard} 
          onPress={() => setShowCurrencyPicker(true)}
        >
          <View style={styles.optionContent}>
            <Ionicons name="cash-outline" size={24} color="#34C759" />
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>{t.currency}</Text>
              <Text style={styles.optionSubtitle}>
                {CURRENCIES[currency].name} ({currency})
              </Text>
            </View>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      </View>

      {showLanguagePicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.selectLanguage}</Text>
              <TouchableOpacity onPress={() => setShowLanguagePicker(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.currencyList}>
              {(['en', 'ur'] as Language[]).map((lang) => (
                <TouchableOpacity
                  key={lang}
                  style={[
                    styles.currencyItem,
                    language === lang && styles.currencyItemSelected,
                  ]}
                  onPress={async () => {
                    await setLanguage(lang);
                    setShowLanguagePicker(false);
                  }}
                >
                  <Text style={styles.currencySymbol}>{lang === 'en' ? '🇬🇧' : '🇵🇰'}</Text>
                  <View style={styles.currencyInfo}>
                    <Text style={styles.currencyName}>
                      {lang === 'en' ? t.english : t.urdu}
                    </Text>
                    <Text style={styles.currencyCode}>{lang.toUpperCase()}</Text>
                  </View>
                  {language === lang && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {showCurrencyPicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Currency</Text>
              <TouchableOpacity onPress={() => setShowCurrencyPicker(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.currencyList}>
              {(Object.keys(CURRENCIES) as Currency[]).map((curr) => (
                <TouchableOpacity
                  key={curr}
                  style={[
                    styles.currencyItem,
                    currency === curr && styles.currencyItemSelected,
                  ]}
                  onPress={async () => {
                    await setCurrency(curr);
                    setShowCurrencyPicker(false);
                  }}
                >
                  <Text style={styles.currencySymbol}>{CURRENCIES[curr].symbol}</Text>
                  <View style={styles.currencyInfo}>
                    <Text style={styles.currencyName}>{CURRENCIES[curr].name}</Text>
                    <Text style={styles.currencyCode}>{curr}</Text>
                  </View>
                  {currency === curr && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.dataManagement}</Text>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Storage Size</Text>
          <Text style={styles.infoValue}>{storageSize.formatted}</Text>
        </View>
        
        <TouchableOpacity style={styles.optionCard} onPress={handleExport}>
          <View style={styles.optionContent}>
            <Ionicons name="download-outline" size={24} color="#FF9500" />
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>{t.exportData}</Text>
              <Text style={styles.optionSubtitle}>Save your data to a JSON file ({storageSize.formatted})</Text>
            </View>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} onPress={handleImport}>
          <View style={styles.optionContent}>
            <Ionicons name="cloud-upload-outline" size={24} color="#5856D6" />
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>{t.importData}</Text>
              <Text style={styles.optionSubtitle}>Restore data from a JSON file</Text>
            </View>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>{t.logout}</Text>
        </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  optionCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    fontSize: 24,
  },
  chevron: {
    fontSize: 28,
    color: '#ccc',
    fontWeight: 'bold',
  },
  optionText: {
    marginLeft: 15,
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutIcon: {
    fontSize: 24,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
    marginLeft: 10,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#999',
    fontSize: 12,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '85%',
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalClose: {
    fontSize: 24,
    color: '#666',
  },
  currencyList: {
    maxHeight: 400,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  currencyItemSelected: {
    backgroundColor: '#e3f2fd',
  },
  currencySymbol: {
    fontSize: 24,
    marginRight: 15,
    width: 40,
    textAlign: 'center',
  },
  currencyInfo: {
    flex: 1,
  },
  currencyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  currencyCode: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  checkmark: {
    fontSize: 20,
    color: '#007AFF',
    fontWeight: 'bold',
  },
});
