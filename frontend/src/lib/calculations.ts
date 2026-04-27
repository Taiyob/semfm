/**
 * Hofman Horizon Financial Engine
 * 
 * Logic for calculating Property Transfer Tax (IMT), Stamp Duty, 
 * and total acquisition costs for European real estate investments.
 */

export interface IMTBracket {
  limit: number;
  rate: number;
  deduction: number;
}

export const PORTUGAL_RESIDENTIAL_IMT_BRACKETS: IMTBracket[] = [
  { limit: 106346, rate: 0.00, deduction: 0 },
  { limit: 145470, rate: 0.02, deduction: 2126.92 },
  { limit: 198347, rate: 0.05, deduction: 4491.84 },
  { limit: 330539, rate: 0.07, deduction: 8492.77 },
  { limit: 660982, rate: 0.08, deduction: 11798.16 },
];

/**
 * Calculates IMT for a given price based on residential brackets.
 * For values between 660,982 and 1,150,853, a flat 6% rate applies.
 * For values above 1,150,853, a flat 7.5% rate applies.
 */
export function calculateResidentialIMT(price: number): number {
  if (price > 1150853) return price * 0.075;
  if (price > 660982) return price * 0.06;

  // Bracket logic
  for (let i = PORTUGAL_RESIDENTIAL_IMT_BRACKETS.length - 1; i >= 0; i--) {
    const bracket = PORTUGAL_RESIDENTIAL_IMT_BRACKETS[i];
    const prevLimit = i > 0 ? PORTUGAL_RESIDENTIAL_IMT_BRACKETS[i-1].limit : 0;
    
    if (price > prevLimit) {
        return (price * bracket.rate) - bracket.deduction;
    }
  }

  return 0;
}

export interface SpainTaxConfig {
  resaleITP: (price: number) => number;
  newBuildIVA: number;
  newBuildAJD: (price: number) => number;
  isIGIC?: boolean;
}

export const SPAIN_CITY_TAXES: Record<string, SpainTaxConfig> = {
  'Valencia': {
    resaleITP: (p) => p < 1000000 ? 0.10 : 0.11,
    newBuildIVA: 0.10,
    newBuildAJD: (p) => 0.015
  },
  'Alicante': {
    resaleITP: (p) => 0.10,
    newBuildIVA: 0.10,
    newBuildAJD: (p) => 0.015
  },
  'Málaga': {
    resaleITP: (p) => 0.07,
    newBuildIVA: 0.10,
    newBuildAJD: (p) => p < 1000000 ? 0.012 : 0.02
  },
  'Las Palmas (Gran Canaria)': {
    resaleITP: (p) => 0.07,
    newBuildIVA: 0,
    newBuildAJD: (p) => 0,
    isIGIC: true
  }
};

/**
 * Full acquisition cost breakdown logic.
 */
export function calculateAcquisitionBreakdown(
  price: number, 
  scenario: 'investor' | 'resident' | 'exemption',
  country: string = 'Portugal',
  city: string = 'Lisbon',
  propertyType: 'resale' | 'new_build' = 'resale'
) {
  if (country === 'Spain') {
    const cityTax = SPAIN_CITY_TAXES[city] || SPAIN_CITY_TAXES['Valencia'];
    let itp = 0;
    let iva = 0;
    let ajd = 0;
    let igic = 0;

    if (cityTax.isIGIC) {
      igic = price * 0.07;
    } else {
      if (propertyType === 'resale') {
        itp = price * cityTax.resaleITP(price);
      } else {
        iva = price * cityTax.newBuildIVA;
        ajd = price * cityTax.newBuildAJD(price);
      }
    }

    const legalFees = 1500;
    const notaryFees = 1500;
    const stampDuty = 0;

    const totalCosts = itp + iva + ajd + igic + legalFees + notaryFees;

    return {
      imt: itp + igic, // Combined for simpler mapping in some UI parts
      itp,
      iva,
      ajd,
      igic,
      stampDuty,
      legalFees,
      notaryFees,
      totalCosts: Math.round(totalCosts),
      totalPrice: Math.round(price + totalCosts)
    };
  }

  // Default to Portugal logic
  let imtValue = 0;
  
  if (scenario === 'investor') {
    imtValue = price * 0.075; // Standard Investor Baseline
  } else if (scenario === 'exemption') {
    imtValue = 0; // Rental Incentive Path
  } else {
    imtValue = calculateResidentialIMT(price); // Resident Brackets
  }

  const stampDuty = price * 0.008;
  const legalFees = price * 0.015;
  const notaryFees = 2000;

  const totalCosts = imtValue + stampDuty + legalFees + notaryFees;

  return {
    imt: Math.round(imtValue),
    stampDuty: Math.round(stampDuty),
    legalFees: Math.round(legalFees),
    notaryFees,
    totalCosts: Math.round(totalCosts),
    totalPrice: Math.round(price + totalCosts),
    // Spain placeholders for consistency
    itp: 0,
    iva: 0,
    ajd: 0,
    igic: 0
  };
}

