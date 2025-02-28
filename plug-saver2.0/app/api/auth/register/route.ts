import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const formData = await request.formData()
  const email = formData.get("email")
  const password = formData.get("password")

  // This would typically create a user in your database
  // and send a verification email

  // For demo purposes, we'll just simulate success
  return NextResponse.json({
    success: true,
    message: "Verification code sent",
  })
}

