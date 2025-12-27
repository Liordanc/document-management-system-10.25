// נקודת קצה להתחלת תהליך האימות מול Google

import type { NextRequest } from "next/server"
import { cookies } from "next/headers"

// פונקציית עזר לקבלת כתובת הבסיס
function getBaseUrl(request: NextRequest): string {
  // שימוש בכתובת מהבקשה עצמה
  const host = request.headers.get("host") || "localhost:3000"
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http"
  return `${protocol}://${host}`
}

// פונקציית עזר ליצירת מזהה ייחודי
function generateUniqueId(): string {
  return Math.random().toString(36).substring(2, 15)
}

// נקודת קצה להתחלת תהליך האימות
export async function GET(request: NextRequest) {
  try {
    // בדיקה שיש לנו את פרטי האימות הנדרשים
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

    if (!clientId) {
      console.error("Missing Google client ID")
      return new Response(JSON.stringify({ error: "Google client ID not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    // יצירת מזהה מצב ייחודי למניעת CSRF
    const state = generateUniqueId()

    try {
      // שמירת מזהה המצב בעוגיות
      cookies().set("google_auth_state", state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 10, // 10 דקות
        path: "/",
        sameSite: "lax",
      })
    } catch (cookieError) {
      console.error("Error setting cookies:", cookieError)
      return new Response(JSON.stringify({ error: "Failed to set authentication cookies" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    // יצירת כתובת הפניה
    const baseUrl = getBaseUrl(request)
    const redirectUri = `${baseUrl}/api/auth/google/callback`

    // יצירת URL לאימות של Google
    const scopes = [
      "https://www.googleapis.com/auth/drive.readonly",
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ]

    const authParams = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: scopes.join(" "),
      access_type: "offline",
      prompt: "consent",
      state: state,
    })

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${authParams.toString()}`

    // הפניית המשתמש לדף האימות של Google
    return Response.redirect(authUrl)
  } catch (error) {
    console.error("Error in Google auth flow:", error)
    return new Response(JSON.stringify({ error: "Failed to start authentication flow", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
