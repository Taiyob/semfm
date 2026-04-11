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
    finishQuality: 'High',
    locationType: 'Central' 
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
    
    // 20 Year Projection Logic with Weighting
    const projection = Array.from({ length: 21 }, (_, year) => {
        const appreciation = Math.pow(1 + (formData.appreciationRate / 100), year);
        const rentIncrease = Math.pow(1.02, year); // 2% standard rent increase
        return {
            year,
            value: (totalPurchase * appreciation) * (formData.weighting / 100) + (totalPurchase * (1 - formData.weighting / 100)),
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
                Hofman Analytics v2.5
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-stone-900 leading-[0.9] uppercase tracking-tighter">Master Your <span className="gradient-text">Investment Horizon.</span></h1>
            <p className="text-stone-500 text-lg font-bold italic">“Transparent data for intelligent European real estate decisions.”</p>
          </div>

          {/* 5-Stage Progress Bar */}
          <div className="flex items-center gap-2 mb-14 overflow-x-auto pb-4 no-scrollbar">
              {steps.map((s, i) => (
                <div key={s.id} className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={() => setStep(s.id)}
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

                    <div className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest ml-2">Property Street Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-[#B55D3E]" />
                                <input 
                                    type="text" 
                                    placeholder="e.g. Avenida da Liberdade 120" 
                                    className="w-full bg-stone-50 rounded-2xl p-5 pl-14 font-black text-lg outline-none border-2 border-transparent focus:border-[#B55D3E] transition-all" 
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-white rounded-lg border border-stone-100 text-[8px] font-black text-stone-400 uppercase tracking-widest">
                                    Neighborhood: {formData.region.split(' ')[0]}
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest ml-2">Property Size (sqm)</label>
                                <input type="number" value={formData.size} onChange={(e) => setFormData({ ...formData, size: Number(e.target.value) })} className="w-full bg-stone-50 rounded-2xl p-5 font-black text-xl outline-none border-2 border-transparent focus:border-[#B55D3E]" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest ml-2">Expected Market Rent (€/mo)</label>
                                <input type="number" value={formData.estimatedRent} onChange={(e) => setFormData({ ...formData, estimatedRent: Number(e.target.value) })} className="w-full bg-stone-50 rounded-2xl p-5 font-black text-xl outline-none border-2 border-transparent focus:border-[#B55D3E]" />
                            </div>
                        </div>
                    </div>


                    {mode === 'advanced' && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="space-y-8 pt-4 border-t border-stone-50">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest">Year Built</label>
                                    <input type="number" value={formData.yearBuilt} onChange={(e) => setFormData({...formData, yearBuilt: Number(e.target.value)})} className="w-full bg-stone-50 rounded-2xl p-5 font-black outline-none border-2 border-transparent focus:border-[#B55D3E]" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest">Energy Label</label>
                                    <div className="flex gap-2">
                                        {['A', 'B', 'C', 'D'].map(label => (
                                            <button key={label} onClick={() => setFormData({...formData, energyLabel: label})} className={`flex-grow py-4 rounded-xl font-black transition-all ${formData.energyLabel === label ? 'bg-[#D4A373] text-white shadow-lg' : 'bg-stone-50 text-stone-400'}`}>
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3 font-bold">
                                    <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest">Location Type</label>
                                    <div className="flex gap-2 p-1 bg-stone-50 rounded-xl">
                                        {['Central', 'Semi', 'Suburban'].map(lt => (
                                            <button key={lt} onClick={() => setFormData({...formData, locationType: lt})} className={`flex-grow py-3 rounded-lg text-[9px] font-black uppercase tracking-tight transition-all ${formData.locationType === lt ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400'}`}>
                                                {lt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-5 bg-stone-50 rounded-2xl">
                                    <input type="checkbox" id="parking" checked={formData.hasParking} onChange={(e) => setFormData({...formData, hasParking: e.target.checked})} className="size-5 accent-[#B55D3E]" />
                                    <label htmlFor="parking" className="text-sm font-black text-stone-900 uppercase">Includes Parking Space</label>
                                </div>
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

                {/* Gated Stages with Specialized Interactivity */}
                {step === 'net_profit' && (
                    <motion.div key="net_profit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative h-[650px] flex items-center justify-center overflow-hidden border-2 border-stone-100 rounded-[48px]">
                        <div className="absolute inset-0 grayscale blur-2xl opacity-40 bg-stone-50 p-12 space-y-12 select-none pointer-events-none">
                             <h4 className="text-2xl font-black text-stone-900 border-b-2 border-stone-200 pb-4">NET INCOME BREAKDOWN</h4>
                             <div className="space-y-6">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-stone-100">
                                        <div className="w-1/3 h-4 bg-stone-200 rounded-full" />
                                        <div className="w-1/4 h-4 bg-stone-300 rounded-full" />
                                    </div>
                                ))}
                             </div>
                             <div className="h-32 bg-stone-900 rounded-3xl" />
                        </div>
                        <StageGate title="Unlock Net Profit Report" subtitle="Includes Mortgage Interest, Tax Overheads & OPEX." />
                    </motion.div>
                )}

                {step === 'roi' && (
                    <motion.div key="roi" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative h-[650px] flex items-center justify-center overflow-hidden border-2 border-stone-100 rounded-[48px]">
                        <div className="absolute inset-0 grayscale blur-2xl opacity-40 bg-stone-50 p-12 flex flex-col items-center justify-center gap-12 select-none pointer-events-none">
                             <div className="size-64 rounded-full border-[20px] border-stone-200 flex items-center justify-center">
                                 <div className="size-32 rounded-full bg-stone-100" />
                             </div>
                             <div className="grid grid-cols-2 gap-4 w-full">
                                 <div className="h-20 bg-stone-100 rounded-2xl" />
                                 <div className="h-20 bg-stone-100 rounded-2xl" />
                             </div>
                        </div>
                        <StageGate title="Cash-on-Cash ROI" subtitle="Full leverage modeling and capital return metrics." />
                    </motion.div>
                )}

                {step === 'projection' && (
                    <motion.div key="projection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative overflow-hidden border-2 border-stone-100 rounded-[48px] bg-white">
                        <div className="p-8 md:p-12 space-y-10 group/gate">
                            <div className="flex justify-between items-center pb-6 border-b border-stone-100">
                                <div>
                                    <h4 className="text-xl font-black text-stone-900 uppercase">Future-Ready Investment Analysis</h4>
                                    <p className="text-stone-500 text-xs font-bold uppercase tracking-widest mt-1">Project your investment over 20 years.</p>
                                </div>
                                <Calendar className="size-6 text-[#B55D3E]" />
                            </div>

                            {/* Stage 5 Specialized Inputs (Even if Blurred) */}
                            <div className="grid md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-black uppercase text-stone-900 tracking-widest">Yearly Appreciation (%)</label>
                                            <span className="text-sm font-black text-[#B55D3E]">{formData.appreciationRate}%</span>
                                        </div>
                                        <input type="range" min="0" max="15" step="0.5" value={formData.appreciationRate} onChange={(e) => setFormData({...formData, appreciationRate: Number(e.target.value)})} className="w-full accent-[#B55D3E] cursor-pointer" />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-black uppercase text-stone-900 tracking-widest">Growth Weighting</label>
                                            <span className="text-sm font-black text-stone-400">{formData.weighting}%</span>
                                        </div>
                                        <input type="range" min="0" max="100" value={formData.weighting} onChange={(e) => setFormData({...formData, weighting: Number(e.target.value)})} className="w-full accent-stone-300" />
                                        <p className="text-[9px] font-bold text-stone-400 uppercase tracking-tight">“How much weight should appreciation have in total return?”</p>
                                    </div>
                                </div>
                                
                                <div className="p-6 bg-stone-50 rounded-3xl border border-stone-100 space-y-4">
                                    <div className="flex items-center gap-3 text-stone-900 font-black text-[10px] uppercase tracking-widest">
                                        <Info className="size-4 text-[#D4A373]" /> Valuation Logic
                                    </div>
                                    <p className="text-xs font-bold text-stone-500 leading-relaxed italic">
                                        Appreciation is less predictable based on market sentiment, while rental yield remains the stable core of long-term ROI.
                                    </p>
                                </div>
                            </div>

                            {/* Chart Placeholder (Blurred) */}
                            <div className="relative h-64 bg-stone-50 rounded-3xl border border-stone-100 flex items-end p-6 gap-2 overflow-hidden blur-[4px] opacity-40 grayscale group-hover/gate:blur-[8px] transition-all">
                                {Array(20).fill(0).map((_, i) => (
                                    <div key={i} className="flex-grow bg-stone-300 rounded-t-lg" style={{ height: `${20 + (i * 4)}%` }} />
                                ))}
                            </div>

                            <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-white via-white/40 to-transparent flex items-center justify-center">
                                <StageGate title="Unlock 20-Year Analysis" subtitle="Combined ROI, Value Growth & Equity Forecast." overlay={false} />
                            </div>
                        </div>
                    </motion.div>
                )}
              </AnimatePresence>
          </div>
        </div>

        {/* Right Column: High Fidelity Projection Sidebar */}
        <div className="lg:col-span-5">
            <div className="sticky top-32 space-y-8">
                <div className="bg-stone-950 p-10 lg:p-14 rounded-[56px] text-white shadow-2xl shadow-stone-900/40 relative overflow-hidden h-full">
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

                        <Link href="/pricing" className="block w-full text-center">
                            <button className="btn-primary w-full !bg-[#FAF9F6] !text-stone-900 uppercase tracking-widest text-[10px] py-6 shadow-2xl group relative overflow-hidden">
                                <span className="relative z-10 flex items-center justify-center gap-2">Unlock Horizon Analysis <ShieldCheck className="size-4 group-hover:scale-110 transition-transform" /></span>
                            </button>
                        </Link>
                    </div>
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

function StageGate({ title, subtitle, overlay = true }: { title: string; subtitle: string; overlay?: boolean }) {
    return (
        <div className={`${overlay ? 'relative z-10' : ''} text-center space-y-6 max-w-sm px-8`}>
            <div className="size-16 bg-[#B55D3E] text-white rounded-[24px] flex items-center justify-center mx-auto shadow-2xl shadow-[#B55D3E]/30 mb-6">
                <ShieldCheck className="size-8" />
            </div>
            <h5 className="text-2xl font-black text-stone-900 uppercase tracking-tight leading-none">{title}</h5>
            <p className="text-stone-500 font-bold text-xs italic">{subtitle}</p>
            <Link href="/pricing" className="btn-primary w-full flex items-center justify-center gap-2 !py-4 uppercase text-[9px] tracking-[0.2em]">
                Unlock Full Analysis <Sparkles className="size-3" />
            </Link>
        </div>
    );
}


