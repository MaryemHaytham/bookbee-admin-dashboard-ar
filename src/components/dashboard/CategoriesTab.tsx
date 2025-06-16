
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

export const CategoriesTab: React.FC = () => {
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
        title: "خطأ",
        description: "فشل في تحميل الفئات",
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
        title: "خطأ",
        description: "يرجى إدخال اسم الفئة",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingCategory) {
        await apiService.updateCategory(editingCategory.name, categoryName);
        toast({
          title: "نجح",
          description: "تم تحديث الفئة بنجاح",
        });
      } else {
        await apiService.createCategory(categoryName);
        toast({
          title: "نجح",
          description: "تم إضافة الفئة بنجاح",
        });
      }
      
      setIsDialogOpen(false);
      setCategoryName('');
      setEditingCategory(null);
      loadCategories();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في حفظ الفئة",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (categoryName: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الفئة؟')) return;
    
    try {
      await apiService.deleteCategory(categoryName);
      toast({
        title: "نجح",
        description: "تم حذف الفئة بنجاح",
      });
      loadCategories();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في حذف الفئة",
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
          <p className="text-muted-foreground">جاري تحميل الفئات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">إدارة الفئات</h2>
          <p className="text-muted-foreground">إضافة وتعديل وحذف فئات المنتجات</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              إضافة فئة جديدة
            </Button>
          </DialogTrigger>
          
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? 'تعديل الفئة' : 'إضافة فئة جديدة'}
                </DialogTitle>
                <DialogDescription>
                  أدخل اسم الفئة الجديدة
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryName">اسم الفئة</Label>
                  <Input
                    id="categoryName"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="مثال: إلكترونيات"
                    required
                    className="text-right"
                    dir="rtl"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  {editingCategory ? 'تحديث' : 'إضافة'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة الفئات</CardTitle>
          <CardDescription>
            عدد الفئات: {categories.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">اسم الفئة</TableHead>
                <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.category_id}>
                  <TableCell className="text-right font-medium">{category.name}</TableCell>
                  <TableCell className="text-right">
                    {category.created_at ? new Date(category.created_at).toLocaleDateString('ar-EG') : 'غير محدد'}
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
