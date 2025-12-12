export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      achievements: {
        Row: {
          id: string
          name: string
          description: string
          unlocked: boolean
          dateUnlocked: string | null
        }
        Insert: {
          id?: string
          name: string
          description: string
          unlocked?: boolean
          dateUnlocked?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string
          unlocked?: boolean
          dateUnlocked?: string | null
        }
      }
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          icon: string
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          icon: string
          color: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          icon?: string
          color?: string
          created_at?: string
        }
      }
      debts: {
        Row: {
          id: string
          user_id: string
          name: string
          total_amount: number
          paid_amount: number
          interest_rate: number
          category: string
          status: 'ATIVA' | 'PAGA'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          total_amount: number
          paid_amount?: number
          interest_rate?: number
          category: string
          status?: 'ATIVA' | 'PAGA'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          total_amount?: number
          paid_amount?: number
          interest_rate?: number
          category?: string
          status?: 'ATIVA' | 'PAGA'
          created_at?: string
        }
      }
      families: {
        Row: {
          id: string
          name: string
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          created_by: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          created_by?: string
        }
      }
      family_invites: {
        Row: {
          id: string
          family_id: string
          email: string
          token: string
          status: string | null
          created_at: string
          expires_at: string
          created_by: string
        }
        Insert: {
          id?: string
          family_id: string
          email: string
          token?: string
          status?: string | null
          created_at?: string
          expires_at?: string
          created_by: string
        }
        Update: {
          id?: string
          family_id?: string
          email?: string
          token?: string
          status?: string | null
          created_at?: string
          expires_at?: string
          created_by?: string
        }
      }
      goals: {
        Row: {
          id: string
          user_id: string
          name: string
          target_amount: number
          current_amount: number
          deadline: string
          status: 'EM_ANDAMENTO' | 'CONCLUIDO'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          target_amount: number
          current_amount?: number
          deadline: string
          status?: 'EM_ANDAMENTO' | 'CONCLUIDO'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          target_amount?: number
          current_amount?: number
          deadline?: string
          status?: 'EM_ANDAMENTO' | 'CONCLUIDO'
          created_at?: string
        }
      }
      investments: {
        Row: {
          id: string
          user_id: string
          name: string
          ticker: string | null
          type: 'renda_fixa' | 'acoes' | 'fiis' | 'cripto' | 'exterior' | 'outros'
          amount: number
          quantity: number
          current_price: number | null
          purchase_date: string
          color: string | null
          logo_url: string | null
          sector: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          ticker?: string | null
          type: 'renda_fixa' | 'acoes' | 'fiis' | 'cripto' | 'exterior' | 'outros'
          amount: number
          quantity?: number
          current_price?: number | null
          purchase_date?: string
          color?: string | null
          logo_url?: string | null
          sector?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          ticker?: string | null
          type?: 'renda_fixa' | 'acoes' | 'fiis' | 'cripto' | 'exterior' | 'outros'
          amount?: number
          quantity?: number
          current_price?: number | null
          purchase_date?: string
          color?: string | null
          logo_url?: string | null
          sector?: string | null
          created_at?: string
        }
      }
      scheduled_transactions: {
        Row: {
          id: string
          user_id: string
          description: string
          amount: number
          type: 'receita' | 'despesa'
          category_id: string
          start_date: string
          next_due_date: string
          frequency: 'Diário' | 'Semanal' | 'Quinzenal' | 'Mensal' | 'Anual'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          description: string
          amount: number
          type: 'receita' | 'despesa'
          category_id: string
          start_date: string
          next_due_date: string
          frequency: 'Diário' | 'Semanal' | 'Quinzenal' | 'Mensal' | 'Anual'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          description?: string
          amount?: number
          type?: 'receita' | 'despesa'
          category_id?: string
          start_date?: string
          next_due_date?: string
          frequency?: 'Diário' | 'Semanal' | 'Quinzenal' | 'Mensal' | 'Anual'
          created_at?: string
        }
      }
      transaction_comments: {
        Row: {
          id: string
          transaction_id: string
          user_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          transaction_id: string
          user_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          transaction_id?: string
          user_id?: string
          content?: string
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          description: string
          amount: number
          type: 'receita' | 'despesa'
          date: string
          category_id: string
          goal_contribution_id: string | null
          debt_payment_id: string | null
          investment_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          description: string
          amount: number
          type: 'receita' | 'despesa'
          date: string
          category_id: string
          goal_contribution_id?: string | null
          debt_payment_id?: string | null
          investment_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          description?: string
          amount?: number
          type?: 'receita' | 'despesa'
          date?: string
          category_id?: string
          goal_contribution_id?: string | null
          debt_payment_id?: string | null
          investment_id?: string | null
          created_at?: string
        }
      }
      user_families: {
        Row: {
          user_id: string
          family_id: string
          role: string | null
          joined_at: string | null
        }
        Insert: {
          user_id: string
          family_id: string
          role?: string | null
          joined_at?: string | null
        }
        Update: {
          user_id?: string
          family_id?: string
          role?: string | null
          joined_at?: string | null
        }
      }
      user_profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          xp: number
          level: number
          updated_at: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          xp?: number
          level?: number
          updated_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          xp?: number
          level?: number
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_family_id: {
        Args: Record<string, never>
        Returns: string
      }
      update_goal_current_amount: {
        Args: Record<string, never>
        Returns: unknown
      }
      update_debt_paid_amount: {
        Args: Record<string, never>
        Returns: unknown
      }
    }
    Enums: {
      debt_status: 'ATIVA' | 'PAGA'
      goal_status: 'EM_ANDAMENTO' | 'CONCLUIDO'
      investment_type: 'renda_fixa' | 'acoes' | 'fiis' | 'cripto' | 'exterior' | 'outros'
      scheduled_transaction_frequency: 'Diário' | 'Semanal' | 'Quinzenal' | 'Mensal' | 'Anual'
      transaction_type: 'receita' | 'despesa'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
