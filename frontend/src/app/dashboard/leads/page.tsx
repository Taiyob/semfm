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
  RefreshCcw
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
  
  const allLeads = data?.data?.leads || [];
  
  // Filter leads based on tab
  const leads = allLeads.filter(lead => {
    if (activeTab === 'active') return lead.status === 'NEW' || lead.status === 'CONTACTED';
    return lead.status === 'CLOSED';
  });

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This lead will be permanently deleted from your records.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E74C3C',
      cancelButtonColor: '#34495E',
      confirmButtonText: 'Yes, delete it'
    });

    if (result.isConfirmed) {
      setUpdatingId(id);
      try {
        await deleteLead(id).unwrap();
        Swal.fire({
          title: 'Deleted!',
          text: 'Lead has been removed.',
          icon: 'success',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000
        });
      } catch (error) {
        Swal.fire('Error', 'Failed to delete lead', 'error');
      } finally {
        setUpdatingId(null);
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      Swal.fire({
        title: 'Status Updated',
        text: `Lead marked as ${newStatus}`,
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } catch (error) {
      Swal.fire('Error', 'Failed to update status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="size-8 text-[#34495E] animate-spin" />
        <p className="text-stone-400 font-bold text-xs uppercase tracking-widest">Loading leads...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-black text-[#2C3E50]">Buyer Leads & Inquiries</h2>
          <p className="text-stone-400 font-bold text-xs uppercase tracking-widest">Manage your potential investors</p>
        </div>
        
        <div className="flex bg-stone-100 p-1.5 rounded-2xl gap-2">
            <button 
              onClick={() => setActiveTab('active')}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'active' ? 'bg-white text-[#2C3E50] shadow-sm' : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              Active ({allLeads.filter(l => l.status !== 'CLOSED').length})
            </button>
            <button 
              onClick={() => setActiveTab('archive')}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'archive' ? 'bg-white text-[#2C3E50] shadow-sm' : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              Archive ({allLeads.filter(l => l.status === 'CLOSED').length})
            </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {leads.length === 0 ? (
          <div className="bg-white p-16 rounded-[32px] border border-dashed border-stone-200 flex flex-col items-center justify-center text-center space-y-4">
            <div className="size-20 bg-stone-50 rounded-full flex items-center justify-center text-stone-200">
              <Users className="size-10" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#2C3E50]">No {activeTab} leads found</h3>
              <p className="text-stone-400 text-sm font-medium max-w-xs mx-auto">
                {activeTab === 'active' 
                  ? "When potential buyers inquire about your properties, they will appear here." 
                  : "Closed or archived conversations will be stored here."}
              </p>
            </div>
          </div>
        ) : (
          leads.map((lead, i) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-6 rounded-[32px] shadow-sm border border-stone-100 hover:shadow-xl hover:shadow-stone-200/30 transition-all group relative overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                {/* User & Property Info */}
                <div className="flex items-center gap-6">
                  <div className="size-16 bg-stone-50 rounded-2xl flex items-center justify-center text-[#34495E] font-black text-xl border border-stone-100 overflow-hidden shrink-0">
                      {lead.user.avatarUrl ? (
                        <img src={lead.user.avatarUrl} alt={lead.user.firstName} className="w-full h-full object-cover" />
                      ) : (
                        lead.user.firstName.charAt(0)
                      )}
                  </div>
                  <div>
                      <h3 className="text-lg font-black text-[#2C3E50]">{lead.user.firstName} {lead.user.lastName}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Interested in:</span>
                        <span className="text-[10px] font-black text-[#34495E] uppercase truncate max-w-[200px]">{lead.property.title}</span>
                      </div>
                  </div>
                </div>

                {/* Status & Date */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-stone-50 rounded-xl text-stone-500">
                      <Clock className="size-4" />
                      <span className="text-[10px] font-black uppercase">
                        {new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                  </div>
                  
                  {/* Status Dropdown / Buttons */}
                  <div className="flex items-center gap-2 p-1 bg-stone-100/50 rounded-2xl border border-stone-100">
                    {lead.status !== 'CLOSED' ? (
                      <>
                        <button 
                          disabled={updatingId === lead.id}
                          onClick={() => handleStatusChange(lead.id, 'CONTACTED')}
                          className={`p-2 rounded-xl transition-all ${
                            lead.status === 'CONTACTED' 
                            ? 'bg-amber-100 text-amber-600 shadow-sm' 
                            : 'text-stone-400 hover:bg-white hover:text-amber-500'
                          }`}
                          title="Mark as Contacted"
                        >
                          <RefreshCcw className={`size-4 ${updatingId === lead.id ? 'animate-spin opacity-50' : ''}`} />
                        </button>
                        <button 
                          disabled={updatingId === lead.id}
                          onClick={() => handleStatusChange(lead.id, 'CLOSED')}
                          className="p-2 rounded-xl text-stone-400 hover:bg-white hover:text-emerald-500 transition-all"
                          title="Mark as Closed / Archive"
                        >
                          <CheckCircle className="size-4" />
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button 
                          disabled={updatingId === lead.id}
                          onClick={() => handleStatusChange(lead.id, 'NEW')}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-stone-400 hover:bg-white hover:text-[#34495E] transition-all"
                          title="Restore to Active"
                        >
                          <RefreshCcw className={`size-3.5 rotate-180 ${updatingId === lead.id ? 'animate-spin' : ''}`} />
                          <span className="text-[9px] font-black uppercase">Restore</span>
                        </button>
                        <button 
                          disabled={updatingId === lead.id}
                          onClick={() => handleDelete(lead.id)}
                          className="p-2 rounded-xl text-stone-400 hover:bg-white hover:text-rose-500 transition-all"
                          title="Permanently Delete"
                        >
                          <XCircle className="size-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase ${
                      lead.status === 'NEW' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                      lead.status === 'CONTACTED' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                      'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  }`}>
                      {lead.status}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 border-t lg:border-t-0 pt-4 lg:pt-0 border-stone-50">
                  <a href={`tel:${lead.user.email}`} className="p-4 bg-stone-50 text-[#34495E] rounded-2xl hover:bg-[#34495E] hover:text-white transition-all">
                      <Phone className="size-5" />
                  </a>
                  <a href={`mailto:${lead.user.email}`} className="p-4 bg-stone-50 text-[#34495E] rounded-2xl hover:bg-[#34495E] hover:text-white transition-all">
                      <Mail className="size-5" />
                  </a>
                  <button className="px-6 py-4 bg-[#34495E] text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-[1.02] transition-all">
                      Chat <ArrowRight className="size-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
