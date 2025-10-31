"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { Wifi, WifiOff, Trash, HardDrive, FileText, ImageIcon as Image } from "@/components/icons"

interface OfflineFile {
  id: string
  name: string
  type: string
  size: number
  savedAt: Date
  url: string
}

export function OfflineModeManager() {
  const [isOnline, setIsOnline] = useState(true)
  const [offlineEnabled, setOfflineEnabled] = useState(false)
  const [offlineFiles, setOfflineFiles] = useState<OfflineFile[]>([])
  const [storageUsed, setStorageUsed] = useState(0)
  const [storageLimit, setStorageLimit] = useState(50 * 1024 * 1024) // 50MB default
  const [isLoading, setIsLoading] = useState(true)

  // Check online status
  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine)
      if (navigator.onLine) {
        toast({
          title: "You're back online",
          description: "You now have full access to all features.",
        })
      } else {
        toast({
          title: "You're offline",
          description: "Limited functionality is available. Only cached files can be accessed.",
          variant: "destructive",
        })
      }
    }

    // Set initial status
    setIsOnline(navigator.onLine)

    // Add event listeners
    window.addEventListener("online", handleOnlineStatus)
    window.addEventListener("offline", handleOnlineStatus)

    // Load offline settings and files
    const loadOfflineSettings = async () => {
      try {
        // In a real app, this would load from IndexedDB or localStorage
        const mockOfflineEnabled = localStorage.getItem("offlineEnabled") === "true"
        setOfflineEnabled(mockOfflineEnabled)

        // Mock data for offline files
        if (mockOfflineEnabled) {
          const mockFiles: OfflineFile[] = [
            {
              id: "offline-1",
              name: "Project Proposal.pdf",
              type: "pdf",
              size: 2.5 * 1024 * 1024, // 2.5MB
              savedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
              url: "/placeholder.svg?height=800&width=600",
            },
            {
              id: "offline-2",
              name: "Meeting Notes.docx",
              type: "doc",
              size: 1.2 * 1024 * 1024, // 1.2MB
              savedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
              url: "/placeholder.svg?height=800&width=600",
            },
            {
              id: "offline-3",
              name: "Team Photo.jpg",
              type: "jpg",
              size: 3.7 * 1024 * 1024, // 3.7MB
              savedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
              url: "/placeholder.svg?height=800&width=600",
            },
          ]
          setOfflineFiles(mockFiles)

          // Calculate storage used
          const totalSize = mockFiles.reduce((total, file) => total + file.size, 0)
          setStorageUsed(totalSize)
        }
      } catch (error) {
        console.error("Error loading offline settings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadOfflineSettings()

    // Cleanup
    return () => {
      window.removeEventListener("online", handleOnlineStatus)
      window.removeEventListener("offline", handleOnlineStatus)
    }
  }, [])

  // Toggle offline mode
  const toggleOfflineMode = (enabled: boolean) => {
    setOfflineEnabled(enabled)
    localStorage.setItem("offlineEnabled", enabled.toString())

    if (enabled) {
      toast({
        title: "Offline Mode Enabled",
        description: "Files you mark for offline access will be available when you're offline.",
      })
    } else {
      toast({
        title: "Offline Mode Disabled",
        description: "Files will no longer be saved for offline access.",
      })
    }
  }

  // Save a file for offline access
  const saveFileOffline = (file: any) => {
    // In a real app, this would save the file to IndexedDB
    toast({
      title: "Saving for Offline Access",
      description: `${file.name} will be available offline.`,
    })

    // Mock implementation
    setTimeout(() => {
      const newOfflineFile: OfflineFile = {
        id: `offline-${Date.now()}`,
        name: file.name,
        type: file.type,
        size: file.size,
        savedAt: new Date(),
        url: file.url,
      }

      setOfflineFiles((prev) => [...prev, newOfflineFile])
      setStorageUsed((prev) => prev + file.size)

      toast({
        title: "File Saved",
        description: `${file.name} is now available offline.`,
      })
    }, 1500)
  }

  // Remove a file from offline storage
  const removeOfflineFile = (fileId: string) => {
    const fileToRemove = offlineFiles.find((f) => f.id === fileId)
    if (!fileToRemove) return

    setOfflineFiles((prev) => prev.filter((f) => f.id !== fileId))
    setStorageUsed((prev) => prev - fileToRemove.size)

    toast({
      title: "File Removed",
      description: `${fileToRemove.name} is no longer available offline.`,
    })
  }

  // Format bytes to human-readable size
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
    return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`
  }

  // Calculate storage percentage
  const storagePercentage = Math.min(100, Math.round((storageUsed / storageLimit) * 100))

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <WifiOff className="mr-2 h-5 w-5" />
            Offline Access
          </CardTitle>
          <CardDescription>Loading offline settings...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          {isOnline ? (
            <Wifi className="mr-2 h-5 w-5 text-green-500" />
          ) : (
            <WifiOff className="mr-2 h-5 w-5 text-red-500" />
          )}
          {isOnline ? "Offline Access" : "Offline Mode"}
        </CardTitle>
        <CardDescription>
          {isOnline
            ? "Save files for access when you're offline"
            : "You're currently offline. Only saved files are available."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isOnline && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Label htmlFor="offline-mode">Enable Offline Mode</Label>
              <Switch id="offline-mode" checked={offlineEnabled} onCheckedChange={toggleOfflineMode} />
            </div>
          </div>
        )}

        {offlineEnabled && (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Storage Used</span>
                <span>
                  {formatSize(storageUsed)} of {formatSize(storageLimit)}
                </span>
              </div>
              <Progress value={storagePercentage} />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Files Available Offline ({offlineFiles.length})</h3>

              {offlineFiles.length > 0 ? (
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {offlineFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                      <div className="flex items-center space-x-2 overflow-hidden">
                        <div className="flex-shrink-0">
                          {file.type === "pdf" && <FileText className="h-5 w-5 text-blue-500" />}
                          {file.type === "doc" && <FileText className="h-5 w-5 text-blue-500" />}
                          {file.type === "jpg" && <Image className="h-5 w-5 text-purple-500" />}
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatSize(file.size)} • Saved {file.savedAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOfflineFile(file.id)}
                        className="flex-shrink-0"
                      >
                        <Trash className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground text-sm">No files saved for offline access</div>
              )}
            </div>
          </>
        )}
      </CardContent>
      {offlineEnabled && isOnline && (
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setOfflineFiles([])}>
            Clear All
          </Button>
          <Button
            onClick={() => {
              toast({
                title: "Storage Limit",
                description: "You can adjust your offline storage limit in settings.",
              })
            }}
          >
            <HardDrive className="mr-2 h-4 w-4" />
            Manage Storage
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
