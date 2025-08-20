interface PaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  amount: number;
  currency: string;
  orderId: string;
  customerEmail: string;
  billingAddress: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
}

interface PaymentResult {
  success: boolean;
  transactionId?: string;
  reference?: string;
  error?: string;
  rawResponse?: any;
}

class PaymentService {
  private bpointApiUrl: string;
  private bpointMerchantId: string;
  private bpointApiKey: string;
  private isTestMode: boolean;

  constructor() {
    this.bpointApiUrl = process.env.BPOINT_API_URL || 'https://www.bpoint.com.au/webapi/v3';
    this.bpointMerchantId = process.env.BPOINT_MERCHANT_ID || 'demo_merchant';
    this.bpointApiKey = process.env.BPOINT_API_KEY || 'demo_api_key';
    this.isTestMode = process.env.NODE_ENV !== 'production';
  }

  async processPayment(paymentDetails: PaymentDetails): Promise<PaymentResult> {
    try {
      // In demo/test mode, simulate successful payment
      if (this.isTestMode) {
        return this.simulatePayment(paymentDetails);
      }

      // Real BPOINT integration
      const payload = {
        amount: Math.round(paymentDetails.amount * 100), // Convert to cents
        currency: paymentDetails.currency,
        reference: paymentDetails.orderId,
        customer: {
          contactDetails: {
            emailAddress: paymentDetails.customerEmail,
            firstName: paymentDetails.billingAddress.firstName,
            lastName: paymentDetails.billingAddress.lastName,
          },
          address: {
            addressLine1: paymentDetails.billingAddress.street,
            city: paymentDetails.billingAddress.city,
            state: paymentDetails.billingAddress.state,
            postCode: paymentDetails.billingAddress.postcode,
            countryCode: 'AU',
          }
        },
        card: {
          cardNumber: paymentDetails.cardNumber.replace(/\s/g, ''),
          expiryDateMonth: paymentDetails.expiryDate.split('/')[0],
          expiryDateYear: `20${paymentDetails.expiryDate.split('/')[1]}`,
          cvn: paymentDetails.cvv,
          cardHolderName: paymentDetails.cardholderName,
        },
        type: 'payment'
      };

      const response = await fetch(`${this.bpointApiUrl}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${this.bpointMerchantId}:${this.bpointApiKey}`).toString('base64')}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.responseCode === 'SUCCESS') {
        return {
          success: true,
          transactionId: result.transactionNumber,
          reference: result.merchantReference,
          rawResponse: result,
        };
      } else {
        return {
          success: false,
          error: result.responseText || 'Payment processing failed',
          rawResponse: result,
        };
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        error: 'Payment service unavailable. Please try again later.',
      };
    }
  }

  private async simulatePayment(paymentDetails: PaymentDetails): Promise<PaymentResult> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Demo mode: Accept test card numbers
    const testCards = ['4111111111111111', '4111 1111 1111 1111'];
    const cleanCardNumber = paymentDetails.cardNumber.replace(/\s/g, '');

    if (testCards.includes(cleanCardNumber) || testCards.includes(paymentDetails.cardNumber)) {
      const transactionId = `DEMO_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      console.log(`[PaymentService] Demo payment processed successfully`);
      console.log(`[PaymentService] Transaction ID: ${transactionId}`);
      console.log(`[PaymentService] Amount: $${paymentDetails.amount.toFixed(2)} ${paymentDetails.currency}`);

      return {
        success: true,
        transactionId,
        reference: paymentDetails.orderId,
        rawResponse: {
          responseCode: 'SUCCESS',
          transactionNumber: transactionId,
          merchantReference: paymentDetails.orderId,
          amount: Math.round(paymentDetails.amount * 100),
          currency: paymentDetails.currency,
          testMode: true,
        },
      };
    } else {
      return {
        success: false,
        error: 'Invalid card number. Use 4111 1111 1111 1111 for testing.',
      };
    }
  }

  async refundPayment(transactionId: string, amount: number, reason?: string): Promise<PaymentResult> {
    try {
      if (this.isTestMode) {
        console.log(`[PaymentService] Demo refund: ${transactionId} - $${amount.toFixed(2)}`);
        return {
          success: true,
          transactionId: `REFUND_${Date.now()}`,
          reference: transactionId,
        };
      }

      const payload = {
        originalTxnNumber: transactionId,
        amount: Math.round(amount * 100),
        type: 'refund',
        ...(reason && { merchantReference: reason }),
      };

      const response = await fetch(`${this.bpointApiUrl}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${this.bpointMerchantId}:${this.bpointApiKey}`).toString('base64')}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.responseCode === 'SUCCESS') {
        return {
          success: true,
          transactionId: result.transactionNumber,
          reference: result.merchantReference,
          rawResponse: result,
        };
      } else {
        return {
          success: false,
          error: result.responseText || 'Refund processing failed',
          rawResponse: result,
        };
      }
    } catch (error) {
      console.error('Refund processing error:', error);
      return {
        success: false,
        error: 'Refund service unavailable. Please try again later.',
      };
    }
  }
}

export const paymentService = new PaymentService();
export type { PaymentDetails, PaymentResult };
