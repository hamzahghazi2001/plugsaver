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
    console.log("DELETE request received"); // Log the request

    // Extract query parameters
    const device = await req.json();
    console.log("Received payload from frontend:", device); // Log the payload

    // Call your backend API to delete a device
    const response = await fetch("http://localhost:8000/api/auth/devices", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(device),
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
    const backendUrl = `${backendBaseUrl}/api/auth/devices?household_code=${encodeURIComponent(household_code)}`;
    console.log("Calling backend API at:", backendUrl);

    // Fetch data from the backend
    const response = await fetch(backendUrl);

    console.log("Backend response status:", response.status); // Log the response status

    // Handle non-OK responses
    if (!response.ok) {
      const errorText = await response.text(); // Log the error response body
      console.error("Failed to fetch devices. Response body:", errorText);

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
    console.log("Fetched devices data:", JSON.stringify(data, null, 2)); // Log the fetched data in a readable format

    // Return the data as a JSON response
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching devices:", error);

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

// PUT method to handle multiple operations (e.g., assign device to room, update device settings)
export async function PUT(req: NextRequest, { params }: { params: { device_id: string } }) {
  try {
    const deviceId = parseInt(params.device_id, 10);
    if (isNaN(deviceId)) {
      return NextResponse.json({ success: false, message: "Invalid device ID" }, { status: 400 });
    }

    const requestBody = await req.json();

    // Check the type of PUT request based on the request body
    if (requestBody.room_id !== undefined) {
      // This is a request to assign a device to a room
      const { room_id } = requestBody;

      // Call the backend API to update the device's room
      const response = await fetch(`http://localhost:8000/api/auth/devices/${deviceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ room_id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return NextResponse.json({ success: false, message: errorData.detail || "Failed to assign device to room" }, { status: response.status });
      }

      const data = await response.json();
      return NextResponse.json(data);
    } else if (requestBody.someOtherField !== undefined) {
      // Handle other PUT operations (e.g., updating device settings)
      const { someOtherField } = requestBody;

      // Call the backend API to update the device settings
      const response = await fetch(`http://localhost:8000/api/auth/devices/${deviceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ someOtherField }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return NextResponse.json({ success: false, message: errorData.detail || "Failed to update device settings" }, { status: response.status });
      }

      const data = await response.json();
      return NextResponse.json(data);
    } else {
      // Invalid request body
      return NextResponse.json({ success: false, message: "Invalid request body" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error handling PUT request:", error);
    return NextResponse.json({ success: false, message: "An error occurred while processing the request" }, { status: 500 });
  }
}