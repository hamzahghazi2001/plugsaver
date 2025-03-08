const BASE_URL = "http://localhost:8000"; // Change if needed

export async function joinHousehold(userEmail: string, householdCode: string) {
    const response = await fetch(`${BASE_URL}/join-household`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_email: userEmail, household_code: householdCode }),
    });

    return response.json();
}
