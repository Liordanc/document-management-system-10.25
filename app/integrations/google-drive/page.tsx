import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { DynamicGoogleDriveIntegration } from "@/lib/dynamic-imports"

export default function GoogleDrivePage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Google Drive Integration</h1>
      <p className="text-muted-foreground">
        Connect to your Google Drive to access your documents, spreadsheets, presentations, and images.
      </p>

      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <DynamicGoogleDriveIntegration />
      </Suspense>
    </div>
  )
}
