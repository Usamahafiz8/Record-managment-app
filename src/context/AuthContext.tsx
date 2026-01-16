import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      if (userJson) {
        try {
          const parsedUser = JSON.parse(userJson);
          if (parsedUser && parsedUser.id && parsedUser.email) {
            setUser(parsedUser);
          }
        } catch (parseError) {
          console.error('Error parsing user data:', parseError);
          // Clear corrupted data
          await AsyncStorage.removeItem('user');
        }
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      if (!email || !password) {
        return false;
      }

      const usersJson = await AsyncStorage.getItem('users');
      if (!usersJson) {
        return false;
      }

      let users: User[] = [];
      try {
        users = JSON.parse(usersJson);
        if (!Array.isArray(users)) {
          users = [];
        }
      } catch (parseError) {
        console.error('Error parsing users data:', parseError);
        return false;
      }
      
      const foundUser = users.find((u: User) => u.email === email && u.password === password);
      
      if (foundUser && foundUser.id && foundUser.email) {
        const userData = { ...foundUser };
        delete userData.password;
        setUser(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error logging in:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      if (!name || !email || !password) {
        return false;
      }

      const usersJson = await AsyncStorage.getItem('users');
      let users: User[] = [];
      
      if (usersJson) {
        try {
          users = JSON.parse(usersJson);
          if (!Array.isArray(users)) {
            users = [];
          }
        } catch (parseError) {
          console.error('Error parsing users data:', parseError);
          users = [];
        }
      }
      
      const userExists = users.some((u: User) => u.email === email);
      if (userExists) {
        return false;
      }

      const newUser: User = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.trim(),
        password,
      };

      users.push(newUser);
      await AsyncStorage.setItem('users', JSON.stringify(users));
      
      const userData = { ...newUser };
      delete userData.password;
      setUser(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Error registering:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
