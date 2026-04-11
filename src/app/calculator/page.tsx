'use client';

import { useState, useMemo } from 'react';
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
  PieChart,
  Settings2,
  Calendar,
  Layers,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { GatedData } from '@/components/gated-data';

type Step = 'rent_estimate' | 'gross_yield' | 'net_profit' | 'roi' | 'projection';
type Mode = 'simple' | 'advanced';

const regions = [
  { name: 'Lisbon Central', avgRent: 22, color: 'bg-stone-500' },
  { name: 'Porto Downtown', avgRent: 18, color: 'bg-stone-600' },
  { name: 'Algarve Coast', avgRent: 20, color: 'bg-[#D4A373]' },
  { name: 'Braga University', avgRent: 12, color: 'bg-[#B55D3E]' },
  { name: 'Cascais Luxury', avgRent: 28, color: 'bg-stone-900' },
];

export default function CalculatorPage() {
  const [step, setStep] = useState<Step>('rent_estimate');
  const [mode, setMode] = useState<Mode>('simple');
  const [formData, setFormData] = useState({
    region: 'Lisbon Central',
    size: 60,
    type: '1 Bedroom / T1',
    purchasePrice: 350000,
    renovationCost: 20000,
    estimatedRent: 1500,
    includeMortgage: true,
    loanPercentage: 70,
    interestRate: 3.5,
    appreciationRate: 6,
    weighting: 50,
    // Advanced fields
    hasParking: false,
    energyLabel: 'A',
    yearBuilt: 2020,
    finishQuality: 'High'
  });

  const results = useMemo(() => {
    const totalPurchase = Number(formData.purchasePrice) + Number(formData.renovationCost);
    const imt = formData.purchasePrice * 0.06;
    const stampDuty = formData.purchasePrice * 0.008;
    const acquisitionCosts = imt + stampDuty + 2500;
    
    const totalCapitalNeeded = totalPurchase + acquisitionCosts;
    const annualRent = formData.estimatedRent * 12;
    const yearlyExpenses = annualRent * 0.22; // Property tax + management
    const netAnnualIncome = annualRent - yearlyExpenses;
    
    const loanAmount = formData.includeMortgage ? (formData.purchasePrice * (formData.loanPercentage / 100)) : 0;
    const annualInterest = loanAmount * (formData.interestRate / 100);
    const profitAfterMortgage = netAnnualIncome - annualInterest;
    
    const cashInvested = totalCapitalNeeded - loanAmount;
    const cashOnCashReturn = (profitAfterMortgage / cashInvested) * 100;
    
    // 20 Year Projection
    const projection = Array.from({ length: 21 }, (_, year) => {
        const appreciation = Math.pow(1 + (formData.appreciationRate / 100), year);
        const rentIncrease = Math.pow(1.02, year); // 2% standard rent increase
        return {
            year,
            value: totalPurchase * appreciation,
            rent: annualRent * rentIncrease,
            profit: profitAfterMortgage * rentIncrease
        };
    });

    const total20YearProfit = projection.reduce((acc, curr) => acc + curr.profit, 0);
    const futureValue = projection[20].value;
    const valueGrowth = futureValue - totalPurchase;
    const combinedReturn = ((total20YearProfit + valueGrowth) / cashInvested) * 100;

    return {
      totalCapitalNeeded,
      acquisitionCosts,
      annualRent,
      netAnnualIncome,
      profitAfterMortgage,
      grossYield: ((annualRent / totalPurchase) * 100).toFixed(1),
      netYield: ((netAnnualIncome / totalCapitalNeeded) * 100).toFixed(1),
      cashOnCash: cashOnCashReturn.toFixed(1),
      total20YearProfit,
      futureValue,
      valueGrowth,
      combinedReturn: combinedReturn.toFixed(0)
    };
  }, [formData]);

  const steps: { id: Step; label: string; locked: boolean }[] = [
    { id: 'rent_estimate', label: 'Rent Estimate', locked: false },
    { id: 'gross_yield', label: 'Gross Yield', locked: false },
    { id: 'net_profit', label: 'Net Profit', locked: true },
    { id: 'roi', label: 'Cash ROI', locked: true },
    { id: 'projection', label: '20Y Forecast', locked: true },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 font-outfit hero-gradient min-h-screen">
      <div className="grid lg:grid-cols-12 gap-16">
        
        {/* Left Column: Input Form */}
        <div className="lg:col-span-7">
          <div className="flex flex-col gap-6 mb-16">
            <div className="section-tag w-fit">
                <CalcIcon className="size-4" />
                Hofman Analytics v2.4
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-stone-900 leading-[0.9] uppercase tracking-tighter">Master Your <span className="gradient-text">Investment Horizon.</span></h1>
            <p className="text-stone-500 text-lg font-bold italic">“Transparent data for intelligent European real estate decisions.”</p>
          </div>

          {/* 5-Stage Progress Bar */}
          <div className="flex items-center gap-2 mb-14 overflow-x-auto pb-4 no-scrollbar">
              {steps.map((s, i) => (
                <div key={s.id} className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={() => !s.locked && setStep(s.id)}
                    className={`p-4 rounded-2xl flex items-center gap-3 transition-all ${step === s.id ? 'bg-[#B55D3E] text-white shadow-xl shadow-[#B55D3E]/20' : 'bg-stone-100 text-stone-400'}`}
                  >
                      <span className="text-xs font-black">0{i+1}</span>
                      {step === s.id && <span className="font-black text-[10px] uppercase tracking-widest whitespace-nowrap">{s.label}</span>}
                      {s.locked && step !== s.id && <Lock className="size-3" />}
                  </button>
                  {i < 4 && <div className="w-4 h-px bg-stone-200" />}
                </div>
              ))}
          </div>

          <div className="bg-white border border-stone-100 rounded-[48px] p-8 md:p-12 shadow-2xl shadow-stone-200/40">
              
              {/* Mode Toggle */}
              <div className="flex justify-end mb-10">
                  <div className="p-1 bg-stone-100 rounded-xl flex gap-1">
                      <button onClick={() => setMode('simple')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'simple' ? 'bg-white text-[#B55D3E] shadow-sm' : 'text-stone-400'}`}>Simple</button>
                      <button onClick={() => setMode('advanced')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'advanced' ? 'bg-white text-[#B55D3E] shadow-sm' : 'text-stone-400'}`}>Advanced</button>
                  </div>
              </div>

              <AnimatePresence mode="wait">
                {step === 'rent_estimate' && (
                  <motion.div key="step-1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                    <div>
                      <h4 className="text-xl font-black text-stone-900 mb-2 uppercase tracking-tight">Stage 1: Occupancy & Rent Capacity</h4>
                      <p className="text-stone-500 text-sm font-bold flex items-center gap-2 italic"><Sparkles className="size-4 text-[#D4A373]" /> Market-wide benchmarks updated 24h ago.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {regions.map((region) => (
                            <button
                            key={region.name}
                            onClick={() => setFormData({ ...formData, region: region.name })}
                            className={`p-6 rounded-[28px] border-2 transition-all text-left group ${
                                formData.region === region.name ? 'bg-[#B55D3E]/5 border-[#B55D3E] text-[#B55D3E]' : 'bg-stone-50 border-transparent hover:border-stone-200'
                            }`}
                            >
                            <MapPin className="size-5 mb-3 group-hover:scale-110 transition-transform" />
                            <span className="block font-black text-[10px] uppercase tracking-widest">{region.name}</span>
                            </button>
                        ))}
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest ml-2">Property Size (sqm)</label>
                            <input type="number" value={formData.size} onChange={(e) => setFormData({ ...formData, size: Number(e.target.value) })} className="w-full bg-stone-50 rounded-2xl p-5 font-black text-xl outline-none border-2 border-transparent focus:border-[#B55D3E]" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest ml-2">Market Rent (€/mo)</label>
                            <input type="number" value={formData.estimatedRent} onChange={(e) => setFormData({ ...formData, estimatedRent: Number(e.target.value) })} className="w-full bg-stone-50 rounded-2xl p-5 font-black text-xl outline-none border-2 border-transparent focus:border-[#B55D3E]" />
                        </div>
                    </div>

                    {mode === 'advanced' && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="grid md:grid-cols-2 gap-8 pt-4 border-t border-stone-50">
                            <div className="space-y-3 font-bold">
                                <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest">Finish Quality</label>
                                <select className="w-full bg-stone-50 rounded-2xl p-5 font-black outline-none appearance-none">
                                    <option>Standard</option>
                                    <option>High Premium</option>
                                    <option>Luxury</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-4 p-5 bg-stone-50 rounded-2xl">
                                <input type="checkbox" id="parking" checked={formData.hasParking} onChange={(e) => setFormData({...formData, hasParking: e.target.checked})} className="size-5 accent-[#B55D3E]" />
                                <label htmlFor="parking" className="text-sm font-black text-stone-900 uppercase">Includes Parking Space</label>
                            </div>
                        </motion.div>
                    )}

                    <button onClick={() => setStep('gross_yield')} className="btn-primary w-full flex items-center justify-center gap-3 py-6 group">
                      CONTINUE TO YIELD ANALYSIS <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </motion.div>
                )}

                {step === 'gross_yield' && (
                  <motion.div key="step-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                    <div>
                        <h4 className="text-xl font-black text-stone-900 mb-2 uppercase tracking-tight">Stage 2: Acquisition & Gross Yield</h4>
                        <p className="text-stone-500 text-sm font-bold italic">Calculating market entry cost vs revenue potential.</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2">Purchase Price (€)</label>
                        <input type="number" value={formData.purchasePrice} onChange={(e) => setFormData({ ...formData, purchasePrice: Number(e.target.value) })}
                          className="w-full bg-stone-50 border-2 border-transparent rounded-2xl px-6 py-5 outline-none focus:ring-2 focus:ring-[#B55D3E] focus:bg-white transition-all text-2xl font-black"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2">Renovation Budget (€)</label>
                        <input type="number" value={formData.renovationCost} onChange={(e) => setFormData({ ...formData, renovationCost: Number(e.target.value) })}
                          className="w-full bg-stone-50 border-2 border-transparent rounded-2xl px-6 py-5 outline-none focus:ring-2 focus:ring-[#B55D3E] focus:bg-white transition-all text-2xl font-black"
                        />
                      </div>
                    </div>

                    <div className="p-10 bg-stone-950 rounded-[40px] text-white flex items-center justify-between border-b-4 border-[#D4A373]">
                         <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-stone-500">Gross Yield (Pre-Tax)</span>
                            <div className="text-5xl font-black text-[#D4A373]">{results.grossYield}%</div>
                         </div>
                         <ArrowUpRight className="size-12 text-[#B55D3E]" />
                    </div>

                    <div className="flex gap-4 pt-6">
                      <button onClick={() => setStep('rent_estimate')} className="btn-secondary px-6 shrink-0"> <ChevronLeft className="size-6" /> </button>
                      <button onClick={() => setStep('net_profit')} className="btn-primary flex-grow group">
                        UNLOCK PREMIUM NET PROFIT ANALYSIS <Lock className="size-4 ml-2 inline group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Gated Stages (Simulation for Phase 1 Frontend) */}
                {['net_profit', 'roi', 'projection'].includes(step) && (
                    <motion.div key="gated" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative h-[500px] flex items-center justify-center overflow-hidden border-2 border-dashed border-stone-200 rounded-[40px]">
                        <div className="absolute inset-0 grayscale blur-xl opacity-30 bg-stone-50 p-12 space-y-12">
                            <div className="h-12 bg-stone-300 rounded-full w-3/4" />
                            <div className="h-4 bg-stone-200 rounded-full w-1/2" />
                            <div className="grid grid-cols-2 gap-8">
                                <div className="h-32 bg-stone-200 rounded-3xl" />
                                <div className="h-32 bg-stone-200 rounded-3xl" />
                            </div>
                        </div>
                        <div className="relative z-10 text-center space-y-8 max-w-sm px-8">
                            <div className="size-20 bg-[#B55D3E] text-white rounded-[32px] flex items-center justify-center mx-auto shadow-2xl shadow-[#B55D3E]/30 mb-8">
                                <ShieldCheck className="size-10" />
                            </div>
                            <h5 className="text-3xl font-black text-stone-900 uppercase leading-[0.95]">Unlock Institutional <br /><span className="text-[#B55D3E]">Net Reports.</span></h5>
                            <p className="text-stone-500 font-bold text-sm italic">Access stage 3, 4, and 5 including the 20-year equity forecast.</p>
                            <Link href="/pricing" className="btn-primary w-full flex items-center justify-center gap-2 !py-5 uppercase text-[10px] tracking-widest">
                                Upgrade Plan <ChevronRight className="size-4" />
                            </Link>
                            <button onClick={() => setStep('gross_yield')} className="text-[10px] font-black text-stone-400 uppercase tracking-widest hover:text-stone-600 transition-colors">
                                Return to Stage 2
                            </button>
                        </div>
                    </motion.div>
                )}
              </AnimatePresence>
          </div>
        </div>

        {/* Right Column: High Fidelity Projection Sidebar */}
        <div className="lg:col-span-5">
            <div className="sticky top-32 space-y-8">
                <div className="bg-stone-950 p-10 lg:p-14 rounded-[56px] text-white shadow-2xl shadow-stone-900/40 relative overflow-hidden">
                    <div className="relative z-10 space-y-10">
                        <div className="flex items-center gap-3">
                            <div className="size-10 bg-[#B55D3E] rounded-xl flex items-center justify-center">
                                <BarChart2 className="size-6 text-white" />
                            </div>
                            <span className="font-black uppercase tracking-widest text-[10px] text-stone-500 underline underline-offset-4 decoration-[#B55D3E]">Live Horizon Engine v4</span>
                        </div>

                        <div className="space-y-3 pb-10 border-b border-white/5">
                            <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Estimated Gross Yield</span>
                            <div className="text-7xl font-black tracking-tighter text-[#D4A373]">
                                {results.grossYield}<span className="text-4xl text-stone-700">%</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-10">
                            <div className="space-y-2">
                                <span className="text-[10px] font-black text-stone-600 uppercase tracking-widest">Net Profit</span>
                                <GatedData><div className="text-3xl font-black text-[#B55D3E]">€{results.profitAfterMortgage.toLocaleString()}</div></GatedData>
                            </div>
                            <div className="space-y-2 text-right">
                                <span className="text-[10px] font-black text-stone-600 uppercase tracking-widest">Horizon ROI</span>
                                <GatedData><div className="text-3xl font-black text-[#D4A373]">{results.cashOnCash}%</div></GatedData>
                            </div>
                        </div>

                        <div className="pt-6 space-y-4">
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className="text-stone-500 uppercase text-[10px] tracking-widest">Total Capital Required</span>
                                <GatedData><span>€{results.totalCapitalNeeded.toLocaleString()}</span></GatedData>
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className="text-stone-500 uppercase text-[10px] tracking-widest">20Y Combined Return</span>
                                <GatedData><span className="text-[#B55D3E] font-black">+{results.combinedReturn}%</span></GatedData>
                            </div>
                        </div>

                        <Link href="/pricing" className="btn-primary w-full !bg-[#FAF9F6] !text-stone-900 uppercase tracking-widest text-[10px] py-6 text-center shadow-2xl group">
                           Unlock Horizon Analysis <ShieldCheck className="size-4 inline ml-2 group-hover:scale-110 transition-transform" />
                        </Link>
                    </div>
                    {/* Interior branding */}
                    <div className="absolute top-0 right-0 size-64 bg-[#B55D3E]/5 rounded-full blur-[80px]" />
                </div>

                <div className="p-10 bg-[#B55D3E]/5 rounded-[40px] border border-[#B55D3E]/10 flex gap-6">
                    <PieChart className="size-10 text-[#B55D3E] shrink-0" />
                    <div>
                        <h6 className="font-black text-stone-900 mb-2 uppercase tracking-tight">Stage Logic Tracking</h6>
                        <p className="text-[10px] font-bold text-stone-500 leading-relaxed uppercase tracking-tighter">
                            Market intensity in <span className="text-[#B55D3E]">{formData.region}</span> remains high for <span className="text-[#B55D3E]">{formData.type}</span> units.
                        </p>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}

