
import React, { useState } from 'react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { useLocalization } from '../contexts/LocalizationContext';
import { LoginForm } from '../components/auth/LoginForm';
import { Dashboard } from '../components/dashboard/Dashboard';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { t } = useLocalization();
  const [isSignupMode, setIsSignupMode] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <LoginForm 
        onToggleMode={() => setIsSignupMode(!isSignupMode)}
        isSignupMode={isSignupMode}
      />
    );
  }

  return <Dashboard />;
};

const Index = () => {
  return (
    <AuthProvider>
      <div className="font-arabic">
        <AppContent />
      </div>
    </AuthProvider>
  );
};

export default Index;
