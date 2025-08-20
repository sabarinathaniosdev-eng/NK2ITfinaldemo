import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import Checkout from './Checkout';
import { useState } from 'react';

interface CartProps {
  onTabChange: (tab: string) => void;
}

export default function Cart({ onTabChange }: CartProps) {
  const [showCheckout, setShowCheckout] = useState(false);
  const { items, updateQuantity, removeItem, getTotalItems, getSubtotal, getGST, getTotal } = useCartStore();

  if (showCheckout) {
    return (
      <Checkout 
        onClose={() => setShowCheckout(false)}
        onSuccess={() => {
          setShowCheckout(false);
          onTabChange('home');
        }}
      />
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16" data-testid="empty-cart">
        <div className="text-6xl text-gray-300 mb-4">
          <ShoppingBag className="w-16 h-16 mx-auto" />
        </div>
        <h2 className="text-2xl font-bold text-gray-400 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some security solutions to get started</p>
        <Button 
          data-testid="button-browse-products"
          onClick={() => onTabChange('products')}
          className="bg-nk-orange hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <div data-testid="cart-with-items">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Cart Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div 
                  key={item.id}
                  data-testid={`cart-item-${item.id}`}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium" data-testid={`text-item-name-${item.id}`}>
                      {item.name}
                    </h4>
                    <p className="text-sm text-gray-600" data-testid={`text-item-description-${item.id}`}>
                      {item.description}
                    </p>
                    <div className="text-lg font-semibold text-nk-orange mt-1">
                      ${item.price.toFixed(2)} per seat
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        data-testid={`button-decrease-${item.id}`}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      
                      <span 
                        className="w-12 text-center font-semibold"
                        data-testid={`text-quantity-${item.id}`}
                      >
                        {item.quantity}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        data-testid={`button-increase-${item.id}`}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div 
                      className="text-lg font-semibold w-20 text-right"
                      data-testid={`text-item-total-${item.id}`}
                    >
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      data-testid={`button-remove-${item.id}`}
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span data-testid="text-subtotal">${getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (10%)</span>
                  <span data-testid="text-gst">${getGST().toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span data-testid="text-total">${getTotal().toFixed(2)}</span>
                </div>
              </div>

              <Button 
                data-testid="button-checkout"
                onClick={() => setShowCheckout(true)}
                className="w-full bg-nk-orange hover:bg-orange-600 text-white py-3 rounded-lg font-semibold"
              >
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
