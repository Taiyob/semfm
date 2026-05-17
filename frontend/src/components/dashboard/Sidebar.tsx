'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  UserCircle2, 
  TrendingUp, 
  Search, 
  Settings, 
  LogOut,
  ChevronLeft,
  Briefcase
} from 'lucide-react';
import { motion } from 'motion/react';
import { Logo } from '../logo';
import { useLogoutMutation } from '@/lib/store/features/auth/authApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { PlusCircle, MessageSquare, List, Bell } from 'lucide-react';

const investorMenuItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Properties', href: '/dashboard/properties', icon: Search },
  { name: 'Alerts', href: '/dashboard/alerts', icon: Bell },
  { name: 'Investments', href: '/dashboard/investments', icon: Briefcase },
  { name: 'Calculator', href: '/dashboard/calculator', icon: TrendingUp },
  { name: 'Profile', href: '/dashboard/profile', icon: UserCircle2 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

const agentMenuItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Listings', href: '/dashboard/listings', icon: List },
  { name: 'Add Property', href: '/dashboard/listings/add', icon: PlusCircle },
  { name: 'Leads', href: '/dashboard/leads', icon: MessageSquare },
  { name: 'Profile', href: '/dashboard/profile', icon: UserCircle2 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [logout] = useLogoutMutation();
  const { user } = useSelector((state: RootState) => state.auth);

  const isAgent = user?.role?.name?.toLowerCase() === 'agent' || user?.role?.name?.toLowerCase() === 'admin';
  const menuItems = isAgent ? agentMenuItems : investorMenuItems;

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <aside className="w-72 bg-white border-r border-stone-100 flex flex-col h-screen sticky top-0 overflow-hidden">
      <div className="p-8 mb-4">
        <Link href="/" className="group block">
          <Logo />
          <div className="h-0.5 w-0 group-hover:w-full transition-all duration-500" style={{ backgroundColor: '#D4AF37' }} />
        </Link>
      </div>

      <nav className="flex-1 px-6 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 px-5 py-4 rounded-3xl text-sm font-black transition-all group ${
                isActive 
                  ? 'bg-[#2C3E50] text-white shadow-2xl shadow-[#2C3E50]/20 scale-[1.02]' 
                  : 'text-stone-400 hover:text-[#2C3E50] hover:bg-stone-50'
              }`}
            >
              <item.icon 
                className={`size-5 transition-all group-hover:scale-110 ${
                  isActive ? 'text-[#D4AF37]' : 'text-stone-300'
                }`} 
              />
              <span className="tracking-tight">{item.name}</span>
              {isActive && (
                <motion.div 
                  layoutId="active-indicator"
                  className="ml-auto size-2 rounded-full shadow-[0_0_10px_#D4AF37]"
                  style={{ backgroundColor: '#D4AF37' }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-8 mt-auto border-t border-stone-50">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-3xl text-sm font-black text-rose-500 hover:bg-rose-50 transition-all group"
        >
          <LogOut className="size-5 transition-transform group-hover:-translate-x-1" />
          Logout
        </button>
      </div>
    </aside>
  );
}
