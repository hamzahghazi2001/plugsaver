import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { config } from "@/app/api/auth/config"; // Adjust the path as needed

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

export async function GET(req: NextRequest) {
  try {
    // Get the token from the Authorization header
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    console.log("Token received:", token);
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authorization token missing" },
        { status: 401 }
      );
    }

    // Fetch the user's data using the token
    const { data: user, error } = await supabase.auth.getUser(token);
    console.log("Supabase User Data:", user);
    if (error || !user) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    // Fetch additional user data from the `users` table in Supabase
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", user.user.email)
      .single();

      console.log("User Data from Supabase:", userData);

    if (userError || !userData) {
      return NextResponse.json(
        { success: false, message: "User data not found" },
        { status: 404 }
      );
    }

    // Return the full user data
    return NextResponse.json({ success: true, user: userData });
  } catch (err) {
    console.error("Error in /api/user_email:", err);
    return NextResponse.json(
      { success: false, message: "An error occurred" },
      { status: 500 }
    );
  }
}