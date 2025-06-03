
import React from 'react';
import { SmartSearch } from '../search/SmartSearch';

export const SmartSearchTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-right">البحث الذكي</h1>
        <p className="text-muted-foreground text-right mt-2">
          ابحث في الطلبات باستخدام معايير متقدمة
        </p>
      </div>
      <SmartSearch />
    </div>
  );
};
