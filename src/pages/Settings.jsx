import { Link } from 'react-router-dom'
import { ArrowLeft, Bell, Shield, User, HelpCircle, LogOut, ChevronRight, Smartphone } from 'lucide-react'

const SETTINGS = [
  {
    group: 'Account',
    items: [
      { icon: User, label: 'Profile', desc: 'Name, email, phone number' },
      { icon: Smartphone, label: 'Connected Devices', desc: 'Manage trusted devices' },
    ]
  },
  {
    group: 'Security',
    items: [
      { icon: Shield, label: 'Security Settings', desc: 'Password, 2FA, biometric login' },
      { icon: Bell, label: 'Notifications', desc: 'Alerts and push notifications' },
    ]
  },
  {
    group: 'Support',
    items: [
      { icon: HelpCircle, label: 'Help & FAQ', desc: 'FAQs and customer support' },
    ]
  },
]

export default function Settings() {
  const { logout } = {}

  return (
    <div className="animate-fade-slide-up">
      <div className="bg-white px-5 pt-10 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <Link to="/" className="p-2 -ml-2 rounded-lg hover:bg-gray-100"><ArrowLeft size={20} className="text-gray-700" /></Link>
          <h1 className="text-lg font-bold text-gray-900">More</h1>
        </div>
      </div>

      <div className="px-5 py-5 space-y-5">
        {SETTINGS.map(group => (
          <div key={group.group}>
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2 px-1">{group.group}</p>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {group.items.map((item, i) => (
                <button key={item.label}
                  className={`w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 transition-colors ${i !== group.items.length - 1 ? 'border-b border-gray-50' : ''}`}>
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                    <item.icon size={20} className="text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-300" />
                </button>
              ))}
            </div>
          </div>
        ))}

        <button className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 text-left hover:bg-red-50 transition-colors group">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <LogOut size={20} className="text-danger" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-danger text-sm">Log Out</p>
          </div>
        </button>

        <p className="text-center text-xs text-gray-400 pt-2">HB Singapore Demo v1.0.0</p>
      </div>
    </div>
  )
}