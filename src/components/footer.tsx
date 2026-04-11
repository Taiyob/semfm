'use client';

import Link from 'next/link';
import { Logo } from './logo';
import { Mail, MapPin, Phone, ArrowRight } from 'lucide-react';
import { FaXTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa6';

const links = [
  {
    group: 'Investment Hub',
    items: [
      { title: 'Market Portals', href: '/#market-selection' },
      { title: 'Global Insights', href: '/insights' },
      { title: 'Pricing & Plans', href: '/pricing' },
      { title: 'Verified Listings', href: '/properties' },
    ],
  },
  {
    group: 'Region Portals',
    items: [
      { title: 'Portugal Analysis', href: '/countries/portugal' },
      { title: 'Spain (Beta)', href: '/countries/spain' },
      { title: 'Greece Yields', href: '/countries/greece' },
      { title: 'Italy Growth', href: '/countries/italy' },
    ],
  },
  {
    group: 'Hofman Horizon',
    items: [
      { title: 'Our Mission', href: '#' },
      { title: 'Partner Program', href: '#' },
      { title: 'Terms of Service', href: '#' },
      { title: 'Privacy Policy', href: '#' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-stone-50 border-t border-stone-200 pt-24 pb-12 font-outfit">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid gap-16 lg:grid-cols-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-10">
            <Link href="/" className="block size-fit">
              <Logo className="!items-start" />
            </Link>
            <p className="text-stone-500 max-w-sm text-lg leading-relaxed font-bold">
              Providing transparent real estate data for institutional and private investment decisions across the European horizon.
            </p>
            <div className="flex items-center gap-5">
              <Link href="#" className="size-11 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-400 hover:text-[#B55D3E] hover:border-[#B55D3E]/20 transition-all shadow-sm">
                <FaXTwitter className="size-5" />
              </Link>
              <Link href="#" className="size-11 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-400 hover:text-[#B55D3E] hover:border-[#B55D3E]/20 transition-all shadow-sm">
                <FaLinkedinIn className="size-5" />
              </Link>
              <Link href="#" className="size-11 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-400 hover:text-[#B55D3E] hover:border-[#B55D3E]/20 transition-all shadow-sm">
                <FaInstagram className="size-5" />
              </Link>
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-3 gap-12">
            {links.map((link) => (
              <div key={link.group} className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-900 border-b border-stone-200 pb-4">
                  {link.group}
                </h3>
                <ul className="space-y-4">
                  {link.items.map((item) => (
                    <li key={item.title}>
                      <Link
                        href={item.href}
                        className="text-sm font-bold text-stone-500 hover:text-[#B55D3E] transition-colors inline-flex items-center group/link"
                      >
                        {item.title}
                        <ArrowRight className="size-3 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all ml-1" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Global Market Contact */}
        <div className="mt-24 pt-8 grid md:grid-cols-2 items-center justify-between gap-8 border-t border-stone-200">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-[10px] font-black uppercase tracking-widest text-stone-400">
            <span>© {new Date().getFullYear()} Hofman Horizon. All rights reserved.</span>
            <span className="flex items-center gap-2">
              <MapPin className="size-4 text-[#B55D3E]" />
              Zurich, Switzerland
            </span>
            <span className="flex items-center gap-2">
              <Mail className="size-4 text-[#B55D3E]" />
              contact@hofmanhorizon.com
            </span>
          </div>
          <div className="md:text-right">
            <p className="text-[10px] font-black uppercase text-stone-300 tracking-[0.3em]">
              Transparency in <span className="text-[#B55D3E]">Data.</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

