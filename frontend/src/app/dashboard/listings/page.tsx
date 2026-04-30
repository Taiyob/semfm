'use client';

import { motion } from 'motion/react';
import { 
  useGetMyPropertiesQuery, 
  useDeletePropertyMutation 
} from '@/lib/store/features/property/propertyApi';
import { 
  Building2, 
  MapPin, 
  TrendingUp, 
  Euro, 
  MoreHorizontal,
  PlusCircle,
  Eye,
  Edit2,
  Loader2,
  AlertCircle,
  SearchX,
  Trash2
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Swal from 'sweetalert2';

export default function MyListingsPage() {
  const { data, isLoading, error } = useGetMyPropertiesQuery({ page: 1, limit: 20 });
  const [deleteProperty, { isLoading: isDeleting }] = useDeletePropertyMutation();
  
  const listings = data?.data || [];
  const total = data?.meta?.pagination?.total || 0;

  const handleDelete = async (id: string, title: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You want to delete "${title}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34495E',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
      background: '#fff',
      customClass: {
        popup: 'rounded-[40px] font-montserrat',
        title: 'text-2xl font-black text-[#2C3E50] uppercase tracking-tighter',
        confirmButton: 'px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest',
        cancelButton: 'px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest'
      }
    });

    if (result.isConfirmed) {
        try {
            await deleteProperty(id).unwrap();
            Swal.fire({
                title: 'Deleted!',
                text: 'Your property has been removed.',
                icon: 'success',
                confirmButtonColor: '#34495E',
                customClass: {
                    popup: 'rounded-[40px] font-montserrat',
                    title: 'text-2xl font-black text-[#2C3E50] uppercase tracking-tighter',
                    confirmButton: 'px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest',
                }
            });
        } catch (err) {
            Swal.fire('Error!', 'Something went wrong.', 'error');
        }
    }
  };

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin size-10 text-[#34495E]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 p-12 rounded-[40px] border border-rose-100 text-center">
        <AlertCircle className="size-12 text-rose-500 mx-auto mb-4" />
        <h3 className="text-lg font-black text-rose-900 uppercase">Error Loading Listings</h3>
        <p className="text-rose-600 text-sm font-bold">Failed to fetch your property inventory. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[#2C3E50]">My Property Listings</h2>
          <p className="text-stone-400 font-bold text-xs uppercase tracking-widest">
            {total === 0 ? 'No Properties Listed' : `Managing ${total} Propert${total > 1 ? 'ies' : 'y'}`}
          </p>
        </div>
        <Link href="/dashboard/listings/add" className="px-6 py-3 bg-[#34495E] text-white font-black rounded-2xl text-xs shadow-lg shadow-[#34495E]/20 hover:scale-[1.02] transition-all flex items-center gap-2">
          <PlusCircle className="size-4" />
          Add New Listing
        </Link>
      </header>

      {listings.length === 0 ? (
        <div className="bg-white p-20 rounded-[40px] shadow-sm border border-stone-100 text-center space-y-4">
           <div className="size-20 bg-stone-50 rounded-[32px] flex items-center justify-center mx-auto">
              <SearchX className="size-10 text-stone-200" />
           </div>
           <div>
              <h3 className="text-xl font-black text-[#2C3E50] uppercase tracking-tighter">No Listings Found</h3>
              <p className="text-stone-400 font-bold text-sm max-w-xs mx-auto">You haven't listed any properties yet. Start by adding your first investment asset.</p>
           </div>
           <Link href="/dashboard/listings/add" className="inline-flex items-center gap-2 text-[#34495E] font-black text-xs uppercase tracking-widest hover:underline pt-4">
              Create your first listing <PlusCircle className="size-4" />
           </Link>
        </div>
      ) : (
        <div className="bg-white rounded-[40px] shadow-sm border border-stone-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-50/50">
                  <th className="px-8 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Property</th>
                  <th className="px-8 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Price / Yield</th>
                  <th className="px-8 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Performance</th>
                  <th className="px-8 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {listings.map((listing: any, i: number) => (
                  <motion.tr 
                    key={listing.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-stone-50/50 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="size-16 rounded-xl overflow-hidden border border-stone-100 flex-shrink-0 bg-stone-50">
                          {listing.image ? (
                            <img src={listing.image} alt={listing.title} className="size-full object-cover" />
                          ) : (
                            <div className="size-full flex items-center justify-center">
                               <Building2 className="size-6 text-stone-200" />
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="text-sm font-black text-[#2C3E50] block line-clamp-1">{listing.title}</span>
                          <div className="flex items-center gap-1 text-[10px] font-bold text-stone-400 mt-1">
                             <MapPin className="size-3" />
                             {listing.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                        listing.status === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {listing.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-black text-[#2C3E50] block">€{listing.price.toLocaleString()}</span>
                      <span className="text-[10px] font-black text-stone-400 uppercase">{listing.yield}% Net Yield</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-6">
                         <div className="flex items-center gap-2">
                            <Eye className="size-4 text-stone-300" />
                            <span className="text-sm font-bold text-stone-600">{listing.views || 0}</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <TrendingUp className="size-4 text-emerald-400" />
                            <span className="text-sm font-bold text-stone-600">{listing.leads || 0} Leads</span>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                         <Link 
                            href={`/dashboard/listings/edit/${listing.id}`}
                            className="p-2 text-stone-400 hover:text-[#34495E] hover:bg-white rounded-xl transition-all shadow-sm"
                         >
                            <Edit2 className="size-4" />
                         </Link>
                         <button 
                            onClick={() => handleDelete(listing.id, listing.title)}
                            disabled={isDeleting}
                            className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shadow-sm disabled:opacity-50"
                         >
                            <Trash2 className="size-4" />
                         </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

