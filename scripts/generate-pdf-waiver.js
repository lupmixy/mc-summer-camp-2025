const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generatePdfWaiver() {
  let browser = null;
  
  try {
    console.log('Starting PDF generation...');
    
    // Read the HTML waiver file
    const htmlPath = path.join(__dirname, '..', 'public', 'documents', 'Colombo_Girls_Soccer_Camp_Waiver_2025.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // Launch puppeteer
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    // Generate PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0.5in', bottom: '0.5in', left: '0.5in', right: '0.5in' }
    });
    
    // Save PDF to public/documents
    const pdfPath = path.join(__dirname, '..', 'public', 'documents', 'Colombo_Girls_Soccer_Camp_Waiver_2025.pdf');
    fs.writeFileSync(pdfPath, pdf);
    
    console.log('PDF waiver generated successfully at:', pdfPath);
    
  } catch (error) {
    console.error('Error generating PDF waiver:', error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

generatePdfWaiver();
