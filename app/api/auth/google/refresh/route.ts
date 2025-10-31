// נקודת קצה לרענון access token

import type { NextRequest } from "next/server"
import { cookies } from "next/headers"
import { getServerSideCredentials } from "@/lib/google-credentials"

export async function GET(request: NextRequest) {
  try {
    // קבלת הטוקנים מהעוגיות
    const tokensString = cookies().get("google_auth_tokens")?.value

    if (!tokensString) {
      return Response.json({ error: "No tokens found" }, { status: 401 })
    }

    try {
      // פענוח הטוקנים
      const tokens = JSON.parse(tokensString)

      if (!tokens.refresh_token) {
        return Response.json({ error: "No refresh token available" }, { status: 401 })
      }

      // קבלת פרטי האימות
      const credentials = getServerSideCredentials()

      if (!credentials.clientId || !credentials.clientSecret) {
        return Response.json({ error: "Missing Google credentials" }, { status: 500 })
      }

      // רענון ה-access token
      const refreshResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          refresh_token: tokens.refresh_token,
          client_id: credentials.clientId,
          client_secret: credentials.clientSecret,
          grant_type: "refresh_token",
        }).toString(),
      })

      if (!refreshResponse.ok) {
        const errorData = await refreshResponse.text()
        return Response.json({ error: `Failed to refresh token: ${errorData}` }, { status: 401 })
      }

      const refreshData = await refreshResponse.json()

      // חישוב זמן תפוגה חדש
      const expiresIn = refreshData.expires_in || 3600
      const expiresAt = Date.now() + expiresIn * 1000

      // עדכון הטוקנים
      const updatedTokens = {
        ...tokens,
        access_token: refreshData.access_token,
        expires_at: expiresAt,
        scope: refreshData.scope || tokens.scope,
        token_type: refreshData.token_type || tokens.token_type,
      }

      // שמירת הטוקנים המעודכנים בעוגייה
      cookies().set("google_auth_tokens", JSON.stringify(updatedTokens), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30, // 30 ימים
        path: "/",
        sameSite: "lax",
      })

      // החזרת ה-access token החדש
      return Response.json({
        access_token: updatedTokens.access_token,
        expires_at: updatedTokens.expires_at,
      })
    } catch (parseError) {
      console.error("Error parsing tokens:", parseError)
      return Response.json({ error: "Invalid token format" }, { status: 401 })
    }
  } catch (error) {
    console.error("Error refreshing token:", error)
    return Response.json({ error: "Failed to refresh token" }, { status: 500 })
  }
}
