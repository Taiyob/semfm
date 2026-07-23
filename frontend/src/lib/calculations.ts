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

export interface CalculateRentParams {
  baseRent: number;
  size: number;
  bedrooms: number;
  areaType: string;
  yearBuilt: number;
  outdoorSpace: string;
  hasParking: boolean;
  energyLabel: string;
  hasElevator: boolean | string;
  propertyCondition: string;
  multipliers?: any;
}

export function calculateEstimatedRent(params: CalculateRentParams): number {
  const { 
    baseRent, size, bedrooms, areaType, yearBuilt, 
    outdoorSpace, hasParking, energyLabel, hasElevator, 
    propertyCondition, multipliers 
  } = params;

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

  let locationFactor = 1.0;
  if (multipliers?.location) {
      locationFactor = multipliers.location[areaType] ?? 1.0;
  } else {
      const locationFactorMap: Record<string, number> = { Centre: 1.25, 'Semi-Centre': 1.05, 'Outside Centre': 0.85 };
      locationFactor = locationFactorMap[areaType] ?? 1.0;
  }

  let yearBuiltFactor = 0.95; 
  const age = new Date().getFullYear() - (yearBuilt || 0);
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

  let outsideAreaFactor = 1.00;
  if (multipliers?.outsideArea) {
      outsideAreaFactor = multipliers.outsideArea[outdoorSpace] ?? 1.00;
  } else {
      const outsideAreaFactorMap: Record<string, number> = { None: 1.00, Balcony: 1.05, Garden: 1.05 };
      outsideAreaFactor = outsideAreaFactorMap[outdoorSpace] ?? 1.00;
  }

  let parkingFactor = 1.00;
  if (multipliers?.parking) {
      if (hasParking === true) parkingFactor = multipliers.parking['Yes'];
      else if (hasParking === false) parkingFactor = multipliers.parking['No'];
  } else {
      if (hasParking === true) parkingFactor = 1.05;
      else if (hasParking === false) parkingFactor = 0.95;
  }

  let energyFactor = 0.95;
  if (multipliers?.energy) {
      energyFactor = multipliers.energy[energyLabel] ?? 0.95;
  } else {
      const energyFactorMap: Record<string, number> = { A: 1.10, B: 1.00, C: 0.95, D: 0.90, E: 0.85, F: 0.80, G: 0.80 };
      energyFactor = energyFactorMap[energyLabel] ?? 0.95;
  }

  let elevatorFactor = 1.00;
  if (multipliers?.elevator) {
      if (hasElevator === 'yes' || hasElevator === true) elevatorFactor = multipliers.elevator['Yes'];
      else if (hasElevator === 'no' || hasElevator === false) elevatorFactor = multipliers.elevator['No'];
  } else {
      if (hasElevator === 'yes' || hasElevator === true) elevatorFactor = 1.00;
      else if (hasElevator === 'no' || hasElevator === false) elevatorFactor = 0.95;
  }

  let finishFactor = 0.90;
  if (multipliers?.finish) {
      finishFactor = multipliers.finish[propertyCondition] ?? 0.90;
  } else {
      const finishFactorMap: Record<string, number> = {
          'High-End': 1.15, Premium: 1.10, Good: 1.05, Standard: 1.00, Outdated: 0.95, 'In need of renovation': 0.90,
          'Renovation Needed': 0.90, 'Basic': 0.95
      };
      finishFactor = finishFactorMap[propertyCondition] ?? 0.90;
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

  return finalRent;
}


