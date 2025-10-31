// נקודת קצה לבדיקת מצב האימות הנוכחי

import type { NextRequest } from "next/server"
import { cookies } from "next/headers"
import { getServerSideCredentials } from "@/lib/google-credentials"

export async function GET(request: NextRequest) {
  try {
    // קבלת הטוקנים מהעוגיות
    const tokensString = cookies().get("google_auth_tokens")?.value

    if (!tokensString) {
      return Response.json({
        isAuthenticated: false,
        accessToken: null,
      })
    }

    try {
      // פענוח הטוקנים
      const tokens = JSON.parse(tokensString)

      // בדיקה אם הטוקן פג תוקף
      const isExpired = Date.now() > tokens.expires_at

      if (isExpired) {
        // אם יש refresh token, ננסה לרענן את הטוקן
        if (tokens.refresh_token) {
          try {
            // קבלת פרטי האימות
            const credentials = getServerSideCredentials()

            if (!credentials.clientId || !credentials.clientSecret) {
              throw new Error("Missing Google credentials")
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
              throw new Error("Failed to refresh token")
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

            // החזרת מצב האימות המעודכן
            return Response.json({
              isAuthenticated: true,
              accessToken: updatedTokens.access_token,
            })
          } catch (refreshError) {
            console.error("Error refreshing token:", refreshError)

            // מחיקת העוגייה במקרה של שגיאה
            cookies().delete("google_auth_tokens")

            return Response.json({
              isAuthenticated: false,
              accessToken: null,
            })
          }
        } else {
          // אין refresh token, לכן המשתמש לא מאומת
          return Response.json({
            isAuthenticated: false,
            accessToken: null,
          })
        }
      }

      // בדיקה שה-access token תקף מול Google
      try {
        const validationResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        })

        if (!validationResponse.ok) {
          // הטוקן לא תקף, מחיקת העוגייה
          cookies().delete("google_auth_tokens")

          return Response.json({
            isAuthenticated: false,
            accessToken: null,
          })
        }

        // הטוקן תקף, המשתמש מאומת
        return Response.json({
          isAuthenticated: true,
          accessToken: tokens.access_token,
        })
      } catch (validationError) {
        console.error("Error validating token:", validationError)
        return Response.json({
          isAuthenticated: false,
          accessToken: null,
        })
      }
    } catch (parseError) {
      console.error("Error parsing tokens:", parseError)
      return Response.json({
        isAuthenticated: false,
        accessToken: null,
      })
    }
  } catch (error) {
    console.error("Error checking auth status:", error)
    return Response.json({
      isAuthenticated: false,
      accessToken: null,
    })
  }
}
