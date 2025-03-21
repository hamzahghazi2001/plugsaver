import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get the user_id from the query parameters
    const user_id = request.nextUrl.searchParams.get("user_id");

    if (!user_id) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch user details from the backend API
    const response = await fetch(`http://localhost:8000/get_user_details?user_id=${user_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { success: false, message: errorData.detail || "Failed to fetch user details" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, user: data.user }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}