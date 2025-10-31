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

// Mock data for file types
const fileTypes = {
  pdf: { icon: FileText, color: "text-blue-500", category: "documents" },
  doc: { icon: FileText, color: "text-blue-500", category: "documents" },
  txt: { icon: FileText, color: "text-blue-500", category: "documents" },
  xls: { icon: FileSpreadsheet, color: "text-green-500", category: "spreadsheets" },
  ppt: { icon: FilePresentation, color: "text-yellow-500", category: "presentations" },
  jpg: { icon: ImageIcon, color: "text-purple-500", category: "images" },
  png: { icon: ImageIcon, color: "text-purple-500", category: "images" },
  gif: { icon: ImageIcon, color: "text-purple-500", category: "images" },
}

// Generate mock files
const generateMockFiles = () => {
  const files = []
  const fileNames = [
    "Annual Report",
    "Project Proposal",
    "Meeting Notes",
    "Budget Forecast",
    "Marketing Plan",
    "Product Roadmap",
    "Team Photo",
    "Logo Design",
    "User Research",
    "Client Presentation",
    "Sales Data",
    "Vacation Pictures",
  ]

  const extensions = ["pdf", "doc", "txt", "xls", "ppt", "jpg", "png", "gif"]

  for (let i = 0; i < 20; i++) {
    const nameIndex = Math.floor(Math.random() * fileNames.length)
    const extIndex = Math.floor(Math.random() * extensions.length)
    const ext = extensions[extIndex]

    files.push({
      id: `file-${i}`,
      name: `${fileNames[nameIndex]}.${ext}`,
      type: ext,
      size: Math.floor(Math.random() * 10000000),
      uploadDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      author: Math.random() > 0.2 ? "John Doe" : "Unknown",
      coverImage: ext.match(/jpg|png|gif/) ? `/placeholder.svg?height=200&width=200` : null,
    })
  }

  return files
}

export function FileGrid({ category = null }) {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const fetchFiles = async () => {
      setLoading(true)
      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        let allFiles = generateMockFiles()

        // Filter by category if provided
        if (category) {
          allFiles = allFiles.filter((file) => fileTypes[file.type]?.category === category)
        }

        setFiles(allFiles)
      } catch (error) {
        console.error("Error fetching files:", error)
        toast({
          title: "Error",
          description: "Failed to load files. Please try again.",
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

  const handleDelete = (fileId) => {
    setFiles(files.filter((file) => file.id !== fileId))
    toast({
      title: "File Deleted",
      description: "The file has been successfully deleted.",
    })
  }

  const handleDownload = (file) => {
    toast({
      title: "Download Started",
      description: `Downloading ${file.name}...`,
    })
  }

  const handleShare = (file) => {
    toast({
      title: "Share Link Created",
      description: `Share link for ${file.name} has been copied to clipboard.`,
    })
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
      {files.map((file) => {
        const FileIcon = fileTypes[file.type]?.icon || FileText
        const iconColor = fileTypes[file.type]?.color || "text-gray-500"

        return (
          <Card key={file.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <Link href={`/view/${file.id}`}>
              <CardContent className="p-0">
                {file.coverImage ? (
                  <div className="relative h-[200px] w-full">
                    <Image src={file.coverImage || "/placeholder.svg"} alt={file.name} fill className="object-cover" />
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
                <Link href={`/view/${file.id}`} className="font-medium hover:underline">
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
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare(file)}>
                      <Share className="mr-2 h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDelete(file.id)} className="text-red-600">
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center justify-between w-full mt-2 text-xs text-muted-foreground">
                <span>{formatFileSize(file.size)}</span>
                <span>{formatDate(file.uploadDate)}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">Author: {file.author}</div>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}

