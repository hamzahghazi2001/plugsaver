// app/api/auth/set_budget/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { user_id, budget } = await req.json();

    if (!user_id || budget === undefined) {
      return NextResponse.json(
        { success: false, message: "User ID and budget are required" },
        { status: 400 }
      );
    }

    // Forward the request to the backend
    const response = await fetch("http://localhost:8000/set_budget", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id,
        budget
      }),
    });

    // Handle non-JSON responses
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend Error:", errorText);
      return NextResponse.json(
        { success: false, message: "Backend error: " + errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error setting budget:", err);
    return NextResponse.json(
      { success: false, message: "An error occurred while setting the budget" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const user_id = req.nextUrl.searchParams.get("user_id");

    if (!user_id) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch the budget from the backend
    const response = await fetch(`http://localhost:8000/get_budget?user_id=${user_id}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend Error:", errorText);
      return NextResponse.json(
        { success: false, message: "Backend error: " + errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error getting budget:", err);
    return NextResponse.json(
      { success: false, message: "An error occurred while getting the budget" },
      { status: 500 }
    );
  }
}