# How to Update Admin Email on Vercel

This guide will help you update the admin email from `admin@vibeflow.com` to `lucygathonilg05@gmail.com` on your Vercel deployment.

## Step 1: Update the Database (Choose One Method)

### Option A: Run the Update Script Locally (Recommended)

If you have access to your database from your local machine:

```bash
# Make sure your .env file has the correct database credentials
npx ts-node --project tsconfig.server.json backend/scripts/updateAdminEmail.ts
```

This will:
- Find the admin user with the old email
- Update it to the new email
- Verify the change was successful

### Option B: Update via Database Directly

If you have direct database access (via Neon dashboard, pgAdmin, etc.):

```sql
-- Check current admin user
SELECT id, email, role FROM users WHERE role = 'admin';

-- Update the email
UPDATE users 
SET email = 'lucygathonilg05@gmail.com' 
WHERE email = 'admin@vibeflow.com' AND role = 'admin';

-- Verify the update
SELECT id, email, role FROM users WHERE role = 'admin';
```

### Option C: Use Vercel CLI to Run Script

If you have Vercel CLI installed and your database is accessible:

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Link to your project
vercel link

# Run the script in Vercel environment
vercel env pull .env.local
npx ts-node --project tsconfig.server.json backend/scripts/updateAdminEmail.ts
```

## Step 2: Commit and Push Code Changes

The code changes are already made. Now commit and push:

```bash
# Check what files changed
git status

# Add the changes
git add .

# Commit
git commit -m "Update admin email to lucygathonilg05@gmail.com"

# Push to GitHub
git push origin main
```

Vercel will automatically detect the push and start a new deployment.

## Step 3: Verify Environment Variables on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Verify these variables are set:
   - `RESEND_API_KEY` - Your Resend API key (for sending verification emails)
   - `RESEND_FROM_EMAIL` - Optional: Custom sender email
   - All database variables (`DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, etc.)
   - `JWT_SECRET` - Your JWT secret

## Step 4: Wait for Deployment

- Vercel will automatically build and deploy your changes
- Monitor the deployment in the Vercel dashboard
- Wait for the deployment to complete (usually 2-5 minutes)

## Step 5: Test the Admin Login

1. Go to your Vercel deployment URL: `https://your-project.vercel.app/admin/login`
2. Try logging in with:
   - **Email:** `lucygathonilg05@gmail.com`
   - **Password:** `Admin123!`
3. Check your email (`lucygathonilg05@gmail.com`) for the verification code
4. Enter the verification code to complete login

## Troubleshooting

### If the old admin email still exists in database:

**Option 1: Delete and recreate**
```sql
-- Delete old admin
DELETE FROM users WHERE email = 'admin@vibeflow.com' AND role = 'admin';

-- Then run createAdmin script (it will create with new email)
```

**Option 2: Manual update via SQL**
```sql
UPDATE users 
SET email = 'lucygathonilg05@gmail.com' 
WHERE email = 'admin@vibeflow.com' AND role = 'admin';
```

### If verification emails aren't being sent:

1. Check that `RESEND_API_KEY` is set in Vercel environment variables
2. Verify the API key is valid at [Resend Dashboard](https://resend.com/api-keys)
3. Check Vercel function logs for email sending errors
4. Make sure `lucygathonilg05@gmail.com` is a valid, accessible email

### If deployment fails:

1. Check Vercel build logs for errors
2. Verify all environment variables are set correctly
3. Make sure database connection is working
4. Check that all dependencies are installed (`npm install`)

## Quick Reference

**New Admin Credentials:**
- Email: `lucygathonilg05@gmail.com`
- Password: `Admin123!`

**Files Updated:**
- `backend/scripts/createAdmin.ts`
- `backend/scripts/setup-db.ts`
- `backend/setup_database.py`
- `ENV_SETUP.md`

**New Script Created:**
- `backend/scripts/updateAdminEmail.ts` - Use this to update existing admin email

