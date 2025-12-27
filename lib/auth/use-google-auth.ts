"use client"

import { useState, useEffect } from "react"
import { toast } from "@/components/ui/use-toast"

interface UseGoogleAuthOptions {
  onAuthStateChange?: (isAuthenticated: boolean) => void
}

interface UseGoogleAuthResult {
  isAuthenticated: boolean
  isLoading: boolean
  accessToken: string | null
  login: () => void
  logout: () => void
  refreshToken: () => Promise<string | null>
}

export function useGoogleAuth(options?: UseGoogleAuthOptions): UseGoogleAuthResult {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  // בדיקת מצב האימות בטעינת הקומפוננטה
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // קריאה לנקודת קצה שתבדוק אם יש טוקנים תקפים
        const response = await fetch("/api/auth/google/status")

        if (response.ok) {
          const data = await response.json()
          setIsAuthenticated(data.isAuthenticated)

          if (data.isAuthenticated && data.accessToken) {
            setAccessToken(data.accessToken)
          }
        } else {
          setIsAuthenticated(false)
          setAccessToken(null)
        }
      } catch (error) {
        console.error("Error checking auth status:", error)
        setIsAuthenticated(false)
        setAccessToken(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  // עדכון callback כאשר מצב האימות משתנה
  useEffect(() => {
    if (options?.onAuthStateChange) {
      options.onAuthStateChange(isAuthenticated)
    }
  }, [isAuthenticated, options])

  // פונקציה להתחלת תהליך ההתחברות
  const login = () => {
    window.location.href = "/api/auth/google"
  }

  // פונקציה להתנתקות
  const logout = async () => {
    try {
      setIsLoading(true)

      const response = await fetch("/api/auth/google/logout")

      if (!response.ok) {
        throw new Error("Logout failed")
      }

      setIsAuthenticated(false)
      setAccessToken(null)

      toast({
        title: "Logged Out",
        description: "You have been successfully logged out of Google.",
      })
    } catch (error) {
      console.error("Error during logout:", error)
      toast({
        title: "Logout Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // פונקציה לרענון הטוקן
  const refreshToken = async (): Promise<string | null> => {
    try {
      setIsLoading(true)

      const response = await fetch("/api/auth/google/refresh")

      if (!response.ok) {
        throw new Error("Token refresh failed")
      }

      const data = await response.json()
      setAccessToken(data.access_token)

      return data.access_token
    } catch (error) {
      console.error("Error refreshing token:", error)
      toast({
        title: "Authentication Error",
        description: "Failed to refresh authentication. Please login again.",
        variant: "destructive",
      })

      // במקרה של שגיאה ברענון הטוקן, נסמן את המשתמש כמנותק
      setIsAuthenticated(false)
      setAccessToken(null)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isAuthenticated,
    isLoading,
    accessToken,
    login,
    logout,
    refreshToken,
  }
}
