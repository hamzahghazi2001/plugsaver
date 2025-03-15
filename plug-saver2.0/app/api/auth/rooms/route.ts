import { NextResponse,NextRequest } from "next/server";

export async function POST(request: Request) {
    try {
      const body = await request.json();
      const { household_code, room_name } = body;
  
      if (!household_code || !room_name) {
        return NextResponse.json(
          { error: "Household code and room name are required" },
          { status: 400 }
        );
      }
  
      const response = await fetch("http://localhost:8000/add-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          household_code,
          room_name,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to add room: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("Added room data:", data); // Inspect the response
  
      return NextResponse.json(data);
    } catch (error) {
      console.error("Error adding room:", error);
      return NextResponse.json(
        { error: "Failed to add room" },
        { status: 500 }
      );
    }
  }

  export async function DELETE(req: NextRequest) {
    try {
      console.log("DELETE request received"); // Log the request
  
      // Extract query parameters
      const room = await req.json();
      console.log("Received payload from frontend:", room); // Log the payload
  
      // Call your backend API to delete a device
      const response = await fetch("http://localhost:8000/api/auth/rooms", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(room),
      });
  
      const data = await response.json();
      console.log("Backend response:", data); // Log the backend response
      return NextResponse.json(data);
    } catch (err) {
      console.error("Error deleting room:", err);
      return NextResponse.json(
        { success: false, message: "An error occurred while deleting the room." },
        { status: 500 }
      );
    }
  }

// GET method to fetch rooms
export async function GET(req: NextRequest) {
  try {
    console.log("GET request received for fetching devices"); // Log the request

    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const household_code = searchParams.get("household_code");

    // Validate household_code
    if (!household_code) {
      console.error("household_code is missing in the request");
      return NextResponse.json(
        { error: "household_code is required" },
        { status: 400 } // Bad Request
      );
    }

    // Construct the backend URL
    const backendBaseUrl = process.env.BACKEND_API_URL || "http://localhost:8000";
    const backendUrl = `${backendBaseUrl}/api/auth/rooms?household_code=${encodeURIComponent(household_code)}`;
    console.log("Calling backend API at:", backendUrl);

    // Fetch data from the backend
    const response = await fetch(backendUrl);

    console.log("Backend response status:", response.status); // Log the response status

    // Handle non-OK responses
    if (!response.ok) {
      const errorText = await response.text(); // Log the error response body
      console.error("Failed to fetch room. Response body:", errorText);

      return NextResponse.json(
        {
          error: "Failed to fetch devices from the backend",
          status: response.status,
          message: response.statusText,
          backendError: errorText,
        },
        { status: response.status } // Pass the same status code from the backend
      );
    }

    // Parse the JSON data
    const data = await response.json();
    console.log("Fetched room data:", JSON.stringify(data, null, 2)); // Log the fetched data in a readable format

    // Return the data as a JSON response
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error room devices:", error);

    // Return a detailed error response
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error.message || "An unexpected error occurred",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined, // Include stack trace in development mode
      },
      { status: 500 }
    );
  }
}