// דוגמא לקובץ שמסביר כיצד להשתמש בקובץ credentials.json

/**
 * הסבר על קובץ credentials.json
 *
 * קובץ credentials.json הוא קובץ שמכיל את פרטי האימות של Google OAuth.
 * הקובץ מורידים מ-Google Cloud Console בעת יצירת OAuth client ID.
 *
 * הנה השלבים ליצירת הקובץ:
 *
 * 1. היכנס ל-Google Cloud Console: https://console.cloud.google.com/
 * 2. צור פרויקט חדש או בחר פרויקט קיים
 * 3. עבור ל-"APIs & Services" > "Credentials"
 * 4. לחץ על "Create Credentials" ובחר "OAuth client ID"
 * 5. בחר "Web application" כסוג האפליקציה
 * 6. הוסף שם לאפליקציה
 * 7. הוסף את כתובות ה-Redirect URIs:
 *    - http://localhost:3000/api/auth/google/callback (לפיתוח מקומי)
 *    - https://your-domain.com/api/auth/google/callback (לסביבת ייצור)
 * 8. הוסף את כתובות ה-JavaScript origins:
 *    - http://localhost:3000 (לפיתוח מקומי)
 *    - https://your-domain.com (לסביבת ייצור)
 * 9. לחץ על "Create"
 * 10. הורד את קובץ ה-JSON
 *
 * שים לב: בסביבת ייצור, מומלץ להשתמש במשתני סביבה במקום בקובץ credentials.json.
 * הוסף את הערכים הבאים כמשתני סביבה:
 * - NEXT_PUBLIC_GOOGLE_CLIENT_ID: מזהה הלקוח
 * - NEXT_PUBLIC_GOOGLE_API_KEY: מפתח ה-API
 * - GOOGLE_CLIENT_SECRET: הסוד של הלקוח
 * - TOKEN_ENCRYPTION_KEY: מפתח להצפנת הטוקנים (מחרוזת אקראית)
 */

// דוגמא לשימוש בקובץ credentials.json
import { loadGoogleCredentials } from "./google-credentials"

async function exampleUsage() {
  try {
    // טעינת פרטי האימות
    const credentials = await loadGoogleCredentials()

    console.log("Client ID:", credentials.clientId)
    console.log("API Key:", credentials.apiKey)

    // שימוש בפרטי האימות לקריאה ל-API של Google
    // ...
  } catch (error) {
    console.error("Error loading credentials:", error)
  }
}

// הסבר על המבנה של קובץ credentials.json
const credentialsStructure = {
  web: {
    client_id: "מזהה הלקוח שמשמש לזיהוי האפליקציה שלך מול Google",
    project_id: "מזהה הפרויקט ב-Google Cloud",
    auth_uri: "כתובת ה-URI לאימות (בדרך כלל קבועה)",
    token_uri: "כתובת ה-URI לקבלת טוקנים (בדרך כלל קבועה)",
    auth_provider_x509_cert_url: "כתובת ה-URI לתעודות האימות (בדרך כלל קבועה)",
    client_secret: "הסוד של הלקוח שמשמש לאימות מול Google",
    redirect_uris: ["כתובות ה-URI שאליהן Google תפנה לאחר האימות"],
    javascript_origins: ["כתובות המקור שמהן מותר לבצע בקשות JavaScript"],
  },
  api_key: "מפתח ה-API שמשמש לקריאות ל-API של Google",
}
