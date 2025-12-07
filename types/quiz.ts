export interface QuizData {
  // Step 1
  age: number | null;
  gender: "male" | "female" | null;
  state: string | null;

  // Step 2
  smoker: boolean | null;
  height: number | null; // in inches
  weight: number | null; // in pounds

  // Step 3
  maritalStatus: "single" | "married" | "divorced" | "widowed" | null;
  numberOfKids: number | null;

  // Step 4
  annualIncome: number | null;
  majorDebts: number | null; // total debt amount

  // Step 5
  desiredCoverage: number | null; // coverage amount
  termLength: "10" | "15" | "20" | "30" | "permanent" | null;

  // Step 6
  name: string | null;
  phone: string | null;
  email: string | null;
}

export interface InsuranceRate {
  carrier: string;
  monthlyRate: number;
}

export interface QuizResults {
  recommendedCoverage: number;
  rates: InsuranceRate[];
}

