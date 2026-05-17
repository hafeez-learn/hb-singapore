import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ArrowDownLeft, QrCode, MoreHorizontal, ChevronRight, RefreshCw } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const MOCK_BALANCE = 24530.55
const MOCK_ACCOUNT = { type: 'Savings Account', number: '****4521', balance: MOCK_BALANCE }

const MOCK_TRANSACTIONS = [
  { id: '1', type: 'debit', category: 'dining', description: 'Toast Box', amount: -8.50, date: 'Today, 10:42 AM' },
  { id: '2', type: 'credit', category: 'salary', description: 'Salary Credit', amount: 5200.00, date: 'Today, 9:00 AM' },
  { id: '3', type: 'debit', category: 'transport', description: 'EZ-Link Top-up', amount: -30.00, date: 'Yesterday, 6:15 PM' },
  { id: '4', type: 'debit', category: 'shopping', description: 'Shopee', amount: -124.90, date: 'Yesterday, 2:30 PM' },
  { id: '5', type: 'debit', category: 'bills', description: 'SP Services', amount: -189.00, date: '15 May, 10:00 AM' },
]

const quickActions = [
  { icon: ArrowUpRight, label: 'Transfer', to: '/transfer', color: 'bg-blue-50 text-blue-600' },
  { icon: QrCode, label: 'QR Pay', to: '/qrpay', color: 'bg-green-50 text-uob-green' },
  { icon: RefreshCw, label: 'Pay', to: '/transfer', color: 'bg-purple-50 text-purple-600' },
  { icon: MoreHorizontal, label: 'More', to: '/cards', color: 'bg-orange-50 text-orange-500' },
]

const categoryIcons = {
  dining: '🍜', salary: '💰', transport: '🚌', shopping: '🛒', bills: '📄', default: '💳'
}

export default function Home() {
  const { user } = useAuth()
  const [balance, setBalance] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  const loadData = () => {
    setTimeout(() => {
      setBalance(MOCK_BALANCE)
      setTransactions(MOCK_TRANSACTIONS)
    }, 800)
  }

  useEffect(() => { loadData() }, [])

  const onRefresh = () => {
    setRefreshing(true)
    setBalance(null)
    setTransactions([])
    setTimeout(() => { loadData(); setRefreshing(false) }, 1200)
  }

  const formatAmount = (amt) => new Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD' }).format(Math.abs(amt))

  return (
    <div className="animate-fade-slide-up">
      {/* Header */}
      <div className="bg-uob-green px-5 pt-10 pb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-green-200 text-sm">Good morning,</p>
            <h1 className="text-white text-xl font-bold">{user?.displayName || user?.email?.split('@')[0] || 'Welcome'}</h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold text-sm">
            {(user?.displayName || user?.email || 'U').charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-5">
          <p className="text-green-200 text-sm mb-1">Total Balance</p>
          {balance === null ? (
            <div className="skeleton h-9 w-48 mb-1" />
          ) : (
            <h2 className="text-white text-3xl font-bold font-mono">
              {formatAmount(balance)}
            </h2>
          )}
          <div className="flex items-center justify-between mt-3">
            <div>
              <p className="text-green-200 text-xs">{MOCK_ACCOUNT.type}</p>
              <p className="text-white text-sm font-medium">{MOCK_ACCOUNT.number}</p>
            </div>
            <button onClick={onRefresh} className={`p-2 rounded-full bg-white/10 ${refreshing ? 'animate-spin' : ''}`}>
              <RefreshCw size={18} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 py-5 space-y-5">
        {/* Quick Actions */}
        <div className="flex justify-between">
          {quickActions.map(({ icon: Icon, label, to, color }) => (
            <Link key={label} to={to} className="flex flex-col items-center gap-2">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}>
                <Icon size={22} strokeWidth={1.5} />
              </div>
              <span className="text-xs font-medium text-gray-700">{label}</span>
            </Link>
          ))}
        </div>

        {/* Account Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Your Accounts</h3>
            <button className="text-uob-green text-sm font-medium">Manage</button>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-uob-green to-uob-green-dark flex items-center justify-center">
              <span className="text-white font-bold text-lg">S$</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{MOCK_ACCOUNT.type}</p>
              <p className="text-gray-500 text-sm">{MOCK_ACCOUNT.number}</p>
            </div>
            <p className="font-mono font-semibold text-gray-900">
              {balance === null ? <span className="skeleton inline-block h-5 w-24" /> : formatAmount(MOCK_ACCOUNT.balance)}
            </p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
            <Link to="/history" className="flex items-center gap-1 text-uob-green text-sm font-medium">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="space-y-4">
            {transactions.length === 0 ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="skeleton w-10 h-10 rounded-full" />
                  <div className="flex-1"><div className="skeleton h-4 w-32 mb-1" /><div className="skeleton h-3 w-20" /></div>
                  <div className="skeleton h-4 w-16" />
                </div>
              ))
            ) : (
              transactions.map(tx => (
                <div key={tx.id} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${tx.type === 'credit' ? 'bg-green-50' : 'bg-gray-50'}`}>
                    {tx.type === 'credit' ? <ArrowDownLeft size={18} className="text-success" /> : <ArrowUpRight size={18} className="text-gray-400" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{tx.description}</p>
                    <p className="text-xs text-gray-500">{tx.date}</p>
                  </div>
                  <p className={`font-mono font-semibold text-sm ${tx.amount > 0 ? 'text-success' : 'text-gray-900'}`}>
                    {tx.amount > 0 ? '+' : ''}{formatAmount(tx.amount)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}