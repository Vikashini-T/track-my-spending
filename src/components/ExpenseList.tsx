import { Expense } from '@/services/expenseService';
import ExpenseItem from '@/components/ExpenseItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CATEGORIES } from '@/components/ExpenseForm';
import { List, Filter, TrendingUp, Receipt } from 'lucide-react';
import { useMemo, useState } from 'react';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
  deletingId: string | null;
}

const ExpenseList = ({
  expenses,
  onEdit,
  onDelete,
  isLoading,
  deletingId,
}: ExpenseListProps) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date-desc');

  // Filter and sort expenses
  const filteredExpenses = useMemo(() => {
    let filtered = [...expenses];

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((e) => e.category === categoryFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [expenses, categoryFilter, sortBy]);

  // Calculate total for filtered expenses
  const totalAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [filteredExpenses]);

  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(totalAmount);

  // Loading skeleton
  if (isLoading) {
    return (
      <Card className="border-border/50 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <List className="h-5 w-5 text-accent" />
            Your Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 bg-muted animate-pulse rounded-lg"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 shadow-md">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <List className="h-5 w-5 text-accent" />
            Your Expenses
            <span className="text-sm font-normal text-muted-foreground">
              ({filteredExpenses.length})
            </span>
          </CardTitle>

          {/* Total Amount Display */}
          <div className="flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-lg">
            <TrendingUp className="h-4 w-4 text-accent" />
            <span className="text-sm text-muted-foreground">Total:</span>
            <span className="font-bold text-accent">{formattedTotal}</span>
          </div>
        </div>

        {/* Filter & Sort Controls */}
        {expenses.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <div className="flex items-center gap-2 flex-1">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="flex-1 sm:max-w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="sm:max-w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Newest First</SelectItem>
                <SelectItem value="date-asc">Oldest First</SelectItem>
                <SelectItem value="amount-desc">Highest Amount</SelectItem>
                <SelectItem value="amount-asc">Lowest Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {expenses.length === 0 ? (
          // Empty state
          <div className="text-center py-12">
            <Receipt className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No expenses yet
            </h3>
            <p className="text-muted-foreground">
              Start tracking your spending by adding your first expense!
            </p>
          </div>
        ) : filteredExpenses.length === 0 ? (
          // No results for filter
          <div className="text-center py-8">
            <Filter className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">
              No expenses found for this category.
            </p>
          </div>
        ) : (
          // Expense list
          <div className="space-y-3">
            {filteredExpenses.map((expense) => (
              <ExpenseItem
                key={expense._id}
                expense={expense}
                onEdit={onEdit}
                onDelete={onDelete}
                isDeleting={deletingId === expense._id}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpenseList;
