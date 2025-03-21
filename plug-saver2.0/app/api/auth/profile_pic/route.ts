import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Parse the request body as FormData
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const user_id = formData.get("user_id") as string;

    if (!file || !user_id) {
      return NextResponse.json(
        { success: false, message: "File and user_id are required" },
        { status: 400 }
      );
    }

    // Forward the request to the backend
    const backendFormData = new FormData();
    backendFormData.append("file", file);
    backendFormData.append("user_id", user_id);

    const response = await fetch("http://localhost:8000/upload-profile-picture", {
      method: "POST",
      body: backendFormData,
    });

    // Handle non-JSON responses
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
    console.error("Error uploading profile picture:", err);
    return NextResponse.json(
      { success: false, message: "An error occurred while uploading the avatar" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const user_id = searchParams.get("user_id");
  
      if (!user_id) {
        return NextResponse.json(
          { success: false, message: "User ID is required" },
          { status: 400 }
        );
      }
  
      // Forward the request to the backend
      const backendUrl = `http://localhost:8000/profile-picture?user_id=${encodeURIComponent(user_id)}`; // Adjust the endpoint as needed
      const response = await fetch(backendUrl, {
        method: "GET",
      });
  
      // Handle non-JSON responses
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
      console.error("Error fetching profile picture:", err);
      return NextResponse.json(
        { success: false, message: "An error occurred while fetching the profile picture" },
        { status: 500 }
      );
    }
  }