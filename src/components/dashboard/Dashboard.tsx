
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from '../layout/AppSidebar';
import { ProductsTab } from './ProductsTab';
import { CategoriesTab } from './CategoriesTab';
import { CategorySpecsTab } from './CategorySpecsTab';
import { ProductOwnersTab } from './ProductOwnersTab';
import { SmartSearchTab } from './SmartSearchTab';
import { useLocalization } from '@/contexts/LocalizationContext';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('products');
  const { language } = useLocalization();

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return <ProductsTab />;
      case 'categories':
        return <CategoriesTab />;
      case 'category-specs':
        return <CategorySpecsTab />;
      case 'product-owners':
        return <ProductOwnersTab />;
      case 'smart-search':
        return <SmartSearchTab />;
      default:
        return <ProductsTab />;
    }
  };

  return (
    <SidebarProvider>
      <div className={`min-h-screen flex w-full bg-gray-50/30 ${language === 'ar' ? 'rtl' : 'ltr'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <main className={`flex-1 p-3 md:p-6 ${language === 'ar' ? 'order-1' : 'order-2'}`}>
          <div className="mb-4 md:mb-6">
            <SidebarTrigger className="mb-4" />
          </div>
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
        <div className={language === 'ar' ? 'order-2' : 'order-1'}>
          <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>
    </SidebarProvider>
  );
};
