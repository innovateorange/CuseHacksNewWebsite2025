import { NextResponse } from "next/server"

// MONGODB_INTEGRATION: This file is temporarily modified for UI preview
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    console.log("Auth API called with:", { email, password })
    console.log("MongoDB connection temporarily disabled for UI preview")

    // For UI preview, just check hardcoded credentials
    if (email === "admin@cusehacks.org" && password === "password123") {
      return NextResponse.json({
        success: true,
        token: "dummy-jwt-token",
        user: {
          id: "1",
          email: "admin@cusehacks.org",
          role: "admin",
        },
      })
    }

    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json({ success: false, message: "Authentication failed" }, { status: 500 })
  }
}
