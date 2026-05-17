'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  Building2, 
  Wallet, 
  Activity,
  Users,
  Eye,
  MessageSquare,
  Plus,
  Calculator,
  Search,
  Bell,
  ArrowRight,
  History,
  LayoutDashboard,
  Star,
  Settings,
  ChevronRight
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { useGetSavedPropertiesQuery } from '@/lib/store/features/property/propertyApi';
import { useGetMyCalculationsQuery } from '@/lib/store/features/calculations/calculationApi';
import { useGetDashboardStatsQuery } from '@/lib/store/features/dashboard/dashboardApi';
import Link from 'next/link';

const GOLD_COLOR = '#D4AF37'; // Premium Gold
const GOLD_GRADIENT = 'linear-gradient(135deg, #D4AF37 0%, #F1C40F 100%)';

const investorStats = [
  { name: 'Portfolio Value', value: '€425,000', change: '+12.5%', icon: Wallet, color: 'bg-blue-500' },
  { name: 'Active Properties', value: '12', change: '+2', icon: Building2, color: 'bg-purple-500' },
  { name: 'Avg. Yield', value: '6.4%', change: '+0.4%', icon: TrendingUp, color: 'bg-emerald-500' },
];

const agentStats = [
  { name: 'Total Listings', value: '24', change: '+3', icon: Building2, color: 'bg-blue-500' },
  { name: 'Total Leads', value: '156', change: '+12%', icon: Users, color: 'bg-purple-500' },
  { name: 'Active Inquiries', value: '18', change: '+4', icon: MessageSquare, color: 'bg-emerald-500' },
];

