-- =============================================================================
-- FINANCEHUB - SCRIPT DE BANCO DE DADOS v3.1 (FULL SCHEMA + SOCIAL + INVESTMENTS)
--
-- COMBINAÇÃO: Schema v3.0 + Investments Module
--
-- AVISO: ESTE SCRIPT É DESTRUTIVO E IRÁ APAGAR TODOS OS DADOS EXISTENTES.
-- =============================================================================
BEGIN;
-- 0. TEARDOWN (apaga a estrutura antiga se ela existir)
DROP TABLE IF EXISTS public.transaction_comments CASCADE;
DROP TABLE IF EXISTS public.family_invites CASCADE;
-- Added missing drop
DROP TABLE IF EXISTS public.user_families CASCADE;
DROP TABLE IF EXISTS public.families CASCADE;
DROP TABLE IF EXISTS public.scheduled_transactions CASCADE;
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.debts CASCADE;
DROP TABLE IF EXISTS public.goals CASCADE;
DROP TABLE IF EXISTS public.investments CASCADE;
-- NEW
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;
DROP TABLE IF EXISTS public.accounts CASCADE;
DROP TABLE IF EXISTS public.user_level CASCADE;
DROP TABLE IF EXISTS public.achievements CASCADE;
DROP TYPE IF EXISTS public.transaction_type CASCADE;
DROP TYPE IF EXISTS public.goal_status CASCADE;
DROP TYPE IF EXISTS public.debt_status CASCADE;
DROP TYPE IF EXISTS public.scheduled_transaction_frequency CASCADE;
DROP TYPE IF EXISTS public.investment_type CASCADE;
-- NEW
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_goal_current_amount() CASCADE;
DROP FUNCTION IF EXISTS public.update_debt_paid_amount() CASCADE;
DROP FUNCTION IF EXISTS public.get_my_family_id() CASCADE;
-- 1. TIPOS ENUM
CREATE TYPE public.transaction_type AS ENUM ('receita', 'despesa');
CREATE TYPE public.goal_status AS ENUM ('EM_ANDAMENTO', 'CONCLUIDO');
CREATE TYPE public.debt_status AS ENUM ('ATIVA', 'PAGA');
CREATE TYPE public.scheduled_transaction_frequency AS ENUM (
  'Diário',
  'Semanal',
  'Quinzenal',
  'Mensal',
  'Anual'
);
CREATE TYPE public.investment_type AS ENUM (
  'renda_fixa',
  'acoes',
  'fiis',
  'cripto',
  'exterior',
  'outros'
);
-- NEW
-- 2. TABELAS PRINCIPAIS
-- Families
CREATE TABLE public.families (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  created_by uuid REFERENCES auth.users(id)
);
-- User Families Mapping
CREATE TABLE public.user_families (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  family_id uuid REFERENCES public.families(id) ON DELETE CASCADE,
  role text DEFAULT 'member',
  -- 'admin', 'member'
  joined_at timestamptz DEFAULT now()
);
CREATE TABLE public.user_profiles (
  id uuid NOT NULL PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  xp integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 1,
  updated_at timestamptz DEFAULT now()
);
-- Invites System
CREATE TABLE public.family_invites (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id uuid REFERENCES public.families(id) ON DELETE CASCADE NOT NULL,
  email text NOT NULL,
  -- Email do convidado
  token text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  status text DEFAULT 'pending',
  -- 'pending', 'accepted', 'expired'
  created_at timestamptz DEFAULT now() NOT NULL,
  expires_at timestamptz DEFAULT (now() + interval '7 days') NOT NULL,
  created_by uuid REFERENCES auth.users(id)
);
CREATE TABLE public.categories (
  id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  icon text NOT NULL,
  color text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.goals (
  id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  target_amount numeric(12, 2) NOT NULL CHECK (target_amount > 0),
  current_amount numeric(12, 2) NOT NULL DEFAULT 0,
  deadline timestamptz NOT NULL,
  status public.goal_status NOT NULL DEFAULT 'EM_ANDAMENTO',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.debts (
  id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  total_amount numeric(12, 2) NOT NULL CHECK (total_amount > 0),
  paid_amount numeric(12, 2) NOT NULL DEFAULT 0,
  interest_rate numeric(5, 2) NOT NULL DEFAULT 0,
  category text NOT NULL,
  status public.debt_status NOT NULL DEFAULT 'ATIVA',
  created_at timestamptz NOT NULL DEFAULT now()
);
-- Investments (Novo)
CREATE TABLE public.investments (
  id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  -- Ex: "Petrobras", "Tesouro Selic"
  ticker text,
  -- Ex: "PETR4", "BTC"
  type public.investment_type NOT NULL,
  amount numeric(12, 2) NOT NULL CHECK (amount >= 0),
  -- Valor total investido
  quantity numeric(12, 4) NOT NULL DEFAULT 1,
  -- Quantidade de cotas
  current_price numeric(12, 2),
  -- Preço atual unitário (pode ser atualizado via API/Mock)
  purchase_date timestamptz NOT NULL DEFAULT now(),
  color text,
  -- Cor para gráficos
  logo_url text,
  -- URL do logo
  sector text,
  -- Ex: "Bancos", "Tecnologia", "Varejo"
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.transactions (
  id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  description text NOT NULL,
  amount numeric(12, 2) NOT NULL CHECK (amount <> 0),
  type public.transaction_type NOT NULL,
  date timestamptz NOT NULL,
  category_id uuid NOT NULL REFERENCES public.categories ON DELETE CASCADE,
  goal_contribution_id uuid REFERENCES public.goals ON DELETE
  SET NULL,
    debt_payment_id uuid REFERENCES public.debts ON DELETE
  SET NULL,
    investment_id uuid REFERENCES public.investments ON DELETE
  SET NULL,
    -- Link para aportes/dividendos
    starred boolean DEFAULT false,
    deleted_at timestamptz,
    -- Soft Delete
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.scheduled_transactions (
  id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  description text NOT NULL,
  amount numeric(12, 2) NOT NULL CHECK (amount <> 0),
  type public.transaction_type NOT NULL,
  category_id uuid NOT NULL REFERENCES public.categories ON DELETE CASCADE,
  start_date timestamptz NOT NULL,
  next_due_date timestamptz NOT NULL,
  frequency public.scheduled_transaction_frequency NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
-- Transaction Comments
CREATE TABLE public.transaction_comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id uuid REFERENCES public.transactions(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);
-- 3. HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
-- NEW
-- 4. FUNÇÕES AUXILIARES
CREATE OR REPLACE FUNCTION public.get_my_family_id() RETURNS uuid AS $$
SELECT family_id
FROM public.user_families
WHERE user_id = auth.uid()
LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = 'public';
-- 5. POLÍTICAS DE RLS
-- User Profiles
CREATE POLICY "Usuários podem ver seu próprio perfil." ON public.user_profiles FOR
SELECT USING (
    (
      select auth.uid()
    ) = id
  );
CREATE POLICY "Usuários podem atualizar seu próprio perfil." ON public.user_profiles FOR
UPDATE USING (
    (
      select auth.uid()
    ) = id
  );
-- Categories
CREATE POLICY "Usuários podem gerenciar suas próprias categorias." ON public.categories FOR ALL USING (
  (
    select auth.uid()
  ) = user_id
);
-- Goals
CREATE POLICY "Usuários podem gerenciar suas próprias metas." ON public.goals FOR ALL USING (
  (
    select auth.uid()
  ) = user_id
);
-- Debts
CREATE POLICY "Usuários podem gerenciar suas próprias dívidas." ON public.debts FOR ALL USING (
  (
    select auth.uid()
  ) = user_id
);
-- Investments (NEW)
CREATE POLICY "Usuários podem gerenciar seus próprios investimentos." ON public.investments FOR ALL USING (
  (
    select auth.uid()
  ) = user_id
);
-- Transactions
CREATE POLICY "Users can view own and family transactions" ON public.transactions FOR
SELECT USING (
    user_id = auth.uid()
    OR user_id IN (
      SELECT user_id
      FROM public.user_families
      WHERE family_id = public.get_my_family_id()
    )
  );
CREATE POLICY "Users can insert own transactions" ON public.transactions FOR
INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own transactions" ON public.transactions FOR
UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own transactions" ON public.transactions FOR DELETE USING (user_id = auth.uid());
-- Scheduled Transactions
CREATE POLICY "Usuários podem gerenciar seus próprios agendamentos." ON public.scheduled_transactions FOR ALL USING (
  (
    select auth.uid()
  ) = user_id
);
-- Families
CREATE POLICY "Users can view their own family" ON public.families FOR
SELECT USING (id = public.get_my_family_id());
CREATE POLICY "Users can create families" ON public.families FOR
INSERT WITH CHECK (auth.uid() = created_by);
-- User Families
CREATE POLICY "Users can view members of their family" ON public.user_families FOR
SELECT USING (family_id = public.get_my_family_id());
CREATE POLICY "Users can join families" ON public.user_families FOR
INSERT WITH CHECK (user_id = auth.uid());
-- Invites
CREATE POLICY "Users can view invites created by them" ON public.family_invites FOR
SELECT USING (created_by = auth.uid());
CREATE POLICY "Users can create invites for their family" ON public.family_invites FOR
INSERT WITH CHECK (family_id = public.get_my_family_id());
CREATE POLICY "Anyone can view invite by token" ON public.family_invites FOR
SELECT USING (true);
-- Transaction Comments
CREATE POLICY "Users can view comments on visible transactions" ON public.transaction_comments FOR
SELECT USING (
    EXISTS (
      SELECT 1
      FROM public.transactions t
      WHERE t.id = transaction_comments.transaction_id
        AND (
          t.user_id = auth.uid()
          OR t.user_id IN (
            SELECT user_id
            FROM public.user_families
            WHERE family_id = public.get_my_family_id()
          )
        )
    )
  );
CREATE POLICY "Users can comment on visible transactions" ON public.transaction_comments FOR
INSERT WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.transactions t
      WHERE t.id = transaction_comments.transaction_id
        AND (
          t.user_id = auth.uid()
          OR t.user_id IN (
            SELECT user_id
            FROM public.user_families
            WHERE family_id = public.get_my_family_id()
          )
        )
    )
  );
-- 6. ÍNDICES
CREATE INDEX ON public.categories (user_id);
CREATE INDEX ON public.goals (user_id);
CREATE INDEX ON public.debts (user_id);
CREATE INDEX ON public.transactions (user_id);
CREATE INDEX ON public.transactions (user_id, date);
CREATE INDEX ON public.scheduled_transactions (user_id);
CREATE INDEX ON public.scheduled_transactions (user_id, next_due_date);
CREATE INDEX ON public.transaction_comments (transaction_id);
CREATE INDEX ON public.investments (user_id);
-- NEW
-- 7. TRIGGERS E FUNÇÕES DE NEGÓCIO
-- Função para criar um perfil de usuário e categorias padrão.
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER AS $$ BEGIN
INSERT INTO public.user_profiles (id, full_name, avatar_url)
VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
INSERT INTO public.categories (user_id, name, icon, color)
VALUES (new.id, 'Alimentação', 'Utensils', '#f59e0b'),
  (new.id, 'Compras', 'ShoppingCart', '#84cc16'),
  (new.id, 'Transporte', 'Car', '#3b82f6'),
  (new.id, 'Moradia', 'HomeIcon', '#14b8a6'),
  (new.id, 'Saúde', 'Heart', '#ef4444'),
  (new.id, 'Educação', 'BookOpen', '#a855f7'),
  (new.id, 'Lazer', 'Gamepad', '#ec4899'),
  (new.id, 'Salário', 'Wallet', '#22c55e'),
  (new.id, 'Investimentos', 'PiggyBank', '#10b981'),
  (new.id, 'Outros', 'Gift', '#6b7280');
RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = 'public';
CREATE TRIGGER on_auth_user_created
AFTER
INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
-- Função para ATUALIZAR o valor atual de uma META.
CREATE OR REPLACE FUNCTION public.update_goal_current_amount() RETURNS TRIGGER AS $$
DECLARE goal_id_to_update uuid;
new_current_amount numeric(12, 2);
BEGIN IF (TG_OP = 'DELETE') THEN goal_id_to_update := OLD.goal_contribution_id;
ELSE goal_id_to_update := NEW.goal_contribution_id;
END IF;
IF goal_id_to_update IS NULL THEN RETURN NULL;
END IF;
SELECT COALESCE(SUM(ABS(amount)), 0) INTO new_current_amount
FROM public.transactions
WHERE goal_contribution_id = goal_id_to_update
  AND type = 'despesa';
UPDATE public.goals
SET current_amount = new_current_amount,
  status = CASE
    WHEN new_current_amount >= target_amount THEN 'CONCLUIDO'::public.goal_status
    ELSE 'EM_ANDAMENTO'::public.goal_status
  END
WHERE id = goal_id_to_update;
RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = 'public';
CREATE TRIGGER on_transaction_change_update_goal
AFTER
INSERT
  OR
UPDATE
  OR DELETE ON public.transactions FOR EACH ROW EXECUTE PROCEDURE public.update_goal_current_amount();
-- Função para ATUALIZAR o valor pago de uma DÍVIDA.
CREATE OR REPLACE FUNCTION public.update_debt_paid_amount() RETURNS TRIGGER AS $$
DECLARE debt_id_to_update uuid;
new_paid_amount numeric(12, 2);
BEGIN IF (TG_OP = 'DELETE') THEN debt_id_to_update := OLD.debt_payment_id;
ELSE debt_id_to_update := NEW.debt_payment_id;
END IF;
IF debt_id_to_update IS NULL THEN RETURN NULL;
END IF;
SELECT COALESCE(SUM(ABS(amount)), 0) INTO new_paid_amount
FROM public.transactions
WHERE debt_payment_id = debt_id_to_update
  AND type = 'despesa';
UPDATE public.debts
SET paid_amount = new_paid_amount,
  status = CASE
    WHEN new_paid_amount >= total_amount THEN 'PAGA'::public.debt_status
    ELSE 'ATIVA'::public.debt_status
  END
WHERE id = debt_id_to_update;
RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = 'public';
CREATE TRIGGER on_transaction_change_update_debt
AFTER
INSERT
  OR
UPDATE
  OR DELETE ON public.transactions FOR EACH ROW EXECUTE PROCEDURE public.update_debt_paid_amount();
-- 8. REALTIME
BEGIN;
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime;
COMMIT;
ALTER PUBLICATION supabase_realtime
ADD TABLE public.transaction_comments;
ALTER PUBLICATION supabase_realtime
ADD TABLE public.transactions;
ALTER PUBLICATION supabase_realtime
ADD TABLE public.investments;
-- NEW
COMMIT;