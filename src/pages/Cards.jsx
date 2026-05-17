import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Plus, Snowflake, Eye, EyeOff, CreditCard, TrendingUp, Utensils, Bus, ShoppingBag, FileText, HelpCircle } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const MOCK_CARDS = [
  { id: '1', type: 'physical', name: 'UOB Lady\'s Card', last4: '8821', expiry: '09/27', frozen: false, limit: 5000, spent: 1234.56, color: '#007569' },
  { id: '2', type: 'virtual', name: 'UOB Virtual Card', last4: '3341', expiry: '12/26', frozen: false, limit: 1000, spent: 230.00, color: '#1A1F36' },
  { id: '3', type: 'physical', name: 'UOB Pride Card', last4: '5509', expiry: '03/28', frozen: true, limit: 3000, spent: 890.20, color: '#C4A84B' },
]

const SPENDING = [
  { category: 'Dining', icon: Utensils, amount: 423.50, color: '#F59E0B', pct: 34 },
  { category: 'Transport', icon: Bus, amount: 124.00, color: '#3B82F6', pct: 10 },
  { category: 'Shopping', icon: ShoppingBag, amount: 512.80, color: '#EC4899', pct: 41 },
  { category: 'Bills', icon: FileText, amount: 189.00, color: '#8B5CF6', pct: 15 },
]

export default function Cards() {
  const [cards, setCards] = useState(MOCK_CARDS)
  const [showNum, setShowNum] = useState({})
  const [selectedCard, setSelectedCard] = useState(null)

  const toggleFreeze = (id) => setCards(cs => cs.map(c => c.id === id ? { ...c, frozen: !c.frozen } : c))
  const toggleShow = (id) => setShowNum(s => ({ ...s, [id]: !s[id] }))

  return (
    <div className="animate-fade-slide-up">
      <div className="bg-white px-5 pt-10 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 -ml-2 rounded-lg hover:bg-gray-100"><ArrowLeft size={20} className="text-gray-700" /></Link>
            <h1 className="text-lg font-bold text-gray-900">My Cards</h1>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-uob-green text-white text-sm font-semibold rounded-xl">
            <Plus size={16} /> Add Card
          </button>
        </div>
      </div>

      <div className="px-5 py-5 space-y-5">
        {/* Cards List */}
        {cards.map(card => (
          <div key={card.id} className="relative">
            <div
              onClick={() => setSelectedCard(card)}
              className="rounded-2xl p-5 text-white cursor-pointer shadow-md"
              style={{ background: `linear-gradient(135deg, ${card.color} 0%, ${card.color}CC 100%)` }}
            >
              {card.frozen && (
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                  <div className="flex items-center gap-2 text-white/80">
                    <Snowflake size={24} /><span className="font-semibold">Card Frozen</span>
                  </div>
                </div>
              )}
              <div className="flex items-start justify-between mb-8">
                <p className="font-semibold text-white/90 text-sm">{card.name}</p>
                <div className="w-10 h-7 rounded bg-white/20 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-white">UOB</span>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <CreditCard size={24} className="text-white/70" />
                <span className="font-mono text-lg tracking-wider">
                  {showNum[card.id] ? `4412 ${card.last4}` : `•••• •••• •••• ${card.last4}`}
                </span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-white/50 text-[10px] mb-0.5">EXPIRES</p>
                  <p className="font-mono text-sm">{card.expiry}</p>
                </div>
                <button onClick={e => { e.stopPropagation(); toggleShow(card.id) }}
                  className="p-2 rounded-lg bg-white/10">
                  {showNum[card.id] ? <EyeOff size={16} className="text-white/70" /> : <Eye size={16} className="text-white/70" />}
                </button>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => toggleFreeze(card.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border ${card.frozen ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                <Snowflake size={14} /> {card.frozen ? 'Unfreeze' : 'Freeze'}
              </button>
              <button className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-gray-50 text-gray-600 border border-gray-200">
                Details
              </button>
            </div>
          </div>
        ))}

        {/* Spending Summary */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Spending This Month</h3>
            <TrendingUp size={18} className="text-gray-400" />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-32 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={SPENDING} cx="50%" cy="50%" innerRadius={38} outerRadius={60} dataKey="amount" strokeWidth={0}>
                    {SPENDING.map((s, i) => <Cell key={i} fill={s.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => `S$${v.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {SPENDING.map(s => (
                <div key={s.category} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="text-xs text-gray-600 flex-1">{s.category}</span>
                  <span className="text-xs font-mono font-medium text-gray-900">S${s.amount.toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}