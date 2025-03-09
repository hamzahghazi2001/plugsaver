import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, household_code } = await req.json();

  try {
    const response = await fetch("http://localhost:8000/join_household", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, household_code }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "An error occurred." },
      { status: 500 }
    );
  }
}