import { useExpenses } from '@/hooks/useExpenses';
import Navbar from '@/components/layout/Navbar';
import Container from '@/components/layout/Container';
import ExpenseForm from '@/components/expense/ExpenseForm';
import ExpenseList from '@/components/expense/ExpenseList';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const {
    expenses,
    editingExpense,
    isLoading,
    isSubmitting,
    deletingId,
    error,
    saveExpense,
    deleteExpense,
    startEditing,
    cancelEditing,
  } = useExpenses();

  // Handle edit with scroll to form
  const handleEdit = (expense: typeof expenses[0]) => {
    startEditing(expense);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 py-8">
        <Container>
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
                  onSubmit={saveExpense}
                  editingExpense={editingExpense}
                  onCancelEdit={cancelEditing}
                  isSubmitting={isSubmitting}
                />
              </div>
            </div>

            {/* List Column */}
            <div className="lg:col-span-7">
              <ExpenseList
                expenses={expenses}
                onEdit={handleEdit}
                onDelete={deleteExpense}
                isLoading={isLoading}
                deletingId={deletingId}
              />
            </div>
          </div>
        </Container>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50">
        <Container className="py-6">
          <p className="text-center text-sm text-muted-foreground">
            Personal Expense Tracker &copy; {new Date().getFullYear()}
          </p>
        </Container>
      </footer>
    </div>
  );
};

export default Dashboard;
