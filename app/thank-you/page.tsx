"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ThankYouPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Check if user came from results page
    const quizData = sessionStorage.getItem("quizData");
    if (!quizData) {
      router.push("/");
      return;
    }

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center py-8 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-8 sm:p-12">
          <div className="mb-6">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-black mb-4">
            Thank You!
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Your appointment has been scheduled. We're excited to help you secure the best life
            insurance coverage.
          </p>

          <div className="bg-primary/10 rounded-lg p-6 mb-6">
            <p className="text-gray-800 font-medium mb-2">
              📱 You'll get a text confirmation in{" "}
              <span className="text-primary font-bold">{countdown}</span> seconds
            </p>
            <p className="text-sm text-gray-600">
              Check your phone for appointment details and next steps.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-black">What's Next?</h2>
            <div className="text-left space-y-3 text-gray-700">
              <div className="flex items-start">
                <span className="text-primary mr-3 font-bold">1.</span>
                <span>Review your appointment confirmation email</span>
              </div>
              <div className="flex items-start">
                <span className="text-primary mr-3 font-bold">2.</span>
                <span>Prepare any questions about your coverage needs</span>
              </div>
              <div className="flex items-start">
                <span className="text-primary mr-3 font-bold">3.</span>
                <span>We'll call you at your scheduled time</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need to reschedule? Check your confirmation email for the link.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

