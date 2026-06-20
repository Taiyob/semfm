'use client';

import { useState, useMemo, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppSelector } from '@/lib/store/hooks';
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
    Pencil,
    Lock,
    Wallet,
    Percent,
    Settings,
    History as HistoryIcon,
    Trash2,
    Clock,
    X
} from 'lucide-react';
import { GatedData } from '@/components/gated-data';
import { calculateResidentialIMT, calculateAcquisitionBreakdown } from '@/lib/calculations';
import {
    useSaveCalculationMutation,
    useGetMyCalculationsQuery,
    useDeleteCalculationMutation
} from '@/lib/store/features/calculations/calculationApi';
import { useCreateLeadMutation } from '@/lib/store/features/leads/leadsApi';
import { useGetPropertiesQuery } from '@/lib/store/features/property/propertyApi';
import { Loader2, Save } from 'lucide-react';
import Swal from 'sweetalert2';

type Step = 'rent_estimate' | 'gross_yield' | 'net_profit' | 'roi' | 'projection';
type Mode = 'simple' | 'advanced';



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
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);
    const [mounted, setMounted] = useState(false);
    const [step, setStep] = useState<Step>('rent_estimate');
    const rentFromPropertyRef = useRef(false);

    const [regionsList, setRegionsList] = useState<any[]>([]);
    const [multipliers, setMultipliers] = useState<any>(null);

    useEffect(() => {
        setMounted(true);
        // Fetch dynamic global calculator settings and regions from backend
        const fetchSettings = async () => {
            try {
                const [settingsRes, regionsRes] = await Promise.all([
                    fetch('http://localhost:5000/api/v1/settings/calculator'),
                    fetch('http://localhost:5000/api/v1/regions')
                ]);
                const settingsData = await settingsRes.json();
                const regionsData = await regionsRes.json();

                if (settingsData.success && settingsData.data) {
                    setMultipliers(settingsData.data.rentMultipliers || null);
                    setFormData(prev => ({
                        ...prev,
                        vacancyRate: settingsData.data.vacancyRate,
                        maintenanceRate: settingsData.data.maintenancePercentage,
                        propertyTaxRate: settingsData.data.taxPercentage,
                        managementFeeRate: settingsData.data.managementFeePercentage,
                        appreciationRate: settingsData.data.appreciationRate,
                    }));
                }
                if (regionsData.success && regionsData.data) {
                    setRegionsList(regionsData.data);
                }
            } catch (err) {
                console.error('Failed to fetch calculator settings', err);
            }
        };
        fetchSettings();
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
        size: 60 as number | '',
        bedrooms: 1 as number | '',
        purchasePrice: 350000 as number | '',
        renovationCost: 20000 as number | '',
        financeRenovation: false,
        estimatedRent: 1500 as number | '',
        includeMortgage: false,
        loanPercentage: 70 as number | '',
        interestRate: 3.5 as number | '',
        appreciationRate: 6 as number | '',
        // Phase 2 Logic
        isRental: true,
        propertyType: 'resale' as 'resale' | 'new_build',
        rentConditionsMet: true,
        contractDuration: 36 as number | '',
        listedAfter6Months: true,
        // Phase 3 - Net Cash Flow Analysis
        vacancyRate: 4 as number | '',
        maintenanceRate: 10 as number | '',
        capexRate: 3 as number | '',
        insuranceRate: 1.5 as number | '',
        propertyTaxRate: 8 as number | '',
        condoFeeRate: 7 as number | '',
        managementFeeRate: 10 as number | '',
        adminRate: 1 as number | '',
        downPayment: 105000 as number | '',
        includePrincipal: false,
        mortgageTerm: 25 as number | '',
        // Phase 4 & 5
        includeCashFlowROI: true,
        includeAppreciationROI: false,
        includePrincipalROI: false,
        annualIncomeGrowthRate: 0 as number | '',
        timeHorizon: 20 as number | '',
        includeMortgagePayoff: false,
        showProjectionBreakdown: false,
        opexOverrides: {} as Record<string, number | string | null>,
        monthlyCashFlowOverride: null as number | null,
        monthlyPaymentOverride: null as number | null,
        // Advanced fields
        yearBuilt: 2020 as number | '',
        propertyCondition: 'Standard',
        outdoorSpace: 'None',
        energyLabel: 'A',
        hasParking: false,
        hasElevator: 'no' as 'yes' | 'no' | 'not_applicable',
    });

    const [saveCalculation, { isLoading: isSaving }] = useSaveCalculationMutation();
    const [createLead, { isLoading: isCreatingLead }] = useCreateLeadMutation();
    const [deleteCalculation] = useDeleteCalculationMutation();
    const { data: historyData, isLoading: isLoadingHistory } = useGetMyCalculationsQuery(undefined, { skip: !isAuthenticated });
    const { data: propertiesData } = useGetPropertiesQuery({ page: 1, limit: 100 });
    const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
    const [isDetailedAssumptionsModalOpen, setDetailedAssumptionsModalOpen] = useState(false);
    const [editModeAppreciation, setEditModeAppreciation] = useState(false);
    const [editModeLoanPaydown, setEditModeLoanPaydown] = useState(false);

    const handleNumberChange = (field: string, value: string) => {
        if (value === '') {
            setFormData(prev => ({ ...prev, [field]: '' }));
            return;
        }
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
            setFormData(prev => ({ ...prev, [field]: numValue }));
        }
    };

    const handleBlur = (field: string, defaultValue: number = 0) => {
        if (formData[field as keyof typeof formData] === '') {
            setFormData(prev => ({ ...prev, [field]: defaultValue }));
        }
    };

    useEffect(() => {
        // Base rent per sqm by city (region) from fetched regions
        let baseRent = 0;
        if (regionsList && regionsList.length > 0) {
            const foundRegion = regionsList.find(r => r.name === formData.region);
            if (foundRegion) {
                baseRent = foundRegion.baseRent;
            }
        }
        // Fallback to hardcoded if regions not loaded yet or region not found
        if (baseRent === 0) {
            const baseRentByCity: Record<string, number> = {
                Braga: 9.5, Porto: 13.0, Lisbon: 18.0, Faro: 15.0,
                Valencia: 13.5, Alicante: 11.0, 'Málaga': 13.0, 'Las Palmas (Gran Canaria)': 10.5,
            };
            baseRent = baseRentByCity[formData.region] ?? 0;
        }

        const size = Number(formData.size) || 0;
        let sizeFactor = 1.0;
        if (multipliers?.size) {
            if (size < 45) sizeFactor = multipliers.size['<45'];
            else if (size < 60) sizeFactor = multipliers.size['<60'];
            else if (size < 90) sizeFactor = multipliers.size['<90'];
            else if (size < 120) sizeFactor = multipliers.size['<120'];
            else sizeFactor = multipliers.size['>=120'];
        } else {
            if (size < 45) sizeFactor = 1.25;
            else if (size < 60) sizeFactor = 1.10;
            else if (size < 90) sizeFactor = 1.00;
            else if (size < 120) sizeFactor = 0.90;
            else sizeFactor = 0.70;
        }

        const bedrooms = Number(formData.bedrooms) || 0;
        let bedroomFactor = 0.90;
        if (multipliers?.bedroom) {
            if (bedrooms === 0) bedroomFactor = multipliers.bedroom['Studio'];
            else if (bedrooms === 1) bedroomFactor = multipliers.bedroom['1 Bedroom'];
            else if (bedrooms === 2) bedroomFactor = multipliers.bedroom['2 Bedrooms'];
            else if (bedrooms >= 3) bedroomFactor = multipliers.bedroom['3+ Bedrooms'];
        } else {
            if (bedrooms === 0) bedroomFactor = 1.10;
            else if (bedrooms === 1) bedroomFactor = 1.00;
            else if (bedrooms === 2) bedroomFactor = 0.95;
            else if (bedrooms >= 3) bedroomFactor = 0.90;
        }

        // Location Factor (area type)
        let locationFactor = 1.0;
        if (multipliers?.location) {
            locationFactor = multipliers.location[formData.areaType] ?? 1.0;
        } else {
            const locationFactorMap: Record<string, number> = { Centre: 1.25, 'Semi-Centre': 1.05, 'Outside Centre': 0.85 };
            locationFactor = locationFactorMap[formData.areaType] ?? 1.0;
        }

        // Year Built Factor
        const year = Number(formData.yearBuilt) || 0;
        let yearBuiltFactor = 0.95; // default "Other / >30y"
        const age = new Date().getFullYear() - year;
        if (multipliers?.yearBuilt) {
            if (age <= 2) yearBuiltFactor = multipliers.yearBuilt['<=2'];
            else if (age > 2 && age <= 5) yearBuiltFactor = multipliers.yearBuilt['3-5'];
            else if (age > 5 && age <= 15) yearBuiltFactor = multipliers.yearBuilt['6-15'];
            else if (age > 15 && age <= 30) yearBuiltFactor = multipliers.yearBuilt['16-30'];
            else yearBuiltFactor = multipliers.yearBuilt['>30'];
        } else {
            if (age <= 2) yearBuiltFactor = 1.07;
            else if (age > 2 && age <= 5) yearBuiltFactor = 1.03;
            else if (age > 5 && age <= 15) yearBuiltFactor = 1.00;
            else if (age > 15 && age <= 30) yearBuiltFactor = 0.90;
            else yearBuiltFactor = 0.95;
        }

        // Outside Area Factor
        let outsideAreaFactor = 1.00;
        if (multipliers?.outsideArea) {
            outsideAreaFactor = multipliers.outsideArea[formData.outdoorSpace] ?? 1.00;
        } else {
            const outsideAreaFactorMap: Record<string, number> = { None: 1.00, Balcony: 1.05, Garden: 1.05 };
            outsideAreaFactor = outsideAreaFactorMap[formData.outdoorSpace] ?? 1.00;
        }

        // Parking Factor
        let parkingFactor = 1.00;
        if (multipliers?.parking) {
            if (formData.hasParking === true) parkingFactor = multipliers.parking['Yes'];
            else if (formData.hasParking === false) parkingFactor = multipliers.parking['No'];
        } else {
            if (formData.hasParking === true) parkingFactor = 1.05;
            else if (formData.hasParking === false) parkingFactor = 0.95;
        }

        // Energy Label Factor
        let energyFactor = 0.95;
        if (multipliers?.energy) {
            energyFactor = multipliers.energy[formData.energyLabel] ?? 0.95;
        } else {
            const energyFactorMap: Record<string, number> = { A: 1.10, B: 1.00, C: 0.95, D: 0.90, E: 0.85, F: 0.80, G: 0.80 };
            energyFactor = energyFactorMap[formData.energyLabel] ?? 0.95;
        }

        // Elevator Factor
        let elevatorFactor = 1.00;
        if (multipliers?.elevator) {
            if (formData.hasElevator === 'yes') elevatorFactor = multipliers.elevator['Yes'];
            else if (formData.hasElevator === 'no') elevatorFactor = multipliers.elevator['No'];
        } else {
            if (formData.hasElevator === 'yes') elevatorFactor = 1.00;
            else if (formData.hasElevator === 'no') elevatorFactor = 0.95;
        }

        // Finish Factor (property condition)
        let finishFactor = 0.90;
        if (multipliers?.finish) {
            finishFactor = multipliers.finish[formData.propertyCondition] ?? 0.90;
        } else {
            const finishFactorMap: Record<string, number> = {
                'High-End': 1.15, Premium: 1.10, Good: 1.05, Standard: 1.00, Outdated: 0.95, 'In need of renovation': 0.90
            };
            finishFactor = finishFactorMap[formData.propertyCondition] ?? 0.90;
        }

        const finalRent = Math.round(
            baseRent *
            size *
            sizeFactor *
            bedroomFactor *
            locationFactor *
            yearBuiltFactor *
            outsideAreaFactor *
            parkingFactor *
            energyFactor *
            elevatorFactor *
            finishFactor
        );

        if (finalRent > 0 && finalRent !== formData.estimatedRent && !rentFromPropertyRef.current) {
            setFormData((prev) => ({ ...prev, estimatedRent: finalRent }));
        }
    }, [
        formData.country,
        formData.region,
        formData.size,
        formData.bedrooms,
        formData.areaType,
        formData.propertyCondition,
        formData.yearBuilt,
        formData.outdoorSpace,
        formData.hasParking,
        formData.energyLabel,
        formData.hasElevator,
        regionsList,
        multipliers
    ]);

    useEffect(() => {
        const price = searchParams.get('price');
        const rent = searchParams.get('rent');
        const location = searchParams.get('location');
        const beds = searchParams.get('beds');
        const sqm = searchParams.get('sqm');
        const propertyId = searchParams.get('propertyId');

        if (propertyId) {
            setSelectedPropertyId(propertyId);
        }

        if (price || rent || location) {
            if (rent) {
                rentFromPropertyRef.current = true;
            }
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
        const purchasePrice = Number(formData.purchasePrice) || 0;
        const renovationCost = Number(formData.renovationCost) || 0;
        const estimatedRent = Number(formData.estimatedRent) || 0;
        const downPayment = Number(formData.downPayment) || 0;
        const interestRate = Number(formData.interestRate) || 0;
        const mortgageTerm = Number(formData.mortgageTerm) || 0;
        const appreciationRate = Number(formData.appreciationRate) || 0;
        const annualIncomeGrowthRate = Number(formData.annualIncomeGrowthRate) || 0;
        const timeHorizon = Number(formData.timeHorizon) || 20;

        const totalPurchase = purchasePrice + renovationCost;

        // Determine Scenario
        let scenario: 'investor' | 'resident' | 'exemption' = 'investor';
        if (formData.isRental) {
            const meetsPrice = estimatedRent <= 2300;
            const meetsDuration = (Number(formData.contractDuration) || 0) >= 36;
            if (meetsPrice && meetsDuration && formData.listedAfter6Months && formData.rentConditionsMet) {
                scenario = 'exemption';
            } else {
                scenario = 'investor';
            }
        } else {
            scenario = 'resident';
        }

        const breakdown = calculateAcquisitionBreakdown(
            purchasePrice,
            scenario,
            formData.country,
            formData.region,
            formData.propertyType
        );
        const { totalCosts } = breakdown;
        const acquisitionCosts = (breakdown.imt || 0) + (breakdown.stampDuty || 0) + (breakdown.legalFees || 0) + (breakdown.notaryFees || 0) + (breakdown.iva || 0) + (breakdown.ajd || 0);

        const totalCapitalNeeded = purchasePrice + renovationCost + totalCosts;
        const annualRent = estimatedRent * 12;

        const opexBreakdown = {
            vacancy: formData.opexOverrides.vacancy ?? (annualRent * (Number(formData.vacancyRate || 0) / 100)),
            maintenance: formData.opexOverrides.maintenance ?? (annualRent * (Number(formData.maintenanceRate || 0) / 100)),
            capex: formData.opexOverrides.capex ?? (annualRent * (Number(formData.capexRate || 0) / 100)),
            insurance: formData.opexOverrides.insurance ?? (annualRent * (Number(formData.insuranceRate || 0) / 100)),
            propertyTax: formData.opexOverrides.propertyTax ?? (annualRent * (Number(formData.propertyTaxRate || 0) / 100)),
            condo: formData.opexOverrides.condo ?? (annualRent * (Number(formData.condoFeeRate || 0) / 100)),
            management: formData.opexOverrides.management ?? (annualRent * (Number(formData.managementFeeRate || 0) / 100)),
            admin: formData.opexOverrides.admin ?? (annualRent * (Number(formData.adminRate || 0) / 100)),
        };

        const totalOpex = Object.values(opexBreakdown).reduce<number>((acc, val) => acc + Number(val || 0), 0);
        const netAnnualIncome = annualRent - totalOpex;

        const baseForLoan = purchasePrice + (formData.financeRenovation ? renovationCost : 0);
        const loanAmount = Math.max(0, baseForLoan - downPayment);
        const ltv = (loanAmount / (baseForLoan || 1)) * 100;
        const monthlyRate = interestRate / 100 / 12;
        const months = mortgageTerm * 12;
        let monthlyAnnuity = 0;
        if (monthlyRate > 0) {
            monthlyAnnuity = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
        } else {
            monthlyAnnuity = months > 0 ? loanAmount / months : 0;
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
        const cashOnCashReturn = (profitAfterMortgage / (cashInvested || 1)) * 100;

        const yearlyAppreciationValue = purchasePrice * (appreciationRate / 100);
        const roeIncl = ((
            (formData.includeCashFlowROI ? profitAfterMortgage : 0) +
            (formData.includePrincipalROI ? yearlyPrincipal : 0) +
            (formData.includeAppreciationROI ? yearlyAppreciationValue : 0)
        ) / (cashInvested || 1)) * 100;
        const currentROE = roeIncl;
        const yearlyEquityGrowth = (formData.includePrincipalROI ? yearlyPrincipal : 0) + (formData.includeAppreciationROI ? yearlyAppreciationValue : 0);

        const effectiveMonthlyAnnuity = formData.monthlyPaymentOverride ?? monthlyAnnuity;
        const horizon = timeHorizon;
        let currentVal = purchasePrice + renovationCost;
        let currentAnnualRent = annualRent;
        let currentAnnualOpex = totalOpex;
        let currentLoanBalance = loanAmount;
        let isLoanPaidOff = false;

        let cumulativeCashFlow = 0;
        let cumulativeAppreciation = 0;
        let cumulativePrincipal = 0;

        const startingProfit = formData.monthlyCashFlowOverride !== null
            ? (formData.monthlyCashFlowOverride * 12)
            : (currentAnnualRent - currentAnnualOpex - (formData.includeMortgage ? (yearlyInterest + yearlyPrincipal) : 0));

        const projection = Array.from({ length: horizon + 1 }, (_, year) => {
            const yearResult = {
                year,
                propertyValue: currentVal,
                remainingLoan: currentLoanBalance,
                isLoanPaidOff,
                cumulativeCashFlow,
                cumulativeAppreciation,
                cumulativePrincipal,
                equity: (currentVal - currentLoanBalance),
                totalReturn: cumulativeCashFlow + cumulativeAppreciation + cumulativePrincipal
            };

            if (year < horizon) {
                // 1. Calculate Appreciation
                const yearlyAppreciation = currentVal * (appreciationRate / 100);
                cumulativeAppreciation += yearlyAppreciation;
                currentVal += yearlyAppreciation;

                // 2. Calculate Mortgage
                let yearlyPrincipalPaid = 0;
                let yearlyInterestPaid = 0;
                for (let m = 0; m < 12; m++) {
                    if (currentLoanBalance > 0) {
                        const mInterest = currentLoanBalance * monthlyRate;
                        const mPrincipal = Math.min(currentLoanBalance, effectiveMonthlyAnnuity - mInterest);
                        yearlyInterestPaid += mInterest;
                        yearlyPrincipalPaid += mPrincipal;
                        currentLoanBalance -= mPrincipal;
                        if (currentLoanBalance <= 0) isLoanPaidOff = true;
                    }
                }
                cumulativePrincipal += yearlyPrincipalPaid;

                // 3. Calculate Cash Flow (Dynamic based on settings)
                const yearlyMortgagePayment = formData.includeMortgage
                    ? (yearlyInterestPaid + yearlyPrincipalPaid)
                    : 0;

                const yearlyProfit = year === 0
                    ? startingProfit
                    : (currentAnnualRent - currentAnnualOpex - yearlyMortgagePayment);

                cumulativeCashFlow += yearlyProfit;

                currentAnnualRent *= (1 + annualIncomeGrowthRate / 100);
                currentAnnualOpex *= (1 + annualIncomeGrowthRate / 100);
            }

            return yearResult;
        });

        const finalYear = projection[horizon];

        // Dynamic calculations based on toggles
        const dynamicProfit =
            (formData.includeCashFlowROI ? finalYear.cumulativeCashFlow : 0) +
            (formData.includeAppreciationROI ? finalYear.cumulativeAppreciation : 0) +
            (formData.includePrincipalROI ? finalYear.cumulativePrincipal : 0);

        const totalHorizonProfit = dynamicProfit;
        const avgAnnualReturn = (totalHorizonProfit / (cashInvested || 1) / (horizon || 1)) * 100;
        const totalReturnMultiple = (totalHorizonProfit + cashInvested) / (cashInvested || 1);

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
            grossYield: ((annualRent / (totalCapitalNeeded || 1)) * 100),
            netYield: ((netAnnualIncome / (totalCapitalNeeded || 1)) * 100),
            cashOnCash: (cashInvested > 0 ? (profitAfterMortgage / cashInvested) * 100 : 0),
            loanToTac: (totalCapitalNeeded > 0 ? (loanAmount / totalCapitalNeeded) * 100 : 0),
            currentROE: safeNum(currentROE),
            yearlyEquityGrowth: safeNum(yearlyEquityGrowth),
            totalHorizonProfit: safeNum(totalHorizonProfit),
            totalReturnMultiple: safeNum(totalReturnMultiple),
            avgAnnualReturn: safeNum(avgAnnualReturn),
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

    const handleSave = async () => {
        if (!isAuthenticated) {
            Swal.fire({
                title: 'Login Required',
                text: 'Please login to save your calculations.',
                icon: 'info',
                confirmButtonText: 'Login',
                showCancelButton: true
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = `/login?callback=${encodeURIComponent(window.location.pathname)}`;
                }
            });
            return;
        }

        const { value: name } = await Swal.fire({
            title: 'Save Analysis',
            input: 'text',
            inputLabel: 'Give this analysis a name',
            inputValue: `Analysis: ${formData.country} - ${formData.region}`,
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return 'Please enter a name'
                }
            }
        });

        if (name) {
            try {
                await saveCalculation({
                    name,
                    inputData: formData,
                    resultsData: results,
                    propertyId: selectedPropertyId || undefined
                }).unwrap();

                Swal.fire({
                    title: 'Saved!',
                    text: 'This analysis is now in your dashboard history.',
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });
            } catch (error) {
                Swal.fire('Error', 'Failed to save calculation', 'error');
            }
        }
    };

    const handleInquire = async () => {
        if (!selectedPropertyId) {
            Swal.fire('Info', 'Please select a property to inquire about.', 'info');
            return;
        }

        if (!isAuthenticated) {
            Swal.fire('Info', 'Please login to contact an agent.', 'info');
            return;
        }

        const selectedProp = propertiesData?.data?.find((p: any) => p.id === selectedPropertyId);

        try {
            // 1. Save the calculation first
            const savedCalc = await saveCalculation({
                name: `Inquiry: ${selectedProp?.title || 'Property'}`,
                inputData: formData,
                resultsData: results,
                propertyId: selectedPropertyId
            }).unwrap();

            // If the agent is NOT registered on our platform
            if (selectedProp && selectedProp.isAgentRegistered === false) {
                if (selectedProp.externalListingUrl) {
                    Swal.fire({
                        title: 'Redirecting to Agent',
                        text: 'This agent is not yet on our platform. We saved your calculation and will now redirect you to their website.',
                        icon: 'info',
                        confirmButtonColor: '#34495E',
                        confirmButtonText: 'Continue to Website'
                    }).then(() => {
                        window.open(selectedProp.externalListingUrl, '_blank');
                    });
                } else if (selectedProp.externalContactPhone || selectedProp.externalContactEmail) {
                    Swal.fire({
                        title: 'Agent Contact Info',
                        html: `
                            <p>This agent is not yet on our platform. Your calculation has been saved in your history.</p>
                            <br/>
                            <p><strong>Phone:</strong> ${selectedProp.externalContactPhone || 'N/A'}</p>
                            <p><strong>Email:</strong> ${selectedProp.externalContactEmail || 'N/A'}</p>
                        `,
                        icon: 'info',
                        confirmButtonColor: '#34495E'
                    });
                } else {
                    Swal.fire({
                        title: 'Agent Not Available',
                        text: 'This property does not have a registered agent or contact information.',
                        icon: 'warning',
                        confirmButtonColor: '#34495E'
                    });
                }
                return;
            }

            // 2. Create the internal lead if the agent is registered
            await createLead({
                propertyId: selectedPropertyId,
                calculationId: savedCalc.data.calculation.id,
                message: `Inquiry from Calculator: ${formData.country} analysis attached.`
            }).unwrap();

            Swal.fire({
                title: 'Inquiry Sent!',
                text: 'The agent has received your analysis and will contact you soon.',
                icon: 'success',
                confirmButtonColor: '#34495E'
            });
        } catch (error) {
            Swal.fire('Error', 'Failed to send inquiry', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: 'Delete Analysis?',
            text: "This will permanently remove this saved calculation.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#rose-600',
            confirmButtonText: 'Yes, delete it'
        });

        if (result.isConfirmed) {
            try {
                await deleteCalculation(id).unwrap();
                Swal.fire({
                    title: 'Deleted!',
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });
            } catch (error) {
                Swal.fire('Error', 'Failed to delete analysis', 'error');
            }
        }
    };

    const getStatusColor = (value: number, isActive: boolean) => {
        if (!isActive) return 'text-stone-300';
        if (value > 0) return 'text-emerald-600';
        if (value < 0) return 'text-rose-600';
        return 'text-stone-400';
    };



    // MOCK LOGIC: For testing purposes until backend is ready.
    // Set MOCK_FULL_ACCESS to true to simulate a user with PRO/PREMIUM plan.
    const MOCK_FULL_ACCESS = true;
    // const MOCK_FULL_ACCESS = false; 

    const hasFullAccess = useMemo(() => {
        if (MOCK_FULL_ACCESS) return true;

        // Future-proof logic: Align with backend SubscriptionPlan enum
        const currentPlan = user?.subscription?.planType || user?.plan;
        return currentPlan === 'INVESTOR_PRO' || currentPlan === 'INVESTOR_PREMIUM';
    }, [user, MOCK_FULL_ACCESS]);

    const steps: { id: Step; label: string; locked: boolean }[] = useMemo(() => [
        { id: 'rent_estimate', label: 'Rent Estimate', locked: false },
        { id: 'gross_yield', label: 'Gross Yield', locked: false },
        { id: 'net_profit', label: 'Net Profit', locked: !hasFullAccess },
        { id: 'roi', label: 'Cash ROI', locked: !hasFullAccess },
        { id: 'projection', label: '20Y Forecast', locked: !hasFullAccess },
    ], [hasFullAccess]);

    return (
        <>
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
                                        onClick={() => !s.locked && setStep(s.id)}
                                        className={cn(
                                            "p-4 rounded-2xl flex items-center gap-3 transition-all",
                                            step === s.id ? "bg-[#D4A373] text-white shadow-xl shadow-[#D4A373]/20" : "bg-stone-50 text-stone-400 border border-stone-100",
                                            s.locked && "opacity-50 cursor-not-allowed"
                                        )}
                                    >
                                        <span className="text-xs font-black">0{i + 1}</span>
                                        {s.locked && <Lock className="size-3" />}
                                        {step === s.id && <span className="font-black text-[10px] tracking-tight whitespace-nowrap">{s.label}</span>}
                                    </button>
                                    {i < 4 && <div className="w-4 h-px bg-stone-200" />}
                                </div>
                            ))}
                        </div>

                        <div className="bg-white border border-stone-100 rounded-[48px] p-8 md:p-12 shadow-2xl shadow-stone-200/40">


                            <div>
                                {step === 'rent_estimate' && (
                                    <div className="space-y-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h4 className="text-xl font-black text-stone-900 mb-2 tracking-tight">Stage 1: Location & rent estimate</h4>
                                                <p className="text-stone-500 text-sm font-bold flex items-center gap-2 italic"><Sparkles className="size-4 text-[#D4A373]" /> Estimate your rental income first.</p>
                                            </div>
                                            <div className="p-1 bg-stone-100 rounded-xl flex gap-1 h-fit">
                                                <button onClick={() => setMode('simple')} className={`px-3 py-1.5 rounded-lg text-[9px] font-black tracking-tight transition-all ${mode === 'simple' ? 'bg-white text-[#34495E] shadow-sm' : 'text-stone-400'}`}>Simple</button>
                                                <button onClick={() => setMode('advanced')} className={`px-3 py-1.5 rounded-lg text-[9px] font-black tracking-tight transition-all ${mode === 'advanced' ? 'bg-white text-[#34495E] shadow-sm' : 'text-stone-400'}`}>Advanced</button>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="grid md:grid-cols-3 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-stone-400 ml-2">Country</label>
                                                    <select value={formData.country} onChange={(e) => {
                                                        const newCountry = e.target.value;
                                                        const filteredRegions = regionsList.filter(r => r.country.name === newCountry);
                                                        const firstRegion = filteredRegions.length > 0 ? filteredRegions[0].name : '';
                                                        setFormData({ ...formData, country: newCountry, region: firstRegion });
                                                    }} className="w-full bg-stone-50 rounded-2xl p-4 font-black outline-none border-2 border-transparent focus:border-[#34495E]">
                                                        {Array.from(new Set(regionsList.map(r => r.country.name))).map(cName => (
                                                            <option key={cName as string} value={cName as string}>{cName as string}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-stone-400 ml-2">Region</label>
                                                    <select
                                                        value={formData.region}
                                                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                                        className="w-full bg-stone-50 rounded-2xl p-4 font-black outline-none border-2 border-transparent focus:border-[#34495E]"
                                                    >
                                                        {regionsList.filter(r => r.country.name === formData.country).map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-stone-400 ml-2 uppercase tracking-widest">Area Type</label>
                                                    <select
                                                        value={formData.areaType}
                                                        onChange={(e) => setFormData({ ...formData, areaType: e.target.value })}
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
                                                    <input type="number" value={formData.bedrooms} onChange={(e) => handleNumberChange('bedrooms', e.target.value)} onFocus={(e) => e.target.select()} onBlur={() => handleBlur('bedrooms', 1)} className="w-full bg-stone-50 rounded-2xl p-5 font-black text-xl outline-none border-2 border-transparent focus:border-[#34495E]" />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-xs font-bold text-stone-400 ml-2">Property size (sqm)</label>
                                                    <input type="number" value={formData.size} onChange={(e) => handleNumberChange('size', e.target.value)} onFocus={(e) => e.target.select()} onBlur={() => handleBlur('size', 60)} className="w-full bg-stone-50 rounded-2xl p-5 font-black text-xl outline-none border-2 border-transparent focus:border-[#34495E]" />
                                                </div>
                                            </div>
                                        </div>


                                        {mode === 'advanced' && (
                                            <div className="space-y-8 pt-4 border-t border-stone-50">
                                                <div className="grid md:grid-cols-3 gap-6">
                                                    <div className="space-y-3">
                                                        <label className="text-xs font-bold text-stone-400 ml-2">Year built</label>
                                                        <input type="number" value={formData.yearBuilt} onChange={(e) => handleNumberChange('yearBuilt', e.target.value)} onFocus={(e) => e.target.select()} onBlur={() => handleBlur('yearBuilt', 2020)} className="w-full bg-stone-50 rounded-2xl p-4 font-black outline-none border-2 border-transparent focus:border-[#34495E]" />
                                                    </div>
                                                </div>
                                                <div className="grid md:grid-cols-3 gap-6">
                                                    <div className="space-y-3">
                                                        <label className="text-xs font-bold text-stone-400 ml-2 uppercase tracking-widest">Property Condition</label>
                                                        <select value={formData.propertyCondition} onChange={(e) => setFormData({ ...formData, propertyCondition: e.target.value })} className="w-full bg-stone-50 rounded-2xl p-4 font-black outline-none border-2 border-stone-100 focus:border-[#D4A373] transition-colors">
                                                            {['In need of renovation', 'Outdated', 'Basic', 'Standard', 'Good', 'Premium', 'High-End'].map(opt => (
                                                                <option key={opt} value={opt}>{opt}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-xs font-bold text-stone-400 ml-2 uppercase tracking-widest">Outdoor Space</label>
                                                        <select value={formData.outdoorSpace} onChange={(e) => setFormData({ ...formData, outdoorSpace: e.target.value })} className="w-full bg-stone-50 rounded-2xl p-4 font-black outline-none border-2 border-stone-100 focus:border-[#D4A373] transition-colors">
                                                            {['None', 'Balcony', 'Garden'].map(opt => (
                                                                <option key={opt} value={opt}>{opt}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-xs font-bold text-stone-400 ml-2 uppercase tracking-widest">Energy label</label>
                                                        <select value={formData.energyLabel} onChange={(e) => setFormData({ ...formData, energyLabel: e.target.value })} className="w-full bg-stone-50 rounded-2xl p-4 font-black outline-none border-2 border-stone-100 focus:border-[#D4A373] transition-colors">
                                                            {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(l => <option key={l} value={l}>{l}</option>)}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="grid md:grid-cols-3 gap-6">
                                                    <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-100 group cursor-pointer hover:border-[#D4A373]/30 transition-colors">
                                                        <input type="checkbox" id="parking" checked={formData.hasParking} onChange={(e) => setFormData({ ...formData, hasParking: e.target.checked })} className="size-5 accent-[#D4A373] cursor-pointer" />
                                                        <label htmlFor="parking" className="text-xs font-bold text-stone-900 cursor-pointer">Parking Included</label>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-xs font-bold text-stone-400 ml-2 uppercase tracking-widest">Elevator</label>
                                                        <select value={formData.hasElevator} onChange={(e) => setFormData({ ...formData, hasElevator: e.target.value as 'yes' | 'no' | 'not_applicable' })} className="w-full bg-stone-50 rounded-2xl p-4 font-black outline-none border-2 border-stone-100 focus:border-[#D4A373] transition-colors">
                                                            <option value="yes">Yes</option>
                                                            <option value="no">No</option>
                                                            <option value="not_applicable">Not applicable</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* <div className="p-6 bg-[#34495E]/5 border border-[#34495E]/10 rounded-3xl flex items-center justify-between">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Model Predicted Rent</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-3xl font-black text-[#34495E]">€{formData.estimatedRent || 0}</span>
                                                <span className="text-xs font-bold text-stone-400">/month</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] font-black text-[#D4A373] uppercase tracking-widest mb-1">Confidence Score</div>
                                            <div className="flex gap-1 justify-end">
                                                {[1, 2, 3, 4].map(i => <div key={i} className="w-4 h-1.5 rounded-full bg-[#D4A373]" />)}
                                                <div className="w-4 h-1.5 rounded-full bg-stone-200" />
                                            </div>
                                        </div>
                                    </div> */}

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
                                                <input type="number" value={formData.purchasePrice} onChange={(e) => handleNumberChange('purchasePrice', e.target.value)} onFocus={(e) => e.target.select()} onBlur={() => handleBlur('purchasePrice', 350000)}
                                                    className="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl px-6 py-5 outline-none focus:border-[#D4A373] focus:bg-white transition-all text-2xl font-black"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-[#D4A373] ml-2">Renovation Costs (€)</label>
                                                <div className="relative">
                                                    <input type="number" value={formData.renovationCost} onChange={(e) => handleNumberChange('renovationCost', e.target.value)} onFocus={(e) => e.target.select()} onBlur={() => handleBlur('renovationCost', 0)}
                                                        className="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl px-6 py-5 outline-none focus:border-[#D4A373] focus:bg-white transition-all text-2xl font-black"
                                                        placeholder="Mandatory entry"
                                                    />
                                                </div>
                                                <label className="flex items-center gap-2 mt-2 ml-2 cursor-pointer w-fit">
                                                    <input type="checkbox" checked={formData.financeRenovation} onChange={(e) => setFormData({ ...formData, financeRenovation: e.target.checked })} className="accent-[#D4A373] size-4 rounded" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Finance with Bank Loan?</span>
                                                </label>
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
                                                            onClick={() => formData.country === 'Spain' ? setFormData({ ...formData, propertyType: 'resale' }) : setFormData({ ...formData, isRental: true })}
                                                            className={cn(
                                                                "flex-1 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest border-2 transition-all",
                                                                (formData.country === 'Spain' ? formData.propertyType === 'resale' : formData.isRental) ? "bg-[#2C3E50] text-white border-[#2C3E50]" : "bg-white text-stone-400 border-stone-100"
                                                            )}
                                                        >
                                                            {formData.country === 'Spain' ? 'Resale' : 'Yes'}
                                                        </button>
                                                        <button
                                                            onClick={() => formData.country === 'Spain' ? setFormData({ ...formData, propertyType: 'new_build' }) : setFormData({ ...formData, isRental: false })}
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
                                                            <input type="checkbox" checked={(Number(formData.estimatedRent) || 0) <= 2300} readOnly className="size-5 accent-[#D4A373]" />
                                                            <label className="text-xs font-bold text-stone-900 leading-tight">Rental price ≤ €2,300/month (Auto-calculated)</label>
                                                        </div>
                                                        <div className="flex items-center gap-4 p-4 bg-white border border-stone-100 rounded-2xl group cursor-pointer" onClick={() => setFormData({ ...formData, rentConditionsMet: !formData.rentConditionsMet })}>
                                                            <input type="checkbox" checked={formData.rentConditionsMet} readOnly className="size-5 accent-[#2C3E50]" />
                                                            <label className="text-xs font-bold text-stone-900 leading-tight cursor-pointer">36-month minimum rental contract (within first 5 years)</label>
                                                        </div>
                                                        <div className="flex items-center gap-4 p-4 bg-white border border-stone-100 rounded-2xl group cursor-pointer" onClick={() => setFormData({ ...formData, listedAfter6Months: !formData.listedAfter6Months })}>
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
                                                        <div className="text-4xl font-black text-[#D4A373]">{results.grossYield.toFixed(1)}%</div>
                                                    </div>
                                                </div>

                                                <div className="mt-8 pt-8 border-t border-stone-100 flex justify-between items-center">
                                                    <div className="text-[10px] font-black text-[#D4A373] uppercase tracking-widest flex flex-col gap-1.5">
                                                        <div className="flex items-center gap-2 opacity-70">
                                                            {formData.country === 'Spain' ? (formData.region === 'Las Palmas (Gran Canaria)' ? 'IGIC' : (formData.propertyType === 'resale' ? 'ITP' : 'IVA + AJD')) : 'IMT'}: €{Math.round(results.imt || results.itp || results.igic || (results.iva + results.ajd)).toLocaleString()}
                                                            <span className="text-[8px] lowercase font-bold italic tracking-normal">(Included in Total Sunk Costs)</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            Total Sunk Costs: €{Math.round(results.totalCapitalNeeded - (Number(formData.purchasePrice) || 0) - (Number(formData.renovationCost) || 0)).toLocaleString()}
                                                        </div>
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
                                                                        {results.breakdown.igic > 0 ? 'The IGIC tax in Las Palmas is 7%.' : `The ITP tax in ${formData.region} is ${(results.breakdown.itp / (Number(formData.purchasePrice) || 1) * 100).toFixed(1)}%.`}
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
                                                                        The AJD (Actos Jurídicos Documentados) is {(results.breakdown.ajd / (Number(formData.purchasePrice) || 1) * 100).toFixed(1)}%.
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
                                                        <span className="text-lg font-black text-[#D4A373]">€{Math.round(results.totalCapitalNeeded - Number(formData.purchasePrice) - Number(formData.renovationCost)).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-4 pt-6">
                                            <button onClick={() => setStep('rent_estimate')} className="btn-secondary px-6 shrink-0"> <ChevronLeft className="size-6" /> </button>
                                            {hasFullAccess ? (
                                                <button onClick={() => setStep('net_profit')} className="btn-primary flex-grow group !bg-[#34495E]">
                                                    Analyze Net Cash Flow Logic
                                                </button>
                                            ) : (
                                                <Link href="/pricing" className="flex-grow">
                                                    <button className="btn-primary w-full group !bg-[#2C3E50] flex items-center justify-center gap-2">
                                                        <Lock className="size-4" />
                                                        Unlock Pro to Continue
                                                    </button>
                                                </Link>
                                            )}
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
                                                                                            value={formData.opexOverrides[item.key] ?? ''}
                                                                                            placeholder={Math.round((results.opexBreakdown as any)[item.key]).toString()}
                                                                                            onChange={(e) => setFormData({
                                                                                                ...formData,
                                                                                                opexOverrides: { ...formData.opexOverrides, [item.key]: e.target.value }
                                                                                            })}
                                                                                            onFocus={(e) => e.target.select()}
                                                                                            onBlur={() => {
                                                                                                const val = formData.opexOverrides[item.key];
                                                                                                if (val === '' || val === null || isNaN(Number(val))) {
                                                                                                    const nextOverrides = { ...formData.opexOverrides };
                                                                                                    delete nextOverrides[item.key];
                                                                                                    setFormData({ ...formData, opexOverrides: nextOverrides });
                                                                                                } else {
                                                                                                    setFormData({
                                                                                                        ...formData,
                                                                                                        opexOverrides: { ...formData.opexOverrides, [item.key]: Number(val) }
                                                                                                    });
                                                                                                }
                                                                                                setEditingOpex(null);
                                                                                            }}
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

                                                <div className={cn(
                                                    "transition-all rounded-[32px]",
                                                    formData.includeMortgage
                                                        ? "p-8 bg-white border border-stone-100 shadow-xl shadow-stone-200/40"
                                                        : "p-4 bg-transparent"
                                                )}>
                                                    <div className="flex items-center gap-2 mb-4 group cursor-pointer" onClick={() => setFormData({ ...formData, includeMortgage: !formData.includeMortgage })}>
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
                                                                        <input type="number" value={formData.downPayment} onChange={(e) => handleNumberChange('downPayment', e.target.value)} onFocus={(e) => e.target.select()} onBlur={() => handleBlur('downPayment', 105000)} className="w-full bg-stone-50 p-3 rounded-xl font-black text-sm outline-none border border-transparent focus:border-[#34495E]" />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Interest Rate (%)</label>
                                                                        <input type="number" step="0.1" value={formData.interestRate} onChange={(e) => handleNumberChange('interestRate', e.target.value)} onFocus={(e) => e.target.select()} onBlur={() => handleBlur('interestRate', 3.5)} className="w-full bg-stone-50 p-3 rounded-xl font-black text-sm outline-none border border-transparent focus:border-[#34495E]" />
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
                                                                        onChange={(e) => setFormData({ ...formData, includePrincipal: e.target.checked })}
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
                                                                            <span className="text-[9px] font-black text-[#D4A373] uppercase tracking-widest">Monthly Repayment</span>
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
                                                results.profitAfterMortgage > 0
                                                    ? "bg-emerald-600 shadow-emerald-600/20"
                                                    : results.profitAfterMortgage < 0
                                                        ? "bg-rose-600 shadow-rose-600/20"
                                                        : "bg-stone-400 shadow-stone-400/20"
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
                                            <button onClick={() => setStep('rent_estimate')} className="btn-secondary px-6 shrink-0"> <ChevronLeft className="size-6" /> </button>
                                            {hasFullAccess ? (
                                                <button onClick={() => setStep('roi')} className="btn-primary flex-grow group !bg-[#D4A373]">
                                                    Move to ROI Metrics <ChevronRight className="size-5 ml-2 inline transition-transform" />
                                                </button>
                                            ) : (
                                                <Link href="/pricing" className="flex-grow">
                                                    <button className="btn-primary w-full group !bg-[#2C3E50] flex items-center justify-center gap-2">
                                                        <Lock className="size-4" />
                                                        Unlock Pro for ROI Metrics
                                                    </button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {step === 'roi' && (
                                    <div className="space-y-8">
                                        <div>
                                            <h4 className="text-xl font-black text-stone-900 mb-1 tracking-tight uppercase">Stage 4: Capital Return (ROI)</h4>
                                            <p className="text-stone-400 text-[10px] font-bold italic uppercase tracking-widest leading-relaxed">Efficiency of your deployed capital.</p>
                                        </div>

                                        <div className="flex flex-col lg:flex-row gap-4">
                                            {/* Left: Investment Summary */}
                                            <div className="lg:w-[280px] shrink-0 p-6 bg-white rounded-[32px] border border-stone-100 shadow-sm space-y-8 h-fit">
                                                <h5 className="text-[10px] font-black uppercase tracking-widest text-stone-400 whitespace-nowrap">Investment Summary</h5>
                                                <div className="space-y-8">
                                                    <div className="flex justify-between items-center gap-4">
                                                        <div className="flex items-center gap-2 shrink-0">
                                                            <span className="text-xs font-bold text-stone-900 whitespace-nowrap">Total Project Cost</span>
                                                            <div className="group/tpc relative">
                                                                <Info className="size-3.5 text-stone-300 cursor-help" />
                                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-[#2C3E50] text-white text-[9px] font-bold rounded-xl opacity-0 group-hover/tpc:opacity-100 transition-opacity z-50 pointer-events-none whitespace-normal text-center">
                                                                    {TOOLTIP_CONTENT.tac}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <span className="text-xl font-black text-stone-900 whitespace-nowrap">€{Math.round(results.totalCapitalNeeded).toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center gap-4">
                                                        <span className="text-xs font-bold text-stone-900 whitespace-nowrap shrink-0">Mortgage Loan</span>
                                                        <span className="text-xl font-black text-[#D4A373] whitespace-nowrap">-€{Math.round(Number(formData.purchasePrice) - (Number(formData.downPayment) || 0)).toLocaleString()}</span>
                                                    </div>
                                                    <div className="pt-10 border-t border-stone-100 flex justify-between items-center gap-4">
                                                        <div className="flex flex-col gap-1 shrink-0">
                                                            <span className="text-sm font-black text-stone-900 whitespace-nowrap">My Cash Invested</span>
                                                            <span className="text-[10px] text-stone-400 font-bold whitespace-nowrap">(Down Payment + Costs)</span>
                                                        </div>
                                                        <span className="text-xl font-black text-stone-900 whitespace-nowrap">€{Math.round(results.cashInvested).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right: Build Your Return */}
                                            <div className="flex-grow min-w-0 p-6 bg-white rounded-[32px] border border-stone-100 shadow-sm relative">
                                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-12">
                                                    <div className="space-y-1">
                                                        <h5 className="text-[10px] font-black uppercase tracking-widest text-stone-900 whitespace-nowrap">Build Your Return</h5>
                                                        <p className="text-[10px] font-bold text-stone-400 italic leading-tight max-w-[200px]">Customize what's included in your Total Return on My Cash.</p>
                                                    </div>

                                                    {/* ROI Gauge */}
                                                    <div className="relative size-24 shrink-0 flex items-center justify-center sm:-mt-4 self-center sm:self-auto">
                                                        <svg className="size-full -rotate-90 transform" viewBox="0 0 100 100">
                                                            <circle cx="50" cy="50" r="42" fill="transparent" stroke="#F5F5F4" strokeWidth="8" />
                                                            <circle
                                                                cx="50" cy="50" r="42" fill="transparent" stroke="#D4A373" strokeWidth="8"
                                                                strokeDasharray={`${(Math.min(results.currentROE, 30) / 30) * 263.8} 263.8`}
                                                                strokeLinecap="round"
                                                                className="transition-all duration-1000"
                                                            />
                                                        </svg>
                                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                            <span className="text-xl font-black text-stone-900">{results.currentROE.toFixed(1)}%</span>
                                                        </div>
                                                        <div className="absolute -bottom-2 whitespace-nowrap flex items-center gap-1">
                                                            <span className="text-[8px] font-black uppercase text-stone-400 tracking-tighter">Total Return on My Cash</span>
                                                            <div className="group/roe relative">
                                                                <Info className="size-2 text-stone-300 cursor-help" />
                                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-[#2C3E50] text-white text-[9px] font-bold rounded-xl opacity-0 group-hover/roe:opacity-100 transition-opacity z-50 pointer-events-none whitespace-normal text-center">
                                                                    {TOOLTIP_CONTENT.roe}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                    {/* Cash Flow Row */}
                                                    <div className="flex items-center gap-3 pb-6 border-b border-stone-50">
                                                        <button
                                                            onClick={() => setFormData({ ...formData, includeCashFlowROI: !formData.includeCashFlowROI })}
                                                            className={cn(
                                                                "w-10 h-5 rounded-full transition-all relative shrink-0",
                                                                formData.includeCashFlowROI ? "bg-[#D4A373]" : "bg-stone-200"
                                                            )}
                                                        >
                                                            <div className={cn("size-3 bg-white rounded-full absolute top-1 transition-all", formData.includeCashFlowROI ? "right-1" : "left-1")} />
                                                        </button>
                                                        <div className="size-8 bg-[#D4A373]/10 rounded-full flex items-center justify-center shrink-0">
                                                            <TrendingUp className="size-4 text-[#D4A373]" />
                                                        </div>
                                                        <div className="flex-grow flex justify-between items-center gap-4 min-w-0">
                                                            <div className="min-w-0">
                                                                <div className="text-[10px] font-black text-stone-900 whitespace-nowrap">Include Cash Flow</div>
                                                                <div className="text-[9px] text-stone-400 font-bold leading-tight">From rental income after expenses</div>
                                                            </div>
                                                            <span className="text-xs font-black text-stone-900 whitespace-nowrap shrink-0">€{Math.round(results.profitAfterMortgage).toLocaleString()}</span>
                                                        </div>
                                                    </div>

                                                    {/* Appreciation Row */}
                                                    <div className="flex items-center gap-3 pb-6 border-b border-stone-50">
                                                        <button
                                                            onClick={() => setFormData({ ...formData, includeAppreciationROI: !formData.includeAppreciationROI })}
                                                            className={cn(
                                                                "w-10 h-5 rounded-full transition-all relative shrink-0",
                                                                formData.includeAppreciationROI ? "bg-[#D4A373]" : "bg-stone-200"
                                                            )}
                                                        >
                                                            <div className={cn("size-3 bg-white rounded-full absolute top-1 transition-all", formData.includeAppreciationROI ? "right-1" : "left-1")} />
                                                        </button>
                                                        <div className="size-8 bg-[#D4A373]/10 rounded-full flex items-center justify-center shrink-0">
                                                            <ArrowUpRight className="size-4 text-[#D4A373]" />
                                                        </div>
                                                        <div className="flex-grow space-y-2 overflow-visible min-w-0">
                                                            <div className="flex justify-between items-center gap-4">
                                                                <div className="min-w-0">
                                                                    <div className="text-[10px] font-black text-stone-900 whitespace-nowrap">Include Appreciation</div>
                                                                    <div className="text-[9px] text-stone-400 font-bold leading-tight">Est. annual property appreciation</div>
                                                                </div>
                                                                <div className="px-2 py-1 bg-stone-50 rounded-lg border border-stone-100 text-[10px] font-black text-[#D4A373] whitespace-nowrap">{Number(formData.appreciationRate || 0).toFixed(1)}%</div>
                                                            </div>
                                                            <div className="relative pt-2">
                                                                <input
                                                                    type="range"
                                                                    min="-2"
                                                                    max="10"
                                                                    step="0.5"
                                                                    value={formData.appreciationRate}
                                                                    onChange={(e) => handleNumberChange('appreciationRate', e.target.value)}
                                                                    className="w-full accent-[#D4A373] h-1 bg-stone-100 rounded-lg appearance-none cursor-pointer"
                                                                />
                                                                <div className="flex justify-between mt-2">
                                                                    <span className="text-[9px] font-bold text-stone-300">-2%</span>
                                                                    <span className="text-[9px] font-bold text-stone-300">3%</span>
                                                                    <span className="text-[9px] font-bold text-stone-300">10%</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Loan Paydown Row */}
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => setFormData({ ...formData, includePrincipalROI: !formData.includePrincipalROI })}
                                                            className={cn(
                                                                "w-10 h-5 rounded-full transition-all relative shrink-0",
                                                                formData.includePrincipalROI ? "bg-[#D4A373]" : "bg-stone-200"
                                                            )}
                                                        >
                                                            <div className={cn("size-3 bg-white rounded-full absolute top-1 transition-all", formData.includePrincipalROI ? "right-1" : "left-1")} />
                                                        </button>
                                                        <div className="size-8 bg-[#D4A373]/10 rounded-full flex items-center justify-center shrink-0">
                                                            <Building2 className="size-4 text-[#D4A373]" />
                                                        </div>
                                                        <div className="flex-grow space-y-2 overflow-visible min-w-0">
                                                            <div className="flex justify-between items-center gap-4">
                                                                <div className="min-w-0">
                                                                    <div className="text-[10px] font-black text-stone-900 whitespace-nowrap">Include Loan Paydown</div>
                                                                    <div className="text-[9px] text-stone-400 font-bold leading-tight">From mortgage principal repayment</div>
                                                                </div>
                                                                <div className="px-2 py-1 bg-stone-50 rounded-lg border border-stone-100 text-[10px] font-black text-[#D4A373] whitespace-nowrap">€{Math.round(results.yearlyPrincipal).toLocaleString()}</div>
                                                            </div>
                                                            <div className="relative pt-2">
                                                                <div className="h-1 bg-stone-100 rounded-lg w-full relative">
                                                                    <div className="absolute top-1/2 left-[40%] -translate-y-1/2 size-3 bg-white border-2 border-[#D4A373] rounded-full shadow-sm" />
                                                                </div>
                                                                <div className="flex justify-between mt-2">
                                                                    <span className="text-[9px] font-bold text-stone-300">€200</span>
                                                                    <span className="text-[9px] font-bold text-stone-300">€1,100</span>
                                                                    <span className="text-[9px] font-bold text-stone-300">€2,500</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-8 bg-[#0F172A] text-white rounded-[32px] flex flex-col xl:flex-row items-center justify-between gap-8 relative overflow-hidden border border-white/5">
                                            <div className="flex-1 flex items-center gap-4">
                                                <div className="size-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center shadow-inner shrink-0">
                                                    <TrendingUp className="size-5 text-[#D4A373]" />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 whitespace-nowrap">Total Return on My Cash</div>
                                                    <div className="text-3xl font-black text-[#D4A373] whitespace-nowrap">{results.currentROE.toFixed(1)}%</div>
                                                    <p className="text-[9px] text-white/30 font-bold max-w-xs leading-relaxed mt-1">
                                                        Annual return on the cash you invest, based on your selected items above.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="hidden xl:block w-px h-24 bg-white/10" />

                                            <div className="flex-1 flex items-center gap-4">
                                                <div className="size-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center shadow-inner shrink-0">
                                                    <BarChart2 className="size-5 text-white" />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 whitespace-nowrap">Wealth Growth / Year</div>
                                                    <div className="text-3xl font-black text-white whitespace-nowrap">€{Math.round(results.yearlyEquityGrowth).toLocaleString()}</div>
                                                    <p className="text-[9px] text-white/30 font-bold max-w-xs leading-relaxed mt-1">
                                                        Increase in your equity each year from appreciation and loan paydown.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Legal Note */}
                                        <div className="flex items-center justify-center gap-3 text-[10px] font-black text-stone-400 uppercase tracking-widest opacity-60">
                                            <Info className="size-3.5" />
                                            Your returns update in real time based on the assumptions and selections above.
                                        </div>

                                        <div className="flex gap-4 pt-4">
                                            <button onClick={() => setStep('net_profit')} className="btn-secondary px-6 shrink-0"> <ChevronLeft className="size-6" /> </button>
                                            {hasFullAccess ? (
                                                <button onClick={() => setStep('projection')} className="btn-primary flex-grow group !bg-[#0F172A]">
                                                    View {Number(formData.timeHorizon) || 0}Y Forecast <ChevronRight className="size-5 ml-2 inline transition-transform" />
                                                </button>
                                            ) : (
                                                <Link href="/pricing" className="flex-grow">
                                                    <button className="btn-primary w-full group !bg-[#2C3E50] flex items-center justify-center gap-2">
                                                        <Lock className="size-4" />
                                                        Unlock Pro for 20Y Forecast
                                                    </button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                )}


                                {step === 'projection' && (
                                    <div className="space-y-12">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div>
                                                <h4 className="text-2xl font-black text-stone-900 mb-2 tracking-tight uppercase">Stage 5: Long-Term Projection</h4>
                                                <p className="text-stone-400 text-xs font-bold leading-relaxed">
                                                    See how your investment grows over time based on your assumptions.
                                                </p>
                                            </div>
                                            <div className="flex gap-2 bg-stone-100 p-1 rounded-xl">
                                                {[10, 15, 20, 30, 35].map(yr => (
                                                    <button
                                                        key={yr}
                                                        onClick={() => setFormData({ ...formData, timeHorizon: yr })}
                                                        className={cn(
                                                            "px-4 py-1.5 rounded-lg text-[10px] font-black transition-all",
                                                            Number(formData.timeHorizon) === yr ? "bg-[#2C3E50] text-white shadow-lg" : "text-stone-400 hover:text-stone-600"
                                                        )}
                                                    >
                                                        {yr}Y
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid lg:grid-cols-12 gap-10">
                                            {/* Left: Adjust Your Assumptions */}
                                            <div className="lg:col-span-7 space-y-6">
                                                <h5 className="text-[10px] font-black uppercase tracking-widest text-stone-400">Adjust Your Assumptions</h5>
                                                <div className="p-8 bg-white rounded-[32px] border border-stone-100 shadow-sm space-y-10 relative">
                                                    <div className="space-y-10">
                                                        {/* Include Cash Flow */}
                                                        <div className="space-y-4 pb-10 border-b border-stone-50">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="size-10 bg-[#D4A373]/10 rounded-full flex items-center justify-center">
                                                                        <Wallet className="size-5 text-[#D4A373]" />
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        <button
                                                                            onClick={() => setFormData({ ...formData, includeCashFlowROI: !formData.includeCashFlowROI })}
                                                                            className={cn(
                                                                                "w-12 h-6 rounded-full transition-all relative shrink-0",
                                                                                formData.includeCashFlowROI ? "bg-[#D4A373]" : "bg-stone-200"
                                                                            )}
                                                                        >
                                                                            <div className={cn("size-4.5 bg-white rounded-full absolute top-0.75 transition-all shadow-sm", formData.includeCashFlowROI ? "right-0.75" : "left-0.75")} />
                                                                        </button>
                                                                        <div>
                                                                            <div className="text-[11px] font-black text-stone-900 uppercase tracking-widest">Include Cash Flow</div>
                                                                            <div className="text-[9px] text-stone-400 font-bold">From rental income</div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Include Appreciation */}
                                                        <div className="space-y-4 pb-10 border-b border-stone-50">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="size-10 bg-[#D4A373]/10 rounded-full flex items-center justify-center">
                                                                        <ArrowUpRight className="size-5 text-[#D4A373]" />
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        <button
                                                                            onClick={() => setFormData({ ...formData, includeAppreciationROI: !formData.includeAppreciationROI })}
                                                                            className={cn(
                                                                                "w-12 h-6 rounded-full transition-all relative shrink-0",
                                                                                formData.includeAppreciationROI ? "bg-[#D4A373]" : "bg-stone-200"
                                                                            )}
                                                                        >
                                                                            <div className={cn("size-4.5 bg-white rounded-full absolute top-0.75 transition-all shadow-sm", formData.includeAppreciationROI ? "right-0.75" : "left-0.75")} />
                                                                        </button>
                                                                        <div>
                                                                            <div className="text-[11px] font-black text-stone-900 uppercase tracking-widest">Include Appreciation</div>
                                                                            <div className="text-[9px] text-stone-400 font-bold">Property value growth</div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <button onClick={() => setEditModeAppreciation(!editModeAppreciation)}>
                                                                    <Pencil className={cn("size-4 transition-colors", editModeAppreciation ? "text-[#D4A373]" : "text-stone-300")} />
                                                                </button>
                                                            </div>
                                                            <div className="space-y-2 pl-14">
                                                                <div className="flex justify-between items-center mb-1">
                                                                    <span className="text-[10px] font-black text-stone-900 uppercase tracking-tight">Annual Appreciation</span>
                                                                    {!editModeAppreciation && <span className="text-[11px] font-black text-[#D4A373]">{Number(formData.appreciationRate || 0).toFixed(1)}%</span>}
                                                                </div>
                                                                {editModeAppreciation ? (
                                                                    <div className="relative">
                                                                        <input
                                                                            type="number"
                                                                            value={formData.appreciationRate}
                                                                            onChange={(e) => handleNumberChange('appreciationRate', e.target.value)}
                                                                            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#D4A373]/20"
                                                                        />
                                                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-sm">%</span>
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <input
                                                                            type="range"
                                                                            min="-2"
                                                                            max="10"
                                                                            step="0.5"
                                                                            value={formData.appreciationRate}
                                                                            onChange={(e) => handleNumberChange('appreciationRate', e.target.value)}
                                                                            className="w-full accent-[#D4A373] h-1 bg-stone-100 rounded-lg appearance-none cursor-pointer"
                                                                        />
                                                                        <div className="flex justify-between">
                                                                            <span className="text-[9px] font-bold text-stone-300">-2%</span>
                                                                            <span className="text-[9px] font-bold text-stone-300">6%</span>
                                                                            <span className="text-[9px] font-bold text-stone-300">10%</span>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Include Loan Paydown */}
                                                        <div className="space-y-4">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="size-10 bg-[#D4A373]/10 rounded-full flex items-center justify-center">
                                                                        <Building2 className="size-5 text-[#D4A373]" />
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        <button
                                                                            onClick={() => setFormData({ ...formData, includePrincipalROI: !formData.includePrincipalROI })}
                                                                            className={cn(
                                                                                "w-12 h-6 rounded-full transition-all relative shrink-0",
                                                                                formData.includePrincipalROI ? "bg-[#D4A373]" : "bg-stone-200"
                                                                            )}
                                                                        >
                                                                            <div className={cn("size-4.5 bg-white rounded-full absolute top-0.75 transition-all shadow-sm", formData.includePrincipalROI ? "right-0.75" : "left-0.75")} />
                                                                        </button>
                                                                        <div>
                                                                            <div className="text-[11px] font-black text-stone-900 uppercase tracking-widest">Include Loan Paydown</div>
                                                                            <div className="text-[9px] text-stone-400 font-bold">From mortgage principal repayment</div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <button onClick={() => setEditModeLoanPaydown(!editModeLoanPaydown)}>
                                                                    <Pencil className={cn("size-4 transition-colors", editModeLoanPaydown ? "text-[#D4A373]" : "text-stone-300")} />
                                                                </button>
                                                            </div>
                                                            <div className="space-y-2 pl-14">
                                                                <div className="flex justify-between items-center mb-1">
                                                                    <span className="text-[10px] font-black text-stone-900 uppercase tracking-tight">Monthly Loan Payment</span>
                                                                    {!editModeLoanPaydown && <span className="text-[11px] font-black text-stone-900">€{(formData.monthlyPaymentOverride ?? Math.round(results.mortgageCosts / 12)).toLocaleString()}</span>}
                                                                </div>
                                                                {editModeLoanPaydown ? (
                                                                    <div className="relative">
                                                                        <input
                                                                            type="number"
                                                                            value={formData.monthlyPaymentOverride ?? Math.round(results.mortgageCosts / 12)}
                                                                            onChange={(e) => setFormData({ ...formData, monthlyPaymentOverride: Number(e.target.value) })}
                                                                            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#D4A373]/20"
                                                                        />
                                                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-sm">€</span>
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <input
                                                                            type="range"
                                                                            min="200"
                                                                            max="2500"
                                                                            step="50"
                                                                            value={formData.monthlyPaymentOverride ?? Math.round(results.mortgageCosts / 12)}
                                                                            onChange={(e) => setFormData({ ...formData, monthlyPaymentOverride: Number(e.target.value) })}
                                                                            className="w-full accent-[#D4A373] h-1 bg-stone-100 rounded-lg appearance-none cursor-pointer"
                                                                        />
                                                                        <div className="flex justify-between">
                                                                            <span className="text-[9px] font-bold text-stone-300">€200</span>
                                                                            <span className="text-[9px] font-bold text-stone-300">€{Math.round(results.mortgageCosts / 12).toLocaleString()}</span>
                                                                            <span className="text-[9px] font-bold text-stone-300">€2,500</span>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <button onClick={() => setDetailedAssumptionsModalOpen(true)} className="flex items-center gap-2 text-[#D4A373] pt-6 mt-6 border-t border-stone-50 w-full group">
                                                        <Settings className="size-4 group-hover:rotate-45 transition-transform" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Edit detailed assumptions</span>
                                                        <ChevronRight className="size-3 ml-auto" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Right: About This Projection */}
                                            <div className="lg:col-span-5 space-y-6">
                                                <h5 className="text-[10px] font-black uppercase tracking-widest text-stone-400">About This Projection</h5>
                                                <div className="p-8 bg-white rounded-[32px] border border-stone-100 shadow-sm space-y-6">
                                                    <div className="flex items-center gap-2 text-[#D4A373] group relative w-fit">
                                                        <Info className="size-4" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">About this projection</span>
                                                        <div className="absolute bottom-full left-0 mb-2 w-48 p-3 bg-[#2C3E50] text-white text-[9px] font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                                                            This projection uses compounded annual growth rates and amortized loan schedules to forecast your equity over time.
                                                        </div>
                                                    </div>
                                                    <p className="text-xs font-bold text-stone-500 leading-relaxed">
                                                        Your long-term results are based on the assumptions you've set. Toggle items on or off to see how each factor impacts your total return.
                                                    </p>
                                                    <div className="space-y-4 pt-4 border-t border-stone-50">
                                                        <div className="flex items-center gap-3">
                                                            <div className={cn("w-3 h-3 min-w-[12px] rounded-sm transition-opacity shrink-0", formData.includeCashFlowROI ? "bg-[#2C3E50]" : "bg-[#2C3E50]/20")} />
                                                            <span className={cn("text-[10px] font-black uppercase transition-colors", formData.includeCashFlowROI ? "text-stone-900" : "text-stone-300")}>CASH FLOW (RENT)</span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <div className={cn("w-3 h-3 min-w-[12px] rounded-sm transition-opacity shrink-0", formData.includeAppreciationROI ? "bg-[#D4A373]" : "bg-[#D4A373]/20")} />
                                                            <span className={cn("text-[10px] font-black uppercase transition-colors", formData.includeAppreciationROI ? "text-stone-900" : "text-stone-300")}>APPRECIATION (PROPERTY VALUE GROWTH)</span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <div className={cn("w-3 h-3 min-w-[12px] rounded-sm transition-opacity shrink-0", formData.includePrincipalROI ? "bg-[#D4A373]/40" : "bg-[#D4A373]/10")} />
                                                            <span className={cn("text-[10px] font-black uppercase transition-colors", formData.includePrincipalROI ? "text-stone-900" : "text-stone-300")}>LOAN PAYDOWN (PRINCIPAL REPAYMENT)</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Middle: Chart */}
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-end">
                                                <h5 className="text-[10px] font-black uppercase tracking-widest text-stone-400">Projected Equity & Value Over Time</h5>
                                                <div className="flex items-center gap-2 text-[#D4A373] cursor-pointer group/breakdown">
                                                    <span className="text-[9px] font-black uppercase tracking-widest group-hover/breakdown:underline">Show breakdown</span>
                                                    <ChevronDown className="size-3" />
                                                </div>
                                            </div>
                                            <div className="relative h-[340px] bg-white rounded-[40px] border border-stone-100 p-10 pr-6 overflow-hidden shadow-sm flex flex-col">
                                                <div className="flex-grow flex relative">
                                                    {/* Y-Axis Labels */}
                                                    <div className="absolute inset-y-0 left-0 flex flex-col justify-between text-[8px] font-black text-stone-300 uppercase h-full py-0.5">
                                                        {(() => {
                                                            const horizon = Number(formData.timeHorizon) || 0;
                                                            const cashInvested = results.cashInvested || 0;
                                                            // Find the highest bar: Cash Invested + All Gains
                                                            const maxBarValue = results.projection.reduce((max, p) => {
                                                                const currentTotal = cashInvested +
                                                                    (formData.includeCashFlowROI ? Math.max(0, p.cumulativeCashFlow) : 0) +
                                                                    (formData.includeAppreciationROI ? Math.max(0, p.cumulativeAppreciation) : 0) +
                                                                    (formData.includePrincipalROI ? Math.max(0, p.cumulativePrincipal) : 0);
                                                                return Math.max(max, currentTotal);
                                                            }, 0);
                                                            const maxVal = Math.max(100, maxBarValue * 1.1);
                                                            return (
                                                                <>
                                                                    <span>€{(Math.round(maxVal / 1000)).toLocaleString()}K</span>
                                                                    <span>€{(Math.round((maxVal * 0.75) / 1000)).toLocaleString()}K</span>
                                                                    <span>€{(Math.round((maxVal * 0.5) / 1000)).toLocaleString()}K</span>
                                                                    <span>€{(Math.round((maxVal * 0.25) / 1000)).toLocaleString()}K</span>
                                                                    <span>€0</span>
                                                                </>
                                                            );
                                                        })()}
                                                    </div>

                                                    {/* Grid Lines */}
                                                    <div className="absolute inset-0 ml-12 flex flex-col justify-between pointer-events-none">
                                                        {[...Array(5)].map((_, i) => (
                                                            <div key={i} className="w-full border-t border-dashed border-stone-100" />
                                                        ))}
                                                    </div>

                                                    {/* Bars Container */}
                                                    <div className="flex-grow ml-12 flex items-end gap-1.5 sm:gap-2 h-full relative z-10">
                                                        {results.projection.map((p, i) => {
                                                            const horizon = Number(formData.timeHorizon) || 0;
                                                            const cashInvested = results.cashInvested || 0;
                                                            let shouldShow = true;

                                                            if (!shouldShow && i !== 0) return null;

                                                            const maxBarValue = results.projection.reduce((max, proj) => {
                                                                const currentTotal = cashInvested +
                                                                    (formData.includeCashFlowROI ? Math.max(0, proj.cumulativeCashFlow) : 0) +
                                                                    (formData.includeAppreciationROI ? Math.max(0, proj.cumulativeAppreciation) : 0) +
                                                                    (formData.includePrincipalROI ? Math.max(0, proj.cumulativePrincipal) : 0);
                                                                return Math.max(max, currentTotal);
                                                            }, 0);
                                                            const maxVal = Math.max(100, maxBarValue * 1.1);

                                                            const hCashFlow = formData.includeCashFlowROI ? (Math.max(0, p.cumulativeCashFlow) / maxVal) * 100 : 0;
                                                            const hAppreciation = formData.includeAppreciationROI ? (Math.max(0, p.cumulativeAppreciation) / maxVal) * 100 : 0;
                                                            // Principal segment includes the initial cash invested to show baseline equity
                                                            const hPrincipal = formData.includePrincipalROI ? ((cashInvested + p.cumulativePrincipal) / maxVal) * 100 : (cashInvested / maxVal) * 100;

                                                            return (
                                                                <div key={i} className="flex-grow flex flex-col justify-end group/bar relative h-full items-center">
                                                                    <div className="w-full flex flex-col justify-end h-full gap-0.5 max-w-[32px]">
                                                                        {/* Top: Principal & Initial Equity (Tan) */}
                                                                        <div
                                                                            className="w-full bg-[#D4A373]/40 rounded-t-[2px] transition-all hover:brightness-95"
                                                                            style={{ height: `${hPrincipal}%`, minHeight: hPrincipal > 0 ? '2px' : '0' }}
                                                                        />
                                                                        {/* Middle: Appreciation (Orange) */}
                                                                        <div
                                                                            className="w-full bg-[#D4A373] transition-all hover:brightness-95"
                                                                            style={{ height: `${hAppreciation}%`, minHeight: hAppreciation > 0 ? '2px' : '0' }}
                                                                        />
                                                                        {/* Bottom: Cash Flow (Navy) */}
                                                                        <div
                                                                            className="w-full bg-[#2C3E50] rounded-b-[2px] transition-all hover:brightness-95"
                                                                            style={{ height: `${hCashFlow}%`, minHeight: hCashFlow > 0 ? '2px' : '0' }}
                                                                        />
                                                                    </div>
                                                                    <span className="absolute top-full mt-4 text-[8px] font-black text-stone-300 uppercase whitespace-nowrap">
                                                                        {i === 0 ? "Year 0" : `Year ${i}`}
                                                                    </span>
                                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-stone-900 text-white text-[9px] font-black px-3 py-1.5 rounded-xl opacity-0 group-hover/bar:opacity-100 transition-all scale-90 group-hover/bar:scale-100 whitespace-nowrap z-50 shadow-xl">
                                                                        Total: €{Math.round(cashInvested + (formData.includeCashFlowROI ? p.cumulativeCashFlow : 0) + (formData.includeAppreciationROI ? p.cumulativeAppreciation : 0) + (formData.includePrincipalROI ? p.cumulativePrincipal : 0)).toLocaleString()}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom: Metrics */}
                                        <div className="grid md:grid-cols-3 gap-8">
                                            <div className="p-6 bg-white border border-stone-100 rounded-[32px] shadow-sm relative overflow-hidden transition-all hover:shadow-md">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="size-11 bg-[#D4A373]/10 rounded-full flex items-center justify-center shrink-0">
                                                        <TrendingUp className="size-5 text-[#D4A373]" />
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <div className="text-[9px] font-black text-stone-400 uppercase tracking-widest leading-tight">Total Profit</div>
                                                        <div className="text-[9px] font-black text-stone-400 uppercase tracking-widest leading-tight">({Number(formData.timeHorizon) || 0} Years)</div>
                                                    </div>
                                                </div>
                                                <div className="text-2xl font-black text-stone-900 tracking-tight leading-none mb-3">€{Math.round(results.totalHorizonProfit).toLocaleString()}</div>
                                                <p className="text-[9px] text-stone-400 font-bold leading-relaxed">Total profit after all costs and loan repayment.</p>
                                            </div>

                                            <div className="p-6 bg-white border border-stone-100 rounded-[32px] shadow-sm transition-all hover:shadow-md">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="size-11 bg-[#2C3E50]/10 rounded-full flex items-center justify-center shrink-0">
                                                        <Percent className="size-5 text-[#2C3E50]" />
                                                    </div>
                                                    <div className="space-y-0.5 text-[9px] font-black text-stone-400 uppercase tracking-widest leading-tight">
                                                        <div>Average Annual</div>
                                                        <div>Return</div>
                                                    </div>
                                                </div>
                                                <div className="text-2xl font-black text-stone-900 tracking-tight leading-none mb-3">{results.avgAnnualReturn.toFixed(1)}%</div>
                                                <p className="text-[9px] text-stone-400 font-bold leading-relaxed">Average annual return on your cash invested.</p>
                                            </div>

                                            <div className="p-6 bg-white border border-stone-100 rounded-[32px] shadow-sm transition-all hover:shadow-md">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="size-11 bg-[#D4A373]/10 rounded-full flex items-center justify-center shrink-0">
                                                        <PieChart className="size-5 text-[#D4A373]" />
                                                    </div>
                                                    <div className="space-y-0.5 text-[9px] font-black text-stone-400 uppercase tracking-widest leading-tight">
                                                        <div>Total Return</div>
                                                        <div>Multiple</div>
                                                    </div>
                                                </div>
                                                <div className="text-2xl font-black text-stone-900 tracking-tight leading-none mb-3">{results.totalReturnMultiple.toFixed(2)}x</div>
                                                <p className="text-[9px] text-stone-400 font-bold leading-relaxed">Your total return compared to your cash invested.</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 pt-6">
                                            <button onClick={() => setStep('roi')} className="btn-secondary px-6 shrink-0"> <ChevronLeft className="size-6" /> </button>
                                            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 text-[9px] font-black text-stone-400 uppercase tracking-widest text-center flex-grow flex items-center justify-center gap-2 italic">
                                                <Info className="size-3" /> All values are in today's money (inflation-adjusted).
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
                                            <div className={cn(
                                                "text-4xl font-black tracking-tighter",
                                                getStatusColor(Number(formData.estimatedRent) || 0, true)
                                            )}>
                                                €{(Number(formData.estimatedRent) || 0).toLocaleString()}<span className="text-lg text-stone-300 ml-2">/mo</span>
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
                                                    getStatusColor(results.grossYield, (step === 'gross_yield' || step === 'net_profit' || step === 'roi' || step === 'projection'))
                                                )}>
                                                    {results.grossYield.toFixed(1)}<span className="text-lg text-stone-200 ml-2">%</span>
                                                </div>
                                                <div className={cn(
                                                    "text-sm font-bold tracking-tight",
                                                    getStatusColor(results.totalCapitalNeeded, (step === 'gross_yield' || step === 'net_profit' || step === 'roi' || step === 'projection'))
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
                                                    getStatusColor(results.profitAfterMortgage, (step === 'net_profit' || step === 'roi' || step === 'projection'))
                                                )}>
                                                    €{Math.round(results.profitAfterMortgage / 12).toLocaleString()}<span className="text-lg ml-2">/mo</span>
                                                </div>
                                                <div className={cn(
                                                    "text-sm font-bold tracking-tight opacity-70",
                                                    getStatusColor(results.profitAfterMortgage, (step === 'net_profit' || step === 'roi' || step === 'projection'))
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
                                                getStatusColor(results.cashOnCash, (step === 'roi' || step === 'projection'))
                                            )}>
                                                {results.cashOnCash.toFixed(1)}<span className="text-lg ml-2">%</span>
                                            </div>
                                        </div>

                                        {/* Phase 5: Forecast */}
                                        <div className={cn(
                                            "p-6 rounded-3xl transition-all border",
                                            (step === 'projection')
                                                ? "bg-white border-[#2C3E50]/20 shadow-lg"
                                                : "bg-stone-50/30 border-transparent opacity-50"
                                        )}>
                                            <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest block mb-2">Phase 5: Avg. Annual Return</span>
                                            <div className={cn(
                                                "text-4xl font-black tracking-tighter",
                                                getStatusColor(results.avgAnnualReturn, (step === 'projection'))
                                            )}>
                                                {results.avgAnnualReturn.toFixed(1)}<span className="text-lg ml-2">%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-4 pt-6 border-t border-stone-100">
                                        <button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="w-full py-4 bg-[#D4A373] text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-[#D4A373]/20 hover:opacity-90 transition-all flex items-center justify-center gap-2"
                                        >
                                            {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                                            Save Analysis to Dashboard
                                        </button>

                                        <div className="space-y-3 pt-4 border-t border-stone-50">
                                            <p className="text-[9px] font-black uppercase text-stone-400 tracking-widest">Inquire with Agent</p>
                                            <select
                                                value={selectedPropertyId}
                                                onChange={(e) => setSelectedPropertyId(e.target.value)}
                                                className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-[10px] font-bold text-stone-600 outline-none cursor-pointer"
                                            >
                                                <option value="">Select Property...</option>
                                                {propertiesData?.data?.map((p: any) => (
                                                    <option key={p.id} value={p.id}>{p.title}</option>
                                                ))}
                                            </select>
                                            <button
                                                onClick={handleInquire}
                                                disabled={isCreatingLead || !selectedPropertyId}
                                                className="w-full py-4 bg-[#2C3E50] text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-[#34495E] transition-all disabled:opacity-50"
                                            >
                                                {isCreatingLead ? <Loader2 className="size-4 animate-spin mx-auto" /> : "Send Analysis to Agent"}
                                            </button>
                                        </div>

                                        {!hasFullAccess && (
                                            <Link href="/pricing" className="block w-full pt-4">
                                                <button className="w-full py-5 bg-stone-50 text-[#2C3E50] font-black rounded-2xl hover:bg-stone-100 transition-all tracking-widest text-[9px] uppercase border border-stone-200 flex items-center justify-center gap-2">
                                                    <Sparkles className="size-4 text-[#D4A373]" />
                                                    Unlock All Pro Features
                                                </button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Saved History Section */}
                {isAuthenticated && (
                    <section className="mt-20 pt-20 border-t border-stone-100 space-y-10">
                        <div className="flex items-center gap-4">
                            <div className="size-12 bg-stone-100 rounded-2xl flex items-center justify-center text-[#2C3E50]">
                                <HistoryIcon className="size-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-[#2C3E50] uppercase tracking-tight">Saved Analyses</h3>
                                <p className="text-stone-400 font-bold text-xs uppercase tracking-widest">Your previous investment calculations</p>
                            </div>
                        </div>

                        {isLoadingHistory ? (
                            <div className="flex justify-center py-12"><Loader2 className="size-8 animate-spin text-stone-200" /></div>
                        ) : historyData?.data?.calculations?.length === 0 ? (
                            <div className="p-20 text-center bg-stone-50 rounded-[48px] border border-dashed border-stone-200">
                                <p className="text-stone-400 font-bold text-xs uppercase tracking-widest italic">No saved analyses found in your profile</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {historyData?.data?.calculations?.map((calc: any) => (
                                    <div
                                        key={calc.id}
                                        className="bg-white p-6 rounded-[32px] border border-stone-100 shadow-sm hover:shadow-xl hover:shadow-stone-200/20 transition-all group relative"
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <h4 className="font-black text-[#2C3E50] text-sm group-hover:text-[#D4A373] transition-colors line-clamp-1">{calc.name}</h4>
                                            <button
                                                onClick={() => handleDelete(calc.id)}
                                                className="p-2 text-stone-200 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 mb-6">
                                            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100/50">
                                                <p className="text-[8px] font-black text-stone-400 uppercase mb-1 tracking-widest">Yield</p>
                                                <p className="text-sm font-black text-[#34495E]">
                                                    {Number(calc.resultsData.grossYield ?? calc.resultsData.yield ?? 0).toFixed(1)}%
                                                </p>
                                            </div>
                                            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100/50">
                                                <p className="text-[8px] font-black text-stone-400 uppercase mb-1 tracking-widest">Profit/Yr</p>
                                                <p className="text-sm font-black text-emerald-600">
                                                    €{Math.round(calc.resultsData.profitAfterMortgage ?? calc.resultsData.annualProfit ?? 0).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-stone-50">
                                            <div className="flex items-center gap-2 text-stone-300">
                                                <Clock className="size-3" />
                                                <span className="text-[9px] font-bold">{new Date(calc.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    // Load into form - simple version just logs or alerts for now
                                                    // Implementing a full 'load' would require updating all formData
                                                    Swal.fire({
                                                        title: 'Load Analysis',
                                                        text: 'Do you want to load these parameters into the calculator?',
                                                        icon: 'question',
                                                        showCancelButton: true,
                                                        confirmButtonText: 'Yes, Load Data'
                                                    }).then(result => {
                                                        if (result.isConfirmed) {
                                                            setFormData({
                                                                ...formData,
                                                                ...calc.inputData
                                                            });
                                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                                        }
                                                    });
                                                }}
                                                className="text-[9px] font-black text-[#D4A373] uppercase tracking-widest hover:underline"
                                            >
                                                Load Data
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}
            </div>

            {/* Detailed Assumptions Modal */}
            <AnimatePresence>
                {isDetailedAssumptionsModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        {/* Backdrop */}
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDetailedAssumptionsModalOpen(false)} />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto p-8 space-y-6"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-black text-stone-900 uppercase tracking-tight">Detailed Assumptions</h3>
                                    <p className="text-[10px] text-stone-400 font-bold">Adjust advanced settings for your projection</p>
                                </div>
                                <button
                                    onClick={() => setDetailedAssumptionsModalOpen(false)}
                                    className="size-10 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors"
                                >
                                    <X className="size-4 text-stone-500" />
                                </button>
                            </div>

                            {/* Fields */}
                            <div className="space-y-4">
                                {[
                                    { label: 'Vacancy Rate', key: 'vacancyRate', suffix: '%', description: 'Expected vacancy as % of annual rent' },
                                    { label: 'Maintenance', key: 'maintenanceRate', suffix: '%', description: 'Maintenance costs as % of annual rent' },
                                    { label: 'CapEx Reserve', key: 'capexRate', suffix: '%', description: 'Capital expenditure reserve as % of rent' },
                                    { label: 'Insurance', key: 'insuranceRate', suffix: '%', description: 'Insurance as % of annual rent' },
                                    { label: 'Property Tax (IMI)', key: 'propertyTaxRate', suffix: '%', description: 'Annual property tax as % of rent' },
                                    { label: 'Condo Fee', key: 'condoFeeRate', suffix: '%', description: 'Condo/building fee as % of rent' },
                                    { label: 'Management Fee', key: 'managementFeeRate', suffix: '%', description: 'Property management as % of rent' },
                                    { label: 'Admin / Other', key: 'adminRate', suffix: '%', description: 'Administrative costs as % of rent' },
                                    { label: 'Annual Income Growth', key: 'annualIncomeGrowthRate', suffix: '%', description: 'Expected annual growth of rental income' },
                                ].map((field) => (
                                    <div key={field.key} className="flex items-center justify-between gap-4 py-3 border-b border-stone-50 last:border-0">
                                        <div className="flex-1">
                                            <div className="text-[11px] font-black text-stone-900 uppercase tracking-wider">{field.label}</div>
                                            <div className="text-[9px] text-stone-400 font-bold">{field.description}</div>
                                        </div>
                                        <div className="relative w-24">
                                            <input
                                                type="number"
                                                value={(formData as any)[field.key]}
                                                onChange={(e) => handleNumberChange(field.key, e.target.value)}
                                                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm font-bold text-stone-900 text-right pr-7 focus:outline-none focus:ring-2 focus:ring-[#D4A373]/20"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-xs">{field.suffix}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <button
                                onClick={() => setDetailedAssumptionsModalOpen(false)}
                                className="w-full py-3 bg-[#2C3E50] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#1a252f] transition-colors"
                            >
                                Apply & Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}





