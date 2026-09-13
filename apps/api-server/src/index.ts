import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { db } from './db/index.js';
import { consumers, wallets, transactions } from './db/schema.js';
import { eq, desc } from 'drizzle-orm';
import type { ApiResponse, WalletBalanceResponse } from '@ms-pay/types';

const app = new Hono();

app.use('*', logger());
app.use('*', cors());

// Mock Auth Middleware: Extracts userId from headers
app.use('*', async (c, next) => {
  const userId = c.req.header('x-user-id');
  if (userId) {
    c.set('userId', userId);
  }
  await next();
});

// Health check
app.get('/api/health', (c) => c.json({ status: 'ok' }));

// ─── API Routes ───────────────────────────────────────────────────────────────

app.get('/api/wallet/balance', async (c) => {
  const userId = c.get('userId');
  if (!userId) {
    return c.json<ApiResponse<null>>({ success: false, data: null, error: 'Unauthorized' }, 401);
  }

  try {
    // Fetch wallet
    const walletData = await db.select().from(wallets).where(eq(wallets.consumerId, userId)).limit(1);
    if (!walletData.length) {
      return c.json<ApiResponse<null>>({ success: false, data: null, error: 'Wallet not found' }, 404);
    }
    const wallet = walletData[0];

    // Fetch recent transactions
    const txData = await db.select()
      .from(transactions)
      .where(eq(transactions.consumerId, userId))
      .orderBy(desc(transactions.createdAt))
      .limit(10);

    const responseData: WalletBalanceResponse = {
      wallet: {
        id: wallet.id,
        consumerId: wallet.consumerId,
        balanceMsp: Number(wallet.balanceMsp),
      },
      recentTransactions: txData.map(tx => ({
        id: tx.id,
        type: tx.type,
        amountMsp: Number(tx.amountMsp),
        consumerId: tx.consumerId,
        merchantId: tx.merchantId || undefined,
        merchantName: tx.merchantName || undefined,
        paymentRequestId: tx.paymentRequestId || undefined,
        fundingSource: tx.fundingSource || undefined,
        note: tx.note || undefined,
        createdAt: tx.createdAt.toISOString(),
      })),
    };

    return c.json<ApiResponse<WalletBalanceResponse>>({ success: true, data: responseData });
  } catch (err: any) {
    console.error(err);
    return c.json<ApiResponse<null>>({ success: false, data: null, error: err.message }, 500);
  }
});

app.post('/api/transactions/recharge', async (c) => {
  const userId = c.get('userId');
  if (!userId) return c.json({ success: false, data: null, error: 'Unauthorized' }, 401);

  try {
    const body = await c.req.json();
    const amountMsp = Number(body.amountMsp);
    if (!amountMsp || amountMsp <= 0) return c.json({ success: false, data: null, error: 'Invalid amount' }, 400);

    // 1. Create transaction
    await db.insert(transactions).values({
      type: 'recharge_self',
      amountMsp,
      consumerId: userId,
      fundingSource: 'self',
      note: 'Wallet top-up',
    });

    // 2. Update wallet balance
    const userWallet = await db.select().from(wallets).where(eq(wallets.consumerId, userId)).limit(1);
    if (userWallet.length) {
      await db.update(wallets)
        .set({ balanceMsp: userWallet[0].balanceMsp + amountMsp })
        .where(eq(wallets.consumerId, userId));
    } else {
      // Create wallet if it doesn't exist
      await db.insert(wallets).values({
        consumerId: userId,
        balanceMsp: amountMsp,
      });
    }

    return c.json({ success: true, data: { message: 'Recharge successful' } });
  } catch (err: any) {
    console.error(err);
    return c.json({ success: false, data: null, error: err.message }, 500);
  }
});

app.post('/api/transactions/pay', async (c) => {
  const userId = c.get('userId');
  if (!userId) return c.json({ success: false, data: null, error: 'Unauthorized' }, 401);

  try {
    const body = await c.req.json();
    const amountMsp = Number(body.amountMsp);
    const storeQrToken = body.merchantStoreQrToken;

    if (!amountMsp || amountMsp <= 0 || !storeQrToken) {
      return c.json({ success: false, data: null, error: 'Invalid payload' }, 400);
    }

    // 1. Find merchant
    const merchant = await db.select().from(merchants).where(eq(merchants.storeQrToken, storeQrToken)).limit(1);
    if (!merchant.length) return c.json({ success: false, data: null, error: 'Merchant not found' }, 404);

    // 2. Check wallet balance
    const userWallet = await db.select().from(wallets).where(eq(wallets.consumerId, userId)).limit(1);
    if (!userWallet.length || userWallet[0].balanceMsp < amountMsp) {
      return c.json({ success: false, data: null, error: 'Insufficient balance' }, 400);
    }

    // 3. Create transaction
    await db.insert(transactions).values({
      type: 'sale_consumer_initiated',
      amountMsp,
      consumerId: userId,
      merchantId: merchant[0].id,
      merchantName: merchant[0].name,
      fundingSource: 'self',
    });

    // 4. Update wallet balance
    await db.update(wallets)
      .set({ balanceMsp: userWallet[0].balanceMsp - amountMsp })
      .where(eq(wallets.consumerId, userId));

    return c.json({ success: true, data: { message: 'Payment successful' } });
  } catch (err: any) {
    console.error(err);
    return c.json({ success: false, data: null, error: err.message }, 500);
  }
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port
});
