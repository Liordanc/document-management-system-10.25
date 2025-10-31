// מודול להצפנה ופענוח של מידע רגיש

// אורך מפתח ההצפנה בביטים
const KEY_LENGTH = 32 // 256 bits
const IV_LENGTH = 16 // 128 bits
const ALGORITHM = "aes-256-cbc"

// פונקציה להצפנת מחרוזת
export function encrypt(text: string, key: string): string {
  try {
    // בסביבת שרת, השתמש ב-crypto של Node.js
    if (typeof window === "undefined") {
      const crypto = require("crypto")

      // יצירת מפתח באורך קבוע מהמפתח שסופק
      const derivedKey = crypto.scryptSync(key, "salt", KEY_LENGTH)

      // יצירת וקטור אתחול אקראי
      const iv = crypto.randomBytes(IV_LENGTH)

      // יצירת מצפין
      const cipher = crypto.createCipheriv(ALGORITHM, derivedKey, iv)

      // הצפנת הטקסט
      let encrypted = cipher.update(text, "utf8", "hex")
      encrypted += cipher.final("hex")

      // החזרת התוצאה המוצפנת עם וקטור האתחול (נדרש לפענוח)
      return iv.toString("hex") + ":" + encrypted
    }
    // בסביבת דפדפן, השתמש בהצפנה פשוטה יותר
    else {
      // הצפנה פשוטה לסביבת דפדפן (לא מאובטחת, רק לצורך הדגמה)
      return btoa(text)
    }
  } catch (error) {
    console.error("Encryption error:", error)
    // במקרה של שגיאה, החזר את הטקסט המקורי מוקף בסימנים מיוחדים
    // כדי לסמן שההצפנה נכשלה
    return `__ENCRYPTION_FAILED__:${text}`
  }
}

// פונקציה לפענוח מחרוזת מוצפנת
export function decrypt(encryptedText: string, key: string): string {
  try {
    // בדיקה אם ההצפנה נכשלה
    if (encryptedText.startsWith("__ENCRYPTION_FAILED__:")) {
      return encryptedText.substring("__ENCRYPTION_FAILED__:".length)
    }

    // בסביבת שרת, השתמש ב-crypto של Node.js
    if (typeof window === "undefined") {
      const crypto = require("crypto")

      // פיצול הטקסט המוצפן לוקטור אתחול ולמידע מוצפן
      const [ivHex, encryptedHex] = encryptedText.split(":")

      if (!ivHex || !encryptedHex) {
        throw new Error("Invalid encrypted text format")
      }

      // יצירת מפתח באורך קבוע מהמפתח שסופק
      const derivedKey = crypto.scryptSync(key, "salt", KEY_LENGTH)

      // המרת וקטור האתחול מהקסדצימלי לבינארי
      const iv = Buffer.from(ivHex, "hex")

      // יצירת מפענח
      const decipher = crypto.createDecipheriv(ALGORITHM, derivedKey, iv)

      // פענוח הטקסט
      let decrypted = decipher.update(encryptedHex, "hex", "utf8")
      decrypted += decipher.final("utf8")

      return decrypted
    }
    // בסביבת דפדפן, השתמש בפענוח פשוט יותר
    else {
      // פענוח פשוט לסביבת דפדפן (לא מאובטח, רק לצורך הדגמה)
      return atob(encryptedText)
    }
  } catch (error) {
    console.error("Decryption error:", error)
    // במקרה של שגיאה, החזר את הטקסט המוצפן
    return encryptedText
  }
}

// פונקציה ליצירת מפתח הצפנה אקראי
export function generateEncryptionKey(): string {
  try {
    // בסביבת שרת, השתמש ב-crypto של Node.js
    if (typeof window === "undefined") {
      const crypto = require("crypto")
      return crypto.randomBytes(KEY_LENGTH).toString("hex")
    }
    // בסביבת דפדפן, צור מחרוזת אקראית
    else {
      let result = ""
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
      const charactersLength = characters.length
      for (let i = 0; i < KEY_LENGTH * 2; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
      }
      return result
    }
  } catch (error) {
    console.error("Error generating encryption key:", error)
    // במקרה של שגיאה, החזר מפתח קבוע (לא מומלץ לשימוש בייצור!)
    return "fallback-encryption-key-for-development-only"
  }
}
