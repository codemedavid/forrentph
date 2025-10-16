# Authentication Quick Start 🚀

Get your admin panel authentication running in 5 minutes!

## ✅ What Was Installed

```bash
npm install @supabase/ssr @radix-ui/react-avatar
```

## 🔐 Files Created

### Core Auth Files:
- ✅ `src/lib/supabase-server.ts` - Server-side auth
- ✅ `src/lib/supabase-client.ts` - Client-side auth
- ✅ `src/contexts/auth-context.tsx` - Auth context
- ✅ `middleware.ts` - Route protection
- ✅ `src/app/auth/login/page.tsx` - Login page
- ✅ `src/app/auth/signup/page.tsx` - Signup page
- ✅ `src/components/ui/avatar.tsx` - User avatar

### Updated Files:
- ✅ `src/components/admin/admin-layout.tsx` - Real user info
- ✅ `src/app/layout.tsx` - AuthProvider wrapper

---

## 🚀 Quick Setup

### **Step 1: Environment Variables**

Make sure `.env.local` exists with:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### **Step 2: Enable Email Auth in Supabase**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication** → **Providers**
4. Ensure **Email** is enabled ✅

### **Step 3: Configure Site URL (Important!)**

1. In Supabase Dashboard → **Authentication** → **URL Configuration**
2. Set **Site URL**: `http://localhost:3000`
3. Add to **Redirect URLs**:
   - `http://localhost:3000/**`
   - `http://localhost:3000/auth/callback`

### **Step 4: Create Your First Admin User**

#### **Option A: Use Signup Page** (Recommended for Development)
```bash
# Start your dev server
npm run dev

# Navigate to:
http://localhost:3000/auth/signup

# Fill in:
- Full Name: Admin User
- Email: admin@example.com
- Password: your_password
- Confirm Password: your_password

# Click "Create Account"
# Check email for verification link
# Click verification link
# Login at http://localhost:3000/auth/login
```

#### **Option B: Create User Directly in Supabase** (Testing Only)
```bash
# In Supabase Dashboard → Authentication → Users
# Click "Add User" or "Invite User"
# Enter email address
# User receives invitation email
```

#### **Option C: Bypass Email Verification** (Development Only)

In Supabase Dashboard:
1. **Authentication** → **Settings**
2. Find **Email Auth** section
3. **Disable** "Enable email confirmations"
4. Now you can signup and login immediately without email verification

### **Step 5: Test Authentication**

1. Start dev server: `npm run dev`
2. Navigate to: `http://localhost:3000/admin`
3. Should redirect to: `http://localhost:3000/auth/login`
4. Enter credentials and login
5. Should redirect back to: `http://localhost:3000/admin`

---

## 🎯 How It Works

```
┌─────────────────────────────────────────────────────┐
│  User visits /admin                                  │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│  middleware.ts checks for session                    │
└────────────────┬────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
   [No Session]      [Has Session]
        │                 │
        ▼                 ▼
  Redirect to      Access granted
  /auth/login     Show admin panel
```

---

## 🔐 Protected Routes

These routes now require authentication:

- ✅ `/admin` - Dashboard
- ✅ `/admin/categories` - Category management
- ✅ `/admin/settings` - Settings
- ✅ `/admin/costumes/[id]` - Costume availability

---

## 🎨 What Changed in UI

### **Before:**
- Fake "Admin User" text
- Non-functional "Logout" button
- No real authentication

### **After:**
- Real user email and name displayed
- User avatar with initials
- Functional logout with loading state
- Protected admin routes
- Login/Signup pages

---

## 🛠️ Using Auth in Your Code

### **In Client Components:**
```typescript
'use client';

import { useAuth } from '@/contexts/auth-context';

export function MyComponent() {
  const { user, loading, signOut } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please login</div>;

  return (
    <div>
      <p>Welcome {user.email}!</p>
      <button onClick={signOut}>Logout</button>
    </div>
  );
}
```

### **In Server Components:**
```typescript
import { getUser } from '@/lib/supabase-server';

export default async function ServerComponent() {
  const user = await getUser();

  if (!user) {
    redirect('/auth/login');
  }

  return <div>Welcome {user.email}!</div>;
}
```

---

## 🚨 Troubleshooting

### **Problem: Can't create account - "Email already exists"**
**Solution:** Email is already registered. Use login instead.

### **Problem: After login, redirected back to login**
**Solution:** 
1. Check browser cookies are enabled
2. Clear browser cache
3. Restart dev server

### **Problem: "NEXT_PUBLIC_SUPABASE_URL is not set"**
**Solution:** 
1. Create `.env.local` file in project root
2. Add your Supabase credentials
3. Restart dev server

### **Problem: Email verification link doesn't work**
**Solution:**
1. Check Site URL in Supabase settings
2. For development, disable email confirmation (see Step 4 Option C)
3. Or update redirect URLs in Supabase

### **Problem: Middleware not protecting routes**
**Solution:**
1. Ensure `middleware.ts` is in project root (NOT in `src/`)
2. Restart dev server
3. Clear browser cache

---

## 📋 Testing Checklist

- [ ] Can access login page: `/auth/login`
- [ ] Can access signup page: `/auth/signup`
- [ ] Visiting `/admin` redirects to login when not authenticated
- [ ] Can create account via signup
- [ ] Can login with valid credentials
- [ ] After login, redirected to `/admin`
- [ ] User email/name displayed in admin panel
- [ ] Can logout successfully
- [ ] After logout, can't access `/admin`

---

## 🎉 You're Done!

Your admin panel is now secured! 

**Next Steps:**
- Add password reset functionality
- Implement role-based access control
- Customize email templates
- Add audit logging

For detailed documentation, see `AUTHENTICATION_GUIDE.md`

---

## 🔗 Quick Links

- **Login:** http://localhost:3000/auth/login
- **Signup:** http://localhost:3000/auth/signup
- **Admin:** http://localhost:3000/admin
- **Supabase Dashboard:** https://supabase.com/dashboard

---

Need help? Check `AUTHENTICATION_GUIDE.md` for full documentation!

