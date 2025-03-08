// import { NextResponse } from "next/server"

// export async function POST(request: Request) {
//   const { email } = await request.json()

//   // This would typically resend a verification code
//   // to the user's email address

//   // For demo purposes, we'll just simulate success
//   return NextResponse.json({
//     success: true,
//     message: "Verification code resent",
//   })
// }

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Call the backend to resend the verification code
    const resendCodeResponse = await fetch("http://localhost:8000/resend-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!resendCodeResponse.ok) {
      const errorData = await resendCodeResponse.json();
      throw new Error(errorData.message || "Failed to resend code");
    }

    const resendCodeData = await resendCodeResponse.json();
    return NextResponse.json(resendCodeData, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}