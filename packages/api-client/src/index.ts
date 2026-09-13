import type {
  ApiResponse,
  ApproveRequestPayload,
  Consumer,
  InitiatePaymentPayload,
  Merchant,
  PasscodeResetPayload,
  PaymentRequest,
  SelfRechargePayload,
  Transaction,
  Wallet,
  WalletBalanceResponse,
} from '@ms-pay/types';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_CONSUMER: Consumer = {
  id: 'consumer-001',
  name: 'Sumit Rawat',
  idQrToken: 'qr-consumer-001-demo',
  createdAt: new Date().toISOString(),
};

const MOCK_WALLET: Wallet = {
  id: 'wallet-001',
  consumerId: 'consumer-001',
  balanceMsp: 1250.0,
};

const MOCK_MERCHANTS: Merchant[] = [
  { id: 'merchant-001', name: 'The Green Leaf Café', storeQrToken: 'qr-store-001', category: 'Food & Beverage' },
  { id: 'merchant-002', name: 'Urban Threads', storeQrToken: 'qr-store-002', category: 'Clothing' },
  { id: 'merchant-003', name: 'TechZone Electronics', storeQrToken: 'qr-store-003', category: 'Electronics' },
];

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-001',
    type: 'sale_consumer_initiated',
    amountMsp: 180,
    consumerId: 'consumer-001',
    merchantId: 'merchant-001',
    merchantName: 'The Green Leaf Café',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'tx-002',
    type: 'recharge_self',
    amountMsp: 500,
    consumerId: 'consumer-001',
    fundingSource: 'self',
    note: 'Via UPI',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'tx-003',
    type: 'sale_request_approved',
    amountMsp: 95,
    consumerId: 'consumer-001',
    merchantId: 'merchant-002',
    merchantName: 'Urban Threads',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'tx-004',
    type: 'recharge_merchant_cashin',
    amountMsp: 200,
    consumerId: 'consumer-001',
    merchantId: 'merchant-001',
    merchantName: 'The Green Leaf Café',
    fundingSource: 'merchant_cashin',
    note: 'Deposited via The Green Leaf Café',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'tx-005',
    type: 'sale_merchant_assisted',
    amountMsp: 320,
    consumerId: 'consumer-001',
    merchantId: 'merchant-003',
    merchantName: 'TechZone Electronics',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'tx-006',
    type: 'recharge_admin',
    amountMsp: 100,
    consumerId: 'consumer-001',
    fundingSource: 'admin',
    note: 'Welcome bonus',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const MOCK_REQUESTS: PaymentRequest[] = [
  {
    id: 'req-001',
    merchantId: 'merchant-002',
    merchantName: 'Urban Threads',
    consumerRef: 'consumer-001',
    amountMsp: 450,
    status: 'pending',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
  },
  {
    id: 'req-002',
    merchantId: 'merchant-003',
    merchantName: 'TechZone Electronics',
    consumerRef: 'consumer-001',
    amountMsp: 1200,
    status: 'expired',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
];

// ─── Simulate network delay ───────────────────────────────────────────────────

const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

// ─── API Client ───────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env?.VITE_API_BASE_URL;

// If a real base URL is set, delegate to it; otherwise fall through to mock
async function realFetch<T>(path: string, init?: RequestInit): Promise<ApiResponse<T> | null> {
  if (!BASE_URL) return null;
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  return res.json() as Promise<ApiResponse<T>>;
}

// ─── Wallet / Balance ─────────────────────────────────────────────────────────

export async function getWalletBalance(): Promise<ApiResponse<WalletBalanceResponse>> {
  const real = await realFetch<WalletBalanceResponse>('/api/v1/customer/wallet');
  if (real) return real;
  await delay();
  return {
    success: true,
    data: { wallet: MOCK_WALLET, recentTransactions: MOCK_TRANSACTIONS.slice(0, 5) },
  };
}

// ─── Transactions ─────────────────────────────────────────────────────────────

export async function getTransactions(filters?: {
  type?: string;
  merchantId?: string;
  from?: string;
  to?: string;
}): Promise<ApiResponse<Transaction[]>> {
  const real = await realFetch<Transaction[]>('/api/v1/customer/transactions');
  if (real) return real;
  await delay(400);
  let txs = [...MOCK_TRANSACTIONS];
  if (filters?.type) txs = txs.filter((t) => t.type.includes(filters.type!));
  if (filters?.merchantId) txs = txs.filter((t) => t.merchantId === filters.merchantId);
  return { success: true, data: txs };
}

export async function getTransaction(id: string): Promise<ApiResponse<Transaction>> {
  const real = await realFetch<Transaction>(`/api/v1/customer/transactions/${id}`);
  if (real) return real;
  await delay(300);
  const tx = MOCK_TRANSACTIONS.find((t) => t.id === id);
  if (!tx) return { success: false, data: MOCK_TRANSACTIONS[0], error: 'Not found' };
  return { success: true, data: tx };
}

// ─── QR / Merchant resolve ────────────────────────────────────────────────────

export async function resolveMerchantQr(token: string): Promise<ApiResponse<Merchant>> {
  const real = await realFetch<Merchant>(`/api/v1/customer/resolve-qr/${token}`);
  if (real) return real;
  await delay(500);
  const merchant = MOCK_MERCHANTS.find((m) => m.storeQrToken === token) ?? MOCK_MERCHANTS[0];
  return { success: true, data: merchant };
}

// ─── Mode B — Consumer-Initiated Payment ──────────────────────────────────────

export async function initiatePayment(payload: InitiatePaymentPayload): Promise<ApiResponse<Transaction>> {
  const real = await realFetch<Transaction>('/api/v1/customer/pay', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (real) return real;
  await delay(800);
  const merchant = MOCK_MERCHANTS.find((m) => m.storeQrToken === payload.merchantStoreQrToken) ?? MOCK_MERCHANTS[0];
  const newTx: Transaction = {
    id: `tx-${Date.now()}`,
    type: 'sale_consumer_initiated',
    amountMsp: payload.amountMsp,
    consumerId: 'consumer-001',
    merchantId: merchant.id,
    merchantName: merchant.name,
    createdAt: new Date().toISOString(),
  };
  MOCK_WALLET.balanceMsp -= payload.amountMsp;
  MOCK_TRANSACTIONS.unshift(newTx);
  return { success: true, data: newTx };
}

// ─── Mode C — Payment Requests ────────────────────────────────────────────────

export async function getPaymentRequests(): Promise<ApiResponse<PaymentRequest[]>> {
  const real = await realFetch<PaymentRequest[]>('/api/v1/customer/requests');
  if (real) return real;
  await delay(400);
  return { success: true, data: MOCK_REQUESTS };
}

export async function getPaymentRequest(id: string): Promise<ApiResponse<PaymentRequest>> {
  const real = await realFetch<PaymentRequest>(`/api/v1/customer/requests/${id}`);
  if (real) return real;
  await delay(300);
  const req = MOCK_REQUESTS.find((r) => r.id === id);
  if (!req) return { success: false, data: MOCK_REQUESTS[0], error: 'Not found' };
  return { success: true, data: req };
}

export async function approveRequest(payload: ApproveRequestPayload): Promise<ApiResponse<Transaction>> {
  const real = await realFetch<Transaction>(`/api/v1/customer/requests/${payload.requestId}/approve`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (real) return real;
  await delay(900);
  const req = MOCK_REQUESTS.find((r) => r.id === payload.requestId);
  if (!req || req.status !== 'pending') return { success: false, data: {} as Transaction, error: 'Request not found or already handled' };
  req.status = 'approved';
  req.approvedAt = new Date().toISOString();
  const newTx: Transaction = {
    id: `tx-${Date.now()}`,
    type: 'sale_request_approved',
    amountMsp: req.amountMsp,
    consumerId: 'consumer-001',
    merchantId: req.merchantId,
    merchantName: req.merchantName,
    paymentRequestId: req.id,
    createdAt: new Date().toISOString(),
  };
  MOCK_WALLET.balanceMsp -= req.amountMsp;
  MOCK_TRANSACTIONS.unshift(newTx);
  return { success: true, data: newTx };
}

export async function declineRequest(requestId: string): Promise<ApiResponse<{ requestId: string }>> {
  const real = await realFetch<{ requestId: string }>(`/api/v1/customer/requests/${requestId}/decline`, { method: 'POST' });
  if (real) return real;
  await delay(400);
  const req = MOCK_REQUESTS.find((r) => r.id === requestId);
  if (req) req.status = 'declined';
  return { success: true, data: { requestId } };
}

// ─── Self Recharge ────────────────────────────────────────────────────────────

export async function selfRecharge(payload: SelfRechargePayload): Promise<ApiResponse<Transaction>> {
  const real = await realFetch<Transaction>('/api/v1/customer/recharge', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (real) return real;
  await delay(1200);
  const newTx: Transaction = {
    id: `tx-${Date.now()}`,
    type: 'recharge_self',
    amountMsp: payload.amountMsp,
    consumerId: 'consumer-001',
    fundingSource: 'self',
    note: `Via ${payload.paymentMethod.toUpperCase()}`,
    createdAt: new Date().toISOString(),
  };
  MOCK_WALLET.balanceMsp += payload.amountMsp;
  MOCK_TRANSACTIONS.unshift(newTx);
  return { success: true, data: newTx };
}

// ─── Consumer Profile ─────────────────────────────────────────────────────────

export async function getConsumerProfile(): Promise<ApiResponse<Consumer>> {
  const real = await realFetch<Consumer>('/api/v1/customer/profile');
  if (real) return real;
  await delay(300);
  return { success: true, data: MOCK_CONSUMER };
}

export async function requestPasscodeReset(payload: PasscodeResetPayload): Promise<ApiResponse<{ submitted: boolean }>> {
  const real = await realFetch<{ submitted: boolean }>('/api/v1/customer/passcode-reset', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (real) return real;
  await delay(600);
  return { success: true, data: { submitted: true } };
}

// ─── Merchant Operations ──────────────────────────────────────────────────────

export async function submitMerchantAssistedPay(payload: {
  consumerIdQrToken: string;
  consumerPasscode: string;
  amountMsp: number;
}): Promise<ApiResponse<{ message: string }>> {
  // Direct fetch to our local API server we just built
  try {
    const res = await fetch('http://localhost:3000/api/transactions/merchant-assisted-pay', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-user-id': 'merchant-001' // Mock merchant ID auth
      },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, data: { message: '' }, error: err.message };
  }
}
