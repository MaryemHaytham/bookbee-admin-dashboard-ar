
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const { t, language } = useLocalization();

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
        description: t('common.loadError'),
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
        description: t('common.nameRequired'),
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingCategory) {
        await apiService.updateCategory(editingCategory.name, categoryName);
        toast({
          title: t('common.success'),
          description: t('common.updateSuccess'),
        });
      } else {
        await apiService.createCategory(categoryName);
        toast({
          title: t('common.success'),
          description: t('common.createSuccess'),
        });
      }
      
      setIsDialogOpen(false);
      setCategoryName('');
      setEditingCategory(null);
      loadCategories();
    } catch (error) {
      toast({
        title: t('common.error'),
        description: editingCategory ? t('common.updateError') : t('common.createError'),
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (categoryName: string) => {
    if (!confirm(t('common.confirmDelete'))) return;
    
    try {
      await apiService.deleteCategory(categoryName);
      toast({
        title: t('common.success'),
        description: t('common.deleteSuccess'),
      });
      loadCategories();
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('common.deleteError'),
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
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className={language === 'ar' ? 'text-right' : 'text-left'}>
          <h2 className="text-3xl font-bold text-gray-900">{t('categories.title')}</h2>
          <p className="text-muted-foreground">{t('categories.description')}</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              {t('categories.addNew')}
            </Button>
          </DialogTrigger>
          
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? t('categories.edit') : t('categories.add')}
                </DialogTitle>
                <DialogDescription>
                  {t('categories.enterName')}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryName">{t('categories.name')}</Label>
                  <Input
                    id="categoryName"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder={t('categories.placeholder')}
                    required
                    className={language === 'ar' ? 'text-right' : 'text-left'}
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>
              </div>
              
              <DialogFooter>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={language === 'ar' ? 'text-right' : 'text-left'}>{t('categories.name')}</TableHead>
                <TableHead className={language === 'ar' ? 'text-right' : 'text-left'}>{t('categories.createdAt')}</TableHead>
                <TableHead className={language === 'ar' ? 'text-right' : 'text-left'}>{t('categories.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.category_id}>
                  <TableCell className={`${language === 'ar' ? 'text-right' : 'text-left'} font-medium`}>{category.name}</TableCell>
                  <TableCell className={language === 'ar' ? 'text-right' : 'text-left'}>
                    {category.created_at ? new Date(category.created_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US') : t('common.notSpecified')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
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
        </CardContent>
      </Card>
    </div>
  );
};
