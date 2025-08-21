
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { authApi } from "@/lib/api"

interface User {
  id: string
  email: string
  role: "admin" | "user"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, role?: "admin" | "user") => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem("token")
    if (token) {
      // In a real app, you'd validate the token with your backend
      try {
        const userData = JSON.parse(localStorage.getItem("user") || "{}")
        setUser(userData)
      } catch (error) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const data = await authApi.login(email, password)
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      setUser({
        id: data.user.id.toString(),
        email: data.user.email,
        role: data.user.role.toLowerCase() as "admin" | "user",
      })
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, password: string, role: "admin" | "user" = "user") => {
    setLoading(true)
    try {
      const data = await authApi.register(email, password, role.toUpperCase() as "USER" | "ADMIN")
      await login(email, password)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
  }

  const contextValue: AuthContextType = { 
    user, 
    login, 
    register, 
    logout, 
    loading 
  }
  
  return {
    Provider: ({ children }: { children: React.ReactNode }) => {
      return AuthContext.Provider({ value: contextValue, children });
    }
  };
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
