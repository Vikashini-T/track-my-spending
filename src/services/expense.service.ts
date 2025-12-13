import axiosInstance from '@/api/axiosInstance';

// Expense interface matching backend structure
export interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  notes: string;
}

// Type for creating/updating expense (without _id)
export interface ExpenseInput {
  title: string;
  amount: number;
  category: string;
  date: string;
  notes: string;
}

// Expense service with all CRUD operations
export const expenseService = {
  // Fetch all expenses
  getAll: async (): Promise<Expense[]> => {
    const response = await axiosInstance.get('/api/expenses');
    return response.data;
  },

  // Fetch single expense by ID
  getById: async (id: string): Promise<Expense> => {
    const response = await axiosInstance.get(`/api/expenses/${id}`);
    return response.data;
  },

  // Create new expense
  create: async (expense: ExpenseInput): Promise<Expense> => {
    const response = await axiosInstance.post('/api/expenses', expense);
    return response.data;
  },

  // Update existing expense
  update: async (id: string, expense: ExpenseInput): Promise<Expense> => {
    const response = await axiosInstance.put(`/api/expenses/${id}`, expense);
    return response.data;
  },

  // Delete expense
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/expenses/${id}`);
  },
};

export default expenseService;
