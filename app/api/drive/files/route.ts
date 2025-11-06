import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { GoogleDriveService } from "@/lib/google-drive"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const pageToken = searchParams.get("pageToken") || undefined
    const pageSize = parseInt(searchParams.get("pageSize") || "50")

    const driveService = new GoogleDriveService(session.accessToken)
    const result = await driveService.listFiles(pageSize, pageToken)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in /api/drive/files:", error)
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 }
    )
  }
}
