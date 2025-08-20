import { type Order, type OrderItem, type Customer } from "@shared/schema";

interface InvoiceData {
  order: Order;
  customer: Customer | null;
  items: OrderItem[];
  licenseKeys?: Array<{
    productName: string;
    keys: string[];
  }>;
}

class PdfService {
  generateInvoicePdf(data: InvoiceData): Buffer {
    const invoiceHtml = this.generateInvoiceHtml(data);
    return Buffer.from(invoiceHtml, 'utf8');
  }

  private generateInvoiceHtml(data: InvoiceData): string {
    const { order, customer, items, licenseKeys } = data;
    
    const itemsHtml = items.map((item, index) => 
      `<tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${index + 1}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.productName || ''}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${parseFloat(item.price || '0').toFixed(2)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${parseFloat(item.total || '0').toFixed(2)}</td>
      </tr>`
    ).join('');

    let licenseKeysSection = '';
    if (licenseKeys && licenseKeys.length > 0) {
      const licenseKeysHtml = licenseKeys.map(product => 
        `<div style="margin: 15px 0; padding: 12px; background: #f0f9f0; border: 1px solid #10B981; border-radius: 4px;">
          <h4 style="margin: 0 0 8px 0; color: #10B981; font-size: 14px;">${product.productName}</h4>
          <div style="font-family: 'Courier New', monospace; font-size: 11px; line-height: 1.4;">
            ${product.keys.map(key => `<div style="margin: 2px 0; background: white; padding: 4px; border-radius: 2px;">${key}</div>`).join('')}
          </div>
        </div>`
      ).join('');
      
      licenseKeysSection = `
        <div style="margin: 30px 0;">
          <h3 style="color: #10B981; margin: 0 0 15px 0;">License Keys</h3>
          ${licenseKeysHtml}
        </div>
      `;
    }

    const customerName = customer ? `${customer.firstName} ${customer.lastName}` : 'Guest Customer';
    const billingAddress = order.billingAddress as any;
    const orderDate = new Date(order.createdAt).toLocaleDateString('en-AU', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice ${order.id}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.4; color: #333; margin: 0; padding: 20px; font-size: 12px; }
    .header { text-align: center; margin-bottom: 30px; }
    .company-name { font-size: 36px; font-weight: bold; color: #10B981; margin: 10px 0; }
    .company-details { font-size: 12px; line-height: 1.4; margin: 10px 0; }
    .invoice-title { font-size: 24px; font-weight: bold; text-align: left; margin: 30px 0 20px 0; }
    .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; margin: 20px 0; }
    .invoice-info { flex: 1; }
    .bill-to { flex: 1; margin-left: 40px; }
    .bill-to h3 { font-size: 14px; font-weight: bold; margin: 0 0 10px 0; }
    .table { width: 100%; border-collapse: collapse; margin: 30px 0; }
    .table th { background: #f8f9fa; padding: 12px 8px; text-align: left; border: 1px solid #ddd; font-weight: bold; font-size: 12px; }
    .table td { font-size: 11px; }
    .totals-section { text-align: right; margin: 30px 0; }
    .totals-section div { margin: 8px 0; font-size: 13px; }
    .total-final { font-size: 16px; font-weight: bold; color: #000; border-top: 2px solid #333; padding-top: 8px; }
    .terms { margin: 40px 0; font-size: 10px; line-height: 1.5; }
    .terms h4 { font-size: 12px; margin: 15px 0 8px 0; font-weight: bold; }
    .footer { margin-top: 50px; padding: 30px 0; border-top: 2px solid #10B981; text-align: center; }
    .footer-logo { display: flex; align-items: center; justify-content: center; margin-bottom: 15px; }
    .footer-logo-text { font-size: 28px; font-weight: bold; color: #10B981; margin-right: 15px; }
    .footer-tagline { font-size: 16px; color: #F59E0B; font-style: italic; }
    .contact-info { font-size: 11px; color: #666; margin-top: 15px; line-height: 1.4; }
    .thank-you { font-size: 14px; font-weight: bold; color: #10B981; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="header">
    <div class="company-name">NK2IT PTY LTD</div>
    <div class="company-details">
      222, 20B Lexington Drive<br>
      Norwest Business Park<br>
      Baulkham Hills NSW 2153
    </div>
  </div>

  <div class="invoice-title">INVOICE</div>

  <div class="invoice-header">
    <div class="invoice-info">
      <strong>INVOICE NUMBER:</strong> ${order.id}<br><br>
      <strong>Date:</strong> ${orderDate}
    </div>
    
    <div class="bill-to">
      <h3>BILL TO</h3>
      <strong>Name:</strong> ${customerName}<br>
      <strong>Address:</strong> ${billingAddress?.street || ''}, ${billingAddress?.city || ''} ${billingAddress?.state || ''} ${billingAddress?.postcode || ''}<br>
      <strong>Phone:</strong> ${billingAddress?.phone || customer?.phone || ''}<br>
      <strong>Email:</strong> ${order.email}
    </div>
  </div>

  <table class="table">
    <thead>
      <tr>
        <th style="width: 8%; text-align: center;">NO</th>
        <th style="width: 12%; text-align: center;">QUANTITY</th>
        <th style="width: 50%;">PRODUCT DESCRIPTION</th>
        <th style="width: 15%; text-align: right;">UNIT PRICE</th>
        <th style="width: 15%; text-align: right;">TOTAL PRICE</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHtml}
    </tbody>
  </table>

  <div class="totals-section">
    <div><strong>AMOUNT:</strong> $${parseFloat(order.subtotal).toFixed(2)}</div>
    <div><strong>GST:</strong> $${parseFloat(order.gst).toFixed(2)}</div>
    <div class="total-final"><strong>TOTAL:</strong> $${parseFloat(order.total).toFixed(2)}</div>
  </div>

  ${licenseKeysSection}

  <div class="terms">
    <h4>TERMS & CONDITIONS:</h4>
    <p><strong>Payment Terms:</strong> Once the payment is processed, a license key will be sent to the registered email address.</p>
    <p><strong>Refund Policy:</strong> All sales are final. No refunds will be issued after the software has been purchased or delivered. If the software is defective or an incorrect product is delivered, please contact customer support within 7 days for assistance.</p>
    <p><strong>License Terms:</strong> The purchase provides a non-transferable license to use the Symantec Endpoint Agent software. Ownership remains with Symantec and is subject to the terms of the EULA (End-User License Agreement).</p>
    <p><strong>Support:</strong> Basic customer support is available through email/phone. If you require extended support, you must coordinate with respective vendors.</p>
    <p><strong>Limitation of Liability:</strong> Our liability is limited to the purchase price of the software. We are not responsible for any consequential, incidental, or indirect damages arising from the use or inability to use the software.</p>
  </div>

  <div class="footer">
    <div class="footer-logo">
      <div class="footer-logo-text">NK2IT</div>
      <div class="footer-tagline">"At Your Service..."</div>
    </div>
    <div class="contact-info">
      Email: info@nk2it.com.au | Phone: +61 2 8123 4567<br>
      Web: www.nk2it.com.au | ABN: 12 345 678 901
    </div>
    <div class="thank-you">-: THANK YOU FOR YOUR PURCHASE :-</div>
  </div>
</body>
</html>`;
  }
}

export const pdfService = new PdfService();
export type { InvoiceData };
