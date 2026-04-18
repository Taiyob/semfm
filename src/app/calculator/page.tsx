'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
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
import { calculateResidentialIMT, calculateAcquisitionBreakdown } from '@/lib/calculations';

type Step = 'rent_estimate' | 'gross_yield' | 'net_profit' | 'roi' | 'projection';
type Mode = 'simple' | 'advanced';

const regions = [
  { name: 'Lisbon Central', avgRent: 22, color: 'bg-stone-500' },
  { name: 'Porto Downtown', avgRent: 18, color: 'bg-stone-600' },
  { name: 'Algarve Coast', avgRent: 20, color: 'bg-[#D4A373]' },
  { name: 'Braga University', avgRent: 12, color: 'bg-[#34495E]' },
  { name: 'Cascais Luxury', avgRent: 28, color: 'bg-stone-900' },
];

export default function CalculatorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Analytics...</div>}>
      <CalculatorContent />
    </Suspense>
  );
}

function CalculatorContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>('rent_estimate');
  const [mode, setMode] = useState<Mode>('simple');
  const [formData, setFormData] = useState({
    country: 'Portugal',
    region: 'Lisbon Central',
    areaType: 'Centre',
    size: 60,
    bedrooms: 1,
    purchasePrice: 350000,
    renovationCost: 20000,
    estimatedRent: 1500,
    includeMortgage: true,
    loanPercentage: 70,
    interestRate: 3.5,
    appreciationRate: 6,
    weighting: 50,
    // Phase 2 Logic
    isRental: true,
    rentConditionsMet: true,
    contractDuration: 36,
    listedAfter6Months: true,
    // Advanced fields
    yearBuilt: 2020,
    propertyCondition: 'Standard',
    outdoorSpace: 'None',
    energyLabel: 'A',
    hasParking: false,
    hasElevator: 'no',
  });

  useEffect(() => {
    const price = searchParams.get('price');
    const rent = searchParams.get('rent');
    const location = searchParams.get('location');
    const beds = searchParams.get('beds');
    const sqm = searchParams.get('sqm');

    if (price || rent || location) {
      setFormData(prev => ({
        ...prev,
        purchasePrice: price ? Number(price) : prev.purchasePrice,
        estimatedRent: rent ? Number(rent) : prev.estimatedRent,
        bedrooms: beds ? Number(beds) : prev.bedrooms,
        size: sqm ? Number(sqm) : prev.size,
      }));
      setStep('gross_yield'); // Jump to financials if pre-filled
    }
  }, [searchParams]);


  const results = useMemo(() => {
    const totalPurchase = Number(formData.purchasePrice) + Number(formData.renovationCost);
    
    // Determine Scenario
    let scenario: 'investor' | 'resident' | 'exemption' = 'investor';
    if (formData.isRental) {
        const meetsPrice = formData.estimatedRent <= 2300;
        const meetsDuration = formData.contractDuration >= 36;
        if (meetsPrice && meetsDuration && formData.listedAfter6Months && formData.rentConditionsMet) {
            scenario = 'exemption';
        } else {
            scenario = 'investor';
        }
    } else {
        scenario = 'resident';
    }

    const breakdown = calculateAcquisitionBreakdown(formData.purchasePrice, scenario);
    const { totalCosts, acquisitionCosts } = { 
        totalCosts: breakdown.totalCosts, 
        acquisitionCosts: breakdown.imt + breakdown.stampDuty + breakdown.legalFees + breakdown.notaryFees 
    };

    const totalCapitalNeeded = Number(formData.purchasePrice) + Number(formData.renovationCost) + totalCosts;
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
      imt: breakdown.imt,
      scenario,
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
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 font-montserrat bg-white min-h-screen">
      <div className="grid lg:grid-cols-12 gap-16">
        
        {/* Left Column: Input Form */}
        <div className="lg:col-span-7">
          <div className="flex flex-col gap-6 mb-16">
            <div className="section-tag w-fit">
                <CalcIcon className="size-4" />
                Hofman Analytics v2.5
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-[#2C3E50] leading-[0.95] tracking-tight">Master your investment horizon</h1>
            <p className="text-stone-500 text-lg font-bold italic">“Transparent data for intelligent European real estate decisions.”</p>
          </div>

          {/* 5-Stage Progress Bar */}
          <div className="flex items-center gap-2 mb-14 overflow-x-auto pb-4 no-scrollbar">
              {steps.map((s, i) => (
                <div key={s.id} className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={() => setStep(s.id)}
                    className={cn(
                      "p-4 rounded-2xl flex items-center gap-3 transition-all",
                      step === s.id ? "bg-[#D4A373] text-white shadow-xl shadow-[#D4A373]/20" : "bg-stone-50 text-stone-400 border border-stone-100"
                    )}
                  >
                      <span className="text-xs font-black">0{i+1}</span>
                      {step === s.id && <span className="font-black text-[10px] tracking-tight whitespace-nowrap">{s.label}</span>}
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
                      <button onClick={() => setMode('simple')} className={`px-4 py-2 rounded-lg text-[10px] font-black tracking-tight transition-all ${mode === 'simple' ? 'bg-white text-[#34495E] shadow-sm' : 'text-stone-400'}`}>Simple</button>
                      <button onClick={() => setMode('advanced')} className={`px-4 py-2 rounded-lg text-[10px] font-black tracking-tight transition-all ${mode === 'advanced' ? 'bg-white text-[#34495E] shadow-sm' : 'text-stone-400'}`}>Advanced</button>
                  </div>
              </div>

              <AnimatePresence mode="wait">
                {step === 'rent_estimate' && (
                  <motion.div key="step-1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                    <div>
                      <h4 className="text-xl font-black text-stone-900 mb-2 tracking-tight">Stage 1: Location & rent estimate</h4>
                      <p className="text-stone-500 text-sm font-bold flex items-center gap-2 italic"><Sparkles className="size-4 text-[#D4A373]" /> Estimate your rental income first.</p>
                    </div>

                    <div className="space-y-6">
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-stone-400 ml-2">Country</label>
                                <select value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} className="w-full bg-stone-50 rounded-2xl p-4 font-black outline-none border-2 border-transparent focus:border-[#34495E]">
                                    <option value="Portugal">Portugal</option>
                                    <option value="Spain">Spain</option>
                                    <option value="Greece">Greece</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-stone-400 ml-2">Region</label>
                                <select value={formData.region} onChange={(e) => setFormData({...formData, region: e.target.value})} className="w-full bg-stone-50 rounded-2xl p-4 font-black outline-none border-2 border-transparent focus:border-[#34495E]">
                                    {regions.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-stone-400 ml-2 uppercase tracking-widest">Area Type</label>
                                <select 
                                  value={formData.areaType} 
                                  onChange={(e) => setFormData({...formData, areaType: e.target.value})} 
                                  className="w-full bg-stone-50 rounded-2xl p-4 font-black outline-none border-2 border-stone-100 focus:border-[#D4A373] transition-colors"
                                >
                                    <option value="Centre">Centre</option>
                                    <option value="Semi-Centre">Semi-Centre</option>
                                    <option value="Outside Centre">Outside Centre</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-stone-400 ml-2">Number of bedrooms</label>
                                <input type="number" value={formData.bedrooms} onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })} className="w-full bg-stone-50 rounded-2xl p-5 font-black text-xl outline-none border-2 border-transparent focus:border-[#34495E]" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-stone-400 ml-2">Property size (sqm)</label>
                                <input type="number" value={formData.size} onChange={(e) => setFormData({ ...formData, size: Number(e.target.value) })} className="w-full bg-stone-50 rounded-2xl p-5 font-black text-xl outline-none border-2 border-transparent focus:border-[#34495E]" />
                            </div>
                        </div>
                    </div>


                    {mode === 'advanced' && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="space-y-8 pt-4 border-t border-stone-50">
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-stone-400 ml-2">Year built</label>
                                    <input type="number" value={formData.yearBuilt} onChange={(e) => setFormData({...formData, yearBuilt: Number(e.target.value)})} className="w-full bg-stone-50 rounded-2xl p-4 font-black outline-none border-2 border-transparent focus:border-[#34495E]" />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-stone-400 ml-2 uppercase tracking-widest">Property Condition</label>
                                    <select value={formData.propertyCondition} onChange={(e) => setFormData({...formData, propertyCondition: e.target.value})} className="w-full bg-stone-50 rounded-2xl p-4 font-black outline-none border-2 border-stone-100 focus:border-[#D4A373] transition-colors">
                                        {['In need of renovation', 'Outdated', 'Basic', 'Standard', 'Good', 'Premium', 'High-End'].map(opt => (
                                          <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-stone-400 ml-2 uppercase tracking-widest">Outdoor Space</label>
                                    <select value={formData.outdoorSpace} onChange={(e) => setFormData({...formData, outdoorSpace: e.target.value})} className="w-full bg-stone-50 rounded-2xl p-4 font-black outline-none border-2 border-stone-100 focus:border-[#D4A373] transition-colors">
                                        {['None', 'Balcony', 'Garden'].map(opt => (
                                          <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-stone-400 ml-2 uppercase tracking-widest">Energy label</label>
                                    <select value={formData.energyLabel} onChange={(e) => setFormData({...formData, energyLabel: e.target.value})} className="w-full bg-stone-50 rounded-2xl p-4 font-black outline-none border-2 border-stone-100 focus:border-[#D4A373] transition-colors">
                                        {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-100 group cursor-pointer hover:border-[#D4A373]/30 transition-colors">
                                    <input type="checkbox" id="parking" checked={formData.hasParking} onChange={(e) => setFormData({...formData, hasParking: e.target.checked})} className="size-5 accent-[#D4A373] cursor-pointer" />
                                    <label htmlFor="parking" className="text-xs font-bold text-stone-900 cursor-pointer">Parking Included</label>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-stone-400 ml-2 uppercase tracking-widest">Elevator</label>
                                    <select value={formData.hasElevator} onChange={(e) => setFormData({...formData, hasElevator: e.target.value})} className="w-full bg-stone-50 rounded-2xl p-4 font-black outline-none border-2 border-stone-100 focus:border-[#D4A373] transition-colors">
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                        <option value="not_applicable">Not applicable</option>
                                    </select>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <button onClick={() => setStep('gross_yield')} className="btn-primary w-full flex items-center justify-center gap-3 py-6 group">
                      Continue to financials <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </motion.div>
                )}


                {step === 'gross_yield' && (
                  <motion.div key="step-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                    <div>
                        <h4 className="text-xl font-black text-stone-900 mb-2 tracking-tight uppercase">Stage 2: Acquisition & Yield Logic</h4>
                        <p className="text-stone-500 text-xs font-bold italic uppercase tracking-widest leading-relaxed">Tax + Cost Decision Engine: Calculate market entry accurately.</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#D4A373] ml-2">Purchase Price (€)</label>
                        <input type="number" value={formData.purchasePrice} onChange={(e) => setFormData({ ...formData, purchasePrice: Number(e.target.value) })}
                          className="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl px-6 py-5 outline-none focus:border-[#D4A373] focus:bg-white transition-all text-2xl font-black"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#D4A373] ml-2">Renovation Costs (€)</label>
                        <input type="number" value={formData.renovationCost} onChange={(e) => setFormData({ ...formData, renovationCost: Number(e.target.value) })}
                          className="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl px-6 py-5 outline-none focus:border-[#D4A373] focus:bg-white transition-all text-2xl font-black"
                          placeholder="Mandatory entry"
                        />
                      </div>
                    </div>

                    <div className="p-8 bg-stone-50 rounded-[32px] border border-stone-100 space-y-8">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 block mb-4">IMT Logic Decision</span>
                            <div className="flex flex-col gap-4">
                                <label className="text-sm font-black text-[#2C3E50]">Are you going to rent out the property?</label>
                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => setFormData({...formData, isRental: true})}
                                        className={cn(
                                            "flex-1 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest border-2 transition-all",
                                            formData.isRental ? "bg-[#2C3E50] text-white border-[#2C3E50]" : "bg-white text-stone-400 border-stone-100"
                                        )}
                                    >Yes</button>
                                    <button 
                                        onClick={() => setFormData({...formData, isRental: false})}
                                        className={cn(
                                            "flex-1 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest border-2 transition-all",
                                            !formData.isRental ? "bg-[#2C3E50] text-white border-[#2C3E50]" : "bg-white text-stone-400 border-stone-100"
                                        )}
                                    >No</button>
                                </div>
                            </div>
                        </div>

                        {formData.isRental ? (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-6 pt-6 border-t border-stone-200/50">
                                <h5 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#D4A373]">Rental Exemption Pathway</h5>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-white border border-[#D4A373]/20 rounded-2xl">
                                        <input type="checkbox" checked={formData.estimatedRent <= 2300} readOnly className="size-5 accent-[#D4A373]" />
                                        <label className="text-xs font-bold text-stone-900 leading-tight">Rental price ≤ €2,300/month (Auto-calculated)</label>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-white border border-stone-100 rounded-2xl group cursor-pointer" onClick={() => setFormData({...formData, rentConditionsMet: !formData.rentConditionsMet})}>
                                        <input type="checkbox" checked={formData.rentConditionsMet} readOnly className="size-5 accent-[#2C3E50]" />
                                        <label className="text-xs font-bold text-stone-900 leading-tight cursor-pointer">36-month minimum rental contract</label>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-white border border-stone-100 rounded-2xl">
                                        <input type="checkbox" checked={formData.listedAfter6Months} readOnly className="size-5 accent-[#2C3E50]" />
                                        <label className="text-xs font-bold text-stone-900 leading-tight">Property listed within 6 months of purchase</label>
                                    </div>
                                </div>
                                {results.scenario === 'exemption' ? (
                                    <div className="p-4 bg-[#D4A373]/10 text-[#D4A373] rounded-xl text-[10px] font-black uppercase tracking-widest text-center">
                                        Strategic Optimization Applied: 0% IMT EXEMPTION
                                    </div>
                                ) : (
                                    <div className="p-4 bg-stone-100 text-stone-400 rounded-xl text-[10px] font-black uppercase tracking-widest text-center">
                                        Standard Investor Rate Applied: 7.5% FLAT IMT
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-6 pt-6 border-t border-stone-200/50">
                                <h5 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#2C3E50]">Resident Progressive Tax Table</h5>
                                <div className="overflow-hidden rounded-2xl border border-stone-100">
                                    <table className="w-full text-[10px] font-bold text-left bg-white">
                                        <thead className="bg-stone-50 border-b border-stone-100 font-black uppercase tracking-widest">
                                            <tr>
                                                <th className="p-3">Bracket (€)</th>
                                                <th className="p-3">Rate</th>
                                                <th className="p-3">Deduction</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-stone-50">
                                            {[
                                                { b: 'Up to 106,346', r: '0%', d: '€0' },
                                                { b: '106,346 - 145,470', r: '2%', d: '€2,126' },
                                                { b: '145,470 - 198,347', r: '5%', d: '€4,491' },
                                                { b: '198,347 - 330,539', r: '7%', d: '€8,492' },
                                                { b: '330,539 - 660,982', r: '8%', d: '€11,798' },
                                            ].map((row, i) => (
                                                <tr key={i} className="hover:bg-stone-50 transition-colors">
                                                    <td className="p-3">{row.b}</td>
                                                    <td className="p-3 text-[#D4A373]">{row.r}</td>
                                                    <td className="p-3 text-stone-400">{row.d}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    <div className="p-10 bg-white border border-stone-100 rounded-[40px] flex items-center justify-between shadow-2xl shadow-stone-200/40">
                         <div className="space-y-2">
                            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-stone-400">Total Phase 1 Cost (Inc. Tax)</span>
                            <div className="text-5xl font-black text-[#2C3E50]">€{results.totalCapitalNeeded.toLocaleString()}</div>
                         </div>
                         <div className="text-right">
                             <div className="text-[10px] font-black text-[#D4A373] uppercase tracking-widest">IMT: €{results.imt.toLocaleString()}</div>
                             <ArrowUpRight className="size-8 text-stone-100" />
                         </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                      <button onClick={() => setStep('rent_estimate')} className="btn-secondary px-6 shrink-0"> <ChevronLeft className="size-6" /> </button>
                      <button onClick={() => setStep('net_profit')} className="btn-primary flex-grow group !bg-[#34495E]">
                        Analyze Net Cash Flow Logic <Lock className="size-4 ml-2 inline group-hover:scale-110 transition-transform" />
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
                                    <h4 className="text-xl font-black text-stone-900">Future-ready investment analysis</h4>
                                    <p className="text-stone-500 text-xs font-bold tracking-tight mt-1">Project your investment over 20 years.</p>
                                </div>
                                <Calendar className="size-6 text-[#34495E]" />
                            </div>

                            {/* Stage 5 Specialized Inputs (Even if Blurred) */}
                            <div className="grid md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-black text-stone-900 tracking-tight">Yearly appreciation (%)</label>
                                            <span className="text-sm font-black text-[#34495E]">{formData.appreciationRate}%</span>
                                        </div>
                                        <input type="range" min="0" max="15" step="0.5" value={formData.appreciationRate} onChange={(e) => setFormData({...formData, appreciationRate: Number(e.target.value)})} className="w-full accent-[#34495E] cursor-pointer" />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-black text-stone-900 tracking-tight">Growth weighting</label>
                                            <span className="text-sm font-black text-stone-400">{formData.weighting}%</span>
                                        </div>
                                        <input type="range" min="0" max="100" value={formData.weighting} onChange={(e) => setFormData({...formData, weighting: Number(e.target.value)})} className="w-full accent-stone-300" />
                                        <p className="text-[9px] font-bold text-stone-400 tracking-tight">“How much weight should appreciation have in total return?”</p>
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

        <div className="lg:col-span-5">
            <div className="sticky top-32 space-y-8">
                <div className="bg-white p-10 lg:p-14 rounded-[56px] text-[#2C3E50] border border-stone-100 shadow-2xl shadow-stone-200/50 relative overflow-hidden h-full flex flex-col gap-10">
                    <div className="relative z-10 space-y-8 flex-grow">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="size-10 bg-[#D4A373] rounded-xl flex items-center justify-center">
                                    <BarChart2 className="size-6 text-white" />
                                </div>
                                <span className="font-black tracking-tight text-[10px] text-stone-400 uppercase tracking-widest">Investment Intelligence</span>
                            </div>
                            <div className="px-3 py-1 bg-stone-50 rounded-lg border border-stone-100 text-[8px] font-black uppercase text-stone-400 tracking-tighter">v4.2 Engine</div>
                        </div>

                        <div className="space-y-6">
                            {/* Phase 1: Rent */}
                            <div className="p-6 rounded-3xl bg-stone-50/50 border border-stone-100/50 transition-all">
                                <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest block mb-2">Phase 1: Rent Estimate</span>
                                <div className="text-4xl font-black tracking-tighter text-[#2C3E50]">
                                    €{formData.estimatedRent}<span className="text-lg text-stone-300 ml-2">/mo</span>
                                </div>
                            </div>

                            {/* Phase 2: Yield */}
                            <div className={cn(
                                "p-6 rounded-3xl transition-all border",
                                (step === 'gross_yield' || step === 'net_profit' || step === 'roi' || step === 'projection') 
                                    ? "bg-white border-[#D4A373]/20 shadow-lg shadow-[#D4A373]/5" 
                                    : "bg-stone-50/30 border-transparent opacity-50"
                            )}>
                                <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest block mb-2">Phase 2: Gross Yield</span>
                                <div className={cn(
                                    "text-4xl font-black tracking-tighter",
                                    (step === 'gross_yield' || step === 'net_profit' || step === 'roi' || step === 'projection') ? "text-[#D4A373]" : "text-stone-300"
                                )}>
                                    {results.grossYield}<span className="text-lg text-stone-200 ml-2">%</span>
                                </div>
                            </div>

                            {/* Phase 3: Net Profit (Locked) */}
                            <div className="p-6 rounded-3xl bg-stone-50/30 border border-transparent relative overflow-hidden group/lock">
                                <div className="blur-sm opacity-30 select-none space-y-2">
                                    <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest block">Phase 3: Net Profit</span>
                                    <div className="text-4xl font-black tracking-tighter text-stone-400">€1,142<span className="text-lg ml-2">/mo</span></div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-white/10">
                                    <Lock className="size-4 text-[#D4A373]" />
                                    <span className="text-[10px] font-black text-[#2C3E50] uppercase tracking-widest">Institutional</span>
                                </div>
                            </div>

                            {/* Phase 4: Cash ROI (Locked) */}
                            <div className="p-6 rounded-3xl bg-stone-50/30 border border-transparent relative overflow-hidden group/lock">
                                <div className="blur-sm opacity-30 select-none space-y-2">
                                    <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest block">Phase 4: Cash-on-Cash ROI</span>
                                    <div className="text-4xl font-black tracking-tighter text-stone-400">8.4<span className="text-lg ml-2">%</span></div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-white/10">
                                    <Lock className="size-4 text-[#D4A373]" />
                                    <span className="text-[10px] font-black text-[#2C3E50] uppercase tracking-widest">Institutional</span>
                                </div>
                            </div>

                            {/* Phase 5: Forecast (Locked) */}
                            <div className="p-6 rounded-3xl bg-stone-50/30 border border-transparent relative overflow-hidden group/lock">
                                <div className="blur-sm opacity-30 select-none space-y-2">
                                    <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest block">Phase 5: 20Y Forecast</span>
                                    <div className="text-4xl font-black tracking-tighter text-stone-400">+245<span className="text-lg ml-2">%</span></div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-white/10">
                                    <Lock className="size-4 text-[#D4A373]" />
                                    <span className="text-[10px] font-black text-[#2C3E50] uppercase tracking-widest">Institutional</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Link href="/pricing" className="block w-full">
                            <button className="w-full py-7 bg-[#2C3E50] text-white font-black rounded-[24px] hover:bg-[#D4A373] transition-all tracking-[0.2em] text-[11px] uppercase shadow-2xl shadow-[#2C3E50]/20 flex items-center justify-center gap-3 group">
                                <Sparkles className="size-4 group-hover:scale-110 transition-transform text-[#D4A373]" />
                                Unlock All Data
                            </button>
                        </Link>
                        <p className="text-center text-[9px] font-bold text-stone-400 uppercase tracking-widest">Verified Institutional Analytics</p>
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
            <div className="size-16 bg-[#34495E] text-white rounded-[24px] flex items-center justify-center mx-auto shadow-2xl shadow-[#34495E]/30 mb-6">
                <ShieldCheck className="size-8" />
            </div>
            <h5 className="text-2xl font-black text-stone-900 leading-none">{title}</h5>
            <p className="text-stone-500 font-bold text-xs italic">{subtitle}</p>
            <Link href="/pricing" className="btn-primary w-full flex items-center justify-center gap-2 !py-4 text-[11px] tracking-tight">
                Unlock full analysis <Sparkles className="size-3" />
            </Link>
        </div>
    );
}



