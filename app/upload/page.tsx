import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { DynamicFileUploader } from "@/lib/dynamic-imports"

export default function UploadPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Upload Files</h1>
      <p className="text-muted-foreground">
        Upload your documents, spreadsheets, presentations, and images to your document management system.
      </p>
      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <DynamicFileUploader />
      </Suspense>
    </div>
  )
}
