import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import Support from "@/pages/Support";
import Cart from "@/components/Cart";

function App() {
  const [currentTab, setCurrentTab] = useState('home');

  const renderTabContent = () => {
    switch (currentTab) {
      case 'home':
        return <Home onTabChange={setCurrentTab} />;
      case 'products':
        return <Products />;
      case 'support':
        return <Support />;
      case 'cart':
        return <Cart onTabChange={setCurrentTab} />;
      default:
        return <Home onTabChange={setCurrentTab} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Layout currentTab={currentTab} onTabChange={setCurrentTab}>
          {renderTabContent()}
        </Layout>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
