import React, {
  createContext,
  useReducer,
  useEffect,
  useContext,
  ReactNode,
  useCallback,
} from 'react';
import {
  Transaction,
  Summary,
  Goal,
  Debt,
  ScheduledTransaction,
  UserLevel,
  Achievement,
  Category,
  TransactionType,
  GoalStatus,
  DebtStatus,
  Account,
  CreditCard,
} from '../types';
import { supabase } from '../services/supabaseClient';
import {
  Utensils,
  ShoppingCart,
  Car,
  Shirt,
  Heart,
  BookOpen,
  Gift,
  Plane,
  Dumbbell,
  Gamepad,
  ArrowUpRight,
  Wallet,
  HomeIcon,
  Lightbulb,
  Trophy,
} from '../components/Icons';

// --- Static Data ---
const CATEGORIES: Record<string, Category> = {
    'cat1': { id: 'cat1', name: 'Alimentação', icon: Utensils, color: '#f59e0b' },
    'cat2': { id: 'cat2', name: 'Compras', icon: ShoppingCart, color: '#8b5cf6' },
    'cat3': { id: 'cat3', name: 'Transporte', icon: Car, color: '#ef4444' },
    'cat4': { id: 'cat4', name: 'Vestuário', icon: Shirt, color: '#3b82f6' },
    'cat5': { id: 'cat5', name: 'Moradia', icon: HomeIcon, color: '#10b981' },
    'cat6': { id: 'cat6', name: 'Saúde', icon: Heart, color: '#ec4899' },
    'cat7': { id: 'cat7', name: 'Educação', icon: BookOpen, color: '#6366f1' },
    'cat8': { id: 'cat8', name: 'Presentes', icon: Gift, color: '#d946ef' },
    'cat9': { id: 'cat9', name: 'Viagens', icon: Plane, color: '#0ea5e9' },
    'cat10': { id: 'cat10', name: 'Lazer', icon: Gamepad, color: '#f43f5e' },
    'cat11': { id: 'cat11', name: 'Academia', icon: Dumbbell, color: '#14b8a6' },
    'cat12': { id: 'cat12', name: 'Outros', icon: Lightbulb, color: '#a8a29e' },
    'cat13': { id: 'cat13', name: 'Salário', icon: Wallet, color: '#22c55e' },
    'cat14': { id: 'cat14', name: 'Renda Extra', icon: ArrowUpRight, color: '#16a34a' },
};

const ACHIEVEMENT_ICONS: Record<string, React.ElementType> = {
    default: Trophy,
};

// --- Helper Functions ---
const calculateSummary = (allTransactions: Transaction[]): Summary => {
    const totalBalance = allTransactions.reduce((acc, t) => {
        return t.type === TransactionType.RECEITA ? acc + t.amount : acc - Math.abs(t.amount);
    }, 0);

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthlyIncome = allTransactions
        .filter(t => t.type === TransactionType.RECEITA && new Date(t.date) >= firstDayOfMonth)
        .reduce((acc, t) => acc + t.amount, 0);

    const monthlyExpenses = allTransactions
        .filter(t => t.type === TransactionType.DESPESA && new Date(t.date) >= firstDayOfMonth)
        .reduce((acc, t) => acc + Math.abs(t.amount), 0);

    return { totalBalance, monthlyIncome, monthlyExpenses: -monthlyExpenses };
};

// --- State & Reducer ---
interface State {
  transactions: Transaction[];
  summary: Summary;
  goals: Goal[];
  debts: Debt[];
  scheduledTransactions: ScheduledTransaction[];
  userLevel: UserLevel | null;
  achievements: Achievement[];
  categories: Record<string, Category>;
  accounts: Account[];
  creditCards: CreditCard[];
  loading: boolean;
  error: string | null;
}

