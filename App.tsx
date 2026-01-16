import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { CurrencyProvider } from './src/context/CurrencyContext';
import { LanguageProvider } from './src/context/LanguageContext';

// Auth Screens
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';

// Main Screens
import HomeScreen from './src/screens/HomeScreen';
import CustomersScreen from './src/screens/customers/CustomersScreen';
import CustomerDetailScreen from './src/screens/customers/CustomerDetailScreen';
import AddCustomerScreen from './src/screens/customers/AddCustomerScreen';
import AddRecordScreen from './src/screens/records/AddRecordScreen';
import EditRecordScreen from './src/screens/records/EditRecordScreen';
import SuppliersScreen from './src/screens/suppliers/SuppliersScreen';
import SupplierDetailScreen from './src/screens/suppliers/SupplierDetailScreen';
import AddSupplierScreen from './src/screens/suppliers/AddSupplierScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        let iconName: string = 'home-outline';
        
        if (route?.name === 'Home') {
          iconName = 'home-outline';
        } else if (route?.name === 'Customers') {
          iconName = 'people-outline';
        } else if (route?.name === 'Suppliers') {
          iconName = 'business-outline';
        } else if (route?.name === 'Settings') {
          iconName = 'settings-outline';
        }

        return {
          tabBarIcon: ({ focused, color, size }) => {
            return <Ionicons name={iconName as any} size={size || 24} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        };
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Customers" component={CustomersScreen} />
      <Tab.Screen name="Suppliers" component={SuppliersScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabs} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="CustomerDetail" 
        component={CustomerDetailScreen}
        options={{ title: 'Customer Details' }}
      />
      <Stack.Screen 
        name="AddCustomer" 
        component={AddCustomerScreen}
        options={{ title: 'Add Customer' }}
      />
      <Stack.Screen 
        name="AddRecord" 
        component={AddRecordScreen}
        options={{ title: 'Add Record' }}
      />
      <Stack.Screen 
        name="EditRecord" 
        component={EditRecordScreen}
        options={{ title: 'Edit Record' }}
      />
      <Stack.Screen 
        name="SupplierDetail" 
        component={SupplierDetailScreen}
        options={{ title: 'Supplier Details' }}
      />
      <Stack.Screen 
        name="AddSupplier" 
        component={AddSupplierScreen}
        options={{ title: 'Add Supplier' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <NavigationContainer>
            <StatusBar style="light" />
            <AppNavigator />
          </NavigationContainer>
        </CurrencyProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
