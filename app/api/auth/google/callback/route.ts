// נקודת קצה לטיפול בתשובה מ-Google לאחר אימות

import type { NextRequest } from "next/server"
import { cookies } from "next/headers"
import { getServerSideCredentials } from "@/lib/google-credentials"

// פונקציית עזר לקבלת כתובת הבסיס
function getBaseUrl(request: NextRequest): string {
  const host = request.headers.get("host") || "localhost:3000"
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http"
  return `${protocol}://${host}`
}

export async function GET(request: NextRequest) {
  try {
    // קבלת פרמטרים מה-URL
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const error = searchParams.get("error")

    // בדיקה אם יש שגיאה מ-Google
    if (error) {
      console.error("Google auth error:", error)
      return Response.redirect(new URL("/auth/error?error=google_auth_declined", getBaseUrl(request)))
    }

    // בדיקה שהקוד קיים
    if (!code) {
      console.error("No code received from Google")
      return Response.redirect(new URL("/auth/error?error=no_code", getBaseUrl(request)))
    }

    // קבלת מזהה המצב מהעוגיות
    const storedState = cookies().get("google_auth_state")?.value

    // בדיקת התאמה של מזהה המצב למניעת CSRF
    if (!storedState || state !== storedState) {
      console.error("State mismatch:", { state, storedState })
      return Response.redirect(new URL("/auth/error?error=state_mismatch", getBaseUrl(request)))
    }

    // קבלת פרטי האימות
    const credentials = getServerSideCredentials()

    if (!credentials.clientId || !credentials.clientSecret) {
      console.error("Missing client ID or client secret")
      return Response.redirect(new URL("/auth/error?error=missing_credentials", getBaseUrl(request)))
    }

    // יצירת כתובת הפניה (חייבת להיות זהה לזו ששימשה בבקשה המקורית)
    const redirectUri = `${getBaseUrl(request)}/api/auth/google/callback`

    try {
      // החלפת קוד האישור בטוקנים
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code,
          client_id: credentials.clientId,
          client_secret: credentials.clientSecret,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }).toString(),
      })

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.text()
        console.error("Token exchange error:", errorData)
        return Response.redirect(new URL("/auth/error?error=token_exchange_error", getBaseUrl(request)))
      }

      const tokenData = await tokenResponse.json()

      // חישוב זמן תפוגה
      const expiresIn = tokenData.expires_in || 3600
      const expiresAt = Date.now() + expiresIn * 1000

      // יצירת אובייקט הטוקנים
      const tokens = {
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token || "",
        expires_at: expiresAt,
        scope: tokenData.scope || "",
        token_type: tokenData.token_type || "Bearer",
      }

      // שמירת הטוקנים בעוגייה (בפורמט JSON פשוט)
      cookies().set("google_auth_tokens", JSON.stringify(tokens), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30, // 30 ימים
        path: "/",
        sameSite: "lax",
      })

      // מחיקת עוגיות זמניות
      cookies().delete("google_auth_state")

      // הפניה לדף ההצלחה
      return Response.redirect(new URL("/integrations/google-drive", getBaseUrl(request)))
    } catch (tokenError) {
      console.error("Error exchanging code for tokens:", tokenError)
      return Response.redirect(new URL("/auth/error?error=token_exchange_error", getBaseUrl(request)))
    }
  } catch (error) {
    console.error("Error in Google auth callback:", error)
    return Response.redirect(new URL("/auth/error?error=callback_error", getBaseUrl(request)))
  }
}
