# Life Insurance Calculator 2025

A complete, mobile-first, high-converting life insurance calculator quiz funnel built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- ✅ Multi-step quiz with progress tracking
- ✅ Real-time rate calculation based on user inputs
- ✅ Google Sheets integration for lead capture
- ✅ Twilio SMS notifications for new leads
- ✅ Calendly embed for appointment scheduling
- ✅ Fully responsive mobile-first design
- ✅ Professional fintech aesthetic (black, white, emerald green)

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Twilio** (SMS notifications)
- **Google Apps Script** (Webhook for Google Sheets)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required environment variables:

```env
# Google Sheets Webhook URL (from Google Apps Script)
NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL=your_google_apps_script_webhook_url_here

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
TWILIO_NOTIFICATION_PHONE=your_phone_number_to_receive_sms

# Calendly Embed URL
NEXT_PUBLIC_CALENDLY_URL=your_calendly_url_here
```

### 3. Set Up Google Sheets Webhook

1. Go to [Google Apps Script](https://script.google.com)
2. Create a new project
3. Open `google-apps-script-webhook.js` from this project
4. Copy the code and paste it into the Apps Script editor
5. Replace `YOUR_SHEET_ID` with your Google Sheet ID (found in the sheet URL)
6. Replace `Sheet1` with your sheet name if different
7. Deploy as a web app:
   - Click "Deploy" > "New deployment"
   - Choose type: "Web app"
   - Execute as: "Me"
   - Who has access: "Anyone"
   - Click "Deploy"
8. Copy the web app URL and add it to your `.env.local` as `NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL`

### 4. Set Up Twilio

1. Sign up for a [Twilio account](https://www.twilio.com)
2. Get your Account SID and Auth Token from the Twilio Console
3. Purchase a phone number or use a trial number
4. Add all Twilio credentials to your `.env.local`

### 5. Set Up Calendly

1. Create a [Calendly account](https://calendly.com) if you don't have one
2. Create a new event type (15-minute call)
3. Get the embed URL (format: `https://calendly.com/your-username/event-name`)
4. Add it to your `.env.local` as `NEXT_PUBLIC_CALENDLY_URL`

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### Step-by-Step Instructions

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-github-repo-url
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Add Environment Variables**
   - In your Vercel project settings, go to "Environment Variables"
   - Add all variables from your `.env.local`:
     - `NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL`
     - `TWILIO_ACCOUNT_SID`
     - `TWILIO_AUTH_TOKEN`
     - `TWILIO_PHONE_NUMBER`
     - `TWILIO_NOTIFICATION_PHONE`
     - `NEXT_PUBLIC_CALENDLY_URL`

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your site will be live at `your-project.vercel.app`

5. **Custom Domain (Optional)**
   - In Vercel project settings, go to "Domains"
   - Add your custom domain
   - Follow DNS configuration instructions

## Project Structure

```
├── app/
│   ├── api/
│   │   └── submit/
│   │       └── route.ts          # API endpoint for form submission
│   ├── quiz/
│   │   └── page.tsx               # Quiz page
│   ├── results/
│   │   └── page.tsx               # Results page with rates
│   ├── thank-you/
│   │   └── page.tsx               # Thank you page
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Hero/landing page
│   └── globals.css                # Global styles
├── components/
│   ├── ProgressBar.tsx            # Progress bar component
│   └── QuizForm.tsx               # Main quiz form component
├── lib/
│   └── rateCalculator.ts          # Rate calculation logic
├── types/
│   └── quiz.ts                    # TypeScript types
├── google-apps-script-webhook.js  # Google Apps Script code
└── README.md                      # This file
```

## Rate Calculation Logic

The app uses a sophisticated rate calculation system based on:

- **Base rates** for male, non-smoker, excellent health, $1M 20-year term
- **Age adjustments** (30, 35, 40, 45, 50+)
- **Gender adjustments** (females pay ~15% less)
- **Smoker adjustments** (2.5x multiplier)
- **Coverage amount scaling** (linear based on $1M base)
- **Term length adjustments** (10yr: 0.7x, 15yr: 0.85x, 20yr: 1.0x, 30yr: 1.4x, Permanent: 3.5x)
- **BMI-based health adjustments**

## Customization

### Colors

Edit `tailwind.config.ts` to change the color scheme:

```typescript
colors: {
  primary: {
    DEFAULT: "#10b981", // emerald-500
    dark: "#059669",    // emerald-600
    light: "#34d399",   // emerald-400
  },
}
```

### Rate Tables

Edit `lib/rateCalculator.ts` to update base rates or calculation logic.

### Form Fields

Modify `components/QuizForm.tsx` to add/remove form fields.

## Support

For issues or questions, please check:
- Next.js documentation: https://nextjs.org/docs
- Tailwind CSS documentation: https://tailwindcss.com/docs
- Twilio documentation: https://www.twilio.com/docs
- Google Apps Script documentation: https://developers.google.com/apps-script

## License

This project is proprietary and confidential.

