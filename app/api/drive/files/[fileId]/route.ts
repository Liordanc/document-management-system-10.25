import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { GoogleDriveService } from "@/lib/google-drive"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const session = await auth()
    const { fileId } = await params

    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const driveService = new GoogleDriveService(session.accessToken)
    const file = await driveService.getFile(fileId)

    return NextResponse.json(file)
  } catch (error) {
    console.error("Error getting file:", error)
    return NextResponse.json(
      { error: "Failed to get file" },
      { status: 500 }
    )
  }
}
