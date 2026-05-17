# UOB Singapore Banking App — Specification

## 1. Concept & Vision

A mobile-first Singapore banking app inspired by UOB Mighty, capturing the calm confidence of a trusted bank. Clean, professional, and quietly premium — not flashy. Feels like holding a well-made physical card: solid, reliable, no noise.

## 2. Design Language

### Aesthetic Direction
Corporate minimalism meets warm trust. UOB green anchors the palette. White card surfaces float over subtle gray backgrounds. Dense information presented with clear hierarchy. No gradients on large areas — subtle depth through shadow and layering only.

### Color Palette
```
--uob-green:      #007569   /* Primary — UOB's heritage green */
--uob-green-dark: #005A51   /* Pressed states */
--uob-green-light:#E8F5F3   /* Light backgrounds */
--uob-gold:       #C4A84B   /* Accent — Wealth pages */
--bg-gray:        #F4F6F8   /* Page background */
--card-white:     #FFFFFF
--text-primary:   #1A1F36   /* Near-black */
--text-secondary: #6B7280   /* Gray */
--text-muted:     #9CA3AF
--danger:         #DC2626   /* Alerts, negative amounts */
--success:        #16A34A   /* Positive amounts */
--border:         #E5E7EB
```

### Typography
- **Primary Font:** `Plus Jakarta Sans` (Google Fonts) — modern, legible at all sizes
- **Monospace (numbers/amounts):** `DM Mono` — clean, distinctive for figures
- **Fallback:** `system-ui, -apple-system, sans-serif`

### Spatial System
- Base unit: 4px
- Card padding: 20px
- Section gaps: 24px
- Border radius: 12px (cards), 8px (buttons), 24px (pills)
- Bottom nav height: 72px

