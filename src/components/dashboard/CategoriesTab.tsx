import React, { useState, useEffect } from 'react';
import { apiService, type Category } from '../../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import { useLocalization } from '@/contexts/LocalizationContext';

export const CategoriesTab: React.FC = () => {
  const { t, language } = useLocalization();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getCategories();
      setCategories(data);
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('categories.loadError'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryName.trim()) {
      toast({
        title: t('common.error'),
        description: t('categories.fillRequired'),
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingCategory) {
        await apiService.updateCategory(editingCategory.name, categoryName);
        toast({
          title: t('common.success'),
          description: t('categories.updateSuccess'),
        });
      } else {
        await apiService.createCategory(categoryName);
        toast({
          title: t('common.success'),
          description: t('categories.addSuccess'),
        });
      }
      
      setIsDialogOpen(false);
      setCategoryName('');
      setEditingCategory(null);
      loadCategories();
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('categories.saveError'),
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (categoryName: string) => {
    if (!confirm(t('categories.deleteConfirm'))) return;
    
    try {
      await apiService.deleteCategory(categoryName);
      toast({
        title: t('common.success'),
        description: t('categories.deleteSuccess'),
      });
      loadCategories();
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('categories.deleteError'),
        variant: "destructive",
      });
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingCategory(null);
    setCategoryName('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Tag className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">{t('categories.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${language === 'ar' ? 'text-right' : 'text-left'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className={`flex justify-between items-center ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={language === 'ar' ? 'text-right' : 'text-left'}>
          <h2 className="text-3xl font-bold text-gray-900">{t('categories.title')}</h2>
          <p className="text-muted-foreground">{t('categories.pageDescription')}</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-primary hover:bg-primary/90">
              <Plus className={`h-4 w-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              {t('categories.addNew')}
            </Button>
          </DialogTrigger>
          
          <DialogContent dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle className={language === 'ar' ? 'text-right' : 'text-left'}>
                  {editingCategory ? t('categories.edit') : t('categories.add')}
                </DialogTitle>
                <DialogDescription className={language === 'ar' ? 'text-right' : 'text-left'}>
                  {t('categories.fillRequired')}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryName" className={language === 'ar' ? 'text-right' : 'text-left'}>{t('categories.name')}</Label>
                  <Input
                    id="categoryName"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    required
                    className={language === 'ar' ? 'text-right' : 'text-left'}
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>
              </div>
              
              <DialogFooter className={`${language === 'ar' ? 'flex-row-reverse' : 'flex-row'} gap-2`}>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  {editingCategory ? t('common.update') : t('common.add')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className={language === 'ar' ? 'text-right' : 'text-left'}>{t('categories.list')}</CardTitle>
          <CardDescription className={language === 'ar' ? 'text-right' : 'text-left'}>
            {t('categories.count')}: {categories.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={language === 'ar' ? 'text-right' : 'text-left'}>{t('categories.name')}</TableHead>
                  <TableHead className={language === 'ar' ? 'text-right' : 'text-left'}>{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.category_id}>
                    <TableCell className={`font-medium ${language === 'ar' ? 'text-right' : 'text-left'}`}>{category.name}</TableCell>
                    <TableCell>
                      <div className={`flex gap-2 ${language === 'ar' ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(category.name)}
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
