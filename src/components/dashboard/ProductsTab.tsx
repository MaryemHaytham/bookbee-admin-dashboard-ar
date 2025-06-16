import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocalization } from '@/contexts/LocalizationContext';

interface Product {
  product_id: string;
  name: string;
  sku: string;
  retail_price: number;
  category_id: string;
  product_owner_id: string;
}

interface Category {
  category_id: string;
  name: string;
}

interface ProductOwner {
  product_owner_id: string;
  name: string;
}

export const ProductsTab: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productOwners, setProductOwners] = useState<ProductOwner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    retail_price: '',
    category_id: '',
    product_owner_id: ''
  });
  const { toast } = useToast();
  const { t, language } = useLocalization();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [productsResponse, categoriesResponse, productOwnersResponse] = await Promise.all([
        fetch('https://mydaqvcbapralulxsotd.supabase.co/rest/v1/products?select=*', {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15ZGFxdmNiYXByYWx1bHhzb3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2ODI4NzQsImV4cCI6MjA2MzI1ODg3NH0.dek6v0xRoWPRDql9O9vO41HBBBMnxTPsVUI54X8M-lc',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15ZGFxdmNiYXByYWx1bHhzb3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2ODI4NzQsImV4cCI6MjA2MzI1ODg3NH0.dek6v0xRoWPRDql9O9vO41HBBBMnxTPsVUI54X8M-lc'
          }
        }),
        fetch('https://mydaqvcbapralulxsotd.supabase.co/rest/v1/categories?select=*', {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15ZGFxdmNiYXByYWx1bHhzb3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2ODI4NzQsImV4cCI6MjA2MzI1ODg3NH0.dek6v0xRoWPRDql9O9vO41HBBBMnxTPsVUI54X8M-lc',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15ZGFxdmNiYXByYWx1bHhzb3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2ODI4NzQsImV4cCI6MjA2MzI1ODg3NH0.dek6v0xRoWPRDql9O9vO41HBBBMnxTPsVUI54X8M-lc'
          }
        }),
        fetch('https://mydaqvcbapralulxsotd.supabase.co/rest/v1/product_owners?select=*', {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15ZGFxdmNiYXByYWx1bHhzb3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2ODI4NzQsImV4cCI6MjA2MzI1ODg3NH0.dek6v0xRoWPRDql9O9vO41HBBBMnxTPsVUI54X8M-lc',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15ZGFxdmNiYXByYWx1bHhzb3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2ODI4NzQsImV4cCI6MjA2MzI1ODg3NH0.dek6v0xRoWPRDql9O9vO41HBBBMnxTPsVUI54X8M-lc'
          }
        })
      ]);

      if (!productsResponse.ok || !categoriesResponse.ok || !productOwnersResponse.ok) {
        throw new Error('Failed to load data');
      }

      const productsData = await productsResponse.json();
      const categoriesData = await categoriesResponse.json();
      const productOwnersData = await productOwnersResponse.json();

      setProducts(productsData);
      setCategories(categoriesData);
      setProductOwners(productOwnersData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: t('common.error'),
        description: t('common.loadError'),
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.sku || !formData.retail_price || !formData.category_id || !formData.product_owner_id) {
      toast({
        title: t('common.error'),
        description: t('common.nameRequired'),
        variant: 'destructive'
      });
      return;
    }

    const productData = {
      name: formData.name,
      sku: formData.sku,
      retail_price: parseFloat(formData.retail_price),
      category_id: formData.category_id,
      product_owner_id: formData.product_owner_id
    };

    try {
      setIsLoading(true);
      let response;
      if (editingProduct) {
        // Update existing product
        response = await fetch(`https://mydaqvcbapralulxsotd.supabase.co/rest/v1/products?product_id=eq.${editingProduct.product_id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15ZGFxdmNiYXByYWx1bHhzb3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2ODI4NzQsImV4cCI6MjA2MzI1ODg3NH0.dek6v0xRoWPRDql9O9vO41HBBBMnxTPsVUI54X8M-lc',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15ZGFxdmNiYXByYWx1bHhzb3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2ODI4NzQsImV4cCI6MjA2MzI1ODg3NH0.dek6v0xRoWPRDql9O9vO41HBBBMnxTPsVUI54X8M-lc',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(productData)
        });
      } else {
        // Create new product
        response = await fetch('https://mydaqvcbapralulxsotd.supabase.co/rest/v1/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15ZGFxdmNiYXByYWx1bHhzb3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2ODI4NzQsImV4cCI6MjA2MzI1ODg3NH0.dek6v0xRoWPRDql9O9vO41HBBBMnxTPsVUI54X8M-lc',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15ZGFxdmNiYXByYWx1bHhzb3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2ODI4NzQsImV4cCI6MjA2MzI1ODg3NH0.dek6v0xRoWPRDql9O9vO41HBBBMnxTPsVUI54X8M-lc',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(productData)
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save product');
      }

      const responseData = await response.json();
      console.log('Response Data:', responseData);

      loadData();
      setIsDialogOpen(false);
      setFormData({ name: '', sku: '', retail_price: '', category_id: '', product_owner_id: '' });
      setEditingProduct(null);
      toast({
        title: t('common.success'),
        description: t(editingProduct ? 'common.updateSuccess' : 'common.createSuccess'),
      });
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: t('common.error'),
        description: t(editingProduct ? 'common.updateError' : 'common.createError'),
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      retail_price: product.retail_price.toString(),
      category_id: product.category_id,
      product_owner_id: product.product_owner_id
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm(t('common.confirmDelete'))) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`https://mydaqvcbapralulxsotd.supabase.co/rest/v1/products?product_id=eq.${productId}`, {
        method: 'DELETE',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15ZGFxdmNiYXByYWx1bHhzb3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2ODI4NzQsImV4cCI6MjA2MzI1ODg3NH0.dek6v0xRoWPRDql9O9vO41HBBBMnxTPsVUI54X8M-lc',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15ZGFxdmNiYXByYWx1bHhzb3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2ODI4NzQsImV4cCI6MjA2MzI1ODg3NH0.dek6v0xRoWPRDql9O9vO41HBBBMnxTPsVUI54X8M-lc'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      loadData();
      toast({
        title: t('common.success'),
        description: t('common.deleteSuccess'),
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: t('common.error'),
        description: t('common.deleteError'),
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div>
        <h1 className={`text-3xl font-bold ${language === 'ar' ? 'text-right' : 'text-left'}`}>
          {t('products.title')}
        </h1>
        <p className={`text-muted-foreground mt-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
          {t('products.description')}
        </p>
      </div>

      <div className={`flex ${language === 'ar' ? 'justify-start' : 'justify-end'}`}>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingProduct(null)}>
              <Plus className="h-4 w-4 mr-2" />
              {t('products.addNew')}
            </Button>
          </DialogTrigger>
          <DialogContent dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <DialogHeader>
              <DialogTitle className={language === 'ar' ? 'text-right' : 'text-left'}>
                {editingProduct ? t('products.edit') : t('products.add')}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`text-sm font-medium ${language === 'ar' ? 'text-right' : 'text-left'} block mb-1`}>
                  {t('products.name')}
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t('products.enterName')}
                  required
                  className={language === 'ar' ? 'text-right' : 'text-left'}
                />
              </div>
              <div>
                <label className={`text-sm font-medium ${language === 'ar' ? 'text-right' : 'text-left'} block mb-1`}>
                  {t('products.sku')}
                </label>
                <Input
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder={t('products.enterSku')}
                  required
                  className={language === 'ar' ? 'text-right' : 'text-left'}
                />
              </div>
              <div>
                <label className={`text-sm font-medium ${language === 'ar' ? 'text-right' : 'text-left'} block mb-1`}>
                  {t('products.category')}
                </label>
                <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('products.selectCategory')} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.category_id} value={category.category_id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className={`text-sm font-medium ${language === 'ar' ? 'text-right' : 'text-left'} block mb-1`}>
                  {t('products.price')}
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.retail_price}
                  onChange={(e) => setFormData({ ...formData, retail_price: e.target.value })}
                  placeholder={t('products.enterPrice')}
                  required
                  className={language === 'ar' ? 'text-right' : 'text-left'}
                />
              </div>
              <div>
                <label className={`text-sm font-medium ${language === 'ar' ? 'text-right' : 'text-left'} block mb-1`}>
                  {t('products.owner')}
                </label>
                <Select value={formData.product_owner_id} onValueChange={(value) => setFormData({ ...formData, product_owner_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('products.selectOwner')} />
                  </SelectTrigger>
                  <SelectContent>
                    {productOwners.map((owner) => (
                      <SelectItem key={owner.product_owner_id} value={owner.product_owner_id}>
                        {owner.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className={`flex gap-2 ${language === 'ar' ? 'justify-start' : 'justify-end'}`}>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit">
                  {editingProduct ? t('common.update') : t('common.save')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
            <Package className="h-5 w-5" />
            {t('products.list')} ({products.length} {t('products.count')})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">{t('common.loading')}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={language === 'ar' ? 'text-right' : 'text-left'}>{t('products.name')}</TableHead>
                  <TableHead className={language === 'ar' ? 'text-right' : 'text-left'}>{t('products.sku')}</TableHead>
                  <TableHead className={language === 'ar' ? 'text-right' : 'text-left'}>{t('products.category')}</TableHead>
                  <TableHead className={language === 'ar' ? 'text-right' : 'text-left'}>{t('products.price')}</TableHead>
                  <TableHead className={language === 'ar' ? 'text-right' : 'text-left'}>{t('products.owner')}</TableHead>
                  <TableHead className={language === 'ar' ? 'text-right' : 'text-left'}>{t('products.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.product_id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {categories.find(c => c.category_id === product.category_id)?.name || t('common.notSpecified')}
                      </Badge>
                    </TableCell>
                    <TableCell>{product.retail_price} {t('common.currency')}</TableCell>
                    <TableCell>
                      {productOwners.find(o => o.product_owner_id === product.product_owner_id)?.name || t('common.notSpecified')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(product.product_id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
