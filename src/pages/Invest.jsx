import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, TrendingUp, TrendingDown, RefreshCw, BarChart2 } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'

const MOCK_HOLDINGS = [
  { symbol: 'DBS', name: 'DBS Group Holdings', shares: 100, avgCost: 32.50, currentPrice: 35.80, sector: 'Bank' },
  { symbol: 'OCBC', name: 'OCBC Bank', shares: 150, avgCost: 12.80, currentPrice: 13.45, sector: 'Bank' },
  { symbol: 'UOB', name: 'United Overseas Bank', shares: 80, avgCost: 28.20, currentPrice: 31.10, sector: 'Bank' },
  { symbol: 'Singtel', name: 'Singapore Telecommunications', shares: 200, avgCost: 3.20, currentPrice: 2.95, sector: 'Telecom' },
  { symbol: 'Keppel', name: 'Keppel Corporation', shares: 50, avgCost: 7.80, currentPrice: 8.25, sector: 'Conglomerate' },
]

const MOCK_HISTORY = [
  { month: 'Jan', value: 42800 },
  { month: 'Feb', value: 43200 },
  { month: 'Mar', value: 41800 },
  { month: 'Apr', value: 44100 },
  { month: 'May', value: 45200 },
  { month: 'Jun', value: 44500 },
]

const INDICES = [
  { name: 'STI', value: '3,287.45', change: '+0.82%', up: true },
  { name: 'DBS', value: '35.80', change: '+1.12%', up: true },
  { name: 'OCBC', value: '13.45', change: '+0.67%', up: true },
  { name: 'UOB', value: '31.10', change: '-0.32%', up: false },
]

export default function Invest() {
  const [tab, setTab] = useState('portfolio') // portfolio | history

  const totalValue = MOCK_HOLDINGS.reduce((acc, h) => acc + h.shares * h.currentPrice, 0)
  const totalCost = MOCK_HOLDINGS.reduce((acc, h) => acc + h.shares * h.avgCost, 0)
  const totalGain = totalValue - totalCost
  const totalGainPct = ((totalGain / totalCost) * 100).toFixed(2)
  const todayGain = MOCK_HOLDINGS.reduce((acc, h) => acc + h.shares * h.currentPrice * 0.008, 0)

  const formatCurrency = (v) => new Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD' }).format(v)

  return (
    <div className="animate-fade-slide-up">
      <div className="bg-uob-green px-5 pt-10 pb-5">
        <div className="flex items-center gap-3 mb-4">
          <Link to="/" className="p-2 -ml-2 rounded-lg text-white/70 hover:bg-white/10"><ArrowLeft size={20} /></Link>
          <h1 className="text-lg font-bold text-white">Invest</h1>
        </div>

        {/* Market Ticker */}
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
          {INDICES.map(idx => (
            <div key={idx.name} className="flex-shrink-0 bg-white/10 rounded-xl px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="text-white/70 text-xs font-medium">{idx.name}</span>
                {idx.up ? <TrendingUp size={12} className="text-green-300" /> : <TrendingDown size={12} className="text-red-300" />}
              </div>
              <p className="text-white font-mono font-semibold text-sm">{idx.value}</p>
              <p className={`text-xs ${idx.up ? 'text-green-300' : 'text-red-300'}`}>{idx.change}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-5 space-y-4">
        {/* Portfolio Summary */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Total Portfolio Value</p>
          <h2 className="text-2xl font-bold font-mono text-gray-900 mb-3">{formatCurrency(totalValue)}</h2>
          <div className="flex gap-6">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Today's</p>
              <p className={`text-sm font-semibold flex items-center gap-1 ${todayGain >= 0 ? 'text-success' : 'text-danger'}`}>
                {todayGain >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {formatCurrency(Math.abs(todayGain))}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Total Gain/Loss</p>
              <p className={`text-sm font-semibold ${totalGain >= 0 ? 'text-success' : 'text-danger'}`}>
                {totalGain >= 0 ? '+' : ''}{formatCurrency(totalGain)} ({totalGainPct}%)
              </p>
            </div>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
          {[['portfolio','Holdings'],['history','History']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${tab === id ? 'bg-white shadow text-uob-green' : 'text-gray-500'}`}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'portfolio' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {MOCK_HOLDINGS.map((h, i) => {
              const val = h.shares * h.currentPrice
              const cost = h.shares * h.avgCost
              const gain = val - cost
              const gainPct = ((gain / cost) * 100).toFixed(2)
              return (
                <div key={h.symbol} className={`p-4 flex items-center gap-3 ${i !== MOCK_HOLDINGS.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <div className="w-10 h-10 rounded-full bg-uob-green-light flex items-center justify-center font-bold text-uob-green text-sm">
                    {h.symbol.slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{h.symbol}</p>
                    <p className="text-xs text-gray-500">{h.shares} shares @ S${h.avgCost}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-semibold text-gray-900 text-sm">{formatCurrency(val)}</p>
                    <p className={`text-xs font-medium ${gain >= 0 ? 'text-success' : 'text-danger'}`}>
                      {gain >= 0 ? '+' : ''}{formatCurrency(gain)} ({gainPct}%)
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {tab === 'history' && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Portfolio History</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_HISTORY}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
                  <Tooltip formatter={v => [`S$${v.toLocaleString()}`, 'Value']} />
                  <Line type="monotone" dataKey="value" stroke="#007569" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}