export default function DashboardHome() {
  const { user } = useSelector((state: RootState) => state.auth);
  const isAgent = user?.role?.name?.toLowerCase() === 'agent' || user?.role?.name?.toLowerCase() === 'admin';
  
  // Fetch real dashboard data
  const { data: dashboardResponse, isLoading: isDashboardLoading } = useGetDashboardStatsQuery();
  const dashboardData = dashboardResponse?.data;

  const [graphView, setGraphView] = useState<'month' | 'year'>('year');

  const stats = (dashboardData?.stats || (isAgent ? agentStats : investorStats)).map((s: any) => {
    let icon = Wallet;
    if (s.name.includes('Properties') || s.name.includes('Listings')) icon = Building2;
    if (s.name.includes('Yield')) icon = TrendingUp;
    if (s.name.includes('Leads')) icon = Users;
    if (s.name.includes('Inquiries')) icon = MessageSquare;
    return { ...s, icon };
  });

  const rawAnalytics = dashboardData?.analytics || (isAgent 
    ? [40, 70, 45, 90, 65, 80, 50, 95, 75, 100, 85, 110] 
    : [60, 85, 110, 95, 80, 70, 60, 50, 40, 30, 20, 10]);
  const analyticsData = graphView === 'month' ? rawAnalytics.slice(-4) : rawAnalytics;

  return (
    <div className="space-y-16 pb-12">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-1">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl font-black text-[#2C3E50] tracking-tighter"
          >
            Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F1C40F] to-[#D4AF37] bg-[length:200%_auto] animate-gradient-x">{user?.firstName || 'Admin'}</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-stone-400 font-bold text-sm flex items-center gap-2"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Real-time portfolio intelligence active
          </motion.p>
        </div>
        
      </header>

      {/* Premium Quick Actions */}
      {!isAgent && (
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: 'New Calculation', icon: Calculator, href: '/dashboard/calculator', desc: 'ROI Analysis' },
            { name: 'Add Property', icon: Plus, href: '/dashboard/properties/add', desc: 'Portfolio Entry' },
            { name: 'Compare', icon: Activity, href: '/dashboard/calculator', desc: 'Market Bench' },
            { name: 'Create Alert', icon: Bell, href: '/dashboard/alerts', desc: 'Deal Scanner' },
          ].map((action, i) => (
            <Link key={action.name} href={action.href}>
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ y: -12, scale: 1.02 }}
                className="group relative bg-white p-8 rounded-[48px] border border-stone-100 shadow-xl shadow-stone-200/20 hover:shadow-2xl hover:shadow-[#D4AF37]/20 transition-all cursor-pointer overflow-hidden"
              >
                <div className="absolute top-0 right-0 size-32 bg-gradient-to-bl from-[#D4AF37]/10 to-transparent rounded-bl-[80px] transition-all duration-500 group-hover:scale-150" />
                
                <div className="size-16 rounded-[24px] flex items-center justify-center mb-8 transition-all duration-500 group-hover:rotate-[10deg] shadow-2xl shadow-[#D4AF37]/10 bg-white border border-[#D4AF37]/20 relative z-10">
                  <action.icon className="size-8" style={{ color: GOLD_COLOR }} />
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-lg font-black text-[#2C3E50] mb-1 group-hover:text-[#D4AF37] transition-colors">{action.name}</h3>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">{action.desc}</p>
                </div>
                
                <div className="mt-8 flex items-center gap-3 text-[10px] font-black text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-all translate-x-[-20px] group-hover:translate-x-0 relative z-10">
                  LAUNCH TOOL <ArrowRight className="size-4" />
                </div>
              </motion.div>
            </Link>
          ))}
        </section>
      )}

      {/* Premium Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {stats.map((stat: any, i: number) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1, type: "spring" }}
            className="bg-white p-10 rounded-[56px] shadow-xl shadow-stone-200/30 border border-stone-50 group hover:border-[#D4AF37]/20 hover:shadow-2xl hover:shadow-[#D4AF37]/5 transition-all cursor-pointer overflow-hidden relative"
          >
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div 
                className="size-20 rounded-[28px] flex items-center justify-center text-white shadow-2xl relative overflow-hidden group-hover:scale-110 transition-all duration-700"
                style={{ background: GOLD_GRADIENT }}
              >
                <stat.icon className="size-10 relative z-10 drop-shadow-lg" />
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </div>
              <div className="flex items-center gap-2 text-emerald-600 font-black text-xs bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100 shadow-sm">
                <ArrowUpRight className="size-4" />
                {stat.change}
              </div>
            </div>
            
            <p className="text-stone-300 font-black text-[11px] uppercase tracking-[0.3em] mb-2 relative z-10 group-hover:text-[#D4AF37] transition-colors">{stat.name}</p>
            <h3 className="text-4xl font-black text-[#2C3E50] tracking-tighter relative z-10">{stat.value}</h3>
            
            {/* Artistic Background Accent */}
            <div className="absolute -right-12 -bottom-12 size-56 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-125 group-hover:-rotate-12 transition-all duration-1000" style={{ color: GOLD_COLOR }}>
              <stat.icon className="size-full" />
            </div>
          </motion.div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Graph Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-6 bg-white p-8 rounded-[48px] shadow-sm border border-stone-100 relative overflow-hidden h-full flex flex-col"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 relative z-10">
            <div>
              <h3 className="text-lg font-black text-[#2C3E50]">Analytics</h3>
              <p className="text-stone-400 font-bold text-[10px] mt-0.5">Growth Tracking</p>
            </div>
            <div className="flex gap-2 bg-stone-50 p-1 rounded-xl border border-stone-100">
              <button 
                onClick={() => setGraphView('month')}
                className={`px-4 py-2 font-black rounded-lg text-[9px] uppercase tracking-widest transition-all ${
                  graphView === 'month' ? 'text-white shadow-lg' : 'text-stone-400'
                }`}
                style={graphView === 'month' ? { background: GOLD_GRADIENT } : {}}
              >
                M
              </button>
              <button 
                onClick={() => setGraphView('year')}
                className={`px-4 py-2 font-black rounded-lg text-[9px] uppercase tracking-widest transition-all ${
                  graphView === 'year' ? 'text-white shadow-lg' : 'text-stone-400'
                }`}
                style={graphView === 'year' ? { background: GOLD_GRADIENT } : {}}
              >
                Y
              </button>
            </div>
          </div>

          {/* Real Graph with Labels */}
          <div className="flex-1 w-full relative flex items-end justify-between gap-1.5 px-2 z-10 border-b border-stone-50 pb-6 mb-4">
            {analyticsData.map((height: number, iValue: number) => {
              let label = '';
              if (graphView === 'year') {
                const monthDate = new Date();
                monthDate.setMonth(monthDate.getMonth() - (11 - iValue));
                label = monthDate.toLocaleString('default', { month: 'short' });
              } else {
                label = `W${iValue + 1}`;
              }
              
              const shouldShowLabel = graphView === 'year' ? (iValue % 3 === 0 || iValue === 11) : true;

              return (
                <div key={`${graphView}-${iValue}`} className="flex-1 h-full flex flex-col items-center justify-end group relative">
                  {/* Tooltip */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#2C3E50] text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap">
                    {graphView === 'year' ? label : `Week ${iValue + 1}`}: {height.toFixed(1)}%
                  </div>
                  
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: `${height}%`, opacity: 1 }}
                    transition={{ delay: iValue * 0.05 }}
                    className="w-full rounded-t-lg relative overflow-hidden group-hover:brightness-110 transition-all cursor-crosshair"
                    style={{ background: GOLD_GRADIENT }}
                  />
                  {shouldShowLabel && (
                    <span className="text-[7px] font-black text-stone-400 mt-2 absolute -bottom-5 uppercase tracking-tighter">
                      {label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Workspace Section */}
        {!isAgent && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="lg:col-span-3 bg-white p-8 rounded-[48px] shadow-sm border border-stone-100 flex flex-col h-full"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="size-10 bg-stone-50 rounded-xl flex items-center justify-center text-[#2C3E50] border border-stone-100">
                <LayoutDashboard className="size-5" />
              </div>
              <h3 className="text-lg font-black text-[#2C3E50]">Workspace</h3>
            </div>
            
            <div className="space-y-4 flex-1">
              {/* Recent Saved Properties */}
              <div className="space-y-2">
                <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest px-1">Quick Resume: Properties</p>
                {dashboardData?.workspace?.properties?.map((prop: any) => (
                  <Link key={prop.id} href={`/properties/${prop.id}`}>
                    <div className="p-3 rounded-2xl bg-stone-50/50 border border-stone-100 hover:bg-white hover:shadow-md transition-all group">
                      <p className="text-[10px] font-black text-[#2C3E50] truncate">{prop.title}</p>
                      <p className="text-[8px] font-bold text-stone-400 uppercase">{prop.location}</p>
                    </div>
                  </Link>
                ))}
                {(!dashboardData?.workspace?.properties || dashboardData.workspace.properties.length === 0) && (
                  <p className="text-[10px] font-bold text-stone-300 italic px-1">No properties saved</p>
                )}
              </div>

              {/* Recent Calculations */}
              <div className="space-y-2">
                <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest px-1">Quick Resume: ROI</p>
                {dashboardData?.workspace?.calculations?.map((calc: any) => (
                  <Link key={calc.id} href="/dashboard/calculator">
                    <div className="p-3 rounded-2xl bg-stone-50/50 border border-stone-100 hover:bg-white hover:shadow-md transition-all group">
                      <p className="text-[10px] font-black text-[#2C3E50] truncate">{calc.name}</p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-[8px] font-bold text-[#D4AF37] uppercase">{calc.resultsData.yield}% Yield</p>
                        <p className="text-[8px] font-bold text-stone-400">{new Date(calc.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </Link>
                ))}
                {(!dashboardData?.workspace?.calculations || dashboardData.workspace.calculations.length === 0) && (
                  <p className="text-[10px] font-bold text-stone-300 italic px-1">No calculations saved</p>
                )}
              </div>
            </div>
            
            <Link href="/dashboard/properties" className="mt-6">
              <button className="w-full py-4 bg-[#2C3E50] text-white text-[9px] font-black uppercase tracking-widest rounded-2xl hover:opacity-95 transition-all">
                Control <ArrowRight className="size-3 inline ml-1" />
              </button>
            </Link>
          </motion.div>
        )}

        {/* Alerts Preview */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="lg:col-span-3 bg-white p-8 rounded-[48px] shadow-sm border border-stone-100 flex flex-col h-full"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100">
                <Bell className="size-5" />
              </div>
              <h3 className="text-lg font-black text-[#2C3E50]">Alerts</h3>
            </div>
            {!isAgent && (
              <Link href="/dashboard/alerts" className="text-[8px] font-black text-[#D4AF37] uppercase tracking-widest">Edit</Link>
            )}
          </div>
          
          <div className="space-y-3 flex-1">
             {dashboardData?.recentAlerts?.map((item: any, iValue: number) => (
               <Link key={iValue} href="/dashboard/alerts" className="block">
                 <div className="p-4 rounded-[24px] bg-white border border-stone-100 group cursor-pointer hover:border-[#D4AF37]/30 transition-all shadow-sm hover:shadow-xl hover:shadow-stone-200/20 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-1">
                       <p className="text-xs font-black text-[#2C3E50]">{item.name || 'Untitled Alert'}</p>
                       <Settings className="size-3 text-stone-300 group-hover:text-[#D4AF37] transition-colors" />
                    </div>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-[8px] font-bold text-stone-400 uppercase">
                      {item.criteria.location || 'Anywhere'} 
                      {item.criteria.maxPrice ? ` • < €${(item.criteria.maxPrice/1000).toFixed(0)}k` : ''}
                    </p>
                    <div className="flex items-center gap-1">
                       <div className={`size-1 rounded-full ${item.isActive ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                       <span className="text-[7px] font-black text-stone-300 uppercase">
                         {item.triggerCount > 0 ? `${item.triggerCount} Matches` : 'No matches'}
                       </span>
                    </div>
                  </div>
                </div>
               </Link>
             ))}
             {(!dashboardData?.recentAlerts || dashboardData.recentAlerts.length === 0) && (
               <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Bell className="size-8 text-stone-100 mb-2" />
                  <p className="text-[10px] font-bold text-stone-300 italic">No recent alerts</p>
               </div>
             )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
