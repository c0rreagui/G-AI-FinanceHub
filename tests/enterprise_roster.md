# 🏢 FinanceHub Enterprise Swarm - Roster de Agentes (20 Bots)

Para simular uma operação empresarial completa e cobrir 100% do sistema, expandiremos o "Swarm" de 5 para 20 agentes especialistas.
O time será dividido em **Departamentos** focados em áreas de risco e funcionalidades críticas.

## 🟢 Time Atual (Core Squad - 5 Agentes)

Já implementados e operacionais.

1. **💼 The CFO** (Transações Avançadas, Finanças Corporativas)
2. **📅 The Planner** (Metas, Orçamentos, Planejamento)
3. **📈 The Investor** (Investimentos, Dívidas, Patrimônio)
4. **🛍️ The Quick Spender** (Mobile, Gastos Rápidos, UX Ágil) / *The Organizer*
5. **🎨 The Designer** (UX Audit, Visual Regression, Responsividade)

---

## 🚀 Novos Recrutas (Expansion Squad - 15 Agentes)

### 🛡️ Departamento de QA & Segurança (4 Agentes)

Focados em quebrar o sistema e garantir robustez.

1. **🐞 The Bug Hunter**: Realiza "Monkey Testing" (cliques aleatórios), insere caracteres especiais, emojis e strings gigantes nos inputs. Tenta causar crashes.
2. **🔒 The Security Officer**: Tenta acessar rotas sem login, verifica permissões de rotas protegidas, tenta SQL Injection básico em buscas, valida expiração de sessão.
3. **🐌 The Network Simpson**: Simula conexões lentas (3G), Offline Mode, e verifica se o App não trava e se os "Spinners" aparecem corretamente.
4. **🚑 The Recovery Specialist**: Foca em fluxos de erro. Tenta logins errados, recupera senha (simulado), clica em links quebrados (404), e valida mensagens de erro amigáveis.

### ♿ Departamento de Acessibilidade & Inclusão (3 Agentes)

Garantem que o FinanceHub seja para todos.

1. **⌨️ The Power User**: Navega **APENAS** via Teclado (Tab, Enter, Espaço, Setas). Valida focus states e atalhos globais ('K', 'N', 'U').
2. **🕶️ The Screen Reader**: Valida se todos os botões e inputs têm `aria-labels` corretos e se as imagens têm `alt text` (Via auditoria de código/DOM).
3. **🌍 The Global Nomad**: Testa formatos de data diferentes, moedas internacionais (se aplicável), e Fusos Horários (via emulação de timezone do browser).

### 📱 Departamento de Plataforma & Dispositivos (4 Agentes)

Cobrem todos os tamanhos de tela e ambientes.

1. **📱 The Tablet Pro**: Roda em iPad Pro (Landscape & Portrait). Valida se o Sidebar vira Menu Hambúrguer corretamente e se gráficos complexos cabem na tela.
2. **🖥️ The 4K Gamer**: Roda em resolução 3840x2160. Verifica se o layout não "estoura" ou fica muito esticado/vazio.
3. **🤏 The Mini Mobile**: Roda em iPhone SE/Android pequeno (320px width). O teste de fogo para responsividade extrema.
4. **🤖 The Android User**: Emula Chrome on Android para validar comportamentos específicos de browser mobile (barra de endereço flutuante).

### 💼 Departamento de Produto & Negócios (4 Agentes)

Focados em features específicas e complexas.

1. **👶 The New Hire (Onboarding)**: Simula um usuário **ZERO KM**. Cria conta nova, vê tutoriais, empty states ("Adicione sua primeira transação"), e configura o perfil inicial.
2. **👨‍👩‍👧‍👦 The Family Manager**: Especialista no módulo Família. Adiciona membros, define permissões, verifica visibilidade de dados compartilhados.
3. **📀 The Data Scientist**: Foca em **Relatórios e Insights**. Exporta CSVs, gera PDFs, manipula filtros de data complexos (ex: "Últimos 3 anos") e valida cálculos de gráficos.
4. **🕶️ The Privacy Zealot**: Valida o **Privacy Mode**. Liga o modo de privacidade e navega pelo app garantindo que valores sensíveis estejam borrados (verificação via screenshot pixel analysis ou classe CSS).

