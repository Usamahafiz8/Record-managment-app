import React from 'react';
import EntityDetailScreen from '../../components/EntityDetailScreen';

export default function CustomerDetailScreen() {
  return (
    <EntityDetailScreen
      type="customer"
      addScreenName="AddRecord"
      editScreenName="AddCustomer"
      primaryColor="#007AFF"
    />
  );
}
