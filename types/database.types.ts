export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          balance: number
          color: string | null
          created_at: string
          id: string
          name: string
          type: string
          user_id: string
        }
        Insert: {
          balance?: number
          color?: string | null
          created_at?: string
          id?: string
          name: string
          type: string
          user_id: string
        }
        Update: {
          balance?: number
          color?: string | null
          created_at?: string
          id?: string
          name?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: string
          entity: string
          entity_id: string
          id: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details: string
          entity: string
          entity_id: string
          id?: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: string
          entity?: string
          entity_id?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      budgets: {
        Row: {
          amount: number
          category_id: string
          created_at: string
          id: string
          period: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          category_id: string
          created_at?: string
          id?: string
          period?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category_id?: string
          created_at?: string
          id?: string
          period?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "budgets_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string
          created_at: string
          icon: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          color: string
          created_at?: string
          icon: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          color?: string
          created_at?: string
          icon?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      debts: {
        Row: {
          category: string
          created_at: string
          id: string
          interest_rate: number
          name: string
          paid_amount: number
          status: Database["public"]["Enums"]["debt_status"]
          total_amount: number
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          interest_rate?: number
          name: string
          paid_amount?: number
          status?: Database["public"]["Enums"]["debt_status"]
          total_amount: number
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          interest_rate?: number
          name?: string
          paid_amount?: number
          status?: Database["public"]["Enums"]["debt_status"]
          total_amount?: number
          user_id?: string
        }
        Relationships: []
      }
      families: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      family_invites: {
        Row: {
          created_at: string
          created_by: string | null
          email: string
          expires_at: string
          family_id: string
          id: string
          status: string | null
          token: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          email: string
          expires_at?: string
          family_id: string
          id?: string
          status?: string | null
          token?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          email?: string
          expires_at?: string
          family_id?: string
          id?: string
          status?: string | null
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_invites_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          created_at: string
          current_amount: number
          deadline: string
          id: string
          name: string
          status: Database["public"]["Enums"]["goal_status"]
          target_amount: number
          user_id: string
        }
        Insert: {
          created_at?: string
          current_amount?: number
          deadline: string
          id?: string
          name: string
          status?: Database["public"]["Enums"]["goal_status"]
          target_amount: number
          user_id: string
        }
        Update: {
          created_at?: string
          current_amount?: number
          deadline?: string
          id?: string
          name?: string
          status?: Database["public"]["Enums"]["goal_status"]
          target_amount?: number
          user_id?: string
        }
        Relationships: []
      }
      investments: {
        Row: {
          amount: number
          color: string | null
          created_at: string
          current_price: number | null
          id: string
          logo_url: string | null
          name: string
          purchase_date: string
          quantity: number
          sector: string | null
          ticker: string | null
          type: Database["public"]["Enums"]["investment_type"]
          user_id: string
        }
        Insert: {
          amount: number
          color?: string | null
          created_at?: string
          current_price?: number | null
          id?: string
          logo_url?: string | null
          name: string
          purchase_date?: string
          quantity?: number
          sector?: string | null
          ticker?: string | null
          type: Database["public"]["Enums"]["investment_type"]
          user_id: string
        }
        Update: {
          amount?: number
          color?: string | null
          created_at?: string
          current_price?: number | null
          id?: string
          logo_url?: string | null
          name?: string
          purchase_date?: string
          quantity?: number
          sector?: string | null
          ticker?: string | null
          type?: Database["public"]["Enums"]["investment_type"]
          user_id?: string
        }
        Relationships: []
      }
      scheduled_transactions: {
        Row: {
          account_id: string | null
          amount: number
          category_id: string
          created_at: string
          description: string
          frequency: Database["public"]["Enums"]["scheduled_transaction_frequency"]
          id: string
          next_due_date: string
          start_date: string
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Insert: {
          account_id?: string | null
          amount: number
          category_id: string
          created_at?: string
          description: string
          frequency: Database["public"]["Enums"]["scheduled_transaction_frequency"]
          id?: string
          next_due_date: string
          start_date: string
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Update: {
          account_id?: string | null
          amount?: number
          category_id?: string
          created_at?: string
          description?: string
          frequency?: Database["public"]["Enums"]["scheduled_transaction_frequency"]
          id?: string
          next_due_date?: string
          start_date?: string
          type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      transaction_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          transaction_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          transaction_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          transaction_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transaction_comments_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          account_id: string | null
          amount: number
          category_id: string
          created_at: string
          date: string
          debt_payment_id: string | null
          description: string
          exclude_from_reports: boolean | null
          from_account_id: string | null
          goal_contribution_id: string | null
          id: string
          investment_id: string | null
          location: Json | null
          notes: string | null
          reconciled: boolean | null
          starred: boolean | null
          status: Database["public"]["Enums"]["transaction_status"]
          to_account_id: string | null
          transfer_id: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Insert: {
          account_id?: string | null
          amount: number
          category_id: string
          created_at?: string
          date: string
          debt_payment_id?: string | null
          description: string
          exclude_from_reports?: boolean | null
          from_account_id?: string | null
          goal_contribution_id?: string | null
          id?: string
          investment_id?: string | null
          location?: Json | null
          notes?: string | null
          reconciled?: boolean | null
          starred?: boolean | null
          status?: Database["public"]["Enums"]["transaction_status"]
          to_account_id?: string | null
          transfer_id?: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Update: {
          account_id?: string | null
          amount?: number
          category_id?: string
          created_at?: string
          date?: string
          debt_payment_id?: string | null
          description?: string
          exclude_from_reports?: boolean | null
          from_account_id?: string | null
          goal_contribution_id?: string | null
          id?: string
          investment_id?: string | null
          location?: Json | null
          notes?: string | null
          reconciled?: boolean | null
          starred?: boolean | null
          status?: Database["public"]["Enums"]["transaction_status"]
          to_account_id?: string | null
          transfer_id?: string | null
          type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_debt_payment_id_fkey"
            columns: ["debt_payment_id"]
            isOneToOne: false
            referencedRelation: "debts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_from_account_id_fkey"
            columns: ["from_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_goal_contribution_id_fkey"
            columns: ["goal_contribution_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_investment_id_fkey"
            columns: ["investment_id"]
            isOneToOne: false
            referencedRelation: "investments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_to_account_id_fkey"
            columns: ["to_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_families: {
        Row: {
          family_id: string | null
          joined_at: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          family_id?: string | null
          joined_at?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          family_id?: string | null
          joined_at?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_families_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          level: number
          updated_at: string | null
          xp: number
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          level?: number
          updated_at?: string | null
          xp?: number
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          level?: number
          updated_at?: string | null
          xp?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_family_id: { Args: never; Returns: string }
    }
    Enums: {
      debt_status: "ATIVA" | "PAGA"
      goal_status: "EM_ANDAMENTO" | "CONCLUIDO"
      investment_type:
      | "renda_fixa"
      | "acoes"
      | "fiis"
      | "cripto"
      | "exterior"
      | "outros"
      scheduled_transaction_frequency:
      | "Diario"
      | "Semanal"
      | "Quinzenal"
      | "Mensal"
      | "Anual"
      transaction_status: "pending" | "completed" | "scheduled" | "cancelled"
      transaction_type: "receita" | "despesa"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
    DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
    DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof DefaultSchema["Enums"]
  | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema["CompositeTypes"]
  | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  public: {
    Enums: {
      debt_status: ["ATIVA", "PAGA"],
      goal_status: ["EM_ANDAMENTO", "CONCLUIDO"],
      investment_type: [
        "renda_fixa",
        "acoes",
        "fiis",
        "cripto",
        "exterior",
        "outros",
      ],
      scheduled_transaction_frequency: [
        "Diario",
        "Semanal",
        "Quinzenal",
        "Mensal",
        "Anual",
      ],
      transaction_status: ["pending", "completed", "scheduled", "cancelled"],
      transaction_type: ["receita", "despesa"],
    },
  },
} as const

