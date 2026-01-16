import AsyncStorage from '@react-native-async-storage/async-storage';

export const getStorageSize = async (): Promise<{ size: number; formatted: string }> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    let totalSize = 0;

    for (const key of keys) {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        // Approximate size in bytes (UTF-16 encoding, 2 bytes per character)
        totalSize += value.length * 2;
      }
    }

    // Convert to human-readable format
    const formatted = formatBytes(totalSize);
    return { size: totalSize, formatted };
  } catch (error) {
    console.error('Error calculating storage size:', error);
    return { size: 0, formatted: '0 B' };
  }
};

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};
