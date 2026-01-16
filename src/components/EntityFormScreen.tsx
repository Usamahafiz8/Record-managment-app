import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { Customer, Supplier } from '../types';

type EntityType = 'customer' | 'supplier';
type Entity = Customer | Supplier;

interface EntityFormScreenProps {
  type: EntityType;
  saveEntity: (entity: Entity) => Promise<boolean>;
  updateEntity: (entity: Entity) => Promise<boolean>;
  buttonColor: string;
  entityLabel: string;
}

export default function EntityFormScreen({
  type,
  saveEntity,
  updateEntity,
  buttonColor,
  entityLabel,
}: EntityFormScreenProps) {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const entity = route.params?.[type] as Entity | undefined;

  const [name, setName] = useState(entity?.name || '');
  const [email, setEmail] = useState(entity?.email || '');
  const [phone, setPhone] = useState(entity?.phone || '');
  const [address, setAddress] = useState(entity?.address || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', `Please enter ${entityLabel} name`);
      return;
    }

    if (!user) return;

    setLoading(true);

    const entityData: Entity = {
      id: entity?.id || Date.now().toString(),
      name: name.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      address: address.trim() || undefined,
      createdAt: entity?.createdAt || new Date().toISOString(),
      userId: user.id,
    } as Entity;

    const success = entity
      ? await updateEntity(entityData)
      : await saveEntity(entityData);

    setLoading(false);

    if (success) {
      navigation.goBack();
    } else {
      Alert.alert('Error', `Failed to save ${entityLabel}`);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.form}>
          <Text style={styles.label}>Name *</Text>
          <TextInput
            style={styles.input}
            placeholder={`${entityLabel} name`}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="email@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: buttonColor }, loading && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Saving...' : entity ? 'Update' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
