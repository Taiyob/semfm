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
                      <p className="text-[9px] font-black text-stone-300 uppercase tracking-widest mb-1">Last Updated</p>
                      <p className="text-sm font-black text-stone-500">
                        {new Date(lead.updatedAt || lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
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
                          onClick={() => {
                            const msg = lead.message || 'No message provided.';
                            const source = lead.calculation 
                              ? 'Calculator Inquiry' 
                              : (lead.message && lead.message.toLowerCase().includes('calculator'))
                                ? 'Calculator Inquiry (no analysis attached)'
                                : 'Direct Property Inquiry';
                            const date = new Date(lead.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                            Swal.fire({
                              title: `<div style="text-align:left;">
                                <span style="font-size:10px;font-weight:900;color:#D4A373;letter-spacing:2px;text-transform:uppercase;">Lead Details</span>
                                <br/><span style="font-size:18px;font-weight:900;color:#2C3E50;">${lead.user.firstName} ${lead.user.lastName}</span>
                                <br/><span style="font-size:11px;color:#a8a29e;font-weight:700;">${date}</span>
                              </div>`,
                              html: `
                                <div style="text-align:left;font-family:inherit;padding:10px 5px;space-y:12px;">
                                  <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:#f5f5f4;border-radius:10px;margin-bottom:8px;">
                                    <span style="font-size:11px;color:#78716c;font-weight:700;">Source</span>
                                    <span style="font-size:12px;color:#2C3E50;font-weight:900;">${source}</span>
                                  </div>
                                  <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:#f5f5f4;border-radius:10px;margin-bottom:8px;">
                                    <span style="font-size:11px;color:#78716c;font-weight:700;">Property</span>
                                    <span style="font-size:12px;color:#2C3E50;font-weight:900;max-width:200px;text-align:right;">${lead.property.title}</span>
                                  </div>
                                  <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:#f5f5f4;border-radius:10px;margin-bottom:8px;">
                                    <span style="font-size:11px;color:#78716c;font-weight:700;">Status</span>
                                    <span style="font-size:12px;color:#2C3E50;font-weight:900;">${lead.status.replace('_', ' ')}</span>
                                  </div>
                                  ${lead.budget ? `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:#f5f5f4;border-radius:10px;margin-bottom:8px;">
                                    <span style="font-size:11px;color:#78716c;font-weight:700;">Budget</span>
                                    <span style="font-size:12px;color:#2C3E50;font-weight:900;">${lead.budget}</span>
                                  </div>` : ''}
                                  ${lead.financing ? `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:#f5f5f4;border-radius:10px;margin-bottom:8px;">
                                    <span style="font-size:11px;color:#78716c;font-weight:700;">Financing</span>
                                    <span style="font-size:12px;color:#2C3E50;font-weight:900;">${lead.financing}</span>
                                  </div>` : ''}
                                  <div style="padding:12px;background:#fafaf9;border:1px solid #e7e5e4;border-radius:12px;margin-top:12px;">
                                    <p style="font-size:9px;font-weight:900;color:#a8a29e;letter-spacing:2px;text-transform:uppercase;margin:0 0 6px 0;">Message</p>
                                    <p style="font-size:12px;color:#44403c;font-weight:600;margin:0;line-height:1.6;">${msg}</p>
                                  </div>
                                  ${lead.calculation ? `<div style="padding:10px 12px;background:#D4A373/10;border:1px solid #D4A373;border-radius:12px;margin-top:10px;display:flex;align-items:center;gap:8px;">
                                    <span style="font-size:11px;color:#D4A373;font-weight:900;">📊 Calculation attached — click "View Client Calculation" below</span>
                                  </div>` : ''}
                                </div>
                              `,
                              confirmButtonColor: '#2C3E50',
                              confirmButtonText: 'CLOSE',
                              customClass: { popup: 'rounded-[32px]' }
                            });
                          }}
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
                               const netYield = isAdvanced ? (results.netYield || 0) : 0;
                               const annualProfit = isAdvanced ? (results.profitAfterMortgage || 0) : (results.annualProfit || 0);
                               const rent = isAdvanced ? (inputs.estimatedRent || (results.annualRent ? results.annualRent / 12 : 0)) : (inputs.rent || 0);
                               const cashInvested = isAdvanced ? (results.cashInvested || 0) : (results.cashInvested || results.totalCapitalNeeded || 0);
                               const totalCapitalNeeded = results.totalCapitalNeeded || 0;
                               const acquisitionCosts = results.acquisitionCosts || 0;
                               const cashOnCash = results.cashOnCash || results.cashOnCashReturn || 0;
                               const ltv = results.ltv || 0;
                               const totalOpex = results.totalOpex || 0;
                               const annualRent = results.annualRent || (rent * 12);
                               const netAnnualIncome = results.netAnnualIncome || 0;
                               const mortgageCosts = results.mortgageCosts || 0;
                               const yearlyInterest = results.yearlyInterest || 0;
                               const yearlyPrincipal = results.yearlyPrincipal || 0;
                               const currentROE = results.currentROE || 0;
                               const avgAnnualReturn = results.avgAnnualReturn || 0;
                               const totalHorizonProfit = results.totalHorizonProfit || 0;
                               const totalReturnMultiple = results.totalReturnMultiple || 0;
                               
                               const opex = results.opexBreakdown || {};
                               const acq = results.breakdown || {};
                               
                               const country = inputs.country || 'N/A';
                               const region = inputs.region || 'N/A';
                               const propertyType = inputs.propertyType || 'N/A';
                               const renovationCost = inputs.renovationCost || 0;
                               const downPayment = inputs.downPayment || 0;
                               const interestRate = inputs.interestRate || 0;
                               const mortgageTerm = inputs.mortgageTerm || 0;
                               const appreciationRate = inputs.appreciationRate || 0;
                               const rentGrowthRate = inputs.rentGrowthRate || 0;
                               const timeHorizon = inputs.timeHorizon || 20;
                               const isRental = inputs.isRental;

                               const fmt = (v: number) => `€${Math.round(v).toLocaleString()}`;
                               const pct = (v: number) => `${Number(v).toFixed(2)}%`;
                               
                               const makeRow = (label: string, value: string, highlight = false) => 
                                 `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;${highlight ? 'background:#f0fdf4;border-radius:8px;' : ''}">
                                    <span style="font-size:11px;color:#78716c;font-weight:700;">${label}</span>
                                    <span style="font-size:13px;color:${highlight ? '#059669' : '#2C3E50'};font-weight:900;">${value}</span>
                                  </div>`;
                               
                               const makeSection = (title: string, rows: string) =>
                                 `<div style="margin-bottom:20px;">
                                    <p style="font-size:9px;font-weight:900;color:#a8a29e;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px 0;padding-bottom:8px;border-bottom:1px solid #f5f5f4;">${title}</p>
                                    ${rows}
                                  </div>`;

                               Swal.fire({
                                 title: `<div style="text-align:left;">
                                   <span style="font-size:10px;font-weight:900;color:#D4A373;letter-spacing:2px;text-transform:uppercase;">Client Calculation</span>
                                   <br/><span style="font-size:18px;font-weight:900;color:#2C3E50;">${lead.calculation.name}</span>
                                   <br/><span style="font-size:11px;color:#a8a29e;font-weight:700;">${new Date(lead.calculation.createdAt).toLocaleDateString(undefined, { day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' })}</span>
                                 </div>`,
                                 width: '720px',
                                 html: `
                                   <div style="text-align:left;font-family:inherit;max-height:60vh;overflow-y:auto;padding:10px 5px;">
                                     
                                     ${makeSection('📍 Investment Parameters', `
                                       ${makeRow('Country', country)}
                                       ${makeRow('Region', region)}
                                       ${makeRow('Property Type', propertyType)}
                                       ${makeRow('Purpose', isRental === false ? 'Residential (Own Use)' : 'Rental Investment')}
                                       ${makeRow('Time Horizon', `${timeHorizon} years`)}
                                     `)}
                                     
                                     ${makeSection('💰 Purchase & Costs', `
                                       ${makeRow('Purchase Price', fmt(price))}
                                       ${Number(renovationCost) > 0 ? makeRow('Renovation Cost', fmt(Number(renovationCost))) : ''}
                                       ${makeRow('Acquisition Costs', fmt(acquisitionCosts))}
                                       ${makeRow('Total Capital Needed', fmt(totalCapitalNeeded), true)}
                                     `)}

                                     ${(acq.imt || acq.stampDuty || acq.legalFees || acq.notaryFees) ? makeSection('📋 Acquisition Breakdown', `
                                       ${acq.imt ? makeRow('IMT (Transfer Tax)', fmt(acq.imt)) : ''}
                                       ${acq.itp ? makeRow('ITP (Transfer Tax)', fmt(acq.itp)) : ''}
                                       ${acq.stampDuty ? makeRow('Stamp Duty', fmt(acq.stampDuty)) : ''}
                                       ${acq.legalFees ? makeRow('Legal Fees', fmt(acq.legalFees)) : ''}
                                       ${acq.notaryFees ? makeRow('Notary Fees', fmt(acq.notaryFees)) : ''}
                                       ${acq.iva ? makeRow('IVA (VAT)', fmt(acq.iva)) : ''}
                                       ${acq.ajd ? makeRow('AJD (Stamp Tax)', fmt(acq.ajd)) : ''}
                                     `) : ''}

                                     ${(Number(downPayment) > 0 || Number(interestRate) > 0) ? makeSection('🏦 Mortgage Details', `
                                       ${makeRow('Down Payment', fmt(Number(downPayment)))}
                                       ${makeRow('Interest Rate', pct(Number(interestRate)))}
                                       ${makeRow('Mortgage Term', `${mortgageTerm} years`)}
                                       ${makeRow('LTV', pct(ltv))}
                                       ${makeRow('Annual Interest', fmt(yearlyInterest))}
                                       ${makeRow('Annual Principal', fmt(yearlyPrincipal))}
                                       ${makeRow('Total Mortgage Cost/yr', fmt(mortgageCosts))}
                                     `) : ''}

                                     ${makeSection('🏠 Rental Income', `
                                       ${makeRow('Monthly Rent', fmt(rent))}
                                       ${makeRow('Annual Rent', fmt(annualRent))}
                                       ${makeRow('Total Operating Expenses', fmt(totalOpex))}
                                       ${makeRow('Net Annual Income (NOI)', fmt(netAnnualIncome), true)}
                                     `)}

                                     ${Object.keys(opex).length > 0 ? makeSection('📊 OpEx Breakdown', `
                                       ${opex.vacancy ? makeRow('Vacancy', fmt(opex.vacancy)) : ''}
                                       ${opex.maintenance ? makeRow('Maintenance', fmt(opex.maintenance)) : ''}
                                       ${opex.capex ? makeRow('CapEx Reserve', fmt(opex.capex)) : ''}
                                       ${opex.insurance ? makeRow('Insurance', fmt(opex.insurance)) : ''}
                                       ${opex.propertyTax ? makeRow('Property Tax (IMI)', fmt(opex.propertyTax)) : ''}
                                       ${opex.condo ? makeRow('Condo / HOA', fmt(opex.condo)) : ''}
                                       ${opex.management ? makeRow('Management Fee', fmt(opex.management)) : ''}
                                       ${opex.admin ? makeRow('Admin / Other', fmt(opex.admin)) : ''}
                                     `) : ''}

                                     <div style="background:#2C3E50;color:white;padding:20px;border-radius:20px;margin:15px 0;">
                                       <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                                         <div>
                                           <p style="font-size:9px;color:rgba(255,255,255,0.4);margin:0;font-weight:800;letter-spacing:1px;">CASH INVESTED</p>
                                           <p style="font-size:20px;font-weight:900;margin:4px 0;color:white;">${fmt(cashInvested)}</p>
                                         </div>
                                         <div>
                                           <p style="font-size:9px;color:rgba(255,255,255,0.4);margin:0;font-weight:800;letter-spacing:1px;">NET ANNUAL PROFIT</p>
                                           <p style="font-size:20px;font-weight:900;margin:4px 0;color:#D4A373;">${fmt(annualProfit)}</p>
                                         </div>
                                       </div>
                                     </div>

                                     ${makeSection('📈 Returns & Yields', `
                                       ${makeRow('Gross Yield', pct(yieldVal))}
                                       ${Number(netYield) > 0 ? makeRow('Net Yield', pct(netYield)) : ''}
                                       ${makeRow('Cash-on-Cash Return', pct(cashOnCash))}
                                       ${Number(currentROE) > 0 ? makeRow('Return on Equity (ROE)', pct(currentROE)) : ''}
                                       ${Number(appreciationRate) > 0 ? makeRow('Appreciation Rate', pct(Number(appreciationRate))) : ''}
                                       ${Number(rentGrowthRate) > 0 ? makeRow('Rent Growth Rate', pct(Number(rentGrowthRate))) : ''}
                                     `)}

                                     ${Number(totalHorizonProfit) > 0 ? makeSection(`🔮 ${timeHorizon}-Year Projection`, `
                                       ${makeRow('Total Horizon Profit', fmt(totalHorizonProfit), true)}
                                       ${makeRow('Avg. Annual Return', pct(avgAnnualReturn))}
                                       ${makeRow('Return Multiple', `${Number(totalReturnMultiple).toFixed(2)}x`)}
                                     `) : ''}
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
