import React from 'react';
import EntityFormScreen from '../../components/EntityFormScreen';
import { saveCustomer, updateCustomer } from '../../services/storage';

export default function AddCustomerScreen() {
  return (
    <EntityFormScreen
      type="customer"
      saveEntity={saveCustomer}
      updateEntity={updateCustomer}
      buttonColor="#007AFF"
      entityLabel="Customer"
    />
  );
}
