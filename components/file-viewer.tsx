"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from "lucide-react"

export function FileViewer({ file, loopMode = false }) {
  const [loading, setLoading] = useState(true)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [rotation, setRotation] = useState(0)
  const viewerRef = useRef(null)

  useEffect(() => {
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

  const renderFileContent = () => {
    try {
      switch (file.type) {
        case "pdf":
          return (
            <div className="flex items-center justify-center h-[600px] bg-muted/30">
              <iframe src={file.url} className="w-full h-full" title={file.name} />
            </div>
          )
        case "jpg":
        case "png":
        case "gif":
          return (
            <div className="flex items-center justify-center h-[600px] bg-muted/30 overflow-hidden">
              <div
                style={{
                  transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                  transition: "transform 0.3s ease",
                }}
              >
                <Image
                  src={file.url || "/placeholder.svg?height=800&width=600"}
                  alt={file.name}
                  width={800}
                  height={600}
                  className="object-contain"
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
        default:
          return (
            <div className="flex flex-col items-center justify-center h-[600px] bg-muted/30">
              <p className="text-lg font-medium">Preview not available</p>
              <p className="text-sm text-muted-foreground">This file type cannot be previewed directly.</p>
              <Button className="mt-4">Download to View</Button>
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
    <div className="relative" ref={viewerRef}>
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
            <Button variant="ghost" size="icon" onClick={handleZoomOut}>
              <ZoomOut className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleZoomIn}>
              <ZoomIn className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleRotate}>
              <RotateCw className="h-5 w-5" />
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

