import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { SocketProvider } from './context/SocketContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1A1A1A',
                color: '#FAF7F2',
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                letterSpacing: '0.02em',
                borderRadius: '2px',
                padding: '12px 16px',
              },
              success: {
                iconTheme: { primary: '#C9A24B', secondary: '#1A1A1A' },
              },
              error: {
                iconTheme: { primary: '#6B1E3C', secondary: '#FAF7F2' },
              },
            }}
          />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
