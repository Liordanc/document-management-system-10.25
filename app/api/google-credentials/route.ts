// נקודת קצה לבדיקת פרטי האימות של Google

import type { NextRequest } from "next/server"
import { getServerSideCredentials } from "@/lib/google-credentials"

export async function GET(request: NextRequest) {
  try {
    // קבלת פרטי האימות
    const credentials = getServerSideCredentials()

    // בדיקה אם יש פרטי אימות
    const hasCredentials = !!credentials.clientId && !!credentials.apiKey

    // החזרת תוצאות הבדיקה (ללא חשיפת הסוד)
    return Response.json({
      hasCredentials,
      clientIdPrefix: credentials.clientId ? credentials.clientId.substring(0, 5) + "..." : null,
      source: credentials.clientId ? (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? "environment" : "file") : null,
    })
  } catch (error) {
    console.error("Error checking Google credentials:", error)
    return Response.json({ error: "Failed to check Google credentials" }, { status: 500 })
  }
}
