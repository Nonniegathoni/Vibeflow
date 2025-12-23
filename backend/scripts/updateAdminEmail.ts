import dotenv from "dotenv";
import path from "path";

// Load environment variables FIRST before importing anything that uses them
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import { query } from "../../lib/db";

const updateAdminEmail = async (): Promise<void> => {
  try {
    const oldEmail = "admin@vibeflow.com";
    const newEmail = "lucygathonilg05@gmail.com";

    console.log("Checking for admin user with old email...");

    // Check if admin with old email exists
    const oldAdmin = await query(
      "SELECT id, email, role FROM users WHERE email = $1 AND role = 'admin'",
      [oldEmail]
    );

    if (oldAdmin.rows.length === 0) {
      console.log(`No admin user found with email: ${oldEmail}`);
      
      // Check if admin with new email already exists
      const newAdmin = await query(
        "SELECT id, email, role FROM users WHERE email = $1 AND role = 'admin'",
        [newEmail]
      );

      if (newAdmin.rows.length > 0) {
        console.log(`✅ Admin user already exists with new email: ${newEmail}`);
        process.exit(0);
      } else {
        console.log("No admin user found. Run createAdmin.ts to create one.");
        process.exit(0);
      }
    }

    // Check if new email is already in use
    const emailCheck = await query(
      "SELECT id, email FROM users WHERE email = $1",
      [newEmail]
    );

    if (emailCheck.rows.length > 0) {
      console.error(`❌ Error: Email ${newEmail} is already in use by another user.`);
      process.exit(1);
    }

    // Update admin email
    console.log(`Updating admin email from ${oldEmail} to ${newEmail}...`);
    
    const result = await query(
      "UPDATE users SET email = $1 WHERE email = $2 AND role = 'admin' RETURNING id, email, role",
      [newEmail, oldEmail]
    );

    if (result.rows.length > 0) {
      console.log("✅ Admin email updated successfully!");
      console.log(`\n📋 Updated Admin Credentials:`);
      console.log(`   Email: ${newEmail}`);
      console.log(`   Password: Admin123! (unchanged)`);
    } else {
      console.warn("⚠️  No rows were updated.");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating admin email:", error);
    process.exit(1);
  }
};

updateAdminEmail();

