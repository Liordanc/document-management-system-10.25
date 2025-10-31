"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [loopMode, setLoopMode] = useState(false)
  const [autoPlay, setAutoPlay] = useState(true)
  const [notifications, setNotifications] = useState(true)

  const handleSaveGeneral = () => {
    toast({
      title: "Settings Saved",
      description: "Your general settings have been updated.",
    })
  }

  const handleSaveNotifications = () => {
    toast({
      title: "Notification Settings Saved",
      description: "Your notification preferences have been updated.",
    })
  }

  const handleSaveStorage = () => {
    toast({
      title: "Storage Settings Saved",
      description: "Your storage settings have been updated.",
    })
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your general application preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                  <span>Dark Mode</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Enable dark mode for the application.
                  </span>
                </Label>
                <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="loop-mode" className="flex flex-col space-y-1">
                  <span>Loop Mode</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Automatically loop through files in the viewer.
                  </span>
                </Label>
                <Switch id="loop-mode" checked={loopMode} onCheckedChange={setLoopMode} />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="auto-play" className="flex flex-col space-y-1">
                  <span>Auto Play</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Automatically play media files when opened.
                  </span>
                </Label>
                <Switch id="auto-play" checked={autoPlay} onCheckedChange={setAutoPlay} />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveGeneral}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage your notification preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="notifications" className="flex flex-col space-y-1">
                  <span>Enable Notifications</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Receive notifications for uploads, downloads, and shares.
                  </span>
                </Label>
                <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email for Notifications</Label>
                <Input id="email" type="email" placeholder="Enter your email" defaultValue="user@example.com" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotifications}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="storage">
          <Card>
            <CardHeader>
              <CardTitle>Storage Settings</CardTitle>
              <CardDescription>Manage your storage preferences and quotas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Storage Usage</Label>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[45%]"></div>
                </div>
                <p className="text-sm text-muted-foreground">Using 4.5 GB of 10 GB (45%)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-folder">Default Save Location</Label>
                <Input id="default-folder" defaultValue="/Documents" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cleanup">Auto Cleanup</Label>
                <div className="flex items-center space-x-2">
                  <Input id="cleanup" type="number" defaultValue="30" className="w-20" />
                  <span className="text-sm text-muted-foreground">days</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Automatically delete files from trash after the specified number of days.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveStorage}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

