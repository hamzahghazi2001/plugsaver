import { NextResponse } from "next/server";

// POST method to add a new room
export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { household_code, room_name } = body;

    // Validate the input
    if (!household_code || !room_name) {
      return NextResponse.json(
        { error: "Household code and room name are required" },
        { status: 400 }
      );
    }

    // Call your backend API to add a room
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

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`Failed to add room: ${response.statusText}`);
    }

    // Parse the JSON data
    const data = await response.json();

    // Print the data to the terminal
    console.log("Added room data:", data);

    // Return the data as a JSON response
    return NextResponse.json(data);
  } catch (error) {
    // Handle errors and log them to the terminal
    console.error("Error adding room:", error);

    // Return an error response
    return NextResponse.json(
      { error: "Failed to add room" },
      { status: 500 }
    );
  }
}

// GET method to fetch rooms
export async function GET() {
  try {
    // Call your backend API to fetch rooms
    const response = await fetch("http://localhost:8000/api/auth/rooms");

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`Failed to fetch rooms: ${response.statusText}`);
    }

    // Parse the JSON data
    const data = await response.json();

    // Print the data to the terminal
    console.log("Fetched rooms data:", data);

    // Return the data as a JSON response
    return NextResponse.json(data);
  } catch (error) {
    // Handle errors and log them to the terminal
    console.error("Error fetching rooms:", error);

    // Return an error response
    return NextResponse.json(
      { error: "Failed to fetch rooms" },
      { status: 500 }
    );
  }
}