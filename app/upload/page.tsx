import { FileUploader } from "@/components/file-uploader"

export default function UploadPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Upload Files</h1>
      <p className="text-muted-foreground">
        Upload your documents, spreadsheets, presentations, and images to your document management system.
      </p>
      <FileUploader />
    </div>
  )
}

