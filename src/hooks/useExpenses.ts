import { useState, useEffect, useCallback } from 'react';
import expenseService, { Expense, ExpenseInput } from '@/services/expense.service';
import { useToast } from '@/hooks/use-toast';

// Custom hook for expense state management
export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  // Fetch all expenses
  const fetchExpenses = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      const data = await expenseService.getAll();
      setExpenses(data);
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
      setError('Failed to load expenses. Please check if the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load expenses on mount
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Create or update expense
  const saveExpense = async (expenseData: ExpenseInput) => {
    setIsSubmitting(true);
    try {
      if (editingExpense) {
        // Update existing expense
        const updated = await expenseService.update(editingExpense._id, expenseData);
        setExpenses((prev) =>
          prev.map((e) => (e._id === editingExpense._id ? updated : e))
        );
        setEditingExpense(null);
        toast({
          title: 'Expense Updated',
          description: 'Your expense has been successfully updated.',
        });
      } else {
        // Create new expense
        const created = await expenseService.create(expenseData);
        setExpenses((prev) => [created, ...prev]);
        toast({
          title: 'Expense Added',
          description: 'Your expense has been successfully added.',
        });
      }
      setError(null);
      return true;
    } catch (err) {
      console.error('Failed to save expense:', err);
      toast({
        title: 'Error',
        description: 'Failed to save expense. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete expense
  const deleteExpense = async (id: string) => {
    setDeletingId(id);
    try {
      await expenseService.delete(id);
      setExpenses((prev) => prev.filter((e) => e._id !== id));
      toast({
        title: 'Expense Deleted',
        description: 'The expense has been removed.',
      });
      setError(null);
    } catch (err) {
      console.error('Failed to delete expense:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete expense. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  // Set expense for editing
  const startEditing = (expense: Expense) => {
    setEditingExpense(expense);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingExpense(null);
  };

  // Calculate total
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return {
    expenses,
    editingExpense,
    isLoading,
    isSubmitting,
    deletingId,
    error,
    totalAmount,
    saveExpense,
    deleteExpense,
    startEditing,
    cancelEditing,
    refetch: fetchExpenses,
  };
};

export default useExpenses;
