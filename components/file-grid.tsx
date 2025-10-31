"use client"

import type React from "react"

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
  FileIcon,
  ImageIcon,
  Download,
  Trash,
  Share,
} from "@/components/icons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { FileMergeDialog } from "@/components/file-merge-dialog"

// Define the CategoryType
export type CategoryType = "documents" | "spreadsheets" | "presentations" | "images" | null

// Define the File interface
export interface FileItem {
  id: string
  name: string
  type: string
  size: number
  uploadDate: string
  author: string
  coverImage: string | null
}

// Define the FileGridProps interface
export interface FileGridProps {
  category?: CategoryType
  searchQuery?: string
  dateFrom?: Date
  dateTo?: Date
  author?: string
  sortBy?: "date" | "name" | "size"
  sortOrder?: "asc" | "desc"
}

// Define the file types with proper typing
const fileTypes: Record<string, { icon: React.ElementType; color: string; category: string }> = {
  pdf: { icon: FileText, color: "text-primary", category: "documents" },
  doc: { icon: FileText, color: "text-primary", category: "documents" },
  txt: { icon: FileText, color: "text-primary", category: "documents" },
  xls: { icon: FileSpreadsheet, color: "text-accent", category: "spreadsheets" },
  ppt: { icon: FileIcon, color: "text-accent", category: "presentations" },
  jpg: { icon: ImageIcon, color: "text-primary", category: "images" },
  png: { icon: ImageIcon, color: "text-primary", category: "images" },
  gif: { icon: ImageIcon, color: "text-primary", category: "images" },
}

