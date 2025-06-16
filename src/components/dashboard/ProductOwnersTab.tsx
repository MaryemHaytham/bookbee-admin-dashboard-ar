
import React, { useState, useEffect } from 'react';
import { apiService, type ProductOwner } from '../../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Users } from 'lucide-react';

export const ProductOwnersTab: React.FC = () => {
  const [productOwners, setProductOwners] = useState<ProductOwner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOwner, setEditingOwner] = useState<ProductOwner | null>(null);
  const [ownerName, setOwnerName] = useState('');

  useEffect(() => {
    loadProductOwners();
  }, []);

  const loadProductOwners = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getProductOwners();
      setProductOwners(data);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تحميل مالكي المنتجات",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ownerName.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم المالك",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingOwner) {
        await apiService.updateProductOwner(editingOwner.name, ownerName);
        toast({
          title: "نجح",
          description: "تم تحديث مالك المنتج بنجاح",
        });
      } else {
        await apiService.createProductOwner(ownerName);
        toast({
          title: "نجح",
          description: "تم إضافة مالك المنتج بنجاح",
        });
      }
      
      setIsDialogOpen(false);
      setOwnerName('');
      setEditingOwner(null);
      loadProductOwners();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في حفظ مالك المنتج",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (ownerName: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المالك؟')) return;
    
    try {
      await apiService.deleteProductOwner(ownerName);
      toast({
        title: "نجح",
        description: "تم حذف مالك المنتج بنجاح",
      });
      loadProductOwners();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في حذف مالك المنتج",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (owner: ProductOwner) => {
    setEditingOwner(owner);
    setOwnerName(owner.name);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingOwner(null);
    setOwnerName('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Users className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">جاري تحميل مالكي المنتجات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">إدارة مالكي المنتجات</h2>
          <p className="text-muted-foreground">إضافة وتعديل وحذف مالكي المنتجات</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              إضافة مالك جديد
            </Button>
          </DialogTrigger>
          
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingOwner ? 'تعديل مالك المنتج' : 'إضافة مالك جديد'}
                </DialogTitle>
                <DialogDescription>
                  أدخل اسم مالك المنتج
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="ownerName">اسم المالك</Label>
                  <Input
                    id="ownerName"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="مثال: خالد صقر"
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
                  {editingOwner ? 'تحديث' : 'إضافة'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة مالكي المنتجات</CardTitle>
          <CardDescription>
            عدد المالكين: {productOwners.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">اسم المالك</TableHead>
                <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productOwners.map((owner) => (
                <TableRow key={owner.product_owner_id}>
                  <TableCell className="text-right font-medium">{owner.name}</TableCell>
                  <TableCell className="text-right">
                    {owner.created_at ? new Date(owner.created_at).toLocaleDateString('ar-EG') : 'غير محدد'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(owner)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(owner.name)}
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
