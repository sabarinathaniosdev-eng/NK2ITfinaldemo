import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // In demo mode, use a test account or log emails
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'demo@nk2it.com.au',
        pass: process.env.SMTP_PASS || 'demo-password'
      }
    });
  }

  async sendOTP(email: string, otpCode: string): Promise<void> {
    const mailOptions: EmailOptions = {
      to: email,
      subject: 'NK2IT - Email Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #F59E0B, #10B981); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">NK2IT</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">"At Your Service..."</p>
          </div>
          <div style="background: white; padding: 40px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1E293B; margin-top: 0;">Email Verification</h2>
            <p style="color: #64748B; font-size: 16px; line-height: 1.5;">
              Thank you for shopping with NK2IT. To complete your purchase, please verify your email address using the code below:
            </p>
            <div style="background: #F8FAFC; border: 2px solid #F59E0B; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
              <div style="font-size: 32px; font-weight: bold; color: #F59E0B; letter-spacing: 4px;">${otpCode}</div>
            </div>
            <p style="color: #64748B; font-size: 14px;">
              This code will expire in 10 minutes. If you didn't request this verification, please ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="color: #64748B; font-size: 12px; margin: 0;">
              NK2IT - Authorized Symantec Partner<br>
              222, 20B Lexington Drive, Norwest Business Park, Baulkham Hills NSW 2153
            </p>
          </div>
        </div>
      `
    };

    try {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[EmailService] OTP for ${email}: ${otpCode}`);
        console.log(`[EmailService] Demo mode - email would be sent`);
      } else {
        await this.transporter.sendMail(mailOptions);
      }
    } catch (error) {
      console.error('Failed to send OTP email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  async sendLicenseKeys(email: string, orderId: string, licenseKeys: Array<{ productName: string; keys: string[] }>): Promise<void> {
    const licenseKeysHtml = licenseKeys.map(product => `
      <div style="background: #F0F9FF; border: 1px solid #0EA5E9; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h3 style="color: #0369A1; margin: 0 0 15px 0;">${product.productName}</h3>
        ${product.keys.map(key => `
          <div style="background: white; border: 1px solid #BAE6FD; border-radius: 4px; padding: 10px; margin: 5px 0; font-family: monospace; font-size: 14px; color: #0369A1;">
            ${key}
          </div>
        `).join('')}
      </div>
    `).join('');

    const mailOptions: EmailOptions = {
      to: email,
      subject: `NK2IT - Your Symantec License Keys (Order #${orderId})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #F59E0B, #10B981); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">NK2IT</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">"At Your Service..."</p>
          </div>
          <div style="background: white; padding: 40px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1E293B; margin-top: 0;">🎉 Your License Keys Are Ready!</h2>
            <p style="color: #64748B; font-size: 16px; line-height: 1.5;">
              Thank you for your purchase! Your Symantec security licenses have been generated and are ready for deployment.
            </p>
            <div style="background: #FEF3C7; border: 1px solid #F59E0B; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <strong>Order ID:</strong> ${orderId}
            </div>
            
            <h3 style="color: #1E293B;">Your License Keys:</h3>
            ${licenseKeysHtml}
            
            <div style="background: #EFF6FF; border: 1px solid #3B82F6; border-radius: 8px; padding: 20px; margin: 30px 0;">
              <h4 style="color: #1E40AF; margin: 0 0 10px 0;">📋 Next Steps:</h4>
              <ul style="color: #1E40AF; margin: 0; padding-left: 20px;">
                <li>Save these license keys in a secure location</li>
                <li>Download the Symantec software from the official portal</li>
                <li>Use these keys during installation and activation</li>
                <li>Contact our support team if you need installation assistance</li>
              </ul>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <div style="text-align: center;">
              <h4 style="color: #1E293B;">Need Help?</h4>
              <p style="color: #64748B; margin: 5px 0;">📧 support@nk2it.com.au</p>
              <p style="color: #64748B; margin: 5px 0;">📞 +61 2 XXXX XXXX</p>
              <p style="color: #64748B; margin: 5px 0;">🕒 Mon-Fri: 9:00 AM - 5:00 PM AEST</p>
            </div>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="color: #64748B; font-size: 12px; margin: 0; text-align: center;">
              NK2IT - Authorized Symantec Partner<br>
              222, 20B Lexington Drive, Norwest Business Park, Baulkham Hills NSW 2153
            </p>
          </div>
        </div>
      `
    };

    try {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[EmailService] License keys for ${email} (Order: ${orderId})`);
        console.log(`[EmailService] Demo mode - license email would be sent`);
      } else {
        await this.transporter.sendMail(mailOptions);
      }
    } catch (error) {
      console.error('Failed to send license keys email:', error);
      throw new Error('Failed to send license keys email');
    }
  }

  async sendInvoice(email: string, orderId: string, invoicePdf: Buffer): Promise<void> {
    const mailOptions: EmailOptions = {
      to: email,
      subject: `NK2IT - Invoice for Order #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #F59E0B, #10B981); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">NK2IT</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">"At Your Service..."</p>
          </div>
          <div style="background: white; padding: 40px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1E293B; margin-top: 0;">Invoice Attached</h2>
            <p style="color: #64748B; font-size: 16px; line-height: 1.5;">
              Please find attached the invoice for your recent Symantec license purchase (Order #${orderId}).
            </p>
            <p style="color: #64748B; font-size: 14px;">
              If you have any questions about your invoice, please don't hesitate to contact our support team.
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="color: #64748B; font-size: 12px; margin: 0;">
              NK2IT - Authorized Symantec Partner<br>
              222, 20B Lexington Drive, Norwest Business Park, Baulkham Hills NSW 2153
            </p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `NK2IT-Invoice-${orderId}.pdf`,
          content: invoicePdf,
          contentType: 'application/pdf'
        }
      ]
    };

    try {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[EmailService] Invoice for ${email} (Order: ${orderId})`);
        console.log(`[EmailService] Demo mode - invoice email would be sent`);
      } else {
        await this.transporter.sendMail(mailOptions);
      }
    } catch (error) {
      console.error('Failed to send invoice email:', error);
      throw new Error('Failed to send invoice email');
    }
  }
}

export const emailService = new EmailService();
