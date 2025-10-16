'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ShoppingCart, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface HeaderBranding {
  companyName: string;
  companyFullName: string;
  tagline: string;
  logoEmoji: string;
}

interface NavigationProps {
  branding: HeaderBranding;
}

export function Navigation({ branding }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Costumes', href: '/costumes' },
    { name: 'Categories', href: '/categories' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-16 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-primary-foreground font-bold text-xl">{branding.logoEmoji}</span>
            </div>
            <div className="hidden sm:block">
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold text-foreground">{branding.companyName}</span>
                <span className="text-xs sm:text-sm text-muted-foreground">{branding.tagline}</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
            <Link href="/costumes">
              <Button variant="ghost" size="icon" className="hover:bg-accent">
                <Search className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="relative hover:bg-accent">
              <ShoppingCart className="h-4 w-4" />
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                0
              </Badge>
            </Button>
            <Link href="/admin">
              <Button variant="outline" size="sm" className="text-xs">
                Admin
              </Button>
            </Link>
            <Link href="/booking">
              <Button size="sm" className="shadow-lg text-sm px-3">
                Book Now
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'md:hidden transition-all duration-300 ease-in-out',
            isMenuOpen
              ? 'max-h-96 opacity-100'
              : 'max-h-0 opacity-0 overflow-hidden'
          )}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t">
              <div className="flex items-center space-x-2 px-3">
                <Link href="/costumes" className="flex-1">
                  <Button variant="ghost" size="icon" className="w-full hover:bg-accent">
                    <Search className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" className="flex-1 relative hover:bg-accent">
                  <ShoppingCart className="h-4 w-4" />
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    0
                  </Badge>
                </Button>
              </div>
              <div className="px-3 pt-2 space-y-2">
                <Link href="/admin" className="block">
                  <Button variant="outline" className="w-full" size="sm">Admin Panel</Button>
                </Link>
                <Link href="/booking" className="block">
                  <Button className="w-full" size="lg">Book Now</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
