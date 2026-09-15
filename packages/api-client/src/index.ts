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
  WalletBalanceResponse,
} from '@ms-pay/types';

// We hardcode localhost:3000 here to ensure all requests go to the real local backend.
// In production, this would be set via environment variables.
const BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3000';

let currentUserId = 'consumer-001';

export function setAuthUser(userId: string) {
  currentUserId = userId;
}

async function fetchApi<T>(path: string, init?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': currentUserId,
        ...init?.headers,
      },
      ...init,
    });
    
    const data = await res.json();
    return data as ApiResponse<T>;
  } catch (err: any) {
    return { success: false, data: null as any, error: err.message };
  }
}

// ─── Authentication ───────────────────────────────────────────────────────────

export async function registerConsumer(firstName: string, lastName: string, phone: string): Promise<ApiResponse<Consumer>> {
  return fetchApi<Consumer>('/api/customer/register', {
    method: 'POST',
    body: JSON.stringify({ firstName, lastName, phone }),
  });
}

export async function loginConsumer(phone: string): Promise<ApiResponse<Consumer>> {
  return fetchApi<Consumer>('/api/customer/login', {
    method: 'POST',
    body: JSON.stringify({ phone }),
  });
}

// ─── Wallet / Balance ─────────────────────────────────────────────────────────

export async function getWalletBalance(): Promise<ApiResponse<WalletBalanceResponse>> {
  return fetchApi<WalletBalanceResponse>('/api/wallet/balance');
}

// ─── Transactions ─────────────────────────────────────────────────────────────

export async function getTransactions(filters?: {
  type?: string;
  merchantId?: string;
  from?: string;
  to?: string;
}): Promise<ApiResponse<Transaction[]>> {
  const query = new URLSearchParams(filters as Record<string, string>).toString();
  return fetchApi<Transaction[]>(`/api/transactions?${query}`);
}

export async function getTransaction(id: string): Promise<ApiResponse<Transaction>> {
  return fetchApi<Transaction>(`/api/transactions/${id}`);
}

// ─── QR / Merchant resolve ────────────────────────────────────────────────────

export async function resolveMerchantQr(token: string): Promise<ApiResponse<Merchant>> {
  return fetchApi<Merchant>(`/api/resolve-qr/${token}`);
}

// ─── Mode B — Consumer-Initiated Payment ──────────────────────────────────────

export async function initiatePayment(payload: InitiatePaymentPayload): Promise<ApiResponse<Transaction>> {
  return fetchApi<Transaction>('/api/transactions/pay', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ─── Mode C — Payment Requests ────────────────────────────────────────────────

export async function getPaymentRequests(): Promise<ApiResponse<PaymentRequest[]>> {
  return fetchApi<PaymentRequest[]>('/api/requests');
}

export async function getPaymentRequest(id: string): Promise<ApiResponse<PaymentRequest>> {
  return fetchApi<PaymentRequest>(`/api/requests/${id}`);
}

export async function approveRequest(payload: ApproveRequestPayload): Promise<ApiResponse<Transaction>> {
  return fetchApi<Transaction>(`/api/requests/${payload.requestId}/approve`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function declineRequest(requestId: string): Promise<ApiResponse<{ requestId: string }>> {
  return fetchApi<{ requestId: string }>(`/api/requests/${requestId}/decline`, { method: 'POST' });
}

// ─── Self Recharge ────────────────────────────────────────────────────────────

export async function selfRecharge(payload: SelfRechargePayload): Promise<ApiResponse<Transaction>> {
  return fetchApi<Transaction>('/api/transactions/recharge', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ─── Consumer Profile ─────────────────────────────────────────────────────────

export async function getConsumerProfile(): Promise<ApiResponse<Consumer>> {
  return fetchApi<Consumer>('/api/customer/profile');
}

export async function requestPasscodeReset(payload: PasscodeResetPayload): Promise<ApiResponse<{ submitted: boolean }>> {
  return fetchApi<{ submitted: boolean }>('/api/customer/passcode-reset', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ─── Merchant Operations ──────────────────────────────────────────────────────

export async function submitMerchantAssistedPay(payload: {
  consumerIdQrToken: string;
  consumerPasscode: string;
  amountMsp: number;
}): Promise<ApiResponse<{ message: string }>> {
  try {
    const res = await fetch(`${BASE_URL}/api/transactions/merchant-assisted-pay`, {
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
