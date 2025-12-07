/**
 * Google Apps Script Webhook Code
 * 
 * Instructions:
 * 1. Go to https://script.google.com
 * 2. Create a new project
 * 3. Paste this code
 * 4. Replace 'YOUR_SHEET_ID' with your Google Sheet ID (from the URL)
 * 5. Replace 'Sheet1' with your sheet name if different
 * 6. Deploy as a web app:
 *    - Click "Deploy" > "New deployment"
 *    - Choose type: "Web app"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 *    - Click "Deploy"
 * 7. Copy the web app URL and use it as NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL
 */

function doPost(e) {
  try {
    // Get the sheet
    const sheetId = 'YOUR_SHEET_ID'; // Replace with your Google Sheet ID
    const sheetName = 'Sheet1'; // Replace with your sheet name if different
    const sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
    
    // If sheet doesn't exist, create it
    if (!sheet) {
      const ss = SpreadsheetApp.openById(sheetId);
      const newSheet = ss.insertSheet(sheetName);
      setupSheetHeaders(newSheet);
      return handlePostRequest(e, newSheet);
    }
    
    // Check if headers exist, if not, add them
    if (sheet.getLastRow() === 0) {
      setupSheetHeaders(sheet);
    }
    
    return handlePostRequest(e, sheet);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function setupSheetHeaders(sheet) {
  const headers = [
    'Timestamp',
    'Name',
    'Phone',
    'Email',
    'Age',
    'Gender',
    'State',
    'Smoker',
    'Height (inches)',
    'Weight (lbs)',
    'Marital Status',
    'Number of Kids',
    'Annual Income',
    'Major Debts',
    'Desired Coverage',
    'Term Length',
    'Recommended Coverage',
    'Best Rate (Monthly)'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.getRange(1, 1, 1, headers.length).setBackground('#10b981');
  sheet.getRange(1, 1, 1, headers.length).setFontColor('#ffffff');
}

function handlePostRequest(e, sheet) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Prepare row data in the same order as headers
    const rowData = [
      data.timestamp || new Date().toISOString(),
      data.name || '',
      data.phone || '',
      data.email || '',
      data.age || '',
      data.gender || '',
      data.state || '',
      data.smoker || '',
      data.height || '',
      data.weight || '',
      data.maritalStatus || '',
      data.numberOfKids || '',
      data.annualIncome || '',
      data.majorDebts || '',
      data.desiredCoverage || '',
      data.termLength || '',
      data.recommendedCoverage || '',
      data.bestRate || ''
    ];
    
    // Append the row
    sheet.appendRow(rowData);
    
    // Format the new row
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, rowData.length).setHorizontalAlignment('left');
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Data added successfully',
      row: lastRow
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function (optional - for debugging)
function test() {
  const testData = {
    timestamp: new Date().toISOString(),
    name: 'Test User',
    phone: '555-1234',
    email: 'test@example.com',
    age: 35,
    gender: 'male',
    state: 'CA',
    smoker: 'No',
    height: 70,
    weight: 180,
    maritalStatus: 'married',
    numberOfKids: 2,
    annualIncome: 75000,
    majorDebts: 200000,
    desiredCoverage: 1000000,
    termLength: '20',
    recommendedCoverage: 950000,
    bestRate: 47
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  Logger.log(result.getContent());
}

