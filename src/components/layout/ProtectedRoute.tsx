import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

export const ProtectedRoute: React.FC = () => {
  const token = localStorage.getItem('token')

  if (!token) {
    // Redirect to login page if unauthenticated
    return <Navigate to="/login" replace />
  }

  // Render child routes if authenticated
  return <Outlet />
}

export default ProtectedRoute
