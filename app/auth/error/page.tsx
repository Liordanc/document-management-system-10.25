"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const errorCode = searchParams.get("error") || "unknown_error"

  // מיפוי קודי שגיאה להודעות ידידותיות למשתמש
  const errorMessages = {
    google_auth_declined: "You declined the Google authentication request.",
    no_code: "No authorization code was received from Google.",
    state_mismatch: "Security verification failed. Please try again.",
    missing_encryption_key: "Authentication session expired. Please try again.",
    missing_credentials: "Google API credentials are not properly configured.",
    callback_error: "An error occurred during the authentication process.",
    unknown_error: "An unknown error occurred during authentication.",
  }

  const errorMessage = errorMessages[errorCode] || errorMessages.unknown_error

  return (
    <div className="container mx-auto p-6 flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Authentication Error
          </CardTitle>
          <CardDescription>There was a problem with Google authentication.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{errorMessage}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/">Return to Home</Link>
          </Button>
          <Button asChild>
            <Link href="/integrations/google-drive">Try Again</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
