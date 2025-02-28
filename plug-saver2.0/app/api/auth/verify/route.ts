import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const formData = await request.formData()
  const email = formData.get("email")
  const code = formData.get("code")

  // This would typically verify the code against your database

  // For demo purposes, we'll accept any 6-digit code
  if (typeof code === "string" && code.length === 6) {
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ success: false, error: "Invalid verification code" }, { status: 400 })
}

