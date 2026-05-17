'use client';

import { motion } from 'motion/react';
import { 
  Users, 
  MessageSquare, 
  Clock, 
  CheckCircle2,
  Phone,
  Mail,
  ArrowRight,
  Loader2,
  Filter,
  CheckCircle,
  XCircle,
  RefreshCcw,
  Calculator
} from 'lucide-react';
import { 
  useGetMyLeadsQuery, 
  useUpdateLeadStatusMutation,
  useDeleteLeadMutation 
} from '@/lib/store/features/leads/leadsApi';
import { useState } from 'react';
import Swal from 'sweetalert2';

export default function LeadsPage() {
  const { data, isLoading } = useGetMyLeadsQuery();
  const [updateStatus] = useUpdateLeadStatusMutation();
  const [deleteLead] = useDeleteLeadMutation();
  const [activeTab, setActiveTab] = useState<'active' | 'archive'>('active');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  // Filter States
  const [filters, setFilters] = useState({
    status: 'ALL',
    region: 'ALL',
    country: 'ALL',
    budget: 'ALL',
    agent: 'ALL',
    date: 'ALL',
  });

  const allLeads = data?.data?.leads || [];
  
  // Calculate KPIs
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const kpis = {
    newThisWeek: allLeads.filter(l => new Date(l.createdAt) >= oneWeekAgo).length,
    inProgress: allLeads.filter(l => !['ARCHIVED', 'CLOSED_WON', 'CLOSED_LOST'].includes(l.status)).length,
    viewings: allLeads.filter(l => l.status === 'VIEWING_SCHEDULED').length,
    conversionRate: allLeads.length > 0 
      ? ((allLeads.filter(l => l.status === 'CLOSED_WON').length / allLeads.length) * 100).toFixed(1)
      : '0'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'CONTACTED': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'QUALIFIED': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'VIEWING_SCHEDULED': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'OFFER_SUBMITTED': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'CLOSED_WON': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'CLOSED_LOST': return 'bg-stone-100 text-stone-500 border-stone-200';
      case 'ARCHIVED': return 'bg-stone-50 text-stone-400 border-stone-100';
      default: return 'bg-stone-50 text-stone-500 border-stone-100';
    }
  };

  // Filter Logic
  const filteredLeads = allLeads.filter((lead: any) => {
    // Tab filter
    const isArchive = ['ARCHIVED', 'CLOSED_WON', 'CLOSED_LOST'].includes(lead.status);
    if (activeTab === 'active' && isArchive) return false;
    if (activeTab === 'archive' && !isArchive) return false;

    // Filter bar
    if (filters.status !== 'ALL' && lead.status !== filters.status) return false;
    if (filters.region !== 'ALL' && lead.property.region !== filters.region) return false;
    if (filters.country !== 'ALL' && lead.property.country?.name !== filters.country) return false;
    
    // Budget filter logic
    if (filters.budget !== 'ALL') {
      const budget = (lead.budget || '').toLowerCase();
      if (filters.budget === '300' && !budget.includes('300')) return false;
      if (filters.budget === '450' && !budget.includes('450')) return false;
      if (filters.budget === '600' && !budget.includes('600')) return false;
    }

    // Agent filter (Me logic)
    // Note: Since getMyLeads already filters by the current agent, 
    // this filter is mostly for future multi-agent views.
    // if (filters.agent === 'me' && lead.agentId !== currentUserId) return false;

    // Date filter
    const leadDate = new Date(lead.createdAt);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if ((filters as any).date === 'today') {
      if (leadDate < today) return false;
    } else if ((filters as any).date === 'week') {
      if (leadDate < oneWeekAgo) return false;
    } else if ((filters as any).date === 'month') {
      const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      if (leadDate < oneMonthAgo) return false;
    }

    return true;
  });

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      Swal.fire({
        title: 'Pipeline Updated',
        text: `Lead moved to ${newStatus.replace('_', ' ')}`,
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    } catch (error) {
      Swal.fire('Error', 'Failed to update pipeline stage', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="size-8 text-[#34495E] animate-spin" />
        <p className="text-stone-400 font-bold text-xs uppercase tracking-widest">Loading pipeline...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* KPI Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'New This Week', value: kpis.newThisWeek, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
           { label: 'In Progress', value: kpis.inProgress, icon: RefreshCcw, color: 'text-amber-600', bg: 'bg-amber-50' },
           { label: 'Viewings', value: kpis.viewings, icon: Clock, color: 'text-indigo-600', bg: 'bg-indigo-50' },
           { label: 'Conversion', value: `${kpis.conversionRate}%`, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
         ].map((kpi, i) => (
           <motion.div 
             key={kpi.label}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             className="bg-white p-6 rounded-[32px] border border-stone-100 shadow-sm"
           >
              <div className="flex items-center gap-4">
                 <div className={`size-12 ${kpi.bg} ${kpi.color} rounded-2xl flex items-center justify-center`}>
                    <kpi.icon className="size-6" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{kpi.label}</p>
                    <h4 className="text-2xl font-black text-[#2C3E50]">{kpi.value}</h4>
                 </div>
              </div>
           </motion.div>
         ))}
      </section>

      {/* Filter & Header */}
      <header className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-black text-[#2C3E50]">Buyer Pipeline</h2>
            <p className="text-stone-400 font-bold text-xs uppercase tracking-widest">Track and convert your leads</p>
          </div>
          
          <div className="flex bg-stone-100 p-1.5 rounded-2xl gap-2">
              <button 
                onClick={() => setActiveTab('active')}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === 'active' ? 'bg-white text-[#2C3E50] shadow-sm' : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                Active Pipeline
              </button>
              <button 
                onClick={() => setActiveTab('archive')}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === 'archive' ? 'bg-white text-[#2C3E50] shadow-sm' : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                Archived/Closed
              </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-[24px] border border-stone-100 flex flex-wrap items-center gap-4">
           <div className="flex items-center gap-2 px-4 py-2 bg-stone-50 rounded-xl border border-stone-100">
              <Filter className="size-3 text-stone-400" />
              <select 
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer text-stone-600"
              >
                <option value="ALL">All Statuses</option>
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="QUALIFIED">Qualified</option>
                <option value="VIEWING_SCHEDULED">Viewing Scheduled</option>
                <option value="OFFER_SUBMITTED">Offer Submitted</option>
              </select>
           </div>

           <div className="flex items-center gap-2 px-4 py-2 bg-stone-50 rounded-xl border border-stone-100">
              <Filter className="size-3 text-stone-400" />
              <select 
                value={filters.region}
                onChange={(e) => setFilters({...filters, region: e.target.value})}
                className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer text-stone-600"
              >
                <option value="ALL">All Regions</option>
                {Array.from(new Set(allLeads.map((l: any) => l.property.region).filter(Boolean))).map((r: any) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
           </div>

           <div className="flex items-center gap-2 px-4 py-2 bg-stone-50 rounded-xl border border-stone-100">
              <Filter className="size-3 text-stone-400" />
              <select 
                value={filters.country}
                onChange={(e) => setFilters({...filters, country: e.target.value})}
                className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer text-stone-600"
              >
                <option value="ALL">All Countries</option>
                {Array.from(new Set(allLeads.map((l: any) => l.property.country?.name).filter(Boolean))).map((c: any) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
           </div>

           <div className="flex items-center gap-2 px-4 py-2 bg-stone-50 rounded-xl border border-stone-100">
              <Filter className="size-3 text-stone-400" />
              <select 
                value={filters.budget}
                onChange={(e) => setFilters({...filters, budget: e.target.value})}
                className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer text-stone-600"
              >
                <option value="ALL">All Budgets</option>
                <option value="300">Under €300k</option>
                <option value="450">€300k - €450k</option>
                <option value="600">€450k - €600k</option>
                <option value="over">Over €600k</option>
              </select>
           </div>

           <div className="flex items-center gap-2 px-4 py-2 bg-stone-50 rounded-xl border border-stone-100">
              <Users className="size-3 text-stone-400" />
              <select 
                value={filters.agent}
                onChange={(e) => setFilters({...filters, agent: e.target.value})}
                className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer text-stone-600"
              >
                <option value="ALL">All Agents</option>
                <option value="me">Me (Current Agent)</option>
              </select>
           </div>

           <div className="flex items-center gap-2 px-4 py-2 bg-stone-50 rounded-xl border border-stone-100">
              <Clock className="size-3 text-stone-400" />
              <select 
                value={filters.date}
                onChange={(e) => setFilters({...filters, date: e.target.value})}
                className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer text-stone-600"
              >
                <option value="ALL">Any Date</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
           </div>
        </div>
      </header>

      {/* Leads List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredLeads.length === 0 ? (
          <div className="bg-white p-16 rounded-[40px] border border-dashed border-stone-200 flex flex-col items-center justify-center text-center space-y-4">
            <div className="size-20 bg-stone-50 rounded-full flex items-center justify-center text-stone-200">
              <Users className="size-10" />
            </div>
            <h3 className="text-lg font-black text-[#2C3E50]">No leads found matching your criteria</h3>
          </div>
        ) : (
          filteredLeads.map((lead: any, i: number) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-8 rounded-[40px] shadow-sm border border-stone-100 hover:shadow-xl hover:shadow-stone-200/20 transition-all group relative overflow-hidden"
            >
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10">
                {/* User & Property Info */}
                <div className="flex items-start gap-6">
                  <div className="size-20 bg-[#34495E]/5 rounded-3xl flex items-center justify-center text-[#34495E] font-black text-2xl border border-stone-100 overflow-hidden shrink-0">
                      {lead.user.avatarUrl ? (
                        <img src={lead.user.avatarUrl} alt={lead.user.firstName} className="w-full h-full object-cover" />
                      ) : (
                        lead.user.firstName.charAt(0)
                      )}
                  </div>
                  <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-black text-[#2C3E50]">{lead.user.firstName} {lead.user.lastName}</h3>
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${getStatusColor(lead.status)}`}>
                          {lead.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Interested in:</span>
                          <span className="text-[10px] font-black text-[#34495E] uppercase truncate max-w-[300px]">{lead.property.title}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2">
                           <div className="flex items-center gap-2 text-stone-500">
                              <Mail className="size-3.5" />
                              <span className="text-xs font-medium">{lead.user.email}</span>
                           </div>
                           <div className="flex items-center gap-2 text-stone-500">
                              <Phone className="size-3.5" />
                              <span className="text-xs font-medium">{lead.user.phone || '+31 6 12345678'}</span>
                           </div>
                        </div>
                      </div>
                  </div>
                </div>

                {/* Lead Details */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 px-8 xl:border-l xl:border-r border-stone-100">
                   <div>
                      <p className="text-[9px] font-black text-stone-300 uppercase tracking-widest mb-1">Budget</p>
                      <p className="text-sm font-black text-[#2C3E50]">{lead.budget || '€300k - €450k'}</p>
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-stone-300 uppercase tracking-widest mb-1">Financing</p>
                      <p className="text-sm font-black text-[#2C3E50]">{lead.financing || 'Cash Buyer'}</p>
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-stone-300 uppercase tracking-widest mb-1">Received</p>
                      <p className="text-sm font-black text-stone-500">
                        {new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                   </div>
                </div>

                {/* Pipeline Actions */}
                <div className="flex flex-wrap items-center gap-3 min-w-[200px]">
                   <div className="w-full flex gap-2">
                      <select 
                        disabled={updatingId === lead.id}
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className="flex-1 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer hover:bg-white transition-all"
                      >
                         <option value="NEW">New Lead</option>
                         <option value="CONTACTED">Contacted</option>
                         <option value="QUALIFIED">Qualified</option>
                         <option value="VIEWING_SCHEDULED">Viewing Scheduled</option>
                         <option value="OFFER_SUBMITTED">Offer Submitted</option>
                         <option value="CLOSED_WON">Closed Won</option>
                         <option value="CLOSED_LOST">Closed Lost</option>
                         <option value="ARCHIVED">Archive</option>
                      </select>
                      <button className="p-3 bg-stone-50 text-[#34495E] rounded-xl hover:bg-[#34495E] hover:text-white transition-all">
                         <MessageSquare className="size-4" />
                      </button>
                   </div>
                   
                    <div className="w-full grid grid-cols-2 gap-2">
                       <button 
                         onClick={() => handleStatusChange(lead.id, 'CLOSED_WON')}
                         className="px-4 py-2.5 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-700 transition-all"
                       >
                         Convert to Client
                       </button>
                       <button 
                         onClick={() => Swal.fire('Assign Agent', 'Agent assignment feature coming soon.', 'info')}
                         className="px-4 py-2.5 bg-stone-100 text-[#2C3E50] text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-stone-200 transition-all"
                       >
                         Assign Agent
                       </button>
                    </div>
                    
                    <div className="w-full grid grid-cols-2 gap-2">
                       <button 
                         onClick={() => Swal.fire('Schedule Call', 'Calendar integration coming soon.', 'info')}
                         className="px-4 py-2.5 bg-[#34495E] text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:opacity-90 transition-all"
                       >
                         Schedule Call
                       </button>
                        <button 
                          onClick={() => Swal.fire('Lead Details', `Inquiry Message: ${lead.message || 'No message provided.'}`, 'info')}
                          className="px-4 py-2.5 bg-stone-100 text-[#2C3E50] text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-stone-200 transition-all"
                        >
                          View Details
                        </button>
                     </div>

                     {lead.calculation && (
                       <div className="w-full">
                         <button 
                            onClick={() => {
                              const results = lead.calculation.resultsData as any;
                              const inputs = lead.calculation.inputData as any;
                              const isAdvanced = !!inputs.purchasePrice;
                              const price = isAdvanced ? (inputs.purchasePrice || 0) : (inputs.price || 0);
                              const yieldVal = isAdvanced ? (results.grossYield || 0) : (results.yield || 0);
                              const annualProfit = isAdvanced ? (results.profitAfterMortgage || 0) : (results.annualProfit || 0);
                              const rent = isAdvanced ? (results.annualRent / 12 || inputs.estimatedRent || 0) : (inputs.rent || 0);
                              const cashInvested = isAdvanced ? (results.cashInvested || 0) : (results.cashInvested || results.totalCapitalNeeded || 0);

                              Swal.fire({
                                title: `<span style="color: #D4AF37">${lead.calculation.name}</span>`,
                                width: '600px',
                                html: `
                                  <div style="text-align: left; font-family: Montserrat; padding: 20px;">
                                    <div style="display: grid; grid-template-cols: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                                      <div style="background: #f8f9fa; padding: 15px; border-radius: 12px; border: 1px solid #eee;">
                                        <p style="font-size: 9px; color: #999; margin: 0; font-weight: 800; letter-spacing: 1px;">PURCHASE PRICE</p>
                                        <p style="font-weight: 900; font-size: 18px; margin: 5px 0; color: #2C3E50;">€${Math.round(price).toLocaleString()}</p>
                                      </div>
                                      <div style="background: #f8f9fa; padding: 15px; border-radius: 12px; border: 1px solid #eee;">
                                        <p style="font-size: 9px; color: #999; margin: 0; font-weight: 800; letter-spacing: 1px;">GROSS YIELD</p>
                                        <p style="font-weight: 900; font-size: 18px; margin: 5px 0; color: #D4A373;">${Number(yieldVal).toFixed(2)}%</p>
                                      </div>
                                      <div style="background: #f8f9fa; padding: 15px; border-radius: 12px; border: 1px solid #eee;">
                                        <p style="font-size: 9px; color: #999; margin: 0; font-weight: 800; letter-spacing: 1px;">MONTHLY RENT</p>
                                        <p style="font-weight: 900; font-size: 18px; margin: 5px 0; color: #2C3E50;">€${Math.round(rent).toLocaleString()}</p>
                                      </div>
                                      <div style="background: #f8f9fa; padding: 15px; border-radius: 12px; border: 1px solid #eee;">
                                        <p style="font-size: 9px; color: #999; margin: 0; font-weight: 800; letter-spacing: 1px;">CASH INVESTED</p>
                                        <p style="font-weight: 900; font-size: 18px; margin: 5px 0; color: #2C3E50;">€${Math.round(cashInvested).toLocaleString()}</p>
                                      </div>
                                    </div>
                                    <div style="background: #2C3E50; color: white; padding: 25px; border-radius: 20px;">
                                      <p style="font-size: 9px; color: rgba(255,255,255,0.5); margin: 0; font-weight: 800; letter-spacing: 2px;">ESTIMATED NET ANNUAL PROFIT</p>
                                      <p style="font-size: 32px; font-weight: 900; margin: 5px 0; color: #D4A373;">€${Math.round(annualProfit).toLocaleString()}</p>
                                    </div>
                                    ${isAdvanced ? `<div style="margin-top: 15px; padding: 10px; background: #fcf8f3; border-radius: 8px; font-size: 11px;"><b>Advanced Analysis Attached:</b> ${inputs.country} / ${inputs.region}</div>` : ''}
                                  </div>
                                `,
                                confirmButtonColor: '#2C3E50',
                                confirmButtonText: 'CLOSE ANALYSIS',
                                customClass: { popup: 'rounded-[32px]' }
                              });
                            }}
                           className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#D4A373]/10 text-[#D4A373] text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-[#D4A373] hover:text-white transition-all"
                         >
                           <Calculator className="size-3.5" />
                           View Client Calculation
                         </button>
                       </div>
                     )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
