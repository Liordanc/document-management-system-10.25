"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { Upload, X, FileText, FileSpreadsheet, FileIcon as FilePresentation, ImageIcon } from "@/components/icons"

const ACCEPTED_FILE_TYPES = [
  // PDF
  "application/pdf",
  // Google Docs (will be handled via API in a real app)
  "application/vnd.google-apps.document",
  // Google Sheets
  "application/vnd.google-apps.spreadsheet",
  // Google Slides
  "application/vnd.google-apps.presentation",
  // Text files
  "text/plain",
  // Images
  "image/jpeg",
  "image/png",
  "image/gif",
]

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export function FileUploader() {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const validateFile = (file) => {
    if (!ACCEPTED_FILE_TYPES.includes(file.type) && !file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: `${file.name} is not a supported file type.`,
        variant: "destructive",
      })
      return false
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: `${file.name} exceeds the maximum file size of 50MB.`,
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const processFiles = (fileList) => {
    const validFiles = Array.from(fileList).filter(validateFile)
    setFiles((prevFiles) => [...prevFiles, ...validFiles])
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files)
    }
  }

  const handleFileInputChange = (e) => {
    if (e.target.files.length > 0) {
      processFiles(e.target.files)
    }
  }

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }

  const uploadFiles = async () => {
    if (files.length === 0) return

    setUploading(true)
    setProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval)
          return 100
        }
        return prevProgress + 5
      })
    }, 200)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Upload Complete",
        description: `Successfully uploaded ${files.length} file${files.length > 1 ? "s" : ""}.`,
      })

      setFiles([])
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your files. Please try again.",
        variant: "destructive",
      })
    } finally {
      clearInterval(interval)
      setUploading(false)
      setProgress(0)
    }
  }

  const getFileIcon = (fileType) => {
    if (
      fileType === "application/pdf" ||
      fileType === "application/vnd.google-apps.document" ||
      fileType === "text/plain"
    ) {
      return <FileText className="h-6 w-6 text-blue-500" />
    } else if (fileType === "application/vnd.google-apps.spreadsheet") {
      return <FileSpreadsheet className="h-6 w-6 text-green-500" />
    } else if (fileType === "application/vnd.google-apps.presentation") {
      return <FilePresentation className="h-6 w-6 text-yellow-500" />
    } else if (fileType.startsWith("image/")) {
      return <ImageIcon className="h-6 w-6 text-purple-500" />
    } else {
      return <FileText className="h-6 w-6 text-gray-500" />
    }
  }

  return (
    <div className="space-y-4">
      <Card
        className={`border-2 border-dashed ${
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
        } rounded-lg`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center space-y-4 px-6 py-10 text-center">
          <div className="rounded-full bg-primary/10 p-4">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Drag & drop files here</h3>
            <p className="text-sm text-muted-foreground">
              or click to browse files (PDF, Google Docs, Sheets, Slides, TXT, Images)
            </p>
          </div>
          <Button variant="secondary" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            Browse Files
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            accept={ACCEPTED_FILE_TYPES.join(",")}
            onChange={handleFileInputChange}
            disabled={uploading}
          />
        </CardContent>
      </Card>

      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium">Selected Files ({files.length})</h3>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={`${file.name}-${index}`} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.type)}
                  <div className="space-y-1">
                    <p className="font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeFile(index)} disabled={uploading}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Uploading...</span>
                <span className="text-sm font-medium">{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setFiles([])} disabled={uploading}>
              Clear All
            </Button>
            <Button onClick={uploadFiles} disabled={uploading}>
              {uploading ? "Uploading..." : "Upload Files"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
