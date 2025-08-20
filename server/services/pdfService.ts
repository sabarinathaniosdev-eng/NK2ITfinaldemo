import PDFDocument from 'pdfkit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface InvoiceData {
  id: string;
  email: string;
  licenseKey: string;
  amountCents: number;
}

export async function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  const doc = new PDFDocument({ margin: 50 });
  const chunks: Buffer[] = [];

  // Collect PDF stream into buffer
  doc.on('data', (chunk: Buffer) => chunks.push(chunk));
  
  return new Promise((resolve, reject) => {
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);
      resolve(pdfBuffer);
    });

    doc.on('error', reject);

    // Calculate GST (10%)
    const gstCents = Math.round(data.amountCents * 0.1);
    const totalCents = data.amountCents + gstCents;

    // Header with orange color
    doc.fillColor('#FF7A00')
       .fontSize(28)
       .font('Helvetica-Bold')
       .text('INVOICE', 50, 50);

    // Company details
    doc.fillColor('#000000')
       .fontSize(16)
       .font('Helvetica-Bold')
       .text('NK2IT PTY LTD', 50, 100)
       .fontSize(12)
       .font('Helvetica')
       .text('222, 20B Lexington Drive', 50, 125)
       .text('Norwest Business Park', 50, 140)
       .text('Baulkham Hills NSW 2153', 50, 155);

    // Invoice details (right side)
    const currentDate = new Date().toLocaleDateString('en-AU');
    doc.text(`INVOICE NUMBER: ${data.id}`, 350, 100)
       .text(`Date: ${currentDate}`, 350, 120);

    // Bill To section
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .text('BILL TO', 50, 200);

    doc.fontSize(12)
       .font('Helvetica')
       .text(`Email: ${data.email}`, 50, 225);

    // Product table header
    const tableTop = 280;
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .text('NO', 50, tableTop)
       .text('QUANTITY', 90, tableTop)
       .text('PRODUCT DESCRIPTION', 160, tableTop)
       .text('UNIT PRICE', 380, tableTop)
       .text('TOTAL PRICE', 470, tableTop);

    // Table line
    doc.moveTo(50, tableTop + 20)
       .lineTo(550, tableTop + 20)
       .stroke();

    // Product row
    const productRow = tableTop + 30;
    doc.fontSize(12)
       .font('Helvetica')
       .text('1', 50, productRow)
       .text('1', 90, productRow)
       .text('Symantec Endpoint Protection License', 160, productRow)
       .text(`$${(data.amountCents / 100).toFixed(2)}`, 380, productRow)
       .text(`$${(data.amountCents / 100).toFixed(2)}`, 470, productRow);

    // License key section
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .text('License Key:', 50, productRow + 40)
       .font('Helvetica')
       .text(data.licenseKey, 140, productRow + 40);

    // Totals section
    const totalsY = productRow + 80;
    doc.text('AMOUNT:', 400, totalsY)
       .text(`$${(data.amountCents / 100).toFixed(2)}`, 470, totalsY)
       .text('GST (10%):', 400, totalsY + 20)
       .text(`$${(gstCents / 100).toFixed(2)}`, 470, totalsY + 20)
       .font('Helvetica-Bold')
       .text('TOTAL:', 400, totalsY + 40)
       .text(`$${(totalCents / 100).toFixed(2)}`, 470, totalsY + 40);

    // Terms & Conditions
    const termsY = totalsY + 100;
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .text('TERMS & CONDITIONS:', 50, termsY);

    const termsText = [
      'Payment Terms: Once the payment is processed, a license key will be sent to the registered email address.',
      '',
      'Refund Policy: All sales are final. No refunds will be issued after the software has been purchased or delivered.',
      'If the software is defective or an incorrect product is delivered, please contact customer support within 7 days.',
      '',
      'License Terms: The purchase provides a non-transferable license to use the Symantec Endpoint Agent software.',
      'Ownership remains with Symantec and is subject to the terms of the EULA (End-User License Agreement).',
      '',
      'Support: Basic customer support is available through support@nk2it.com.au. If you require extended support,',
      'you must coordinate with respective vendors.',
      '',
      'Limitation of Liability: Our liability is limited to the purchase price of the software. We are not responsible',
      'for any consequential, incidental, or indirect damages arising from the use or inability to use the software.'
    ];

    let currentY = termsY + 30;
    doc.fontSize(10).font('Helvetica');
    
    termsText.forEach(line => {
      if (line === '') {
        currentY += 10;
      } else {
        doc.text(line, 50, currentY, { width: 500 });
        currentY += 15;
      }
    });

    // Footer with green color
    const footerY = doc.page.height - 80;
    doc.fillColor('#00A65A')
       .fontSize(14)
       .font('Helvetica-Bold')
       .text('Thank you for your purchase! Powered by NK2IT', 50, footerY, {
         width: 500,
         align: 'center'
       });

    // Contact info
    doc.fillColor('#000000')
       .fontSize(10)
       .font('Helvetica')
       .text('Email: support@nk2it.com.au | Phone: 1300 NK2 IT | Website: nk2it.com.au', 50, footerY + 30, {
         width: 500,
         align: 'center'
       });

    doc.end();
  });
}

export async function saveInvoiceRecord(data: InvoiceData, gstCents: number, pdfFileName: string) {
  return await prisma.invoice.create({
    data: {
      id: data.id,
      userEmail: data.email,
      amountCents: data.amountCents,
      gstCents,
      licenseKey: data.licenseKey,
      pdfFileName,
      createdAt: new Date()
    }
  });
}