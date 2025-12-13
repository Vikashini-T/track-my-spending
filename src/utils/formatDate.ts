import { format, parseISO } from 'date-fns';

// Format date for display
export const formatDate = (dateString: string, formatStr: string = 'MMM dd, yyyy'): string => {
  try {
    const date = parseISO(dateString);
    return format(date, formatStr);
  } catch {
    return dateString;
  }
};

// Format date for input field (YYYY-MM-DD)
export const formatDateForInput = (dateString: string): string => {
  return dateString.split('T')[0];
};

// Get today's date formatted for input
export const getTodayForInput = (): string => {
  return new Date().toISOString().split('T')[0];
};

// Format currency
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};
