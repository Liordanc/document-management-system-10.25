"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Download, ExternalLink } from "@/components/icons"

interface DocumentViewerProps {
  file: {
    id: string
    name: string
    type: string
    url: string
    size?: number
    mimeType?: string
  }
  loopMode?: boolean
}

export function DocumentViewer({ file, loopMode = false }: DocumentViewerProps) {
  const [loading, setLoading] = useState(true)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [viewerType, setViewerType] = useState<"iframe" | "image" | "office" | "text" | "unsupported">("unsupported")

  useEffect(() => {
    // Determine the appropriate viewer based on file type or MIME type
    const determineViewerType = () => {
      const fileType = file.type.toLowerCase()
      const mimeType = file.mimeType?.toLowerCase() || ""

      // Check for images
      if (fileType.match(/jpg|jpeg|png|gif|bmp|webp/) || mimeType.startsWith("image/")) {
        return "image"
      }

      // Check for PDF
      if (fileType === "pdf" || mimeType === "application/pdf") {
        return "iframe"
      }

      // Check for Office documents
      if (
        fileType.match(/doc|docx|xls|xlsx|ppt|pptx/) ||
        mimeType.match(/application\/vnd.openxmlformats|application\/vnd.ms-/)
      ) {
        return "office"
      }

      // Check for text files
      if (fileType === "txt" || mimeType === "text/plain") {
        return "text"
      }

      // Default to unsupported
      return "unsupported"
    }

    setViewerType(determineViewerType())

    // Simulate loading the file
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [file])

  const handleZoomIn = () => {
    if (zoomLevel < 3) {
      setZoomLevel(zoomLevel + 0.25)
    }
  }

  const handleZoomOut = () => {
    if (zoomLevel > 0.5) {
      setZoomLevel(zoomLevel - 0.25)
    }
  }

  const handleRotate = () => {
    setRotation((rotation + 90) % 360)
  }

  const handlePrevious = () => {
    toast({
      title: "Previous File",
      description: "Loading previous file...",
    })
  }

  const handleNext = () => {
    toast({
      title: "Next File",
      description: "Loading next file...",
    })
  }

  const handleDownload = () => {
    // Create a temporary anchor element to trigger download
    const a = document.createElement("a")
    a.href = file.url
    a.download = file.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    toast({
      title: "Download Started",
      description: `Downloading ${file.name}...`,
    })
  }

  const handleOpenExternal = () => {
    window.open(file.url, "_blank")

    toast({
      title: "Opening File",
      description: `Opening ${file.name} in a new tab...`,
    })
  }

  const renderOfficeViewer = () => {
    // For Office documents, use Microsoft Office Online Viewer or Google Docs Viewer
    const officeOnlineUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(file.url)}`
    const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(file.url)}&embedded=true`

    return (
      <iframe
        src={officeOnlineUrl}
        className="w-full h-[600px] border-0"
        title={file.name}
        onError={(e) => {
          // Fallback to Google Docs viewer if Office Online fails
          e.currentTarget.src = googleDocsUrl
        }}
      />
    )
  }

  const renderTextViewer = async () => {
    try {
      const response = await fetch(file.url)
      if (!response.ok) throw new Error("Failed to fetch text file")

      const text = await response.text()
      return (
        <div className="w-full h-[600px] bg-muted/30 p-4 overflow-auto">
          <pre className="whitespace-pre-wrap font-mono text-sm">{text}</pre>
        </div>
      )
    } catch (error) {
      console.error("Error rendering text file:", error)
      return (
        <div className="flex flex-col items-center justify-center h-[600px] bg-muted/30">
          <p className="text-lg font-medium text-red-500">Error loading text file</p>
          <Button className="mt-4" onClick={handleDownload}>
            Download to View
          </Button>
        </div>
      )
    }
  }

  const renderFileContent = () => {
    try {
      switch (viewerType) {
        case "iframe":
          return (
            <div className="flex items-center justify-center h-[600px] bg-muted/30">
              <iframe src={file.url} className="w-full h-full" title={file.name} />
            </div>
          )
        case "image":
          return (
            <div className="flex items-center justify-center h-[600px] bg-muted/30 overflow-hidden">
              <div
                style={{
                  transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                  transition: "transform 0.3s ease",
                }}
              >
                <Image
                  src={file.url || "/placeholder.svg"}
                  alt={file.name}
                  className="object-contain max-h-[580px]"
                  width={800}
                  height={600}
                  onError={() => {
                    toast({
                      title: "Error",
                      description: "Failed to load image. Using placeholder instead.",
                      variant: "destructive",
                    })
                  }}
                />
              </div>
            </div>
          )
        case "office":
          return renderOfficeViewer()
        case "text":
          return renderTextViewer()
        default:
          return (
            <div className="flex flex-col items-center justify-center h-[600px] bg-muted/30">
              <p className="text-lg font-medium">Preview not available</p>
              <p className="text-sm text-muted-foreground">This file type cannot be previewed directly.</p>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleDownload}>Download</Button>
                <Button variant="outline" onClick={handleOpenExternal}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open in New Tab
                </Button>
              </div>
            </div>
          )
      }
    } catch (error) {
      console.error("Error rendering file:", error)
      return (
        <div className="flex flex-col items-center justify-center h-[600px] bg-muted/30">
          <p className="text-lg font-medium text-red-500">Error displaying file</p>
          <p className="text-sm text-muted-foreground">There was an error displaying this file.</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      )
    }
  }

  return (
    <div className="relative">
      {loading ? (
        <div className="flex items-center justify-center h-[600px] bg-muted/30">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-sm text-muted-foreground">Loading file...</p>
          </div>
        </div>
      ) : (
        <>
          {renderFileContent()}

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-background/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
            <Button variant="ghost" size="icon" onClick={handlePrevious}>
              <ChevronLeft className="h-5 w-5" />
            </Button>

            {viewerType === "image" && (
              <>
                <Button variant="ghost" size="icon" onClick={handleZoomOut}>
                  <ZoomOut className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleZoomIn}>
                  <ZoomIn className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleRotate}>
                  <RotateCw className="h-5 w-5" />
                </Button>
              </>
            )}

            <Button variant="ghost" size="icon" onClick={handleDownload}>
              <Download className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" onClick={handleNext}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
