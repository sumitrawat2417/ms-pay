// ─── Core Enums ───────────────────────────────────────────────────────────────

export type TransactionType =
  | 'sale_merchant_assisted'
  | 'sale_consumer_initiated'
  | 'sale_request_approved'
  | 'recharge_self'
  | 'recharge_admin'
  | 'recharge_merchant_cashin'
  | 'recharge_merchant_advance'
  | 'refund'
  | 'settlement_payout'
  | 'settlement_recovery';

export type PaymentRequestStatus = 'pending' | 'approved' | 'declined' | 'expired';

export type FundingSource = 'self' | 'admin' | 'merchant_cashin' | 'merchant_advance';

// ─── Domain Models ────────────────────────────────────────────────────────────

export interface Consumer {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  idQrToken: string;
  createdAt: string; // ISO 8601
}

export interface Merchant {
  id: string;
  ownerName: string;
  storeName: string;
  phone: string;
  storeQrToken: string;
  category?: string;
}

export interface Wallet {
  id: string;
  consumerId: string;
  balanceMsp: number; // in MSP units (e.g. 1 MSP = ₹1)
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amountMsp: number;
  consumerId: string;
  merchantId?: string;
  merchantName?: string;
  paymentRequestId?: string;
  fundingSource?: FundingSource;
  note?: string;
  createdAt: string; // ISO 8601
}

export interface PaymentRequest {
  id: string;
  merchantId: string;
  merchantName: string;
  consumerRef: string;
  amountMsp: number;
  status: PaymentRequestStatus;
  createdAt: string; // ISO 8601
  expiresAt: string; // ISO 8601
  approvedAt?: string;
  linkedTransactionId?: string;
}

// ─── API Request / Response Shapes ───────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface WalletBalanceResponse {
  wallet: Wallet;
  recentTransactions: Transaction[];
}

export interface InitiatePaymentPayload {
  merchantStoreQrToken: string;
  amountMsp: number;
  passcodeHash: string;
  idempotencyKey: string;
}

export interface ApproveRequestPayload {
  requestId: string;
  passcodeHash: string;
  idempotencyKey: string;
}

export interface SelfRechargePayload {
  amountMsp: number;
  paymentMethod: 'upi' | 'card' | 'bank';
  idempotencyKey: string;
}

export interface PasscodeResetPayload {
  consumerId: string;
  reason?: string;
}

export interface MerchantDashboardResponse {
  todaysCollections: number;
  recentTransactions: Transaction[];
}
