"use client"

import { useEffect } from "react"
import { useState } from "react"
import { Suspense } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, Download, Maximize, Minimize, RotateCw } from "@/components/icons"
import { DynamicDocumentViewer, DynamicFileMetadata } from "@/lib/dynamic-imports"

export default function ViewFile() {
  const router = useRouter()
  const params = useParams()
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [loopMode, setLoopMode] = useState(false)

  useEffect(() => {
    // In a real app, fetch the file data from an API
    const fetchFile = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        const fileData = {
          id: params.id,
          name: "Sample Document.pdf",
          type: "pdf",
          size: 2500000,
          uploadDate: new Date().toISOString(),
          author: "John Doe",
          url: "/placeholder.svg?height=800&width=600",
          coverImage: "/placeholder.svg?height=400&width=300",
        }

        setFile(fileData)
      } catch (error) {
        console.error("Error fetching file:", error)
        toast({
          title: "Error",
          description: "Failed to load the file. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchFile()
  }, [params.id])

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        toast({
          title: "Error",
          description: `Error attempting to enable full-screen mode: ${err.message}`,
          variant: "destructive",
        })
      })
      setIsFullScreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullScreen(false)
      }
    }
  }

  const toggleLoopMode = () => {
    setLoopMode(!loopMode)
    toast({
      title: loopMode ? "Loop Mode Disabled" : "Loop Mode Enabled",
      description: loopMode ? "Files will no longer repeat automatically." : "Files will now repeat automatically.",
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-64 rounded-lg" />
        </div>
        <Card>
          <CardContent className="p-0">
            <Skeleton className="h-[600px] w-full rounded-lg" />
          </CardContent>
        </Card>
        <Skeleton className="h-40 w-full rounded-lg" />
      </div>
    )
  }

  if (!file) {
    return (
      <div className="space-y-6">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex flex-col items-center justify-center h-[600px] bg-card rounded-lg">
          <h2 className="text-2xl font-bold">File Not Found</h2>
          <p className="text-foreground-secondary">The requested file could not be found or may have been deleted.</p>
          <Button className="mt-4 rounded-lg" onClick={() => router.push("/")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold">{file.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={toggleLoopMode} className="rounded-full">
            <RotateCw className={`h-4 w-4 ${loopMode ? "text-primary" : ""}`} />
          </Button>
          <Button variant="outline" size="icon" onClick={toggleFullScreen} className="rounded-full">
            {isFullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <Suspense
            fallback={
              <div className="h-[600px] w-full flex items-center justify-center bg-background rounded-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            }
          >
            <DynamicDocumentViewer file={file} loopMode={loopMode} />
          </Suspense>
        </CardContent>
      </Card>

      <Suspense fallback={<Skeleton className="h-40 w-full rounded-lg" />}>
        <DynamicFileMetadata file={file} />
      </Suspense>
    </div>
  )
}
