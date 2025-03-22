import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Parse the request body to get deviceId, isOn, and power
    const body = await req.json();
    const { deviceId, isOn, power, householdCode, userId } = body;

    console.log("Received request body:", body); // Debug log

    if (!deviceId || typeof isOn !== 'boolean') {
      return NextResponse.json(
        { success: false, message: "Invalid input: deviceId and isOn are required." },
        { status: 400 }
      );
    }

    // Forward the request to the backend
    const response = await fetch(`http://localhost:8000/toggle-device`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ deviceId, isOn, power, householdCode, userId}), // Forward deviceId, isOn, and power
    });

    console.log("Backend response status:", response.status); // Debug log

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { success: false, message: errorData.message || "Failed to toggle device" },
        { status: response.status }
      );
    }

    // Return the backend response
    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error toggling device:", err);
    return NextResponse.json(
      { success: false, message: "An error occurred while toggling the device" },
      { status: 500 }
    );
  }
}