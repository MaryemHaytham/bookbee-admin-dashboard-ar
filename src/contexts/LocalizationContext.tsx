
import React, { createContext, useContext, useState, useEffect } from 'react';

interface Translations {
  [key: string]: string;
}

interface LocalizationContextType {
  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;
  t: (key: string) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

const translations = {
  ar: {
    // Navigation
    'nav.products': 'المنتجات',
    'nav.categories': 'الفئات',
    'nav.categorySpecs': 'مواصفات الفئات',
    'nav.productOwners': 'أصحاب المنتجات',
    'nav.smartSearch': 'البحث الذكي',
    
    // Smart Search
    'search.title': 'البحث الذكي',
    'search.description': 'ابحث في الطلبات باستخدام معايير متقدمة',
    'search.field': 'الحقل',
    'search.operator': 'المشغل',
    'search.value': 'القيمة',
    'search.addCriteria': 'إضافة معيار',
    'search.search': 'بحث',
    'search.searching': 'جاري البحث...',
    'search.results': 'نتائج البحث',
    'search.noResults': 'لا توجد نتائج',
    'search.selectField': 'اختر الحقل',
    'search.selectOperator': 'اختر المشغل',
    'search.enterValue': 'أدخل القيمة',
    'search.error': 'خطأ في البحث',
    'search.errorDescription': 'حدث خطأ أثناء البحث',
    'search.addCriteriaError': 'يرجى إضافة معايير البحث أولاً',
    'search.success': 'نجح البحث',
    
    // Search Fields
    'field.select': 'حقول الاختيار',
    'field.order': 'ترتيب',
    'field.userId': 'معرف المستخدم',
    'field.orderNumber': 'رقم الطلب',
    'field.orderId': 'معرف الطلب',
    'field.status': 'حالة الطلب',
    
    // Operators
    'operator.equals': 'يساوي',
    'operator.notEquals': 'لا يساوي',
    'operator.contains': 'يحتوي على',
    'operator.containsCI': 'يحتوي على (غير حساس للحالة)',
    
    // Order Details
    'order.number': 'رقم الطلب',
    'order.date': 'التاريخ',
    'order.total': 'الإجمالي',
    'order.status': 'الحالة',
    'order.customer': 'العميل',
    'order.products': 'المنتجات',
    'order.shipments': 'الشحنات',
    'order.payments': 'المدفوعات',
    'order.refunds': 'المرتجعات',
    
    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.back': 'رجوع',
    'common.close': 'إغلاق',
    'common.cancel': 'إلغاء',
    'common.save': 'حفظ',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.add': 'إضافة',
    'common.currency': 'ج.م'
  },
  en: {
    // Navigation
    'nav.products': 'Products',
    'nav.categories': 'Categories',
    'nav.categorySpecs': 'Category Specs',
    'nav.productOwners': 'Product Owners',
    'nav.smartSearch': 'Smart Search',
    
    // Smart Search
    'search.title': 'Smart Search',
    'search.description': 'Search orders using advanced criteria',
    'search.field': 'Field',
    'search.operator': 'Operator',
    'search.value': 'Value',
    'search.addCriteria': 'Add Criteria',
    'search.search': 'Search',
    'search.searching': 'Searching...',
    'search.results': 'Search Results',
    'search.noResults': 'No results found',
    'search.selectField': 'Select Field',
    'search.selectOperator': 'Select Operator',
    'search.enterValue': 'Enter Value',
    'search.error': 'Search Error',
    'search.errorDescription': 'An error occurred while searching',
    'search.addCriteriaError': 'Please add search criteria first',
    'search.success': 'Search Successful',
    
    // Search Fields
    'field.select': 'Select Fields',
    'field.order': 'Order',
    'field.userId': 'User ID',
    'field.orderNumber': 'Order Number',
    'field.orderId': 'Order ID',
    'field.status': 'Status',
    
    // Operators
    'operator.equals': 'Equals',
    'operator.notEquals': 'Not Equals',
    'operator.contains': 'Contains',
    'operator.containsCI': 'Contains (Case Insensitive)',
    
    // Order Details
    'order.number': 'Order Number',
    'order.date': 'Date',
    'order.total': 'Total',
    'order.status': 'Status',
    'order.customer': 'Customer',
    'order.products': 'Products',
    'order.shipments': 'Shipments',
    'order.payments': 'Payments',
    'order.refunds': 'Refunds',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.back': 'Back',
    'common.close': 'Close',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.currency': 'EGP'
  }
};

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'ar' | 'en' | null;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within LocalizationProvider');
  }
  return context;
};
