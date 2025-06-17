
import React, { useState, useEffect } from 'react';
import { apiService, type Product, type Category, type ProductOwner } from '../../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useLocalization } from '@/contexts/LocalizationContext';

export const ProductsTab: React.FC = () => {
  const { t, language } = useLocalization();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productOwners, setProductOwners] = useState<ProductOwner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    description: '',
    retail_price: '',
    wholesale_price: '',
    weight: '',
    visible: true,
    stock_quantity: '',
    reserved: '',
    override_available: false,
    category_id: '',
    product_owner_id: '',
    selling_target: '50',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [productsData, categoriesData, ownersData] = await Promise.all([
        apiService.getProducts(),
        apiService.getCategories(),
        apiService.getProductOwners(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setProductOwners(ownersData);
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('products.loadError'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = {
        p_sku: formData.sku,
        p_name: formData.name,
        p_description: formData.description,
        p_retail_price: parseFloat(formData.retail_price),
        p_wholesale_price: parseFloat(formData.wholesale_price),
        p_weight: parseFloat(formData.weight),
        p_visible: formData.visible,
        p_stock_quantity: parseInt(formData.stock_quantity),
        p_reserved: parseInt(formData.reserved),
        p_override_available: formData.override_available,
        p_category_id: formData.category_id,
        p_product_owner_id: formData.product_owner_id,
        p_selling_target: parseInt(formData.selling_target),
        p_spec_values: [],
      };

      await apiService.createOrUpdateProduct(productData);
      
      toast({
        title: t('common.success'),
        description: editingProduct ? t('products.updateSuccess') : t('products.addSuccess'),
      });
      
      setIsDialogOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('products.saveError'),
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm(t('products.deleteConfirm'))) return;
    
    try {
      await apiService.deleteProduct(productId);
      toast({
        title: t('common.success'),
        description: t('products.deleteSuccess'),
      });
      loadData();
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('products.deleteError'),
        variant: "destructive",
      });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      sku: product.sku,
      name: product.name,
      description: product.description,
      retail_price: product.retail_price.toString(),
      wholesale_price: product.wholesale_price.toString(),
      weight: product.weight.toString(),
      visible: product.visible,
      stock_quantity: product.stock.toString(),
      reserved: product.reserved.toString(),
      override_available: product.override_available,
      category_id: product.category_id,
      product_owner_id: product.product_owner_id,
      selling_target: '50',
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      sku: '',
      name: '',
      description: '',
      retail_price: '',
      wholesale_price: '',
      weight: '',
      visible: true,
      stock_quantity: '',
      reserved: '',
      override_available: false,
      category_id: '',
      product_owner_id: '',
      selling_target: '50',
    });
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.category_id === categoryId);
    return category?.name || t('products.notSpecified');
  };

  const getOwnerName = (ownerId: string) => {
    const owner = productOwners.find(o => o.product_owner_id === ownerId);
    return owner?.name || t('products.notSpecified');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Package className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">{t('products.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${language === 'ar' ? 'text-right' : 'text-left'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className={`flex justify-between items-center ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={language === 'ar' ? 'text-right' : 'text-left'}>
          <h2 className="text-3xl font-bold text-gray-900">{t('products.title')}</h2>
          <p className="text-muted-foreground">{t('products.pageDescription')}</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-primary hover:bg-primary/90">
              <Plus className={`h-4 w-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              {t('products.addNew')}
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle className={language === 'ar' ? 'text-right' : 'text-left'}>
                  {editingProduct ? t('products.edit') : t('products.add')}
                </DialogTitle>
                <DialogDescription className={language === 'ar' ? 'text-right' : 'text-left'}>
                  {t('products.fillRequired')}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sku" className={language === 'ar' ? 'text-right' : 'text-left'}>{t('products.sku')}</Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => setFormData({...formData, sku: e.target.value})}
                      required
                      className={language === 'ar' ? 'text-right' : 'text-left'}
                      dir={language === 'ar' ? 'rtl' : 'ltr'}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name" className={language === 'ar' ? 'text-right' : 'text-left'}>{t('products.name')}</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className={language === 'ar' ? 'text-right' : 'text-left'}
                      dir={language === 'ar' ? 'rtl' : 'ltr'}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description" className={language === 'ar' ? 'text-right' : 'text-left'}>{t('products.description')}</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                    className={language === 'ar' ? 'text-right' : 'text-left'}
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="retail_price" className={language === 'ar' ? 'text-right' : 'text-left'}>{t('products.retailPrice')}</Label>
                    <Input
                      id="retail_price"
                      type="number"
                      step="0.01"
                      value={formData.retail_price}
                      onChange={(e) => setFormData({...formData, retail_price: e.target.value})}
                      required
                      className="text-left"
                      dir="ltr"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="wholesale_price" className={language === 'ar' ? 'text-right' : 'text-left'}>{t('products.wholesalePrice')}</Label>
                    <Input
                      id="wholesale_price"
                      type="number"
                      step="0.01"
                      value={formData.wholesale_price}
                      onChange={(e) => setFormData({...formData, wholesale_price: e.target.value})}
                      required
                      className="text-left"
                      dir="ltr"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="weight" className={language === 'ar' ? 'text-right' : 'text-left'}>{t('products.weight')}</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.01"
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: e.target.value})}
                      required
                      className="text-left"
                      dir="ltr"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stock_quantity" className={language === 'ar' ? 'text-right' : 'text-left'}>{t('products.stockQuantity')}</Label>
                    <Input
                      id="stock_quantity"
                      type="number"
                      value={formData.stock_quantity}
                      onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                      required
                      className="text-left"
                      dir="ltr"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reserved" className={language === 'ar' ? 'text-right' : 'text-left'}>{t('products.reserved')}</Label>
                    <Input
                      id="reserved"
                      type="number"
                      value={formData.reserved}
                      onChange={(e) => setFormData({...formData, reserved: e.target.value})}
                      required
                      className="text-left"
                      dir="ltr"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category_id" className={language === 'ar' ? 'text-right' : 'text-left'}>{t('products.category')}</Label>
                    <Select value={formData.category_id} onValueChange={(value) => setFormData({...formData, category_id: value})}>
                      <SelectTrigger className={language === 'ar' ? 'text-right' : 'text-left'}>
                        <SelectValue placeholder={t('products.selectCategory')} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.category_id} value={category.category_id!}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="product_owner_id" className={language === 'ar' ? 'text-right' : 'text-left'}>{t('products.owner')}</Label>
                    <Select value={formData.product_owner_id} onValueChange={(value) => setFormData({...formData, product_owner_id: value})}>
                      <SelectTrigger className={language === 'ar' ? 'text-right' : 'text-left'}>
                        <SelectValue placeholder={t('products.selectOwner')} />
                      </SelectTrigger>
                      <SelectContent>
                        {productOwners.map((owner) => (
                          <SelectItem key={owner.product_owner_id} value={owner.product_owner_id!}>
                            {owner.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Switch
                    id="visible"
                    checked={formData.visible}
                    onCheckedChange={(checked) => setFormData({...formData, visible: checked})}
                  />
                  <Label htmlFor="visible">{t('products.visible')}</Label>
                </div>
                
                <div className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Switch
                    id="override_available"
                    checked={formData.override_available}
                    onCheckedChange={(checked) => setFormData({...formData, override_available: checked})}
                  />
                  <Label htmlFor="override_available">{t('products.overrideAvailable')}</Label>
                </div>
              </div>
              
              <DialogFooter className={`${language === 'ar' ? 'flex-row-reverse' : 'flex-row'} gap-2`}>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  {editingProduct ? t('common.update') : t('common.add')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className={language === 'ar' ? 'text-right' : 'text-left'}>{t('products.list')}</CardTitle>
          <CardDescription className={language === 'ar' ? 'text-right' : 'text-left'}>
            {t('products.count')}: {products.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={language === 'ar' ? 'text-right' : 'text-left'}>{t('products.sku')}</TableHead>
                  <TableHead className={language === 'ar' ? 'text-right' : 'text-left'}>{t('common.name')}</TableHead>
                  <TableHead className={language === 'ar' ? 'text-right' : 'text-left'}>{t('products.category')}</TableHead>
                  <TableHead className={language === 'ar' ? 'text-right' : 'text-left'}>{t('products.owner')}</TableHead>
                  <TableHead className={language === 'ar' ? 'text-right' : 'text-left'}>{t('products.retailPrice')}</TableHead>
                  <TableHead className={language === 'ar' ? 'text-right' : 'text-left'}>{t('products.stockQuantity')}</TableHead>
                  <TableHead className={language === 'ar' ? 'text-right' : 'text-left'}>{t('products.status')}</TableHead>
                  <TableHead className={language === 'ar' ? 'text-right' : 'text-left'}>{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.product_id}>
                    <TableCell className={`font-mono ${language === 'ar' ? 'text-right' : 'text-left'}`}>{product.sku}</TableCell>
                    <TableCell className={language === 'ar' ? 'text-right' : 'text-left'}>{product.name}</TableCell>
                    <TableCell className={language === 'ar' ? 'text-right' : 'text-left'}>{getCategoryName(product.category_id)}</TableCell>
                    <TableCell className={language === 'ar' ? 'text-right' : 'text-left'}>{getOwnerName(product.product_owner_id)}</TableCell>
                    <TableCell className={language === 'ar' ? 'text-right' : 'text-left'}>{product.retail_price} {t('common.currency')}</TableCell>
                    <TableCell className={language === 'ar' ? 'text-right' : 'text-left'}>{product.stock}</TableCell>
                    <TableCell className={language === 'ar' ? 'text-right' : 'text-left'}>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        product.visible && product.available 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.visible && product.available ? t('products.available') : t('products.unavailable')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className={`flex gap-2 ${language === 'ar' ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(product.product_id!)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
