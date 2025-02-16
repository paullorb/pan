'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

type AuthContextType = {
  email: string
  password: string
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (!res.ok) {
      throw new Error('Login failed')
    }
    const data = await res.json()
    setEmail(email)
    setPassword(password)
    console.log('Login successful:', data)
  }

  const signup = async (email: string, password: string) => {
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (!res.ok) {
      throw new Error('Signup failed')
    }
    const data = await res.json()
    setEmail(email)
    setPassword(password)
    console.log('Signup successful:', data)
  }

  return (
    <AuthContext.Provider value={{ email, password, login, signup }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
