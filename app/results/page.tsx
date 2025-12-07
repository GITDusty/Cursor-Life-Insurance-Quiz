"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QuizData, InsuranceRate } from "@/types/quiz";
import { calculateRates, calculateRecommendedCoverage } from "@/lib/rateCalculator";

export default function ResultsPage() {
  const router = useRouter();
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [rates, setRates] = useState<InsuranceRate[]>([]);
  const [recommendedCoverage, setRecommendedCoverage] = useState<number>(0);
  const [showCalendly, setShowCalendly] = useState(false);

  useEffect(() => {
    // Get quiz data from sessionStorage
    const stored = sessionStorage.getItem("quizData");
    if (!stored) {
      router.push("/");
      return;
    }

    const data: QuizData = JSON.parse(stored);
    setQuizData(data);

    // Calculate rates and recommended coverage
    const calculatedRates = calculateRates(data);
    const recommended = calculateRecommendedCoverage(data);

    setRates(calculatedRates);
    setRecommendedCoverage(recommended);
  }, [router]);

  if (!quizData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-black mb-4">
            Your Personalized Life Insurance Quotes
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Based on your answers, you need roughly{" "}
            <span className="font-bold text-primary">
              ${recommendedCoverage.toLocaleString()}
            </span>{" "}
            of coverage.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-black mb-4">
              Top Carrier Rates (Monthly Premium)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Carrier</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">
                      Monthly Rate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rates.slice(0, 5).map((rate, index) => (
                    <tr
                      key={rate.carrier}
                      className={`border-b border-gray-200 ${
                        index === 0 ? "bg-primary/10" : ""
                      }`}
                    >
                      <td className="py-4 px-4 font-medium text-gray-900">
                        {rate.carrier}
                        {index === 0 && (
                          <span className="ml-2 text-xs bg-primary text-white px-2 py-1 rounded">
                            Best Rate
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-primary text-lg">
                        ${rate.monthlyRate.toLocaleString()}/mo
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              * Rates are estimates based on your provided information. Final rates may vary based
              on medical underwriting.
            </p>
          </div>

          <button
            onClick={() => setShowCalendly(true)}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold text-lg px-8 py-4 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            Lock in These Rates – Book a 15-Min Call
          </button>
        </div>

        {/* Calendly Embed */}
        {showCalendly && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative">
              <button
                onClick={() => setShowCalendly(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold z-10 bg-white rounded-full w-8 h-8 flex items-center justify-center"
              >
                ×
              </button>
              <div className="h-[600px] sm:h-[700px]">
                {process.env.NEXT_PUBLIC_CALENDLY_URL ? (
                  <iframe
                    src={process.env.NEXT_PUBLIC_CALENDLY_URL}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    className="rounded-lg"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <p className="mb-4">Calendly URL not configured</p>
                      <p className="text-sm">
                        Please add NEXT_PUBLIC_CALENDLY_URL to your .env file
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

