import { onAuthStateChanged, User } from 'firebase/auth'
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'

import { auth } from '@src/firebase/firebase'

interface AuthContextType {
  user: User | null
  userId: string | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const userId = useMemo(() => user?.uid || null, [user])

  const value = useMemo(() => ({ user, userId, loading }), [user, userId, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
