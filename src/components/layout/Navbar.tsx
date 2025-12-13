import { Wallet } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="bg-card border-b border-border/50 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
            <Wallet className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Expense Tracker</h1>
            <p className="text-sm text-muted-foreground">Track and manage your spending</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
