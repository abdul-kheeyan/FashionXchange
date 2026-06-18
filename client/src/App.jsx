import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useContext } from 'react'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

import HomePage         from './pages/HomePage'
import LoginPage        from './pages/LoginPage'
import RegisterPage     from './pages/RegisterPage'
import ListingsPage     from './pages/ListingsPage'
import ItemDetailPage   from './pages/ItemDetailPage'
import SwapRequestsPage from './pages/SwapRequestsPage'
import ChatPage         from './pages/ChatPage'
import DashboardPage    from './pages/DashboardPage'
import AdminPage        from './pages/AdminPage'
import CreateListingPage from './pages/CreateListingPage'
import NotFoundPage     from './pages/NotFoundPage'

function App() {
  const location = useLocation()

  // Pages that shouldn't show footer
  const noFooterPaths = ['/chat/', '/admin']
  const showFooter = !noFooterPaths.some(p => location.pathname.startsWith(p))

  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            {/* Public */}
            <Route path="/"          element={<HomePage />} />
            <Route path="/login"     element={<LoginPage />} />
            <Route path="/register"  element={<RegisterPage />} />
            <Route path="/listings"  element={<ListingsPage />} />
            <Route path="/listings/:id" element={<ItemDetailPage />} />

            {/* Protected */}
            <Route element={<ProtectedRoute />}>
              <Route path="/swaps"         element={<SwapRequestsPage />} />
              <Route path="/chat/:swapId"  element={<ChatPage />} />
              <Route path="/dashboard"     element={<DashboardPage />} />
              <Route path="/listings/new"  element={<CreateListingPage />} />
            </Route>

            {/* Admin */}
            <Route element={<AdminRoute />}>
              <Route path="/admin/*" element={<AdminPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AnimatePresence>
      </main>
      {showFooter && <Footer />}
    </div>
  )
}

export default App
