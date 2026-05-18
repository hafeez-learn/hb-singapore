import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Search, Filter, ArrowDownLeft, ArrowUpRight, CreditCard, RefreshCw, SlidersHorizontal } from 'lucide-react'

const MOCK_ALL = [
  { id: '1', type: 'credit', category: 'salary', description: 'Salary Credit — ST Engineering', amount: 5200.00, date: 'Today, 9:00 AM' },
  { id: '2', type: 'debit', category: 'dining', description: 'Toast Box Pte Ltd', amount: -8.50, date: 'Today, 10:42 AM' },
  { id: '3', type: 'debit', category: 'transfer', description: 'Transfer to Sarah Tan', amount: -500.00, date: 'Yesterday, 6:15 PM' },
  { id: '4', type: 'debit', category: 'transport', description: 'EZ-Link Top-up', amount: -30.00, date: 'Yesterday, 6:14 PM' },
  { id: '5', type: 'debit', category: 'shopping', description: 'Shopee Singapore', amount: -124.90, date: 'Yesterday, 2:30 PM' },
  { id: '6', type: 'credit', category: 'cashback', description: 'HB Cashback Rebate', amount: 15.00, date: '16 May, 12:00 AM' },
  { id: '7', type: 'debit', category: 'bills', description: 'SP Services', amount: -189.00, date: '15 May, 10:00 AM' },
  { id: '8', type: 'debit', category: 'bills', description: 'Starhub Mobile', amount: -42.50, date: '14 May, 9:00 AM' },
  { id: '9', type: 'debit', category: 'dining', description: 'McDonald\'s Singapore', amount: -18.70, date: '13 May, 1:30 PM' },
  { id: '10', type: 'credit', category: 'transfer', description: 'Transfer from John Lim', amount: 200.00, date: '12 May, 3:00 PM' },
  { id: '11', type: 'debit', category: 'shopping', description: 'Courts Singapore', amount: -349.00, date: '11 May, 11:00 AM' },
  { id: '12', type: 'debit', category: 'bills', description: 'PlandShield Home Insurance', amount: -89.90, date: '10 May, 10:00 AM' },
]

const FILTERS = ['All', 'Income', 'Expenses', 'Transfers', 'Card']

const CATEGORY_META = {
  salary: { icon: ArrowDownLeft, color: 'text-success bg-green-50', label: 'Income' },
  cashback: { icon: CreditCard, color: 'text-purple-600 bg-purple-50', label: 'Cashback' },
  transfer: { icon: RefreshCw, color: 'text-blue-600 bg-blue-50', label: 'Transfer' },
  dining: { icon: CreditCard, color: 'text-orange-500 bg-orange-50', label: 'Dining' },
  transport: { icon: CreditCard, color: 'text-blue-500 bg-blue-50', label: 'Transport' },
  shopping: { icon: CreditCard, color: 'text-pink-500 bg-pink-50', label: 'Shopping' },
  bills: { icon: CreditCard, color: 'text-gray-600 bg-gray-100', label: 'Bills' },
}

export default function History() {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setTransactions(MOCK_ALL)
      setLoading(false)
    }, 600)
  }, [])

  const filtered = transactions.filter(tx => {
    const matchesFilter = filter === 'All' || (filter === 'Income' && tx.type === 'credit') || (filter === 'Expenses' && tx.type === 'debit' && tx.category !== 'transfer') || (filter === 'Transfers' && tx.category === 'transfer') || (filter === 'Card' && ['dining','shopping','transport'].includes(tx.category))
    const matchesSearch = !search || tx.description.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const formatCurrency = (v) => new Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD' }).format(Math.abs(v))

  return (
    <div className="animate-fade-slide-up">
      <div className="bg-white px-5 pt-10 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <Link to="/" className="p-2 -ml-2 rounded-lg hover:bg-gray-100"><ArrowLeft size={20} className="text-gray-700" /></Link>
          <h1 className="text-lg font-bold text-gray-900">Transaction History</h1>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search transactions..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-uob-green" />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === f ? 'bg-uob-green text-white' : 'bg-gray-100 text-gray-600'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-4">
        <p className="text-xs text-gray-400 mb-3">{filtered.length} transactions</p>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-4">
                <div className="skeleton w-10 h-10 rounded-full" />
                <div className="flex-1"><div className="skeleton h-4 w-40 mb-1" /><div className="skeleton h-3 w-24" /></div>
                <div className="skeleton h-4 w-20" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 font-medium">No transactions found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(tx => {
              const meta = CATEGORY_META[tx.category] || CATEGORY_META.dining
              const Icon = meta.icon
              return (
                <div key={tx.id} className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm border border-gray-50">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${meta.color}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{tx.description}</p>
                    <p className="text-xs text-gray-500">{tx.date}</p>
                  </div>
                  <p className={`font-mono font-semibold text-sm ${tx.amount > 0 ? 'text-success' : 'text-gray-900'}`}>
                    {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}