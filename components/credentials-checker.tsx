"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, FileJson } from "lucide-react"

export function CredentialsChecker() {
  const [isChecking, setIsChecking] = useState(false)
  const [checkResult, setCheckResult] = useState<{
    hasCredentials: boolean
    clientIdPrefix: string | null
    source: string | null
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const checkCredentials = async () => {
    setIsChecking(true)
    setError(null)

    try {
      const response = await fetch("/api/google-credentials")

      if (!response.ok) {
        throw new Error("Failed to check credentials")
      }

      const data = await response.json()
      setCheckResult(data)
    } catch (err) {
      console.error("Error checking credentials:", err)
      setError("Failed to check credentials. Please try again.")
    } finally {
      setIsChecking(false)
    }
  }

  // בדיקה אוטומטית בטעינת הקומפוננטה
  useEffect(() => {
    checkCredentials()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Google Credentials Status</CardTitle>
        <CardDescription>Check if your Google credentials are properly configured</CardDescription>
      </CardHeader>
      <CardContent>
        {isChecking ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Checking credentials...</span>
          </div>
        ) : error ? (
          <div className="flex items-center text-red-500 py-4">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        ) : checkResult ? (
          <div className="space-y-4">
            <div className="flex items-center">
              {checkResult.hasCredentials ? (
                <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
              )}
              <span>
                {checkResult.hasCredentials
                  ? "Google credentials are properly configured"
                  : "Google credentials are not configured"}
              </span>
            </div>

            {checkResult.hasCredentials && (
              <>
                <div className="flex items-center">
                  <FileJson className="h-5 w-5 mr-2 text-blue-500" />
                  <span>Client ID: {checkResult.clientIdPrefix}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">Source:</span>
                  <span className="ml-2">
                    {checkResult.source === "environment" ? "Environment Variables" : "credentials.json file"}
                  </span>
                </div>
              </>
            )}
          </div>
        ) : null}
      </CardContent>
      <CardFooter>
        <Button onClick={checkCredentials} disabled={isChecking}>
          {isChecking ? "Checking..." : "Check Credentials"}
        </Button>
      </CardFooter>
    </Card>
  )
}
