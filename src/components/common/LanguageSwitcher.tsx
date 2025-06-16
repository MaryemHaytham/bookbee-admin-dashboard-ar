
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLocalization();

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2"
    >
      <Globe className="h-4 w-4" />
      {language === 'ar' ? 'English' : 'العربية'}
    </Button>
  );
};
