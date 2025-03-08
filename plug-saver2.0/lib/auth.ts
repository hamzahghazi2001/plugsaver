import { jwtVerify, SignJWT } from "jose"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"

const secretKey = process.env.JWT_SECRET || "your-secret-key"
const key = new TextEncoder().encode(secretKey)

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key)
}

export async function decrypt(token: string) {
  try {
    const { payload } = await jwtVerify(token, key)
    return payload
  } catch (error) {
    return null
  }
}

export async function login(formData: FormData) {
  // This would typically validate against a database
  const email = formData.get("email")
  const password = formData.get("password")

  if (email === "demo@example.com" && password === "demo123") {
    const token = await encrypt({ email, role: "user" })
    cookies().set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
    })
    return { success: true }
  }

  return { success: false, error: "Invalid credentials" }
}

export async function logout() {
  cookies().delete("session")
}

export async function getSession() {
  const session = cookies().get("session")
  if (!session) return null

  const payload = await decrypt(session.value)
  return payload
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")
  if (!session) return

  // Validate the session and refresh if needed
  const payload = await decrypt(session.value)
  if (!payload) return

  // Create a new session with a refreshed expiration
  const newToken = await encrypt(payload)
  request.cookies.set("session", newToken)
}

