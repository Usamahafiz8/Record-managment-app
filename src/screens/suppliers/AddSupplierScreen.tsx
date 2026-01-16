import React from 'react';
import EntityFormScreen from '../../components/EntityFormScreen';
import { saveSupplier, updateSupplier } from '../../services/storage';

export default function AddSupplierScreen() {
  return (
    <EntityFormScreen
      type="supplier"
      saveEntity={saveSupplier}
      updateEntity={updateSupplier}
      buttonColor="#34C759"
      entityLabel="Supplier"
    />
  );
}
