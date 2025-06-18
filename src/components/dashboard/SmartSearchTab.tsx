
import React from 'react';
import { SmartSearch } from '../search/SmartSearch';
import { useLocalization } from '@/contexts/LocalizationContext';

export const SmartSearchTab: React.FC = () => {
  const { t } = useLocalization();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-right">{t('search.title')}</h1>
      </div>
      <SmartSearch />
    </div>
  );
};