---

## 🗺️ Mapa de Batalha (Implementação)

- **Fase 1 (Arquitetura):** Criar `swarm-enterprise.spec.ts` estruturado para rodar shards desses departamentos.
- **Fase 2 (QA & Sec):** Implementar os 4 agentes de QA (mais urgentes para estabilidade).
- **Fase 3 (Product):** Implementar Onboarding e Family (fluxos complexos).
- **Fase 4 (Platform):** Variações de Viewport (configuração fácil no Playwright).
- **Fase 5 (A11y):** Testes de teclado (complexidade alta).

---

## 🔧 Infraestrutura do "Mecânico Chefe" (Ferramentas para Mim)

Como serei responsável por corrigir tudo que esses 20 bots encontrarem, preciso de ferramentas de diagnóstico de elite:

### 1. 📼 The Black Box Recorder (Caixa Preta)

- **Funcionalidade:** Em caso de falha, o bot não gera apenas um erro. Ele salva:

  - **Vídeo Replay:** Os últimos 30 segundos antes do crash.
  - **Network HAR:** Todas as requisições de rede (para pegar erros 500/401 do Supabase).
  - **Console Logs:** Tudo que o browser "gritou" antes de morrer.

- **Benefício:** Permite que eu "viaje no tempo" e corrija o bug instantaneamente sem precisar reproduzir manualmente.

### 2. 🧐 Visual Regression (O Jogo dos 7 Erros)

- **Funcionalidade:** O agente **Designer** comparará screenshots atuais com "Golden Masters" (versões aprovadas).
- **Benefício:** Detecta regressões visuais sutis (ex: botão desalinhou 1px, cor mudou de tom) que quebrariam a "Consistência e Coesão" do Design System.

### 3. 🏥 Auto-Triage System (Fila de Cirurgia)

- **Funcionalidade:** Falhas críticas geram automaticamente entradas no `task.md` ou arquivos de `Bug Report` padronizados na pasta de artefatos.
- **Benefício:** Cria uma fila de trabalho organizada para mim. Os bots quebram => O sistema relata => Eu conserto => Os bots revalidam.

### 4. 🧩 Deduplicação Inteligente (Anti-Spam)

- **Problema:** Se a API de Login cair, os 20 bots vão falhar ao mesmo tempo. Eu não quero 20 notificações.
- **Solução:** O sistema agrupará falhas idênticas em um único "Incidente Pai".
- **Benefício:** Transforma "200 erros" em "1 Incidente Crítico". Foco no problema raiz.

### 5. 🧬 Gerador de Repro (Clonagem de Bug)

- **Problema:** As vezes é difícil reproduzir um bug 'flaky'.
- **Solução:** O bot salvará um mini-script (`repro-fail-123.spec.ts`) contendo **apenas** os passos exatos que levaram à falha naquele momento.
- **Benefício:** Eu rodo esse script isolado e vejo o bug acontecer na minha frente em segundos, sem rodar a suite toda.

### 6. ❤️‍🩹 AI Self-Healing (Auto-Correção)

- **Problema:** O desenvolvedor muda o ID de um botão e o teste quebra. Eu tenho que ir lá atualizar o seletor.
- **Solução:** O bot detecta que o seletor falhou, mas encontra o botão por texto/posição. Ele **sugere a correção do código** automaticamente.
- **Benefício:** O teste se conserta sozinho em casos simples. Eu só aprovo a mudança.

### 7. ☣️ The Quarantine Zone (Gestão de Flaky Tests)

- **Problema:** Um teste falha "as vezes". Isso tira minha confiança e me faz perder tempo investigando fantasmas.
- **Solução:** Se um teste falhar e passar logo em seguida (flaky), ele é movido automaticamente para a "Quarentena".
- **Benefício:** Testes instáveis não bloqueiam o deploy. Eu os visito na Quarentena quando tiver tempo, sem pressão.

---

Aprovado? Podemos iniciar o recrutamento? 🫡
