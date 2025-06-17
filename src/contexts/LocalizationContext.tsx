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
    'nav.mainMenu': 'القائمة الرئيسية',
    'nav.logout': 'تسجيل الخروج',
    
    // Products Page
    'products.title': 'إدارة المنتجات',
    'products.pageDescription': 'إضافة وتعديل وحذف المنتجات',
    'products.addNew': 'إضافة منتج جديد',
    'products.list': 'قائمة المنتجات',
    'products.count': 'عدد المنتجات',
    'products.edit': 'تعديل المنتج',
    'products.add': 'إضافة منتج جديد',
    'products.fillRequired': 'املأ جميع البيانات المطلوبة للمنتج',
    'products.sku': 'رمز المنتج (SKU)',
    'products.name': 'اسم المنتج',
    'products.description': 'وصف المنتج',
    'products.retailPrice': 'سعر التجزئة',
    'products.wholesalePrice': 'سعر الجملة',
    'products.weight': 'الوزن (كجم)',
    'products.stockQuantity': 'الكمية المتاحة',
    'products.reserved': 'الكمية المحجوزة',
    'products.category': 'الفئة',
    'products.owner': 'مالك المنتج',
    'products.visible': 'منتج مرئي',
    'products.overrideAvailable': 'تجاوز حالة التوفر',
    'products.status': 'الحالة',
    'products.available': 'متاح',
    'products.unavailable': 'غير متاح',
    'products.actions': 'الإجراءات',
    'products.deleteConfirm': 'هل أنت متأكد من حذف هذا المنتج؟',
    'products.addSuccess': 'تم إضافة المنتج بنجاح',
    'products.updateSuccess': 'تم تحديث المنتج بنجاح',
    'products.deleteSuccess': 'تم حذف المنتج بنجاح',
    'products.loadError': 'فشل في تحميل البيانات',
    'products.saveError': 'فشل في حفظ المنتج',
    'products.deleteError': 'فشل في حذف المنتج',
    'products.loading': 'جاري تحميل المنتجات...',
    'products.selectCategory': 'اختر الفئة',
    'products.selectOwner': 'اختر المالك',
    'products.notSpecified': 'غير محدد',
    
    // Categories Page
    'categories.title': 'إدارة الفئات',
    'categories.pageDescription': 'إضافة وتعديل وحذف فئات المنتجات',
    'categories.addNew': 'إضافة فئة جديدة',
    'categories.list': 'قائمة الفئات',
    'categories.count': 'عدد الفئات',
    'categories.edit': 'تعديل الفئة',
    'categories.add': 'إضافة فئة جديدة',
    'categories.fillRequired': 'املأ جميع البيانات المطلوبة للفئة',
    'categories.name': 'اسم الفئة',
    'categories.description': 'وصف الفئة',
    'categories.actions': 'الإجراءات',
    'categories.deleteConfirm': 'هل أنت متأكد من حذف هذه الفئة؟',
    'categories.addSuccess': 'تم إضافة الفئة بنجاح',
    'categories.updateSuccess': 'تم تحديث الفئة بنجاح',
    'categories.deleteSuccess': 'تم حذف الفئة بنجاح',
    'categories.loadError': 'فشل في تحميل الفئات',
    'categories.saveError': 'فشل في حفظ الفئة',
    'categories.deleteError': 'فشل في حذف الفئة',
    'categories.loading': 'جاري تحميل الفئات...',
    
    // Category Specs Page
    'categorySpecs.title': 'مواصفات الفئات',
    'categorySpecs.pageDescription': 'إدارة مواصفات كل فئة من المنتجات',
    'categorySpecs.addNew': 'إضافة مواصفة جديدة',
    'categorySpecs.list': 'قائمة المواصفات',
    'categorySpecs.count': 'عدد المواصفات',
    'categorySpecs.edit': 'تعديل المواصفة',
    'categorySpecs.add': 'إضافة مواصفة جديدة',
    'categorySpecs.fillRequired': 'املأ جميع البيانات المطلوبة للمواصفة',
    'categorySpecs.name': 'اسم المواصفة',
    'categorySpecs.type': 'نوع المواصفة',
    'categorySpecs.category': 'الفئة',
    'categorySpecs.actions': 'الإجراءات',
    'categorySpecs.deleteConfirm': 'هل أنت متأكد من حذف هذه المواصفة؟',
    'categorySpecs.addSuccess': 'تم إضافة المواصفة بنجاح',
    'categorySpecs.updateSuccess': 'تم تحديث المواصفة بنجاح',
    'categorySpecs.deleteSuccess': 'تم حذف المواصفة بنجاح',
    'categorySpecs.loadError': 'فشل في تحميل المواصفات',
    'categorySpecs.saveError': 'فشل في حفظ المواصفة',
    'categorySpecs.deleteError': 'فشل في حذف المواصفة',
    'categorySpecs.loading': 'جاري تحميل المواصفات...',
    'categorySpecs.selectCategory': 'اختر الفئة',
    
    // Product Owners Page
    'productOwners.title': 'أصحاب المنتجات',
    'productOwners.pageDescription': 'إدارة أصحاب المنتجات والموردين',
    'productOwners.addNew': 'إضافة مالك جديد',
    'productOwners.list': 'قائمة أصحاب المنتجات',
    'productOwners.count': 'عدد أصحاب المنتجات',
    'productOwners.edit': 'تعديل المالك',
    'productOwners.add': 'إضافة مالك جديد',
    'productOwners.fillRequired': 'املأ جميع البيانات المطلوبة للمالك',
    'productOwners.name': 'اسم المالك',
    'productOwners.email': 'البريد الإلكتروني',
    'productOwners.phone': 'رقم الهاتف',
    'productOwners.address': 'العنوان',
    'productOwners.actions': 'الإجراءات',
    'productOwners.deleteConfirm': 'هل أنت متأكد من حذف هذا المالك؟',
    'productOwners.addSuccess': 'تم إضافة المالك بنجاح',
    'productOwners.updateSuccess': 'تم تحديث المالك بنجاح',
    'productOwners.deleteSuccess': 'تم حذف المالك بنجاح',
    'productOwners.loadError': 'فشل في تحميل أصحاب المنتجات',
    'productOwners.saveError': 'فشل في حفظ المالك',
    'productOwners.deleteError': 'فشل في حذف المالك',
    'productOwners.loading': 'جاري تحميل أصحاب المنتجات...',
    
    // Smart Search
    'search.title': 'البحث الذكي',
    'search.pageDescription': 'ابحث في الطلبات باستخدام معايير متقدمة',
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
    'common.actions': 'الإجراءات',
    'common.name': 'الاسم',
    'common.description': 'الوصف',
    'common.type': 'النوع',
    'common.email': 'البريد الإلكتروني',
    'common.phone': 'رقم الهاتف',
    'common.address': 'العنوان'
  },
  en: {
    // Navigation
    'nav.products': 'Products',
    'nav.categories': 'Categories',
    'nav.categorySpecs': 'Category Specs',
    'nav.productOwners': 'Product Owners',
    'nav.smartSearch': 'Smart Search',
    'nav.mainMenu': 'Main Menu',
    'nav.logout': 'Logout',
    
    // Products Page
    'products.title': 'Product Management',
    'products.pageDescription': 'Add, edit and delete products',
    'products.addNew': 'Add New Product',
    'products.list': 'Products List',
    'products.count': 'Products Count',
    'products.edit': 'Edit Product',
    'products.add': 'Add New Product',
    'products.fillRequired': 'Fill all required product data',
    'products.sku': 'Product SKU',
    'products.name': 'Product Name',
    'products.description': 'Product Description',
    'products.retailPrice': 'Retail Price',
    'products.wholesalePrice': 'Wholesale Price',
    'products.weight': 'Weight (kg)',
    'products.stockQuantity': 'Stock Quantity',
    'products.reserved': 'Reserved Quantity',
    'products.category': 'Category',
    'products.owner': 'Product Owner',
    'products.visible': 'Product Visible',
    'products.overrideAvailable': 'Override Available',
    'products.status': 'Status',
    'products.available': 'Available',
    'products.unavailable': 'Unavailable',
    'products.actions': 'Actions',
    'products.deleteConfirm': 'Are you sure you want to delete this product?',
    'products.addSuccess': 'Product added successfully',
    'products.updateSuccess': 'Product updated successfully',
    'products.deleteSuccess': 'Product deleted successfully',
    'products.loadError': 'Failed to load data',
    'products.saveError': 'Failed to save product',
    'products.deleteError': 'Failed to delete product',
    'products.loading': 'Loading products...',
    'products.selectCategory': 'Select Category',
    'products.selectOwner': 'Select Owner',
    'products.notSpecified': 'Not Specified',
    
    // Categories Page
    'categories.title': 'Category Management',
    'categories.pageDescription': 'Add, edit and delete product categories',
    'categories.addNew': 'Add New Category',
    'categories.list': 'Categories List',
    'categories.count': 'Categories Count',
    'categories.edit': 'Edit Category',
    'categories.add': 'Add New Category',
    'categories.fillRequired': 'Fill all required category data',
    'categories.name': 'Category Name',
    'categories.description': 'Category Description',
    'categories.actions': 'Actions',
    'categories.deleteConfirm': 'Are you sure you want to delete this category?',
    'categories.addSuccess': 'Category added successfully',
    'categories.updateSuccess': 'Category updated successfully',
    'categories.deleteSuccess': 'Category deleted successfully',
    'categories.loadError': 'Failed to load categories',
    'categories.saveError': 'Failed to save category',
    'categories.deleteError': 'Failed to delete category',
    'categories.loading': 'Loading categories...',
    
    // Category Specs Page
    'categorySpecs.title': 'Category Specifications',
    'categorySpecs.pageDescription': 'Manage specifications for each product category',
    'categorySpecs.addNew': 'Add New Specification',
    'categorySpecs.list': 'Specifications List',
    'categorySpecs.count': 'Specifications Count',
    'categorySpecs.edit': 'Edit Specification',
    'categorySpecs.add': 'Add New Specification',
    'categorySpecs.fillRequired': 'Fill all required specification data',
    'categorySpecs.name': 'Specification Name',
    'categorySpecs.type': 'Specification Type',
    'categorySpecs.category': 'Category',
    'categorySpecs.actions': 'Actions',
    'categorySpecs.deleteConfirm': 'Are you sure you want to delete this specification?',
    'categorySpecs.addSuccess': 'Specification added successfully',
    'categorySpecs.updateSuccess': 'Specification updated successfully',
    'categorySpecs.deleteSuccess': 'Specification deleted successfully',
    'categorySpecs.loadError': 'Failed to load specifications',
    'categorySpecs.saveError': 'Failed to save specification',
    'categorySpecs.deleteError': 'Failed to delete specification',
    'categorySpecs.loading': 'Loading specifications...',
    'categorySpecs.selectCategory': 'Select Category',
    
    // Product Owners Page
    'productOwners.title': 'Product Owners',
    'productOwners.pageDescription': 'Manage product owners and suppliers',
    'productOwners.addNew': 'Add New Owner',
    'productOwners.list': 'Product Owners List',
    'productOwners.count': 'Product Owners Count',
    'productOwners.edit': 'Edit Owner',
    'productOwners.add': 'Add New Owner',
    'productOwners.fillRequired': 'Fill all required owner data',
    'productOwners.name': 'Owner Name',
    'productOwners.email': 'Email',
    'productOwners.phone': 'Phone Number',
    'productOwners.address': 'Address',
    'productOwners.actions': 'Actions',
    'productOwners.deleteConfirm': 'Are you sure you want to delete this owner?',
    'productOwners.addSuccess': 'Owner added successfully',
    'productOwners.updateSuccess': 'Owner updated successfully',
    'productOwners.deleteSuccess': 'Owner deleted successfully',
    'productOwners.loadError': 'Failed to load product owners',
    'productOwners.saveError': 'Failed to save owner',
    'productOwners.deleteError': 'Failed to delete owner',
    'productOwners.loading': 'Loading product owners...',
    
    // Smart Search
    'search.title': 'Smart Search',
    'search.pageDescription': 'Search orders using advanced criteria',
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
    'common.actions': 'Actions',
    'common.name': 'Name',
    'common.description': 'Description',
    'common.type': 'Type',
    'common.email': 'Email',
    'common.phone': 'Phone',
    'common.address': 'Address'
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
    const isRTL = language === 'ar';
    
    // Set document direction and language
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
    
    // Add/remove RTL class for styling
    if (isRTL) {
      document.documentElement.classList.add('rtl');
      document.body.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
      document.body.classList.remove('rtl');
    }
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
