"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  joinedDate: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE" }
  | { type: "LOGOUT" }
  | { type: "SIGNUP_START" }
  | { type: "SIGNUP_SUCCESS"; payload: User }
  | { type: "SIGNUP_FAILURE" }
  | { type: "LOAD_USER"; payload: User | null }

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_START":
    case "SIGNUP_START":
      return {
        ...state,
        isLoading: true,
      }

    case "LOGIN_SUCCESS":
    case "SIGNUP_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      }

    case "LOGIN_FAILURE":
    case "SIGNUP_FAILURE":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      }

    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      }

    case "LOAD_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      }

    default:
      return state
  }
}

const AuthContext = createContext<{
  state: AuthState
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  signup: (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
  }) => Promise<{ success: boolean; message: string }>
  logout: () => void
  updateProfile: (userData: Partial<User>) => Promise<{ success: boolean; message: string }>
} | null>(null)

// Simulate user database
const DEMO_USERS = [
  {
    id: "1",
    email: "demo@shophub.com",
    password: "demo123",
    firstName: "Demo",
    lastName: "User",
    phone: "+1-555-0123",
    joinedDate: "2024-01-15",
  },
  {
    id: "2",
    email: "john@example.com",
    password: "password123",
    firstName: "John",
    lastName: "Doe",
    phone: "+1-555-0456",
    joinedDate: "2024-02-20",
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem("shophub-user")
        if (savedUser) {
          const user = JSON.parse(savedUser)
          dispatch({ type: "LOAD_USER", payload: user })
        } else {
          dispatch({ type: "LOAD_USER", payload: null })
        }
      } catch (error) {
        console.error("Error loading user from localStorage:", error)
        dispatch({ type: "LOAD_USER", payload: null })
      }
    }

    loadUser()
  }, [])

  // Save user to localStorage whenever user changes
  useEffect(() => {
    if (state.user) {
      try {
        localStorage.setItem("shophub-user", JSON.stringify(state.user))
      } catch (error) {
        console.error("Error saving user to localStorage:", error)
      }
    } else {
      localStorage.removeItem("shophub-user")
    }
  }, [state.user])

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    dispatch({ type: "LOGIN_START" })

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Check if user exists in demo database
    const user = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

    if (user) {
      const { password: _, ...userWithoutPassword } = user
      dispatch({ type: "LOGIN_SUCCESS", payload: userWithoutPassword })
      return { success: true, message: "Login successful!" }
    } else {
      dispatch({ type: "LOGIN_FAILURE" })
      return { success: false, message: "Invalid email or password. Try demo@shophub.com / demo123" }
    }
  }

  const signup = async (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
  }): Promise<{ success: boolean; message: string }> => {
    dispatch({ type: "SIGNUP_START" })

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Check if user already exists
    const existingUser = DEMO_USERS.find((u) => u.email.toLowerCase() === userData.email.toLowerCase())

    if (existingUser) {
      dispatch({ type: "SIGNUP_FAILURE" })
      return { success: false, message: "User with this email already exists" }
    }

    // Create new user
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      joinedDate: new Date().toISOString().split("T")[0],
    }

    // Add to demo database (in real app, this would be sent to backend)
    DEMO_USERS.push({ ...newUser, password: userData.password })

    dispatch({ type: "SIGNUP_SUCCESS", payload: newUser })
    return { success: true, message: "Account created successfully!" }
  }

  const logout = () => {
    dispatch({ type: "LOGOUT" })
  }

  const updateProfile = async (userData: Partial<User>): Promise<{ success: boolean; message: string }> => {
    if (!state.user) {
      return { success: false, message: "No user logged in" }
    }

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const updatedUser = { ...state.user, ...userData }
    dispatch({ type: "LOGIN_SUCCESS", payload: updatedUser })

    return { success: true, message: "Profile updated successfully!" }
  }

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
