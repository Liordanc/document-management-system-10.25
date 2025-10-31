import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

// Document viewer components
export const DynamicDocumentViewer = dynamic(
  () => import("@/components/document-viewer").then((mod) => ({ default: mod.DocumentViewer })),
  {
    loading: () => (
      <div className="h-[600px] w-full flex items-center justify-center bg-background rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    ),
    ssr: false, // Don't render on server since it uses browser objects
  },
)

// File viewer component
export const DynamicFileViewer = dynamic(
  () => import("@/components/file-viewer").then((mod) => ({ default: mod.FileViewer })),
  {
    loading: () => (
      <div className="h-[400px] w-full flex items-center justify-center bg-background rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    ),
    ssr: false,
  },
)

// Search components
export const DynamicAdvancedSearch = dynamic(
  () => import("@/components/advanced-search").then((mod) => ({ default: mod.AdvancedSearch })),
  {
    loading: () => <Skeleton className="h-12 w-full rounded-lg" />,
  },
)

// Management components
export const DynamicOfflineModeManager = dynamic(
  () => import("@/components/offline-mode-manager").then((mod) => ({ default: mod.OfflineModeManager })),
  {
    ssr: false, // Uses navigator.onLine
    loading: () => (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    ),
  },
)

export const DynamicFileMergeDialog = dynamic(
  () => import("@/components/file-merge-dialog").then((mod) => ({ default: mod.FileMergeDialog })),
  {
    ssr: false,
  },
)

export const DynamicFileMetadata = dynamic(
  () => import("@/components/file-metadata").then((mod) => ({ default: mod.FileMetadata })),
  {
    loading: () => (
      <div className="space-y-4">
        <Skeleton className="h-6 w-3/4 rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
    ),
  },
)

// File management components
export const DynamicFileUploader = dynamic(
  () => import("@/components/file-uploader").then((mod) => ({ default: mod.FileUploader })),
  {
    loading: () => (
      <div className="h-[300px] w-full flex items-center justify-center bg-background rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    ),
  },
)

export const DynamicFileGrid = dynamic(
  () => import("@/components/file-grid").then((mod) => ({ default: mod.FileGrid })),
  {
    loading: () => (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-[250px] w-full rounded-lg" />
        ))}
      </div>
    ),
  },
)

// Statistics and activity components
export const DynamicFileStats = dynamic(
  () => import("@/components/file-stats").then((mod) => ({ default: mod.FileStats })),
  {
    loading: () => <Skeleton className="h-[300px] w-full rounded-lg" />,
  },
)

export const DynamicRecentActivity = dynamic(
  () => import("@/components/recent-activity").then((mod) => ({ default: mod.RecentActivity })),
  {
    loading: () => (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px] rounded-lg" />
              <Skeleton className="h-3 w-[200px] rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    ),
  },
)

// Google integration components
export const DynamicGoogleDriveIntegration = dynamic(
  () => import("@/components/google-drive-integration").then((mod) => ({ default: mod.GoogleDriveIntegration })),
  {
    ssr: false, // Uses browser APIs for authentication
    loading: () => <Skeleton className="h-[400px] w-full rounded-lg" />,
  },
)
