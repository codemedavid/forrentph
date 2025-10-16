# Authentication Guide

Complete authentication system for the Costume Rental admin panel using Supabase Auth.

## 🔐 Features Implemented

### ✅ Core Authentication
- **Login System** - Secure email/password authentication
- **Signup System** - New admin registration with email verification
- **Session Management** - Automatic session refresh and persistence
- **Protected Routes** - Middleware-based route protection
- **Logout** - Secure sign out functionality

### ✅ User Experience
- **Loading States** - Spinners during authentication actions
- **Error Handling** - User-friendly error messages
- **Redirect After Login** - Automatically redirects to intended page
- **Auto Redirect** - Authenticated users redirected away from auth pages
- **User Profile Display** - Shows user email and name in admin panel

---

## 📁 Files Created

### **Authentication Utilities**
```
src/lib/supabase-server.ts    # Server-side Supabase client
src/lib/supabase-client.ts    # Client-side Supabase client
```

### **Auth Context**
```
src/contexts/auth-context.tsx  # React context for auth state
```

### **Auth Pages**
```
src/app/auth/login/page.tsx    # Login page
src/app/auth/signup/page.tsx   # Signup page
src/app/auth/layout.tsx        # Auth layout (no nav/footer)
```

### **Middleware**
```
middleware.ts                  # Route protection
```

### **UI Components**
```
src/components/ui/avatar.tsx   # Avatar component for user display
```

### **Updated Files**
```
src/components/admin/admin-layout.tsx  # Updated with real user info
src/app/layout.tsx                     # Wrapped with AuthProvider
```

---

## 🚀 How to Use

### **1. Setup Supabase (if not already done)**

Make sure you have these environment variables in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### **2. Enable Email Auth in Supabase**

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable **Email** provider
3. Configure email templates (optional)

### **3. Create First Admin User**

#### Option A: Via Signup Page
1. Navigate to `http://localhost:3000/auth/signup`
2. Fill in the form
3. Check email for verification link
4. Click verification link
5. Login at `http://localhost:3000/auth/login`

#### Option B: Via Supabase Dashboard
1. Go to Authentication → Users
2. Click "Invite User"
3. Enter email address
4. User receives invitation email

#### Option C: Via SQL (for testing)
```sql
-- Create a test user directly (bypasses email verification)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  confirmation_token,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@example.com',
  crypt('your_password_here', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"full_name": "Admin User"}',
  '',
  ''
);
```

### **4. Access Admin Panel**

1. Navigate to `http://localhost:3000/admin`
2. If not logged in, you'll be redirected to login
3. After successful login, you'll be redirected to admin dashboard

---

## 🔒 Protected Routes

### **Automatically Protected:**
- `/admin` - Main dashboard
- `/admin/categories` - Category management
- `/admin/settings` - Settings management
- `/admin/costumes/[id]` - Individual costume management

### **How it Works:**
The middleware (`middleware.ts`) checks for authenticated sessions:
- ✅ **Has session** → Access granted
- ❌ **No session** → Redirect to `/auth/login?redirect=/admin`

---

## 🎯 Auth Context API

Use the `useAuth()` hook in any client component:

```typescript
'use client';

import { useAuth } from '@/contexts/auth-context';

function MyComponent() {
  const { user, loading, signIn, signUp, signOut } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not logged in</div>;

  return (
    <div>
      <p>Welcome, {user.email}!</p>
      <button onClick={signOut}>Logout</button>
    </div>
  );
}
```

### **Available Properties:**

```typescript
{
  user: User | null;              // Current user object
  loading: boolean;               // Auth state loading
  signIn: (email, password) => Promise<{error}>;
  signUp: (email, password, fullName) => Promise<{error}>;
  signOut: () => Promise<void>;
}
```

---

## 🎨 Login Page Features

**URL:** `/auth/login`

**Features:**
- Email and password input
- Form validation
- Loading state during sign-in
- Error messages display
- "Forgot password?" link (placeholder)
- "Back to website" link
- Auto-redirect if already authenticated

---

## 🎨 Signup Page Features

**URL:** `/auth/signup`

**Features:**
- Full name, email, password fields
- Password confirmation
- Client-side validation:
  - Passwords must match
  - Minimum 6 characters
- Success state with email verification notice
- Loading state during sign-up
- Error messages display
- Link to login page
- Auto-redirect if already authenticated

---

## 🛡️ Middleware Configuration

Located in `middleware.ts` at project root.

### **Current Configuration:**
```typescript
export const config = {
  matcher: [
    '/admin/:path*',      // All admin routes
    '/auth/login',        // Login page (redirect if authenticated)
    '/auth/signup',       // Signup page (redirect if authenticated)
  ],
};
```

### **Add More Protected Routes:**
```typescript
export const config = {
  matcher: [
    '/admin/:path*',
    '/auth/login',
    '/auth/signup',
    '/api/admin/:path*',  // Protect API routes too
  ],
};
```

---

## 👤 User Profile in Admin Panel

The `AdminLayout` component now displays:
- User avatar with initials
- Full name (if provided during signup)
- Email address
- Logout button with loading state

**Desktop:** Shown in top right corner and sidebar footer
**Mobile:** Shown in sidebar footer

