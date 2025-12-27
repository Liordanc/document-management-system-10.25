import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DynamicFileGrid, DynamicFileStats } from "@/lib/dynamic-imports"

export default function LibraryPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">File Library</h1>
      </div>

      <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
        <DynamicFileStats />
      </Suspense>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Files</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-[250px] w-full rounded-md" />
                ))}
              </div>
            }
          >
            <DynamicFileGrid />
          </Suspense>
        </TabsContent>
        <TabsContent value="recent" className="space-y-4">
          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-[250px] w-full rounded-md" />
                ))}
              </div>
            }
          >
            <DynamicFileGrid />
          </Suspense>
        </TabsContent>
        <TabsContent value="favorites" className="space-y-4">
          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-[250px] w-full rounded-md" />
                ))}
              </div>
            }
          >
            <DynamicFileGrid />
          </Suspense>
        </TabsContent>
        <TabsContent value="shared" className="space-y-4">
          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-[250px] w-full rounded-md" />
                ))}
              </div>
            }
          >
            <DynamicFileGrid />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
