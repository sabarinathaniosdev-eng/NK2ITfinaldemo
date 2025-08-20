import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Download, Mail, Copy, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface SuccessModalProps {
  orderResult: {
    orderId: string;
    transactionId: string;
    licenseKeys: Array<{
      productName: string;
      keys: string[];
    }>;
    total: number;
  };
  onClose: () => void;
}

export default function SuccessModal({ orderResult, onClose }: SuccessModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const emailInvoiceMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/orders/${orderResult.orderId}/email-invoice`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Invoice Sent",
        description: "Invoice has been sent to your email address.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send invoice. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDownloadInvoice = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch(`/api/orders/${orderResult.orderId}/invoice`);
      
      if (!response.ok) {
        throw new Error('Failed to download invoice');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `NK2IT-Invoice-${orderResult.orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download Started",
        description: "Invoice download has started.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download invoice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
        description: "License key copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50" data-testid="success-modal">
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <CardContent className="p-8 text-center">
            <div className="text-6xl text-green-500 mb-4">
              <CheckCircle className="w-16 h-16 mx-auto" />
            </div>
            
            <h2 className="text-3xl font-bold text-green-700 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-8">
              Your license keys have been generated and sent to your email.
            </p>

            {/* Order Details */}
            <Card className="mb-6 text-left">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Order Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Order ID:</span>
                    <span className="font-mono" data-testid="text-order-id">
                      {orderResult.orderId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transaction ID:</span>
                    <span className="font-mono" data-testid="text-transaction-id">
                      {orderResult.transactionId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span>Credit Card</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-semibold" data-testid="text-order-total">
                      ${orderResult.total.toFixed(2)} AUD
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* License Keys */}
            <Card className="mb-6 text-left">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 text-blue-800">Your License Keys</h3>
                <div className="space-y-4">
                  {orderResult.licenseKeys.map((product, index) => (
                    <div key={index} className="border border-blue-300 rounded-lg p-4">
                      <h4 className="font-medium text-blue-800 mb-3" data-testid={`text-product-${index}`}>
                        {product.productName}
                      </h4>
                      <div className="space-y-2">
                        {product.keys.map((key, keyIndex) => (
                          <div
                            key={keyIndex}
                            className="flex justify-between items-center bg-gray-50 p-2 rounded border"
                            data-testid={`license-key-${index}-${keyIndex}`}
                          >
                            <span className="font-mono text-sm text-blue-700 flex-1 mr-2">
                              {key}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(key)}
                              data-testid={`button-copy-key-${index}-${keyIndex}`}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    These license keys have also been sent to your email address.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="mb-6 text-left">
              <CardContent className="p-6">
                <h4 className="font-medium text-blue-800 mb-3">📋 Next Steps:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Save these license keys in a secure location</li>
                  <li>• Download the Symantec software from the official portal</li>
                  <li>• Use these keys during installation and activation</li>
                  <li>• Contact our support team if you need installation assistance</li>
                </ul>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
              <Button
                onClick={handleDownloadInvoice}
                disabled={isDownloading}
                className="flex-1 bg-nk-orange hover:bg-orange-600 text-white"
                data-testid="button-download-invoice"
              >
                <Download className="w-4 h-4 mr-2" />
                {isDownloading ? 'Downloading...' : 'Download Invoice'}
              </Button>
              
              <Button
                onClick={() => emailInvoiceMutation.mutate()}
                disabled={emailInvoiceMutation.isPending}
                variant="outline"
                className="flex-1"
                data-testid="button-email-invoice"
              >
                <Mail className="w-4 h-4 mr-2" />
                {emailInvoiceMutation.isPending ? 'Sending...' : 'Email Invoice'}
              </Button>
            </div>

            <Button
              onClick={onClose}
              variant="link"
              className="w-full text-nk-orange hover:text-orange-600 font-medium"
              data-testid="button-continue-shopping"
            >
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
