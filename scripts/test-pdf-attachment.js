// Simple test to verify PDF attachment logic
const fs = require('fs');
const path = require('path');

try {
  console.log('Testing PDF attachment logic...');
  
  // Test reading the static PDF file (similar to what the email function does)
  const waiverPdfPath = path.join(__dirname, '..', 'public', 'documents', 'Colombo_Girls_Soccer_Camp_Waiver_2025.pdf');
  const pdfBuffer = fs.readFileSync(waiverPdfPath);
  
  console.log('✅ PDF file found and readable');
  console.log(`📄 File size: ${pdfBuffer.length} bytes (${(pdfBuffer.length / 1024).toFixed(1)} KB)`);
  console.log(`📍 File path: ${waiverPdfPath}`);
  
  // Verify it's a PDF file by checking header
  const pdfHeader = pdfBuffer.slice(0, 4).toString();
  if (pdfHeader === '%PDF') {
    console.log('✅ File is a valid PDF format');
  } else {
    console.log('❌ File does not appear to be a valid PDF');
  }
  
  console.log('\n🎉 Email PDF attachment should work correctly!');
  
} catch (error) {
  console.error('❌ Error testing PDF attachment:', error.message);
  process.exit(1);
}
