import { test, expect, BrowserContext, Page } from '@playwright/test';

test.describe('Feature: Family & Social - Multi-User Flow', () => {
    let contextOwner: BrowserContext;
    let pageOwner: Page;
    let contextJoiner: BrowserContext;
    let pageJoiner: Page;

    /* 
     * PREREQUISITES:
     * 1. Supabase "Confirm email" must be DISABLED (Auto-confirm ON) for automated signup to work.
     *    - OR -
     * 2. Use a pre-existing user 'test.user2@financehub.test' with known credentials if auto-confirm is ON.
     * 
     * NOTE: Using pre-existing user for reliability. Create this user manually in Supabase with password 'TestUser123!'
     */
    const familyName = `Família Teste ${Date.now()}`;
    const joinerEmail = 'test.user2@financehub.test'; // Pre-existing user for reliability
    // const joinerEmail = `test.user2.${Date.now()}@financehub.test`; // Dynamic email requires auto-confirm
    const joinerPass = 'TestUser123!';

    let inviteToken = '';

    test.beforeAll(async ({ browser }) => {
        // Create two separate contexts for two different users
        contextOwner = await browser.newContext();
        pageOwner = await contextOwner.newPage();

        contextJoiner = await browser.newContext();
        pageJoiner = await contextJoiner.newPage();
    });

    test.afterAll(async () => {
        await contextOwner.close();
        await contextJoiner.close();
    });

    // Helper to handle Onboarding
    async function handleOnboarding(page: Page, userLabel: string) {
        // Wait slightly for any transition
        await page.waitForTimeout(2000);

        const welcomeText = page.getByText('Bem-vindo ao FinanceHub');
        if (await welcomeText.isVisible({ timeout: 5000 }).catch(() => false)) {
            console.log(`${userLabel}: Onboarding screen detected. Dismissing...`);
            const skipButton = page.getByText('Pular por agora');
            if (await skipButton.isVisible()) {
                await skipButton.click();
            } else {
                const startButton = page.getByText('Vamos Começar');
                if (await startButton.isVisible()) {
                    await startButton.click();
                    try { await page.getByText('Pular').click({ timeout: 2000 }); } catch (e) { }
                }
            }
            // Wait for dashboard content - "SALDO TOTAL" matches existing screenshots
            await expect(page.getByText('SALDO TOTAL')).toBeVisible();
        }
    }

    test('Should allow User1 to invite User2 to a family', async () => {
        const log = (msg: string) => console.log(`[Family E2E] ${msg}`);

        // --- STEP 1: Owner Creates Family ---
        await test.step('User 1 (Owner) - Login & Create Family', async () => {
            log('Owner: Logging in...');
            await pageOwner.goto('/login');
            await pageOwner.fill('input[type="email"]', 'test.user1@financehub.test');
            await pageOwner.fill('input[type="password"]', 'TestUser123!');
            await pageOwner.click('button:has-text("Entrar")');

            await handleOnboarding(pageOwner, 'Owner');

            log('Owner: Navigating to Family tab...');
            await pageOwner.getByRole('button', { name: 'Família' }).click();

            await pageOwner.waitForTimeout(2000);

            // Check if "Criar nova Família" card exists
            const createCardTitle = pageOwner.getByText('Criar nova Família');

            if (await createCardTitle.isVisible()) {
                log('Owner: Creating new family...');
                await pageOwner.fill('input[placeholder*="Nome da Família"]', familyName);
                await pageOwner.click('button:has-text("Criar Família")');
                await expect(pageOwner.getByRole('heading', { name: familyName })).toBeVisible();
                log(`Owner: Created family "${familyName}"`);
            } else {
                log('Owner: Family already exists. Proceeding to invite...');
                await expect(pageOwner.getByRole('heading', { name: 'Membros' })).toBeVisible();
            }
        });

        // --- STEP 2: Generate Invitation ---
        await test.step('User 1 (Owner) - Generate Invite', async () => {
            log('Owner: Generating invite for User 2...');

            // Fixed: Use correct email variable AND inline form logic
            await pageOwner.fill('input[placeholder="Email do membro"]', joinerEmail);
            await pageOwner.click('button:has-text("Enviar")');

            // Expect to see the email in the pending list (use first() to ignore Toast message duplicate)
            await expect(pageOwner.getByText(joinerEmail).first()).toBeVisible();

            log('Owner: attempting to copy token...');
            // Enable clipboard for context
            await contextOwner.grantPermissions(['clipboard-read', 'clipboard-write']);

            // Find copy button (heuristic: button inside the pending list)
            const copyButton = pageOwner.locator('button').filter({ has: pageOwner.locator('svg.lucide-copy') }).first();

            if (await copyButton.isVisible()) {
                await copyButton.click();
                // Wait small delay for clipboard write
                await pageOwner.waitForTimeout(500);
                inviteToken = await pageOwner.evaluate(() => navigator.clipboard.readText());
                log(`Owner: Clipboard Token: ${inviteToken}`);
            } else {
                throw new Error("Copy button not found!");
            }

            expect(inviteToken).toBeTruthy();
            expect(inviteToken.length).toBeGreaterThan(10);
        });

        // --- STEP 3: Joiner Joins ---
        await test.step('User 2 (Joiner) - Login & Join', async () => {
            log('Joiner: Logging in / Signing up...');
            await pageJoiner.goto('/login');

            // Try Login first (Unlikely for unique email, but robustness)
            // Actually, for unique email, we ALWAYS Sign Up.
            // But let's keep the logic if we reuse email in future.

            // Simplify: Directly Sign Up if unique? No, assume login flow first is standard.

            await pageJoiner.fill('input[type="email"]', joinerEmail);
            await pageJoiner.fill('input[type="password"]', joinerPass);
            await pageJoiner.click('button:has-text("Entrar")');

            await pageJoiner.waitForTimeout(2000);

            const errorMsg = pageJoiner.getByText('Invalid login credentials');
            const loginBtn = pageJoiner.getByRole('button', { name: 'Entrar' });

            if (await errorMsg.isVisible() || await loginBtn.isVisible()) {
                log('Joiner: Login failed (expected for new unique email). Attempting Sign Up...');

                // Go to signup
                await pageJoiner.getByText('Cadastre-se').click();
                await pageJoiner.waitForTimeout(1000);

                // Fill Signup
                await pageJoiner.fill('input[placeholder="Seu nome completo"]', 'Joiner User');
                await pageJoiner.fill('input[type="email"]', joinerEmail);
                await pageJoiner.fill('input[type="password"]', joinerPass);

                log('Joiner: Clicking "Criar Conta"...');
                await pageJoiner.getByRole('button', { name: 'Criar Conta' }).click();

                // Wait for either email verification message OR auto-redirect to dashboard
                await pageJoiner.waitForTimeout(3000);

                // Check for email verification message (means auto-confirm is still ON)
                const successMsg = pageJoiner.getByText('Verifique seu e-mail');
                if (await successMsg.isVisible({ timeout: 2000 }).catch(() => false)) {
                    log('ERROR: Sign up requires email verification! Auto-confirm must be disabled in Supabase.');
                    throw new Error('Email verification required. Enable auto-confirm in Supabase (disable "Confirm email" toggle).');
                }

                // After auto-confirm signup, user should be redirected to dashboard or still on login (needing to login again)
                // Try logging in with the new credentials
                const loginBtnAfterSignup = pageJoiner.getByRole('button', { name: 'Entrar' });
                if (await loginBtnAfterSignup.isVisible({ timeout: 2000 }).catch(() => false)) {
                    log('Joiner: Signup successful. Logging in with new credentials...');
                    await pageJoiner.fill('input[type="email"]', joinerEmail);
                    await pageJoiner.fill('input[type="password"]', joinerPass);
                    await pageJoiner.click('button:has-text("Entrar")');
                    await pageJoiner.waitForTimeout(2000);
                }
            }

            // Handle onboarding first - it will dismiss the welcome screen if present and wait for dashboard
            await handleOnboarding(pageJoiner, 'Joiner');

            // Verify we're on dashboard
            log('Joiner: Verifying dashboard loaded...');
            await expect(pageJoiner.getByText('SALDO TOTAL')).toBeVisible({ timeout: 10000 });

            log('Joiner: Navigating to Family tab...');
            await pageJoiner.getByRole('button', { name: 'Família' }).click();
            await pageJoiner.waitForTimeout(2000);

            // User 2 should NOT be in a family yet. If they are, Leave.
            let joinInput = pageJoiner.getByPlaceholder('Token do convite');

            if (!await joinInput.isVisible({ timeout: 3000 }).catch(() => false)) {
                const leaveBtn = pageJoiner.getByText('Sair da Família');
                if (await leaveBtn.isVisible()) {
                    log('Joiner: Leaving current family to test join...');
                    // Handle dialog if present
                    pageJoiner.on('dialog', dialog => dialog.accept());
                    await leaveBtn.click();
                    await pageJoiner.waitForTimeout(3000);

                    // Reload page and navigate back to Family tab to ensure clean state
                    await pageJoiner.reload();
                    await pageJoiner.waitForTimeout(2000);
                    await pageJoiner.getByRole('button', { name: 'Família' }).click();
                    await pageJoiner.waitForTimeout(2000);

                    // Re-locate the join input
                    joinInput = pageJoiner.getByPlaceholder('Token do convite');
                }
            }

            await expect(joinInput).toBeVisible({ timeout: 10000 });

            log(`Joiner: Entering token ${inviteToken}`);
            await joinInput.fill(inviteToken);

            // "Entrar" button in Join Card
            const joinBtn = pageJoiner.locator('button', { hasText: 'Entrar' }).last();
            await joinBtn.click();

            // Expect success
            await expect(pageJoiner.getByRole('heading', { name: 'Membros' })).toBeVisible();
            log('Joiner: Successfully joined!');
        });

        // --- STEP 4: Verify Join Success ---
        await test.step('Verification - Check Members List', async () => {
            log('Verifying join success...');
            // Joiner should see the Members heading (indicates they successfully joined and are viewing family details)
            await expect(pageJoiner.getByRole('heading', { name: 'Membros' })).toBeVisible({ timeout: 10000 });

            log('Success: Joiner successfully joined the family and can see member list!');
        });
    });
});
