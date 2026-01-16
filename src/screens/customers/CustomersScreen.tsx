import React from 'react';
import EntityListScreen from '../../components/EntityListScreen';
import { getCustomers, deleteCustomer } from '../../services/storage';

export default function CustomersScreen() {
  return (
    <EntityListScreen
      type="customer"
      getEntities={getCustomers}
      deleteEntity={deleteCustomer}
      detailScreenName="CustomerDetail"
      addScreenName="AddCustomer"
      deleteTitle="Delete Customer"
      emptyIcon="👥"
      emptyText="No customers yet"
      fabColor="#007AFF"
    />
  );
}
