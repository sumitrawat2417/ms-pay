import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import type { TransactionType, PaymentRequestStatus, FundingSource } from '@ms-pay/types';

export const consumers = sqliteTable('consumers', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  phone: text('phone').notNull().unique(),
  idQrToken: text('id_qr_token').notNull().unique(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const merchants = sqliteTable('merchants', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  storeQrToken: text('store_qr_token').notNull().unique(),
  category: text('category'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const wallets = sqliteTable('wallets', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  consumerId: text('consumer_id').references(() => consumers.id).notNull().unique(),
  balanceMsp: real('balance_msp').notNull().default(0.00),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const transactions = sqliteTable('transactions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  type: text('type').$type<TransactionType>().notNull(),
  amountMsp: real('amount_msp').notNull(),
  consumerId: text('consumer_id').references(() => consumers.id).notNull(),
  merchantId: text('merchant_id').references(() => merchants.id),
  merchantName: text('merchant_name'),
  paymentRequestId: text('payment_request_id'),
  fundingSource: text('funding_source').$type<FundingSource>(),
  note: text('note'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const payment_requests = sqliteTable('payment_requests', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  merchantId: text('merchant_id').references(() => merchants.id).notNull(),
  merchantName: text('merchant_name').notNull(),
  consumerRef: text('consumer_ref').notNull(), // QR Token or ID
  amountMsp: real('amount_msp').notNull(),
  status: text('status').$type<PaymentRequestStatus>().notNull().default('pending'),
  linkedTransactionId: text('linked_transaction_id'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  expiresAt: text('expires_at').notNull(),
  approvedAt: text('approved_at'),
});
