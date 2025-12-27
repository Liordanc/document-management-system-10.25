"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { ChromeIcon as Google, LogOut } from "lucide-react"

interface GoogleAuthButtonProps {
  isAuthenticated?: boolean
  onLogout?: () => void
}

export function GoogleAuthButton({ isAuthenticated = false, onLogout }: GoogleAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    setIsLoading(true)

    try {
      // הפניה לנקודת הקצה להתחלת תהליך האימות
      window.location.href = "/api/auth/google"
    } catch (error) {
      console.error("Error starting Google auth:", error)
      toast({
        title: "Authentication Error",
        description: "Failed to start Google authentication. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    setIsLoading(true)

    try {
      // קריאה לנקודת הקצה להתנתקות
      const response = await fetch("/api/auth/google/logout")

      if (!response.ok) {
        throw new Error("Logout failed")
      }

      toast({
        title: "Logged Out",
        description: "You have been successfully logged out of Google.",
      })

      // הפעלת callback אם קיים
      if (onLogout) {
        onLogout()
      } else {
        // רענון הדף אם אין callback
        window.location.reload()
      }
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

  if (isAuthenticated) {
    return (
      <Button variant="outline" onClick={handleLogout} disabled={isLoading} className="gap-2">
        {isLoading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
        ) : (
          <LogOut className="h-4 w-4" />
        )}
        Logout from Google
      </Button>
    )
  }

  return (
    <Button onClick={handleLogin} disabled={isLoading} className="gap-2">
      {isLoading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
      ) : (
        <Google className="h-4 w-4" />
      )}
      Sign in with Google
    </Button>
  )
}
