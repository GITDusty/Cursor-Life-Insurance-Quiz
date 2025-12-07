import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black mb-6 leading-tight">
            See Exactly How Much Life Insurance Should Cost You in 2025
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700 mb-4 font-medium">
            (Most People Overpay by 2-3x)
          </p>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Get instant quotes from top carriers. Find out your personalized rate in just 2 minutes.
          </p>
          <Link
            href="/quiz"
            className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold text-lg px-8 py-4 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            Start Your Free Quote →
          </Link>
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">2 Min</div>
              <div className="text-gray-600">Quick & Easy</div>
            </div>
            <div className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">100% Free</div>
              <div className="text-gray-600">No Obligation</div>
            </div>
            <div className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">Top Rates</div>
              <div className="text-gray-600">Best Carriers</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

