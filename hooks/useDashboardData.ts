import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import {
  Account,
  Achievement,
  Category,
  Debt,
  Goal,
  ScheduledTransaction,
  Summary,
  Transaction,
  UserLevel,
  GoalStatus,
  DebtStatus,
  TransactionType,
} from '../types';
import { supabase } from '../services/supabaseClient';
import {
  Car,
  Shirt,
  Heart,
  BookOpen,
  Gift,
  Plane,
  Dumbbell,
  Gamepad,
  Film,
  Utensils,
  ShoppingCart,
  PiggyBank,
  Wallet,
  ArrowUpRight as ArrowUpRightIcon,
  Tool,
  Trophy,
} from '../components/Icons';
import { useAuth } from './useAuth';

// --- MOCK ICONS ---
// This maps category IDs from the DB to React components
const iconMap: { [key: string]: React.ElementType } = {
  'cat1': Utensils,
  'cat2': ShoppingCart,
  'cat3': Car,
  'cat4': Shirt,
  'cat5': Heart,
  'cat6': BookOpen,
  'cat7': Gift,
  'cat8': Plane,
  'cat9': Dumbbell,
  'cat10': Gamepad,
  'cat11': Film,
  'cat12': Tool, // Outros
  'cat13': ArrowUpRightIcon, // Salário
  'cat14': PiggyBank, // Investimentos/Rendimentos
  'default': Wallet,
};

const defaultCategory: Category = {
    id: 'default',
    name: 'Desconhecida',
    icon: Wallet,
    color: '#94a3b8', // slate-400
};

interface DashboardDataContextType {
  summary: Summary;
  transactions: Transaction[];
  goals: Goal[];
  debts: Debt[];
  accounts: Account[];
  categories: Record<string, Category>;
  scheduledTransactions: ScheduledTransaction[];
  userLevel: UserLevel | null;
  achievements: Achievement[];
  loading: boolean;
  error: string | null;
  clearError: () => void;
  addTransaction: (transactionData: Omit<Transaction, 'id' | 'category' | 'user_id'>) => Promise<void>;
  addGoal: (goalData: Omit<Goal, 'id' | 'currentAmount' | 'status' | 'user_id'>) => Promise<void>;
  addDebt: (debtData: Omit<Debt, 'id' | 'paidAmount' | 'status' | 'user_id'>) => Promise<void>;
}

const DashboardDataContext = createContext<DashboardDataContextType | undefined>(
  undefined
);

