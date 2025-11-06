import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { GoogleDriveService } from "@/lib/google-drive"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { fileId, emailAddress } = await request.json()

    if (!fileId) {
      return NextResponse.json(
        { error: "No fileId provided" },
        { status: 400 }
      )
    }

    const driveService = new GoogleDriveService(session.accessToken)
    const result = await driveService.shareFile(fileId, emailAddress)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error sharing file:", error)
    return NextResponse.json(
      { error: "Failed to share file" },
      { status: 500 }
    )
  }
}
