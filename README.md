# MS Pay 💳

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-In%20Development-orange.svg)
![React PWA](https://img.shields.io/badge/Frontend-React_PWA-61DAFB.svg)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933.svg)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1.svg)

**MS Pay** is a robust, closed-loop digital wallet built directly into the MS Business Operating System (BOS). Designed for maximum checkout speed and reliability, it allows consumers to make instant, secure payments at participating merchants **without needing a smartphone, app, or active internet connection** at the point of sale.

---

## 🚀 Key Features

*   **Hybrid Offline Architecture:** Merchant POS terminals can seamlessly process transactions even during internet outages, queuing them locally via IndexedDB and automatically syncing them to the central ledger when connectivity is restored.
*   **Frictionless Checkout:** Consumers only need a static printed QR code (or Wallet ID) and their secret 4-digit PIN. No app downloads or mobile data required.
*   **Secure Offline Guardrails:** The POS securely enforces an "Offline Spending Limit" (e.g., max ₹200) by caching hashed balance metrics, preventing debt accumulation during network downtime.
*   **Masked Authentication:** Custom, secure POS keypad designs ensure the consumer's PIN is fully masked, eliminating shoulder-surfing risks.
*   **Unified PWA Ecosystem:** A single React Progressive Web App (PWA) housing three distinct environments: Customer Portal, Merchant POS, and Admin Ledger.

---

## 🏗️ System Architecture

MS Pay utilizes a modern, robust tech stack designed to ensure financial data integrity and offline resilience.

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend UI** | React (Vite), TypeScript | A unified PWA delivering distinct experiences for Customers, Merchants, and Admins. |
| **Offline Engine** | Service Workers, Dexie.js | Leverages IndexedDB for secure local queuing of offline transactions on the Merchant POS. |
| **Backend API** | Node.js (Express), TypeScript | A central API responsible for ledger management, PIN verification, and batch sync processing. |
| **Database** | PostgreSQL | Strictly ACID-compliant relational database to guarantee the integrity of the financial ledger. |

---

## 🔄 Core Workflows

### 1. The Online Checkout (Standard)
1. Merchant scans the consumer's static QR code via the POS.
2. Merchant enters the transaction amount.
3. Consumer enters their secure PIN on the merchant's screen.
4. The POS verifies the transaction with the backend in real-time, deducting the points and generating a receipt.

### 2. The Hybrid Offline Checkout (Network Down)
1. Merchant scans the QR code; the POS detects the network is offline.
2. The POS references its local encrypted cache to verify the user is within the **Offline Spending Limit**.
3. Consumer enters their PIN (hashed and stored locally).
4. The transaction is approved locally and placed in the **Sync Queue**. The queue keeps moving!

### 3. The Background Sync (Network Restored)
1. The Service Worker detects restored connectivity.
2. The POS automatically pushes the `PENDING_SYNC` queue to the backend.
3. The backend strictly validates PINs and settles the central ledger.

---

## 🛠️ Getting Started (Development)

> **Note:** The codebase is currently undergoing initial scaffolding.

### Prerequisites
- Node.js (v18+)
- PostgreSQL installed and running

### Installation (Coming Soon)
```bash
# Clone the repository
git clone https://github.com/sumitrawat2417/ms-pay.git

# Navigate to the project directory
cd ms-pay

# Install Frontend dependencies
cd frontend && npm install

# Install Backend dependencies
cd ../backend && npm install
```

## 🔐 Security & Fraud Prevention
*   **No PIN, No Sale:** A cloned QR code is useless without the user's secret passcode.
*   **Encrypted Local Storage:** All queued offline transactions are encrypted on the merchant's device, preventing tampering before synchronization.

---
*Developed for MS BOS.*
