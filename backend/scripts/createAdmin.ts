import dotenv from "dotenv";
import path from "path";

// Load environment variables FIRST before importing anything that uses them
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import bcrypt from "bcrypt";
import { query } from "../../lib/db";

const createAdmin = async (): Promise<void> => {
  try {
    console.log("Checking if admin user exists...");
    const adminEmail = "admin@vibeflow.com";

    const existingAdmins = await query(
        "SELECT id FROM users WHERE email = $1 LIMIT 1", 
        [adminEmail]
    );

    if (existingAdmins.rows.length > 0) {
      console.log(`✅ Admin user with email ${adminEmail} already exists.`);
      console.log(`\n📋 Admin Login Credentials:`);
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: Admin123!`);
      process.exit(0);
    }

    console.log("Creating admin user...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("Admin123!", salt);
    const adminName = "Admin User";
    const adminPhone = "+254712345678";
    const adminRole = "admin";
    const adminAccount = "9999999999";
    const adminBalance = 1000000.00;

    const results = await query(
      `INSERT INTO users
       (name, email, password, phone_number, role, account_number, balance, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
       RETURNING id, name, email, role`,
      [adminName, adminEmail, hashedPassword, adminPhone, adminRole, adminAccount, adminBalance]
    );

    if (results.rows && results.rows.length > 0) {
         console.log("✅ Admin user created successfully!");
         console.log(`\n📋 Admin Login Credentials:`);
         console.log(`   Email: ${adminEmail}`);
         console.log(`   Password: Admin123!`);
         console.log(`\n⚠️  Note: After logging in, check your server console for the verification code.`);
    } else {
         console.warn("⚠️  Admin user inserted, but no data was returned.");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    process.exit(1);
  }
};

createAdmin();
