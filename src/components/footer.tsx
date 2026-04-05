'use client';

import Link from 'next/link';
import { Logo } from './logo';
import { Mail, MapPin, Phone, ArrowRight } from 'lucide-react';
import { FaXTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa6';

const links = [
  {
    group: 'Investment Hub',
    items: [
      { title: 'Market Selection', href: '/#market-selection' },
      { title: 'Global Insights', href: '/insights' },
      { title: 'Pricing & Plans', href: '/pricing' },
      { title: 'Verified Listings', href: '/properties' },
    ],
  },
  {
    group: 'Region Portals',
    items: [
      { title: 'Portugal Portfolio', href: '/countries/portugal' },
      { title: 'Spain Analysis', href: '#' },
      { title: 'Greece Yields', href: '#' },
      { title: 'Italy Growth', href: '#' },
    ],
  },
  {
    group: 'Organization',
    items: [
      { title: 'About InvesTerra', href: '/about' },
      { title: 'Partner Program', href: '/partners' },
      { title: 'Terms of Service', href: '/terms' },
      { title: 'Privacy Policy', href: '/privacy' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-24 pb-12 font-outfit">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-10">
            <Link href="/" className="block size-fit">
              <Logo />
            </Link>
            <p className="text-slate-500 max-w-sm text-lg leading-relaxed">
              Empowering global real estate investors with high-fidelity data, legal transparency, and verified yield-focused assets.
            </p>
            <div className="flex items-center gap-5">
              <Link href="#" className="size-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">
                <FaXTwitter className="size-5" />
              </Link>
              <Link href="#" className="size-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">
                <FaLinkedinIn className="size-5" />
              </Link>
              <Link href="#" className="size-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">
                <FaInstagram className="size-5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-12">
            {links.map((link) => (
              <div key={link.group} className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-4">
                  {link.group}
                </h3>
                <ul className="space-y-4">
                  {link.items.map((item) => (
                    <li key={item.title}>
                      <Link
                        href={item.href}
                        className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors inline-flex items-center group/link"
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
        <div className="mt-24 pt-8 grid md:grid-cols-2 items-center justify-between gap-8 border-t border-slate-200">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-xs font-bold text-slate-400">
            <span>© {new Date().getFullYear()} InvesTerra. All rights reserved.</span>
            <span className="flex items-center gap-2">
              <MapPin className="size-4 text-blue-600" />
              Global Headquarters: London, UK
            </span>
            <span className="flex items-center gap-2">
              <Mail className="size-4 text-blue-600" />
              contact@investerra.com
            </span>
          </div>
          <div className="md:text-right">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  Official Technology Partner <span className="text-blue-600">Antigravity Analytics</span>
              </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
