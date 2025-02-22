import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute'
import IndexesPage from './pages/IndexesPage'
import DocumentsPage from './pages/DocumentsPage'
import QueryPage from './pages/QueryPage'

const queryClient = new QueryClient()

function App () {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <Notifications />
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<QueryPage />} />
                <Route element={<AdminRoute />}>
                  <Route path="indexes" element={<IndexesPage />} />
                </Route>
                <Route element={<ProtectedRoute />}>
                  <Route
                    path="indexes/:indexName/documents"
                    element={<DocumentsPage />}
                  />
                </Route>
              </Route>
            </Routes>
          </Router>
        </AuthProvider>
      </MantineProvider>
    </QueryClientProvider>
  )
}

export default App