---

## 🔄 Session Management

### **Automatic Session Refresh**
The middleware automatically refreshes sessions on every request.

### **Session Persistence**
Sessions persist across browser restarts using cookies.

### **Session Expiration**
Default Supabase session lifetime: **1 hour**
Refresh token lifetime: **30 days**

### **Customize Session Duration**
In Supabase Dashboard → Authentication → Settings:
- JWT expiry
- Refresh token rotation

---

## 🚨 Error Handling

### **Common Errors:**

| Error | Cause | Solution |
|-------|-------|----------|
| "Invalid login credentials" | Wrong email/password | Check credentials |
| "Email not confirmed" | User hasn't verified email | Check inbox for verification email |
| "User already registered" | Email exists | Use login instead |
| "NEXT_PUBLIC_SUPABASE_URL is not set" | Missing env vars | Add to `.env.local` |

---

## 🔧 Advanced Configuration

### **Password Requirements**

Edit in `/auth/signup/page.tsx`:
```typescript
if (password.length < 8) {  // Change from 6 to 8
  setError('Password must be at least 8 characters');
  return;
}

// Add more validation
if (!/[A-Z]/.test(password)) {
  setError('Password must contain uppercase letter');
  return;
}
```

### **Email Verification**

By default, Supabase requires email verification.

**Disable for testing:**
Supabase Dashboard → Authentication → Settings → Email Auth → Disable "Enable email confirmations"

### **Custom Email Templates**

Supabase Dashboard → Authentication → Email Templates

Templates available:
- Confirmation email
- Invitation email
- Magic link
- Password recovery

---

## 🔐 Security Best Practices

### ✅ **Implemented:**
- Passwords hashed by Supabase (bcrypt)
- Secure HTTP-only cookies
- CSRF protection via Supabase
- Session tokens in cookies (not localStorage)
- Middleware-based route protection

### 🎯 **Recommended:**
1. **Enable RLS (Row Level Security)** on Supabase tables
2. **Add role-based access** (admin, staff, viewer)
3. **Implement password reset** functionality
4. **Add 2FA** (Two-Factor Authentication)
5. **Rate limiting** on auth endpoints
6. **Audit logging** for admin actions

---

## 📊 Adding Role-Based Access Control (RBAC)

### **1. Add Role Column to Users**

In Supabase SQL Editor:
```sql
ALTER TABLE auth.users 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'admin';

-- Or use user_metadata
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'
WHERE email = 'admin@example.com';
```

### **2. Update Auth Context**

```typescript
// In auth-context.tsx
export function useAuth() {
  const context = useContext(AuthContext);
  
  const isAdmin = () => {
    return context.user?.user_metadata?.role === 'admin';
  };
  
  return { ...context, isAdmin };
}
```

### **3. Protect Components**

```typescript
const { user, isAdmin } = useAuth();

if (!isAdmin()) {
  return <div>Access Denied</div>;
}
```

---

## 🧪 Testing Authentication

### **Test Scenarios:**

1. ✅ **Login with valid credentials**
2. ✅ **Login with invalid credentials** → Error shown
3. ✅ **Access /admin without login** → Redirect to login
4. ✅ **Login successful** → Redirect to /admin
5. ✅ **Access /auth/login while authenticated** → Redirect to /admin
6. ✅ **Logout** → Redirect to login
7. ✅ **Signup with valid data** → Email verification notice
8. ✅ **Signup with existing email** → Error shown
9. ✅ **Browser refresh on /admin** → Session persists

---

## 🆘 Troubleshooting

### **Issue: Can't Login - Always Redirects**

**Solution:**
1. Check browser cookies are enabled
2. Clear browser cache and cookies
3. Check Supabase logs in dashboard

### **Issue: Middleware Not Working**

**Solution:**
1. Ensure `middleware.ts` is in project root (not `src/`)
2. Restart dev server
3. Check middleware.ts has no syntax errors

### **Issue: User Keeps Getting Logged Out**

**Solution:**
1. Check session expiration settings in Supabase
2. Ensure middleware is refreshing sessions
3. Check for conflicting auth implementations

### **Issue: Email Verification Link Not Working**

**Solution:**
1. Check Site URL in Supabase settings
2. Update redirect URLs in Supabase
3. Use custom email templates with correct links

---

## 📚 Next Steps

1. **Implement Password Reset:**
   - Create `/auth/forgot-password` page
   - Use Supabase password recovery

2. **Add Role-Based Access:**
   - Admin, Staff, Viewer roles
   - Different permissions per role

3. **Email Templates:**
   - Customize Supabase email templates
   - Match your brand style

4. **Audit Trail:**
   - Log admin actions
   - Track who changed what

5. **Multi-Factor Authentication:**
   - Add TOTP support
   - SMS verification

---

## 🔗 Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [@supabase/ssr Package](https://supabase.com/docs/guides/auth/server-side/nextjs)

---

## ✅ Done!

Your admin panel is now secured with:
- ✅ User authentication
- ✅ Protected routes
- ✅ Session management
- ✅ Login/Signup pages
- ✅ User profile display
- ✅ Secure logout

Visit `/auth/login` to get started!

