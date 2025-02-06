import React, { JSX } from 'react'
import { Navigate } from 'react-router-dom'

import Loader from '@components/Loader/Loader'
import { useAuth } from '@hooks/useAuth'

interface PrivateRouteProps {
  element: JSX.Element
  redirectTo: string
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, redirectTo }) => {
  const { user, loading } = useAuth()

  if (loading) return <Loader />

  return user ? <>{element}</> : <Navigate to={redirectTo} replace />
}

export default PrivateRoute
