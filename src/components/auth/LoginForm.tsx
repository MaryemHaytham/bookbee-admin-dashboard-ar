
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Loader2, BookOpen } from 'lucide-react';

interface LoginFormProps {
  onToggleMode: () => void;
  isSignupMode: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode, isSignupMode }) => {
  const { login, signup, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isSignupMode) {
        await signup(formData.email, formData.password, formData.fullName, formData.phone);
        toast({
          title: "تم إنشاء الحساب بنجاح",
          description: "يمكنك الآن تسجيل الدخول",
        });
        onToggleMode();
      } else {
        await login(formData.email, formData.password);
        toast({
          title: "مرحباً بك في BookBee",
          description: "تم تسجيل الدخول بنجاح",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary p-3 rounded-full">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {isSignupMode ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
          </CardTitle>
          <CardDescription className="text-primary font-semibold">
            BookBee Admin Dashboard
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {isSignupMode && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName">الاسم الكامل</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="أدخل اسمك الكامل"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="text-right"
                    dir="rtl"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف (اختياري)</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+20 1XX XXX XXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    className="text-right"
                    dir="rtl"
                  />
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@bookbee.net"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="أدخل كلمة المرور"
                value={formData.password}
                onChange={handleChange}
                required
                className="text-right"
                dir="rtl"
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isSignupMode ? 'جاري إنشاء الحساب...' : 'جاري تسجيل الدخول...'}
                </>
              ) : (
                isSignupMode ? 'إنشاء حساب' : 'تسجيل الدخول'
              )}
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              onClick={onToggleMode}
              className="w-full text-primary hover:text-primary/80"
            >
              {isSignupMode 
                ? 'لديك حساب بالفعل؟ سجل الدخول' 
                : 'ليس لديك حساب؟ أنشئ حساباً جديداً'
              }
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
