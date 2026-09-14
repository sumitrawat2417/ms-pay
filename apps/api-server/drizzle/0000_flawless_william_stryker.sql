CREATE TABLE `consumers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`id_qr_token` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `merchants` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`store_qr_token` text NOT NULL,
	`category` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `payment_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`merchant_id` text NOT NULL,
	`merchant_name` text NOT NULL,
	`consumer_ref` text NOT NULL,
	`amount_msp` real NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`linked_transaction_id` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`expires_at` text NOT NULL,
	`approved_at` text,
	FOREIGN KEY (`merchant_id`) REFERENCES `merchants`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`amount_msp` real NOT NULL,
	`consumer_id` text NOT NULL,
	`merchant_id` text,
	`merchant_name` text,
	`payment_request_id` text,
	`funding_source` text,
	`note` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`consumer_id`) REFERENCES `consumers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`merchant_id`) REFERENCES `merchants`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `wallets` (
	`id` text PRIMARY KEY NOT NULL,
	`consumer_id` text NOT NULL,
	`balance_msp` real DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`consumer_id`) REFERENCES `consumers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `consumers_id_qr_token_unique` ON `consumers` (`id_qr_token`);--> statement-breakpoint
CREATE UNIQUE INDEX `merchants_store_qr_token_unique` ON `merchants` (`store_qr_token`);--> statement-breakpoint
CREATE UNIQUE INDEX `wallets_consumer_id_unique` ON `wallets` (`consumer_id`);