import { NextRequest, NextResponse } from "next/server";
import { WebSocket } from "ws";

export const runtime = "edge"; // Use edge runtime for WebSocket support

export async function GET(request: NextRequest) {
  try {
    // Extract the household_code from the query parameters
    const household_code = request.nextUrl.searchParams.get("household_code");

    if (!household_code) {
      return NextResponse.json(
        { success: false, message: "Household code is required" },
        { status: 400 }
      );
    }

    // Create a WebSocket connection to the FastAPI backend
    const wsUrl = `ws://localhost:8000/ws/json-energy-consumption`;
    const ws = new WebSocket(wsUrl);

    ws.on("open", () => {
      console.log("WebSocket connection established");
      ws.send(household_code); // Send the household code to the backend
    });

    ws.on("message", (data) => {
      console.log("Received data from WebSocket:", data.toString());
      // You can process the data here if needed
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Error in WebSocket route:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}