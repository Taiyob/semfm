'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './logo';
import { 
  Menu, 
  X, 
  Globe, 
  ChevronDown, 
  Search,
  UserCircle2,
  TrendingUp,
  MapPin,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const navLinks = [
  { name: 'Markets', href: '/#market-selection', icon: Globe },
  { name: 'Calculator', href: '/calculator', icon: TrendingUp },
  { name: 'Properties', href: '/properties', icon: Search },
  { name: 'Pricing', href: '/pricing', icon: Tag },
  { name: 'Insights', href: '/insights', icon: MapPin },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/80 backdrop-blur-lg border-b border-stone-200 py-0.5 shadow-sm' : 'bg-transparent py-1'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-10">
          <div className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-4 py-2 text-sm font-bold transition-all rounded-xl flex items-center gap-2 ${
                  pathname === link.href 
                    ? 'text-[#34495E] bg-[#34495E]/5' 
                    : 'text-stone-600 hover:text-[#2C3E50] hover:bg-stone-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="h-6 w-px bg-slate-200" />

          <div className="flex items-center gap-4">
            <Link href="/login" className="px-4 py-2 text-sm font-bold text-stone-600 hover:text-[#2C3E50]">
                Sign In
            </Link>
            <Link href="/register" className="px-6 py-2.5 bg-[#34495E] text-white font-bold rounded-xl text-sm hover:bg-[#34495E] transition-all shadow-lg shadow-stone-950/10">
                Get Started
            </Link>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="px-6 py-8 space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 text-lg font-bold text-slate-600 hover:text-[#2C3E50]"
                >
                  <div className="size-10 bg-slate-50 rounded-xl flex items-center justify-center">
                    <link.icon className="size-5 text-[#2C3E50]" />
                  </div>
                  {link.name}
                </Link>
              ))}
              <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                <Link href="/login" onClick={() => setIsOpen(false)} className="w-full py-4 text-center font-bold text-slate-600 bg-slate-50 rounded-2xl">
                    Sign In
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)} className="w-full py-4 text-center font-bold text-white bg-[#34495E] rounded-2xl">
                    Register
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
