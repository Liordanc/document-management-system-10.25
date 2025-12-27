// مודול לטעינת פרטי האימות של Google מקובץ או ממשתני סביבה

interface GoogleCredentials {
  clientId: string
  apiKey: string
  clientSecret?: string
}

// פונקציה לקבלת פרטי אימות בצד הלקוח
// זו צריכה לחשוף רק מה שבטוח עבור הלקוח
export function getClientSideCredentials(): Promise<Omit<GoogleCredentials, "clientSecret">> {
  try {
    // בצד הלקוח, אנחנו יכולים להשתמש ישירות במשתני הסביבה
    return Promise.resolve({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "",
    })
  } catch (error) {
    console.error("Error getting client-side credentials:", error)
    return Promise.resolve({
      clientId: "",
      apiKey: "",
    })
  }
}

// פונקציה לקבלת פרטי אימות בצד השרת
export function getServerSideCredentials(): GoogleCredentials {
  return {
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  }
}

// Function to load Google credentials from environment variables or a file
export async function loadGoogleCredentials(): Promise<GoogleCredentials> {
  if (
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID &&
    process.env.NEXT_PUBLIC_GOOGLE_API_KEY &&
    process.env.GOOGLE_CLIENT_SECRET
  ) {
    // Load from environment variables
    return {
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }
  } else {
    try {
      // Load from credentials.json file
      const fs = require("fs")
      const path = require("path")
      const credentialsPath = path.join(process.cwd(), "credentials.json")
      const credentialsFile = fs.readFileSync(credentialsPath, "utf8")
      const credentials = JSON.parse(credentialsFile)

      return {
        clientId: credentials.web.client_id,
        apiKey: "", // API key is not in the credentials file, it should be set as env variable
        clientSecret: credentials.web.client_secret,
      }
    } catch (error) {
      console.error("Error loading credentials from file:", error)
      throw new Error("Failed to load Google credentials from file")
    }
  }
}
