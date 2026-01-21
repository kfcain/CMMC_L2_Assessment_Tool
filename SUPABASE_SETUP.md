# Supabase Backend Setup Guide

This guide walks you through setting up the Supabase backend for the CMMC L2 Assessment Tool's evidence storage feature.

## Prerequisites

- A Google Cloud Console account (for OAuth)
- A Supabase account (free tier is sufficient)

---

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Fill in:
   - **Name**: `cmmc-assessment-tool`
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users
4. Click **"Create new project"** and wait ~2 minutes

---

## Step 2: Run Database Migrations

1. In Supabase Dashboard, go to **SQL Editor**
2. Run each migration file in order:

### Migration 1: Initial Schema
Copy and paste the contents of `supabase/migrations/001_initial_schema.sql` and click **Run**

### Migration 2: Row Level Security
Copy and paste the contents of `supabase/migrations/002_row_level_security.sql` and click **Run**

### Migration 3: Storage Policies
Copy and paste the contents of `supabase/migrations/003_storage_policies.sql` and click **Run**

---

## Step 3: Set Up Google OAuth

### In Google Cloud Console:

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project or select existing
3. Go to **APIs & Services** → **OAuth consent screen**
   - Choose **External** user type
   - Fill in app name, support email
   - Add scopes: `email`, `profile`, `openid`
   - Add test users if in testing mode
4. Go to **APIs & Services** → **Credentials**
5. Click **Create Credentials** → **OAuth client ID**
   - Application type: **Web application**
   - Name: `CMMC Assessment Tool`
   - Authorized JavaScript origins:
     ```
     https://YOUR_SUPABASE_PROJECT.supabase.co
     http://localhost:3000
     ```
   - Authorized redirect URIs:
     ```
     https://YOUR_SUPABASE_PROJECT.supabase.co/auth/v1/callback
     http://localhost:3000/auth/callback
     ```
6. Copy the **Client ID** and **Client Secret**

### In Supabase Dashboard:

1. Go to **Authentication** → **Providers**
2. Find **Google** and click to expand
3. Toggle **Enable Sign in with Google**
4. Paste your **Client ID** and **Client Secret**
5. Click **Save**

---

## Step 4: Configure the Frontend

1. In Supabase Dashboard, go to **Settings** → **API**
2. Copy your:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key

3. Edit `js/supabase-client.js` and replace:
   ```javascript
   const SUPABASE_URL = 'YOUR_SUPABASE_URL';
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
   ```
   With your actual values.

---

## Step 5: Add Auth Container to HTML

Add this to your `index.html` in the sidebar section:

```html
<div class="auth-container" id="auth-container">
    <!-- Auth UI will be rendered here -->
</div>
```

And add the script/CSS includes:

```html
<link rel="stylesheet" href="css/evidence.css">
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="js/supabase-client.js"></script>
<script src="js/evidence-ui.js"></script>
```

---

## Step 6: Verify Setup

1. Open your app in a browser
2. Click **"Sign in with Google"**
3. Complete Google authentication
4. You should see your name/avatar in the sidebar
5. Create an organization and assessment
6. Try uploading evidence to an objective

---

## Security Features

| Feature | Implementation |
|---------|---------------|
| **Multi-tenancy** | Row Level Security (RLS) isolates data by organization |
| **Role-based access** | Owner, Admin, Assessor, Viewer roles with different permissions |
| **Secure file access** | Signed URLs with expiration (default 1 hour) |
| **Audit logging** | All actions logged with user, timestamp, IP |
| **File validation** | Type and size restrictions enforced server-side |

---

## Free Tier Limits

| Resource | Limit |
|----------|-------|
| Database | 500 MB |
| File Storage | 1 GB |
| Bandwidth | 2 GB/month |
| Auth Users | Unlimited |
| API Requests | Unlimited |

---

## Troubleshooting

### "Invalid API key"
- Double-check your `SUPABASE_URL` and `SUPABASE_ANON_KEY`
- Make sure you're using the **anon** key, not the **service_role** key

### "Google sign-in popup blocked"
- Allow popups for your domain
- Or use redirect mode instead of popup

### "Permission denied" errors
- Check that RLS policies were applied correctly
- Verify user has correct role in organization

### Storage upload fails
- Check file size (max 50MB)
- Verify file type is allowed
- Check storage bucket policies were created

---

## Next Steps

- [ ] Set up custom domain in Supabase
- [ ] Configure email templates for invitations
- [ ] Add Edge Functions for advanced logic
- [ ] Set up database backups
- [ ] Implement rate limiting

---

## Support

For issues with this integration, check:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