type Action =
  | { type: 'SET_LOADING' }
  | { type: 'FETCH_SUCCESS'; payload: Omit<State, 'loading' | 'error' | 'summary' | 'categories'> }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'ADD_TRANSACTION_SUCCESS'; payload: Transaction }
  | { type: 'ADD_GOAL_SUCCESS'; payload: Goal }
  | { type: 'ADD_DEBT_SUCCESS'; payload: Debt }
  | { type: 'CLEAR_ERROR' };

const initialState: State = {
  transactions: [],
  summary: { totalBalance: 0, monthlyIncome: 0, monthlyExpenses: 0 },
  goals: [],
  debts: [],
  scheduledTransactions: [],
  userLevel: null,
  achievements: [],
  categories: CATEGORIES,
  accounts: [],
  creditCards: [],
  loading: true,
  error: null,
};

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            const newSummary = calculateSummary(action.payload.transactions);
            return { ...state, ...action.payload, summary: newSummary, loading: false, error: null };
        case 'FETCH_ERROR':
            return { ...state, loading: false, error: action.payload };
        case 'ADD_TRANSACTION_SUCCESS': {
            const newTransactions = [action.payload, ...state.transactions];
            return {
                ...state,
                transactions: newTransactions,
                summary: calculateSummary(newTransactions),
            };
        }
        case 'ADD_GOAL_SUCCESS':
            return { ...state, goals: [action.payload, ...state.goals] };
        case 'ADD_DEBT_SUCCESS':
            return { ...state, debts: [action.payload, ...state.debts] };
        case 'CLEAR_ERROR':
            return { ...state, error: null };
        default:
            return state;
    }
};

// --- Context Definition ---
interface DashboardDataContextType extends State {
  addTransaction: (transaction: Omit<Transaction, 'id' | 'category'>) => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id' | 'currentAmount' | 'status'>) => Promise<void>;
  addDebt: (debt: Omit<Debt, 'id' | 'paidAmount' | 'status'>) => Promise<void>;
  clearError: () => void;
}

const DashboardDataContext = createContext<DashboardDataContextType | undefined>(undefined);

