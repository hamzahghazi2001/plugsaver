import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get the household_code from the query parameters
    const household_code = request.nextUrl.searchParams.get("household_code");

    if (!household_code) {
      return NextResponse.json(
        { success: false, message: "Household code is required" },
        { status: 400 }
      );
    }

    // Fetch all user details for the household from the backend API
    const response = await fetch(
      `http://localhost:8000/get_household_users?household_code=${household_code}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { success: false, message: errorData.detail || "Failed to fetch household users" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Return the user details
    return NextResponse.json(
      { success: true, users: data.users },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching household users:", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}