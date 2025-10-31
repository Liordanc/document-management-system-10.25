// This is a client-side wrapper for Google Drive API

import { toast } from "@/components/ui/use-toast"
import { getClientSideCredentials } from "./google-credentials"

// Interface for Google Drive file
interface GoogleDriveFile {
  id: string
  name: string
  mimeType: string
  webViewLink?: string
  thumbnailLink?: string
  iconLink?: string
  size?: string
  createdTime?: string
  modifiedTime?: string
  owners?: Array<{ displayName: string; emailAddress: string }>
}

// Class to handle Google Drive operations
export class GoogleDriveClient {
  private static instance: GoogleDriveClient
  private gapi: any = null
  private isInitialized = false
  private isAuthenticated = false
  private clientId = ""
  private apiKey = ""

  private constructor() {
    // Private constructor for singleton pattern
  }

  // Get singleton instance
  public static getInstance(): GoogleDriveClient {
    if (!GoogleDriveClient.instance) {
      GoogleDriveClient.instance = new GoogleDriveClient()
    }
    return GoogleDriveClient.instance
  }

  // Initialize Google API client
  public async initialize(): Promise<boolean> {
    if (this.isInitialized) return true

    try {
      // Load credentials
      const credentials = await getClientSideCredentials()
      this.clientId = credentials.clientId
      this.apiKey = credentials.apiKey

      if (!this.clientId || !this.apiKey) {
        throw new Error("Google API credentials not found")
      }

      // Load the Google API client library
      if (typeof window !== "undefined" && !window.gapi) {
        await this.loadScript("https://apis.google.com/js/api.js")
      }

      // Initialize the gapi.client
      await new Promise<void>((resolve, reject) => {
        window.gapi.load("client:auth2", {
          callback: () => resolve(),
          onerror: (error: Error) => reject(error),
        })
      })

      // Define discovery docs and scopes
      const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]
      const SCOPES = "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly"

      // Initialize the client with API key and client ID
      await window.gapi.client.init({
        apiKey: this.apiKey,
        clientId: this.clientId,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      })

      // Listen for sign-in state changes
      window.gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus.bind(this))

      // Set the initial sign-in state
      this.updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get())

      this.gapi = window.gapi
      this.isInitialized = true
      return true
    } catch (error) {
      console.error("Error initializing Google API client:", error)
      toast({
        title: "Google API Error",
        description: "Failed to initialize Google Drive integration. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  // Update sign-in status
  private updateSigninStatus(isSignedIn: boolean): void {
    this.isAuthenticated = isSignedIn
  }

  // Sign in the user
  public async signIn(): Promise<boolean> {
    if (!this.isInitialized) {
      const initialized = await this.initialize()
      if (!initialized) return false
    }

    try {
      await this.gapi.auth2.getAuthInstance().signIn()
      return this.isAuthenticated
    } catch (error) {
      console.error("Error signing in:", error)
      toast({
        title: "Sign-in Error",
        description: "Failed to sign in to Google Drive. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  // Sign out the user
  public signOut(): void {
    if (this.isInitialized && this.gapi) {
      this.gapi.auth2.getAuthInstance().signOut()
    }
  }

  // Check if user is signed in
  public isSignedIn(): boolean {
    return this.isAuthenticated
  }

  // List files from Google Drive
  public async listFiles(query = ""): Promise<GoogleDriveFile[]> {
    if (!this.isInitialized || !this.isAuthenticated) {
      const signedIn = await this.signIn()
      if (!signedIn) return []
    }

    try {
      const response = await this.gapi.client.drive.files.list({
        pageSize: 50,
        fields:
          "files(id, name, mimeType, webViewLink, thumbnailLink, iconLink, size, createdTime, modifiedTime, owners)",
        q: query || "trashed = false",
      })

      return response.result.files || []
    } catch (error) {
      console.error("Error listing files:", error)
      toast({
        title: "Google Drive Error",
        description: "Failed to list files from Google Drive. Please try again.",
        variant: "destructive",
      })
      return []
    }
  }

  // Get file details
  public async getFile(fileId: string): Promise<GoogleDriveFile | null> {
    if (!this.isInitialized || !this.isAuthenticated) {
      const signedIn = await this.signIn()
      if (!signedIn) return null
    }

    try {
      const response = await this.gapi.client.drive.files.get({
        fileId: fileId,
        fields: "id, name, mimeType, webViewLink, thumbnailLink, iconLink, size, createdTime, modifiedTime, owners",
      })

      return response.result
    } catch (error) {
      console.error("Error getting file:", error)
      toast({
        title: "Google Drive Error",
        description: "Failed to get file details from Google Drive. Please try again.",
        variant: "destructive",
      })
      return null
    }
  }

  // Download file
  public async downloadFile(fileId: string): Promise<Blob | null> {
    if (!this.isInitialized || !this.isAuthenticated) {
      const signedIn = await this.signIn()
      if (!signedIn) return null
    }

    try {
      const response = await this.gapi.client.drive.files.get({
        fileId: fileId,
        alt: "media",
      })

      // Convert the response to a Blob
      const blob = new Blob([response.body], { type: response.headers["Content-Type"] })
      return blob
    } catch (error) {
      console.error("Error downloading file:", error)
      toast({
        title: "Download Error",
        description: "Failed to download file from Google Drive. Please try again.",
        variant: "destructive",
      })
      return null
    }
  }

  // Helper method to load a script
  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script")
      script.src = src
      script.async = true
      script.defer = true
      script.onload = () => resolve()
      script.onerror = (error) => reject(error)
      document.head.appendChild(script)
    })
  }

  // Convert Google Drive file to app file format
  public convertToAppFile(driveFile: GoogleDriveFile): any {
    // Map Google Drive MIME types to app file types
    const mimeTypeToFileType = {
      "application/pdf": "pdf",
      "application/vnd.google-apps.document": "doc",
      "application/vnd.google-apps.spreadsheet": "xls",
      "application/vnd.google-apps.presentation": "ppt",
      "text/plain": "txt",
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
    }

    // Get file type from MIME type
    const fileType = mimeTypeToFileType[driveFile.mimeType] || "unknown"

    // Convert size from string to number
    const size = driveFile.size ? Number.parseInt(driveFile.size) : 0

    // Get author name
    const author = driveFile.owners && driveFile.owners.length > 0 ? driveFile.owners[0].displayName : "Unknown"

    // Return file in app format
    return {
      id: `gdrive-${driveFile.id}`,
      name: driveFile.name,
      type: fileType,
      size: size,
      uploadDate: driveFile.createdTime || new Date().toISOString(),
      author: author,
      coverImage: driveFile.thumbnailLink || null,
      url: driveFile.webViewLink || null,
      sourceType: "google-drive",
      sourceId: driveFile.id,
    }
  }
}

// Export singleton instance
export const googleDriveClient = GoogleDriveClient.getInstance()
