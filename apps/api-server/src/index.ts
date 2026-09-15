import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { db } from './db/index.js';
import { consumers, wallets, transactions, merchants, payment_requests } from './db/schema.js';
import { eq, desc } from 'drizzle-orm';
import type { ApiResponse, WalletBalanceResponse } from '@ms-pay/types';

type Variables = {
  userId: string;
};

const app = new Hono<{ Variables: Variables }>();

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
        createdAt: String(tx.createdAt),
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

app.post('/api/transactions/merchant-assisted-pay', async (c) => {
  // In this mode, the merchant is authenticated, and they submit the consumer's token and passcode.
  const merchantId = c.get('userId');
  if (!merchantId) return c.json({ success: false, data: null, error: 'Unauthorized' }, 401);

  try {
    const body = await c.req.json();
    const amountMsp = Number(body.amountMsp);
    const consumerIdQrToken = body.consumerIdQrToken;
    const consumerPasscode = body.consumerPasscode; // In a real app, this would be hashed

    if (!amountMsp || amountMsp <= 0 || !consumerIdQrToken || !consumerPasscode) {
      return c.json({ success: false, data: null, error: 'Invalid payload' }, 400);
    }

    // 1. Find Consumer by their QR token
    const consumerRecord = await db.select().from(consumers).where(eq(consumers.idQrToken, consumerIdQrToken)).limit(1);
    if (!consumerRecord.length) return c.json({ success: false, data: null, error: 'Consumer not found' }, 404);
    const consumer = consumerRecord[0];

    // MOCK PASSCODE CHECK: We will assume '1234' is the universal correct PIN for now.
    if (consumerPasscode !== '1234') {
      return c.json({ success: false, data: null, error: 'Incorrect Passcode' }, 401);
    }

    // 2. Find merchant to get their name
    const merchantRecord = await db.select().from(merchants).where(eq(merchants.id, merchantId)).limit(1);
    const merchantName = merchantRecord.length ? merchantRecord[0].name : 'Unknown Merchant';

    // 3. Check consumer wallet balance
    const userWallet = await db.select().from(wallets).where(eq(wallets.consumerId, consumer.id)).limit(1);
    if (!userWallet.length || userWallet[0].balanceMsp < amountMsp) {
      return c.json({ success: false, data: null, error: 'Insufficient balance' }, 400);
    }

    // 4. Create transaction
    await db.insert(transactions).values({
      type: 'sale_merchant_assisted',
      amountMsp,
      consumerId: consumer.id,
      merchantId: merchantId,
      merchantName: merchantName,
      fundingSource: 'self',
    });

    // 5. Update consumer wallet balance
    await db.update(wallets)
      .set({ balanceMsp: userWallet[0].balanceMsp - amountMsp })
      .where(eq(wallets.consumerId, consumer.id));

    return c.json({ success: true, data: { message: 'Payment successful' } });
  } catch (err: any) {
    console.error(err);
    return c.json({ success: false, data: null, error: err.message }, 500);
  }
});

app.get('/api/transactions', async (c) => {
  const userId = c.get('userId');
  if (!userId) return c.json({ success: false, data: null, error: 'Unauthorized' }, 401);
  try {
    const txData = await db.select().from(transactions).where(eq(transactions.consumerId, userId)).orderBy(desc(transactions.createdAt)).limit(50);
    const formatted = txData.map(tx => ({
      ...tx,
      createdAt: String(tx.createdAt),
      amountMsp: Number(tx.amountMsp)
    }));
    return c.json({ success: true, data: formatted });
  } catch (err: any) {
    return c.json({ success: false, data: null, error: err.message }, 500);
  }
});

app.get('/api/resolve-qr/:token', async (c) => {
  const token = c.req.param('token');
  try {
    const m = await db.select().from(merchants).where(eq(merchants.storeQrToken, token)).limit(1);
    if (!m.length) return c.json({ success: false, data: null, error: 'Merchant not found' }, 404);
    return c.json({ success: true, data: m[0] });
  } catch (err: any) {
    return c.json({ success: false, data: null, error: err.message }, 500);
  }
});

app.get('/api/requests', async (c) => {
  const userId = c.get('userId');
  if (!userId) return c.json({ success: false, data: null, error: 'Unauthorized' }, 401);
  try {
    const reqs = await db.select().from(payment_requests).where(eq(payment_requests.consumerRef, userId)).orderBy(desc(payment_requests.createdAt));
    return c.json({ success: true, data: reqs });
  } catch (err: any) {
    return c.json({ success: false, data: null, error: err.message }, 500);
  }
});

