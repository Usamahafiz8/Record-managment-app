import AsyncStorage from '@react-native-async-storage/async-storage';
import { Customer, Supplier, Record, AppData } from '../types';

const CUSTOMERS_KEY = 'customers';
const SUPPLIERS_KEY = 'suppliers';
const RECORDS_KEY = 'records';

// Customers
export const getCustomers = async (userId: string): Promise<Customer[]> => {
  try {
    const data = await AsyncStorage.getItem(CUSTOMERS_KEY);
    const customers = data ? JSON.parse(data) : [];
    return customers.filter((c: Customer) => c.userId === userId);
  } catch (error) {
    console.error('Error getting customers:', error);
    return [];
  }
};

export const saveCustomer = async (customer: Customer): Promise<boolean> => {
  try {
    const data = await AsyncStorage.getItem(CUSTOMERS_KEY);
    const customers = data ? JSON.parse(data) : [];
    customers.push(customer);
    await AsyncStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
    return true;
  } catch (error) {
    console.error('Error saving customer:', error);
    return false;
  }
};

export const updateCustomer = async (customer: Customer): Promise<boolean> => {
  try {
    const data = await AsyncStorage.getItem(CUSTOMERS_KEY);
    const customers = data ? JSON.parse(data) : [];
    const index = customers.findIndex((c: Customer) => c.id === customer.id);
    if (index !== -1) {
      customers[index] = customer;
      await AsyncStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating customer:', error);
    return false;
  }
};

export const deleteCustomer = async (customerId: string): Promise<boolean> => {
  try {
    const data = await AsyncStorage.getItem(CUSTOMERS_KEY);
    const customers = data ? JSON.parse(data) : [];
    const filtered = customers.filter((c: Customer) => c.id !== customerId);
    await AsyncStorage.setItem(CUSTOMERS_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting customer:', error);
    return false;
  }
};

// Suppliers
export const getSuppliers = async (userId: string): Promise<Supplier[]> => {
  try {
    const data = await AsyncStorage.getItem(SUPPLIERS_KEY);
    const suppliers = data ? JSON.parse(data) : [];
    return suppliers.filter((s: Supplier) => s.userId === userId);
  } catch (error) {
    console.error('Error getting suppliers:', error);
    return [];
  }
};

export const saveSupplier = async (supplier: Supplier): Promise<boolean> => {
  try {
    const data = await AsyncStorage.getItem(SUPPLIERS_KEY);
    const suppliers = data ? JSON.parse(data) : [];
    suppliers.push(supplier);
    await AsyncStorage.setItem(SUPPLIERS_KEY, JSON.stringify(suppliers));
    return true;
  } catch (error) {
    console.error('Error saving supplier:', error);
    return false;
  }
};

export const updateSupplier = async (supplier: Supplier): Promise<boolean> => {
  try {
    const data = await AsyncStorage.getItem(SUPPLIERS_KEY);
    const suppliers = data ? JSON.parse(data) : [];
    const index = suppliers.findIndex((s: Supplier) => s.id === supplier.id);
    if (index !== -1) {
      suppliers[index] = supplier;
      await AsyncStorage.setItem(SUPPLIERS_KEY, JSON.stringify(suppliers));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating supplier:', error);
    return false;
  }
};

export const deleteSupplier = async (supplierId: string): Promise<boolean> => {
  try {
    const data = await AsyncStorage.getItem(SUPPLIERS_KEY);
    const suppliers = data ? JSON.parse(data) : [];
    const filtered = suppliers.filter((s: Supplier) => s.id !== supplierId);
    await AsyncStorage.setItem(SUPPLIERS_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting supplier:', error);
    return false;
  }
};

// Records
export const getRecords = async (userId: string, customerId?: string, supplierId?: string): Promise<Record[]> => {
  try {
    const data = await AsyncStorage.getItem(RECORDS_KEY);
    const records = data ? JSON.parse(data) : [];
    let filtered = records.filter((r: Record) => r.userId === userId);
    
    if (customerId) {
      filtered = filtered.filter((r: Record) => r.customerId === customerId);
    }
    if (supplierId) {
      filtered = filtered.filter((r: Record) => r.supplierId === supplierId);
    }
    
    return filtered.sort((a: Record, b: Record) => 
      new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime()
    );
  } catch (error) {
    console.error('Error getting records:', error);
    return [];
  }
};

export const saveRecord = async (record: Record): Promise<boolean> => {
  try {
    const data = await AsyncStorage.getItem(RECORDS_KEY);
    const records = data ? JSON.parse(data) : [];
    const recordWithHistory = {
      ...record,
      history: [],
    };
    records.push(recordWithHistory);
    await AsyncStorage.setItem(RECORDS_KEY, JSON.stringify(records));
    return true;
  } catch (error) {
    console.error('Error saving record:', error);
    return false;
  }
};

export const updateRecord = async (record: Record, userId: string, changes: { field: string; oldValue: any; newValue: any }[]): Promise<boolean> => {
  try {
    const data = await AsyncStorage.getItem(RECORDS_KEY);
    const records = data ? JSON.parse(data) : [];
    const index = records.findIndex((r: Record) => r.id === record.id);
    
    if (index !== -1) {
      const existingRecord = records[index];
      const history = existingRecord.history || [];
      
      // Add change history
      history.push({
        id: Date.now().toString(),
        recordId: record.id,
        changes,
        changedAt: new Date().toISOString(),
        changedBy: userId,
      });
      
      records[index] = {
        ...record,
        history: history.slice(-50), // Keep last 50 changes
      };
      
      await AsyncStorage.setItem(RECORDS_KEY, JSON.stringify(records));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating record:', error);
    return false;
  }
};

export const deleteRecord = async (recordId: string): Promise<boolean> => {
  try {
    const data = await AsyncStorage.getItem(RECORDS_KEY);
    const records = data ? JSON.parse(data) : [];
    const filtered = records.filter((r: Record) => r.id !== recordId);
    await AsyncStorage.setItem(RECORDS_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting record:', error);
    return false;
  }
};

// Export/Import Data
export const exportAllData = async (userId: string): Promise<AppData> => {
  try {
    const customers = await getCustomers(userId);
    const suppliers = await getSuppliers(userId);
    const records = await getRecords(userId);
    
    return {
      customers,
      suppliers,
      records,
    };
  } catch (error) {
    console.error('Error exporting data:', error);
    return { customers: [], suppliers: [], records: [] };
  }
};

export const importAllData = async (data: AppData, userId: string): Promise<boolean> => {
  try {
    // Merge with existing data (update userIds)
    const customers = data.customers.map(c => ({ ...c, userId }));
    const suppliers = data.suppliers.map(s => ({ ...s, userId }));
    const records = data.records.map(r => ({ ...r, userId }));

    // Get existing data
    const existingCustomers = await AsyncStorage.getItem(CUSTOMERS_KEY);
    const existingSuppliers = await AsyncStorage.getItem(SUPPLIERS_KEY);
    const existingRecords = await AsyncStorage.getItem(RECORDS_KEY);

    const allCustomers = existingCustomers ? JSON.parse(existingCustomers) : [];
    const allSuppliers = existingSuppliers ? JSON.parse(existingSuppliers) : [];
    const allRecords = existingRecords ? JSON.parse(existingRecords) : [];

    // Remove old user data and add new
    const filteredCustomers = allCustomers.filter((c: Customer) => c.userId !== userId);
    const filteredSuppliers = allSuppliers.filter((s: Supplier) => s.userId !== userId);
    const filteredRecords = allRecords.filter((r: Record) => r.userId !== userId);

    await AsyncStorage.setItem(CUSTOMERS_KEY, JSON.stringify([...filteredCustomers, ...customers]));
    await AsyncStorage.setItem(SUPPLIERS_KEY, JSON.stringify([...filteredSuppliers, ...suppliers]));
    await AsyncStorage.setItem(RECORDS_KEY, JSON.stringify([...filteredRecords, ...records]));

    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};
