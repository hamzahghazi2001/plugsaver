// import { NextResponse } from "next/server"

// export async function POST(request: Request) {
//   const formData = await request.formData()
//   const email = formData.get("email")
//   const code = formData.get("code")

//   // This would typically verify the code against your database

//   // For demo purposes, we'll accept any 6-digit code
//   if (typeof code === "string" && code.length === 6) {
//     return NextResponse.json({ success: true })
//   }

//   return NextResponse.json({ success: false, error: "Invalid verification code" }, { status: 400 })
// }

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { email, name, password, userverifycode } = data;

    // Call the /verify_registration endpoint
    const verifyRegistrationResponse = await fetch('http://localhost:8000/verify_registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        name,
        password,
        userverifycode,
        // This will be handled by the backend
      }),
    });

    if (!verifyRegistrationResponse.ok) {
      const errorData = await verifyRegistrationResponse.json();
      throw new Error(errorData.message || 'Verification failed');
    }

    const verifyRegistrationData = await verifyRegistrationResponse.json();
    return NextResponse.json(verifyRegistrationData, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}