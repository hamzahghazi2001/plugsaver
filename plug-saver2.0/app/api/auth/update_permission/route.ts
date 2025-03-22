import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { householdCode, managerId, memberId, canControl, canConfigure } = await req.json();

    // Debugging: Print all received data
    console.log("Received Data:");
    console.log("Household Code:", householdCode);
    console.log("Manager ID:", managerId);
    console.log("Member ID:", memberId);
    console.log("Can Control:", canControl);
    console.log("Can Configure:", canConfigure);

  try {
    const response = await fetch("http://localhost:8000/update_permissions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        householdCode,
        managerId,
        memberId,
        canControl,
        canConfigure,
      }),
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