### Motion Philosophy
- Subtle: 150ms ease-out for micro-interactions (no entrance animations)
- Page transitions: 200ms ease-in-out slide
- Loading: skeleton shimmer (#E5E7EB → #F9FAFB)
- Bottom sheet: 300ms cubic-bezier(0.32, 0.72, 0, 1)

### Visual Assets
- Icons: Lucide React (stroke-width 1.5, 24px default)
- Card art: CSS gradient with bank logo text
- No images — icon-first UI

## 3. Layout & Structure

```
┌──────────────────────────────┐
│  Header (bank name + avatar) │
├──────────────────────────────┤
│                              │
│  Page Content (scrollable)   │
│                              │
├──────────────────────────────┤
│  Bottom Navigation (5 tabs)  │
└──────────────────────────────┘
```

### Bottom Navigation Tabs
1. **Home** — Account Summary
2. **Pay** — Transfer + QR Pay
3. **Cards** — Card Management
4. **Invest** — Portfolio
5. **More** — Settings / Help

### Pages
- `/` → Account Summary (default)
- `/transfer` → Transfer Money
- `/qrpay` → QR Pay
- `/cards` → Card Management
- `/invest` → Investment Portfolio
- `/history` → Transaction History
- `/settings` → Settings
- `/login` → Login
- `/signup` → Sign Up

## 4. Features & Interactions

### 4.1 Authentication
- Email + Password via Firebase Auth
- Auto-login on return (onAuthStateChanged)
- Logout clears local state, redirects to login

### 4.2 Account Summary (Home)
- **Total Balance Card** — large DM Mono number, SGD label, account nickname
- **Quick Actions Row** — Pay, Transfer, QR Pay, More (icon buttons)
- **Primary Account** — savings account card with account number (masked: ****1234)
- **Recent Transactions** — last 5, "View All" link to History
- Pull-to-refresh (skeleton → data)

### 4.3 Transfer Money
- **To UOB Account** — select from saved beneficiaries or enter new
- **To Other Bank (PayNow)** — enter mobile/email/NRIC + amount
- **To Singapore Bank (FAST)** — bank dropdown, account number, amount
- Amount input: large numeric keypad style
- Confirmation screen with masked recipient, amount, and fee
- Success state with reference number

### 4.4 QR Pay
- **Generate QR** — amount entry, expiry toggle (1hr/6hr/custom), animated QR display
- **Scan QR** — camera viewfinder overlay, detect UOB/PayNow QR codes
- QR contains: payment info, amount (optional), expiry

### 4.5 Cards
- **My Cards List** — physical + virtual cards side by side
- **Card Detail** — card number (tap to reveal), CVV, expiry, freeze/unfreeze toggle
- **Virtual Card Creation** — name, limit, expiry
- **Spending by Category** — donut chart (dining, transport, shopping, bills, other)

### 4.6 Investment Portfolio
- **Holdings List** — symbol, shares, current price, P&L (colored)
- **Portfolio Summary** — total value, today's gain/loss, overall gain/loss
- **Market Ticker** — top SGX indices at top
- Mock data (no live API for demo)

### 4.7 Transaction History
- Full list with infinite scroll (paginate 20 at a time)
- Each row: icon (category), description, date, amount (colored)
- Filter by: All, Income, Expenses, Transfers, Card
- Search by description

### 4.8 Settings
- Profile (name, email, phone)
- Notification preferences
- Security (change password, 2FA toggle)
- About / Help

## 5. Component Inventory

### BalanceCard
- Large green-gradient card, white text
- Amount in DM Mono 32px bold
- Account type label + masked account number
- States: loading (skeleton), loaded, error

### QuickActionButton
- Icon + label, 64px circle or rounded square
- Default: white bg, subtle border shadow
- Pressed: scale(0.95), green bg tint
- Disabled: opacity 0.5

### TransactionRow
- Category icon (left), description + date (center), amount (right)
- Amount: green for credit, red for debit
- Hover: subtle bg highlight

### CardItem
- Card art (CSS gradient, UOB green base), card name, last 4 digits
- Tap → CardDetail bottom sheet
- Freeze toggle with ice-blue tint when frozen

### AmountInput
- Large DM Mono display, numeric keypad below
- Currency prefix "SGD"
- Max: configurable, formatted with commas

### QRDisplay
- White card with QR code (qrcode.react)
- Timer countdown ring (animated SVG stroke)
- Share button

### BottomNavBar
- 5 tabs, icon + label
- Active: UOB green icon, bold label
- Inactive: gray icon + label
- Safe area padding at bottom

### BottomSheet
- Slide up from bottom, backdrop blur
- Drag handle at top
- Close on backdrop click or swipe down

## 6. Technical Approach

### Stack
- **Frontend:** React 18 + Vite + TailwindCSS
- **Backend:** Firebase Auth + Firestore (no backend code — direct SDK calls)
- **Hosting:** GitHub Pages (hafeez-learn.github.io/uob-sim)
- **QR:** `qrcode.react` (generate), `html5-qrcode` (scan)
- **Routing:** `react-router-dom` v6
- **State:** React Context + useReducer (no Redux)
- **Charts:** `recharts` for donut chart

### Data Model (Firestore)

```
users/{uid}
  - displayName: string
  - email: string
  - phone: string
  - createdAt: timestamp

users/{uid}/accounts/{accountId}
  - type: "savings" | "current" | "multiplier"
  - balance: number
  - accountNumber: string (masked in UI)
  - currency: "SGD"
  - isPrimary: boolean

users/{uid}/transactions/{transactionId}
  - type: "credit" | "debit" | "transfer"
  - category: string
  - description: string
  - amount: number
  - date: timestamp
  - fromAccount: string
  - toAccount: string

users/{uid}/cards/{cardId}
  - type: "physical" | "virtual"
  - last4: string
  - expiry: string (MM/YY)
  - frozen: boolean
  - limit: number
  - name: string
  - color: string (hex)

users/{uid}/investments/{holdingId}
  - symbol: string
  - name: string
  - shares: number
  - avgCost: number
  - currentPrice: number
```

### Firebase Setup
1. Create project in Firebase Console
2. Enable Email/Password Auth
3. Create Firestore in test mode (enable after setup)
4. Copy config to `src/lib/firebase.js`

### Build & Deploy
- Vite builds to `dist/`
- Files copied to repo root (GitHub Pages serves from root)
- Asset filenames: static (not hashed) for instant CDN propagation

### File Structure
```
uob-sim/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── .env.example
├── public/
│   └── _redirects           (for SPA routing)
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── lib/
│   │   └── firebase.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── components/
│   │   ├── BottomNav.jsx
│   │   ├── BalanceCard.jsx
│   │   ├── QuickActionButton.jsx
│   │   ├── TransactionRow.jsx
│   │   ├── CardItem.jsx
│   │   ├── AmountInput.jsx
│   │   ├── QRDisplay.jsx
│   │   └── BottomSheet.jsx
│   └── pages/
│       ├── Home.jsx
│       ├── Transfer.jsx
│       ├── QRPay.jsx
│       ├── Cards.jsx
│       ├── Invest.jsx
│       ├── History.jsx
│       ├── Settings.jsx
│       ├── Login.jsx
│       └── Signup.jsx
```