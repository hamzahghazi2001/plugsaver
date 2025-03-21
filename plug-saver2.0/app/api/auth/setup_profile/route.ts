import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("POST request received for setup_profile"); // Log the request

    // Parse the incoming request body
    const profileData = await request.json();
    console.log("Received payload from frontend:", profileData);

    // Forward the request to the backend API
    const backendResponse = await fetch("http://localhost:8000/setup_profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });

    // Check if the backend API request was successful
    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      console.error("Error from backend API:", errorData);
      return NextResponse.json(
        { success: false, message: errorData.message || "Failed to setup profile" },
        { status: backendResponse.status }
      );
    }

    // Parse the response from the backend API
    const responseData = await backendResponse.json();
    console.log("Response from backend API:", responseData);

    // Return the response to the frontend
    return NextResponse.json(
      { success: true, message: "Profile setup successful", data: responseData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST request for setup_profile:", error);

    // Handle unexpected errors
    return NextResponse.json(
      { success: false, message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}