import { NextResponse, NextRequest } from "next/server";


export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const room_id = searchParams.get("room_id");

    if (!room_id) {
        return NextResponse.json(
          { success: false, message: " Room Id is required." },
          { status: 400 }
        );
      }
    
      try {
        const response = await fetch(`http://localhost:8000/api/auth/getroomname?room_id=${encodeURIComponent(room_id)}`);
        const data = await response.json();
        return NextResponse.json(data);
      } catch (err) {
        return NextResponse.json(
          { success: false, message: "An error occurred." },
          { status: 500 }
        );
      }
    }