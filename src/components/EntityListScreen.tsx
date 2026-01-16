import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { Customer, Supplier } from '../types';

type EntityType = 'customer' | 'supplier';
type Entity = Customer | Supplier;

interface EntityListScreenProps {
  type: EntityType;
  getEntities: (userId: string) => Promise<Entity[]>;
  deleteEntity: (id: string) => Promise<boolean>;
  detailScreenName: string;
  addScreenName: string;
  deleteTitle: string;
  emptyIcon: string;
  emptyText: string;
  fabColor: string;
}

export default function EntityListScreen({
  type,
  getEntities,
  deleteEntity,
  detailScreenName,
  addScreenName,
  deleteTitle,
  emptyIcon,
  emptyText,
  fabColor,
}: EntityListScreenProps) {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [entities, setEntities] = useState<Entity[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadEntities();
    }, [])
  );

  const loadEntities = async () => {
    if (!user) return;
    const data = await getEntities(user.id);
    setEntities(data);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEntities();
    setRefreshing(false);
  };

  const handleDelete = (entity: Entity) => {
    Alert.alert(
      deleteTitle,
      `Are you sure you want to delete ${entity.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteEntity(entity.id);
            loadEntities();
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Entity }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate(detailScreenName as never, { [type]: item } as never)}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <TouchableOpacity
            onPress={() => handleDelete(item)}
            style={styles.deleteButton}
          >
            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
        {item.email && (
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={16} color="#666" />
            <Text style={styles.cardSubtitle}>{item.email}</Text>
          </View>
        )}
        {item.phone && (
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={16} color="#666" />
            <Text style={styles.cardSubtitle}>{item.phone}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={entities}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name={type === 'customer' ? "people-outline" : "business-outline"} size={64} color="#ccc" />
            <Text style={styles.emptyText}>{emptyText}</Text>
            <Text style={styles.emptySubtext}>Tap the + button to add one</Text>
          </View>
        }
      />
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: fabColor }]}
        onPress={() => navigation.navigate(addScreenName as never)}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Developer by Osama</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardContent: {
    padding: 18,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
    letterSpacing: 0.2,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fff5f5',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 20,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  footer: {
    padding: 15,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  footerText: {
    color: '#999',
    fontSize: 12,
  },
});
