"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "./ProgressBar";
import { QuizData } from "@/types/quiz";

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
];

export default function QuizForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<QuizData>({
    age: null,
    gender: null,
    state: null,
    smoker: null,
    height: null,
    weight: null,
    maritalStatus: null,
    numberOfKids: null,
    annualIncome: null,
    majorDebts: null,
    desiredCoverage: null,
    termLength: null,
    name: null,
    phone: null,
    email: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.age || formData.age < 18 || formData.age > 80) {
        newErrors.age = "Please enter a valid age (18-80)";
      }
      if (!formData.gender) {
        newErrors.gender = "Please select your gender";
      }
      if (!formData.state) {
        newErrors.state = "Please select your state";
      }
    } else if (step === 2) {
      if (formData.smoker === null) {
        newErrors.smoker = "Please answer if you smoke";
      }
      if (!formData.height || formData.height < 48 || formData.height > 84) {
        newErrors.height = "Please enter a valid height (4'0\" - 7'0\")";
      }
      if (!formData.weight || formData.weight < 80 || formData.weight > 400) {
        newErrors.weight = "Please enter a valid weight (80-400 lbs)";
      }
    } else if (step === 3) {
      if (!formData.maritalStatus) {
        newErrors.maritalStatus = "Please select your marital status";
      }
      if (formData.numberOfKids === null || formData.numberOfKids < 0) {
        newErrors.numberOfKids = "Please enter number of children";
      }
    } else if (step === 4) {
      if (!formData.annualIncome || formData.annualIncome < 0) {
        newErrors.annualIncome = "Please enter your annual income";
      }
      if (formData.majorDebts === null || formData.majorDebts < 0) {
        newErrors.majorDebts = "Please enter your total debts (0 if none)";
      }
    } else if (step === 5) {
      if (!formData.desiredCoverage || formData.desiredCoverage < 250000) {
        newErrors.desiredCoverage = "Please select a coverage amount";
      }
      if (!formData.termLength) {
        newErrors.termLength = "Please select a term length";
      }
    } else if (step === 6) {
      if (!formData.name || formData.name.trim().length < 2) {
        newErrors.name = "Please enter your full name";
      }
      if (!formData.phone || !/^[\d\s\-\(\)]+$/.test(formData.phone) || formData.phone.replace(/\D/g, "").length < 10) {
        newErrors.phone = "Please enter a valid phone number";
      }
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 6) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(6)) return;

    try {
      // Store form data in sessionStorage for results page
      sessionStorage.setItem("quizData", JSON.stringify(formData));

      // Submit to API
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/results");
      } else {
        // Still redirect to results even if API fails (graceful degradation)
        router.push("/results");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // Still redirect to results
      router.push("/results");
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <ProgressBar currentStep={currentStep} totalSteps={6} />

        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          {/* Step 1 */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-black mb-6">Basic Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  min="18"
                  max="80"
                  value={formData.age || ""}
                  onChange={(e) => updateField("age", parseInt(e.target.value) || null)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your age"
                />
                {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => updateField("gender", "male")}
                    className={`px-4 py-3 rounded-lg border-2 transition-all ${
                      formData.gender === "male"
                        ? "border-primary bg-primary text-white"
                        : "border-gray-300 hover:border-primary"
                    }`}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField("gender", "female")}
                    className={`px-4 py-3 rounded-lg border-2 transition-all ${
                      formData.gender === "female"
                        ? "border-primary bg-primary text-white"
                        : "border-gray-300 hover:border-primary"
                    }`}
                  >
                    Female
                  </button>
                </div>
                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <select
                  value={formData.state || ""}
                  onChange={(e) => updateField("state", e.target.value || null)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select your state</option>
                  {US_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
              </div>
            </div>
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-black mb-6">Health Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Do you smoke?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => updateField("smoker", false)}
                    className={`px-4 py-3 rounded-lg border-2 transition-all ${
                      formData.smoker === false
                        ? "border-primary bg-primary text-white"
                        : "border-gray-300 hover:border-primary"
                    }`}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField("smoker", true)}
                    className={`px-4 py-3 rounded-lg border-2 transition-all ${
                      formData.smoker === true
                        ? "border-primary bg-primary text-white"
                        : "border-gray-300 hover:border-primary"
                    }`}
                  >
                    Yes
                  </button>
                </div>
                {errors.smoker && <p className="text-red-500 text-sm mt-1">{errors.smoker}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (inches)
                </label>
                <input
                  type="number"
                  min="48"
                  max="84"
                  value={formData.height || ""}
                  onChange={(e) => updateField("height", parseInt(e.target.value) || null)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., 70 (5'10\")"
                />
                {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (lbs)
                </label>
                <input
                  type="number"
                  min="80"
                  max="400"
                  value={formData.weight || ""}
                  onChange={(e) => updateField("weight", parseInt(e.target.value) || null)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your weight"
                />
                {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
              </div>
            </div>
          )}

          {/* Step 3 */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-black mb-6">Family Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marital Status
                </label>
                <select
                  value={formData.maritalStatus || ""}
                  onChange={(e) => updateField("maritalStatus", e.target.value || null)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select marital status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
                {errors.maritalStatus && <p className="text-red-500 text-sm mt-1">{errors.maritalStatus}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Children
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.numberOfKids || ""}
                  onChange={(e) => updateField("numberOfKids", parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="0"
                />
                {errors.numberOfKids && <p className="text-red-500 text-sm mt-1">{errors.numberOfKids}</p>}
              </div>
            </div>
          )}

          {/* Step 4 */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-black mb-6">Financial Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Income ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.annualIncome || ""}
                  onChange={(e) => updateField("annualIncome", parseInt(e.target.value) || null)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., 75000"
                />
                {errors.annualIncome && <p className="text-red-500 text-sm mt-1">{errors.annualIncome}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Major Debts ($)
                </label>
                <p className="text-sm text-gray-500 mb-2">Mortgage, student loans, etc.</p>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.majorDebts || ""}
                  onChange={(e) => updateField("majorDebts", parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="0"
                />
                {errors.majorDebts && <p className="text-red-500 text-sm mt-1">{errors.majorDebts}</p>}
              </div>
            </div>
          )}

          {/* Step 5 */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-black mb-6">Coverage Preferences</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Desired Coverage Amount: ${formData.desiredCoverage ? formData.desiredCoverage.toLocaleString() : "250,000"}
                </label>
                <input
                  type="range"
                  min="250000"
                  max="5000000"
                  step="25000"
                  value={formData.desiredCoverage || 250000}
                  onChange={(e) => updateField("desiredCoverage", parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>$250K</span>
                  <span>$5M</span>
                </div>
                {errors.desiredCoverage && <p className="text-red-500 text-sm mt-1">{errors.desiredCoverage}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Term Length
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {["10", "15", "20", "30", "permanent"].map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => updateField("termLength", term as any)}
                      className={`px-4 py-3 rounded-lg border-2 transition-all text-sm ${
                        formData.termLength === term
                          ? "border-primary bg-primary text-white"
                          : "border-gray-300 hover:border-primary"
                      }`}
                    >
                      {term === "permanent" ? "Permanent" : `${term} Years`}
                    </button>
                  ))}
                </div>
                {errors.termLength && <p className="text-red-500 text-sm mt-1">{errors.termLength}</p>}
              </div>
            </div>
          )}

          {/* Step 6 */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-black mb-6">Contact Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone || ""}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                currentStep === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-all"
            >
              {currentStep === 6 ? "Get My Quotes" : "Next →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

