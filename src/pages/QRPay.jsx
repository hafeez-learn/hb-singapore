import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Share2, Download, Camera, Flashlight, X } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

export default function QRPay() {
  const [tab, setTab] = useState('generate') // generate | scan
  const [amount, setAmount] = useState('')
  const [expiry, setExpiry] = useState(3600) // seconds
  const [qrValue, setQrValue] = useState('')
  const [showScanner, setShowScanner] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const [scanned, setScanned] = useState(null)
  const scannerRef = useRef(null)
  const timerRef = useRef(null)

  const generateQR = () => {
    if (!amount || parseFloat(amount) <= 0) return
    const payload = {
      hb: true,
      amount: parseFloat(amount),
      from: 'HB MIGHTY',
      ref: `QR${Date.now().toString().slice(-8)}`,
      expiry: Date.now() + expiry * 1000,
    }
    setQrValue(JSON.stringify(payload))
  }

  useEffect(() => {
    if (qrValue && expiry > 0) {
      timerRef.current = setInterval(() => {
        setExpiry(prev => {
          if (prev <= 1) { clearInterval(timerRef.current); return 0 }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [qrValue])

  const startScanner = async () => {
    setShowScanner(true)
    setCameraActive(true)
  }

  const stopScanner = () => {
    setCameraActive(false)
    if (scannerRef.current) {
      scannerRef.current.stop().catch(() => {})
    }
  }

  useEffect(() => {
    if (showScanner && cameraActive) {
      import('html5-qrcode').then(({ Html5Qrcode }) => {
        const scanner = new Html5Qrcode('qr-reader')
        scannerRef.current = scanner
        scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: 250 },
          (decoded) => {
            try {
              setScanned(JSON.parse(decoded))
              stopScanner()
            } catch { setScanned({ raw: decoded }) }
          },
          () => {}
        ).catch(() => {})
      })
    }
    return () => stopScanner()
  }, [showScanner, cameraActive])

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60), s = secs % 60
    return `${m}:${s.toString().padStart(2,'0')}`
  }

  const progress = Math.max(0, expiry / (qrValue ? (JSON.parse(qrValue).expiry - Date.now()) / 1000 : 3600)) * 100

  return (
    <div className="animate-fade-slide-up">
      <div className="bg-white px-5 pt-10 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 -ml-2 rounded-lg hover:bg-gray-100"><ArrowLeft size={20} className="text-gray-700" /></Link>
            <h1 className="text-lg font-bold text-gray-900">QR Pay</h1>
          </div>
        </div>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
          {[['generate','Generate'],['scan','Scan']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${tab === id ? 'bg-white shadow text-uob-green' : 'text-gray-500'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-5">
        {tab === 'generate' && (
          <div className="space-y-4">
            {!qrValue ? (
              <>
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Amount</p>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-sm text-gray-500">SGD</span>
                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="text-3xl font-bold font-mono text-gray-900 bg-transparent focus:outline-none w-full"
                    />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Expiry</p>
                  <div className="flex gap-2">
                    {[[3600,'1 Hour'],[21600,'6 Hours'],[86400,'24 Hours']].map(([sec, label]) => (
                      <button key={sec} onClick={() => setExpiry(sec)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${expiry === sec ? 'bg-uob-green text-white border-uob-green' : 'bg-white text-gray-600 border-gray-200'}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={generateQR}
                  disabled={!amount || parseFloat(amount) <= 0}
                  className="w-full bg-uob-green text-white py-4 rounded-xl font-semibold disabled:opacity-40">
                  Generate QR Code
                </button>
              </>
            ) : (
              <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
                <div className="relative inline-block mb-4">
                  <div className="p-4 bg-white rounded-2xl border border-gray-200">
                    <QRCodeSVG value={qrValue} size={200} level="H" includeMargin />
                  </div>
                  {expiry > 0 && (
                    <div className="absolute -top-2 -right-2 w-12 h-12">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        <circle cx="18" cy="18" r="16" fill="none" stroke="#E5E7EB" strokeWidth="3" />
                        <circle cx="18" cy="18" r="16" fill="none" stroke="#007569" strokeWidth="3"
                          strokeDasharray={`${progress * 1.005} 100.5`} strokeLinecap="round" />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-uob-green">
                        {formatTime(expiry)}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-1">Amount</p>
                <p className="text-2xl font-bold font-mono text-gray-900 mb-4">S$ {amount}</p>
                <div className="flex gap-3 justify-center">
                  <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium">
                    <Download size={16} /> Save
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium">
                    <Share2 size={16} /> Share
                  </button>
                </div>
                <button onClick={() => { setQrValue(''); setAmount(''); setExpiry(3600) }}
                  className="mt-4 text-sm text-uob-green font-medium">Generate New QR</button>
              </div>
            )}
          </div>
        )}

        {tab === 'scan' && !showScanner && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <div className="w-20 h-20 rounded-full bg-uob-green-light flex items-center justify-center mx-auto mb-4">
                <Camera size={36} className="text-uob-green" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Scan QR Code</h3>
              <p className="text-sm text-gray-500 mb-6">Point your camera at a QR code to pay</p>
              <button onClick={startScanner} className="w-full bg-uob-green text-white py-4 rounded-xl font-semibold">
                Open Camera
              </button>
            </div>

            {scanned && (
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <p className="text-sm font-semibold text-gray-700 mb-3">Scanned Result</p>
                <pre className="text-xs font-mono text-gray-600 bg-gray-50 p-3 rounded-lg overflow-x-auto">
                  {JSON.stringify(scanned, null, 2)}
                </pre>
                <button onClick={() => setScanned(null)} className="mt-3 text-sm text-uob-green font-medium">Scan Again</button>
              </div>
            )}
          </div>
        )}

        {tab === 'scan' && showScanner && (
          <div className="space-y-4">
            <div className="bg-black rounded-2xl overflow-hidden relative" style={{ minHeight: 400 }}>
              <div id="qr-reader" className="w-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border-2 border-uob-green rounded-2xl" />
              </div>
              <button onClick={() => { stopScanner(); setShowScanner(false) }}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">
                <X size={20} className="text-white" />
              </button>
            </div>
            {scanned && (
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <p className="text-sm font-semibold text-gray-700 mb-2">Payment Details</p>
                {scanned.amount && <p className="text-2xl font-bold font-mono text-gray-900">S$ {scanned.amount}</p>}
                {scanned.ref && <p className="text-sm text-gray-500 mt-1">Ref: {scanned.ref}</p>}
                <button className="mt-4 w-full bg-uob-green text-white py-4 rounded-xl font-semibold">
                  Pay Now
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}