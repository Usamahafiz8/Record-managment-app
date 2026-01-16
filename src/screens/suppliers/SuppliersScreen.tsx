import React from 'react';
import EntityListScreen from '../../components/EntityListScreen';
import { getSuppliers, deleteSupplier } from '../../services/storage';

export default function SuppliersScreen() {
  return (
    <EntityListScreen
      type="supplier"
      getEntities={getSuppliers}
      deleteEntity={deleteSupplier}
      detailScreenName="SupplierDetail"
      addScreenName="AddSupplier"
      deleteTitle="Delete Supplier"
      emptyIcon="🏢"
      emptyText="No suppliers yet"
      fabColor="#34C759"
    />
  );
}
