import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileGrid } from "@/components/file-grid"
import { FileStats } from "@/components/file-stats"

export default function LibraryPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">File Library</h1>
      </div>

      <FileStats />

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Files</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <FileGrid />
        </TabsContent>
        <TabsContent value="recent" className="space-y-4">
          <FileGrid />
        </TabsContent>
        <TabsContent value="favorites" className="space-y-4">
          <FileGrid />
        </TabsContent>
        <TabsContent value="shared" className="space-y-4">
          <FileGrid />
        </TabsContent>
      </Tabs>
    </div>
  )
}

