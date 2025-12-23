import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import bcrypt from "bcrypt"
import crypto from "crypto"
import sessionStore from "@/lib/session-store"
import { sendVerificationEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    // Check if user exists and is an admin
    const result = await query("SELECT * FROM users WHERE email = $1 AND role = 'admin'", [email])

    if (result.rows.length === 0) {
      // Use a generic error message to prevent user enumeration
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    const user = result.rows[0]
 
    // Check password
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Generate a temporary session token
    const sessionToken = crypto.randomBytes(32).toString("hex")

    // Store the session token with a 10-minute expiry
    sessionStore[sessionToken] = {
      userId: user.id,
      email: user.email,
      expires: Date.now() + 10 * 60 * 1000, // 10 minutes
    }

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10) // 10 minutes from now

    // Update user with verification code in database
    await query(
      "UPDATE users SET verification_code = $1, verification_code_expires_at = $2 WHERE id = $3",
      [verificationCode, expiresAt, user.id]
    )

    // Send verification code via email
    const emailResult = await sendVerificationEmail(email, verificationCode)
    
    if (!emailResult.success) {
      // Log error but don't fail the request - code is still in database
      console.error("Failed to send verification email:", emailResult.error)
      // In development, still log the code to console
      if (!process.env.RESEND_API_KEY) {
        console.log(`Verification code for ${email}: ${verificationCode}`)
      }
    }

    return NextResponse.json({
      message: "Verification code sent",
      sessionToken,
    })
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json({ message: "An error occurred during login" }, { status: 500 })
  }
}
