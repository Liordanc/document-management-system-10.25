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
    const category = searchParams.get("type")

    if (!category) {
      return NextResponse.json(
        { error: "No category provided" },
        { status: 400 }
      )
    }

    const driveService = new GoogleDriveService(session.accessToken)
    const files = await driveService.getFilesByCategory(category)

    return NextResponse.json({ files })
  } catch (error) {
    console.error("Error getting files by category:", error)
    return NextResponse.json(
      { error: "Failed to get files by category" },
      { status: 500 }
    )
  }
}
