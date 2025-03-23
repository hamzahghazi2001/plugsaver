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

    // Fetch energy consumption data from the FastAPI backend
    const response = await fetch(`http://localhost:8000/top-active-devices?household_code=${household_code}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { success: false, message: errorData.detail || "Failed to fetch energy consumption data" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Data:", JSON.stringify(data, null, 2)); // Log the data properly
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching energy consumption data:", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}