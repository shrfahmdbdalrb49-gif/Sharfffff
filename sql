CREATE TABLE `attachments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`refKind` varchar(60) NOT NULL,
	`refId` int NOT NULL,
	`fileName` varchar(200) NOT NULL,
	`fileUrl` varchar(500) NOT NULL,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `attachments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`userId` int NOT NULL,
	`action` varchar(80) NOT NULL,
	`refKind` varchar(60),
	`refId` int,
	`detail` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `batches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`itemId` int NOT NULL,
	`storeId` int NOT NULL,
	`batchNo` varchar(60) NOT NULL,
	`mfgDate` date,
	`expDate` date NOT NULL,
	`qty` double NOT NULL DEFAULT 0,
	`cost` bigint NOT NULL DEFAULT 0,
	`shelf` varchar(60),
	`sourceKind` enum('purchase','opening','transfer_in','return','adjusted','recalled') NOT NULL DEFAULT 'purchase',
	`sourceId` int,
	`recalled` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `batches_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `branch_transfer_lines` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`transferId` int NOT NULL,
	`itemId` int NOT NULL,
	`batchId` int NOT NULL,
	`qty` double NOT NULL DEFAULT 0,
	`receivedQty` double NOT NULL DEFAULT 0,
	CONSTRAINT `branch_transfer_lines_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `branch_transfers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`docNo` varchar(32) NOT NULL,
	`docDate` date NOT NULL,
	`fromStoreId` int NOT NULL,
	`toStoreId` int NOT NULL,
	`status` enum('draft','final','posted','cancelled') NOT NULL DEFAULT 'draft',
	`notes` text,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `branch_transfers_id` PRIMARY KEY(`id`),
	CONSTRAINT `bt_docno` UNIQUE(`tenantId`,`docNo`)
);
--> statement-breakpoint
CREATE TABLE `branches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`code` varchar(24) NOT NULL,
	`name` varchar(160) NOT NULL,
	`address` varchar(320),
	`phone` varchar(40),
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `branches_id` PRIMARY KEY(`id`),
	CONSTRAINT `br_code` UNIQUE(`tenantId`,`code`)
);
--> statement-breakpoint
CREATE TABLE `cash_accounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`code` varchar(24) NOT NULL,
	`name` varchar(160) NOT NULL,
	`kind` enum('box','bank') NOT NULL,
	`currencyId` int,
	`active` boolean NOT NULL DEFAULT true,
	CONSTRAINT `cash_accounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `ca_code` UNIQUE(`tenantId`,`code`)
);
--> statement-breakpoint
CREATE TABLE `currencies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`code` varchar(6) NOT NULL,
	`name` varchar(80) NOT NULL,
	`rate` double NOT NULL DEFAULT 1,
	`active` boolean NOT NULL DEFAULT true,
	CONSTRAINT `currencies_id` PRIMARY KEY(`id`),
	CONSTRAINT `cur_code` UNIQUE(`tenantId`,`code`)
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`kind` enum('patient','regular') NOT NULL DEFAULT 'patient',
	`code` varchar(40) NOT NULL,
	`name` varchar(200) NOT NULL,
	`phone` varchar(40),
	`taxNumber` varchar(40),
	`creditLimit` bigint NOT NULL DEFAULT 0,
	`active` boolean NOT NULL DEFAULT true,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `customers_id` PRIMARY KEY(`id`),
	CONSTRAINT `cu_code` UNIQUE(`tenantId`,`code`)
);
--> statement-breakpoint
CREATE TABLE `doctors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`code` varchar(40) NOT NULL,
	`name` varchar(200) NOT NULL,
	`specialty` varchar(160),
	`phone` varchar(40),
	`source` varchar(120),
	`active` boolean NOT NULL DEFAULT true,
	CONSTRAINT `doctors_id` PRIMARY KEY(`id`),
	CONSTRAINT `dr_code` UNIQUE(`tenantId`,`code`)
);
--> statement-breakpoint
CREATE TABLE `employees` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`userId` int,
	`name` varchar(200) NOT NULL,
	`role` enum('pharmacist','technician','accountant','purchase','cashier','staff') NOT NULL DEFAULT 'staff',
	`branchId` int,
	`phone` varchar(40),
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `employees_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fiscal_years` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`name` varchar(80) NOT NULL,
	`startDate` date NOT NULL,
	`endDate` date NOT NULL,
	`closed` boolean NOT NULL DEFAULT false,
	CONSTRAINT `fiscal_years_id` PRIMARY KEY(`id`),
	CONSTRAINT `fy_tenant` UNIQUE(`tenantId`,`name`)
);
--> statement-breakpoint
CREATE TABLE `fund_transfers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`docNo` varchar(32) NOT NULL,
	`docDate` date NOT NULL,
	`fromAccountId` int NOT NULL,
	`toAccountId` int NOT NULL,
	`amount` bigint NOT NULL DEFAULT 0,
	`status` enum('draft','final','posted','cancelled') NOT NULL DEFAULT 'draft',
	`notes` text,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `fund_transfers_id` PRIMARY KEY(`id`),
	CONSTRAINT `ft_docno` UNIQUE(`tenantId`,`docNo`)
);
--> statement-breakpoint
CREATE TABLE `gl_account_balances` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`accountId` int NOT NULL,
	`debit` bigint NOT NULL DEFAULT 0,
	`credit` bigint NOT NULL DEFAULT 0,
	CONSTRAINT `gl_account_balances_id` PRIMARY KEY(`id`),
	CONSTRAINT `gab_acc` UNIQUE(`tenantId`,`accountId`)
);
--> statement-breakpoint
CREATE TABLE `gl_accounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`code` varchar(24) NOT NULL,
	`name` varchar(200) NOT NULL,
	`kind` enum('asset','liability','equity','income','expense') NOT NULL,
	`parentId` int,
	`level` int NOT NULL DEFAULT 1,
	`allowPost` boolean NOT NULL DEFAULT true,
	`active` boolean NOT NULL DEFAULT true,
	CONSTRAINT `gl_accounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `gla_code` UNIQUE(`tenantId`,`code`)
);
--> statement-breakpoint
CREATE TABLE `insurance_approvals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`cardId` int NOT NULL,
	`approvalNo` varchar(60),
	`amount` bigint NOT NULL DEFAULT 0,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `insurance_approvals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `insurance_cards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`customerId` int NOT NULL,
	`companyId` int NOT NULL,
	`cardNumber` varchar(80) NOT NULL,
	`expiryDate` date,
	`active` boolean NOT NULL DEFAULT true,
	CONSTRAINT `insurance_cards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `insurance_claims` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`docNo` varchar(32) NOT NULL,
	`docDate` date NOT NULL,
	`invoiceId` int NOT NULL,
	`customerId` int NOT NULL,
	`companyId` int NOT NULL,
	`cardId` int,
	`amount` bigint NOT NULL DEFAULT 0,
	`settledAmount` bigint NOT NULL DEFAULT 0,
	`status` enum('pending','sent','accepted','rejected','settled') NOT NULL DEFAULT 'pending',
	`rejectionReason` varchar(300),
	`notes` text,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `insurance_claims_id` PRIMARY KEY(`id`),
	CONSTRAINT `cl_docno` UNIQUE(`tenantId`,`docNo`)
);
--> statement-breakpoint
CREATE TABLE `insurance_companies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`code` varchar(40) NOT NULL,
	`name` varchar(200) NOT NULL,
	`contractRate` double NOT NULL DEFAULT 100,
	`contactPhone` varchar(40),
	`active` boolean NOT NULL DEFAULT true,
	CONSTRAINT `insurance_companies_id` PRIMARY KEY(`id`),
	CONSTRAINT `ic_code` UNIQUE(`tenantId`,`code`)
);
--> statement-breakpoint
CREATE TABLE `item_alternatives` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`itemId` int NOT NULL,
	`alternativeId` int NOT NULL,
	CONSTRAINT `item_alternatives_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `item_interactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`itemIdA` int NOT NULL,
	`itemIdB` int NOT NULL,
	`severity` enum('low','medium','high') NOT NULL DEFAULT 'medium',
	`note` varchar(300),
	CONSTRAINT `item_interactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`code` varchar(40) NOT NULL,
	`barcode` varchar(64),
	`name` varchar(200) NOT NULL,
	`nameEn` varchar(200),
	`scientificName` varchar(200),
	`manufacturer` varchar(200),
	`strength` varchar(120),
	`dosageForm` varchar(120),
	`groupId` int,
	`unitId` int,
	`requiresPrescription` boolean NOT NULL DEFAULT false,
	`hasExpiry` boolean NOT NULL DEFAULT true,
	`useBatch` boolean NOT NULL DEFAULT true,
	`minStock` double NOT NULL DEFAULT 0,
	`costPrice` bigint NOT NULL DEFAULT 0,
	`sellPrice` bigint NOT NULL DEFAULT 0,
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `items_id` PRIMARY KEY(`id`),
	CONSTRAINT `it_code` UNIQUE(`tenantId`,`code`)
);
--> statement-breakpoint
CREATE TABLE `journal_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`docNo` varchar(32) NOT NULL,
	`docDate` date NOT NULL,
	`description` varchar(300),
	`sourceKind` varchar(60),
	`refKind` varchar(60),
	`refId` int,
	`status` enum('draft','posted','cancelled') NOT NULL DEFAULT 'draft',
	`totalDebit` bigint NOT NULL DEFAULT 0,
	`totalCredit` bigint NOT NULL DEFAULT 0,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`postedAt` timestamp,
	CONSTRAINT `journal_entries_id` PRIMARY KEY(`id`),
	CONSTRAINT `je_docno` UNIQUE(`tenantId`,`docNo`)
);
--> statement-breakpoint
CREATE TABLE `journal_entry_lines` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`entryId` int NOT NULL,
	`accountId` int NOT NULL,
	`description` varchar(300),
	`debit` bigint NOT NULL DEFAULT 0,
	`credit` bigint NOT NULL DEFAULT 0,
	CONSTRAINT `journal_entry_lines_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `party_balances` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`kind` enum('cash_box','bank','customer','insurance','supplier') NOT NULL,
	`refId` int NOT NULL,
	`balance` bigint NOT NULL DEFAULT 0,
	CONSTRAINT `party_balances_id` PRIMARY KEY(`id`),
	CONSTRAINT `pb_ref` UNIQUE(`tenantId`,`kind`,`refId`)
);
--> statement-breakpoint
CREATE TABLE `payment_methods` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`code` varchar(40) NOT NULL,
	`name` varchar(120) NOT NULL,
	`kind` enum('cash','card','bank_transfer','check','insurance') NOT NULL DEFAULT 'cash',
	`active` boolean NOT NULL DEFAULT true,
	CONSTRAINT `payment_methods_id` PRIMARY KEY(`id`),
	CONSTRAINT `pm_code` UNIQUE(`tenantId`,`code`)
);
--> statement-breakpoint
CREATE TABLE `prescription_lines` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`prescriptionId` int NOT NULL,
	`itemId` int NOT NULL,
	`dose` varchar(200),
	`duration` varchar(120),
	`qty` double NOT NULL DEFAULT 0,
	CONSTRAINT `prescription_lines_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `prescriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`docNo` varchar(32) NOT NULL,
	`docDate` date NOT NULL,
	`customerId` int NOT NULL,
	`doctorId` int,
	`note` text,
	`status` enum('draft','filled','cancelled') NOT NULL DEFAULT 'draft',
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `prescriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `rx_docno` UNIQUE(`tenantId`,`docNo`)
);
--> statement-breakpoint
CREATE TABLE `price_list_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`priceListId` int NOT NULL,
	`itemId` int NOT NULL,
	`price` bigint NOT NULL DEFAULT 0,
	CONSTRAINT `price_list_items_id` PRIMARY KEY(`id`),
	CONSTRAINT `pli_pl_item` UNIQUE(`tenantId`,`priceListId`,`itemId`)
);
--> statement-breakpoint
CREATE TABLE `price_lists` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`name` varchar(120) NOT NULL,
	`active` boolean NOT NULL DEFAULT true,
	`isDefault` boolean NOT NULL DEFAULT false,
	CONSTRAINT `price_lists_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pricing_policies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`name` varchar(120) NOT NULL,
	`marginPercent` double NOT NULL DEFAULT 20,
	`rounding` varchar(40) NOT NULL DEFAULT 'nearest100',
	`active` boolean NOT NULL DEFAULT true,
	CONSTRAINT `pricing_policies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `purchase_invoice_lines` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`invoiceId` int NOT NULL,
	`itemId` int NOT NULL,
	`unit` varchar(40),
	`batchNo` varchar(60),
	`mfgDate` date,
	`expDate` date,
	`qty` double NOT NULL DEFAULT 0,
	`bonusQty` double NOT NULL DEFAULT 0,
	`purchasePrice` bigint NOT NULL DEFAULT 0,
	`discountPercent` double NOT NULL DEFAULT 0,
	`discountValue` bigint NOT NULL DEFAULT 0,
	`taxPercent` double NOT NULL DEFAULT 0,
	`taxValue` bigint NOT NULL DEFAULT 0,
	`extraCost` bigint NOT NULL DEFAULT 0,
	`unitCost` bigint NOT NULL DEFAULT 0,
	`lineTotal` bigint NOT NULL DEFAULT 0,
	`shelf` varchar(60),
	`notes` text,
	CONSTRAINT `purchase_invoice_lines_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `purchase_invoices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`supplierId` int NOT NULL,
	`branchId` int NOT NULL,
	`storeId` int NOT NULL,
	`docNo` varchar(32) NOT NULL,
	`refNo` varchar(40),
	`docDate` date NOT NULL,
	`dueDate` date,
	`currencyId` int,
	`rate` double NOT NULL DEFAULT 1,
	`kind` enum('cash','credit') NOT NULL DEFAULT 'credit',
	`status` enum('draft','approved','final','posted','cancelled') NOT NULL DEFAULT 'draft',
	`orderId` int,
	`awbNo` varchar(40),
	`carrier` varchar(120),
	`arrivedAt` date,
	`receivedBy` varchar(120),
	`subtotal` bigint NOT NULL DEFAULT 0,
	`bonus` bigint NOT NULL DEFAULT 0,
	`discount` bigint NOT NULL DEFAULT 0,
	`tax` bigint NOT NULL DEFAULT 0,
	`shippingCost` bigint NOT NULL DEFAULT 0,
	`extraCosts` bigint NOT NULL DEFAULT 0,
	`total` bigint NOT NULL DEFAULT 0,
	`paid` bigint NOT NULL DEFAULT 0,
	`remaining` bigint NOT NULL DEFAULT 0,
	`paymentMethodId` int,
	`cashAccountId` int,
	`receiptNo` varchar(40),
	`notes` text,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`postedAt` timestamp,
	CONSTRAINT `purchase_invoices_id` PRIMARY KEY(`id`),
	CONSTRAINT `pi_docno` UNIQUE(`tenantId`,`docNo`),
	CONSTRAINT `pi_ref` UNIQUE(`tenantId`,`supplierId`,`refNo`)
);
--> statement-breakpoint
CREATE TABLE `purchase_order_lines` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`orderId` int NOT NULL,
	`itemId` int NOT NULL,
	`qty` double NOT NULL DEFAULT 0,
	`unit` varchar(40),
	`estPrice` bigint NOT NULL DEFAULT 0,
	CONSTRAINT `purchase_order_lines_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `purchase_orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`supplierId` int NOT NULL,
	`docNo` varchar(32) NOT NULL,
	`docDate` date NOT NULL,
	`branchId` int NOT NULL,
	`status` enum('draft','sent','received','cancelled') NOT NULL DEFAULT 'draft',
	`total` bigint NOT NULL DEFAULT 0,
	`notes` text,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `purchase_orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `po_docno` UNIQUE(`tenantId`,`docNo`)
);
--> statement-breakpoint
CREATE TABLE `purchase_return_lines` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`returnId` int NOT NULL,
	`itemId` int NOT NULL,
	`batchId` int NOT NULL,
	`qty` double NOT NULL DEFAULT 0,
	`price` bigint NOT NULL DEFAULT 0,
	`lineTotal` bigint NOT NULL DEFAULT 0,
	CONSTRAINT `purchase_return_lines_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `purchase_returns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`supplierId` int NOT NULL,
	`docNo` varchar(32) NOT NULL,
	`docDate` date NOT NULL,
	`status` enum('draft','final','posted','cancelled') NOT NULL DEFAULT 'draft',
	`total` bigint NOT NULL DEFAULT 0,
	`notes` text,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `purchase_returns_id` PRIMARY KEY(`id`),
	CONSTRAINT `pr_docno` UNIQUE(`tenantId`,`docNo`)
);
--> statement-breakpoint
CREATE TABLE `sale_invoice_lines` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`invoiceId` int NOT NULL,
	`itemId` int NOT NULL,
	`batchId` int NOT NULL,
	`unit` varchar(40),
	`qty` double NOT NULL DEFAULT 0,
	`price` bigint NOT NULL DEFAULT 0,
	`discountPercent` double NOT NULL DEFAULT 0,
	`taxPercent` double NOT NULL DEFAULT 0,
	`lineTotal` bigint NOT NULL DEFAULT 0,
	CONSTRAINT `sale_invoice_lines_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sale_invoices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`branchId` int NOT NULL,
	`storeId` int NOT NULL,
	`docNo` varchar(32) NOT NULL,
	`docDate` date NOT NULL,
	`customerId` int,
	`doctorId` int,
	`prescriptionNo` varchar(40),
	`insuranceCardId` int,
	`kind` enum('cash','credit','insurance') NOT NULL DEFAULT 'cash',
	`currencyId` int,
	`rate` double NOT NULL DEFAULT 1,
	`status` enum('draft','final','posted','cancelled') NOT NULL DEFAULT 'draft',
	`subtotal` bigint NOT NULL DEFAULT 0,
	`discount` bigint NOT NULL DEFAULT 0,
	`tax` bigint NOT NULL DEFAULT 0,
	`total` bigint NOT NULL DEFAULT 0,
	`paid` bigint NOT NULL DEFAULT 0,
	`remaining` bigint NOT NULL DEFAULT 0,
	`paymentMethodId` int,
	`cashAccountId` int,
	`dueDate` date,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`postedAt` timestamp,
	CONSTRAINT `sale_invoices_id` PRIMARY KEY(`id`),
	CONSTRAINT `si_docno` UNIQUE(`tenantId`,`docNo`)
);
--> statement-breakpoint
CREATE TABLE `stock_count_lines` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`countId` int NOT NULL,
	`itemId` int NOT NULL,
	`batchId` int NOT NULL,
	`systemQty` double NOT NULL DEFAULT 0,
	`actualQty` double NOT NULL DEFAULT 0,
	`cost` bigint NOT NULL DEFAULT 0,
	CONSTRAINT `stock_count_lines_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stock_counts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`branchId` int NOT NULL,
	`storeId` int NOT NULL,
	`docNo` varchar(32) NOT NULL,
	`docDate` date NOT NULL,
	`kind` enum('periodic','surprise','expiry') NOT NULL DEFAULT 'periodic',
	`status` enum('draft','final','posted','cancelled') NOT NULL DEFAULT 'draft',
	`notes` text,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `stock_counts_id` PRIMARY KEY(`id`),
	CONSTRAINT `sc_docno` UNIQUE(`tenantId`,`docNo`)
);
--> statement-breakpoint
CREATE TABLE `stock_movements` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`itemId` int NOT NULL,
	`batchId` int NOT NULL,
	`storeId` int NOT NULL,
	`kind` enum('in_purchase','in_return','in_adjust_up','in_transfer','out_sale','out_return','out_adjust_down','out_destroy','out_transfer') NOT NULL,
	`qty` double NOT NULL DEFAULT 0,
	`cost` bigint NOT NULL DEFAULT 0,
	`refKind` varchar(60),
	`refId` int,
	`docNo` varchar(32),
	`docDate` date NOT NULL,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `stock_movements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`branchId` int NOT NULL,
	`code` varchar(24) NOT NULL,
	`name` varchar(160) NOT NULL,
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `stores_id` PRIMARY KEY(`id`),
	CONSTRAINT `st_code` UNIQUE(`tenantId`,`code`)
);
--> statement-breakpoint
CREATE TABLE `suppliers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`code` varchar(40) NOT NULL,
	`name` varchar(200) NOT NULL,
	`phone` varchar(40),
	`taxNumber` varchar(40),
	`city` varchar(120),
	`creditLimit` bigint NOT NULL DEFAULT 0,
	`active` boolean NOT NULL DEFAULT true,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `suppliers_id` PRIMARY KEY(`id`),
	CONSTRAINT `su_code` UNIQUE(`tenantId`,`code`)
);
--> statement-breakpoint
CREATE TABLE `taxes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`code` varchar(24) NOT NULL,
	`name` varchar(120) NOT NULL,
	`rate` double NOT NULL DEFAULT 0,
	`active` boolean NOT NULL DEFAULT true,
	CONSTRAINT `taxes_id` PRIMARY KEY(`id`),
	CONSTRAINT `tx_code` UNIQUE(`tenantId`,`code`)
);
--> statement-breakpoint
CREATE TABLE `tenant_users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`userId` int NOT NULL,
	`role` enum('owner','pharmacist','technician','accountant','purchase_manager','branch_manager','staff') NOT NULL DEFAULT 'staff',
	`branchId` int,
	`settings` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tenant_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `tu_tenant_user` UNIQUE(`tenantId`,`userId`)
);
--> statement-breakpoint
CREATE TABLE `tenants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`slug` varchar(80) NOT NULL,
	`currency` varchar(6) NOT NULL DEFAULT 'YER',
	`minExpiryDays` int NOT NULL DEFAULT 90,
	`settings` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tenants_id` PRIMARY KEY(`id`),
	CONSTRAINT `tenants_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `therapeutic_groups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`code` varchar(24) NOT NULL,
	`name` varchar(160) NOT NULL,
	`parentId` int,
	`active` boolean NOT NULL DEFAULT true,
	CONSTRAINT `therapeutic_groups_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `treasury_documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`kind` enum('receipt','payment') NOT NULL,
	`docNo` varchar(32) NOT NULL,
	`docDate` date NOT NULL,
	`cashAccountId` int NOT NULL,
	`partyKind` enum('customer','insurance','supplier','gl') NOT NULL,
	`partyId` int NOT NULL,
	`checkNo` varchar(40),
	`isCheck` boolean NOT NULL DEFAULT false,
	`total` bigint NOT NULL DEFAULT 0,
	`status` enum('draft','final','posted','cancelled') NOT NULL DEFAULT 'draft',
	`notes` text,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`postedAt` timestamp,
	CONSTRAINT `treasury_documents_id` PRIMARY KEY(`id`),
	CONSTRAINT `td_docno` UNIQUE(`tenantId`,`docNo`)
);
--> statement-breakpoint
CREATE TABLE `treasury_lines` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`documentId` int NOT NULL,
	`refKind` enum('sale_invoice','purchase_invoice','gl') NOT NULL,
	`refId` int NOT NULL,
	`amount` bigint NOT NULL DEFAULT 0,
	CONSTRAINT `treasury_lines_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `units` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`code` varchar(24) NOT NULL,
	`name` varchar(80) NOT NULL,
	`active` boolean NOT NULL DEFAULT true,
	CONSTRAINT `units_id` PRIMARY KEY(`id`),
	CONSTRAINT `un_code` UNIQUE(`tenantId`,`code`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE INDEX `al_tenant` ON `audit_logs` (`tenantId`);--> statement-breakpoint
CREATE INDEX `bt_item_store` ON `batches` (`tenantId`,`itemId`,`storeId`);--> statement-breakpoint
CREATE INDEX `bt_exp` ON `batches` (`tenantId`,`expDate`);--> statement-breakpoint
CREATE INDEX `btl_trf` ON `branch_transfer_lines` (`transferId`);--> statement-breakpoint
CREATE INDEX `icard_cust` ON `insurance_cards` (`customerId`);--> statement-breakpoint
CREATE INDEX `cl_inv` ON `insurance_claims` (`invoiceId`);--> statement-breakpoint
CREATE INDEX `ia_item` ON `item_alternatives` (`itemId`);--> statement-breakpoint
CREATE INDEX `je_src` ON `journal_entries` (`tenantId`,`sourceKind`,`refKind`,`refId`);--> statement-breakpoint
CREATE INDEX `jel_je` ON `journal_entry_lines` (`entryId`);--> statement-breakpoint
CREATE INDEX `rsl_rx` ON `prescription_lines` (`prescriptionId`);--> statement-breakpoint
CREATE INDEX `pil_inv` ON `purchase_invoice_lines` (`invoiceId`);--> statement-breakpoint
CREATE INDEX `pi_date` ON `purchase_invoices` (`tenantId`,`docDate`);--> statement-breakpoint
CREATE INDEX `pol_ord` ON `purchase_order_lines` (`orderId`);--> statement-breakpoint
CREATE INDEX `prl_ret` ON `purchase_return_lines` (`returnId`);--> statement-breakpoint
CREATE INDEX `sil_inv` ON `sale_invoice_lines` (`invoiceId`);--> statement-breakpoint
CREATE INDEX `si_date` ON `sale_invoices` (`tenantId`,`docDate`);--> statement-breakpoint
CREATE INDEX `scl_cnt` ON `stock_count_lines` (`countId`);--> statement-breakpoint
CREATE INDEX `sm_item` ON `stock_movements` (`tenantId`,`itemId`);--> statement-breakpoint
CREATE INDEX `sm_ref` ON `stock_movements` (`tenantId`,`refKind`,`refId`);--> statement-breakpoint
CREATE INDEX `tl_doc` ON `treasury_lines` (`documentId`);