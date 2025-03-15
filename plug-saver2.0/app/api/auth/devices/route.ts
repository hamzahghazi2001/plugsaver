import { NextRequest, NextResponse } from "next/server";

// POST method to add a new device
export async function POST(req: Request) {
  try {
    console.log("POST request received"); // Log the request
    const device = await req.json();
    console.log("Received payload from frontend:", device); // Log the payload

    // Call your backend API to add a device
    const response = await fetch("http://localhost:8000/add-device", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(device),
    });

    const data = await response.json();
    console.log("Backend response:", data); // Log the backend response
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error adding device:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}

// DELETE method to delete a device
export async function DELETE(req: NextRequest) {
  try {
    const { household_code, user_id, device_id } = await req.json();
    console.log("DELETE request received:", { household_code, user_id, device_id }); // Log the request

    // Call your backend API to delete a device
    const response = await fetch("http://localhost:8000/delete-device", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        household_code,
        user_id,
        device_id,
      }),
    });

    const data = await response.json();
    console.log("Backend response:", data); // Log the backend response
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error deleting device:", err);
    return NextResponse.json(
      { success: false, message: "An error occurred while deleting the device." },
      { status: 500 }
    );
  }
}

// GET method to fetch device categories

export async function GET() {
  try {
    console.log("GET request received for fetching devices"); // Log the request

    // Call your backend API to fetch devices
    const backendUrl = "http://localhost:8000/api/auth/devices";
    console.log("Calling backend API at:", backendUrl);

    const response = await fetch(backendUrl);

    console.log("Backend response status:", response.status); // Log the response status

    // Check if the response is successful
    if (!response.ok) {
      const errorText = await response.text(); // Log the error response body
      console.error("Failed to fetch devices. Response body:", errorText);

      // Return a more descriptive error message
      return NextResponse.json(
        { 
          error: "Failed to fetch devices from the backend", 
          status: response.status, 
          message: response.statusText,
          backendError: errorText 
        },
        { status: response.status } // Pass the same status code from the backend
      );
    }

    // Parse the JSON data
    const data = await response.json();
    console.log("Fetched devices data:", JSON.stringify(data, null, 2)); // Log the fetched data in a readable format

    // Return the data as a JSON response
    return NextResponse.json(data);
  } catch (error:any) {
    console.error("Error fetching devices:", error);

    // Return a detailed error response
    return NextResponse.json(
      { 
        error: "Internal Server Error", 
        message: error.message || "An unexpected error occurred",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined 
      },
      { status: 500 }
    );
  }
}