import { Transaction } from "@/types";

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    created_at: new Date().toISOString(),
    date: new Date().toISOString().split('T')[0],
    category: 'Food',
    description: 'Lunch at Joe\'s',
    amount: 15.50,
    type: 'expense'
  },
  {
    id: '2',
    created_at: new Date().toISOString(),
    date: new Date().toISOString().split('T')[0],
    category: 'Transport',
    description: 'Gas refill',
    amount: 45.00,
    type: 'expense'
  },
  {
    id: '3',
    created_at: new Date().toISOString(),
    date: new Date().toISOString().split('T')[0],
    category: 'Bills',
    description: 'Internet Bill',
    amount: 60.00,
    type: 'expense'
  },
  {
    id: '4',
    created_at: new Date().toISOString(),
    date: new Date().toISOString().split('T')[0],
    category: 'Income',
    description: 'Salary',
    amount: 3000.00,
    type: 'income'
  }
];
