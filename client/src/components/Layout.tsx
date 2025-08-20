import { useState } from 'react';
import { Link } from 'wouter';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface LayoutProps {
  children: React.ReactNode;
  currentTab?: string;
  onTabChange?: (tab: string) => void;
}

const NK2ITLogo = () => (
  <div className="flex items-center space-x-3">
    <div className="flex items-center space-x-1">
      <div className="flex flex-col space-y-1">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-nk-orange rounded-full"></div>
          <div className="w-3 h-3 bg-nk-orange rounded-full"></div>
        </div>
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-nk-orange rounded-full"></div>
          <div className="w-2 h-2 bg-nk-orange rounded-full"></div>
        </div>
      </div>
      <div className="ml-2">
        <div className="text-2xl font-bold text-nk-green">NK2IT</div>
        <div className="text-xs text-gray-500 -mt-1">"At Your Service..."</div>
      </div>
    </div>
  </div>
);

const TabButton = ({ 
  tab, 
  label, 
  isActive, 
  onClick,
  showCart = false,
  cartCount = 0 
}: {
  tab: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
  showCart?: boolean;
  cartCount?: number;
}) => (
  <button
    data-testid={`tab-${tab}`}
    onClick={onClick}
    className={`relative py-4 px-1 font-medium transition-colors ${
      isActive
        ? 'text-nk-orange border-b-2 border-nk-orange'
        : 'text-gray-500 hover:text-nk-orange hover:border-b-2 hover:border-nk-orange'
    }`}
  >
    {label}
    {showCart && cartCount > 0 && (
      <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {cartCount}
      </span>
    )}
  </button>
);

export default function Layout({ children, currentTab = 'home', onTabChange }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const totalItems = useCartStore(state => state.getTotalItems());

  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Products' },
    { id: 'support', label: 'Support' },
    { id: 'cart', label: 'Cart', showCart: true },
  ];

  const handleTabClick = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Company Logo */}
            <Link href="/" data-testid="logo-link">
              <NK2ITLogo />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {tabs.map(tab => (
                <TabButton
                  key={tab.id}
                  tab={tab.id}
                  label={tab.label}
                  isActive={currentTab === tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  showCart={tab.showCart}
                  cartCount={totalItems}
                />
              ))}
            </nav>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" data-testid="mobile-menu-trigger">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col space-y-4 mt-8">
                    {tabs.map(tab => (
                      <button
                        key={tab.id}
                        data-testid={`mobile-tab-${tab.id}`}
                        onClick={() => handleTabClick(tab.id)}
                        className={`flex items-center justify-between p-4 rounded-lg text-left transition-colors ${
                          currentTab === tab.id
                            ? 'bg-nk-orange text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span className="font-medium">{tab.label}</span>
                        {tab.showCart && totalItems > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {totalItems}
                          </span>
                        )}
                      </button>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
