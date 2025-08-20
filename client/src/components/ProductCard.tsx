import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Minus, ShieldCheck, Lock, Check } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useToast } from '@/hooks/use-toast';
import { type Product } from '@shared/schema';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore(state => state.addItem);
  const { toast } = useToast();

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, Math.min(999, quantity + change));
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        description: product.description,
      },
      quantity
    );
    
    toast({
      title: "Added to Cart",
      description: `${product.name} (${quantity} seats) has been added to your cart.`,
    });
  };

  const isComplete = product.id === 'endpoint-complete';
  const features = Array.isArray(product.features) ? product.features : [];
  
  return (
    <Card 
      data-testid={`card-product-${product.id}`}
      className="overflow-hidden shadow-lg border border-gray-200"
    >
      <div className={`p-6 text-white relative ${
        isComplete 
          ? 'bg-gradient-to-r from-green-600 to-emerald-700' 
          : 'bg-gradient-to-r from-blue-600 to-blue-700'
      }`}>
        {isComplete && (
          <Badge 
            className="absolute top-4 right-4 bg-yellow-400 text-yellow-900"
            data-testid="badge-popular"
          >
            POPULAR
          </Badge>
        )}
        
        <div className="flex items-center space-x-3 mb-4">
          <div className="text-3xl">
            {isComplete ? <Lock className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
          </div>
          <div>
            <h3 className="text-xl font-bold" data-testid={`text-product-name-${product.id}`}>
              {product.name.replace('Symantec ', '')}
            </h3>
            <div className={`${isComplete ? 'text-green-200' : 'text-blue-200'}`}>
              {isComplete ? 'Complete Edition' : 'Enterprise Edition'}
            </div>
          </div>
        </div>
        
        <div>
          <div className="text-3xl font-bold" data-testid={`text-price-${product.id}`}>
            ${parseFloat(product.price).toFixed(2)}
          </div>
          <div className={`${isComplete ? 'text-green-200' : 'text-blue-200'}`}>
            per seat/year
          </div>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="mb-6">
          <h4 className="font-semibold mb-3">Key Features:</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            {features.map((feature, index) => (
              <li 
                key={index} 
                className="flex items-center"
                data-testid={`feature-${product.id}-${index}`}
              >
                <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <Label htmlFor={`qty-${product.id}`} className="block text-sm font-medium mb-2">
            Quantity (Seats)
          </Label>
          <div className="flex items-center space-x-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              data-testid={`button-decrease-quantity-${product.id}`}
              onClick={() => handleQuantityChange(-1)}
              className="w-8 h-8 rounded-full"
            >
              <Minus className="w-4 h-4" />
            </Button>
            
            <Input
              id={`qty-${product.id}`}
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(999, parseInt(e.target.value) || 1)))}
              min="1"
              max="999"
              className="w-20 text-center"
              data-testid={`input-quantity-${product.id}`}
            />
            
            <Button
              type="button"
              variant="outline"
              size="icon"
              data-testid={`button-increase-quantity-${product.id}`}
              onClick={() => handleQuantityChange(1)}
              className="w-8 h-8 rounded-full"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Button 
          onClick={handleAddToCart}
          className={`w-full py-3 rounded-lg font-semibold text-white ${
            isComplete 
              ? 'bg-nk-green hover:bg-emerald-600' 
              : 'bg-nk-orange hover:bg-orange-600'
          }`}
          data-testid={`button-add-to-cart-${product.id}`}
        >
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
}
