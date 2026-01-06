'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type User = { id: string, email: string, token: string }
type AuthContextType = { user: User | null, login: (email: string, password: string) => Promise<void>, signup: (email: string, password: string) => Promise<void>, logout: () => void }

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if(storedUser) setUser(JSON.parse(storedUser))
  }, [])

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
    if(!res.ok) throw new Error('Login failed')
    const data = await res.json()
    const newUser = { id: data.userId, email, token: data.token }
    localStorage.setItem('user', JSON.stringify(newUser))
    setUser(newUser)
  }

  const signup = async (email: string, password: string) => {
    const res = await fetch('/api/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
    if(!res.ok) throw new Error('Signup failed')
    const data = await res.json()
    const newUser = { id: data.userId, email, token: data.token }
    localStorage.setItem('user', JSON.stringify(newUser))
    setUser(newUser)
  }

  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if(!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
