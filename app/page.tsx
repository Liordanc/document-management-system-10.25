import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileGrid } from "@/components/file-grid"
import { FileText, Upload, Users, HardDrive } from "@/components/icons"

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Document Management System</h1>
        <div className="flex items-center space-x-4">
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-card rounded-full p-1">
          <TabsTrigger value="all" className="rounded-full">
            All Files
          </TabsTrigger>
          <TabsTrigger value="documents" className="rounded-full">
            Documents
          </TabsTrigger>
          <TabsTrigger value="spreadsheets" className="rounded-full">
            Spreadsheets
          </TabsTrigger>
          <TabsTrigger value="presentations" className="rounded-full">
            Presentations
          </TabsTrigger>
          <TabsTrigger value="images" className="rounded-full">
            Images
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Files</CardTitle>
                <FileText className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">142</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                <HardDrive className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.4 GB</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Uploads</CardTitle>
                <Upload className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Shared Files</CardTitle>
                <Users className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">36</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Files</CardTitle>
            </CardHeader>
            <CardContent>
              <FileGrid />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <FileGrid category="documents" />
        </TabsContent>

        <TabsContent value="spreadsheets" className="space-y-6">
          <FileGrid category="spreadsheets" />
        </TabsContent>

        <TabsContent value="presentations" className="space-y-6">
          <FileGrid category="presentations" />
        </TabsContent>

        <TabsContent value="images" className="space-y-6">
          <FileGrid category="images" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
