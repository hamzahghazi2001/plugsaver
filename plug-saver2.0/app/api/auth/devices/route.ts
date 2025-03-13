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
export async function GET(req: NextRequest) {
  try {
    console.log("GET request received"); // Log the request

    // Call your backend API to fetch device categories
    const response = await fetch("http://localhost:8000/device-categories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("Backend response:", data); // Log the backend response
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching device categories:", err);
    return NextResponse.json(
      { success: false, message: "An error occurred while fetching device categories." },
      { status: 500 }
    );
  }
}