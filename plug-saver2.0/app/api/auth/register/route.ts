import { NextResponse } from "next/server"

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

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmpass = formData.get("confirmpass");

  // Send registration request to backend
  const backendResponse = await fetch("http://localhost:8000", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password, confirmpass }),
  });

  const data = await backendResponse.json();
  return NextResponse.json(data);
}

