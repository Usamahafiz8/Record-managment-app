export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  userId: string;
}

export interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  userId: string;
}

export interface Record {
  id: string;
  customerId?: string;
  supplierId?: string;
  type: 'customer' | 'supplier';
  recordType: 'credit' | 'debit';
  details: string;
  amount: number;
  date: string;
  time: string;
  createdAt: string;
  userId: string;
  history?: RecordHistory[];
}

export interface RecordHistory {
  id: string;
  recordId: string;
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  changedAt: string;
  changedBy: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

export interface AppData {
  customers: Customer[];
  suppliers: Supplier[];
  records: Record[];
}