// Generate mock files
const generateMockFiles = (): FileItem[] => {
  const files: FileItem[] = []
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

export function FileGrid({
  category = null,
  searchQuery = "",
  dateFrom,
  dateTo,
  author,
  sortBy = "date",
  sortOrder = "desc",
}: FileGridProps) {
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([])
  const [showMergeDialog, setShowMergeDialog] = useState(false)

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
          allFiles = allFiles.filter((file) => {
            const fileType = fileTypes[file.type]
            return fileType && fileType.category === category
          })
        }

        // Filter by search query if provided
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          allFiles = allFiles.filter(
            (file) => file.name.toLowerCase().includes(query) || file.author.toLowerCase().includes(query),
          )
        }

        // Filter by date range if provided
        if (dateFrom) {
          const fromDate = new Date(dateFrom)
          allFiles = allFiles.filter((file) => new Date(file.uploadDate) >= fromDate)
        }

        if (dateTo) {
          const toDate = new Date(dateTo)
          toDate.setHours(23, 59, 59, 999) // End of the day
          allFiles = allFiles.filter((file) => new Date(file.uploadDate) <= toDate)
        }

        // Filter by author if provided
        if (author) {
          allFiles = allFiles.filter((file) => file.author.toLowerCase().includes(author.toLowerCase()))
        }

        // Sort files
        allFiles.sort((a, b) => {
          if (sortBy === "date") {
            return sortOrder === "asc"
              ? new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()
              : new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
          } else if (sortBy === "name") {
            return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
          } else if (sortBy === "size") {
            return sortOrder === "asc" ? a.size - b.size : b.size - a.size
          }
          return 0
        })

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
  }, [category, searchQuery, dateFrom, dateTo, author, sortBy, sortOrder])

  const toggleFileSelection = (file: FileItem) => {
    setSelectedFiles((prev) => {
      const isSelected = prev.some((f) => f.id === file.id)
      if (isSelected) {
        return prev.filter((f) => f.id !== file.id)
      } else {
        return [...prev, file]
      }
    })
  }

  const handleMergeFiles = () => {
    if (selectedFiles.length < 2) {
      toast({
        title: "Select Files",
        description: "Please select at least two files to merge.",
        variant: "destructive",
      })
      return
    }

    setShowMergeDialog(true)
  }

  interface MergedFile {
    name: string
    type: string
    size: number
    uploadDate: string
    author: string
  }

  const handleCompleteMerge = (mergedFile: MergedFile) => {
    // Add the merged file to the list
    const newFile: FileItem = {
      id: `file-merged-${Date.now()}`,
      ...mergedFile,
      coverImage: null,
    }

    setFiles((prev) => [newFile, ...prev.filter((file) => !selectedFiles.some((f) => f.id === file.id))])
    setSelectedFiles([])
    setShowMergeDialog(false)

    toast({
      title: "Files Merged",
      description: `Successfully merged ${selectedFiles.length} files.`,
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
    return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  const handleDelete = (fileId: string) => {
    setFiles(files.filter((file) => file.id !== fileId))
    toast({
      title: "File Deleted",
      description: "The file has been successfully deleted.",
    })
  }

  const handleDownload = (file: FileItem) => {
    toast({
      title: "Download Started",
      description: `Downloading ${file.name}...`,
    })
  }

  const handleShare = (file: FileItem) => {
    toast({
      title: "Share Link Created",
      description: `Share link for ${file.name} has been copied to clipboard.`,
    })
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
          <FileText className="h-10 w-10 text-foreground-secondary" />
        </div>
        <h3 className="mt-4 text-lg font-medium">No files found</h3>
        <p className="text-sm text-foreground-secondary">
          {category ? `No ${category} have been uploaded yet.` : "No files have been uploaded yet."}
        </p>
        <Button className="mt-4" variant="outline">
          Upload Files
        </Button>
      </div>
    )
  }

  const renderMergeButton = () => {
    if (selectedFiles.length > 1) {
      return (
        <div className="fixed bottom-6 right-6 z-10">
          <Button onClick={handleMergeFiles} className="shadow-card">
            Merge {selectedFiles.length} Files
          </Button>
        </div>
      )
    }
    return null
  }

  const renderMergeDialog = () => {
    return (
      <FileMergeDialog
        isOpen={showMergeDialog}
        onClose={() => setShowMergeDialog(false)}
        selectedFiles={selectedFiles}
        onMerge={handleCompleteMerge}
      />
    )
  }

  return (
    <>
      {renderMergeButton()}
      {renderMergeDialog()}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {files.map((file) => {
          // Safe access to fileTypes with type checking
          const fileTypeInfo = fileTypes[file.type] || { icon: FileText, color: "text-foreground-secondary" }
          const FileIcon = fileTypeInfo.icon
          const iconColor = fileTypeInfo.color
          const isSelected = selectedFiles.some((f) => f.id === file.id)

          return (
            <Card
              key={file.id}
              className={`overflow-hidden hover:shadow-lg transition-shadow duration-300 ${isSelected ? "ring-2 ring-primary" : ""}`}
            >
              <div className="absolute top-2 left-2 z-10">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleFileSelection(file)}
                  className="h-5 w-5 bg-card/80 backdrop-blur-sm"
                />
              </div>

              <Link href={`/view/${file.id}`}>
                <CardContent className="p-0">
                  {file.coverImage ? (
                    <div className="relative h-[200px] w-full">
                      <Image
                        src={file.coverImage || "/placeholder.svg"}
                        alt={file.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[200px] bg-background">
                      <FileIcon className={`h-20 w-20 ${iconColor}`} />
                    </div>
                  )}
                </CardContent>
              </Link>
              <CardFooter className="flex flex-col items-start p-4">
                <div className="flex items-center justify-between w-full">
                  <Link
                    href={`/view/${file.id}`}
                    className="font-medium hover:text-primary transition-colors duration-300"
                  >
                    {file.name}
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-lg">
                      <DropdownMenuItem onClick={() => handleDownload(file)} className="rounded-md">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare(file)} className="rounded-md">
                        <Share className="mr-2 h-4 w-4" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => toggleFileSelection(file)} className="rounded-md">
                        <Checkbox checked={isSelected} className="mr-2 h-4 w-4" />
                        {isSelected ? "Deselect" : "Select"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(file.id)} className="text-destructive rounded-md">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center justify-between w-full mt-2 text-xs text-foreground-secondary">
                  <span>{formatFileSize(file.size)}</span>
                  <span>{formatDate(file.uploadDate)}</span>
                </div>
                <div className="text-xs text-foreground-secondary mt-1">Author: {file.author}</div>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </>
  )
}
