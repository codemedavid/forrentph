import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { AuthProvider } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Costume Rental - Premium Costume Rentals",
  description: "Rent high-quality costumes for any occasion. From inflatable costumes to character outfits, we have everything you need for your next event.",
  keywords: "costume rental, inflatable costumes, character costumes, party costumes, event costumes",
};

interface HeaderBranding {
  companyName: string;
  companyFullName: string;
  tagline: string;
  logoEmoji: string;
}

// Fetch branding on server-side
async function getHeaderBranding(): Promise<HeaderBranding> {
  const defaultBranding = {
    companyName: 'ForRentPH',
    companyFullName: 'ForRentPH - Inflatable Costumes Rentals',
    tagline: 'Where fun comes alive',
    logoEmoji: '🎭',
  };

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return defaultBranding;
    }

    const { data } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'header_branding')
      .single();
    
    return data?.value || defaultBranding;
  } catch (error) {
    console.error('Failed to fetch header branding:', error);
    return defaultBranding;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const branding = await getHeaderBranding();

  return (
    <html lang="en" className="overflow-x-hidden">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col overflow-x-hidden max-w-full`}
      >
        <AuthProvider>
          <Navigation branding={branding} />
          <main className="flex-1 w-full overflow-x-hidden">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
