import { Resend } from "resend";

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send a verification code email to admin users
 */
export const sendVerificationEmail = async (
  email: string,
  verificationCode: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // If no API key is set, log to console (for development)
    if (!process.env.RESEND_API_KEY) {
      console.log(`[DEV MODE] Verification code for ${email}: ${verificationCode}`);
      console.log(
        `⚠️  To enable email sending in production, set RESEND_API_KEY in your environment variables`
      );
      return { success: true };
    }

    // Get the sender email from environment or use a default
    const fromEmail =
      process.env.RESEND_FROM_EMAIL || "Vibeflow <onboarding@resend.dev>";

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Admin Verification Code</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px;">
            <h1 style="color: #1a1a1a; margin-top: 0;">Admin Login Verification</h1>
            <p>Hello,</p>
            <p>You have requested to log in to the Vibeflow Admin Panel. Use the verification code below to complete your login:</p>
            
            <div style="background-color: #ffffff; border: 2px dashed #4a90e2; border-radius: 6px; padding: 20px; text-align: center; margin: 30px 0;">
              <h2 style="color: #4a90e2; font-size: 32px; letter-spacing: 8px; margin: 0; font-weight: bold;">
                ${verificationCode}
              </h2>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              <strong>Important:</strong> This code will expire in 10 minutes. Do not share this code with anyone.
            </p>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              If you did not request this code, please ignore this email or contact support immediately.
            </p>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; margin: 0;">
              This is an automated message from Vibeflow Banking System. Please do not reply to this email.
            </p>
          </div>
        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Your Admin Verification Code - Vibeflow",
      html: emailHtml,
    });

    if (error) {
      console.error("Error sending verification email:", error);
      return { success: false, error: error.message };
    }

    console.log(`✅ Verification email sent to ${email} (ID: ${data?.id})`);
    return { success: true };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

/**
 * Generic email sending function
 */
export const sendEmail = async (
  options: EmailOptions
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log(`[DEV MODE] Email would be sent to ${options.to}`);
      return { success: true };
    }

    const fromEmail =
      process.env.RESEND_FROM_EMAIL || "Vibeflow <onboarding@resend.dev>";

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    if (error) {
      console.error("Error sending email:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};