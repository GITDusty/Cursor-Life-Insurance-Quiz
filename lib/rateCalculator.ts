import { QuizData, InsuranceRate } from "@/types/quiz";

// Base rates for male, non-smoker, excellent health, $1M 20-year term
const BASE_RATES: Record<number, { prudential: number; pacificLife: number; bannerLife: number; protective: number }> = {
  30: { prudential: 38, pacificLife: 41, bannerLife: 36, protective: 39 },
  35: { prudential: 47, pacificLife: 49, bannerLife: 44, protective: 48 },
  40: { prudential: 68, pacificLife: 71, bannerLife: 65, protective: 69 },
  45: { prudential: 105, pacificLife: 109, bannerLife: 99, protective: 107 },
  50: { prudential: 165, pacificLife: 172, bannerLife: 158, protective: 168 },
};

function getBaseRate(age: number): { prudential: number; pacificLife: number; bannerLife: number; protective: number } {
  if (age <= 30) return BASE_RATES[30];
  if (age <= 35) return BASE_RATES[35];
  if (age <= 40) return BASE_RATES[40];
  if (age <= 45) return BASE_RATES[45];
  if (age <= 50) return BASE_RATES[50];
  
  // For ages above 50, extrapolate (rough estimate)
  const base = BASE_RATES[50];
  const ageMultiplier = 1 + (age - 50) * 0.15;
  return {
    prudential: Math.round(base.prudential * ageMultiplier),
    pacificLife: Math.round(base.pacificLife * ageMultiplier),
    bannerLife: Math.round(base.bannerLife * ageMultiplier),
    protective: Math.round(base.protective * ageMultiplier),
  };
}

function calculateMultiplier(data: QuizData): number {
  let multiplier = 1.0;

  // Gender adjustment (females typically pay slightly less)
  if (data.gender === "female") {
    multiplier *= 0.85;
  }

  // Smoker adjustment (significant increase)
  if (data.smoker === true) {
    multiplier *= 2.5;
  }

  // Coverage amount adjustment (linear scaling for $1M base)
  if (data.desiredCoverage) {
    multiplier *= data.desiredCoverage / 1000000;
  }

  // Term length adjustment
  if (data.termLength === "10") {
    multiplier *= 0.7;
  } else if (data.termLength === "15") {
    multiplier *= 0.85;
  } else if (data.termLength === "20") {
    multiplier *= 1.0; // base
  } else if (data.termLength === "30") {
    multiplier *= 1.4;
  } else if (data.termLength === "permanent") {
    multiplier *= 3.5;
  }

  // Health adjustment based on BMI (rough estimate)
  if (data.height && data.weight) {
    const heightInMeters = data.height * 0.0254;
    const weightInKg = data.weight * 0.453592;
    const bmi = weightInKg / (heightInMeters * heightInMeters);
    
    if (bmi > 35) {
      multiplier *= 1.3; // Obese
    } else if (bmi > 30) {
      multiplier *= 1.15; // Overweight
    } else if (bmi < 18.5) {
      multiplier *= 1.1; // Underweight
    }
  }

  return multiplier;
}

export function calculateRates(data: QuizData): InsuranceRate[] {
  if (!data.age || !data.desiredCoverage) {
    return [];
  }

  const baseRates = getBaseRate(data.age);
  const multiplier = calculateMultiplier(data);

  const rates: InsuranceRate[] = [
    {
      carrier: "Banner Life",
      monthlyRate: Math.round(baseRates.bannerLife * multiplier),
    },
    {
      carrier: "Prudential",
      monthlyRate: Math.round(baseRates.prudential * multiplier),
    },
    {
      carrier: "Protective",
      monthlyRate: Math.round(baseRates.protective * multiplier),
    },
    {
      carrier: "Pacific Life",
      monthlyRate: Math.round(baseRates.pacificLife * multiplier),
    },
  ];

  // Sort by rate (lowest first)
  return rates.sort((a, b) => a.monthlyRate - b.monthlyRate);
}

export function calculateRecommendedCoverage(data: QuizData): number {
  if (!data.annualIncome) {
    return data.desiredCoverage || 1000000;
  }

  // DIME method: Debt + Income replacement + Mortgage + Education
  let coverage = 0;

  // Income replacement (10x annual income)
  coverage += data.annualIncome * 10;

  // Major debts
  if (data.majorDebts) {
    coverage += data.majorDebts;
  }

  // Education fund (rough estimate: $50k per child)
  if (data.numberOfKids) {
    coverage += data.numberOfKids * 50000;
  }

  // Round to nearest $100k
  return Math.round(coverage / 100000) * 100000;
}

