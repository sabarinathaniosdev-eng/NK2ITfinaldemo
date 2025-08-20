import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, Mail } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderResult: {
    orderId: string;
    transactionId: string;
    licenseKeys: Array<{
      productName: string;
      keys: string[];
    }>;
    total: string;
  } | null;
}

export default function SuccessModal({ isOpen, onClose, orderResult }: SuccessModalProps) {
  const handleDownloadInvoice = () => {
    if (orderResult?.orderId) {
      window.open(`/api/orders/${orderResult.orderId}/invoice`, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" data-testid="success-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl text-green-600">
            <CheckCircle className="h-8 w-8" />
            Payment Successful!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Details */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-4">Order Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Order ID:</p>
                <p className="font-mono" data-testid="order-id">{orderResult?.orderId}</p>
              </div>
              <div>
                <p className="text-gray-600">Transaction ID:</p>
                <p className="font-mono" data-testid="transaction-id">{orderResult?.transactionId}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Amount:</p>
                <p className="font-semibold text-lg" data-testid="total-amount">${orderResult?.total} AUD</p>
              </div>
            </div>
          </div>

          {/* License Keys */}
          {orderResult?.licenseKeys && orderResult.licenseKeys.length > 0 && (
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="font-semibold text-lg mb-4 text-green-800">Your License Keys</h3>
              <div className="space-y-4">
                {orderResult.licenseKeys.map((product, index) => (
                  <div key={index} className="bg-white p-4 rounded border">
                    <h4 className="font-medium mb-2" data-testid={`product-${index}`}>{product.productName}</h4>
                    <div className="space-y-1">
                      {product.keys.map((key, keyIndex) => (
                        <div key={keyIndex} className="font-mono text-sm bg-gray-100 p-2 rounded" 
                             data-testid={`license-key-${index}-${keyIndex}`}>
                          {key}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Important Notice */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Email Confirmation</h4>
                <p className="text-blue-800 text-sm">
                  A confirmation email with your license keys has been sent to your email address. 
                  Please check your inbox and save the keys securely.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleDownloadInvoice}
              className="flex items-center gap-2"
              data-testid="download-invoice-btn"
            >
              <Download className="h-4 w-4" />
              Download Invoice
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              data-testid="close-modal-btn"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}