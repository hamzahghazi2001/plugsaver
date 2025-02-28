import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { email } = await request.json()

  // This would typically resend a verification code
  // to the user's email address

  // For demo purposes, we'll just simulate success
  return NextResponse.json({
    success: true,
    message: "Verification code resent",
  })
}

