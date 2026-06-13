import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

const TOKEN_KEY = 'cpp_token'
const USER_KEY  = 'cpp_user'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user,  setUser]  = useState(() => {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  })

  const login = useCallback((jwtResponse) => {
    localStorage.setItem(TOKEN_KEY, jwtResponse.token)
    localStorage.setItem(USER_KEY,  JSON.stringify(jwtResponse))
    setToken(jwtResponse.token)
    setUser(jwtResponse)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const isAdmin   = user?.roles?.includes('ROLE_ADMIN')   ?? false
  const isStudent = user?.roles?.includes('ROLE_STUDENT') ?? false

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAdmin, isStudent }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
