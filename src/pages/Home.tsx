import { useState, useEffect, useCallback } from 'react';
import expenseService, { Expense, ExpenseInput } from '@/services/expenseService';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import { useToast } from '@/hooks/use-toast';
import { Wallet, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Home = () => {
  // State management
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  // Fetch all expenses on component mount
  const fetchExpenses = useCallback(async () => {
    try {
      setError(null);
      const data = await expenseService.getAllExpenses();
      setExpenses(data);
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
      setError('Failed to load expenses. Please check if the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Handle form submission (create or update)
  const handleSubmit = async (expenseData: ExpenseInput) => {
    setIsSubmitting(true);
    try {
      if (editingExpense) {
        // Update existing expense
        const updated = await expenseService.updateExpense(
          editingExpense._id,
          expenseData
        );
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
        const created = await expenseService.createExpense(expenseData);
        setExpenses((prev) => [created, ...prev]);
        toast({
          title: 'Expense Added',
          description: 'Your expense has been successfully added.',
        });
      }
      setError(null);
    } catch (err) {
      console.error('Failed to save expense:', err);
      toast({
        title: 'Error',
        description: 'Failed to save expense. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete expense
  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await expenseService.deleteExpense(id);
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

  // Handle edit expense
  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    // Scroll to form on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border/50 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
              <Wallet className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Expense Tracker
              </h1>
              <p className="text-sm text-muted-foreground">
                Track and manage your spending
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6 animate-fade-in">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Column */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <ExpenseForm
                onSubmit={handleSubmit}
                editingExpense={editingExpense}
                onCancelEdit={handleCancelEdit}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>

          {/* List Column */}
          <div className="lg:col-span-7">
            <ExpenseList
              expenses={expenses}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isLoading={isLoading}
              deletingId={deletingId}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Personal Expense Tracker &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
