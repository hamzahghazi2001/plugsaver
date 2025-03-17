import { NextRequest, NextResponse } from "next/server";

// PUT method to update device settings
export async function PUT(req: NextRequest) {
  try {
    console.log("PUT request received"); // Log the request
    const payload = await req.json();
    console.log("Received payload from frontend:", payload); // Log the payload

    // Validate required fields
    if (!payload.device_id) {
      return NextResponse.json(
        { success: false, message: "Device ID is required." },
        { status: 400 }
      );
    }

    // Call your backend API to update the device
    const response = await fetch("http://localhost:8000/edit-device", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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
        { success: false, message: data.message || "Failed to update device." },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating device:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while updating the device." },
      { status: 500 }
    );
  }
}