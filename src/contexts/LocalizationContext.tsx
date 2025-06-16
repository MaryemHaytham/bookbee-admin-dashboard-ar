
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
    
    // Products Page
    'products.title': 'إدارة المنتجات',
    'products.description': 'إضافة وتعديل وحذف المنتجات',
    'products.addNew': 'إضافة منتج جديد',
    'products.list': 'قائمة المنتجات',
    'products.count': 'عدد المنتجات',
    'products.name': 'اسم المنتج',
    'products.sku': 'رمز المنتج',
    'products.category': 'الفئة',
    'products.price': 'السعر',
    'products.owner': 'المالك',
    'products.actions': 'الإجراءات',
    'products.edit': 'تعديل المنتج',
    'products.add': 'إضافة منتج جديد',
    'products.enterName': 'أدخل اسم المنتج',
    'products.enterSku': 'أدخل رمز المنتج',
    'products.selectCategory': 'اختر الفئة',
    'products.enterPrice': 'أدخل السعر',
    'products.selectOwner': 'اختر المالك',
    
    // Categories Page
    'categories.title': 'إدارة الفئات',
    'categories.description': 'إضافة وتعديل وحذف فئات المنتجات',
    'categories.addNew': 'إضافة فئة جديدة',
    'categories.list': 'قائمة الفئات',
    'categories.count': 'عدد الفئات',
    'categories.name': 'اسم الفئة',
    'categories.createdAt': 'تاريخ الإنشاء',
    'categories.actions': 'الإجراءات',
    'categories.edit': 'تعديل الفئة',
    'categories.add': 'إضافة فئة جديدة',
    'categories.enterName': 'أدخل اسم الفئة',
    'categories.placeholder': 'مثال: إلكترونيات',
    
    // Category Specs Page
    'categorySpecs.title': 'إدارة مواصفات الفئات',
    'categorySpecs.description': 'إضافة وتعديل وحذف مواصفات الفئات',
    'categorySpecs.addNew': 'إضافة مواصفة جديدة',
    'categorySpecs.list': 'قائمة المواصفات',
    'categorySpecs.count': 'عدد المواصفات',
    'categorySpecs.name': 'اسم المواصفة',
    'categorySpecs.category': 'الفئة',
    'categorySpecs.type': 'النوع',
    'categorySpecs.createdAt': 'تاريخ الإنشاء',
    'categorySpecs.actions': 'الإجراءات',
    'categorySpecs.edit': 'تعديل المواصفة',
    'categorySpecs.add': 'إضافة مواصفة جديدة',
    'categorySpecs.enterName': 'أدخل اسم المواصفة',
    'categorySpecs.selectCategory': 'اختر الفئة',
    'categorySpecs.selectType': 'اختر النوع',
    
    // Product Owners Page
    'productOwners.title': 'إدارة أصحاب المنتجات',
    'productOwners.description': 'إضافة وتعديل وحذف أصحاب المنتجات',
    'productOwners.addNew': 'إضافة مالك جديد',
    'productOwners.list': 'قائمة أصحاب المنتجات',
    'productOwners.count': 'عدد المالكين',
    'productOwners.name': 'اسم المالك',
    'productOwners.createdAt': 'تاريخ الإنشاء',
    'productOwners.actions': 'الإجراءات',
    'productOwners.edit': 'تعديل مالك المنتج',
    'productOwners.add': 'إضافة مالك جديد',
    'productOwners.enterName': 'أدخل اسم المالك',
    'productOwners.placeholder': 'مثال: خالد صقر',
    
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
    'common.update': 'تحديث',
    'common.currency': 'ج.م',
    'common.notSpecified': 'غير محدد',
    'common.confirmDelete': 'هل أنت متأكد من الحذف؟',
    'common.createSuccess': 'تم الإنشاء بنجاح',
    'common.updateSuccess': 'تم التحديث بنجاح',
    'common.deleteSuccess': 'تم الحذف بنجاح',
    'common.createError': 'فشل في الإنشاء',
    'common.updateError': 'فشل في التحديث',
    'common.deleteError': 'فشل في الحذف',
    'common.loadError': 'فشل في التحميل',
    'common.nameRequired': 'يرجى إدخال الاسم'
  },
  en: {
    // Navigation
    'nav.products': 'Products',
    'nav.categories': 'Categories',
    'nav.categorySpecs': 'Category Specs',
    'nav.productOwners': 'Product Owners',
    'nav.smartSearch': 'Smart Search',
    
    // Products Page
    'products.title': 'Product Management',
    'products.description': 'Add, edit and delete products',
    'products.addNew': 'Add New Product',
    'products.list': 'Product List',
    'products.count': 'Product Count',
    'products.name': 'Product Name',
    'products.sku': 'SKU',
    'products.category': 'Category',
    'products.price': 'Price',
    'products.owner': 'Owner',
    'products.actions': 'Actions',
    'products.edit': 'Edit Product',
    'products.add': 'Add New Product',
    'products.enterName': 'Enter product name',
    'products.enterSku': 'Enter SKU',
    'products.selectCategory': 'Select category',
    'products.enterPrice': 'Enter price',
    'products.selectOwner': 'Select owner',
    
    // Categories Page
    'categories.title': 'Category Management',
    'categories.description': 'Add, edit and delete product categories',
    'categories.addNew': 'Add New Category',
    'categories.list': 'Category List',
    'categories.count': 'Category Count',
    'categories.name': 'Category Name',
    'categories.createdAt': 'Created At',
    'categories.actions': 'Actions',
    'categories.edit': 'Edit Category',
    'categories.add': 'Add New Category',
    'categories.enterName': 'Enter category name',
    'categories.placeholder': 'e.g. Electronics',
    
    // Category Specs Page
    'categorySpecs.title': 'Category Specifications Management',
    'categorySpecs.description': 'Add, edit and delete category specifications',
    'categorySpecs.addNew': 'Add New Specification',
    'categorySpecs.list': 'Specifications List',
    'categorySpecs.count': 'Specifications Count',
    'categorySpecs.name': 'Specification Name',
    'categorySpecs.category': 'Category',
    'categorySpecs.type': 'Type',
    'categorySpecs.createdAt': 'Created At',
    'categorySpecs.actions': 'Actions',
    'categorySpecs.edit': 'Edit Specification',
    'categorySpecs.add': 'Add New Specification',
    'categorySpecs.enterName': 'Enter specification name',
    'categorySpecs.selectCategory': 'Select category',
    'categorySpecs.selectType': 'Select type',
    
    // Product Owners Page
    'productOwners.title': 'Product Owners Management',
    'productOwners.description': 'Add, edit and delete product owners',
    'productOwners.addNew': 'Add New Owner',
    'productOwners.list': 'Product Owners List',
    'productOwners.count': 'Owners Count',
    'productOwners.name': 'Owner Name',
    'productOwners.createdAt': 'Created At',
    'productOwners.actions': 'Actions',
    'productOwners.edit': 'Edit Product Owner',
    'productOwners.add': 'Add New Owner',
    'productOwners.enterName': 'Enter owner name',
    'productOwners.placeholder': 'e.g. John Doe',
    
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
    'common.update': 'Update',
    'common.currency': 'EGP',
    'common.notSpecified': 'Not Specified',
    'common.confirmDelete': 'Are you sure you want to delete?',
    'common.createSuccess': 'Created successfully',
    'common.updateSuccess': 'Updated successfully',
    'common.deleteSuccess': 'Deleted successfully',
    'common.createError': 'Failed to create',
    'common.updateError': 'Failed to update',
    'common.deleteError': 'Failed to delete',
    'common.loadError': 'Failed to load',
    'common.nameRequired': 'Please enter a name'
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
