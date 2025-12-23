# Environment Variables Setup Guide

## Required Environment Variables

### Database Configuration (Already Set)
```bash
DATABASE_URL=postgresql://...
DB_NAME=neondb
DB_USER=neondb_owner
DB_PASSWORD=your_password
DB_HOST=your_host
DB_PORT=5432
```

### Authentication
```bash
JWT_SECRET=your_jwt_secret
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Email Service (NEW - Required for Production)
```bash
# Resend API Key (Required for sending verification emails)
# Get your API key from: https://resend.com/api-keys
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx

# Optional: Custom sender email (must be verified domain in Resend)
# If not set, defaults to "Vibeflow <onboarding@resend.dev>"
RESEND_FROM_EMAIL=Vibeflow <noreply@yourdomain.com>
```

## Setup Instructions

### 1. Local Development (.env file)
Add these lines to your `.env` file in the project root:

```bash
# Email Service
RESEND_API_KEY=re_your_api_key_here
# RESEND_FROM_EMAIL=Vibeflow <noreply@yourdomain.com>  # Optional
```

**Note:** If `RESEND_API_KEY` is not set, verification codes will be logged to the console (development mode).

### 2. Production (Vercel)
1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add:
   - `RESEND_API_KEY` = `re_your_api_key_here`
   - `RESEND_FROM_EMAIL` = `Vibeflow <noreply@yourdomain.com>` (optional)

### 3. Getting Your Resend API Key
1. Sign up at [https://resend.com](https://resend.com)
2. Go to **API Keys** in the dashboard
3. Create a new API key
4. Copy the key (starts with `re_`)
5. Add it to your environment variables

## Default Admin User

### Credentials
- **Email:** `lucygathonilg05@gmail.com`
- **Password:** `Admin123!`

### How Verification Code Works

#### Development Mode (No RESEND_API_KEY)
- When admin logs in, verification code is **logged to server console**
- Check your terminal/console where you ran `npm run dev`
- Look for: `Verification code for lucygathonilg05@gmail.com: 123456`

#### Production Mode (With RESEND_API_KEY)
- Verification code is **sent via email** to `lucygathonilg05@gmail.com`
- Admin receives email with the 6-digit code
- Code expires in 10 minutes

### Important Notes
✅ **Admin Email Updated:**
- The admin email has been set to `lucygathonilg05@gmail.com` (a real Gmail address)
- Verification codes will be delivered to this email when `RESEND_API_KEY` is configured
- Make sure this email account is accessible for receiving verification codes

### Updating Admin Email
If you need to change the admin email address:
1. Update it in the database directly, OR
2. Modify `backend/scripts/createAdmin.ts` and run it again