// --- Provider Component ---
export const DashboardDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const fetchData = useCallback(async () => {
        dispatch({ type: 'SET_LOADING' });
        try {
            // Fetch all data from Supabase
            const transactionsPromise = supabase.from('transactions').select('*').order('date', { ascending: false });
            const goalsPromise = supabase.from('goals').select('*');
            const debtsPromise = supabase.from('debts').select('*');
            const scheduledTransactionsPromise = supabase.from('scheduled_transactions').select('*');
            const userProfilePromise = supabase.from('user_profile').select('*').single(); // Assuming one profile
            const achievementsPromise = supabase.from('achievements').select('*');
            const accountsPromise = supabase.from('accounts').select('*');
            const creditCardsPromise = supabase.from('credit_cards').select('*');
            
            const [
                { data: transactionsData, error: transactionsError },
                { data: goalsData, error: goalsError },
                { data: debtsData, error: debtsError },
                { data: scheduledTransactionsData, error: scheduledTransactionsError },
                { data: userProfileData, error: userProfileError },
                { data: achievementsData, error: achievementsError },
                { data: accountsData, error: accountsError },
                { data: creditCardsData, error: creditCardsError },
            ] = await Promise.all([
                transactionsPromise,
                goalsPromise,
                debtsPromise,
                scheduledTransactionsPromise,
                userProfilePromise,
                achievementsPromise,
                accountsPromise,
                creditCardsPromise,
            ]);

            // Check for errors in parallel fetches
            if (transactionsError) throw transactionsError;
            if (goalsError) throw goalsError;
            if (debtsError) throw debtsError;
            if (scheduledTransactionsError) throw scheduledTransactionsError;
            if (userProfileError && userProfileError.code !== 'PGRST116') throw userProfileError; // Ignore 'exact one row' error if profile is empty
            if (achievementsError) throw achievementsError;
            if (accountsError) throw accountsError;
            if (creditCardsError) throw creditCardsError;
            
            // Enrich data with frontend-specific properties (icons, categories)
            const enrichedTransactions: Transaction[] = (transactionsData || []).map((t: any) => ({ ...t, category: CATEGORIES[t.category_id] || CATEGORIES['cat12'] }));
            const enrichedScheduledTransactions: ScheduledTransaction[] = (scheduledTransactionsData || []).map((t: any) => ({ ...t, category: CATEGORIES[t.category_id] || CATEGORIES['cat12'] }));
            const enrichedAchievements: Achievement[] = (achievementsData || []).map((a: any) => ({ ...a, icon: ACHIEVEMENT_ICONS.default }));

            const renamedUserProfile: UserLevel | null = userProfileData ? {
                level: userProfileData.level,
                xp: userProfileData.xp,
                xpToNextLevel: userProfileData.xp_to_next_level,
                rank: userProfileData.rank,
            } : null;

            dispatch({
                type: 'FETCH_SUCCESS',
                payload: {
                    transactions: enrichedTransactions,
                    goals: goalsData || [],
                    debts: debtsData || [],
                    scheduledTransactions: enrichedScheduledTransactions,
                    userLevel: renamedUserProfile,
                    achievements: enrichedAchievements,
                    accounts: accountsData || [],
                    creditCards: creditCardsData || [],
                }
            });

        } catch (err: any) {
            console.error("Error fetching data:", err);
            // O dispatch de erro foi removido conforme a solicitação para o Go-Live.
            // Em caso de falha, a aplicação exibirá o estado de carregamento indefinidamente.
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const addTransaction = useCallback(async (txData: Omit<Transaction, 'id' | 'category'>) => {
        try {
            const { data, error } = await supabase.from('transactions').insert([txData]).select();
            if (error) throw error;
            if (data) {
                const newTx = data[0];
                const enrichedTx: Transaction = { ...newTx, category: CATEGORIES[newTx.category_id] || CATEGORIES['cat12'] };
                dispatch({ type: 'ADD_TRANSACTION_SUCCESS', payload: enrichedTx });
            }
        } catch (err: any) {
            console.error("Error adding transaction:", err);
            dispatch({ type: 'FETCH_ERROR', payload: err.message });
        }
    }, []);

    const addGoal = useCallback(async (goalData: Omit<Goal, 'id' | 'currentAmount' | 'status'>) => {
        try {
            const newGoal = { ...goalData, currentAmount: 0, status: GoalStatus.EM_ANDAMENTO };
            const { data, error } = await supabase.from('goals').insert([newGoal]).select();
            if (error) throw error;
            if (data) {
                dispatch({ type: 'ADD_GOAL_SUCCESS', payload: data[0] as Goal });
            }
        } catch(err: any) {
            console.error("Error adding goal:", err);
            dispatch({ type: 'FETCH_ERROR', payload: err.message });
        }
    }, []);

    const addDebt = useCallback(async (debtData: Omit<Debt, 'id' | 'paidAmount' | 'status'>) => {
        try {
            const newDebt = { ...debtData, paidAmount: 0, status: DebtStatus.ATIVA };
            const { data, error } = await supabase.from('debts').insert([newDebt]).select();
            if (error) throw error;
            if(data) {
                dispatch({ type: 'ADD_DEBT_SUCCESS', payload: data[0] as Debt });
            }
        } catch(err: any) {
            console.error("Error adding debt:", err);
            dispatch({ type: 'FETCH_ERROR', payload: err.message });
        }
    }, []);

    const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

    const value = { ...state, addTransaction, addGoal, addDebt, clearError };

    return React.createElement(DashboardDataContext.Provider, { value }, children);
};

// --- Hook ---
export const useDashboardData = () => {
    const context = useContext(DashboardDataContext);
    if (context === undefined) {
        throw new Error('useDashboardData must be used within a DashboardDataProvider');
    }
    return context;
};