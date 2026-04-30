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
import { PlusCircle, MessageSquare, List } from 'lucide-react';

const investorMenuItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Properties', href: '/dashboard/properties', icon: Search },
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
      <div className="p-8">
        <Link href="/">
          <Logo />
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                isActive 
                  ? 'bg-[#34495E] text-white shadow-lg shadow-[#34495E]/20' 
                  : 'text-stone-500 hover:text-[#34495E] hover:bg-stone-50'
              }`}
            >
              <item.icon className={`size-5 ${isActive ? 'text-white' : 'text-stone-400'}`} />
              {item.name}
              {isActive && (
                <motion.div 
                  layoutId="active-pill"
                  className="ml-auto size-1.5 bg-white rounded-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 mt-auto">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all group"
        >
          <LogOut className="size-5 transition-transform group-hover:translate-x-1" />
          Logout
        </button>
      </div>
    </aside>
  );
}
