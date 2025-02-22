import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Loader, Center } from '@mantine/core'

export function ProtectedRoute() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    )
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export function AdminRoute() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    )
  }

  if (!user || !user.roles.includes('admin')) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
