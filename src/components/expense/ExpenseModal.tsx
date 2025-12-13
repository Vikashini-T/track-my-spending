import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ExpenseForm from '@/components/expense/ExpenseForm';
import { Expense, ExpenseInput } from '@/services/expense.service';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (expense: ExpenseInput) => Promise<boolean>;
  editingExpense: Expense | null;
  isSubmitting: boolean;
}

const ExpenseModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingExpense,
  isSubmitting,
}: ExpenseModalProps) => {
  const handleSubmit = async (expense: ExpenseInput) => {
    const success = await onSubmit(expense);
    if (success) {
      onClose();
    }
    return success;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>
            {editingExpense ? 'Edit Expense' : 'Add New Expense'}
          </DialogTitle>
        </DialogHeader>
        <ExpenseForm
          onSubmit={handleSubmit}
          editingExpense={editingExpense}
          onCancelEdit={onClose}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseModal;
