import { Expense } from '@/services/expenseService';
import { Button } from '@/components/ui/button';
import { CATEGORIES } from '@/components/ExpenseForm';
import { Pencil, Trash2, Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface ExpenseItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

// Get category display info
const getCategoryInfo = (categoryValue: string) => {
  const category = CATEGORIES.find((c) => c.value === categoryValue);
  return category || { value: 'other', label: 'Other' };
};

// Category color mapping
const getCategoryStyles = (category: string): string => {
  const styles: Record<string, string> = {
    food: 'bg-category-food/10 text-category-food border-category-food/20',
    transport: 'bg-category-transport/10 text-category-transport border-category-transport/20',
    entertainment: 'bg-category-entertainment/10 text-category-entertainment border-category-entertainment/20',
    shopping: 'bg-category-shopping/10 text-category-shopping border-category-shopping/20',
    utilities: 'bg-category-utilities/10 text-category-utilities border-category-utilities/20',
    health: 'bg-category-health/10 text-category-health border-category-health/20',
    other: 'bg-category-other/10 text-category-other border-category-other/20',
  };
  return styles[category] || styles.other;
};

const ExpenseItem = ({ expense, onEdit, onDelete, isDeleting }: ExpenseItemProps) => {
  const categoryInfo = getCategoryInfo(expense.category);
  const formattedDate = format(new Date(expense.date), 'MMM dd, yyyy');
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(expense.amount);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${expense.title}"?`)) {
      onDelete(expense._id);
    }
  };

  return (
    <div className="group bg-card border border-border/50 rounded-lg p-4 expense-card-hover animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-foreground truncate">{expense.title}</h3>
            <span className="text-lg font-bold text-accent shrink-0">
              {formattedAmount}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            {/* Category Badge */}
            <span
              className={`category-badge border ${getCategoryStyles(expense.category)}`}
            >
              {categoryInfo.label}
            </span>

            {/* Date */}
            <span className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {formattedDate}
            </span>

            {/* Notes indicator */}
            {expense.notes && (
              <span className="flex items-center gap-1 text-muted-foreground" title={expense.notes}>
                <FileText className="h-3.5 w-3.5" />
                <span className="hidden sm:inline truncate max-w-[150px]">
                  {expense.notes}
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(expense)}
            className="text-primary hover:text-primary hover:bg-primary/5"
          >
            <Pencil className="h-4 w-4" />
            <span className="ml-1 sm:hidden">Edit</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-destructive hover:text-destructive hover:bg-destructive/5"
          >
            <Trash2 className="h-4 w-4" />
            <span className="ml-1 sm:hidden">Delete</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseItem;
