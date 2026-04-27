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
  PieChart,
  Settings2,
  Calendar,
  Layers,
  Sparkles,
  ArrowUpRight,
  ChevronDown,
  Pencil
} from 'lucide-react';
import { GatedData } from '@/components/gated-data';
import { calculateResidentialIMT, calculateAcquisitionBreakdown } from '@/lib/calculations';

type Step = 'rent_estimate' | 'gross_yield' | 'net_profit' | 'roi' | 'projection';
type Mode = 'simple' | 'advanced';

const portugalRegions = [
  { name: 'Lisbon', avgRent: 22, color: 'bg-stone-500' },
  { name: 'Porto', avgRent: 18, color: 'bg-stone-600' },
  { name: 'Braga', avgRent: 12, color: 'bg-[#34495E]' },
  { name: 'Faro', avgRent: 20, color: 'bg-[#D4A373]' },
];

const spainRegions = [
  { name: 'Valencia', avgRent: 18, color: 'bg-stone-500' },
  { name: 'Alicante', avgRent: 15, color: 'bg-stone-600' },
  { name: 'Málaga', avgRent: 17, color: 'bg-[#34495E]' },
  { name: 'Las Palmas (Gran Canaria)', avgRent: 14, color: 'bg-[#D4A373]' },
];

const TOOLTIP_CONTENT = {
  grossYield: "Gross yield is the annual rental income divided by the total acquisition cost (purchase price + taxes + fees).",
  netYield: "Net yield on cost accounts for all operating expenses and acquisition costs, providing a more realistic return estimate.",
  noi: "Net Operating Income (NOI) is your annual rental income minus all operating expenses, before mortgage payments.",
  netProfit: "Estimated Net Annual Profit is your final take-home income after all expenses and mortgage costs.",
  cashOnCash: "Annual return based only on the actual cash you invested (equity), rather than the total property value.",
  roe: "Total Return on Equity includes net profit, principal repayment, and property appreciation.",
  equityGrowth: "The annual increase in your wealth through mortgage principal reduction and property value appreciation.",
  loanToTac: "The percentage of the Total Acquisition Cost (TAC) that is financed through a loan.",
  irr: "Internal Rate of Return (IRR) is a metric used to estimate the profitability of potential investments over time.",
  tac: "TAC (Total Acquisition Costs) include purchase price, renovation, taxes, and all legal/notary fees."
};

export default function CalculatorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Analytics...</div>}>
      <CalculatorContent />
    </Suspense>
  );
}

