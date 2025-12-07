# Quick Start Guide

Get your Life Insurance Calculator up and running in 5 minutes.

## 1. Install Dependencies

```bash
npm install
```

## 2. Create Environment File

Create `.env.local` in the root directory:

```env
NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
TWILIO_NOTIFICATION_PHONE=
NEXT_PUBLIC_CALENDLY_URL=
```

## 3. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 4. Test Locally (Without Integrations)

You can test the quiz flow even without setting up Google Sheets, Twilio, or Calendly:

- The quiz will work fully
- Results page will show calculated rates
- Form submission will attempt to call APIs but won't fail the flow
- You'll see console errors for missing integrations, but the app continues

## 5. Set Up Integrations (When Ready)

See `DEPLOYMENT.md` for detailed setup instructions for:
- Google Sheets webhook
- Twilio SMS
- Calendly embed

## Next Steps

1. Test the quiz flow: `/` → `/quiz` → `/results`
2. Set up integrations one by one
3. Deploy to Vercel (see `DEPLOYMENT.md`)

## Calendly Redirect Setup

To redirect to `/thank-you` after booking:

1. In Calendly, go to your event type settings
2. Find "Redirect after booking" or "Thank you page"
3. Set redirect URL to: `https://your-domain.com/thank-you`
4. Or use Calendly's built-in redirect parameter

