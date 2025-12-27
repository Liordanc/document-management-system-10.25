import { encrypt, decrypt } from "@/lib/auth/encryption"

// קבועים לתהליך האימות
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"
const SCOPES = [
  "https://www.googleapis.com/auth/drive.readonly",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
]

// מבנה נתונים לאחסון פרטי אימות
export interface GoogleTokens {
  access_token: string
  refresh_token: string
  expires_at: number // זמן תפוגה בפורמט timestamp
  scope: string
  token_type: string
}

// פונקציה ליצירת URL לתחילת תהליך האימות
export function getGoogleAuthUrl(clientId: string, redirectUri: string, state: string): string {
  try {
    console.log("Creating Google Auth URL with:", {
      clientId: clientId.substring(0, 5) + "...",
      redirectUri,
      scopes: SCOPES.length,
    })

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: SCOPES.join(" "),
      access_type: "offline", // חשוב לקבלת refresh token
      prompt: "consent", // תמיד לבקש הסכמה כדי לקבל refresh token
      state: state,
    })

    const authUrl = `${GOOGLE_AUTH_URL}?${params.toString()}`
    console.log("Generated auth URL:", authUrl.substring(0, 100) + "...")
    return authUrl
  } catch (error) {
    console.error("Error creating Google Auth URL:", error)
    throw new Error(`Failed to create Google Auth URL: ${error.message}`)
  }
}

// פונקציה להחלפת קוד אישור בטוקנים
export async function exchangeCodeForTokens(
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string,
): Promise<GoogleTokens> {
  try {
    console.log("Exchanging code for tokens with:", {
      codeLength: code.length,
      clientIdPrefix: clientId.substring(0, 5) + "...",
      redirectUri,
    })

    const params = new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    })

    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Token exchange error:", errorData)
      throw new Error(`Error exchanging code for tokens: ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    console.log("Received token data:", {
      hasAccessToken: !!data.access_token,
      hasRefreshToken: !!data.refresh_token,
      expiresIn: data.expires_in,
    })

    // חישוב זמן תפוגה
    const expiresIn = data.expires_in || 3600
    const expiresAt = Date.now() + expiresIn * 1000

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: expiresAt,
      scope: data.scope,
      token_type: data.token_type,
    }
  } catch (error) {
    console.error("Error exchanging code for tokens:", error)
    throw new Error(`Failed to exchange code for tokens: ${error.message}`)
  }
}

// פונקציה לרענון access token באמצעות refresh token
export async function refreshAccessToken(
  refreshToken: string,
  clientId: string,
  clientSecret: string,
): Promise<Partial<GoogleTokens>> {
  try {
    console.log("Refreshing access token")

    const params = new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
    })

    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Token refresh error:", errorData)
      throw new Error(`Error refreshing token: ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    console.log("Received refreshed token data")

    // חישוב זמן תפוגה חדש
    const expiresIn = data.expires_in || 3600
    const expiresAt = Date.now() + expiresIn * 1000

    return {
      access_token: data.access_token,
      expires_at: expiresAt,
      scope: data.scope,
      token_type: data.token_type,
    }
  } catch (error) {
    console.error("Error refreshing access token:", error)
    throw new Error(`Failed to refresh access token: ${error.message}`)
  }
}

// פונקציה לקבלת מידע על המשתמש באמצעות access token
export async function getUserInfo(accessToken: string): Promise<any> {
  try {
    console.log("Getting user info with access token")

    const response = await fetch(GOOGLE_USERINFO_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("User info error:", errorData)
      throw new Error("Failed to fetch user info")
    }

    const userData = await response.json()
    console.log("Received user data")
    return userData
  } catch (error) {
    console.error("Error getting user info:", error)
    throw new Error(`Failed to get user info: ${error.message}`)
  }
}

// פונקציה לבדיקה אם access token תקף
export async function validateAccessToken(accessToken: string): Promise<boolean> {
  try {
    console.log("Validating access token")

    const response = await fetch(GOOGLE_USERINFO_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const isValid = response.ok
    console.log("Token validation result:", isValid)
    return isValid
  } catch (error) {
    console.error("Error validating access token:", error)
    return false
  }
}

// פונקציה לבדיקה אם הטוקן פג תוקף
export function isTokenExpired(expiresAt: number): boolean {
  // נחשיב את הטוקן כפג תוקף 5 דקות לפני זמן התפוגה האמיתי
  const isExpired = Date.now() > expiresAt - 5 * 60 * 1000
  console.log("Token expiration check:", { isExpired, expiresAt, now: Date.now() })
  return isExpired
}

// פונקציה לשמירת הטוקנים בצורה מאובטחת
export function storeTokens(tokens: GoogleTokens, encryptionKey: string): string {
  try {
    console.log("Storing tokens")
    const encrypted = encrypt(JSON.stringify(tokens), encryptionKey)
    console.log("Tokens encrypted successfully")
    return encrypted
  } catch (error) {
    console.error("Error storing tokens:", error)
    // במקרה של שגיאה, החזר גרסה לא מוצפנת (לא מומלץ לשימוש בייצור!)
    return JSON.stringify(tokens)
  }
}

// פונקציה לקריאת הטוקנים המוצפנים
export function retrieveTokens(encryptedTokens: string, encryptionKey: string): GoogleTokens | null {
  try {
    console.log("Retrieving tokens")
    const decrypted = decrypt(encryptedTokens, encryptionKey)
    console.log("Tokens decrypted successfully")
    return JSON.parse(decrypted)
  } catch (error) {
    console.error("Error decrypting tokens:", error)
    return null
  }
}

// פונקציה לקבלת access token תקף (מרענן אם צריך)
export async function getValidAccessToken(
  encryptedTokens: string,
  encryptionKey: string,
  clientId: string,
  clientSecret: string,
): Promise<string | null> {
  try {
    console.log("Getting valid access token")

    const tokens = retrieveTokens(encryptedTokens, encryptionKey)

    if (!tokens) {
      console.error("No tokens found")
      return null
    }

    // בדיקה אם הטוקן פג תוקף
    if (isTokenExpired(tokens.expires_at)) {
      console.log("Token is expired, refreshing")

      try {
        // רענון הטוקן
        const refreshedTokens = await refreshAccessToken(tokens.refresh_token, clientId, clientSecret)

        // עדכון הטוקנים המאוחסנים
        const updatedTokens: GoogleTokens = {
          ...tokens,
          access_token: refreshedTokens.access_token!,
          expires_at: refreshedTokens.expires_at!,
          scope: refreshedTokens.scope || tokens.scope,
          token_type: refreshedTokens.token_type || tokens.token_type,
        }

        console.log("Token refreshed successfully")
        // החזרת הטוקנים המעודכנים מוצפנים
        return updatedTokens.access_token
      } catch (error) {
        console.error("Error refreshing token:", error)
        return null
      }
    }

    console.log("Using existing valid token")
    // החזרת הטוקן הקיים אם הוא תקף
    return tokens.access_token
  } catch (error) {
    console.error("Error getting valid access token:", error)
    return null
  }
}
