# Deployment Instructions for Vercel

## Prerequisites

1. GitHub account
2. Vercel account (free tier works)
3. Google account (for Google Sheets)
4. Twilio account (for SMS)
5. Calendly account (for scheduling)

## Step-by-Step Deployment

### 1. Install Dependencies Locally (Optional - for testing)

```bash
npm install
```

### 2. Set Up Google Sheets Webhook

1. **Create a Google Sheet**
   - Go to [Google Sheets](https://sheets.google.com)
   - Create a new blank spreadsheet
   - Note the Sheet ID from the URL: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit`

2. **Create Google Apps Script**
   - Go to [Google Apps Script](https://script.google.com)
   - Click "New Project"
   - Open `google-apps-script-webhook.js` from this project
   - Copy the entire code
   - Paste it into the Apps Script editor
   - Replace `YOUR_SHEET_ID` on line 18 with your actual Sheet ID
   - Replace `Sheet1` on line 19 with your sheet name if different

3. **Deploy as Web App**
   - Click "Deploy" in the top right
   - Select "New deployment"
   - Click the gear icon ⚙️ next to "Select type"
   - Choose "Web app"
   - Set:
     - Description: "Life Insurance Quiz Webhook"
     - Execute as: "Me"
     - Who has access: "Anyone"
   - Click "Deploy"
   - Copy the Web app URL (looks like: `https://script.google.com/macros/s/.../exec`)
   - **Save this URL** - you'll need it for environment variables

### 3. Set Up Twilio

1. **Create Twilio Account**
   - Go to [Twilio](https://www.twilio.com/try-twilio)
   - Sign up for a free account
   - Verify your phone number

2. **Get Credentials**
   - Go to [Twilio Console](https://console.twilio.com)
   - Find your Account SID and Auth Token on the dashboard
   - Copy both values

3. **Get Phone Number**
   - In Twilio Console, go to "Phone Numbers" > "Manage" > "Buy a number"
   - Or use a trial number (limited functionality)
   - Copy the phone number (format: +1234567890)

4. **Note Your Notification Phone**
   - This is the phone number where you want to receive SMS notifications
   - Format: +1234567890 (include country code)

### 4. Set Up Calendly

1. **Create Calendly Account**
   - Go to [Calendly](https://calendly.com)
   - Sign up for a free account

2. **Create Event Type**
   - Click "Event Types" > "New Event Type"
   - Choose "One-on-One"
   - Set duration to 15 minutes
   - Configure availability and other settings
   - Save

3. **Get Embed URL**
   - Go to your event type settings
   - Copy the embed URL (format: `https://calendly.com/your-username/event-name`)
   - Or use the full page URL

### 5. Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Life Insurance Calculator 2025"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/your-username/your-repo-name.git
git branch -M main
git push -u origin main
```

### 6. Deploy to Vercel

1. **Import Project**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "Add New..." > "Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

2. **Configure Build Settings**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

3. **Add Environment Variables**
   Click "Environment Variables" and add:

   ```
   NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL = [Your Google Apps Script webhook URL]
   TWILIO_ACCOUNT_SID = [Your Twilio Account SID]
   TWILIO_AUTH_TOKEN = [Your Twilio Auth Token]
   TWILIO_PHONE_NUMBER = [Your Twilio phone number, e.g., +1234567890]
   TWILIO_NOTIFICATION_PHONE = [Your phone number for notifications, e.g., +1234567890]
   NEXT_PUBLIC_CALENDLY_URL = [Your Calendly embed URL]
   ```

   **Important:** 
   - Make sure to add these for all environments (Production, Preview, Development)
   - Click "Save" after adding each variable

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (usually 1-2 minutes)
   - Your site will be live at `your-project-name.vercel.app`

### 7. Test the Deployment

1. **Visit Your Site**
   - Go to your Vercel deployment URL
   - Test the full flow:
     - Click "Start Your Free Quote"
     - Complete all 6 steps of the quiz
     - Check that results page shows rates
     - Submit the form
     - Check your Google Sheet for the new row
     - Check your phone for the SMS notification

2. **Verify Google Sheets Integration**
   - Open your Google Sheet
   - You should see headers in the first row
   - Complete a test submission and verify a new row appears

3. **Verify Twilio SMS**
   - Complete a test submission
   - Check your notification phone for the SMS
   - Format should be: "New hot lead: [Name], [Age], [State], [Coverage] need, [Rate] quotes – just booked call"

### 8. Set Up Custom Domain (Optional)

1. **In Vercel Project Settings**
   - Go to "Domains"
   - Add your custom domain (e.g., `lifeinsurancecalculator.com`)
   - Follow DNS configuration instructions
   - Wait for DNS propagation (can take up to 48 hours)

## Troubleshooting

### Build Fails
- Check that all environment variables are set correctly
- Verify Node.js version (Vercel uses Node 18+ by default)
- Check build logs in Vercel dashboard

### Google Sheets Not Updating
- Verify the webhook URL is correct
- Check Google Apps Script execution logs
- Ensure the Sheet ID is correct in the Apps Script code
- Make sure the sheet name matches (default: "Sheet1")

### SMS Not Sending
- Verify all Twilio credentials are correct
- Check phone number format (must include country code, e.g., +1)
- Check Twilio console for error logs
- Verify your Twilio account has sufficient credits

### Calendly Not Showing
- Verify the Calendly URL is correct
- Check that the event is published and active
- Try the embed URL in a browser to verify it works

## Post-Deployment Checklist

- [ ] Site loads correctly
- [ ] Quiz form works on all steps
- [ ] Results page shows rates
- [ ] Form submission works
- [ ] Google Sheet receives data
- [ ] SMS notification received
- [ ] Calendly embed displays
- [ ] Mobile responsive design works
- [ ] All environment variables set

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify all environment variables
4. Test each integration separately

