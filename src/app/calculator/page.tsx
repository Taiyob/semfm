'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Euro, 
  TrendingUp, 
  ChevronRight, 
  ChevronLeft, 
  Info, 
  CheckCircle2, 
  MapPin, 
  Layout, 
  Zap,
  Calculator as CalcIcon,
  ShieldCheck,
  TrendingDown,
  Hammer,
  BarChart2,
  Lock,
  Clock,
  PieChart
} from 'lucide-react';
import { GatedData } from '@/components/gated-data';

type Step = 'rental' | 'returns' | 'profit';

const regions = [
  { name: 'Lisbon Central', avgRent: 22, color: 'bg-blue-500' },
  { name: 'Porto Downtown', avgRent: 18, color: 'bg-blue-600' },
  { name: 'Algarve Coast', avgRent: 20, color: 'bg-emerald-500' },
  { name: 'Braga University', avgRent: 12, color: 'bg-amber-500' },
  { name: 'Cascais Luxury', avgRent: 28, color: 'bg-indigo-500' },
];

export default function CalculatorPage() {
  const [step, setStep] = useState<Step>('rental');
  const [formData, setFormData] = useState({
    region: 'Lisbon Central',
    size: 60,
    type: '1 Bedroom / T1',
    purchasePrice: 350000,
    renovationCost: 20000,
    estimatedRent: 1500,
    includeMortgage: false,
    loanPercentage: 70,
    interestRate: 3.5,
  });

  const calculateResults = () => {
    const totalPurchase = Number(formData.purchasePrice) + Number(formData.renovationCost);
    const imt = formData.purchasePrice * 0.06;
    const stampDuty = formData.purchasePrice * 0.008;
    const acquisitionCosts = imt + stampDuty + 2500;
    
    const totalCapitalNeeded = totalPurchase + acquisitionCosts;
    const annualRent = formData.estimatedRent * 12;
    const yearlyExpenses = annualRent * 0.22; // Tech property tax + management
    const netAnnualIncome = annualRent - yearlyExpenses;
    
    // Mortgage logic
    const loanAmount = formData.includeMortgage ? (formData.purchasePrice * (formData.loanPercentage / 100)) : 0;
    const annualInterest = loanAmount * (formData.interestRate / 100);
    const profitAfterMortgage = netAnnualIncome - annualInterest;
    const cashOnCashReturn = formData.includeMortgage 
        ? (profitAfterMortgage / (totalCapitalNeeded - loanAmount)) * 100
        : (netAnnualIncome / totalCapitalNeeded) * 100;
    
    const yearsToBreakeven = totalCapitalNeeded / netAnnualIncome;
    
    return {
      totalCapitalNeeded,
      acquisitionCosts,
      annualRent,
      netAnnualIncome,
      profitAfterMortgage,
      grossYield: ((annualRent / totalCapitalNeeded) * 100).toFixed(1),
      netYield: ((netAnnualIncome / totalCapitalNeeded) * 100).toFixed(1),
      cashOnCash: cashOnCashReturn.toFixed(1),
      yearsToBreakeven: yearsToBreakeven.toFixed(1),
    };
  };

  const results = calculateResults();

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 font-outfit hero-gradient min-h-screen">
      <div className="grid lg:grid-cols-12 gap-12">
        
        {/* Left Column: Input Form */}
        <div className="lg:col-span-7">
          <div className="flex flex-col gap-4 mb-16">
            <div className="section-tag w-fit">
                <CalcIcon className="size-4" />
                Phase 1 Logic: 3-Stage Analysis
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">Master Your <span className="gradient-text">Investment Flow.</span></h1>
            <p className="text-slate-500 text-lg font-bold">From Rental Estimation to Final Net Profit after Leverage.</p>
          </div>

          {/* New 3-Stage Progress Bar */}
          <div className="flex items-center gap-4 mb-14">
              {[
                { id: 'rental', label: 'Rent Estimate' },
                { id: 'returns', label: 'Yield & Timeline' },
                { id: 'profit', label: 'Profit & Mortgage' }
              ].map((s, i) => (
                <div key={s.id} className="flex-grow flex items-center gap-4">
                  <div className={`p-4 rounded-2xl flex items-center gap-3 transition-all ${step === s.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'bg-slate-100 text-slate-400 font-bold uppercase tracking-widest text-[10px]'}`}>
                      <span className="text-sm font-black">0{i+1}</span>
                      {step === s.id && <span className="font-black text-xs uppercase tracking-widest whitespace-nowrap">{s.label}</span>}
                  </div>
                  {i < 2 && <div className="hidden sm:block flex-grow h-px bg-slate-200" />}
                </div>
              ))}
          </div>

          <div className="bg-white border border-slate-100 rounded-[40px] p-8 md:p-12 shadow-2xl shadow-slate-200/50">
              <AnimatePresence mode="wait">
                {step === 'rental' && (
                  <motion.div key="step-1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                    <div>
                      <h4 className="text-lg font-black text-slate-900 mb-2">Stage 1: Market Rental Price Estimation</h4>
                      <p className="text-slate-500 text-sm mb-8">Select your target region to get real-time price-per-sqm benchmarks.</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {regions.map((region) => (
                          <button
                            key={region.name}
                            onClick={() => setFormData({ ...formData, region: region.name })}
                            className={`p-6 rounded-[24px] border-2 transition-all text-left ${
                              formData.region === region.name ? 'bg-blue-50 border-blue-600 text-blue-600' : 'bg-slate-50 border-transparent hover:border-slate-200'
                            }`}
                          >
                            <MapPin className="size-5 mb-3" />
                            <span className="block font-black text-xs uppercase tracking-widest">{region.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-400">Monthly Rent Capacity (€)</label>
                          <input type="number" value={formData.estimatedRent} onChange={(e) => setFormData({ ...formData, estimatedRent: Number(e.target.value) })}
                            className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-bold text-lg"
                          />
                        </div>
                    </div>

                    <div className="pt-6">
                      <button onClick={() => setStep('returns')} className="btn-primary w-full flex items-center justify-center gap-3 uppercase tracking-widest text-xs">
                        Next: Yield & Timeline Analysis <ChevronRight className="size-5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 'returns' && (
                  <motion.div key="step-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                    <div>
                        <h4 className="text-lg font-black text-slate-900 mb-2">Stage 2: Returns & Break-even Timeline</h4>
                        <p className="text-slate-500 text-sm mb-8">Calculating how long it takes to recover your capital based on current prices.</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Total Purchase Price (€)</label>
                        <input type="number" value={formData.purchasePrice} onChange={(e) => setFormData({ ...formData, purchasePrice: Number(e.target.value) })}
                          className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-5 outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-2xl font-black"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Renovation / Setup (€)</label>
                        <input type="number" value={formData.renovationCost} onChange={(e) => setFormData({ ...formData, renovationCost: Number(e.target.value) })}
                          className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-5 outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-2xl font-black"
                        />
                      </div>
                    </div>

                    <div className="p-8 bg-slate-900 rounded-[32px] text-white flex items-center justify-between">
                         <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Timeline Impact</span>
                            <div className="text-3xl font-black">{results.yearsToBreakeven} <span className="text-sm font-bold text-slate-500 italic">Years to ROI</span></div>
                         </div>
                         <Clock className="size-8 text-blue-600" />
                    </div>

                    <div className="flex gap-4 pt-6">
                      <button onClick={() => setStep('rental')} className="btn-secondary px-6 shrink-0"> <ChevronLeft className="size-6" /> </button>
                      <button onClick={() => setStep('profit')} className="btn-primary flex-grow flex items-center justify-center gap-3 uppercase tracking-widest text-xs">
                        Final Stage: Profit & Leverage <ChevronRight className="size-5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 'profit' && (
                  <motion.div key="step-3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                    <div>
                        <h4 className="text-lg font-black text-slate-900 mb-2">Stage 3: Net Profit & Mortgage Integration</h4>
                        <p className="text-slate-500 text-sm mb-8">Factor in financing costs to see your actual net liquidity.</p>
                    </div>

                    {/* Mortgage Toggle */}
                    <button 
                        onClick={() => setFormData({ ...formData, includeMortgage: !formData.includeMortgage })}
                        className={`w-full p-8 rounded-[32px] border-2 transition-all flex items-center justify-between ${formData.includeMortgage ? 'border-blue-600 bg-blue-50' : 'border-slate-100 bg-white'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`size-12 rounded-2xl flex items-center justify-center ${formData.includeMortgage ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                <Zap className="size-6" />
                            </div>
                            <div className="text-left">
                                <h5 className="font-extrabold text-slate-900">Include Mortgage Leverage</h5>
                                <p className="text-xs font-bold text-slate-400">Factor in loan interest and principal</p>
                            </div>
                        </div>
                        <CheckCircle2 className={`size-6 ${formData.includeMortgage ? 'text-blue-600 opacity-100' : 'opacity-0'}`} />
                    </button>

                    {formData.includeMortgage && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="grid grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-slate-400">LTV (%)</label>
                                <input type="number" value={formData.loanPercentage} onChange={(e) => setFormData({ ...formData, loanPercentage: Number(e.target.value) })} className="w-full bg-slate-50 rounded-2xl p-4 font-bold outline-none border-2 border-transparent focus:border-blue-600" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-slate-400">Interest Rate (%)</label>
                                <input type="number" value={formData.interestRate} onChange={(e) => setFormData({ ...formData, interestRate: Number(e.target.value) })} className="w-full bg-slate-50 rounded-2xl p-4 font-bold outline-none border-2 border-transparent focus:border-blue-600" />
                            </div>
                        </motion.div>
                    )}

                    <div className="flex gap-4 pt-6">
                      <button onClick={() => setStep('returns')} className="btn-secondary px-6 shrink-0"> <ChevronLeft className="size-6" /> </button>
                      <button onClick={() => setStep('rental')} className="btn-primary flex-grow text-xs uppercase tracking-widest font-black">
                         Reset Analysis
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
          </div>
        </div>

        {/* Right Column: High Fidelity Projection Sidebar */}
        <div className="lg:col-span-5">
            <div className="sticky top-32">
                <div className="bg-slate-900 p-10 lg:p-14 rounded-[48px] text-white shadow-2xl shadow-slate-900/40 relative overflow-hidden">
                    <div className="relative z-10 space-y-12">
                        <div className="flex items-center gap-3">
                            <div className="size-10 bg-blue-600 rounded-xl flex items-center justify-center">
                                <BarChart2 className="size-6 text-white" />
                            </div>
                            <span className="font-black uppercase tracking-widest text-[10px] text-slate-400">Live Yield Engine V1</span>
                        </div>

                        <div className="space-y-2 pb-12 border-b border-white/10">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Net Annual Profit</span>
                            <div className="text-6xl font-black tracking-tighter">
                                <GatedData>€{Number(results.profitAfterMortgage).toLocaleString()}</GatedData>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-10">
                            <div className="space-y-2">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Net Yield</span>
                                <GatedData><div className="text-4xl font-black text-emerald-500">{results.netYield}%</div></GatedData>
                            </div>
                            <div className="space-y-2 text-right">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Leverage ROI</span>
                                <GatedData><div className="text-4xl font-black text-blue-500">{results.cashOnCash}%</div></GatedData>
                            </div>
                        </div>

                        <div className="pt-6 space-y-6">
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className="text-slate-500">Final Capital Outlay</span>
                                <GatedData><span>€{results.totalCapitalNeeded.toLocaleString()}</span></GatedData>
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className="text-slate-500">Months to ROI</span>
                                <GatedData><span className="text-blue-500">{(Number(results.yearsToBreakeven) * 12).toFixed(0)} Months</span></GatedData>
                            </div>
                        </div>

                        <Link href="/pricing" className="btn-primary w-full !bg-white !text-slate-900 uppercase tracking-widest text-[10px] py-5 text-center shadow-2xl">
                           Unlock High Fidelity Report <ShieldCheck className="size-4 inline ml-2" />
                        </Link>
                    </div>
                </div>

                <div className="mt-10 p-10 bg-blue-50 rounded-[40px] border-2 border-blue-100 flex gap-6">
                    <PieChart className="size-10 text-blue-600 shrink-0" />
                    <div>
                        <h6 className="font-extrabold text-slate-900 mb-2">Stage-by-Stage Logic Tracking</h6>
                        <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-tighter">Current market data for <span className="text-blue-600">{formData.region}</span> indicates high demand for <span className="text-blue-600">{formData.type}</span> assets.</p>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
