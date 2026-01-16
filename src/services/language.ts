import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'en' | 'ur';

export interface Translations {
  // Auth
  signIn: string;
  signUp: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  signInToContinue: string;
  signUpToGetStarted: string;
  dontHaveAccount: string;
  alreadyHaveAccount: string;
  createAccount: string;
  
  // Common
  save: string;
  update: string;
  cancel: string;
  delete: string;
  edit: string;
  confirm: string;
  done: string;
  loading: string;
  error: string;
  success: string;
  
  // Home
  welcomeBack: string;
  totalAmount: string;
  customers: string;
  suppliers: string;
  records: string;
  
  // Entity
  addCustomer: string;
  addSupplier: string;
  customerDetails: string;
  supplierDetails: string;
  name: string;
  phone: string;
  address: string;
  noCustomers: string;
  noSuppliers: string;
  tapToAdd: string;
  
  // Records
  addRecord: string;
  details: string;
  amount: string;
  date: string;
  time: string;
  noRecords: string;
  deleteRecord: string;
  
  // Settings
  account: string;
  preferences: string;
  dataManagement: string;
  exportData: string;
  importData: string;
  language: string;
  currency: string;
  logout: string;
  developerBy: string;
  selectLanguage: string;
  english: string;
  urdu: string;
  
  // Alerts
  fillAllFields: string;
  invalidEmail: string;
  passwordTooShort: string;
  passwordsNotMatch: string;
  invalidCredentials: string;
  emailAlreadyRegistered: string;
  deleteConfirm: string;
  logoutConfirm: string;
  sureToDelete: string;
  sureToLogout: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    signIn: 'Sign In',
    signUp: 'Sign Up',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    signInToContinue: 'Sign in to continue',
    signUpToGetStarted: 'Sign up to get started',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    createAccount: 'Create Account',
    save: 'Save',
    update: 'Update',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    confirm: 'Confirm',
    done: 'Done',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    welcomeBack: 'Welcome back,',
    totalAmount: 'Total Amount',
    customers: 'Customers',
    suppliers: 'Suppliers',
    records: 'Records',
    addCustomer: 'Add Customer',
    addSupplier: 'Add Supplier',
    customerDetails: 'Customer Details',
    supplierDetails: 'Supplier Details',
    name: 'Name',
    phone: 'Phone',
    address: 'Address',
    noCustomers: 'No customers yet',
    noSuppliers: 'No suppliers yet',
    tapToAdd: 'Tap the + button to add one',
    addRecord: 'Add Record',
    details: 'Details',
    amount: 'Amount',
    date: 'Date',
    time: 'Time',
    noRecords: 'No records yet',
    deleteRecord: 'Delete Record',
    account: 'Account',
    preferences: 'Preferences',
    dataManagement: 'Data Management',
    exportData: 'Export Data',
    importData: 'Import Data',
    language: 'Language',
    currency: 'Currency',
    logout: 'Logout',
    developerBy: 'Developer by Osama',
    selectLanguage: 'Select Language',
    english: 'English',
    urdu: 'Urdu',
    fillAllFields: 'Please fill in all fields',
    invalidEmail: 'Please enter a valid email address',
    passwordTooShort: 'Password must be at least 6 characters long',
    passwordsNotMatch: 'Passwords do not match. Please try again.',
    invalidCredentials: 'Invalid email or password. Please check your credentials and try again.',
    emailAlreadyRegistered: 'This email is already registered. Please use a different email or try logging in.',
    deleteConfirm: 'Are you sure you want to delete',
    logoutConfirm: 'Are you sure you want to logout?',
    sureToDelete: 'Are you sure you want to delete this record?',
    sureToLogout: 'Are you sure you want to logout?',
  },
  ur: {
    signIn: 'لاگ ان',
    signUp: 'سائن اپ',
    email: 'ای میل',
    password: 'پاس ورڈ',
    confirmPassword: 'پاس ورڈ کی تصدیق',
    fullName: 'پورا نام',
    signInToContinue: 'جاری رکھنے کے لیے لاگ ان کریں',
    signUpToGetStarted: 'شروع کرنے کے لیے سائن اپ کریں',
    dontHaveAccount: 'اکاؤنٹ نہیں ہے؟',
    alreadyHaveAccount: 'پہلے سے اکاؤنٹ ہے؟',
    createAccount: 'اکاؤنٹ بنائیں',
    save: 'محفوظ',
    update: 'اپڈیٹ',
    cancel: 'منسوخ',
    delete: 'حذف',
    edit: 'ترمیم',
    confirm: 'تصدیق',
    done: 'ہو گیا',
    loading: 'لوڈ ہو رہا ہے...',
    error: 'غلطی',
    success: 'کامیابی',
    welcomeBack: 'خوش آمدید،',
    totalAmount: 'کل رقم',
    customers: 'گاہک',
    suppliers: 'سپلائرز',
    records: 'ریکارڈز',
    addCustomer: 'گاہک شامل کریں',
    addSupplier: 'سپلائر شامل کریں',
    customerDetails: 'گاہک کی تفصیلات',
    supplierDetails: 'سپلائر کی تفصیلات',
    name: 'نام',
    phone: 'فون',
    address: 'پتہ',
    noCustomers: 'ابھی تک کوئی گاہک نہیں',
    noSuppliers: 'ابھی تک کوئی سپلائر نہیں',
    tapToAdd: 'شامل کرنے کے لیے + بٹن دبائیں',
    addRecord: 'ریکارڈ شامل کریں',
    details: 'تفصیلات',
    amount: 'رقم',
    date: 'تاریخ',
    time: 'وقت',
    noRecords: 'ابھی تک کوئی ریکارڈ نہیں',
    deleteRecord: 'ریکارڈ حذف کریں',
    account: 'اکاؤنٹ',
    preferences: 'ترجیحات',
    dataManagement: 'ڈیٹا مینجمنٹ',
    exportData: 'ڈیٹا برآمد کریں',
    importData: 'ڈیٹا درآمد کریں',
    language: 'زبان',
    currency: 'کرنسی',
    logout: 'لاگ آؤٹ',
    developerBy: 'ڈویلپر بذریعہ اسامہ',
    selectLanguage: 'زبان منتخب کریں',
    english: 'انگریزی',
    urdu: 'اردو',
    fillAllFields: 'براہ کرم تمام فیلڈز بھریں',
    invalidEmail: 'براہ کرم درست ای میل ایڈریس درج کریں',
    passwordTooShort: 'پاس ورڈ کم از کم 6 حروف کا ہونا چاہیے',
    passwordsNotMatch: 'پاس ورڈز میل نہیں کھاتے۔ براہ کرم دوبارہ کوشش کریں۔',
    invalidCredentials: 'غلط ای میل یا پاس ورڈ۔ براہ کرم اپنے اسناد چیک کریں اور دوبارہ کوشش کریں۔',
    emailAlreadyRegistered: 'یہ ای میل پہلے سے رجسٹرڈ ہے۔ براہ کرم مختلف ای میل استعمال کریں یا لاگ ان کریں۔',
    deleteConfirm: 'کیا آپ واقعی حذف کرنا چاہتے ہیں',
    logoutConfirm: 'کیا آپ واقعی لاگ آؤٹ کرنا چاہتے ہیں؟',
    sureToDelete: 'کیا آپ واقعی اس ریکارڈ کو حذف کرنا چاہتے ہیں؟',
    sureToLogout: 'کیا آپ واقعی لاگ آؤٹ کرنا چاہتے ہیں؟',
  },
};

const LANGUAGE_STORAGE_KEY = 'user_language';

export const getLanguage = async (userId: string): Promise<Language> => {
  try {
    const key = `${LANGUAGE_STORAGE_KEY}_${userId}`;
    const language = await AsyncStorage.getItem(key);
    return (language as Language) || 'en';
  } catch (error) {
    console.error('Error getting language:', error);
    return 'en';
  }
};

export const setLanguage = async (userId: string, language: Language): Promise<boolean> => {
  try {
    const key = `${LANGUAGE_STORAGE_KEY}_${userId}`;
    await AsyncStorage.setItem(key, language);
    return true;
  } catch (error) {
    console.error('Error setting language:', error);
    return false;
  }
};
