import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Calendar, User, HardDrive } from "@/components/icons"

export function FileMetadata({ file }) {
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`
    return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getFileCategory = (fileType) => {
    const categories = {
      pdf: "Document",
      doc: "Document",
      txt: "Document",
      xls: "Spreadsheet",
      xlsx: "Spreadsheet",
      ppt: "Presentation",
      pptx: "Presentation",
      jpg: "Image",
      jpeg: "Image",
      png: "Image",
      gif: "Image",
    }

    return categories[fileType] || "Other"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>File Information</CardTitle>
        <CardDescription>Detailed information about this file</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-background p-2 rounded-full">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">File Name</p>
                <p className="text-sm text-foreground-secondary">{file.name}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Badge variant="outline" className="h-5 mt-0.5 bg-background">
                {file.type.toUpperCase()}
              </Badge>
              <div>
                <p className="text-sm font-medium">File Type</p>
                <p className="text-sm text-foreground-secondary">{getFileCategory(file.type)}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-background p-2 rounded-full">
                <HardDrive className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium">File Size</p>
                <p className="text-sm text-foreground-secondary">{formatFileSize(file.size)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-background p-2 rounded-full">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Author</p>
                <p className="text-sm text-foreground-secondary">{file.author || "Unknown"}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-background p-2 rounded-full">
                <Calendar className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium">Upload Date</p>
                <p className="text-sm text-foreground-secondary">{formatDate(file.uploadDate)}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
