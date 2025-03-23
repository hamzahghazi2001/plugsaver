import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  // Parse the request body to get the rewards_id
  const { rewards_id } = await req.json();

  try {
    // Call the FastAPI /points_and_badges endpoint
    const response = await fetch("http://localhost:8000/points_and_badges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rewards_id }),
    });

    // Parse the response data
    const data = await response.json();

    // Return the transformed data to the frontend
    return NextResponse.json(data);
  } catch (err) {
    // Handle any unexpected errors
    return NextResponse.json(
      { success: false, message: "An error occurred while fetching points and badges." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rewards_id = searchParams.get("rewards_id");

    if (!rewards_id) {
      return NextResponse.json(
        { error: "rewards_id is required" },
        { status: 400 }
      );
    }

    const response = await fetch(`http://localhost:8000/api/auth/get_rewards?rewards_id=${rewards_id}`);

    const data = await response.json();

    // Handle case where backend returns success: False
    if (!data.success) {
      return NextResponse.json(
        { error: data.message },
        { status: 404 }
      );
    }

    // Return the rewards data directly
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error.message
      },
      { status: 500 }
    );
  }
}