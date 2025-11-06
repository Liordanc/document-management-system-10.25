import { google } from "googleapis"

export interface DriveFile {
  id: string
  name: string
  mimeType: string
  size?: string
  modifiedTime: string
  webViewLink?: string
  webContentLink?: string
  thumbnailLink?: string
  iconLink?: string
  owners?: Array<{ displayName: string; emailAddress: string }>
}

export class GoogleDriveService {
  private drive

  constructor(accessToken: string) {
    const auth = new google.auth.OAuth2()
    auth.setCredentials({ access_token: accessToken })

    this.drive = google.drive({ version: "v3", auth })
  }

  /**
   * List files from Google Drive
   */
  async listFiles(pageSize: number = 50, pageToken?: string) {
    try {
      const response = await this.drive.files.list({
        pageSize,
        pageToken,
        fields:
          "nextPageToken, files(id, name, mimeType, size, modifiedTime, webViewLink, webContentLink, thumbnailLink, iconLink, owners)",
        q: "trashed=false",
        orderBy: "modifiedTime desc",
      })

      return {
        files: response.data.files as DriveFile[],
        nextPageToken: response.data.nextPageToken,
      }
    } catch (error) {
      console.error("Error listing files:", error)
      throw new Error("Failed to list files from Google Drive")
    }
  }

  /**
   * Get a specific file by ID
   */
  async getFile(fileId: string) {
    try {
      const response = await this.drive.files.get({
        fileId,
        fields:
          "id, name, mimeType, size, modifiedTime, webViewLink, webContentLink, thumbnailLink, iconLink, owners, description",
      })

      return response.data as DriveFile
    } catch (error) {
      console.error("Error getting file:", error)
      throw new Error("Failed to get file from Google Drive")
    }
  }

  /**
   * Upload a file to Google Drive
   */
  async uploadFile(file: {
    name: string
    mimeType: string
    buffer: Buffer
  }) {
    try {
      const response = await this.drive.files.create({
        requestBody: {
          name: file.name,
          mimeType: file.mimeType,
        },
        media: {
          mimeType: file.mimeType,
          body: require("stream").Readable.from(file.buffer),
        },
        fields: "id, name, mimeType, size, modifiedTime, webViewLink",
      })

      return response.data as DriveFile
    } catch (error) {
      console.error("Error uploading file:", error)
      throw new Error("Failed to upload file to Google Drive")
    }
  }

  /**
   * Delete a file from Google Drive
   */
  async deleteFile(fileId: string) {
    try {
      await this.drive.files.delete({
        fileId,
      })
      return { success: true }
    } catch (error) {
      console.error("Error deleting file:", error)
      throw new Error("Failed to delete file from Google Drive")
    }
  }

  /**
   * Create a permission (share file)
   */
  async shareFile(fileId: string, emailAddress?: string) {
    try {
      // If no email provided, make it accessible via link (anyone with link can view)
      const permission = emailAddress
        ? {
            type: "user" as const,
            role: "reader" as const,
            emailAddress,
          }
        : {
            type: "anyone" as const,
            role: "reader" as const,
          }

      await this.drive.permissions.create({
        fileId,
        requestBody: permission,
      })

      // Get the file to return the webViewLink
      const file = await this.getFile(fileId)
      return { success: true, webViewLink: file.webViewLink }
    } catch (error) {
      console.error("Error sharing file:", error)
      throw new Error("Failed to share file")
    }
  }

  /**
   * Download file content
   */
  async downloadFile(fileId: string) {
    try {
      const response = await this.drive.files.get(
        {
          fileId,
          alt: "media",
        },
        { responseType: "stream" }
      )

      return response.data
    } catch (error) {
      console.error("Error downloading file:", error)
      throw new Error("Failed to download file from Google Drive")
    }
  }

  /**
   * Search files by name or query
   */
  async searchFiles(query: string) {
    try {
      const response = await this.drive.files.list({
        q: `name contains '${query}' and trashed=false`,
        fields:
          "files(id, name, mimeType, size, modifiedTime, webViewLink, thumbnailLink, iconLink)",
        orderBy: "modifiedTime desc",
      })

      return response.data.files as DriveFile[]
    } catch (error) {
      console.error("Error searching files:", error)
      throw new Error("Failed to search files")
    }
  }

  /**
   * Get files by MIME type category
   */
  async getFilesByCategory(category: string) {
    let mimeQuery = ""

    switch (category) {
      case "documents":
        mimeQuery =
          "(mimeType='application/pdf' or mimeType contains 'document' or mimeType='text/plain')"
        break
      case "spreadsheets":
        mimeQuery = "mimeType contains 'spreadsheet'"
        break
      case "presentations":
        mimeQuery = "mimeType contains 'presentation'"
        break
      case "images":
        mimeQuery = "mimeType contains 'image/'"
        break
      default:
        mimeQuery = "trashed=false"
    }

    try {
      const response = await this.drive.files.list({
        q: `${mimeQuery} and trashed=false`,
        fields:
          "files(id, name, mimeType, size, modifiedTime, webViewLink, thumbnailLink, iconLink)",
        orderBy: "modifiedTime desc",
      })

      return response.data.files as DriveFile[]
    } catch (error) {
      console.error("Error getting files by category:", error)
      throw new Error("Failed to get files by category")
    }
  }
}

/**
 * Get MIME type category for UI display
 */
export function getMimeTypeCategory(mimeType: string): string {
  if (
    mimeType === "application/pdf" ||
    mimeType.includes("document") ||
    mimeType === "text/plain"
  ) {
    return "documents"
  }
  if (mimeType.includes("spreadsheet")) {
    return "spreadsheets"
  }
  if (mimeType.includes("presentation")) {
    return "presentations"
  }
  if (mimeType.startsWith("image/")) {
    return "images"
  }
  return "other"
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
}
