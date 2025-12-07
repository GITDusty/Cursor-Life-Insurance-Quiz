import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { QuizData } from "@/types/quiz";
import { calculateRates, calculateRecommendedCoverage } from "@/lib/rateCalculator";

const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

export async function POST(request: NextRequest) {
  try {
    const data: QuizData = await request.json();

    // Validate required fields
    if (!data.name || !data.phone || !data.email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate rates and recommended coverage
    const rates = calculateRates(data);
    const recommendedCoverage = calculateRecommendedCoverage(data);
    const bestRate = rates.length > 0 ? rates[0].monthlyRate : 0;

    // Format data for Google Sheets
    const sheetData = {
      timestamp: new Date().toISOString(),
      name: data.name,
      phone: data.phone,
      email: data.email,
      age: data.age,
      gender: data.gender,
      state: data.state,
      smoker: data.smoker ? "Yes" : "No",
      height: data.height,
      weight: data.weight,
      maritalStatus: data.maritalStatus,
      numberOfKids: data.numberOfKids,
      annualIncome: data.annualIncome,
      majorDebts: data.majorDebts,
      desiredCoverage: data.desiredCoverage,
      termLength: data.termLength,
      recommendedCoverage: recommendedCoverage,
      bestRate: bestRate,
    };

    // Submit to Google Sheets webhook
    const googleSheetsUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL;
    if (googleSheetsUrl) {
      try {
        await fetch(googleSheetsUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sheetData),
        });
      } catch (error) {
        console.error("Error submitting to Google Sheets:", error);
        // Continue even if Google Sheets fails
      }
    }

    // Send Twilio SMS notification
    const notificationPhone = process.env.TWILIO_NOTIFICATION_PHONE;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

    if (notificationPhone && twilioPhone && twilioClient) {
      try {
        const ageStr = data.age ? `${data.age}` : "N/A";
        const stateStr = data.state || "N/A";
        const coverageStr = recommendedCoverage
          ? `$${(recommendedCoverage / 1000000).toFixed(1)}M`
          : "N/A";
        const rateStr = bestRate ? `$${bestRate}/mo` : "N/A";

        const message = `New hot lead: ${data.name}, ${ageStr}, ${stateStr}, ${coverageStr} need, ${rateStr} quotes – just booked call`;

        await twilioClient.messages.create({
          body: message,
          from: twilioPhone,
          to: notificationPhone,
        });
      } catch (error) {
        console.error("Error sending Twilio SMS:", error);
        // Continue even if SMS fails
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing submission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

