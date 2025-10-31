"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, Upload, Download, Trash, Edit, Share } from "lucide-react"

const activityTypes = {
  upload: { icon: Upload, color: "bg-green-500" },
  download: { icon: Download, color: "bg-blue-500" },
  delete: { icon: Trash, color: "bg-red-500" },
  edit: { icon: Edit, color: "bg-yellow-500" },
  share: { icon: Share, color: "bg-purple-500" },
}

export function RecentActivity() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const fetchActivities = async () => {
      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Mock data
        const mockActivities = [
          {
            id: 1,
            type: "upload",
            user: { name: "John Doe", avatar: "/placeholder-user.jpg", initials: "JD" },
            file: "Annual Report.pdf",
            timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          },
          {
            id: 2,
            type: "share",
            user: { name: "Alice Smith", avatar: "/placeholder-user.jpg", initials: "AS" },
            file: "Project Proposal.docx",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 3,
            type: "download",
            user: { name: "Bob Johnson", avatar: "/placeholder-user.jpg", initials: "BJ" },
            file: "Budget Forecast.xlsx",
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 4,
            type: "edit",
            user: { name: "Emma Wilson", avatar: "/placeholder-user.jpg", initials: "EW" },
            file: "Marketing Plan.pptx",
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 5,
            type: "delete",
            user: { name: "John Doe", avatar: "/placeholder-user.jpg", initials: "JD" },
            file: "Old Logo.png",
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ]

        setActivities(mockActivities)
      } catch (error) {
        console.error("Error fetching activities:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
    } else {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`
    }
  }

  const getActivityText = (activity) => {
    switch (activity.type) {
      case "upload":
        return `uploaded ${activity.file}`
      case "download":
        return `downloaded ${activity.file}`
      case "delete":
        return `deleted ${activity.file}`
      case "edit":
        return `edited ${activity.file}`
      case "share":
        return `shared ${activity.file}`
      default:
        return `interacted with ${activity.file}`
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-3 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const ActivityIcon = activityTypes[activity.type]?.icon || FileText
        const iconColor = activityTypes[activity.type]?.color || "bg-gray-500"

        return (
          <div key={activity.id} className="flex items-start space-x-4">
            <Avatar>
              <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
              <AvatarFallback>{activity.user.initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm">
                <span className="font-medium">{activity.user.name}</span> {getActivityText(activity)}
              </p>
              <div className="flex items-center text-xs text-muted-foreground">
                <div className={`${iconColor} p-1 rounded-full mr-2`}>
                  <ActivityIcon className="h-3 w-3 text-white" />
                </div>
                {formatTimestamp(activity.timestamp)}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

