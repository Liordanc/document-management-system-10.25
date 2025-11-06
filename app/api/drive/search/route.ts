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
    const query = searchParams.get("q")

    if (!query) {
      return NextResponse.json(
        { error: "No search query provided" },
        { status: 400 }
      )
    }

    const driveService = new GoogleDriveService(session.accessToken)
    const files = await driveService.searchFiles(query)

    return NextResponse.json({ files })
  } catch (error) {
    console.error("Error searching files:", error)
    return NextResponse.json(
      { error: "Failed to search files" },
      { status: 500 }
    )
  }
}
