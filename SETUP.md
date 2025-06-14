# 🚀 Supabase Setup Guide for Debtrix

This guide will walk you through setting up Supabase authentication and database for the Debtrix application.

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub (recommended)
4. Click "New Project"
5. Choose your organization
6. Fill in project details:
   - **Name**: `debtrix` (or your preferred name)
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users
7. Click "Create new project"
8. Wait 2-3 minutes for setup to complete

## Step 2: Get Your API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://abcdefgh.supabase.co`)
   - **anon public** key (the long string under "Project API keys")

## Step 3: Configure Environment Variables

1. In your project root, create a `.env` file:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

2. Replace the values with your actual Supabase URL and anon key

## Step 4: Set Up Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire content from `supabase/migrations/20250614174953_misty_union.sql`
4. Paste it into the SQL editor
5. Click **Run** (or press Ctrl/Cmd + Enter)
6. You should see "Success. No rows returned" message

## Step 5: Configure Authentication (CRITICAL!)

1. Go to **Authentication** → **Settings**
2. Under **Site URL**, add your development URL: `http://localhost:3000`
3. Under **Redirect URLs**, add:
   - `http://localhost:3000/**`
   - `https://your-domain.netlify.app/**` (for production)

### IMPORTANT: Disable Email Confirmation (Required for Testing)

**This is the most important step to prevent authentication errors!**

1. Go to **Authentication** → **Settings** → **Email**
2. **Turn OFF "Enable email confirmations"**
3. This prevents the "User already registered" error
4. This allows immediate login without email verification

**Why this is necessary:**
- When email confirmation is enabled, Supabase remembers email addresses even after user deletion
- This causes the "User already registered" error when trying to sign up again
- Disabling email confirmation allows immediate account creation and login

## Step 6: Test Your Setup

1. Start your development server:
```bash
npm run dev
```

2. Go to `http://localhost:3000`
3. Click "Sign Up" and create a test account
4. You should be immediately logged in (no email confirmation needed)
5. Check your Supabase dashboard:
   - Go to **Authentication** → **Users** to see your new user
   - Go to **Table Editor** → **profiles** to see the auto-created profile

## Step 7: Production Deployment

### For Netlify:

1. In your Netlify dashboard, go to **Site settings** → **Environment variables**
2. Add the same environment variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your anon public key

3. Update your Supabase authentication settings:
   - Go to **Authentication** → **Settings**
   - Add your production URL to **Redirect URLs**: `https://your-site.netlify.app/**`

4. **For production, you may want to re-enable email confirmation**:
   - Go to **Authentication** → **Settings** → **Email**
   - Turn ON "Enable email confirmations" for better security

## Verification Checklist

- [ ] Supabase project created and fully initialized
- [ ] Environment variables configured in `.env`
- [ ] Database migration executed successfully
- [ ] Authentication settings configured
- [ ] **Email confirmation DISABLED for testing**
- [ ] Test user registration works (immediate login)
- [ ] Test user login works
- [ ] User profile automatically created in database
- [ ] Production environment variables set (if deploying)

## Troubleshooting

### "User already registered" Error
**This is the most common issue!**

**Solution:**
1. Go to **Authentication** → **Settings** → **Email**
2. **Turn OFF "Enable email confirmations"**
3. Try signing up again
4. The error should be resolved

**Why this happens:**
- Supabase remembers email addresses when email confirmation is enabled
- Even after deleting a user, the email remains "reserved"
- Disabling email confirmation fixes this issue

### "Invalid login credentials" Error
1. Make sure you successfully created an account first
2. Verify email confirmation is disabled (see above)
3. Check that your email and password are correct
4. Try the "Forgot password?" feature
5. Clear browser cookies and try again

### "Missing Supabase environment variables"
- Check that your `.env` file exists in the project root
- Verify the variable names are exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart your development server after adding environment variables

### "Invalid Supabase URL format"
- Ensure your URL starts with `https://` and ends with `.supabase.co`
- Don't include trailing slashes

### Authentication not working
- Verify your Supabase project is fully set up (not still initializing)
- Check that the database migration was run successfully
- **Ensure email confirmation is DISABLED for testing**
- Check browser console for specific error messages

### Database errors
- Make sure you ran the complete migration file
- Check that all tables were created: `profiles`, `projects`, `ux_debts`
- Verify RLS (Row Level Security) is enabled on all tables

## Advanced Troubleshooting

### If you're still having issues:

1. **Delete and recreate your Supabase project**:
   - Sometimes starting fresh resolves configuration issues
   - Make sure to disable email confirmation from the start

2. **Check browser developer tools**:
   - Look at Console tab for JavaScript errors
   - Check Network tab for failed API requests
   - Look for specific error messages

3. **Try a different email address**:
   - If one email is "stuck", try a completely different one
   - This can help identify if it's an email-specific issue

4. **Clear all browser data**:
   - Clear cookies, local storage, and session storage
   - Try in an incognito/private browsing window

## Need Help?

If you're still having issues after following this guide:

1. Check the browser console for error messages
2. Check the Supabase dashboard logs
3. Verify all steps were completed in order
4. Make sure email confirmation is disabled
5. Try creating a fresh Supabase project if needed

**Remember: The most common issue is having email confirmation enabled. Always disable it for testing!**

The application should now be fully functional with real Supabase authentication and database integration!