export const DashboardDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [summary, setSummary] = useState<Summary>({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Record<string, Category>>({});
  const [scheduledTransactions, setScheduledTransactions] = useState<ScheduledTransaction[]>([]);
  const [userLevel, setUserLevel] = useState<UserLevel | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all data in parallel
      const [
        accountsRes,
        categoriesRes,
        transactionsRes,
        goalsRes,
        debtsRes,
        scheduledTransactionsRes,
        userLevelRes,
        achievementsRes,
      ] = await Promise.all([
        supabase.from('accounts').select('*'),
        supabase.from('categories').select('*'),
        supabase.from('transactions').select('*, categories(*)').order('date', { ascending: false }),
        supabase.from('goals').select('*').order('deadline', { ascending: true }),
        supabase.from('debts').select('*'),
        supabase.from('scheduled_transactions').select('*, categories(*)').order('next_due_date', { ascending: true }),
        supabase.from('user_level').select('*').single(),
        supabase.from('achievements').select('*'),
      ]);

      // Check for errors in responses
      const responses = [accountsRes, categoriesRes, transactionsRes, goalsRes, debtsRes, scheduledTransactionsRes, userLevelRes, achievementsRes];
      for (const res of responses) {
        if (res.error) throw res.error;
      }

      // Process Categories into a map for easy lookup
      const fetchedCategories = categoriesRes.data?.reduce((acc, cat) => {
        acc[cat.id] = { ...cat, icon: iconMap[cat.id] || iconMap['default'] };
        return acc;
      }, {} as Record<string, Category>) || {};
      setCategories(fetchedCategories);

      // Process Transactions, using joined category data first
      const fetchedTransactions = transactionsRes.data?.map((tx: any) => {
        let category: Category;
        // Prioritize using the joined category data from `select('*, categories(*)')`
        if (tx.categories && typeof tx.categories === 'object' && tx.categories.id) {
            category = {
                ...tx.categories,
                icon: iconMap[tx.categories.id] || iconMap['default'],
            };
        } else {
            // Fallback to manual lookup for robustness
            category = fetchedCategories[tx.category_id] || defaultCategory;
        }
        return {
          ...tx,
          category: category,
        };
      }) as Transaction[] || [];
      setTransactions(fetchedTransactions);

      // Process Scheduled Transactions, using joined data
       const fetchedScheduledTransactions = scheduledTransactionsRes.data?.map((stx: any) => {
          let category: Category;
          if (stx.categories && typeof stx.categories === 'object' && stx.categories.id) {
              category = {
                  ...stx.categories,
                  icon: iconMap[stx.categories.id] || iconMap['default'],
              };
          } else {
              category = fetchedCategories[stx.category_id] || defaultCategory;
          }
          return {
            ...stx,
            nextDueDate: stx.next_due_date,
            startDate: stx.start_date,
            frequency: stx.frequency,
            category: category
          };
        }) as ScheduledTransaction[] || [];
      setScheduledTransactions(fetchedScheduledTransactions);
      
      // Set other states
      setAccounts(accountsRes.data || []);
      setGoals(goalsRes.data?.map((g: any) => ({
        ...g,
        targetAmount: g.target_amount,
        currentAmount: g.current_amount,
      })) as Goal[] || []);
      setDebts(debtsRes.data?.map((d: any) => ({
        ...d,
        totalAmount: d.total_amount,
        paidAmount: d.paid_amount,
        interestRate: d.interest_rate,
      })) as Debt[] || []);
      setUserLevel(userLevelRes.data ? {
        ...userLevelRes.data,
        xpToNextLevel: userLevelRes.data.xp_to_next_level,
      } as UserLevel : null);
      setAchievements(achievementsRes.data?.map((a: any) => ({
        ...a,
        icon: Trophy, // All achievements use Trophy icon for simplicity now
        dateUnlocked: a.date_unlocked,
      })) as Achievement[] || []);

    } catch (err: unknown) {
      console.error("Error fetching data:", err);
      let errorMessage = "Ocorreu um erro desconhecido ao buscar os dados.";

      if (err instanceof Error) {
          // Standard JavaScript error (e.g., network error)
          errorMessage = err.message;
      } else if (err && typeof err === 'object' && 'message' in err) {
          // Duck-typed error object (like from Supabase)
          errorMessage = String((err as { message: unknown }).message);
      } else if (typeof err === 'string') {
          // Just a string was thrown
          errorMessage = err;
      } else {
          // Something else, try to serialize it safely
          try {
              errorMessage = `Ocorreu um erro inesperado: ${JSON.stringify(err, null, 2)}`;
          } catch {
              errorMessage = "Ocorreu um erro não serializável ao buscar os dados.";
          }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      // Se o usuário deslogar, limpa os dados
      setLoading(false);
      setTransactions([]);
      setAccounts([]);
      setGoals([]);
      setDebts([]);
      setCategories({});
      setScheduledTransactions([]);
      setUserLevel(null);
      setAchievements([]);
      setSummary({ totalBalance: 0, monthlyIncome: 0, monthlyExpenses: 0 });
    }
  }, [fetchData, user]);

  // Calculate summary whenever accounts or transactions change
  useEffect(() => {
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthlyIncome = transactions
      .filter(t => t.type === TransactionType.RECEITA && new Date(t.date) >= startOfMonth)
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = transactions
      .filter(t => t.type === TransactionType.DESPESA && new Date(t.date) >= startOfMonth)
      .reduce((sum, t) => sum + t.amount, 0);
      
    setSummary({ totalBalance, monthlyIncome, monthlyExpenses });
  }, [accounts, transactions]);

  const clearError = () => {
    setError(null);
  };
  
  const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'category' | 'user_id'>) => {
    if (!user) {
        setError("Usuário não autenticado.");
        throw new Error("Usuário não autenticado.");
    }
    try {
        const newTx = { ...transactionData, user_id: user.id };
        const { data, error } = await supabase.from('transactions').insert([newTx]).select('*, categories(*)').single();
        if (error) throw error;
        
        // Update state optimistically
        const newTransaction = {
          ...data,
          category: categories[data.category_id],
        } as Transaction;

        setTransactions(prev => [newTransaction, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

        // Also update account balance
        const accountToUpdate = accounts.find(acc => acc.id === transactionData.account_id);
        if (accountToUpdate) {
            const newBalance = accountToUpdate.balance + transactionData.amount;
            const { error: accountError } = await supabase.from('accounts').update({ balance: newBalance }).eq('id', transactionData.account_id);
            if (accountError) throw accountError;
            // Update local account state to reflect change immediately
            setAccounts(prev => prev.map(acc => acc.id === transactionData.account_id ? {...acc, balance: newBalance} : acc));
        }

    } catch (err: any) {
        console.error("Error adding transaction:", err);
        setError(err.message || 'Failed to add transaction.');
        throw err; // Re-throw to be caught in the form if needed
    }
  };

  const addGoal = async (goalData: Omit<Goal, 'id' | 'currentAmount' | 'status' | 'user_id'>) => {
    if (!user) {
      setError("Usuário não autenticado.");
      throw new Error("Usuário não autenticado.");
    }
      const newGoal = {
        user_id: user.id,
        name: goalData.name,
        target_amount: goalData.targetAmount,
        deadline: goalData.deadline,
        current_amount: 0,
        status: GoalStatus.EM_ANDAMENTO,
      };

      try {
        const { data, error } = await supabase.from('goals').insert([newGoal]).select().single();
        if (error) throw error;
        
        setGoals(prev => [...prev, {
            ...data,
            targetAmount: data.target_amount,
            currentAmount: data.current_amount,
        }]);
      } catch (err: any) {
        console.error("Error adding goal:", err);
        setError(err.message || 'Failed to add goal.');
        throw err;
      }
  };

  const addDebt = async (debtData: Omit<Debt, 'id' | 'paidAmount' | 'status' | 'user_id'>) => {
    if (!user) {
      setError("Usuário não autenticado.");
      throw new Error("Usuário não autenticado.");
    }
    const newDebt = {
        user_id: user.id,
        name: debtData.name,
        total_amount: debtData.totalAmount,
        interest_rate: debtData.interestRate,
        category: debtData.category,
        paid_amount: 0,
        status: DebtStatus.ATIVA,
    };

    try {
        const { data, error } = await supabase.from('debts').insert([newDebt]).select().single();
        if (error) throw error;
        
        setDebts(prev => [...prev, {
            ...data,
            totalAmount: data.total_amount,
            paidAmount: data.paid_amount,
            interestRate: data.interest_rate,
        }]);
    } catch(err: any) {
        console.error("Error adding debt:", err);
        setError(err.message || 'Failed to add debt.');
        throw err;
    }
  };

  const value = useMemo(() => ({
    summary,
    transactions,
    goals,
    debts,
    accounts,
    categories,
    scheduledTransactions,
    userLevel,
    achievements,
    loading,
    error,
    clearError,
    addTransaction,
    addGoal,
    addDebt,
    // Note: useCallback is not used for add functions here for simplicity. 
    // In a larger app, they should be wrapped in useCallback.
  }), [
    summary,
    transactions,
    goals,
    debts,
    accounts,
    categories,
    scheduledTransactions,
    userLevel,
    achievements,
    loading,
    error,
  ]);

  // FIX: Replaced JSX with React.createElement to resolve parsing errors in a .ts file.
  // Using JSX syntax requires a .tsx file extension. Without it, the TypeScript parser
  // misinterprets JSX tags as language operators, causing the reported errors.
  // This is the equivalent function call that JSX compiles to, and it works in a .ts file.
  return React.createElement(
    DashboardDataContext.Provider,
    { value: value },
    children
  );
};

export const useDashboardData = () => {
  const context = useContext(DashboardDataContext);
  if (context === undefined) {
    throw new Error('useDashboardData must be used within a DashboardDataProvider');
  }
  return context;
};