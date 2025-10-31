"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Upload, Check, AlertCircle } from "lucide-react"

export function CredentialsUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      // Check if it's a JSON file
      if (selectedFile.type !== "application/json" && !selectedFile.name.endsWith(".json")) {
        toast({
          title: "Invalid File",
          description: "Please upload a JSON file.",
          variant: "destructive",
        })
        return
      }

      setFile(selectedFile)
      setUploadSuccess(false)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a credentials.json file to upload.",
        variant: "destructive",
      })
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("credentials", file)

      const response = await fetch("/api/google-auth", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload credentials")
      }

      setUploadSuccess(true)
      toast({
        title: "Upload Successful",
        description: "Google credentials have been uploaded successfully.",
      })

      // Reload the page after a short delay to apply the new credentials
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error) {
      console.error("Error uploading credentials:", error)
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload credentials. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Google Credentials</CardTitle>
        <CardDescription>Upload your credentials.json file to enable Google Drive integration.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="credentials-file">Credentials File</Label>
            <div className="flex items-center gap-2">
              <Input
                id="credentials-file"
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </div>
            {file && <p className="text-sm text-muted-foreground">Selected file: {file.name}</p>}
          </div>

          <div className="bg-muted p-4 rounded-md">
            <h4 className="font-medium flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              Important Information
            </h4>
            <p className="text-sm text-muted-foreground">
              The credentials.json file contains sensitive information. In a production environment, you should use
              environment variables instead of uploading this file.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleUpload} disabled={!file || uploading || uploadSuccess} className="gap-2">
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Uploading...
            </>
          ) : uploadSuccess ? (
            <>
              <Check className="h-4 w-4" />
              Uploaded
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload Credentials
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
