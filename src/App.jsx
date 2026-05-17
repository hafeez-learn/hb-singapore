import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Home from './pages/Home'
import Transfer from './pages/Transfer'
import QRPay from './pages/QRPay'
import Cards from './pages/Cards'
import Invest from './pages/Invest'
import History from './pages/History'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Signup from './pages/Signup'
import BottomNav from './components/BottomNav'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center min-h-screen bg-bg"><div className="w-8 h-8 border-2 border-uob-green border-t-transparent rounded-full animate-spin" /></div>
  return user ? children : <Navigate to="/login" />
}

const AppLayout = ({ children }) => (
  <div className="min-h-screen bg-bg flex flex-col max-w-md mx-auto">
    <main className="flex-1 overflow-y-auto pb-20">{children}</main>
    <BottomNav />
  </div>
)

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<ProtectedRoute><AppLayout><Home /></AppLayout></ProtectedRoute>} />
          <Route path="/transfer" element={<ProtectedRoute><AppLayout><Transfer /></AppLayout></ProtectedRoute>} />
          <Route path="/qrpay" element={<ProtectedRoute><AppLayout><QRPay /></AppLayout></ProtectedRoute>} />
          <Route path="/cards" element={<ProtectedRoute><AppLayout><Cards /></AppLayout></ProtectedRoute>} />
          <Route path="/invest" element={<ProtectedRoute><AppLayout><Invest /></AppLayout></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><AppLayout><History /></AppLayout></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><AppLayout><Settings /></AppLayout></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}