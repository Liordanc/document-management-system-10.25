"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  MoreHorizontal,
  FileText,
  FileSpreadsheet,
  FileIcon as FilePresentation,
  ImageIcon,
  Download,
  Trash,
  Share,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"

// Helper function to get icon and color based on MIME type
const getFileIconFromMimeType = (mimeType: string) => {
  if (
    mimeType === "application/pdf" ||
    mimeType.includes("document") ||
    mimeType === "text/plain"
  ) {
    return { icon: FileText, color: "text-blue-500" }
  }
  if (mimeType.includes("spreadsheet")) {
    return { icon: FileSpreadsheet, color: "text-green-500" }
  }
  if (mimeType.includes("presentation")) {
    return { icon: FilePresentation, color: "text-yellow-500" }
  }
  if (mimeType.startsWith("image/")) {
    return { icon: ImageIcon, color: "text-purple-500" }
  }
  return { icon: FileText, color: "text-gray-500" }
}

export function FileGrid({ category = null }) {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true)
      try {
        let response

        if (category) {
          // Fetch files by category
          response = await fetch(`/api/drive/category?type=${category}`)
        } else {
          // Fetch all files
          response = await fetch("/api/drive/files")
        }

        if (!response.ok) {
          throw new Error("Failed to fetch files")
        }

        const data = await response.json()

        // Transform Google Drive files to our format
        const transformedFiles = (category ? data.files : data.files || []).map((file: any) => ({
          id: file.id,
          name: file.name,
          mimeType: file.mimeType,
          size: parseInt(file.size || "0"),
          modifiedTime: file.modifiedTime,
          thumbnailLink: file.thumbnailLink,
          iconLink: file.iconLink,
          webViewLink: file.webViewLink,
          owners: file.owners,
        }))

        setFiles(transformedFiles)
      } catch (error) {
        console.error("Error fetching files:", error)
        toast({
          title: "Error",
          description: "Failed to load files. Please sign in or try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchFiles()
  }, [category])

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`
    return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  const handleDelete = async (fileId: string) => {
    try {
      const response = await fetch("/api/drive/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete file")
      }

      setFiles(files.filter((file: any) => file.id !== fileId))
      toast({
        title: "File Deleted",
        description: "The file has been successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting file:", error)
      toast({
        title: "Error",
        description: "Failed to delete file. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDownload = (file: any) => {
    // Open the file's webContentLink or webViewLink
    if (file.webViewLink) {
      window.open(file.webViewLink, "_blank")
      toast({
        title: "Opening File",
        description: `Opening ${file.name} in Google Drive...`,
      })
    } else {
      toast({
        title: "Error",
        description: "Download link not available for this file.",
        variant: "destructive",
      })
    }
  }

  const handleShare = async (file: any) => {
    try {
      const response = await fetch("/api/drive/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId: file.id }),
      })

      if (!response.ok) {
        throw new Error("Failed to share file")
      }

      const data = await response.json()

      // Copy link to clipboard
      if (data.webViewLink) {
        await navigator.clipboard.writeText(data.webViewLink)
        toast({
          title: "Share Link Copied",
          description: `Share link for ${file.name} has been copied to clipboard.`,
        })
      }
    } catch (error) {
      console.error("Error sharing file:", error)
      toast({
        title: "Error",
        description: "Failed to share file. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <Skeleton className="h-[200px] w-full" />
            </CardContent>
            <CardFooter className="flex flex-col items-start p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="rounded-full bg-muted p-6">
          <FileText className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-medium">No files found</h3>
        <p className="text-sm text-muted-foreground">
          {category ? `No ${category} have been uploaded yet.` : "No files have been uploaded yet."}
        </p>
        <Button className="mt-4" variant="outline">
          Upload Files
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {files.map((file: any) => {
        const { icon: FileIcon, color: iconColor } = getFileIconFromMimeType(
          file.mimeType
        )

        return (
          <Card key={file.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <Link href={`/view/${file.id}`}>
              <CardContent className="p-0">
                {file.thumbnailLink ? (
                  <div className="relative h-[200px] w-full">
                    <Image
                      src={file.thumbnailLink}
                      alt={file.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[200px] bg-muted/50">
                    <FileIcon className={`h-20 w-20 ${iconColor}`} />
                  </div>
                )}
              </CardContent>
            </Link>
            <CardFooter className="flex flex-col items-start p-4">
              <div className="flex items-center justify-between w-full">
                <Link
                  href={`/view/${file.id}`}
                  className="font-medium hover:underline truncate max-w-[180px]"
                  title={file.name}
                >
                  {file.name}
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleDownload(file)}>
                      <Download className="mr-2 h-4 w-4" />
                      Open in Drive
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare(file)}>
                      <Share className="mr-2 h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDelete(file.id)}
                      className="text-red-600"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center justify-between w-full mt-2 text-xs text-muted-foreground">
                <span>{formatFileSize(file.size)}</span>
                <span>{formatDate(file.modifiedTime)}</span>
              </div>
              {file.owners && file.owners.length > 0 && (
                <div className="text-xs text-muted-foreground mt-1">
                  Owner: {file.owners[0].displayName || file.owners[0].emailAddress}
                </div>
              )}
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}

