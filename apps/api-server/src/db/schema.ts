import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import type { TransactionType, PaymentRequestStatus, FundingSource } from '@ms-pay/types';

export const consumers = sqliteTable('consumers', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
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
