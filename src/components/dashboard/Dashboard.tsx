
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from '../layout/AppSidebar';
import { ProductsTab } from './ProductsTab';
import { CategoriesTab } from './CategoriesTab';
import { CategorySpecsTab } from './CategorySpecsTab';
import { ProductOwnersTab } from './ProductOwnersTab';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('products');

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
      default:
        return <ProductsTab />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50/30">
        <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <SidebarTrigger className="mb-4" />
          </div>
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
