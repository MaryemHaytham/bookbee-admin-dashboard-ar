import React, { useState, useEffect } from 'react';
import { apiService, type CategorySpec, type Category } from '../../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Settings } from 'lucide-react';
import { useLocalization } from '@/contexts/LocalizationContext';

export const CategorySpecsTab: React.FC = () => {
  const { t, language } = useLocalization();
  const [categorySpecs, setCategorySpecs] = useState<CategorySpec[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSpec, setEditingSpec] = useState<CategorySpec | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [specsData, categoriesData] = await Promise.all([
        apiService.getCategorySpecs(),
        apiService.getCategories(),
      ]);
      setCategorySpecs(specsData);
      setCategories(categoriesData);
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('categorySpecs.loadError'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.category_id) {
      toast({
        title: t('common.error'),
        description: t('categorySpecs.fillRequired'),
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingSpec) {
        await apiService.updateCategorySpec(editingSpec.name, formData.name);
        toast({
          title: t('common.success'),
          description: t('categorySpecs.updateSuccess'),
        });
      } else {
        await apiService.createCategorySpec(formData.category_id, formData.name);
        toast({
          title: t('common.success'),
          description: t('categorySpecs.addSuccess'),
        });
      }

      setIsDialogOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('categorySpecs.saveError'),
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (specName: string) => {
    if (!confirm(t('categorySpecs.deleteConfirm'))) return;

    try {
      await apiService.deleteCategorySpec(specName);
      toast({
        title: t('common.success'),
        description: t('categorySpecs.deleteSuccess'),
      });
      loadData();
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('categorySpecs.deleteError'),
        variant: "destructive",
      });
    }
  };

  const handleEdit = (spec: CategorySpec) => {
    setEditingSpec(spec);
    setFormData({
      name: spec.name,
      category_id: spec.category_id,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingSpec(null);
    setFormData({
      name: '',
      category_id: '',
    });
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.category_id === categoryId);
    return category?.name || t('products.notSpecified');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Settings className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">{t('categorySpecs.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{t('categorySpecs.title')}</h2>
          <p className="text-muted-foreground">{t('categorySpecs.pageDescription')}</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              {t('categorySpecs.addNew')}
            </Button>
          </DialogTrigger>

          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingSpec ? t('categorySpecs.edit') : t('categorySpecs.addNew')}
                </DialogTitle>
                <DialogDescription>
                  {t('categorySpecs.fillRequired')}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="category_id">{t('categorySpecs.category')}</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                    disabled={!!editingSpec}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('categorySpecs.selectCategory')} />
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
                  <Label htmlFor="specName">{t('categorySpecs.name')}</Label>
                  <Input
                    id="specName"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t('categorySpecs.name')}
                    required
                    className={language === 'ar' ? 'text-right' : ''}
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  {editingSpec ? t('common.update') : t('common.add')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('categorySpecs.list')}</CardTitle>
          <CardDescription>
            {t('categorySpecs.count')}: {categorySpecs.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={language === 'ar' ? 'text-right' : ''}>{t('categorySpecs.name')}</TableHead>
                <TableHead className={language === 'ar' ? 'text-right' : ''}>{t('categorySpecs.category')}</TableHead>
                <TableHead className={language === 'ar' ? 'text-right' : ''}>{t('categorySpecs.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categorySpecs.map((spec) => (
                <TableRow key={spec.category_spec_id}>
                  <TableCell className={language === 'ar' ? 'text-right font-medium' : 'font-medium'}>{spec.name}</TableCell>
                  <TableCell className={language === 'ar' ? 'text-right' : ''}>{getCategoryName(spec.category_id)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(spec)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(spec.name)}
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
        </CardContent>
      </Card>
    </div>
  );
};
