// app/api/auth/roomassignment/route.ts
import { NextRequest, NextResponse } from "next/server";

// PUT method to assign device to room
export async function PUT(req: NextRequest) {
  try {
    console.log("PUT request received for room assignment"); // Log the request
    const payload = await req.json();
    console.log("Received payload from frontend:", payload); // Log the payload

    // Validate required fields
    if (!payload.device_id || !payload.room_id) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Both device_id and room_id are required." 
        },
        { status: 400 }
      );
    }

    // Call your backend API to assign the device to room
    const response = await fetch("http://localhost:8000/device_allocate", {
      method: "POST", // Note: Your Python endpoint uses POST
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        device_id: payload.device_id,
        room_id: payload.room_id
      }),
    });

    // Check if the response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const errorText = await response.text();
      console.error("Backend returned non-JSON response:", errorText);
      throw new Error(`Backend error: ${errorText}`);
    }

    const data = await response.json();
    console.log("Backend response:", data); // Log the backend response

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || "Failed to assign device to room." 
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error assigning device to room:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "An error occurred while assigning the device to the room." 
      },
      { status: 500 }
    );
  }
}

// Optional: GET method to check current room assignments
export async function GET(req: NextRequest) {
  try {
    const deviceId = req.nextUrl.searchParams.get("device_id");
    
    if (!deviceId) {
      return NextResponse.json(
        { success: false, message: "device_id query parameter is required" },
        { status: 400 }
      );
    }

    // Call your backend API to get current assignment
    const response = await fetch(`http://localhost:8000/get_device_assignment?device_id=${deviceId}`);

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
    console.error("Error getting device assignment:", err);
    return NextResponse.json(
      { success: false, message: "An error occurred while getting device assignment" },
      { status: 500 }
    );
  }
}