app.post('/api/requests/:id/approve', async (c) => {
  const userId = c.get('userId');
  const reqId = c.req.param('id');
  if (!userId) return c.json({ success: false, data: null, error: 'Unauthorized' }, 401);
  
  try {
    const reqs = await db.select().from(payment_requests).where(eq(payment_requests.id, reqId)).limit(1);
    if (!reqs.length || reqs[0].status !== 'pending' || reqs[0].consumerRef !== userId) {
      return c.json({ success: false, data: null, error: 'Request not found or invalid' }, 404);
    }
    
    const r = reqs[0];
    const userWallet = await db.select().from(wallets).where(eq(wallets.consumerId, userId)).limit(1);
    if (!userWallet.length || userWallet[0].balanceMsp < r.amountMsp) {
      return c.json({ success: false, data: null, error: 'Insufficient balance' }, 400);
    }

    // 1. Mark request approved
    await db.update(payment_requests).set({ status: 'approved', approvedAt: String(new Date()) }).where(eq(payment_requests.id, reqId));
    
    // 2. Create Tx
    await db.insert(transactions).values({
      type: 'sale_request_approved',
      amountMsp: r.amountMsp,
      consumerId: userId,
      merchantId: r.merchantId,
      merchantName: r.merchantName,
      paymentRequestId: r.id,
      fundingSource: 'self'
    });

    // 3. Update Wallet
    await db.update(wallets).set({ balanceMsp: userWallet[0].balanceMsp - r.amountMsp }).where(eq(wallets.consumerId, userId));
    
    return c.json({ success: true, data: { message: 'Approved' } });
  } catch (err: any) {
    return c.json({ success: false, data: null, error: err.message }, 500);
  }
});

app.post('/api/requests/:id/decline', async (c) => {
  const userId = c.get('userId');
  const reqId = c.req.param('id');
  if (!userId) return c.json({ success: false, data: null, error: 'Unauthorized' }, 401);
  
  try {
    await db.update(payment_requests).set({ status: 'declined' }).where(eq(payment_requests.id, reqId));
    return c.json({ success: true, data: { message: 'Declined' } });
  } catch (err: any) {
    return c.json({ success: false, data: null, error: err.message }, 500);
  }
});

app.get('/api/customer/profile', async (c) => {
  const userId = c.get('userId');
  if (!userId) return c.json({ success: false, data: null, error: 'Unauthorized' }, 401);
  try {
    const user = await db.select().from(consumers).where(eq(consumers.id, userId)).limit(1);
    if (!user.length) return c.json({ success: false, data: null, error: 'Not found' }, 404);
    return c.json({ success: true, data: user[0] });
  } catch (err: any) {
    return c.json({ success: false, data: null, error: err.message }, 500);
  }
});

app.post('/api/customer/register', async (c) => {
  try {
    const { firstName, lastName, phone } = await c.req.json();
    if (!firstName || !lastName || !phone) return c.json({ success: false, data: null, error: 'First name, last name, and phone are required' }, 400);

    const consumerId = crypto.randomUUID();
    const idQrToken = `qr-cus-${consumerId.slice(0, 8)}`;
    
    // SQLite doesn't have a specific unique constraint error code object structure we can cleanly catch in standard try/catch without checking the message
    // So we'll first check if the phone exists to give a better error message.
    const existing = await db.select().from(consumers).where(eq(consumers.phone, phone)).limit(1);
    if (existing.length) {
      return c.json({ success: false, data: null, error: 'Phone number already registered' }, 400);
    }

    await db.insert(consumers).values({
      id: consumerId,
      firstName,
      lastName,
      phone,
      idQrToken,
    });

    await db.insert(wallets).values({
      consumerId,
      balanceMsp: 0,
    });

    const user = await db.select().from(consumers).where(eq(consumers.id, consumerId)).limit(1);
    return c.json({ success: true, data: user[0] });
  } catch (err: any) {
    return c.json({ success: false, data: null, error: err.message }, 500);
  }
});

app.post('/api/customer/login', async (c) => {
  try {
    const { phone } = await c.req.json();
    if (!phone) return c.json({ success: false, data: null, error: 'Phone number required' }, 400);

    const user = await db.select().from(consumers).where(eq(consumers.phone, phone)).limit(1);
    if (!user.length) return c.json({ success: false, data: null, error: 'Invalid Phone Number' }, 401);

    return c.json({ success: true, data: user[0] });
  } catch (err: any) {
    return c.json({ success: false, data: null, error: err.message }, 500);
  }
});

app.post('/api/customer/passcode-reset', async (c) => {
  return c.json({ success: true, data: { submitted: true } });
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port
});
