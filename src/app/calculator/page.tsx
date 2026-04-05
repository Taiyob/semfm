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
  Lock
} from 'lucide-react';

type Step = 'property' | 'finance' | 'results';

const regions = [
  { name: 'Lisbon Central', avgRent: 22, color: 'bg-blue-500' },
  { name: 'Porto Downtown', avgRent: 18, color: 'bg-blue-600' },
  { name: 'Algarve Coast', avgRent: 20, color: 'bg-emerald-500' },
  { name: 'Braga University', avgRent: 12, color: 'bg-amber-500' },
  { name: 'Cascais Luxury', avgRent: 28, color: 'bg-indigo-500' },
];

const propertyTypes = [
  { name: 'Studio / T0', icon: Layout },
  { name: '1 Bedroom / T1', icon: Building2 },
  { name: '2 Bedroom / T2', icon: Building2 },
  { name: '3+ Bedroom / T3+', icon: Building2 },
];

export default function CalculatorPage() {
  const [step, setStep] = useState<Step>('property');
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
    const totalInvestment = Number(formData.purchasePrice) + Number(formData.renovationCost);
    const imt = formData.purchasePrice * 0.06;
    const stampDuty = formData.purchasePrice * 0.008;
    const acquisitionCosts = imt + stampDuty + 2000;
    
    const finalTotalCapital = totalInvestment + acquisitionCosts;
    const annualGrossIncome = formData.estimatedRent * 12;
    const expenses = annualGrossIncome * 0.25;
    const annualNetIncome = annualGrossIncome - expenses;
    
    const grossYield = (annualGrossIncome / finalTotalCapital) * 100;
    const netYield = (annualNetIncome / finalTotalCapital) * 100;
    
    return {
      totalInvestment: finalTotalCapital,
      acquisitionCosts,
      annualGrossIncome,
      annualNetIncome,
      grossYield: grossYield.toFixed(2),
      netYield: netYield.toFixed(2),
      monthlyNet: (annualNetIncome / 12).toFixed(0),
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
                Investment Analyzer
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">Calculate Your <span className="gradient-text">Future Yields.</span></h1>
            <p className="text-slate-500 text-lg font-bold">Predict ROI across Western Europe using real-time market data and legal tax modeling.</p>
          </div>

          {/* Stepper Header */}
          <div className="flex items-center gap-4 mb-10">
              <div className={`p-4 rounded-2xl flex items-center gap-3 transition-all ${step === 'property' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'bg-slate-100 text-slate-400 font-bold uppercase tracking-widest text-[10px]'}`}>
                  <span className="text-sm font-black">01</span>
                  {step === 'property' && <span className="font-black text-xs uppercase tracking-widest">Property Details</span>}
              </div>
              <div className="w-10 h-px bg-slate-200" />
              <div className={`p-4 rounded-2xl flex items-center gap-3 transition-all ${step === 'finance' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'bg-slate-100 text-slate-400 font-bold uppercase tracking-widest text-[10px]'}`}>
                  <span className="text-sm font-black">02</span>
                  {step === 'finance' && <span className="font-black text-xs uppercase tracking-widest">Financials</span>}
              </div>
              <div className="w-10 h-px bg-slate-200" />
              <div className={`p-4 rounded-2xl flex items-center gap-3 transition-all ${step === 'results' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'bg-slate-100 text-slate-400 font-bold uppercase tracking-widest text-[10px]'}`}>
                  <span className="text-sm font-black">03</span>
                  {step === 'results' && <span className="font-black text-xs uppercase tracking-widest">Analysis</span>}
              </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[40px] p-8 md:p-12 shadow-2xl shadow-slate-200/50">
              <AnimatePresence mode="wait">
                {step === 'property' && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-10"
                  >
                    <div>
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 block">Select Region/Market</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {regions.map((region) => (
                          <button
                            key={region.name}
                            onClick={() => setFormData({ ...formData, region: region.name })}
                            className={`p-6 rounded-[24px] border-2 transition-all text-left ${
                              formData.region === region.name 
                                ? 'bg-blue-50 border-blue-600 text-blue-600' 
                                : 'bg-slate-50 border-transparent hover:border-slate-200'
                            }`}
                          >
                            <MapPin className="size-5 mb-3" />
                            <span className="block font-black text-sm uppercase tracking-tight">{region.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-400">Area (Sqm)</label>
                          <input
                            type="number"
                            value={formData.size}
                            onChange={(e) => setFormData({ ...formData, size: Number(e.target.value) })}
                            className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-bold text-lg"
                          />
                        </div>
                        <div className="space-y-4">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-400">Monthly Rent (€)</label>
                          <input
                            type="number"
                            value={formData.estimatedRent}
                            onChange={(e) => setFormData({ ...formData, estimatedRent: Number(e.target.value) })}
                            className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-bold text-lg"
                          />
                        </div>
                    </div>

                    <div className="pt-6">
                      <button
                        onClick={() => setStep('finance')}
                        className="btn-primary w-full flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                      >
                        Next: Financial Inputs <ChevronRight className="size-5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 'finance' && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-10"
                  >
                    <div className="grid md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Purchase Price (€)</label>
                        <div className="relative">
                          <Euro className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                          <input
                            type="number"
                            value={formData.purchasePrice}
                            onChange={(e) => setFormData({ ...formData, purchasePrice: Number(e.target.value) })}
                            className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-5 pl-14 pr-6 outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-2xl font-black"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Renovation Cost (€)</label>
                        <div className="relative">
                          <Hammer className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                          <input
                            type="number"
                            value={formData.renovationCost}
                            onChange={(e) => setFormData({ ...formData, renovationCost: Number(e.target.value) })}
                            className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-5 pl-14 pr-6 outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-2xl font-black text-right"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-8 bg-blue-50 border-2 border-blue-100 rounded-[32px] space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <ShieldCheck className="size-5 text-blue-600" />
                            <h4 className="font-extrabold uppercase tracking-widest text-xs text-blue-600">Legal Tax Estimates for 2026</h4>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-slate-400">IMT (Transfer Tax)</span>
                            <span className="text-slate-900">€{(formData.purchasePrice * 0.06).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-slate-400">Stamp Duty (0.8%)</span>
                            <span className="text-slate-900">€{(formData.purchasePrice * 0.008).toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                      <button
                        onClick={() => setStep('property')}
                        className="btn-secondary px-6 shrink-0"
                      >
                        <ChevronLeft className="size-6" />
                      </button>
                      <button
                        onClick={() => setStep('results')}
                        className="btn-primary flex-grow flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                      >
                        Calculate Final Yield <CalcIcon className="size-5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 'results' && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10 space-y-10"
                  >
                    <div className="size-24 bg-blue-600 text-white rounded-[32px] flex items-center justify-center mx-auto shadow-2xl shadow-blue-600/30">
                      <TrendingUp className="size-10" />
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-4xl font-black text-slate-900">Analysis Complete.</h3>
                        <p className="text-slate-500 font-bold text-lg">Your portfolio projection is ready for review based on institutional data.</p>
                    </div>
                    
                    <button
                      onClick={() => setStep('property')}
                      className="text-blue-600 font-black uppercase tracking-widest text-xs hover:underline"
                    >
                      Reset for new market
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Dynamic Projections */}
        <div className="lg:col-span-5">
            <div className={`sticky top-32 transition-all ${step !== 'results' ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
                <div className="bg-slate-900 p-10 lg:p-14 rounded-[48px] text-white shadow-2xl shadow-slate-900/40 relative overflow-hidden">
                    <div className="relative z-10 flex flex-col gap-10">
                        <div className="flex items-center gap-3">
                            <div className="size-10 bg-white/10 rounded-xl flex items-center justify-center">
                                <BarChart2 className="size-6 text-blue-500" />
                            </div>
                            <span className="font-black uppercase tracking-widest text-xs text-slate-400">ROI Projections</span>
                        </div>

                        <div className="space-y-2 pb-10 border-b border-white/10">
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Annual Net Income</span>
                            <div className="text-6xl font-black tracking-tight">€{results.annualNetIncome.toLocaleString()}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-10">
                            <div className="space-y-2">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Net Yield</span>
                                <div className="text-4xl font-black text-emerald-500">{results.netYield}%</div>
                            </div>
                            <div className="space-y-2 text-right">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Monthly Cashflow</span>
                                <div className="text-4xl font-black text-white">€{results.monthlyNet}</div>
                            </div>
                        </div>

                        <div className="pt-6 space-y-6">
                            <div className="flex justify-between text-sm font-bold">
                                <span className="text-slate-500 truncate">Total Capital Investment</span>
                                <span>€{results.totalInvestment.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold">
                                <span className="text-slate-500">Legal/Acquisition Cost</span>
                                <span className="text-blue-500">+€{results.acquisitionCosts.toLocaleString()}</span>
                            </div>
                        </div>

                        <Link href="/pricing" className="btn-primary w-full !bg-white !text-slate-900 uppercase tracking-widest text-[10px] py-4 text-center">
                           Save this Analysis <Lock className="size-4 inline ml-2" />
                        </Link>
                    </div>
                    {/* Background Blur */}
                    <div className="absolute top-0 right-0 size-64 bg-blue-600/10 rounded-full blur-[100px]" />
                </div>

                {/* Insight Message */}
                <div className="mt-8 p-8 bg-blue-50 rounded-[32px] border-2 border-blue-100 flex gap-5">
                    <div className="size-12 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0">
                        <Zap className="size-6 text-white" />
                    </div>
                    <p className="text-sm font-bold text-slate-600 leading-relaxed">
                        Data insight: Properties in <span className="text-blue-600 font-extrabold">{formData.region}</span> are currently outpacing the national average by <span className="text-blue-600 font-extrabold">+2.4%</span> in appreciation. 
                    </p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
