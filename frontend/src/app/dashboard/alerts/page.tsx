'use client';

import { motion } from 'motion/react';
import { 
  Bell, 
  Plus, 
  MapPin, 
  Play, 
  Pause, 
  Trash2, 
  Edit2,
  Filter,
  Clock,
  Loader2
} from 'lucide-react';
import { useState } from 'react';
import CreateAlertModal from '@/components/dashboard/CreateAlertModal';
import { 
  useGetAlertsQuery, 
  useCreateAlertMutation, 
  useToggleAlertMutation, 
  useDeleteAlertMutation,
  useUpdateAlertMutation
} from '@/lib/store/features/alerts/alertsApi';
import Swal from 'sweetalert2';
import { formatDistanceToNow } from 'date-fns';

const GOLD_COLOR = '#D4AF37';

export default function AlertsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<any>(null);
  const { data: response, isLoading } = useGetAlertsQuery();
  const [createAlert] = useCreateAlertMutation();
  const [updateAlert] = useUpdateAlertMutation();
  const [toggleAlert] = useToggleAlertMutation();
  const [deleteAlert] = useDeleteAlertMutation();

  const alerts = response?.data || [];

  const handleEdit = (alert: any) => {
    setEditingAlert(alert);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAlert(null);
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleAlert(id).unwrap();
    } catch (error) {
      Swal.fire('Error', 'Failed to update alert status', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Delete Alert?',
      text: "You won't receive notifications for this search anymore.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E74C3C',
      confirmButtonText: 'Yes, delete it'
    });

    if (result.isConfirmed) {
      try {
        await deleteAlert(id).unwrap();
        Swal.fire({
          title: 'Deleted!',
          icon: 'success',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
      } catch (error) {
        Swal.fire('Error', 'Failed to delete alert', 'error');
      }
    }
  };

  const handleSaveAlert = async (formData: any) => {
    try {
      const criteria = {
        location: formData.location,
        minPrice: formData.minPrice ? Number(formData.minPrice) : undefined,
        maxPrice: formData.maxPrice ? Number(formData.maxPrice) : undefined,
        minYield: formData.minYield ? Number(formData.minYield) : undefined,
        minROI: formData.minROI ? Number(formData.minROI) : undefined,
        bedrooms: formData.bedrooms ? Number(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms ? Number(formData.bathrooms) : undefined,
        keywords: formData.keywords
      };

      if (formData.id) {
        await updateAlert({
          id: formData.id,
          data: {
            name: formData.name,
            criteria
          }
        }).unwrap();
        
        Swal.fire({
          title: 'Alert Updated!',
          icon: 'success',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
      } else {
        await createAlert({
          name: formData.name,
          criteria
        }).unwrap();

        Swal.fire({
          title: 'Alert Created!',
          text: 'We will notify you as soon as a match is found.',
          icon: 'success',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
      }
    } catch (error) {
      Swal.fire('Error', `Failed to ${formData.id ? 'update' : 'create'} alert`, 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="size-8 text-[#D4AF37] animate-spin" />
        <p className="text-stone-400 font-bold text-xs uppercase tracking-widest">Loading your alerts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="size-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: GOLD_COLOR }}>
              <Bell className="size-5" />
            </div>
            <h1 className="text-2xl font-black text-[#2C3E50]">Search Alerts</h1>
          </div>
          <p className="text-stone-400 font-bold text-xs uppercase tracking-widest px-1">Manage your automated property notifications</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-8 py-4 text-white font-black rounded-2xl text-sm shadow-xl transition-all hover:scale-[1.02]"
          style={{ backgroundColor: GOLD_COLOR }}
        >
          <Plus className="size-4" />
          Create New Alert
        </button>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {alerts.map((alert: any, i: number) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[32px] border border-stone-100 shadow-sm hover:shadow-xl hover:shadow-stone-200/30 transition-all group"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-black text-[#2C3E50]">{alert.name}</h3>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                    alert.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-stone-50 text-stone-400'
                  }`}>
                    {alert.isActive ? 'Active' : 'Paused'}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-stone-300" />
                    <span className="text-xs font-bold text-stone-600">
                      {alert.criteria?.location || 'Any Location'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="size-4 text-stone-300" />
                    <span className="text-xs font-bold text-stone-600 uppercase tracking-tight">
                      {alert.criteria?.maxPrice ? `Up to €${alert.criteria.maxPrice.toLocaleString()}` : 'No price limit'}
                      {alert.criteria?.minYield ? ` • ${alert.criteria.minYield}%+ Yield` : ''}
                      {alert.criteria?.bedrooms ? ` • ${alert.criteria.bedrooms}+ Bed` : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-stone-300" />
                    <span className="text-xs font-bold text-stone-400">
                      Last triggered: {alert.lastTriggeredAt ? formatDistanceToNow(new Date(alert.lastTriggeredAt), { addSuffix: true }) : 'Never'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleToggle(alert.id)}
                  className={`p-3 rounded-xl transition-all ${
                    alert.isActive ? 'bg-stone-50 text-stone-400 hover:text-amber-500' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                  }`}
                  title={alert.isActive ? 'Pause' : 'Resume'}
                >
                  {alert.isActive ? <Pause className="size-5" /> : <Play className="size-5" />}
                </button>
                <button 
                  onClick={() => handleEdit(alert)}
                  className="p-3 bg-stone-50 text-stone-400 hover:text-[#2C3E50] rounded-xl transition-all"
                >
                  <Edit2 className="size-5" />
                </button>
                <button 
                  onClick={() => handleDelete(alert.id)}
                  className="p-3 bg-rose-50 text-rose-400 hover:bg-rose-100 hover:text-rose-600 rounded-xl transition-all"
                >
                  <Trash2 className="size-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {alerts.length === 0 && (
          <div className="p-20 text-center bg-stone-50/50 rounded-[40px] border border-dashed border-stone-200">
            <Bell className="size-12 text-stone-200 mx-auto mb-4" />
            <p className="text-stone-400 font-bold text-sm uppercase tracking-widest">No alerts created yet</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-6 text-[10px] font-black text-[#D4AF37] uppercase tracking-widest hover:underline"
            >
              Create your first alert
            </button>
          </div>
        )}
      </div>

      <CreateAlertModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSave={handleSaveAlert}
        initialData={editingAlert}
      />
    </div>
  );
}
