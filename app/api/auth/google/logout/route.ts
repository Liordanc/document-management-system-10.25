// נקודת קצה להתנתקות וביטול הטוקנים

import type { NextRequest } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    // מחיקת עוגיית הטוקנים
    cookies().delete("google_auth_tokens")

    // הפניה לדף הבית
    return Response.redirect(new URL("/", request.url))
  } catch (error) {
    console.error("Error during logout:", error)
    return Response.json({ error: "Failed to logout" }, { status: 500 })
  }
}
