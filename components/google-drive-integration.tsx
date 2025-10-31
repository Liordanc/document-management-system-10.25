"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { ChromeIcon as Google, RefreshCw } from "lucide-react"
import { useGoogleAuth } from "@/lib/auth/use-google-auth"
import { GoogleAuthButton } from "@/components/google-auth-button"
import { File, ImageIcon, Sheet, FileSlidersIcon as Slides } from "lucide-react"

// Function to get the file icon based on file type
const getFileIcon = (fileType) => {
  switch (fileType) {
    case "application/pdf":
    case "application/vnd.google-apps.document":
    case "text/plain":
      return <File className="h-6 w-6 text-muted-foreground" />
    case "application/vnd.google-apps.spreadsheet":
      return <Sheet className="h-6 w-6 text-muted-foreground" />
    case "application/vnd.google-apps.presentation":
      return <Slides className="h-6 w-6 text-muted-foreground" />
    case "image/jpeg":
    case "image/png":
    case "image/gif":
      return <ImageIcon className="h-6 w-6 text-muted-foreground" />
    default:
      return <File className="h-6 w-6 text-muted-foreground" />
  }
}

export function GoogleDriveIntegration() {
  const [isLoading, setIsLoading] = useState(false)
  const [googleFiles, setGoogleFiles] = useState([])
  const [activeTab, setActiveTab] = useState("documents")

  // שימוש ב-hook לניהול האימות מול Google
  const { isAuthenticated, isLoading: authLoading, accessToken, logout } = useGoogleAuth()

  // טעינת קבצים מ-Google Drive כאשר המשתמש מאומת
  useEffect(() => {
    if (isAuthenticated && accessToken) {
      loadGoogleFiles()
    }
  }, [isAuthenticated, accessToken, activeTab])

  // פונקציה לטעינת קבצים מ-Google Drive
  const loadGoogleFiles = async () => {
    if (!isAuthenticated || !accessToken) return

    setIsLoading(true)

    try {
      // יצירת שאילתה בהתאם לקטגוריה הנבחרת
      let query = "trashed = false"

      switch (activeTab) {
        case "documents":
          query +=
            " and (mimeType = 'application/pdf' or mimeType = 'application/vnd.google-apps.document' or mimeType = 'text/plain')"
          break
        case "spreadsheets":
          query += " and (mimeType = 'application/vnd.google-apps.spreadsheet')"
          break
        case "presentations":
          query += " and (mimeType = 'application/vnd.google-apps.presentation')"
          break
        case "images":
          query += " and (mimeType contains 'image/')"
          break
      }

      // קריאה ל-API של Google Drive
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,mimeType,webViewLink,thumbnailLink,iconLink,size,createdTime,modifiedTime,owners)`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error("Failed to fetch files from Google Drive")
      }

      const data = await response.json()

      // המרת הקבצים לפורמט של האפליקציה
      const convertedFiles = data.files.map((file) => ({
        id: `gdrive-${file.id}`,
        name: file.name,
        type: getFileTypeFromMimeType(file.mimeType),
        size: file.size ? Number.parseInt(file.size) : 0,
        uploadDate: file.createdTime || new Date().toISOString(),
        author: file.owners && file.owners.length > 0 ? file.owners[0].displayName : "Unknown",
        coverImage: file.thumbnailLink || null,
        url: file.webViewLink || null,
        sourceType: "google-drive",
        sourceId: file.id,
        mimeType: file.mimeType,
      }))

      setGoogleFiles(convertedFiles)
    } catch (error) {
      console.error("Error loading Google Drive files:", error)
      toast({
        title: "Error",
        description: "Failed to load files from Google Drive. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // פונקציה להמרת MIME type לסוג קובץ
  const getFileTypeFromMimeType = (mimeType) => {
    const mimeTypeMap = {
      "application/pdf": "pdf",
      "application/vnd.google-apps.document": "doc",
      "application/vnd.google-apps.spreadsheet": "xls",
      "application/vnd.google-apps.presentation": "ppt",
      "text/plain": "txt",
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
    }

    return mimeTypeMap[mimeType] || "unknown"
  }

  // טיפול בשינוי קטגוריה
  const handleTabChange = (value) => {
    setActiveTab(value)
  }

  // אם המשתמש לא מאומת, הצג כפתור התחברות
  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Google Drive Integration</CardTitle>
          <CardDescription>
            Connect to your Google Drive to access your documents, spreadsheets, presentations, and images.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          <Google className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-center text-muted-foreground mb-4">
            Sign in to your Google account to access your files from Google Drive.
          </p>
          <GoogleAuthButton />
        </CardContent>
      </Card>
    )
  }

  // אם המשתמש מאומת, הצג את הקבצים
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Google Drive Files</CardTitle>
          <CardDescription>Access your files from Google Drive</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={loadGoogleFiles} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <GoogleAuthButton isAuthenticated={true} onLogout={logout} />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="documents" onValueChange={handleTabChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="spreadsheets">Spreadsheets</TabsTrigger>
            <TabsTrigger value="presentations">Presentations</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>

          {isLoading || authLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-sm text-muted-foreground">Loading files from Google Drive...</p>
              </div>
            </div>
          ) : googleFiles.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {googleFiles.map((file) => (
                <Card key={file.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    {file.coverImage ? (
                      <div className="relative h-[150px] w-full">
                        <img
                          src={file.coverImage || "/placeholder.svg"}
                          alt={file.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-[150px] bg-muted/50">
                        {getFileIcon(file.mimeType)}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-col items-start p-4">
                    <div className="flex items-center justify-between w-full">
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:underline truncate max-w-[80%]"
                      >
                        {file.name}
                      </a>
                    </div>
                    <div className="flex items-center justify-between w-full mt-2 text-xs text-muted-foreground">
                      <span>{file.type.toUpperCase()}</span>
                      <span>{new Date(file.uploadDate).toLocaleDateString()}</span>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-center text-muted-foreground">No {activeTab} found in your Google Drive.</p>
              <Button variant="outline" className="mt-4" onClick={loadGoogleFiles}>
                Refresh
              </Button>
            </div>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}
