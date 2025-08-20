import nodemailer from 'nodemailer';
import { validateEmailEnvironment } from '../lib/environment';



// Create transporter with environment validation
function createEmailTransporter() {
  validateEmailEnvironment();
  
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT!),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

interface EmailInvoiceData {
  email: string;
  invoiceId: string;
  licenseKey: string;
  amountCents: number;
  pdfBuffer: Buffer;
}

export async function sendInvoiceEmail(data: EmailInvoiceData): Promise<void> {
  const transporter = createEmailTransporter();
  
  const totalAmount = (data.amountCents * 1.1 / 100).toFixed(2); // Including 10% GST
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: data.email,
    subject: `NK2IT Invoice ${data.invoiceId} - Symantec License Key`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #FF7A00; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">NK2IT PTY LTD</h1>
          <p style="margin: 5px 0 0 0;">Professional Software Licensing Solutions</p>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Thank you for your purchase!</h2>
          
          <p>Your Symantec Endpoint Protection license has been processed successfully.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #FF7A00; margin-top: 0;">Order Details</h3>
            <p><strong>Invoice ID:</strong> ${data.invoiceId}</p>
            <p><strong>License Key:</strong> <code style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px;">${data.licenseKey}</code></p>
            <p><strong>Total Amount:</strong> $${totalAmount} AUD (inc. GST)</p>
          </div>
          
          <p>Your invoice PDF is attached to this email for your records.</p>
          
          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; border-left: 4px solid #00A65A;">
            <p style="margin: 0;"><strong>Next Steps:</strong></p>
            <p style="margin: 5px 0 0 0;">Use the license key above to activate your Symantec Endpoint Protection software. If you need assistance, contact our support team.</p>
          </div>
        </div>
        
        <div style="background: #00A65A; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0; font-weight: bold;">Thank you for your purchase! Powered by NK2IT</p>
          <p style="margin: 10px 0 0 0; font-size: 14px;">
            Email: support@nk2it.com.au | Phone: 1300 NK2 IT | Website: nk2it.com.au
          </p>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: `NK2IT-Invoice-${data.invoiceId}.pdf`,
        content: data.pdfBuffer,
        contentType: 'application/pdf'
      }
    ]
  };

  await transporter.sendMail(mailOptions);
}