import React from 'react';
import EntityDetailScreen from '../../components/EntityDetailScreen';

export default function SupplierDetailScreen() {
  return (
    <EntityDetailScreen
      type="supplier"
      addScreenName="AddRecord"
      editScreenName="AddSupplier"
      primaryColor="#34C759"
    />
  );
}
