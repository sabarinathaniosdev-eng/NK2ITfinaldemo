import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Check, CreditCard, Lock, AlertTriangle } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import SuccessModal from './SuccessModal';

interface CheckoutProps {
  onClose: () => void;
  onSuccess: () => void;
}

// Form schemas
const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

const addressSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  company: z.string().optional(),
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postcode: z.string().min(4, 'Valid postcode required'),
  phone: z.string().optional(),
});

const paymentSchema = z.object({
  cardNumber: z.string().min(1, 'Card number is required'),
  expiryDate: z.string().min(1, 'Expiry date is required'),
  cvv: z.string().min(3, 'CVV is required'),
  cardholderName: z.string().min(1, 'Cardholder name is required'),
});

export default function Checkout({ onClose, onSuccess }: CheckoutProps) {
  const [step, setStep] = useState(1);
  const [checkoutData, setCheckoutData] = useState<any>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderResult, setOrderResult] = useState<any>(null);
  const { items, getSubtotal, getGST, getTotal, clearCart } = useCartStore();
  const { toast } = useToast();

  // Form instances
  const emailForm = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const otpForm = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  const addressForm = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      company: '',
      street: '',
      city: '',
      state: '',
      postcode: '',
      phone: '',
    },
  });

  const paymentForm = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: '',
    },
  });

  // Mutations
  const sendOtpMutation = useMutation({
    mutationFn: async (data: { email: string }) => {
      const response = await apiRequest('POST', '/api/auth/send-otp', data);
      return response.json();
    },
    onSuccess: (data) => {
      setCheckoutData((prev: any) => ({ ...prev, email: emailForm.getValues().email }));
      setStep(1.5); // Show OTP step
      toast({
        title: "Verification Code Sent",
        description: `Check your email for the 6-digit code${data.demoOtp ? ` (Demo: ${data.demoOtp})` : ''}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send verification code",
        variant: "destructive",
      });
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async (data: { email: string; code: string }) => {
      const response = await apiRequest('POST', '/api/auth/verify-otp', data);
      return response.json();
    },
    onSuccess: () => {
      setStep(2);
      toast({
        title: "Email Verified",
        description: "Email verification successful!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid verification code",
        variant: "destructive",
      });
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/checkout', data);
      return response.json();
    },
    onSuccess: (data) => {
      setOrderResult(data);
      setShowSuccess(true);
      clearCart();
      toast({
        title: "Payment Successful!",
        description: "Your license keys have been generated and sent to your email.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Payment Failed",
        description: error.message || "Payment processing failed",
        variant: "destructive",
      });
    },
  });

  const handleEmailSubmit = (data: { email: string }) => {
    sendOtpMutation.mutate(data);
  };

  const handleOtpSubmit = (data: { otp: string }) => {
    verifyOtpMutation.mutate({
      email: checkoutData.email,
      code: data.otp,
    });
  };

  const handleAddressSubmit = (data: any) => {
    setCheckoutData((prev: any) => ({ ...prev, billing: data }));
    setStep(3);
  };

  const handlePaymentSubmit = (data: any) => {
    const orderData = {
      email: checkoutData.email,
      billing: checkoutData.billing,
      payment: data,
      items: items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    };

    checkoutMutation.mutate(orderData);
  };

  const getStepClass = (stepNumber: number) => {
    if (stepNumber < step || (stepNumber === 1 && step === 1.5)) {
      return 'w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-2';
    } else if (stepNumber === step) {
      return 'w-8 h-8 bg-nk-orange text-white rounded-full flex items-center justify-center text-sm font-semibold mr-2';
    } else {
      return 'w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold mr-2';
    }
  };

  const getStepTextClass = (stepNumber: number) => {
    if (stepNumber < step || (stepNumber === 1 && step === 1.5)) {
      return 'text-sm font-medium text-green-600';
    } else if (stepNumber === step) {
      return 'text-sm font-medium';
    } else {
      return 'text-sm text-gray-600';
    }
  };

  if (showSuccess) {
    return (
      <SuccessModal
        orderResult={orderResult}
        onClose={() => {
          setShowSuccess(false);
          onSuccess();
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50" data-testid="checkout-modal">
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <CardHeader className="border-b border-gray-200">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold">Checkout</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                data-testid="button-close-checkout"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Progress Steps */}
            <div className="flex items-center space-x-4 mt-6">
              <div className="flex items-center">
                <div className={getStepClass(1)}>
                  {step > 1 ? <Check className="w-4 h-4" /> : '1'}
                </div>
                <span className={getStepTextClass(1)}>Email</span>
              </div>
              <div className="flex-1 h-px bg-gray-200"></div>
              <div className="flex items-center">
                <div className={getStepClass(2)}>
                  {step > 2 ? <Check className="w-4 h-4" /> : '2'}
                </div>
                <span className={getStepTextClass(2)}>Address</span>
              </div>
              <div className="flex-1 h-px bg-gray-200"></div>
              <div className="flex items-center">
                <div className={getStepClass(3)}>3</div>
                <span className={getStepTextClass(3)}>Payment</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Step 1: Email Verification */}
            {step === 1 && (
              <div data-testid="checkout-step-email">
                <h3 className="text-xl font-semibold mb-4">Email Verification</h3>
                <p className="text-gray-600 mb-6">
                  We'll send your license keys to this email address. Please verify it's correct.
                </p>
                
                <Form {...emailForm}>
                  <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
                    <FormField
                      control={emailForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="your@email.com"
                              data-testid="input-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button
                      type="submit"
                      className="w-full bg-nk-orange hover:bg-orange-600 text-white"
                      disabled={sendOtpMutation.isPending}
                      data-testid="button-send-otp"
                    >
                      {sendOtpMutation.isPending ? 'Sending...' : 'Send Verification Code'}
                    </Button>
                  </form>
                </Form>
              </div>
            )}

            {/* Step 1.5: OTP Verification */}
            {step === 1.5 && (
              <div data-testid="checkout-step-otp">
                <h3 className="text-xl font-semibold mb-4">Enter Verification Code</h3>
                <p className="text-gray-600 mb-4">
                  We've sent a 6-digit code to {checkoutData.email}
                </p>
                
                <Form {...otpForm}>
                  <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)} className="space-y-4">
                    <FormField
                      control={otpForm.control}
                      name="otp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Verification Code</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="123456"
                              maxLength={6}
                              className="text-center text-lg tracking-widest"
                              data-testid="input-otp"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button
                      type="submit"
                      className="w-full bg-nk-green hover:bg-emerald-600 text-white"
                      disabled={verifyOtpMutation.isPending}
                      data-testid="button-verify-otp"
                    >
                      {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify & Continue'}
                    </Button>
                    
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => sendOtpMutation.mutate({ email: checkoutData.email })}
                      className="w-full text-nk-orange"
                      data-testid="button-resend-otp"
                    >
                      Resend Code
                    </Button>
                  </form>
                </Form>
              </div>
            )}

            {/* Step 2: Address Details */}
            {step === 2 && (
              <div data-testid="checkout-step-address">
                <h3 className="text-xl font-semibold mb-4">Billing Address</h3>
                <p className="text-gray-600 mb-6">
                  Please provide your billing address for invoice generation.
                </p>
                
                <Form {...addressForm}>
                  <form onSubmit={addressForm.handleSubmit(handleAddressSubmit)} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={addressForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name *</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-first-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={addressForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name *</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-last-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={addressForm.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-company" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={addressForm.control}
                      name="street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address *</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-street" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={addressForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City *</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-city" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={addressForm.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-state">
                                  <SelectValue placeholder="Select State" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="NSW">New South Wales</SelectItem>
                                <SelectItem value="VIC">Victoria</SelectItem>
                                <SelectItem value="QLD">Queensland</SelectItem>
                                <SelectItem value="WA">Western Australia</SelectItem>
                                <SelectItem value="SA">South Australia</SelectItem>
                                <SelectItem value="TAS">Tasmania</SelectItem>
                                <SelectItem value="ACT">Australian Capital Territory</SelectItem>
                                <SelectItem value="NT">Northern Territory</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={addressForm.control}
                        name="postcode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postcode *</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-postcode" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={addressForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input {...field} type="tel" data-testid="input-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-nk-orange hover:bg-orange-600 text-white"
                      data-testid="button-continue-to-payment"
                    >
                      Continue to Payment
                    </Button>
                  </form>
                </Form>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div data-testid="checkout-step-payment">
                <h3 className="text-xl font-semibold mb-4">Payment</h3>
                
                {/* Order Summary */}
                <Card className="mb-6">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-3">Order Summary</h4>
                    <div className="space-y-2 text-sm">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <span>{item.name} × {item.quantity}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between">
                        <span>GST (10%)</span>
                        <span>${getGST().toFixed(2)}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between font-semibold">
                        <span>Total (inc. GST)</span>
                        <span data-testid="text-final-total">${getTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Form */}
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Lock className="w-5 h-5 text-green-600 mr-3" />
                      <div>
                        <h4 className="font-semibold">Secure Payment via BPOINT</h4>
                        <p className="text-sm text-gray-600">Your payment is processed securely</p>
                      </div>
                    </div>

                    {/* Demo Mode Banner */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                        <div>
                          <div className="font-medium text-yellow-800">Demo Mode Active</div>
                          <div className="text-sm text-yellow-700">
                            Use test card: 4111 1111 1111 1111, CVV: 123, Any future date
                          </div>
                        </div>
                      </div>
                    </div>

                    <Form {...paymentForm}>
                      <form onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)} className="space-y-4">
                        <FormField
                          control={paymentForm.control}
                          name="cardNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Card Number</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="1234 5678 9012 3456"
                                  data-testid="input-card-number"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={paymentForm.control}
                            name="expiryDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Expiry Date</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="MM/YY"
                                    data-testid="input-expiry-date"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={paymentForm.control}
                            name="cvv"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CVV</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="123"
                                    data-testid="input-cvv"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={paymentForm.control}
                          name="cardholderName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cardholder Name</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  data-testid="input-cardholder-name"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="w-full bg-nk-green hover:bg-emerald-600 text-white"
                          disabled={checkoutMutation.isPending}
                          data-testid="button-complete-purchase"
                        >
                          {checkoutMutation.isPending ? (
                            'Processing Payment...'
                          ) : (
                            <>
                              <CreditCard className="w-4 h-4 mr-2" />
                              Complete Purchase
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
