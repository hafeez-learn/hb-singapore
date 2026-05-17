import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, User, Smartphone, Building2, CheckCircle } from 'lucide-react'

const TRANSFER_TYPES = [
  { id: 'uob', label: 'To UOB Account', icon: User, desc: 'Instant transfer to another UOB account' },
  { id: 'paynow', label: 'PayNow', icon: Smartphone, desc: 'Send money using mobile, email or NRIC' },
  { id: 'fast', label: 'Other Banks (FAST)', icon: Building2, desc: 'Interbank transfer via Singapore FAST network' },
]

const RECENT_BENEFICIARIES = [
  { name: 'Sarah Tan', number: '****8834', bank: 'UOB' },
  { name: 'John Lim', number: '****2291', bank: 'DBS' },
  { name: 'Maya Lee', number: '****7652', bank: 'OCBC' },
]

const BANKS = ['DBS', 'OCBC', 'UOB', 'Citibank', 'Maybank', 'Standard Chartered', 'HSBC']

export default function Transfer() {
  const [step, setStep] = useState('type') // type -> details -> confirm -> success
  const [transferType, setTransferType] = useState(null)
  const [form, setForm] = useState({ amount: '', toAccount: '', bank: 'DBS', reference: '' })
  const [showKeypad, setShowKeypad] = useState(false)

  const keypadKeys = ['1','2','3','4','5','6','7','8','9','.','0','⌫']

  const handleKeypad = (key) => {
    if (key === '⌫') { setForm(f => ({ ...f, amount: f.amount.slice(0,-1) })) }
    else if (key === '.' && form.amount.includes('.')) return
    else if (form.amount.includes('.') && form.amount.split('.')[1].length >= 2) return
    else setForm(f => ({ ...f, amount: f.amount + key }))
  }

  const handleTransfer = () => {
    if (parseFloat(form.amount) > 0) setStep('confirm')
  }

  const getFee = () => form.amount && parseFloat(form.amount) > 0 ? (transferType === 'uob' ? 'Free' : 'S$0.12') : '—'

  if (step === 'success') return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg px-6">
      <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-6">
        <CheckCircle size={40} className="text-success" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Transfer Initiated</h2>
      <p className="text-gray-500 text-center mb-1">S$ {form.amount}</p>
      <p className="text-gray-400 text-sm mb-8">Reference: TRF-{Date.now().toString().slice(-8)}</p>
      <Link to="/" className="w-full max-w-xs bg-uob-green text-white py-4 rounded-xl font-semibold text-center">
        Back to Home
      </Link>
    </div>
  )

  return (
    <div className="animate-fade-slide-up">
      {/* Header */}
      <div className="bg-white px-5 pt-10 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <Link to="/" className="p-2 -ml-2 rounded-lg hover:bg-gray-100"><ArrowLeft size={20} className="text-gray-700" /></Link>
          <h1 className="text-lg font-bold text-gray-900">Transfer Money</h1>
        </div>

        {step === 'type' && (
          <div className="space-y-3">
            {TRANSFER_TYPES.map(t => (
              <button key={t.id} onClick={() => { setTransferType(t.id); setStep('details') }}
                className="w-full flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-uob-green hover:bg-green-50 transition-colors text-left">
                <div className="w-12 h-12 rounded-xl bg-uob-green-light flex items-center justify-center">
                  <t.icon size={22} className="text-uob-green" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{t.label}</p>
                  <p className="text-xs text-gray-500">{t.desc}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {step === 'details' && (
        <div className="px-5 py-5 space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Amount to transfer</p>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-bold text-gray-900 font-mono">
                {form.amount || '0.00'}
              </span>
              <span className="text-gray-500">SGD</span>
            </div>
            <button onClick={() => setShowKeypad(true)} className="w-full py-3 bg-uob-green-light text-uob-green font-semibold rounded-xl">
              Tap to enter amount
            </button>
          </div>

          {transferType === 'uob' && (
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <p className="text-sm font-semibold text-gray-700 mb-3">Recent Beneficiaries</p>
              <div className="space-y-2">
                {RECENT_BENEFICIARIES.filter(b => b.bank === 'UOB').map(b => (
                  <button key={b.name} onClick={() => setForm(f => ({ ...f, toAccount: b.number }))}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-left">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600">
                      {b.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{b.name}</p>
                      <p className="text-xs text-gray-500">{b.number}</p>
                    </div>
                  </button>
                ))}
              </div>
              <input type="text" placeholder="Enter account number"
                value={form.toAccount} onChange={e => setForm(f => ({ ...f, toAccount: e.target.value }))}
                className="mt-3 w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-uob-green" />
            </div>
          )}

          {transferType === 'paynow' && (
            <div className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
              <p className="text-sm font-semibold text-gray-700">PayNow Details</p>
              <input type="text" placeholder="Mobile number / Email / NRIC"
                value={form.toAccount} onChange={e => setForm(f => ({ ...f, toAccount: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-uob-green" />
            </div>
          )}

          {transferType === 'fast' && (
            <div className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
              <p className="text-sm font-semibold text-gray-700">Bank Transfer Details</p>
              <select value={form.bank} onChange={e => setForm(f => ({ ...f, bank: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-uob-green bg-white">
                {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <input type="text" placeholder="Account number"
                value={form.toAccount} onChange={e => setForm(f => ({ ...f, toAccount: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-uob-green" />
            </div>
          )}

          <button onClick={handleTransfer}
            disabled={!form.amount || parseFloat(form.amount) <= 0}
            className="w-full bg-uob-green text-white py-4 rounded-xl font-semibold disabled:opacity-40 disabled:cursor-not-allowed">
            Continue
          </button>
        </div>
      )}

      {step === 'confirm' && (
        <div className="px-5 py-5 space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-sm font-semibold text-gray-900 mb-4">Review Transfer</p>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-mono font-semibold">S$ {form.amount}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Fee</span><span className="font-medium">{getFee()}</span></div>
              <div className="border-t pt-3 flex justify-between"><span className="text-gray-500">To</span><span className="font-medium">{form.toAccount || '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Type</span><span className="font-medium">{TRANSFER_TYPES.find(t => t.id === transferType)?.label}</span></div>
            </div>
          </div>
          <button onClick={() => setStep('success')} className="w-full bg-uob-green text-white py-4 rounded-xl font-semibold">
            Confirm Transfer
          </button>
          <button onClick={() => setStep('details')} className="w-full bg-white text-gray-700 py-4 rounded-xl font-semibold border border-gray-200">
            Edit Details
          </button>
        </div>
      )}

      {/* Numeric Keypad Bottom Sheet */}
      {showKeypad && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end" onClick={() => setShowKeypad(false)}>
          <div className="w-full max-w-md bg-white rounded-t-3xl p-5 pb-8" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            <div className="text-center mb-4">
              <p className="text-3xl font-bold font-mono text-gray-900">S$ {form.amount || '0.00'}</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {keypadKeys.map(k => (
                <button key={k} onClick={() => k !== '⌫' && handleKeypad(k)}
                  className="h-14 rounded-xl text-xl font-semibold bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                  dangerouslySetInnerHTML={{ __html: k === '⌫' ? '&#9003;' : k }} />
              ))}
            </div>
            <button onClick={() => setShowKeypad(false)} className="w-full mt-3 bg-uob-green text-white py-4 rounded-xl font-semibold">
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}