"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { FileText, FileSpreadsheet, FileIcon as FilePresentation, ImageIcon } from "@/components/icons"

// Get file icon based on file type
const getFileIcon = (fileType) => {
  if (fileType === "pdf" || fileType === "doc" || fileType === "txt") {
    return <FileText className="h-5 w-5 text-blue-500" />
  } else if (fileType === "xls" || fileType === "xlsx") {
    return <FileSpreadsheet className="h-5 w-5 text-green-500" />
  } else if (fileType === "ppt" || fileType === "pptx") {
    return <FilePresentation className="h-5 w-5 text-yellow-500" />
  } else if (fileType.match(/jpg|jpeg|png|gif/)) {
    return <ImageIcon className="h-5 w-5 text-purple-500" />
  } else {
    return <FileText className="h-5 w-5 text-gray-500" />
  }
}

export function FileMergeDialog({ isOpen, onClose, selectedFiles, onMerge }) {
  const [mergedFileName, setMergedFileName] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  // Check if files can be merged (same type or compatible types)
  const canBeMerged = () => {
    if (selectedFiles.length < 2) return false

    // Group files by category
    const categories = selectedFiles.map((file) => {
      if (file.type.match(/pdf|doc|txt/)) return "documents"
      if (file.type.match(/xls|xlsx/)) return "spreadsheets"
      if (file.type.match(/ppt|pptx/)) return "presentations"
      if (file.type.match(/jpg|jpeg|png|gif/)) return "images"
      return "other"
    })

    // Check if all files are of the same category
    return categories.every((category) => category === categories[0])
  }

  const handleMerge = async () => {
    if (!mergedFileName.trim()) {
      toast({
        title: "Error",
        description: "Please provide a name for the merged file.",
        variant: "destructive",
      })
      return
    }

    if (!canBeMerged()) {
      toast({
        title: "Error",
        description: "Selected files cannot be merged. Please select files of the same type.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Simulate merging process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Call the onMerge callback with the merged file info
      const mergedFileType = selectedFiles[0].type
      onMerge({
        name: `${mergedFileName}.${mergedFileType}`,
        type: mergedFileType,
        size: selectedFiles.reduce((total, file) => total + file.size, 0),
        uploadDate: new Date().toISOString(),
        author: "Current User",
      })

      toast({
        title: "Success",
        description: `${selectedFiles.length} files have been merged into "${mergedFileName}.${mergedFileType}".`,
      })

      onClose()
    } catch (error) {
      console.error("Error merging files:", error)
      toast({
        title: "Error",
        description: "An error occurred while merging files. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Generate a suggested name based on selected files
  const suggestMergedFileName = () => {
    if (selectedFiles.length === 0) return ""

    // Get the common prefix of file names
    const fileNames = selectedFiles.map((file) => file.name.split(".")[0])
    let commonPrefix = fileNames[0]

    for (let i = 1; i < fileNames.length; i++) {
      let j = 0
      while (j < commonPrefix.length && j < fileNames[i].length && commonPrefix[j] === fileNames[i][j]) {
        j++
      }
      commonPrefix = commonPrefix.substring(0, j)
    }

    // If common prefix is too short, use "Merged" + first file name
    if (commonPrefix.length < 3) {
      return `Merged_${fileNames[0]}`
    }

    // Remove trailing spaces or underscores
    commonPrefix = commonPrefix.replace(/[_\s]+$/, "")

    return `${commonPrefix}_merged`
  }

  // Set suggested name when dialog opens
  useState(() => {
    if (isOpen && selectedFiles.length > 0) {
      setMergedFileName(suggestMergedFileName())
    }
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Merge Files</DialogTitle>
          <DialogDescription>Combine {selectedFiles.length} selected files into a single file.</DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="merged-file-name">Merged File Name</Label>
            <Input
              id="merged-file-name"
              value={mergedFileName}
              onChange={(e) => setMergedFileName(e.target.value)}
              placeholder="Enter a name for the merged file"
            />
          </div>

          <div className="space-y-2">
            <Label>Selected Files ({selectedFiles.length})</Label>
            <div className="max-h-[200px] overflow-y-auto border rounded-md p-2 space-y-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-muted/50 rounded-md">
                  {getFileIcon(file.type)}
                  <div className="text-sm truncate">{file.name}</div>
                  <div className="text-xs text-muted-foreground ml-auto">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
              ))}
            </div>
          </div>

          {!canBeMerged() && selectedFiles.length > 1 && (
            <div className="text-sm text-red-500">
              Warning: These files may not be compatible for merging. Please select files of the same type.
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handleMerge} disabled={isProcessing || selectedFiles.length < 2}>
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Merging...
              </>
            ) : (
              "Merge Files"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