function CalculatorContent() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<Step>('rent_estimate');

  useEffect(() => {
    setMounted(true);
  }, []);
  const [mode, setMode] = useState<Mode>('simple');
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showCalculationDetails, setShowCalculationDetails] = useState(false);
  const [showOpexBreakdown, setShowOpexBreakdown] = useState(false);
  const [editingOpex, setEditingOpex] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    country: 'Portugal',
    region: 'Lisbon',
    areaType: 'Centre',
    size: 60,
    bedrooms: 1,
    purchasePrice: 350000,
    renovationCost: 20000,
    estimatedRent: 1500,
    includeMortgage: false,
    loanPercentage: 70,
    interestRate: 3.5,
    appreciationRate: 6,
    // Phase 2 Logic
    isRental: true,
    propertyType: 'resale' as 'resale' | 'new_build',
    rentConditionsMet: true,
    contractDuration: 36,
    listedAfter6Months: true,
    // Phase 3 - Net Cash Flow Analysis
    vacancyRate: 4,
    maintenanceRate: 10,
    capexRate: 3,
    insuranceRate: 1.5,
    propertyTaxRate: 8,
    condoFeeRate: 7,
    managementFeeRate: 10,
    adminRate: 1,
    downPayment: 105000,
    includePrincipal: false,
    mortgageTerm: 25,
    // Phase 4 & 5
    includeAppreciationROI: false,
    includePrincipalROI: false,
    rentGrowthRate: 2,
    timeHorizon: 20,
    includeMortgagePayoff: false,
    showProjectionBreakdown: false,
    opexOverrides: {} as Record<string, number | null>,
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

    const breakdown = calculateAcquisitionBreakdown(
      formData.purchasePrice, 
      scenario, 
      formData.country, 
      formData.region, 
      formData.propertyType
    );
    const { totalCosts } = breakdown;
    const acquisitionCosts = (breakdown.imt || 0) + (breakdown.stampDuty || 0) + (breakdown.legalFees || 0) + (breakdown.notaryFees || 0) + (breakdown.iva || 0) + (breakdown.ajd || 0);

    const totalCapitalNeeded = Number(formData.purchasePrice) + Number(formData.renovationCost) + totalCosts;
    const annualRent = formData.estimatedRent * 12;
    
    const opexBreakdown = {
      vacancy: formData.opexOverrides.vacancy ?? (annualRent * (formData.vacancyRate / 100)),
      maintenance: formData.opexOverrides.maintenance ?? (annualRent * (formData.maintenanceRate / 100)),
      capex: formData.opexOverrides.capex ?? (annualRent * (formData.capexRate / 100)),
      insurance: formData.opexOverrides.insurance ?? (annualRent * (formData.insuranceRate / 100)),
      propertyTax: formData.opexOverrides.propertyTax ?? (annualRent * (formData.propertyTaxRate / 100)),
      condo: formData.opexOverrides.condo ?? (annualRent * (formData.condoFeeRate / 100)),
      management: formData.opexOverrides.management ?? (annualRent * (formData.managementFeeRate / 100)),
      admin: formData.opexOverrides.admin ?? (annualRent * (formData.adminRate / 100)),
    };

    const totalOpex = Object.values(opexBreakdown).reduce((a, b) => a + b, 0);
    const netAnnualIncome = annualRent - totalOpex;
    
    const loanAmount = Math.max(0, formData.purchasePrice - formData.downPayment);
    const ltv = (loanAmount / (formData.purchasePrice || 1)) * 100;
    const monthlyRate = formData.interestRate / 100 / 12;
    const months = formData.mortgageTerm * 12;
    let monthlyAnnuity = 0;
    if (monthlyRate > 0) {
      monthlyAnnuity = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    } else {
      monthlyAnnuity = loanAmount / months;
    }

    let yearlyInterest = 0;
    let tempBalance = loanAmount;
    for (let m = 0; m < 12; m++) {
      const mInterest = tempBalance * monthlyRate;
      yearlyInterest += mInterest;
      tempBalance -= (monthlyAnnuity - mInterest);
    }
    const yearlyPrincipal = (monthlyAnnuity * 12) - yearlyInterest;
    
    const mortgageCosts = formData.includeMortgage ? (formData.includePrincipal ? (yearlyInterest + yearlyPrincipal) : yearlyInterest) : 0;
    const profitAfterMortgage = netAnnualIncome - mortgageCosts;
    
    const cashInvested = totalCapitalNeeded - loanAmount;
    const cashOnCashReturn = (profitAfterMortgage / cashInvested) * 100;

    const yearlyAppreciationValue = formData.purchasePrice * (formData.appreciationRate / 100);
    const roeIncl = ((profitAfterMortgage + (formData.includePrincipalROI ? yearlyPrincipal : 0) + (formData.includeAppreciationROI ? yearlyAppreciationValue : 0)) / cashInvested) * 100;
    const currentROE = roeIncl;
    const yearlyEquityGrowth = (formData.includePrincipalROI ? yearlyPrincipal : 0) + (formData.includeAppreciationROI ? yearlyAppreciationValue : 0);

    // Phase 5 Projection Logic
    const horizon = formData.timeHorizon;
    let totalRentProfit = 0;
    let currentVal = formData.purchasePrice + formData.renovationCost;
    let currentAnnualRent = annualRent;
    let currentAnnualOpex = totalOpex;

    const projection = Array.from({ length: horizon + 1 }, (_, year) => {
        // Calculate remaining loan balance at end of this year
        let balance = loanAmount;
        if (year > 0) {
            for (let m = 0; m < year * 12; m++) {
                const mInt = balance * monthlyRate;
                balance -= (monthlyAnnuity - mInt);
            }
        }
        const remainingLoan = Math.max(0, balance);
        const equity = currentVal - (formData.includeMortgagePayoff ? remainingLoan : loanAmount);
        
        const yearResult = {
            year,
            equity: Math.max(0, equity),
            cumulativeRent: totalRentProfit,
            propertyValue: currentVal,
            remainingLoan: remainingLoan
        };

        // Preparation for next year
        if (year < horizon) {
            const yearlyMortgage = formData.includeMortgage ? (formData.includePrincipal ? (monthlyAnnuity * 12) : yearlyInterest) : 0;
            const yearlyProfit = currentAnnualRent - currentAnnualOpex - yearlyMortgage;
            totalRentProfit += yearlyProfit;

            currentVal *= (1 + formData.appreciationRate / 100);
            currentAnnualRent *= (1 + formData.rentGrowthRate / 100);
            currentAnnualOpex *= (1 + formData.rentGrowthRate / 100); // OPEX grows with rent
        }

        return yearResult;
    });

    const finalYear = projection[horizon];
    const appreciationGain = finalYear.propertyValue - formData.purchasePrice;
    const totalReturn = (finalYear.equity - cashInvested) + finalYear.cumulativeRent;
    const combinedReturn = (totalReturn / cashInvested) * 100;

    // IRR Calculation
    const calculateIRR = (flows: number[]) => {
        let irr = 0.1;
        for (let i = 0; i < 100; i++) {
            let npv = 0;
            let dNpv = 0;
            for (let t = 0; t < flows.length; t++) {
                const denom = Math.pow(1 + irr, t);
                npv += flows[t] / denom;
                dNpv -= (t * flows[t]) / (denom * (1 + irr));
            }
            if (Math.abs(dNpv) < 1e-10) break;
            const nextIrr = irr - npv / dNpv;
            if (Math.abs(nextIrr - irr) < 0.00001) return nextIrr * 100;
            irr = nextIrr;
        }
        return irr * 100;
    };

    const cashFlows = [-cashInvested];
    let irrRent = annualRent;
    let irrOpex = totalOpex;
    for (let y = 1; y <= horizon; y++) {
        const yearlyMortgage = formData.includeMortgage ? (formData.includePrincipal ? (monthlyAnnuity * 12) : yearlyInterest) : 0;
        if (y < horizon) {
            cashFlows.push(irrRent - irrOpex - yearlyMortgage);
            irrRent *= (1 + formData.rentGrowthRate / 100);
            irrOpex *= (1 + formData.rentGrowthRate / 100);
        } else {
            // Last year: Profit + Exit Equity
            cashFlows.push((irrRent - irrOpex - yearlyMortgage) + finalYear.equity);
        }
    }
    const projectedIRR = calculateIRR(cashFlows);

    const safeNum = (val: any) => isNaN(Number(val)) ? 0 : Number(val);

    return {
      totalCapitalNeeded: safeNum(totalCapitalNeeded),
      acquisitionCosts: safeNum(acquisitionCosts),
      imt: safeNum(breakdown.imt),
      itp: safeNum(breakdown.itp),
      iva: safeNum(breakdown.iva),
      ajd: safeNum(breakdown.ajd),
      igic: safeNum(breakdown.igic),
      stampDuty: safeNum(breakdown.stampDuty),
      legalFees: safeNum(breakdown.legalFees),
      notaryFees: safeNum(breakdown.notaryFees),
      scenario,
      annualRent: safeNum(annualRent),
      netAnnualIncome: safeNum(netAnnualIncome),
      profitAfterMortgage: safeNum(profitAfterMortgage),
      grossYield: ((annualRent / (totalCapitalNeeded || 1)) * 100).toFixed(1),
      netYield: ((netAnnualIncome / (totalCapitalNeeded || 1)) * 100).toFixed(1),
      cashOnCash: (cashInvested > 0 ? (profitAfterMortgage / cashInvested) * 100 : 0).toFixed(1),
      loanToTac: (totalCapitalNeeded > 0 ? (loanAmount / totalCapitalNeeded) * 100 : 0),
      currentROE: safeNum(currentROE),
      yearlyEquityGrowth: safeNum(yearlyEquityGrowth),
      total20YearProfit: safeNum(totalReturn),
      rentContribution: (totalRentProfit / (totalReturn || 1)) * 100,
      appreciationContribution: ((appreciationGain + (loanAmount - finalYear.remainingLoan)) / (totalReturn || 1)) * 100,
      futureValue: safeNum(finalYear.propertyValue),
      valueGrowth: safeNum(appreciationGain),
      combinedReturn: safeNum(combinedReturn).toFixed(0),
      projectedIRR: safeNum(projectedIRR).toFixed(1),
      projection,
      breakdown,
      opexBreakdown,
      totalOpex,
      ltv,
      yearlyInterest,
      yearlyPrincipal,
      mortgageCosts,
      cashInvested
    };
  }, [formData]);

  const steps: { id: Step; label: string; locked: boolean }[] = [
    { id: 'rent_estimate', label: 'Rent Estimate', locked: false },
    { id: 'gross_yield', label: 'Gross Yield', locked: false },
    { id: 'net_profit', label: 'Net Profit', locked: false },
    { id: 'roi', label: 'Cash ROI', locked: false },
    { id: 'projection', label: '20Y Forecast', locked: false },
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

              <div>
                {step === 'rent_estimate' && (
                  <div className="space-y-10">
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
                                <select 
                                  value={formData.region} 
                                  onChange={(e) => setFormData({...formData, region: e.target.value})} 
                                  className="w-full bg-stone-50 rounded-2xl p-4 font-black outline-none border-2 border-transparent focus:border-[#34495E]"
                                >
                                    {(formData.country === 'Spain' ? spainRegions : portugalRegions).map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
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
                        <div className="space-y-8 pt-4 border-t border-stone-50">
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
                        </div>
                    )}

                    <button onClick={() => setStep('gross_yield')} className="btn-primary w-full flex items-center justify-center gap-3 py-6 group">
                      Continue to financials <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )}


                {step === 'gross_yield' && (
                  <div className="space-y-10">
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
                            <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 block mb-4">
                              {formData.country === 'Spain' ? 'Property Type Decision' : 'IMT Logic Decision'}
                            </span>
                            <div className="flex flex-col gap-4">
                                <label className="text-sm font-black text-[#2C3E50]">
                                  {formData.country === 'Spain' ? 'Is the property a resale or a new build?' : 'Are you going to rent out the property?'}
                                </label>
                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => formData.country === 'Spain' ? setFormData({...formData, propertyType: 'resale'}) : setFormData({...formData, isRental: true})}
                                        className={cn(
                                            "flex-1 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest border-2 transition-all",
                                            (formData.country === 'Spain' ? formData.propertyType === 'resale' : formData.isRental) ? "bg-[#2C3E50] text-white border-[#2C3E50]" : "bg-white text-stone-400 border-stone-100"
                                        )}
                                    >
                                      {formData.country === 'Spain' ? 'Resale' : 'Yes'}
                                    </button>
                                    <button 
                                        onClick={() => formData.country === 'Spain' ? setFormData({...formData, propertyType: 'new_build'}) : setFormData({...formData, isRental: false})}
                                        className={cn(
                                            "flex-1 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest border-2 transition-all",
                                            (formData.country === 'Spain' ? formData.propertyType === 'new_build' : !formData.isRental) ? "bg-[#2C3E50] text-white border-[#2C3E50]" : "bg-white text-stone-400 border-stone-100"
                                        )}
                                    >
                                      {formData.country === 'Spain' ? 'New Build' : 'No'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {formData.country === 'Spain' ? (
                          <div className="space-y-6 pt-6 border-t border-stone-200/50">
                            <h5 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#D4A373]">Spanish Tax Configuration</h5>
                            <div className="space-y-4">
                              {formData.propertyType === 'resale' ? (
                                <div className="flex items-center gap-4 p-4 bg-white border border-[#D4A373]/20 rounded-2xl relative">
                                  <CheckCircle2 className="size-5 text-[#D4A373]" />
                                  <label className="text-xs font-bold text-stone-900 leading-tight">Property Transfer Tax (ITP) Applied</label>
                                  {(formData.region === 'Valencia' || formData.region === 'Alicante') && (
                                    <div className="ml-auto group/warn relative">
                                      <div className="p-1 bg-amber-100 rounded-full animate-pulse">
                                        <Zap className="size-3 text-amber-600" />
                                      </div>
                                      <div className="absolute bottom-full right-0 mb-2 w-48 p-3 bg-[#2C3E50] text-white text-[10px] font-bold rounded-xl opacity-0 group-hover/warn:opacity-100 transition-opacity z-50 pointer-events-none">
                                        {formData.region === 'Valencia' ? 'ITP rates will decrease by 1% starting in June.' : 'ITP rate will decrease to 9%.'}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <>
                                  <div className="flex items-center gap-4 p-4 bg-white border border-[#D4A373]/20 rounded-2xl">
                                    <CheckCircle2 className="size-5 text-[#D4A373]" />
                                    <label className="text-xs font-bold text-stone-900 leading-tight">10% IVA (Value Added Tax)</label>
                                  </div>
                                  <div className="flex items-center gap-4 p-4 bg-white border border-[#D4A373]/20 rounded-2xl">
                                    <CheckCircle2 className="size-5 text-[#D4A373]" />
                                    <label className="text-xs font-bold text-stone-900 leading-tight">AJD (Stamp Duty) Applied</label>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        ) : formData.isRental ? (
                            <div className="space-y-6 pt-6 border-t border-stone-200/50">
                                <h5 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#D4A373]">Moderate Rent IMT Exemption</h5>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-white border border-[#D4A373]/20 rounded-2xl">
                                        <input type="checkbox" checked={formData.estimatedRent <= 2300} readOnly className="size-5 accent-[#D4A373]" />
                                        <label className="text-xs font-bold text-stone-900 leading-tight">Rental price ≤ €2,300/month (Auto-calculated)</label>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-white border border-stone-100 rounded-2xl group cursor-pointer" onClick={() => setFormData({...formData, rentConditionsMet: !formData.rentConditionsMet})}>
                                        <input type="checkbox" checked={formData.rentConditionsMet} readOnly className="size-5 accent-[#2C3E50]" />
                                        <label className="text-xs font-bold text-stone-900 leading-tight cursor-pointer">36-month minimum rental contract (within first 5 years)</label>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-white border border-stone-100 rounded-2xl group cursor-pointer" onClick={() => setFormData({...formData, listedAfter6Months: !formData.listedAfter6Months})}>
                                        <input type="checkbox" checked={formData.listedAfter6Months} readOnly className="size-5 accent-[#2C3E50]" />
                                        <label className="text-xs font-bold text-stone-900 leading-tight cursor-pointer">Property listed within 6 months of purchase</label>
                                    </div>
                                </div>
                                {results.scenario === 'exemption' ? (
                                    <div className="p-4 bg-[#D4A373]/10 text-[#D4A373] rounded-xl text-[10px] font-black uppercase tracking-widest text-center">
                                        Moderate rent exemption applied: 0% IMT Exemption
                                    </div>
                                ) : (
                                    <div className="p-4 bg-stone-100 text-stone-400 rounded-xl text-[10px] font-black uppercase tracking-widest text-center">
                                        Standard Investor Rate Applied: 7.5% FLAT IMT
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-6 pt-6 border-t border-stone-200/50">
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
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="p-8 bg-white border border-stone-100 rounded-[40px] shadow-2xl shadow-stone-200/40 relative overflow-hidden group">
                             <div className="grid grid-cols-2 gap-8 items-center">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-black tracking-[0.2em] uppercase text-stone-400">Total Acquisition Costs (TAC)</span>
                                      <div className="group/tac relative">
                                        <Info className="size-3 text-stone-300 cursor-help" />
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-[#2C3E50] text-white text-[9px] font-bold rounded-xl opacity-0 group-hover/tac:opacity-100 transition-opacity z-50 pointer-events-none">
                                          {TOOLTIP_CONTENT.tac}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-4xl font-black text-[#2C3E50]">€{Math.round(results.totalCapitalNeeded).toLocaleString()}</div>
                                </div>
                                <div className="space-y-2 text-right">
                                    <div className="flex items-center gap-2 justify-end">
                                      <span className="text-[10px] font-black tracking-[0.2em] uppercase text-[#D4A373]">Gross Yield</span>
                                      <div className="group/gy relative text-left">
                                        <Info className="size-3 text-[#D4A373]/50 cursor-help" />
                                        <div className="absolute bottom-full right-0 mb-2 w-48 p-3 bg-[#2C3E50] text-white text-[9px] font-bold rounded-xl opacity-0 group-hover/gy:opacity-100 transition-opacity z-50 pointer-events-none">
                                          {TOOLTIP_CONTENT.grossYield}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-4xl font-black text-[#D4A373]">{results.grossYield}%</div>
                                </div>
                             </div>
                             
                             <div className="mt-8 pt-8 border-t border-stone-100 flex justify-between items-center">
                                <div className="text-[10px] font-black text-[#D4A373] uppercase tracking-widest flex items-center gap-2">
                                    {formData.country === 'Spain' ? (formData.region === 'Las Palmas (Gran Canaria)' ? 'IGIC' : (formData.propertyType === 'resale' ? 'ITP' : 'IVA + AJD')) : 'IMT'}: €{Math.round(results.imt || results.itp || results.igic || (results.iva + results.ajd)).toLocaleString()} 
                                </div>
                                <button 
                                   onClick={() => setShowBreakdown(!showBreakdown)}
                                   className="text-[9px] font-bold text-stone-400 uppercase tracking-tight hover:text-[#D4A373] transition-colors underline decoration-dotted"
                                >
                                    {showBreakdown ? 'Hide full costs' : 'Show breakdown'}
                                </button>
                             </div>
                        </div>

                        {showBreakdown && (
                            <div className="p-8 bg-stone-50 border border-stone-100 rounded-[32px] space-y-6">
                                {formData.country === 'Spain' ? (
                                  <>
                                    {(results.breakdown.itp > 0 || results.breakdown.igic > 0) && (
                                      <div className="flex justify-between items-center group/tax relative">
                                          <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                                            {results.breakdown.igic > 0 ? 'IGIC (7% Flat)' : 'Property Transfer Tax (ITP)'}
                                            <Info className="size-3 text-stone-300 cursor-help" />
                                          </span>
                                          <span className="text-sm font-black text-[#2C3E50]">€{(results.breakdown.itp || results.breakdown.igic).toLocaleString()}</span>
                                          <div className="absolute bottom-full left-0 mb-2 w-48 p-3 bg-[#2C3E50] text-white text-[10px] font-bold rounded-xl opacity-0 group-hover/tax:opacity-100 transition-opacity z-50 pointer-events-none">
                                            {results.breakdown.igic > 0 ? 'The IGIC tax in Las Palmas is 7%.' : `The ITP tax in ${formData.region} is ${(results.breakdown.itp / formData.purchasePrice * 100).toFixed(1)}%.`}
                                          </div>
                                      </div>
                                    )}
                                    {results.breakdown.iva > 0 && (
                                      <div className="flex justify-between items-center group/tax relative">
                                          <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                                            VAT (IVA 10%)
                                            <Info className="size-3 text-stone-300 cursor-help" />
                                          </span>
                                          <span className="text-sm font-black text-[#2C3E50]">€{results.breakdown.iva.toLocaleString()}</span>
                                          <div className="absolute bottom-full left-0 mb-2 w-48 p-3 bg-[#2C3E50] text-white text-[10px] font-bold rounded-xl opacity-0 group-hover/tax:opacity-100 transition-opacity z-50 pointer-events-none">
                                            The IVA (Value Added Tax) is 10%.
                                          </div>
                                      </div>
                                    )}
                                    {results.breakdown.ajd > 0 && (
                                      <div className="flex justify-between items-center group/tax relative">
                                          <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                                            Stamp Duty (AJD)
                                            <Info className="size-3 text-stone-300 cursor-help" />
                                          </span>
                                          <span className="text-sm font-black text-[#2C3E50]">€{results.breakdown.ajd.toLocaleString()}</span>
                                          <div className="absolute bottom-full left-0 mb-2 w-48 p-3 bg-[#2C3E50] text-white text-[10px] font-bold rounded-xl opacity-0 group-hover/tax:opacity-100 transition-opacity z-50 pointer-events-none">
                                            The AJD (Actos Jurídicos Documentados) is {(results.breakdown.ajd / formData.purchasePrice * 100).toFixed(1)}%.
                                          </div>
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Property Transfer Tax (IMT)</span>
                                        <span className="text-sm font-black text-[#2C3E50]">€{Math.round(results.breakdown.imt).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Stamp Duty (0.8%)</span>
                                        <span className="text-sm font-black text-[#2C3E50]">€{Math.round(results.breakdown.stampDuty).toLocaleString()}</span>
                                    </div>
                                  </>
                                )}
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Legal Fees (Est.)</span>
                                    <span className="text-sm font-black text-[#2C3E50]">€{Math.round(results.breakdown.legalFees).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Registry & Notary</span>
                                    <span className="text-sm font-black text-[#2C3E50]">€{results.breakdown.notaryFees.toLocaleString()}</span>
                                </div>
                                <div className="pt-4 border-t border-stone-200 flex justify-between items-center">
                                    <span className="text-[10px] font-black text-[#D4A373] uppercase tracking-widest">Total Sunk Costs</span>
                                    <span className="text-lg font-black text-[#D4A373]">€{Math.round(results.totalCapitalNeeded - formData.purchasePrice - formData.renovationCost).toLocaleString()}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 pt-6">
                      <button onClick={() => setStep('rent_estimate')} className="btn-secondary px-6 shrink-0"> <ChevronLeft className="size-6" /> </button>
                      <button onClick={() => setStep('net_profit')} className="btn-primary flex-grow group !bg-[#34495E]">
                        Analyze Net Cash Flow Logic
                      </button>
                    </div>
                  </div>
                )}

                {step === 'net_profit' && (
                    <div className="space-y-10">
                        <div>
                            <h4 className="text-xl font-black text-stone-900 mb-2 tracking-tight uppercase">Stage 3: Net Cash Flow Analysis</h4>
                            <p className="text-stone-500 text-xs font-bold italic uppercase tracking-widest leading-relaxed">Full OPEX modeling including mortgage and tax overheads.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-6 bg-stone-50 rounded-3xl border border-stone-100 flex flex-col">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex items-center gap-2">
                                          <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Yearly Rent</span>
                                          <div className="group/yr relative">
                                            <Info className="size-3 text-stone-300 cursor-help" />
                                            <div className="absolute bottom-full left-0 mb-2 w-48 p-3 bg-[#2C3E50] text-white text-[9px] font-bold rounded-xl opacity-0 group-hover/yr:opacity-100 transition-opacity z-50 pointer-events-none">
                                              Total annual rental income.
                                            </div>
                                          </div>
                                        </div>
                                        <span className="text-sm font-black text-[#2C3E50]">€{Math.round(results.annualRent).toLocaleString()}</span>
                                    </div>
                                    
                                    <div className="space-y-4 flex-grow">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Operating Expenses</span>
                                            <div className="text-right">
                                              <div className="text-sm font-black text-[#2C3E50]">€{Math.round(results.totalOpex).toLocaleString()}</div>
                                              <button 
                                                onClick={() => setShowOpexBreakdown(!showOpexBreakdown)}
                                                className="text-[9px] font-bold text-[#D4A373] uppercase tracking-tight hover:underline"
                                              >
                                                {showOpexBreakdown ? 'Hide cost breakdown' : 'Show cost breakdown'}
                                              </button>
                                            </div>
                                        </div>

                                        <AnimatePresence>
                                          {showOpexBreakdown && (
                                            <motion.div 
                                              initial={{ height: 0, opacity: 0 }}
                                              animate={{ height: 'auto', opacity: 1 }}
                                              exit={{ height: 0, opacity: 0 }}
                                              className="overflow-hidden"
                                            >
                                              <div className="space-y-2 pt-4 border-t border-stone-200">
                                                {[
                                                    { label: 'Vacancy (4%)', key: 'vacancy' },
                                                    { label: 'Maintenance (10%)', key: 'maintenance' },
                                                    { label: 'CapEx (5%)', key: 'capex' },
                                                    { label: 'Insurance', key: 'insurance' },
                                                    { label: 'Property Tax', key: 'propertyTax' },
                                                    { label: 'Condo Fees', key: 'condo' },
                                                    { label: 'Management', key: 'management' },
                                                    { label: 'Admin', key: 'admin' },
                                                ].map((item) => (
                                                    <div key={item.key} className="flex justify-between items-center group/opex">
                                                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-tight">{item.label}</span>
                                                        <div className="flex items-center gap-2">
                                                            {editingOpex === item.key ? (
                                                                <input 
                                                                  type="number" 
                                                                  autoFocus
                                                                  className="w-16 bg-white border border-[#D4A373] rounded px-1 text-right text-[10px] font-bold outline-none"
                                                                  value={formData.opexOverrides[item.key] ?? Math.round((results.opexBreakdown as any)[item.key])}
                                                                  onChange={(e) => setFormData({
                                                                    ...formData, 
                                                                    opexOverrides: { ...formData.opexOverrides, [item.key]: Number(e.target.value) }
                                                                  })}
                                                                  onBlur={() => setEditingOpex(null)}
                                                                />
                                                            ) : (
                                                                <>
                                                                    <span className="text-[10px] font-bold text-stone-500">€{Math.round((results.opexBreakdown as any)[item.key]).toLocaleString()}</span>
                                                                    <button 
                                                                      onClick={() => setEditingOpex(item.key)}
                                                                      className="opacity-0 group-hover/opex:opacity-100 transition-opacity p-0.5 hover:bg-stone-200 rounded"
                                                                    >
                                                                        <Pencil className="size-2 text-stone-400" />
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                              </div>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>

                                        <div className="pt-4 border-t border-stone-200 flex justify-between items-center font-black text-[#34495E]">
                                            <div className="flex items-center gap-2">
                                              <span className="text-[10px] uppercase">Net Operating Income (NOI)</span>
                                              <div className="group/noi relative">
                                                <Info className="size-3 text-[#34495E]/50 cursor-help" />
                                                <div className="absolute bottom-full left-0 mb-2 w-48 p-3 bg-[#2C3E50] text-white text-[9px] font-bold rounded-xl opacity-0 group-hover/noi:opacity-100 transition-opacity z-50 pointer-events-none">
                                                  {TOOLTIP_CONTENT.noi}
                                                </div>
                                              </div>
                                            </div>
                                            <span className="text-sm">€{Math.round(results.netAnnualIncome).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-white border border-stone-100 rounded-3xl shadow-xl shadow-stone-200/40 transition-all">
                                    <div className="flex items-center gap-2 mb-4 group cursor-pointer" onClick={() => setFormData({...formData, includeMortgage: !formData.includeMortgage})}>
                                        <div className={cn(
                                          "size-5 rounded border-2 flex items-center justify-center transition-all",
                                          formData.includeMortgage ? "bg-[#34495E] border-[#34495E]" : "bg-white border-stone-200"
                                        )}>
                                          {formData.includeMortgage && <CheckCircle2 className="size-3 text-white" />}
                                        </div>
                                        <label className="text-[10px] font-black text-[#2C3E50] uppercase tracking-widest cursor-pointer">Include Mortgage</label>
                                    </div>

                                    <AnimatePresence>
                                    {formData.includeMortgage && (
                                        <motion.div 
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{ height: 'auto', opacity: 1 }}
                                          exit={{ height: 0, opacity: 0 }}
                                          className="overflow-hidden space-y-6"
                                        >
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Down Payment (€)</label>
                                                    <input type="number" value={formData.downPayment} onChange={(e) => setFormData({...formData, downPayment: Number(e.target.value)})} className="w-full bg-stone-50 p-3 rounded-xl font-black text-sm outline-none border border-transparent focus:border-[#34495E]" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Interest Rate (%)</label>
                                                    <input type="number" step="0.1" value={formData.interestRate} onChange={(e) => setFormData({...formData, interestRate: Number(e.target.value)})} className="w-full bg-stone-50 p-3 rounded-xl font-black text-sm outline-none border border-transparent focus:border-[#34495E]" />
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Loan-to-TAC</span>
                                                <div className="group/ltac relative">
                                                  <Info className="size-3 text-stone-300 cursor-help" />
                                                  <div className="absolute bottom-full left-0 mb-2 w-48 p-3 bg-[#2C3E50] text-white text-[9px] font-bold rounded-xl opacity-0 group-hover/ltac:opacity-100 transition-opacity z-50 pointer-events-none">
                                                    {TOOLTIP_CONTENT.loanToTac}
                                                  </div>
                                                </div>
                                              </div>
                                              <span className="text-[10px] font-black text-[#34495E] uppercase tracking-widest">{results.loanToTac.toFixed(1)}%</span>
                                            </div>

                                            <p className="text-[9px] font-bold text-stone-400 italic">“This calculation assumes a full annuity mortgage.”</p>

                                            <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
                                              <input 
                                                type="checkbox" 
                                                id="includePrincipal" 
                                                checked={formData.includePrincipal} 
                                                onChange={(e) => setFormData({...formData, includePrincipal: e.target.checked})}
                                                className="size-4 accent-[#D4A373]"
                                              />
                                              <label htmlFor="includePrincipal" className="text-[9px] font-black text-[#2C3E50] uppercase tracking-widest cursor-pointer">Include principal repayment</label>
                                            </div>

                                            <div className="space-y-2 pt-2">
                                              <div className="flex justify-between items-center">
                                                  <span className="text-[9px] font-black text-[#34495E] uppercase tracking-widest">Annual Interest</span>
                                                  <span className="text-sm font-black text-[#34495E]">€{Math.round(results.yearlyInterest).toLocaleString()}</span>
                                              </div>
                                              {formData.includePrincipal && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[9px] font-black text-[#D4A373] uppercase tracking-widest">Annual Monthly Repayment</span>
                                                    <span className="text-sm font-black text-[#D4A373]">€{Math.round(results.yearlyPrincipal).toLocaleString()}</span>
                                                </div>
                                              )}
                                            </div>
                                        </motion.div>
                                    )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            <div className={cn(
                              "p-10 rounded-[40px] flex items-center justify-between shadow-2xl transition-colors",
                              results.profitAfterMortgage >= 0 
                                ? "bg-emerald-600 shadow-emerald-600/20" 
                                : "bg-rose-600 shadow-rose-600/20"
                            )}>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-black tracking-[0.2em] uppercase opacity-60 text-white">Estimated Net Annual Profit</span>
                                      <div className="group/np relative">
                                        <Info className="size-3 text-white/50 cursor-help" />
                                        <div className="absolute bottom-full left-0 mb-2 w-48 p-3 bg-[#2C3E50] text-white text-[9px] font-bold rounded-xl opacity-0 group-hover/np:opacity-100 transition-opacity z-50 pointer-events-none">
                                          {TOOLTIP_CONTENT.netProfit}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-5xl font-black text-white">€{Math.round(results.profitAfterMortgage).toLocaleString()}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1 text-white">Monthly Profit</div>
                                    <div className="text-2xl font-black text-white">€{Math.round(results.profitAfterMortgage / 12).toLocaleString()}</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-6">
                            <button onClick={() => setStep('gross_yield')} className="btn-secondary px-6 shrink-0"> <ChevronLeft className="size-6" /> </button>
                            <button onClick={() => setStep('roi')} className="btn-primary flex-grow group !bg-[#D4A373]">
                                Move to ROI Metrics <ChevronRight className="size-5 ml-2 inline transition-transform" />
                            </button>
                        </div>
                    </div>
                )}

                {step === 'roi' && (
                    <div className="space-y-10">
                        <div>
                            <h4 className="text-xl font-black text-stone-900 mb-2 tracking-tight uppercase">Stage 4: Capital Return (ROI)</h4>
                            <p className="text-stone-500 text-xs font-bold italic uppercase tracking-widest leading-relaxed">Efficiency of your deployed capital.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="p-8 bg-stone-50 rounded-[32px] border border-stone-100 space-y-6">
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-stone-400">Capital Deployment</h5>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center group/info relative">
                                        <span className="text-xs font-bold text-stone-600 flex items-center gap-2">Total Project Cost <Info className="size-3 text-stone-300" /></span>
                                        <span className="text-sm font-black text-[#2C3E50]">€{Math.round(results.totalCapitalNeeded).toLocaleString()}</span>
                                        <div className="absolute bottom-full left-0 mb-2 w-48 p-3 bg-[#2C3E50] text-white text-[9px] font-bold rounded-xl opacity-0 group-hover/info:opacity-100 transition-opacity z-50 pointer-events-none">Full cost including purchase price, taxes, and fees.</div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-stone-600">Mortgage Loan</span>
                                        <span className="text-sm font-black text-amber-600">-€{Math.round(formData.purchasePrice - formData.downPayment).toLocaleString()}</span>
                                    </div>
                                    <div className="pt-4 border-t border-stone-200 flex justify-between items-center">
                                        <span className="text-xs font-black text-[#2C3E50]">Actual Cash Invested</span>
                                        <span className="text-lg font-black text-[#2C3E50]">€{Math.round(results.cashInvested).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-bold text-stone-400">
                                        <div className="flex items-center gap-2">
                                          <span>Estimated Net Annual Profit</span>
                                          <div className="group/enap relative">
                                            <Info className="size-3 text-stone-300 cursor-help" />
                                            <div className="absolute bottom-full left-0 mb-2 w-48 p-3 bg-[#2C3E50] text-white text-[9px] font-bold rounded-xl opacity-0 group-hover/enap:opacity-100 transition-opacity z-50 pointer-events-none">
                                              {TOOLTIP_CONTENT.netProfit}
                                            </div>
                                          </div>
                                        </div>
                                        <span>€{Math.round(results.profitAfterMortgage).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-white border border-stone-100 rounded-[32px] shadow-2xl shadow-stone-200/40 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="size-32 rounded-full border-[10px] border-[#D4A373]/10 flex items-center justify-center relative">
                                    <div className="text-3xl font-black text-[#D4A373]">{results.cashOnCash}%</div>
                                </div>
                                <div>
                                    <h6 className="text-[10px] font-black uppercase tracking-widest text-stone-400">Cash-on-Cash Return (%)</h6>
                                    <p className="text-[9px] font-bold text-stone-400 italic mt-1">Annual return on invested cash (excl. appreciation by default)</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-stone-900 text-white rounded-[40px] space-y-8">
                             <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-6 gap-6">
                                <div className="flex flex-wrap gap-6">
                                  <div className="flex items-center gap-3">
                                    <input 
                                      type="checkbox" 
                                      id="includePrincipalROI" 
                                      checked={formData.includePrincipalROI} 
                                      onChange={(e) => setFormData({...formData, includePrincipalROI: e.target.checked})}
                                      className="size-5 accent-[#D4A373]"
                                    />
                                    <div className="flex flex-col">
                                      <label htmlFor="includePrincipalROI" className="text-[10px] font-black uppercase tracking-widest cursor-pointer">Include Principal Repayment</label>
                                      {formData.includePrincipalROI && (
                                        <span className="text-[9px] text-[#D4A373] font-bold">
                                          +€{Math.round(results.yearlyPrincipal).toLocaleString()} ({((results.yearlyPrincipal / (formData.purchasePrice - formData.downPayment || 1)) * 100).toFixed(1)}% of loan)
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <input 
                                      type="checkbox" 
                                      id="includeAppreciationROI" 
                                      checked={formData.includeAppreciationROI} 
                                      onChange={(e) => setFormData({...formData, includeAppreciationROI: e.target.checked})}
                                      className="size-5 accent-[#D4A373]"
                                    />
                                    <div className="flex flex-col">
                                      <label htmlFor="includeAppreciationROI" className="text-[10px] font-black uppercase tracking-widest cursor-pointer">Include Appreciation</label>
                                      {formData.includeAppreciationROI && (
                                        <span className="text-[9px] text-[#D4A373] font-bold">
                                          +€{Math.round(formData.purchasePrice * (formData.appreciationRate / 100)).toLocaleString()} (Annual increase)
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                             </div>

                             <div className="grid grid-cols-3 gap-8">
                               <div className="space-y-1">
                                   <div className="text-[9px] font-black uppercase tracking-widest opacity-60">Total Return on Equity</div>
                                   <div className="text-2xl font-black">{results.currentROE.toFixed(1)}%</div>
                               </div>
                               <div className="space-y-1">
                                   <div className="text-[9px] font-black uppercase tracking-widest opacity-60">Equity Growth / Year</div>
                                   <div className="text-2xl font-black">€{Math.round(results.yearlyEquityGrowth).toLocaleString()}</div>
                               </div>
                               <div className="space-y-1 text-right">
                                   <div className="text-[9px] font-black uppercase tracking-widest opacity-60">Net Yield on Cost</div>
                                   <div className="text-2xl font-black">{results.netYield}%</div>
                               </div>
                             </div>
                        </div>

                        <div className="flex gap-4 pt-6">
                            <button onClick={() => setStep('net_profit')} className="btn-secondary px-6 shrink-0"> <ChevronLeft className="size-6" /> </button>
                            <button onClick={() => setStep('projection')} className="btn-primary flex-grow group !bg-[#2C3E50]">
                                View {formData.timeHorizon}Y Forecast <ChevronRight className="size-5 ml-2 inline transition-transform" />
                            </button>
                        </div>
                    </div>
                )}

                {step === 'projection' && (
                  <div className="relative overflow-hidden border-2 border-stone-100 rounded-[48px] bg-white">
                        <div className="p-8 md:p-12 space-y-10 group/gate">
                            <div className="flex justify-between items-center pb-6 border-b border-stone-100">
                                <div>
                                    <h4 className="text-xl font-black text-stone-900 uppercase tracking-tight">Stage 5: Long-Term Projection</h4>
                                    <p className="text-stone-500 text-xs font-bold tracking-tight mt-1">Projection based on your current investment setup.</p>
                                </div>
                                <div className="flex gap-2">
                                  {[10, 15, 20, 25, 30].map(yr => (
                                    <button 
                                      key={yr} 
                                      onClick={() => setFormData({...formData, timeHorizon: yr})}
                                      className={cn(
                                        "px-3 py-1 rounded-lg text-[10px] font-black transition-all",
                                        formData.timeHorizon === yr ? "bg-[#34495E] text-white" : "bg-stone-100 text-stone-400 hover:bg-stone-200"
                                      )}
                                    >
                                      {yr}Y
                                    </button>
                                  ))}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-10">
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center group/appr relative">
                                            <label className="text-[10px] font-black text-stone-900 tracking-tight flex items-center gap-2">Yearly appreciation (%) <Info className="size-3 text-stone-300" /></label>
                                            <span className="text-sm font-black text-[#34495E]">{formData.appreciationRate}%</span>
                                            <div className="absolute bottom-full left-0 mb-2 w-48 p-3 bg-[#2C3E50] text-white text-[9px] font-bold rounded-xl opacity-0 group-hover/appr:opacity-100 transition-opacity z-50 pointer-events-none">Based on historical property price growth in this market. Typical range: 3% – 6% depending on market.</div>
                                        </div>
                                        <input type="range" min="0" max="15" step="0.5" value={formData.appreciationRate} onChange={(e) => setFormData({...formData, appreciationRate: Number(e.target.value)})} className="w-full accent-[#34495E] cursor-pointer" />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-black text-stone-900 tracking-tight">Annual rent growth (%)</label>
                                            <span className="text-sm font-black text-[#D4A373]">{formData.rentGrowthRate}%</span>
                                        </div>
                                        <input type="range" min="0" max="10" step="0.1" value={formData.rentGrowthRate} onChange={(e) => setFormData({...formData, rentGrowthRate: Number(e.target.value)})} className="w-full accent-[#D4A373] cursor-pointer" />
                                    </div>
                                    
                                    <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-100">
                                      <input 
                                        type="checkbox" 
                                        id="includeMortgagePayoff" 
                                        checked={formData.includeMortgagePayoff} 
                                        onChange={(e) => setFormData({...formData, includeMortgagePayoff: e.target.checked})}
                                        className="size-5 accent-[#34495E]"
                                      />
                                      <label htmlFor="includeMortgagePayoff" className="text-[10px] font-black text-[#2C3E50] uppercase tracking-widest cursor-pointer">Include mortgage payoff over time</label>
                                    </div>
                                </div>
                                
                                <div className="p-6 bg-stone-50 rounded-3xl border border-stone-100 space-y-4">
                                    <div className="flex items-center gap-3 text-stone-900 font-black text-[10px] uppercase tracking-widest">
                                        <Info className="size-4 text-[#D4A373]" /> Valuation Logic
                                    </div>
                                    <p className="text-xs font-bold text-stone-500 leading-relaxed italic">
                                        Returns come from two sources: rental income (stable) and appreciation (market-driven). Adjust assumptions to reflect your risk expectations.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                              <div className="flex justify-between items-end">
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-stone-400">Projected Equity & Income Growth</h5>
                                <button 
                                  onClick={() => setFormData({...formData, showProjectionBreakdown: !formData.showProjectionBreakdown})}
                                  className="text-[9px] font-black text-[#D4A373] uppercase underline"
                                >
                                  {formData.showProjectionBreakdown ? 'Hide Breakdown' : 'Show Breakdown'}
                                </button>
                              </div>
                              <div className="relative h-64 bg-stone-50 rounded-3xl border border-stone-100 flex items-end p-6 gap-2 overflow-hidden">
                                  {results.projection.map((p, i) => {
                                      if (i === 0) return null;
                                      const totalMax = results.projection[formData.timeHorizon].equity + results.projection[formData.timeHorizon].cumulativeRent;
                                      const hRent = (p.cumulativeRent / totalMax) * 100;
                                      const hEquity = (p.equity / totalMax) * 100;
                                      
                                      return (
                                          <div key={i} className="flex-grow flex flex-col justify-end group/bar relative h-full">
                                              {formData.showProjectionBreakdown ? (
                                                <>
                                                  <div className="w-full bg-[#D4A373] rounded-t-sm transition-all" style={{ height: `${hRent}%` }} />
                                                  <div className="w-full bg-[#34495E] transition-all" style={{ height: `${hEquity}%` }} />
                                                </>
                                              ) : (
                                                <div className="w-full bg-[#34495E] rounded-t-sm transition-all" style={{ height: `${hRent + hEquity}%` }} />
                                              )}
                                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#2C3E50] text-white text-[8px] font-black px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                  Year {p.year}: €{Math.round(p.equity + p.cumulativeRent).toLocaleString()}
                                              </div>
                                          </div>
                                      );
                                  })}
                              </div>
                              {formData.showProjectionBreakdown && (
                                <div className="flex gap-6 justify-center">
                                  <div className="flex items-center gap-2">
                                    <div className="size-2 bg-[#D4A373] rounded-full" />
                                    <span className="text-[9px] font-black uppercase text-stone-400">Cumulative Rent</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="size-2 bg-[#34495E] rounded-full" />
                                    <span className="text-[9px] font-black uppercase text-stone-400">Property Equity</span>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="grid md:grid-cols-3 gap-6 pt-6">
                                <div className="p-6 bg-white border border-stone-100 rounded-3xl shadow-xl shadow-stone-200/40">
                                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-2">Total Projected Profit</span>
                                    <div className="text-3xl font-black text-[#2C3E50]">€{Math.round(results.total20YearProfit).toLocaleString()}</div>
                                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                                      <span className="text-[9px] font-bold text-[#D4A373] uppercase">{results.rentContribution.toFixed(0)}% from rent</span>
                                      <span className="text-[9px] font-bold text-[#34495E] uppercase">{results.appreciationContribution.toFixed(0)}% from growth</span>
                                    </div>
                                </div>
                                <div className="p-6 bg-[#34495E] text-white rounded-3xl shadow-xl shadow-[#34495E]/20">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Projected IRR</span>
                                      <div className="group/irr relative">
                                        <Info className="size-3 text-white/50 cursor-help" />
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-[#2C3E50] text-white text-[9px] font-bold rounded-xl opacity-0 group-hover/irr:opacity-100 transition-opacity z-50 pointer-events-none text-left">
                                          {TOOLTIP_CONTENT.irr}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-3xl font-black">{results.projectedIRR}%</div>
                                    <p className="text-[9px] font-bold mt-2 uppercase tracking-tight opacity-60">Internal Rate of Return</p>
                                </div>
                                <div className="p-6 bg-[#D4A373] text-white rounded-3xl shadow-xl shadow-[#D4A373]/20">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Combined {formData.timeHorizon}Y ROI</span>
                                      <div className="group/croi relative">
                                        <Info className="size-3 text-white/50 cursor-help" />
                                        <div className="absolute bottom-full right-0 mb-2 w-48 p-3 bg-[#2C3E50] text-white text-[9px] font-bold rounded-xl opacity-0 group-hover/croi:opacity-100 transition-opacity z-50 pointer-events-none text-left">
                                          Total percentage gain on your initial cash investment over {formData.timeHorizon} years.
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-3xl font-black">{results.combinedReturn}%</div>
                                    <p className="text-[9px] font-bold mt-2 uppercase tracking-tight opacity-60">Total project performance</p>
                                </div>
                            </div>

                            <div className="pt-10 border-t border-stone-100">
                                <button 
                                  onClick={() => setShowCalculationDetails(!showCalculationDetails)}
                                  className="w-full py-4 border-2 border-stone-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-stone-400 hover:border-[#D4A373] hover:text-[#D4A373] transition-all flex items-center justify-center gap-3"
                                >
                                  {showCalculationDetails ? 'Hide Calculation Logic' : 'Show Calculation Logic'}
                                  <ChevronDown className={cn("size-4 transition-transform", showCalculationDetails ? "rotate-180" : "")} />
                                </button>
                                
                                <AnimatePresence>
                                {showCalculationDetails && (
                                  <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="mt-6 p-8 bg-stone-50 rounded-[32px] border border-stone-100 space-y-6">
                                      <div className="grid md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                          <h6 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4A373]">Income Formula</h6>
                                          <p className="text-xs font-bold text-stone-500 leading-relaxed">
                                            We take your <span className="text-[#34495E]">Monthly Profit (Year 1)</span> and grow it by <span className="text-[#34495E]">{formData.rentGrowthRate}%</span> annually. 
                                            The total is the sum of these increasing monthly cash flows over {formData.timeHorizon} years.
                                          </p>
                                          <div className="p-4 bg-white rounded-2xl border border-stone-200/50 font-mono text-[10px] text-stone-400">
                                            Sum[ (Monthly Profit × 12) × (1 + {formData.rentGrowthRate/100})^year ]
                                          </div>
                                        </div>
                                        <div className="space-y-4">
                                          <h6 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#34495E]">Equity Formula</h6>
                                          <p className="text-xs font-bold text-stone-500 leading-relaxed">
                                            Your equity grows in two ways: <br />
                                            1. <span className="text-[#34495E]">Market Growth</span>: Purchase Price × (1 + {formData.appreciationRate}%)^{formData.timeHorizon}. <br />
                                            2. <span className="text-[#34495E]">Loan Reduction</span>: Remaining mortgage balance decreases every year.
                                          </p>
                                          <div className="p-4 bg-white rounded-2xl border border-stone-200/50 font-mono text-[10px] text-stone-400">
                                            Final Equity = (Purchased Price × Growth^{formData.timeHorizon}) - Remaining Loan
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                                </AnimatePresence>
                            </div>
                        </div>
                  </div>
                )}
              </div>
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
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest block">Phase 2: Yield & Costs</span>
                                    <div className="group/gy2 relative">
                                        <Info className="size-3 text-stone-300 cursor-help" />
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-[#2C3E50] text-white text-[9px] font-bold rounded-xl opacity-0 group-hover/gy2:opacity-100 transition-opacity z-50 pointer-events-none text-left">
                                            Includes both Gross Yield (%) and Total Acquisition Costs (€).
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className={cn(
                                        "text-3xl font-black tracking-tighter",
                                        (step === 'gross_yield' || step === 'net_profit' || step === 'roi' || step === 'projection') ? "text-[#D4A373]" : "text-stone-300"
                                    )}>
                                        {results.grossYield}<span className="text-lg text-stone-200 ml-2">%</span>
                                    </div>
                                    <div className={cn(
                                        "text-sm font-bold tracking-tight",
                                        (step === 'gross_yield' || step === 'net_profit' || step === 'roi' || step === 'projection') ? "text-[#D4A373]/60" : "text-stone-200"
                                    )}>
                                        €{Math.round(results.totalCapitalNeeded).toLocaleString()} <span className="text-[9px] uppercase">TAC</span>
                                    </div>
                                </div>
                            </div>

                            {/* Phase 3: Net Profit */}
                            <div className={cn(
                                "p-6 rounded-3xl transition-all border",
                                (step === 'net_profit' || step === 'roi' || step === 'projection') 
                                    ? "bg-white border-[#34495E]/20 shadow-lg" 
                                    : "bg-stone-50/30 border-transparent opacity-50"
                            )}>
                                <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest block mb-2">Phase 3: Net Profit</span>
                                <div className="space-y-1">
                                    <div className={cn(
                                        "text-3xl font-black tracking-tighter",
                                        (step === 'net_profit' || step === 'roi' || step === 'projection') ? "text-[#34495E]" : "text-stone-300"
                                    )}>
                                        €{Math.round(results.profitAfterMortgage / 12).toLocaleString()}<span className="text-lg ml-2">/mo</span>
                                    </div>
                                    <div className={cn(
                                        "text-sm font-bold tracking-tight",
                                        (step === 'net_profit' || step === 'roi' || step === 'projection') ? "text-[#34495E]/60" : "text-stone-200"
                                    )}>
                                        €{Math.round(results.profitAfterMortgage).toLocaleString()}<span className="text-[9px] uppercase ml-1">Yearly</span>
                                    </div>
                                </div>
                            </div>

                            {/* Phase 4: Cash ROI */}
                            <div className={cn(
                                "p-6 rounded-3xl transition-all border",
                                (step === 'roi' || step === 'projection') 
                                    ? "bg-white border-[#D4A373]/20 shadow-lg" 
                                    : "bg-stone-50/30 border-transparent opacity-50"
                            )}>
                                <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest block mb-2">Phase 4: Cash-on-Cash ROI</span>
                                <div className={cn(
                                    "text-4xl font-black tracking-tighter",
                                    (step === 'roi' || step === 'projection') ? "text-[#D4A373]" : "text-stone-300"
                                )}>
                                    {results.cashOnCash}<span className="text-lg ml-2">%</span>
                                </div>
                            </div>

                            {/* Phase 5: Forecast */}
                            <div className={cn(
                                "p-6 rounded-3xl transition-all border",
                                (step === 'projection') 
                                    ? "bg-white border-[#2C3E50]/20 shadow-lg" 
                                    : "bg-stone-50/30 border-transparent opacity-50"
                            )}>
                                <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest block mb-2">Phase 5: {formData.timeHorizon}Y Forecast</span>
                                <div className={cn(
                                    "text-4xl font-black tracking-tighter",
                                    (step === 'projection') ? "text-[#2C3E50]" : "text-stone-300"
                                )}>
                                    {results.combinedReturn}<span className="text-lg ml-2">%</span>
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
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}





