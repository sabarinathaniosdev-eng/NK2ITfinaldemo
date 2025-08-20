import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Copy, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function InvoiceDownload() {
  const [formData, setFormData] = useState({
    id: '',
    email: '',
    licenseKey: '',
    amountCents: ''
  });
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleDownloadInvoice = async () => {
    if (!formData.id || !formData.email || !formData.licenseKey || !formData.amountCents) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to download your invoice.",
        variant: "destructive"
      });
      return;
    }

    setIsDownloading(true);
    
    try {
      const params = new URLSearchParams({
        id: formData.id,
        email: formData.email,
        licenseKey: formData.licenseKey,
        amountCents: formData.amountCents
      });

      const response = await fetch(`/api/invoice?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to generate invoice');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `NK2IT-Invoice-${formData.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Invoice Downloaded",
        description: "Your invoice has been downloaded successfully."
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download invoice. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyLicenseKey = async () => {
    if (!formData.licenseKey) {
      toast({
        title: "No License Key",
        description: "Please enter a license key to copy.",
        variant: "destructive"
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(formData.licenseKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: "Copied",
        description: "License key copied to clipboard."
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy license key to clipboard.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-nk-orange mb-2">
              Invoice Download
            </CardTitle>
            <p className="text-gray-600">
              Download your NK2IT invoice and access your license key
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="invoice-id">Invoice ID</Label>
                <Input
                  id="invoice-id"
                  placeholder="e.g., NK2IT-1755677..."
                  value={formData.id}
                  onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
                  data-testid="input-invoice-id"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  data-testid="input-email"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="license-key">License Key</Label>
              <div className="flex gap-2">
                <Input
                  id="license-key"
                  placeholder="Your license key"
                  value={formData.licenseKey}
                  onChange={(e) => setFormData(prev => ({ ...prev, licenseKey: e.target.value }))}
                  className="font-mono"
                  data-testid="input-license-key"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleCopyLicenseKey}
                  className="shrink-0"
                  data-testid="button-copy-license"
                >
                  {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="amount">Amount (in cents)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="e.g., 9999 for $99.99"
                value={formData.amountCents}
                onChange={(e) => setFormData(prev => ({ ...prev, amountCents: e.target.value }))}
                data-testid="input-amount"
              />
              {formData.amountCents && (
                <p className="text-sm text-gray-600 mt-1">
                  Amount: ${(parseInt(formData.amountCents) / 100).toFixed(2)} + GST = ${((parseInt(formData.amountCents) * 1.1) / 100).toFixed(2)} AUD
                </p>
              )}
            </div>

            {/* Download Button */}
            <Button
              onClick={handleDownloadInvoice}
              disabled={isDownloading}
              className="w-full bg-nk-orange hover:bg-orange-600 text-white py-3 text-lg"
              data-testid="button-download-invoice"
            >
              <Download className="mr-2 h-5 w-5" />
              {isDownloading ? 'Generating Invoice...' : 'Download Invoice PDF'}
            </Button>

            {/* Demo Data Helper */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Sample Data for Testing:</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Invoice ID:</strong> NK2IT-1755677000000-SAMPLE</p>
                <p><strong>Email:</strong> demo@nk2it.com.au</p>
                <p><strong>License Key:</strong> SEP-DEMO-1234-5678-ABCD</p>
                <p><strong>Amount:</strong> 9999 (for $99.99)</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => setFormData({
                  id: 'NK2IT-1755677000000-SAMPLE',
                  email: 'demo@nk2it.com.au',
                  licenseKey: 'SEP-DEMO-1234-5678-ABCD',
                  amountCents: '9999'
                })}
                data-testid="button-fill-demo"
              >
                Fill Demo Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}