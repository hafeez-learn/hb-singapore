import { NavLink, useLocation } from 'react-router-dom'
import { Home, ArrowLeftRight, CreditCard, TrendingUp, MoreHorizontal } from 'lucide-react'

const tabs = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/transfer', icon: ArrowLeftRight, label: 'Pay' },
  { to: '/cards', icon: CreditCard, label: 'Cards' },
  { to: '/invest', icon: TrendingUp, label: 'Invest' },
  { to: '/settings', icon: MoreHorizontal, label: 'More' },
]

export default function BottomNav() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 safe-bottom z-50">
      <div className="flex items-center justify-around h-[72px]">
        {tabs.map(({ to, icon: Icon, label }) => {
          const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)
          return (
            <NavLink
              key={to}
              to={to}
              className={`flex flex-col items-center justify-center gap-1 w-16 h-14 rounded-xl transition-all duration-150 ${
                isActive ? 'text-uob-green' : 'text-gray-400'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2 : 1.5} />
              <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>{label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}