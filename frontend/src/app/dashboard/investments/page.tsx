'use client';

import { 
  Briefcase, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Trash2,
  PieChart,
  Loader2,
  Plus
} from 'lucide-react';
import { motion } from 'motion/react';
import { useGetInvestmentsQuery, useAddInvestmentMutation, useDeleteInvestmentMutation } from '@/lib/store/features/investments/investmentsApi';
import Swal from 'sweetalert2';
import { useMemo } from 'react';

export default function InvestmentsPage() {
  const { data: response, isLoading } = useGetInvestmentsQuery();
  const [addInvestment] = useAddInvestmentMutation();
  const [deleteInvestment] = useDeleteInvestmentMutation();

  const investments = response?.data || [];

  // Calculate Metrics
  const metrics = useMemo(() => {
    const totalAmount = investments.reduce((sum: number, inv: any) => sum + inv.amount, 0);
    const totalProfit = investments.reduce((sum: number, inv: any) => sum + (inv.growth || 0), 0);
    const avgGrowthPerc = investments.length > 0 ? (totalProfit / totalAmount) * 100 : 0;

    const resiAmount = investments.filter((inv: any) => inv.type === 'RESIDENTIAL').reduce((sum: number, inv: any) => sum + inv.amount, 0);
    const luxAmount = investments.filter((inv: any) => inv.type === 'LUXURY').reduce((sum: number, inv: any) => sum + inv.amount, 0);
    const otherAmount = totalAmount - (resiAmount + luxAmount);

    return {
      totalAmount,
      totalProfit,
      avgGrowthPerc,
      resiPerc: totalAmount > 0 ? (resiAmount / totalAmount) * 100 : 0,
      luxPerc: totalAmount > 0 ? (luxAmount / totalAmount) * 100 : 0,
      otherPerc: totalAmount > 0 ? (otherAmount / totalAmount) * 100 : 0,
    };
  }, [investments]);

  const handleAddInvestment = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Add New Asset',
      html: `
        <div class="space-y-4 text-left">
          <div>
            <label class="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-2">Asset Name</label>
            <input id="swal-input1" class="w-full bg-stone-50 border-none rounded-xl py-4 px-5 outline-none font-bold text-sm" placeholder="e.g. Valencia Apt">
          </div>
          <div>
            <label class="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-2">Amount Invested (€)</label>
            <input id="swal-input2" type="number" class="w-full bg-stone-50 border-none rounded-xl py-4 px-5 outline-none font-bold text-sm" placeholder="0.00">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-2">Asset Type</label>
              <select id="swal-input3" class="w-full bg-stone-50 border-none rounded-xl py-4 px-5 outline-none font-bold text-sm">
                <option value="RESIDENTIAL">Residential</option>
                <option value="LUXURY">Luxury</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label class="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-2">Growth (€)</label>
              <input id="swal-input4" type="number" class="w-full bg-stone-50 border-none rounded-xl py-4 px-5 outline-none font-bold text-sm" placeholder="Optional">
            </div>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Add Asset',
      confirmButtonColor: '#34495E',
      preConfirm: () => {
        return {
          assetName: (document.getElementById('swal-input1') as HTMLInputElement).value,
          amount: (document.getElementById('swal-input2') as HTMLInputElement).value,
          type: (document.getElementById('swal-input3') as HTMLSelectElement).value,
          growth: (document.getElementById('swal-input4') as HTMLInputElement).value,
        };
      }
    });

    if (formValues) {
      if (!formValues.assetName || !formValues.amount) {
        Swal.fire('Error', 'Name and Amount are required', 'error');
        return;
      }
      try {
        await addInvestment({
          ...formValues,
          growthPerc: formValues.growth ? (Number(formValues.growth) / Number(formValues.amount)) * 100 : 0
        }).unwrap();
        Swal.fire({
            title: 'Success!',
            text: 'Asset added to your portfolio.',
            icon: 'success',
            confirmButtonColor: '#34495E'
        });
      } catch (error) {
        Swal.fire('Error', 'Failed to add investment', 'error');
      }
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This will remove the asset from your portfolio tracking.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E74C3C',
      cancelButtonColor: '#34495E',
      confirmButtonText: 'Yes, remove it'
    });

    if (result.isConfirmed) {
      try {
        await deleteInvestment(id).unwrap();
        Swal.fire('Deleted!', 'Asset removed.', 'success');
      } catch (error) {
        Swal.fire('Error', 'Failed to delete asset', 'error');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="size-8 text-[#34495E] animate-spin" />
        <p className="text-stone-400 font-bold text-xs uppercase tracking-widest">Loading portfolio...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[#2C3E50]">Investment Portfolio</h2>
          <p className="text-stone-400 font-bold text-xs uppercase tracking-widest">Active Assets Tracking</p>
        </div>
        <button 
          onClick={handleAddInvestment}
          className="flex items-center gap-3 px-6 py-4 bg-[#34495E] text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-[#34495E]/20 hover:scale-[1.02] transition-all"
        >
          <Plus className="size-4" /> Add Investment
        </button>
      </header>

      {/* Portfolio Summary Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-white p-10 rounded-[48px] shadow-sm border border-stone-100">
            <div className="flex items-center gap-3 mb-10">
               <div className="size-10 bg-stone-50 rounded-xl flex items-center justify-center text-[#34495E]">
                  <PieChart className="size-5" />
               </div>
               <h3 className="text-lg font-black text-[#2C3E50]">Portfolio Distribution</h3>
            </div>
            <div className="h-14 w-full bg-stone-50 rounded-2xl overflow-hidden flex shadow-inner border border-stone-100">
               <div className="h-full bg-[#34495E] transition-all duration-1000" style={{ width: `${metrics.resiPerc}%` }} />
               <div className="h-full bg-[#D4A373] transition-all duration-1000" style={{ width: `${metrics.luxPerc}%` }} />
               <div className="h-full bg-stone-200 transition-all duration-1000" style={{ width: `${metrics.otherPerc}%` }} />
            </div>
            <div className="grid grid-cols-3 gap-6 mt-10">
               <div className="space-y-2">
                  <div className="flex items-center gap-2">
                     <div className="size-2 bg-[#34495E] rounded-full" />
                     <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Residential</span>
                  </div>
                  <p className="text-lg font-black text-[#2C3E50]">{Math.round(metrics.resiPerc)}%</p>
               </div>
               <div className="space-y-2 border-x border-stone-50 px-6">
                  <div className="flex items-center gap-2">
                     <div className="size-2 bg-[#D4A373] rounded-full" />
                     <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Luxury</span>
                  </div>
                  <p className="text-lg font-black text-[#2C3E50]">{Math.round(metrics.luxPerc)}%</p>
               </div>
               <div className="space-y-2">
                  <div className="flex items-center gap-2">
                     <div className="size-2 bg-stone-200 rounded-full" />
                     <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Other Assets</span>
                  </div>
                  <p className="text-lg font-black text-[#2C3E50]">{Math.round(metrics.otherPerc)}%</p>
               </div>
            </div>
         </div>

         <div className="bg-[#34495E] p-10 rounded-[48px] shadow-2xl text-white relative overflow-hidden flex flex-col justify-between min-h-[300px]">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 size-64 bg-white/5 rounded-full blur-3xl" />
            
            <div>
              <div className="flex items-center gap-3 mb-10">
                 <div className="size-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center">
                    <TrendingUp className="size-5" />
                 </div>
                 <h3 className="text-lg font-black">Performance</h3>
              </div>
              <p className="text-white/40 font-black text-[10px] uppercase tracking-[0.2em]">Total Unrealized Profit</p>
              <h4 className="text-5xl font-black mt-3">€{metrics.totalProfit.toLocaleString()}</h4>
            </div>

            <div className={`mt-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black ${metrics.totalProfit >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
               {metrics.totalProfit >= 0 ? <ArrowUpRight className="size-4" /> : <ArrowDownRight className="size-4" />}
               {metrics.avgGrowthPerc.toFixed(1)}% All Time
            </div>
         </div>
      </div>

      {/* Asset Table */}
      <div className="bg-white rounded-[48px] shadow-sm border border-stone-100 overflow-hidden">
        <div className="p-10 border-b border-stone-50 flex items-center justify-between">
           <h3 className="text-lg font-black text-[#2C3E50]">Active Assets</h3>
           <span className="px-4 py-1.5 bg-stone-50 text-stone-400 text-[10px] font-black uppercase rounded-full tracking-widest">
              Total Assets: {investments.length}
           </span>
        </div>
        <div className="overflow-x-auto">
          {investments.length === 0 ? (
            <div className="p-20 text-center space-y-4">
              <p className="text-stone-300 font-black text-xs uppercase tracking-[0.3em]">No assets in your portfolio</p>
              <button onClick={handleAddInvestment} className="text-[#34495E] font-black text-[10px] uppercase underline decoration-2 underline-offset-4">Add your first asset now</button>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-50/30">
                  <th className="px-10 py-6 text-[10px] font-black text-stone-400 uppercase tracking-widest">Asset Name</th>
                  <th className="px-10 py-6 text-[10px] font-black text-stone-400 uppercase tracking-widest">Amount</th>
                  <th className="px-10 py-6 text-[10px] font-black text-stone-400 uppercase tracking-widest">Growth</th>
                  <th className="px-10 py-6 text-[10px] font-black text-stone-400 uppercase tracking-widest">Status</th>
                  <th className="px-10 py-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {investments.map((asset: any, i: number) => (
                  <motion.tr 
                    key={asset.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-stone-50/50 transition-all cursor-pointer group"
                  >
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-5">
                        <div className="size-12 bg-stone-50 rounded-2xl flex items-center justify-center text-[#34495E] group-hover:scale-110 transition-transform shadow-sm">
                          <Briefcase className="size-6" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-[#2C3E50]">{asset.assetName}</span>
                          <span className="text-[9px] font-black text-stone-300 uppercase tracking-widest">{asset.type}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="text-sm font-black text-[#2C3E50]">€{asset.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-10 py-8">
                      <div className={`flex items-center gap-1 text-sm font-black ${(asset.growth || 0) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                         {(asset.growth || 0) >= 0 ? <ArrowUpRight className="size-4" /> : <ArrowDownRight className="size-4" />}
                         €{Math.abs(asset.growth || 0).toLocaleString()} ({asset.growthPerc?.toFixed(1)}%)
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm ${
                        asset.status === 'GROWING' ? 'bg-emerald-50 text-emerald-600' : 
                        asset.status === 'STABLE' ? 'bg-[#34495E]/5 text-[#34495E]' : 
                        'bg-rose-50 text-rose-500'
                      }`}>
                        {asset.status}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <button 
                        onClick={() => handleDelete(asset.id)}
                        className="p-3 text-stone-200 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                      >
                         <Trash2 className="size-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
