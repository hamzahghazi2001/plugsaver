// import { NextResponse } from "next/server"

// export async function POST(request: Request) {
//   const formData = await request.formData()
//   const email = formData.get("email")
//   const password = formData.get("password")

//   // This would typically create a user in your database
//   // and send a verification email

//   // For demo purposes, we'll just simulate success
//   return NextResponse.json({
//     success: true,
//     message: "Verification code sent",
//   })
// }

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { email, password, confirmpass, name } = data;

    // Call the /create_account endpoint
    const createAccountResponse = await fetch('http://localhost:8000/create_account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        confirmpass,
        name,
      }),
    });

    if (!createAccountResponse.ok) {
      const errorData = await createAccountResponse.json();
      throw new Error(errorData.message || 'Account creation failed');
    }

    const createAccountData = await createAccountResponse.json();
    return NextResponse.json(createAccountData, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}