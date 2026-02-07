export type Transaction = {
  id: string;
  created_at: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
};

export const CATEGORIES = [
  'Food',
  'Transport',
  'Bills',
  'Entertainment',
  'Shopping',
  'Health',
  'Education',
  'Others',
];
