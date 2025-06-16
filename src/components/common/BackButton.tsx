
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLocalization } from '@/contexts/LocalizationContext';

interface BackButtonProps {
  onClick?: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  const { t, language } = useLocalization();

  const handleBack = () => {
    if (onClick) {
      onClick();
    } else {
      window.history.back();
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleBack}
      className="flex items-center gap-2"
    >
      {language === 'ar' ? (
        <ArrowRight className="h-4 w-4" />
      ) : (
        <ArrowLeft className="h-4 w-4" />
      )}
      {t('common.back')}
    </Button>
  );
};
