import { type Order, type OrderItem, type Customer } from "@shared/schema";

interface InvoiceData {
  order: Order;
  customer: Customer;
  items: OrderItem[];
  licenseKeys?: Array<{
    productName: string;
    keys: string[];
  }>;
}

class PdfService {
  generateInvoicePdf(data: InvoiceData): Buffer {
    // In a real implementation, you would use a PDF library like puppeteer, jsPDF, or PDFKit
    // For demo purposes, we'll create a simple HTML-to-PDF conversion simulation
    
    const invoiceHtml = this.generateInvoiceHtml(data);
    
    // Simulate PDF generation - in reality you'd use puppeteer or similar:
    // const browser = await puppeteer.launch();
    // const page = await browser.newPage();
    // await page.setContent(invoiceHtml);
    // const pdfBuffer = await page.pdf({ format: 'A4' });
    // await browser.close();
    
    // For demo, return HTML as buffer (in real app, this would be actual PDF)
    return Buffer.from(invoiceHtml, 'utf8');
  }

  private generateInvoiceHtml(data: InvoiceData): string {
    const { order, customer, items, licenseKeys } = data;
    
    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.productName}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${parseFloat(item.price).toFixed(2)}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${parseFloat(item.total).toFixed(2)}</td>
      </tr>
    `).join('');

    const licenseKeysHtml = licenseKeys ? licenseKeys.map(product => `
      <div style="margin: 20px 0; padding: 15px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h4 style="margin: 0 0 10px 0; color: #1e293b;">${product.productName}</h4>
        <div style="font-family: monospace; font-size: 12px; line-height: 1.5;">
          ${product.keys.map(key => `<div style="margin: 2px 0;">${key}</div>`).join('')}
        </div>
      </div>
    `).join('') : '';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Invoice ${order.id}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
          .header { background: linear-gradient(135deg, #F59E0B, #10B981); color: white; padding: 30px; margin: -20px -20px 30px -20px; }
          .company-logo { font-size: 32px; font-weight: bold; margin: 0; }
          .tagline { margin: 5px 0 0 0; opacity: 0.9; }
          .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .invoice-info, .customer-info { flex: 1; }
          .invoice-info { margin-right: 40px; }
          .table { width: 100%; border-collapse: collapse; margin: 30px 0; }
          .table th { background: #f8fafc; padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb; }
          .totals { text-align: right; margin: 30px 0; }
          .totals div { margin: 5px 0; }
          .total-final { font-size: 18px; font-weight: bold; color: #1e293b; }
          .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="company-logo">NK2IT</h1>
          <p class="tagline">"At Your Service..."</p>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
          <div class="invoice-info">
            <h2 style="margin: 0 0 15px 0; color: #1e293b;">INVOICE</h2>
            <p><strong>Invoice #:</strong> ${order.id}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt!).toLocaleDateString('en-AU')}</p>
            <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
            ${order.paymentReference ? `<p><strong>Transaction:</strong> ${order.paymentReference}</p>` : ''}
          </div>
          <div class="customer-info">
            <h3 style="margin: 0 0 15px 0; color: #1e293b;">Bill To:</h3>
            <p><strong>${customer.firstName} ${customer.lastName}</strong></p>
            ${customer.company ? `<p>${customer.company}</p>` : ''}
            <p>${order.email}</p>
            ${typeof order.billingAddress === 'object' ? `
              <p>
                ${order.billingAddress.street}<br>
                ${order.billingAddress.city}, ${order.billingAddress.state} ${order.billingAddress.postcode}
              </p>
            ` : ''}
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Product</th>
              <th style="text-align: center;">Quantity</th>
              <th style="text-align: right;">Unit Price</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="totals">
          <div>Subtotal: $${parseFloat(order.subtotal).toFixed(2)}</div>
          <div>GST (10%): $${parseFloat(order.gst).toFixed(2)}</div>
          <div class="total-final">Total: $${parseFloat(order.total).toFixed(2)}</div>
        </div>

        ${licenseKeys && licenseKeys.length > 0 ? `
          <div style="margin: 40px 0;">
            <h3 style="color: #1e293b; margin-bottom: 20px;">License Keys:</h3>
            ${licenseKeysHtml}
          </div>
        ` : ''}

        <div class="footer">
          <div style="text-align: center;">
            <h4 style="margin: 20px 0 10px 0; color: #1e293b;">NK2IT - Authorized Symantec Partner</h4>
            <p style="margin: 5px 0;">222, 20B Lexington Drive, Norwest Business Park</p>
            <p style="margin: 5px 0;">Baulkham Hills NSW 2153, Australia</p>
            <p style="margin: 5px 0;">Email: support@nk2it.com.au | Phone: +61 2 XXXX XXXX</p>
            <p style="margin: 20px 0 0 0; font-style: italic;">Thank you for choosing NK2IT for your security needs!</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async convertHtmlToPdf(html: string): Promise<Buffer> {
    // In production, implement actual PDF conversion using puppeteer:
    /*
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    const pdfBuffer = await page.pdf({ 
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });
    await browser.close();
    return pdfBuffer;
    */
    
    // For demo, return HTML as buffer
    return Buffer.from(html, 'utf8');
  }
}

export const pdfService = new PdfService();
export type { InvoiceData };
