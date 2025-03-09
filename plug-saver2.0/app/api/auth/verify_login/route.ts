import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { config } from "@/app/api/auth/config"; // Adjust the path as needed

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);
export async function POST(req: NextRequest) {
  const { email, userverifycode } = await req.json();

  try {
    const response = await fetch("http://localhost:8000/verify_login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, userverifycode }), // Include email in the request
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "An error occurred." },
      { status: 500 }
    );
  }
}