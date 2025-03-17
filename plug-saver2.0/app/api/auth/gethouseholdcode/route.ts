import { NextResponse } from "next/server";

// Define the structure of the response
interface HouseholdCodeResponse {
  success: boolean;
  household_code?: string;
  message?: string;
}

// GET method to fetch household code
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    // Validate email
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }

    // Forward the request to the FastAPI backend
    const backendResponse = await fetch(`http://localhost:8000/get-householdcode?email=${encodeURIComponent(email)}`);

    // Check if the response is JSON
    const contentType = backendResponse.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const errorText = await backendResponse.text();
      throw new Error(`Backend error: ${errorText}`);
    }

    const data: HouseholdCodeResponse = await backendResponse.json();

    // Handle backend response
    if (!backendResponse.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to fetch household code." },
        { status: backendResponse.status }
      );
    }

    // Return the household code
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching household code:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while fetching the household code." },
      { status: 500 }
    );
  }
}